import React, { useEffect, useRef } from 'react';
import animationController from '../../utils/AnimationController';
import { newArrivalsProducts } from '../../data/newArrivalsData';
import FeatureCard from './FeatureCard';
import ProductCard from './ProductCard';

const ProductGridSection = () => {
  const containerRef = useRef(null);
  const zashTextRef = useRef(null);

  useEffect(() => {
    // Large background text parallax - Slower movement to stay visible behind grid
    animationController.gsap.to(zashTextRef.current, {
      y: -200,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1 // Slightly smoother scrub
      }
    });

    // Subtitle reveal stagger
    const cards = containerRef.current.querySelectorAll('.reveal-card');
    animationController.gsap.fromTo(cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
        }
      }
    );
  }, []);

  const featureProduct = newArrivalsProducts.find(p => p.id === 'arctic-shell');
  const auroraPuffer = newArrivalsProducts.find(p => p.id === 'aurora-puffer');
  const techShell = newArrivalsProducts.find(p => p.id === 'tech-shell');
  const glacierParka = newArrivalsProducts.find(p => p.id === 'glacier-parka');
  const frostGuard = newArrivalsProducts.find(p => p.id === 'frost-guard');

  return (
    <section
      ref={containerRef}
      className="relative w-full py-16 px-4 md:px-10 lg:px-20 mx-auto max-w-[1600px] overflow-hidden"
    >
      {/* Background Watermark Text */}
      {/* Background Watermark Text - Spaced to match reference rhythm */}
      <div
        ref={zashTextRef}
        className="absolute inset-x-0 inset-y-0 flex flex-col justify-around items-center pointer-events-none select-none z-0 py-20 px-4 overflow-hidden"
      >
        <h2 className="text-[35vw] sm:text-[450px] lg:text-[400px] xl:text-[500px] font-bold tracking-tighter condense-font leading-none text-white opacity-15 mix-blend-overlay whitespace-nowrap flex align-end justify-end" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          ZASH
        </h2>

        <h2 className="text-[35vw] sm:text-[450px] lg:text-[400px] xl:text-[500px] font-bold tracking-tighter condense-font leading-none text-white opacity-15 mix-blend-overlay whitespace-nowrap flex align-end justify-end" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          ZASH
        </h2>
      </div>

      <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-24">

        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-10 md:gap-16">
          {/* Feature Card: Arctic Shell */}
          {featureProduct && (
            <FeatureCard product={featureProduct} className="reveal-card w-full h-auto" />
          )}

          {/* Glacier Parka (Info card) */}
          {glacierParka && (
            <ProductCard product={glacierParka} idNumber="266" className="reveal-card w-full" />
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-10 md:gap-16 md:mt-16">
          {/* Aurora Puffer (Info card) */}
          {auroraPuffer && (
            <ProductCard product={auroraPuffer} idNumber="625" className="reveal-card w-full" />
          )}

          {/* Special Tech Shell Layout (Visual with title below) */}
          {techShell && (
            <div className="reveal-card w-full flex flex-col group">
              {/* Visual Container */}
              <div className="relative w-full aspect-square md:aspect-4/3 bg-[#c5ced53b] bg-opacity-[0.82] rounded-xl backdrop-blur-[30px] p-8 flex items-center justify-center border border-white border-opacity-30 shadow-[10px_10px_30px_rgba(0,0,0,0.15)] group-hover:-translate-y-1 transition-transform duration-500">
                {/* Brackets */}
                <div className="absolute top-3 left-3 w-4 h-1px bg-black opacity-20"></div>
                <div className="absolute top-3 left-3 w-1px h-4 bg-black opacity-20"></div>
                <div className="absolute bottom-3 right-3 w-4 h-1px bg-black opacity-20"></div>
                <div className="absolute bottom-3 right-3 w-1px h-4 bg-black opacity-20"></div>

                {/* Horizontal Nav Arrows */}
                <div className="absolute inset-y-0 left-4 flex items-center opacity-10 group-hover:opacity-40 transition-opacity">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M15 18L9 12L15 6" />
                  </svg>
                </div>
                <div className="absolute inset-y-0 right-4 flex items-center opacity-10 group-hover:opacity-40 transition-opacity">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M9 18L15 12L9 6" />
                  </svg>
                </div>

                {/* Centered Image */}
                <img
                  src={techShell.image}
                  alt={techShell.name}
                  className="w-[85%] h-[85%] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.25)]"
                />
              </div>

              {/* Title Section Below Card */}
              <div className="mt-4 flex justify-between items-center px-1">
                <h3 className="text-[3.5rem] font-bold tracking-tighter uppercase leading-none condense-font text-white mix-blend-lighten" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {techShell.name}
                </h3>
                <div className="text-white opacity-40">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 7L17 17M17 17H7M17 17V7" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Frost Guard (With Button) */}
          {frostGuard && (
            <ProductCard product={frostGuard} hasButton={true} className="reveal-card w-full" />
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductGridSection;
