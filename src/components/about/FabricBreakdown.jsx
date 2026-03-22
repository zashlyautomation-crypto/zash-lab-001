import { useEffect, useRef, useState } from 'react';
import animationController from '../../utils/AnimationController';

const FEATURES = [
  {
    id: 'outer',
    label: 'Outer Shell',
    short: 'OS-7X',
    description: 'Ripstop DWR-coated outer fabric rated for 30,000mm hydrostatic head. Wind-proof membrane bonded to the weave.',
    position: { top: '18%', left: '8%' },
    angle: 'right',
  },
  {
    id: 'thermal',
    label: 'Thermal Core',
    short: 'TC-INF',
    description: 'Lab-engineered aerogel-silk hybrid fill. 950-fill power equivalent at just 140g. Maintains loft at -50°C.',
    position: { top: '40%', right: '6%' },
    angle: 'left',
  },
  {
    id: 'barrier',
    label: 'Weather Barrier',
    short: 'WB-ZR',
    description: 'Sub-micron ePTFE membrane laminated between layers. Breathability rated 50,000g/m²/24h.',
    position: { bottom: '30%', left: '5%' },
    angle: 'right',
  },
  {
    id: 'inner',
    label: 'Inner Comfort',
    short: 'IL-SOFT',
    description: 'Merino-technical blend inner lining. Anti-microbial, moisture-wicking, zero abrasion against skin.',
    position: { bottom: '20%', right: '5%' },
    angle: 'left',
  },
];

const FabricBreakdown = () => {
  const sectionRef = useRef(null);
  const jacketRef = useRef(null);
  const markerRefs = useRef([]);
  const lineRefs = useRef([]);
  const [activeMarker, setActiveMarker] = useState(null);

  useEffect(() => {
    animationController.registerGroup('FabricBreakdownReveal', () => {
      const tl = animationController.gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none none',
        },
      });

      // Step 1: Jacket Reveal
      tl.fromTo(jacketRef.current,
        { opacity: 0, scale: 0.8, filter: 'blur(20px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.6, ease: 'expo.out' }
      );

      // Step 2 & 3: Markers and Lines sequentially
      FEATURES.forEach((feat, i) => {
        const marker = markerRefs.current[i];
        const line = lineRefs.current[i];

        if (!marker || !line) return;

        tl.fromTo(marker,
          { opacity: 0, scale: 0, x: feat.angle === 'right' ? -20 : 20 },
          { opacity: 1, scale: 1, x: 0, duration: 0.6, ease: 'back.out(1.7)' },
          '-=0.4'
        )
          .fromTo(line,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.8, ease: 'power2.inOut' },
            '-=0.3'
          );
      });

      // Subtle parallax on the background grid
      animationController.gsap.to('.fabric-grid-bg', {
        y: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
    }, sectionRef);

    return () => animationController.unregisterGroup('FabricBreakdownReveal');
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-28 md:py-48 overflow-hidden bg-[#141f2b]">
      {/* Background grid with Parallax */}
      <div
        className="fabric-grid-bg absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(200,219,240,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(200,219,240,0.6) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Section header */}
      <div className="px-6 md:px-20 mb-24 text-center">
        <p className="text-[11px] tracking-[0.5em] text-#6f8ba4 uppercase mb-4 font-light">Precision Engineering</p>
        <h2 className="font-bebas text-[10vw] sm:text-[7vw] md:text-[5.5vw] leading-none text-white">
          FABRIC <span className="text-#c8dbf0">TECHNOLOGY</span>
        </h2>
        <div className="w-16 h-px bg-#c8dbf0/30 mx-auto mt-6" />
      </div>

      {/* Interactive diagram */}
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="relative flex items-center justify-center" style={{ minHeight: '700px' }}>

          {/* Jacket */}
          <div ref={jacketRef} className="relative z-10 opacity-0">
            <img
              src="/images/character1.png"
              alt="LAB 001 Technical Jacket"
              className="h-[450px] md:h-[580px] object-contain drop-shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
              draggable="false"
            />
          </div>

          {/* Feature markers and lines */}
          {FEATURES.map((feat, i) => (
            <div
              key={feat.id}
              className="absolute z-20"
              style={feat.position}
            >
              {/* Connector line (Animated Scale) */}
              <div
                ref={(el) => lineRefs.current[i] = el}
                className="absolute top-1/2 -translate-y-1/2 h-1px origin-left hidden sm:block"
                style={{
                  width: 'clamp(40px, 8vw, 80px)',
                  left: feat.angle === 'right' ? 'calc(100% + 12px)' : 'auto',
                  right: feat.angle === 'left' ? 'calc(100% + 12px)' : 'auto',
                  transformOrigin: feat.angle === 'right' ? 'left' : 'right',
                  background: feat.angle === 'left'
                    ? 'linear-gradient(to left, rgba(200,219,240,0.4), transparent)'
                    : 'linear-gradient(to right, rgba(200,219,240,0.4), transparent)',
                }}
              />

              {/* Marker button */}
              <button
                ref={(el) => markerRefs.current[i] = el}
                onClick={() => setActiveMarker(activeMarker === feat.id ? null : feat.id)}
                className="fabric-marker group relative flex items-center gap-3 opacity-0"
                style={{ flexDirection: feat.angle === 'right' ? 'row' : 'row-reverse' }}
              >
                {/* Dot */}
                <div className="w-4 h-4 rounded-full border border-ice/40 bg-ice/10 group-hover:bg-ice/30 transition-all duration-500 relative shrink-0">
                  <div className="absolute inset-0 rounded-full bg-ice/30 animate-ping-slow" />
                </div>

                {/* Label */}
                <div className="glass-marker-label">
                  <span className="text-[10px] tracking-[0.4em] text-#6f8ba4 uppercase font-light block mb-0.5">
                    {feat.short}
                  </span>
                  <span className="text-[12px] text-white font-medium block leading-tight tracking-[0.05em]">
                    {feat.label}
                  </span>
                </div>
              </button>

              {/* Tooltip (Step 4: Revealed sequentially or on click) */}
              {activeMarker === feat.id && (
                <div
                  className="absolute z-30 w-64 p-5 rounded-sm text-[12px] text-white/70 leading-relaxed font-light"
                  style={{
                    top: '130%',
                    left: feat.angle === 'right' ? '0' : 'auto',
                    right: feat.angle === 'left' ? '0' : 'auto',
                    background: 'linear-gradient(135deg, rgba(20,31,43,0.98) 0%, rgba(13,21,32,0.98) 100%)',
                    border: '1px solid rgba(200,219,240,0.2)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                  }}
                >
                  <div className="text-[10px] text-#c8dbf0 mb-2 uppercase tracking-widest font-bold">Specifications</div>
                  {feat.description}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stats row with Entrance Animation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px mt-20 border border-white/5 overflow-hidden rounded-sm">
          {[
            { val: '7', unit: 'Layers', label: 'Insulation stack' },
            { val: '-50°', unit: 'Celsius', label: 'Tested performance' },
            { val: '140', unit: 'Grams', label: 'Insulation weight' },
            { val: '30K', unit: 'mm HH', label: 'Waterproof rating' },
          ].map((s, i) => (
            <div key={s.val} className="fabric-stat-item px-8 py-12 bg-white/0.015 text-center group hover:bg-white/0.03 transition-colors duration-500">
              <div className="font-bebas text-5xl md:text-6xl text-#c8dbf0 group-hover:scale-105 transition-transform duration-500">
                {s.val}<span className="text-#6f8ba4 text-2xl ml-1">{s.unit}</span>
              </div>
              <div className="text-[10px] tracking-[0.4em] text-white/20 uppercase mt-3 font-light group-hover:text-white/40 transition-colors duration-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .glass-marker-label {
          background: linear-gradient(135deg, rgba(26,40,56,0.85) 0%, rgba(20,31,43,0.85) 100%);
          border: 1px solid rgba(200,219,240,0.15);
          padding: 8px 14px;
          border-radius: 2px;
          backdrop-filter: blur(12px);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .fabric-marker:hover .glass-marker-label {
          border-color: rgba(200,219,240,0.4);
          transform: translateY(-2px);
          background: linear-gradient(135deg, rgba(35,55,75,0.9) 0%, rgba(26,40,56,0.9) 100%);
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </section>
  );
};

export default FabricBreakdown;
