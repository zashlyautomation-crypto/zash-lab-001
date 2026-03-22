import { useEffect, useRef } from 'react';
import './LaserFlow.css';

const VERT_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAG_SHADER = `
  precision highp float;

  uniform float u_time;
  uniform vec2  u_resolution;
  uniform vec2  u_mouse;

  uniform float u_horizontalSizing;
  uniform float u_verticalSizing;
  uniform float u_wispDensity;
  uniform float u_wispSpeed;
  uniform float u_wispIntensity;
  uniform float u_flowSpeed;
  uniform float u_flowStrength;
  uniform float u_fogIntensity;
  uniform float u_fogScale;
  uniform float u_fogFallSpeed;
  uniform float u_decay;
  uniform float u_falloffStart;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g  = step(x0.yzx, x0.xyz);
    vec3 l  = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns   = n_ * D.wyz - D.xzx;

    vec4 j  = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x  = x_ *ns.x + ns.yyyy;
    vec4 y  = y_ *ns.x + ns.yyyy;
    vec4 h  = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  float fbm(vec3 p, int octaves) {
    float val   = 0.0;
    float amp   = 0.5;
    float freq  = 1.0;
    float total = 0.0;
    for (int i = 0; i < 6; i++) {
      if (i >= octaves) break;
      val   += snoise(p * freq) * amp;
      total += amp;
      amp   *= 0.5;
      freq  *= 2.0;
    }
    return val / total;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;

    // Center uv
    vec2 p = uv * 2.0 - 1.0;
    p.x *= aspect;

    float t = u_time;

    // Mouse influence
    vec2 mouse = u_mouse * 2.0 - 1.0;
    mouse.x *= aspect;
    float mouseDist = length(p - mouse);
    float mouseInfluence = exp(-mouseDist * 2.5) * 0.4;

    // Flow field
    float flow = fbm(vec3(p.x * u_horizontalSizing + t * u_flowSpeed, p.y * u_verticalSizing, t * 0.1), 4);
    float flowOffset = flow * u_flowStrength;

    // Wisp layer
    float wispTime = t * u_wispSpeed * 0.01;
    vec3 wispCoord = vec3(
      (p.x + flowOffset + mouseInfluence) * u_wispDensity,
      (p.y + flowOffset) * u_wispDensity * 0.5,
      wispTime
    );

    float wisp1 = fbm(wispCoord, 5);
    float wisp2 = fbm(wispCoord + vec3(3.7, 1.3, 0.9), 4);
    float wisp  = (wisp1 * 0.7 + wisp2 * 0.3) * u_wispIntensity;

    // Fog layer
    float fogTime = t * u_fogFallSpeed * 0.05;
    float fog = fbm(vec3(p.x * u_fogScale, p.y * u_fogScale + fogTime, fogTime * 0.5), 3);
    fog = smoothstep(0.0, 1.0, (fog + 1.0) * 0.5) * u_fogIntensity;

    // Combined intensity with falloff
    float intensity = (wisp + fog) * 0.5;
    float falloff   = 1.0 - smoothstep(u_falloffStart * 0.5, u_falloffStart, length(p));
    intensity *= falloff;

    // Apply mouse boost
    intensity += mouseInfluence * 0.6;

    // Decay
    intensity = pow(max(intensity, 0.0), u_decay);

    // === Color palette: deep navy -> ice blue -> white laser ===
    vec3 deepBlue  = vec3(0.05, 0.09, 0.18);
    vec3 midBlue   = vec3(0.16, 0.34, 0.58);
    vec3 iceBlue   = vec3(0.48, 0.72, 0.92);
    vec3 laserWhite = vec3(0.85, 0.95, 1.0);

    vec3 col = deepBlue;
    col = mix(col, midBlue,   smoothstep(0.0, 0.35, intensity));
    col = mix(col, iceBlue,   smoothstep(0.3, 0.65, intensity));
    col = mix(col, laserWhite, smoothstep(0.6, 1.0,  intensity));

    // Subtle edge vignette
    float vignette = 1.0 - smoothstep(0.5, 1.4, length(p) * 0.7);
    col *= vignette;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function createShader(gl, type, src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vertSrc, fragSrc) {
  const vert = createShader(gl, gl.VERTEX_SHADER, vertSrc);
  const frag = createShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  if (!vert || !frag) return null;

  const prog = gl.createProgram();
  gl.attachShader(prog, vert);
  gl.attachShader(prog, frag);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(prog));
    return null;
  }
  return prog;
}

const LaserFlow = ({
  horizontalSizing = 0.5,
  verticalSizing   = 2,
  wispDensity      = 1,
  wispSpeed        = 15,
  wispIntensity    = 5,
  flowSpeed        = 0.35,
  flowStrength     = 0.25,
  fogIntensity     = 0.45,
  fogScale         = 0.43,
  fogFallSpeed     = 0.91,
  decay            = 1.1,
  falloffStart     = 1.2,
}) => {
  const canvasRef = useRef(null);
  const mouseRef  = useRef({ x: 0.5, y: 0.5 });
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) { console.warn('WebGL not supported'); return; }

    const prog = createProgram(gl, VERT_SHADER, FRAG_SHADER);
    if (!prog) return;

    // Full-screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1,  -1, 1,
      -1,  1,  1, -1,   1, 1,
    ]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uTime      = gl.getUniformLocation(prog, 'u_time');
    const uRes       = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse     = gl.getUniformLocation(prog, 'u_mouse');
    const uHS        = gl.getUniformLocation(prog, 'u_horizontalSizing');
    const uVS        = gl.getUniformLocation(prog, 'u_verticalSizing');
    const uWD        = gl.getUniformLocation(prog, 'u_wispDensity');
    const uWSpd      = gl.getUniformLocation(prog, 'u_wispSpeed');
    const uWI        = gl.getUniformLocation(prog, 'u_wispIntensity');
    const uFSpd      = gl.getUniformLocation(prog, 'u_flowSpeed');
    const uFStr      = gl.getUniformLocation(prog, 'u_flowStrength');
    const uFog       = gl.getUniformLocation(prog, 'u_fogIntensity');
    const uFogSc     = gl.getUniformLocation(prog, 'u_fogScale');
    const uFogF      = gl.getUniformLocation(prog, 'u_fogFallSpeed');
    const uDecay     = gl.getUniformLocation(prog, 'u_decay');
    const uFalloff   = gl.getUniformLocation(prog, 'u_falloffStart');

    let startTime = performance.now();
    let animId;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width  = canvas.clientWidth  * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const render = () => {
      const t = (performance.now() - startTime) / 1000;

      gl.useProgram(prog);
      gl.uniform1f(uTime,    t);
      gl.uniform2f(uRes,     canvas.width, canvas.height);
      gl.uniform2f(uMouse,   mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(uHS,      horizontalSizing);
      gl.uniform1f(uVS,      verticalSizing);
      gl.uniform1f(uWD,      wispDensity);
      gl.uniform1f(uWSpd,    wispSpeed);
      gl.uniform1f(uWI,      wispIntensity);
      gl.uniform1f(uFSpd,    flowSpeed);
      gl.uniform1f(uFStr,    flowStrength);
      gl.uniform1f(uFog,     fogIntensity);
      gl.uniform1f(uFogSc,   fogScale);
      gl.uniform1f(uFogF,    fogFallSpeed);
      gl.uniform1f(uDecay,   decay);
      gl.uniform1f(uFalloff, falloffStart);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    rafRef.current = animId;

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: 1.0 - (e.clientY - rect.top) / rect.height,
      };
    };
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, [horizontalSizing, verticalSizing, wispDensity, wispSpeed, wispIntensity,
      flowSpeed, flowStrength, fogIntensity, fogScale, fogFallSpeed, decay, falloffStart]);

  return (
    <div className="laser-flow-root">
      <canvas ref={canvasRef} className="laser-flow-canvas" />
    </div>
  );
};

export default LaserFlow;
