import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import barba from '@barba/core';
import animationController from '../../utils/AnimationController';

/**
 * PageTransition — Custom "Ice Transition" reflecting the winter theme.
 * Uses Barba.js lifecycle hooks for controlling the transition.
 */
const PageTransition = () => {
  const location = useLocation();
  const overlayRef = useRef(null);
  const iceSheetRef = useRef(null);
  const frostRef = useRef(null);
  const contentRef = useRef(null);

  // Animation function for "Leave" (Ice covers screen)
  const playLeave = () => {
    const overlay = overlayRef.current;
    const iceSheet = iceSheetRef.current;
    const frost = frostRef.current;
    if (!overlay || !iceSheet || !frost) return Promise.resolve();

    const tl = gsap.timeline();
    return tl
      .to(document.body, {
        opacity: 0.7,
        filter: 'blur(5px)',
        duration: 0.4,
        ease: 'power2.inOut'
      })
      .set(overlay, { display: 'block', opacity: 1 })
      .fromTo(iceSheet,
        { xPercent: -100 },
        { xPercent: 0, duration: 0.8, ease: 'expo.inOut' },
        '-=0.2'
      )
      .fromTo(frost,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' },
        '-=0.4'
      );
  };

  // Animation function for "Enter" (Ice melts/shatters)
  const playEnter = () => {
    const overlay = overlayRef.current;
    const iceSheet = iceSheetRef.current;
    const frost = frostRef.current;
    if (!overlay || !iceSheet || !frost) return Promise.resolve();

    const tl = gsap.timeline();
    return tl
      .to(frost, {
        opacity: 0,
        scale: 1.1,
        duration: 0.8,
        ease: 'power2.inOut'
      })
      .to(iceSheet, {
        xPercent: 100,
        duration: 0.8,
        ease: 'expo.inOut'
      }, '-=0.6')
      .to(document.body, {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.6')
      .set(overlay, { display: 'none' })
      .set(iceSheet, { xPercent: -100 });
  };

  useEffect(() => {
    // Register Barba transitions via central controller
    animationController.initBarba({
      leave: playLeave,
      afterEnter: playEnter
    });

  }, []);

  useEffect(() => {
    // Trigger transition sequence on route change manually for React Router sync
    const sequence = async () => {
      await playLeave();
      await playEnter();
    };

    sequence();
  }, [location.pathname]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-9999 pointer-events-none hidden overflow-hidden"
    >
      {/* Translucent ice sheet layer */}
      <div
        ref={iceSheetRef}
        className="absolute inset-0 bg-white/10 backdrop-blur-xl"
        style={{
          boxShadow: '0 0 100px rgba(200, 219, 240, 0.2) inset',
          borderRight: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        {/* Frost texture overlay */}
        <div
          ref={frostRef}
          className="absolute inset-0 opacity-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3BaseFilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/baseFilter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            mixBlendMode: 'overlay',
            filter: 'contrast(150%) brightness(150%)',
          }}
        />

        {/* Ice crystals / shards detail */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-40 h-1 bg-white/40 rotate-35deg blur-sm" />
          <div className="absolute bottom-20 right-10 w-60 h-px bg-white/30 -rotate-15deg blur-sm" />
          <div className="absolute top-1/2 left-1/4 w-80 h-px bg-white/20 rotate-110deg blur-md" />
        </div>
      </div>

      {/* LAB 001 brand mark revealed behind ice */}
      <div
        ref={contentRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="font-bebas text-2xl tracking-[1em] text-white/20 select-none uppercase">
          Transitioning
        </div>
      </div>
    </div>
  );
};

export default PageTransition;
