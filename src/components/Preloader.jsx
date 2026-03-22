import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import './Preloader.css';

gsap.registerPlugin(CustomEase);
CustomEase.create("premium-reveal", "0.4, 0, 0.2, 1");

const Preloader = ({ isLoading, onComplete }) => {
  const containerRef = useRef(null);
  const whiteLogoRef = useRef(null);
  const maskedOverlayRef = useRef(null);

  useEffect(() => {
    // Initial State: Pure black background, solid white Z logo
    gsap.set(containerRef.current, { opacity: 1, display: 'flex', pointerEvents: 'auto' });
    gsap.set(whiteLogoRef.current, { opacity: 1, color: '#ffffff' });
    gsap.set(maskedOverlayRef.current, { opacity: 1 });

    if (!isLoading) {
      const isDesktop = window.innerWidth >= 1024;
      const hasSeenIntro = sessionStorage.getItem('zash_intro_seen') === 'true';

      const runTimeline = () => {
        const tl = gsap.timeline();

        // 1. Reveal Step: The "Z" logo becomes a transparent window
        tl.to(whiteLogoRef.current, {
          opacity: 0,
          duration: 1.4, // Slower for premium feel
          ease: "premium-reveal"
        });

        // 2. Interaction Enable: Allow clicks through the Z window
        tl.set(containerRef.current, { pointerEvents: 'none' });

        // 3. Fallback/Mobile Exit:
        // If no intro video is running, we hold for a moment then fade the whole overlay.
        if (!(isDesktop && !hasSeenIntro)) {
          tl.to(containerRef.current, {
            opacity: 0,
            duration: 1.2,
            ease: "power2.inOut",
            onComplete: () => {
              if (onComplete) onComplete();
              gsap.set(containerRef.current, { display: 'none' });
            }
          }, "+=0.8"); // Significant HOLD moment
        }
      };

      // Weight delay before the sequence starts
      const timer = setTimeout(runTimeline, 600);

      // SAFETY FAILSAFE: Ensure the screen is never permanently stuck
      const safetyFallback = setTimeout(() => {
        if (containerRef.current && containerRef.current.style.display !== 'none') {
          console.warn('[Preloader] Safety fallback triggered.');
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 1,
            onComplete: () => {
              if (onComplete) onComplete();
              gsap.set(containerRef.current, { display: 'none' });
            }
          });
        }
      }, 10000); // 10s total failsafe

      return () => {
        clearTimeout(timer);
        clearTimeout(safetyFallback);
      };
    }
  }, [isLoading, onComplete]);

  // Handle Intro Video Completion Event (Desktop only)
  useEffect(() => {
    const handleIntroFinish = () => {
      console.log('[Preloader] Intro finished signal received.');
      // Fade out the entire cinematic overlay to reveal full site
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut",
        onComplete: () => {
          if (onComplete) onComplete();
          gsap.set(containerRef.current, { display: 'none' });
        }
      });
    };

    window.addEventListener('zash_intro_finished', handleIntroFinish);
    return () => window.removeEventListener('zash_intro_finished', handleIntroFinish);
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="preloader-container"
      style={{ zIndex: 2147483647, backgroundColor: 'transparent' }}
    >
      {/* 
        Layer 1: Masked Overlay
        Solid black #000000 with a transparent 'Z' hole.
      */}
      <div ref={maskedOverlayRef} className="preloader-masked-overlay" />

      {/* 
        Layer 2: The White "Z" Logo 
        Acts as the 'filler' for the mask hole initially.
      */}
      <div ref={whiteLogoRef} className="preloader-logo-wrapper">
        <svg viewBox="0 0 100 100" className="z-logo-svg">
          <path
            d="M25 25 H75 L25 75 H75"
            fill="none"
            stroke="white"
            strokeWidth="12"
            strokeLinejoin="miter"
            strokeLinecap="butt"
          />
        </svg>
      </div>
    </div>
  );
};

export default Preloader;

