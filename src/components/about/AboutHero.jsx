import { useEffect, useRef } from 'react';
import animationController from '../../utils/AnimationController';
import LaserFlow from './LaserFlow';

const AboutHero = () => {
  const heroRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const descRef = useRef(null);
  const revealRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  /* ── entrance animations ── */
  useEffect(() => {
    animationController.registerGroup('AboutHeroEntrance', () => {
      const tl = animationController.gsap.timeline({ delay: 0.3 });
      tl.fromTo(headingRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out' }
      )
        .fromTo(subRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
          '-=0.7'
        )
        .fromTo(descRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
          '-=0.6'
        );
    }, heroRef);

    return () => animationController.unregisterGroup('AboutHeroEntrance');
  }, []);

  /* ── mouse-driven radial reveal ── */
  useEffect(() => {
    const hero = heroRef.current;
    const reveal = revealRef.current;
    if (!hero || !reveal) return;

    let targetX = 50, targetY = 50;
    let currentX = 50, currentY = 50;
    let raf;

    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      currentX = lerp(currentX, targetX, 0.1);
      currentY = lerp(currentY, targetY, 0.1);
      reveal.style.setProperty('--mx', `${currentX}%`);
      reveal.style.setProperty('--my', `${currentY}%`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e) => {
      const rect = hero.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width) * 100;
      targetY = ((e.clientY - rect.top) / rect.height) * 100;
    };
    hero.addEventListener('mousemove', onMove);

    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener('mousemove', onMove);
    };
  }, []);

  /* ── scroll animations ── */
  useEffect(() => {
    animationController.registerGroup('AboutHeroScroll', () => {
      const hero = heroRef.current;
      
      // Scale hero content slightly on scroll
      animationController.gsap.to('.hero-content-wrapper', {
        scale: 1.05,
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Parallax for background shader
      animationController.gsap.to('.hero-bg-parallax', {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Parallax for jacket
      animationController.gsap.to('.hero-jacket-parallax', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, heroRef);

    return () => animationController.unregisterGroup('AboutHeroScroll');
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100svh' }}
    >
      {/* ── Layer 1: LaserFlow WebGL shader ── */}
      <div className="hero-bg-parallax absolute inset-0 z-0 h-[120%]">
        <LaserFlow
          horizontalSizing={0.5}
          verticalSizing={2}
          wispDensity={1}
          wispSpeed={15}
          wispIntensity={5}
          flowSpeed={0.35}
          flowStrength={0.25}
          fogIntensity={0.45}
          fogScale={0.43}
          fogFallSpeed={0.91}
          decay={1.1}
          falloffStart={1.2}
        />
      </div>

      {/* ── Layer 2: Dark overlay for readability ── */}
      <div className="absolute inset-0 z-1 bg-[#0d1520]/80 pointer-events-none" />

      {/* ── Layer 3: Interactive jacket reveal ── */}
      <div
        ref={revealRef}
        className="about-hero-reveal hero-jacket-parallax absolute inset-0 z-2 pointer-events-none"
        style={{
          '--mx': '50%',
          '--my': '50%',
          WebkitMaskImage: 'radial-gradient(circle 200px at var(--mx) var(--my), black 0%, transparent 100%)',
          maskImage: 'radial-gradient(circle 200px at var(--mx) var(--my), black 0%, transparent 100%)',
        }}
      >
        <img
          src="/images/character1.png"
          alt="LAB 001 Winter Jacket"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[90vh] object-contain opacity-90 select-none"
          draggable="false"
        />
      </div>

      {/* ── Layer 4: Jacket ghost (always slightly visible) ── */}
      <div className="hero-jacket-parallax absolute inset-0 z-1 flex items-end justify-center pointer-events-none">
        <img
          src="/images/character1.png"
          alt=""
          aria-hidden="true"
          className="h-[86vh] object-contain opacity-30 select-none"
          draggable="false"
        />
      </div>

      {/* ── Layer 5: Foreground hero content ── */}
      <div className="hero-content-wrapper relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Label */}
        <p className="text-[10px] tracking-[0.4em] text-#6f8ba4 uppercase mb-6 font-light">
          EST. 2024 · WINTER ENGINEERING
        </p>

        {/* Main Heading */}
        <h1
          ref={headingRef}
          className="font-bebas text-[11vw] sm:text-[11vw] md:text-[9vw] lg:text-[7.5vw] leading-[0.88] tracking-wider text-white opacity-0"
          style={{ textShadow: '0 0 80px rgba(200,219,240,0.2)' }}
        >
          ABOUT
          <br />
          <span className="text-#c8dbf0">LAB 001</span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subRef}
          className="font-bebas text-[4.5vw] sm:text-[3vw] md:text-[2.2vw] tracking-[0.3em] text-#6f8ba4 mt-4 opacity-0"
        >
          ENGINEERED FOR EXTREME WINTERS
        </p>

        {/* Description */}
        <p
          ref={descRef}
          className="max-w-md mt-6 text-[13px] text-white/40 leading-relaxed font-light tracking-wide opacity-0"
        >
          LAB 001 is a technical winter wear label born from the harshest
          conditions. Every stitch is calculated. Every layer is a shield.
        </p>

        {/* Scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <span className="text-[9px] tracking-[0.35em] uppercase font-light">Scroll</span>
          <div className="w-px h-10 bg-gradient-to from-white/30 to-transparent" />
        </div>
      </div>

      {/* ── Bottom fade ── */}
      <div className="absolute inset-x-0 bottom-0 h-40 z-10 bg-gradient-to-right from-[#1a2533] to-transparent pointer-events-none" />
    </section>
  );
};

export default AboutHero;
