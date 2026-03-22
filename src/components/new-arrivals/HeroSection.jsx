import React, { useEffect, useRef } from 'react';
import animationController from '../../utils/AnimationController';

const HeroSection = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const characterRef = useRef(null);

  useEffect(() => {
    const gsap = animationController.gsap;
    const ScrollTrigger = animationController.ScrollTrigger;

    // Simple parallax on scroll
    gsap.to(textRef.current, {
      y: 100,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    gsap.to(characterRef.current, {
      y: 50,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

  }, []);

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 pt-28 pb-12">
      <div 
        ref={containerRef}
        className="relative w-full h-[70vh] sm:h-[80vh] min-h-[600px] overflow-hidden rounded-[2.5rem] sm:rounded-[4rem] shadow-2xl"
      >
        {/* Cinematic Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
          style={{ 
            backgroundImage: "url('/images/new-arrivals/hero-bg.png')",
          }}
        ></div>

        {/* Cinematic Overlays */}
        {/* Soft fog/gradient from the bottom to blend with background color */}
        <div className="absolute inset-0 bg-linear-to-t from-[#1a2533] via-transparent to-transparent opacity-90 z-10"></div>
        
        {/* Subtle dark vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/30 z-10"></div>

        {/* Hero Text Layer */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <h1 
            ref={textRef}
            className="text-[18vw] sm:text-[16vw] font-bold tracking-[-0.04em] leading-none text-white opacity-40 mix-blend-overlay uppercase select-none w-full text-center px-4"
            style={{ fontFamily: "'Bebas Neue', 'Oswald', sans-serif" }}
          >
            NEW ARRIVALS
          </h1>
        </div>

        {/* Character Image Overlapping Text */}
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <img 
            ref={characterRef}
            src="/images/new-arrivals/hero-character.png" 
            alt="New Arrivals Character" 
            className="h-full w-auto object-contain transform translate-y-12 scale-110"
          />
        </div>

        {/* Scanline/Texture Overlay for tech look */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-40 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>
    </div>
  );
};

export default HeroSection;
