import React, { useRef } from 'react';
import animationController from '../../utils/AnimationController';

const ProductCard = ({ product, className = "", hasButton = false, idNumber = "" }) => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);

  const handleMouseEnter = () => {
    animationController.gsap.to(cardRef.current, {
      y: -5,
      boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
      duration: 0.4,
      ease: "power2.out"
    });
    animationController.gsap.to(imageRef.current, {
      scale: 1.05,
      duration: 0.6,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    animationController.gsap.to(cardRef.current, {
      y: 0,
      boxShadow: "10px 10px 30px rgba(0,0,0,0.1), -5px -5px 15px rgba(255,255,255,0.05)",
      duration: 0.4,
      ease: "power2.out"
    });
    animationController.gsap.to(imageRef.current, {
      scale: 1,
      duration: 0.6,
      ease: "power2.out"
    });
  };

  // Convert name to vertical stack: ZASH \n NAME \n SUB
  const nameParts = product.name.split(' ');
  const displayName = nameParts.length > 2
    ? [nameParts[0], nameParts[1], nameParts.slice(2).join(' ')]
    : [nameParts[0], nameParts.slice(1).join(' ')];

  return (
    <div
      ref={cardRef}
      className={`relative rounded-xl bg-[#c5ced53c] bg-opacity-[0.82] backdrop-blur-[30px] p-4 sm:p-5 flex flex-col md:flex-row gap-4 sm:gap-6 overflow-hidden border border-white border-opacity-30 cursor-pointer text-[#111] shadow-[10px_10px_30px_rgba(0,0,0,0.1),-5px_-5px_15px_rgba(255,255,255,0.05)] ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top Right Card Arrow */}
      <div className="absolute top-3 right-3 text-black opacity-20">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </div>

      {/* Product Image Section */}
      <div className="w-full md:w-[48%] relative flex items-center justify-center p-2 min-h-[160px]">
        <div className="absolute inset-0 bg-radial from-white/20 to-transparent opacity-40 rounded-full blur-2xl pointer-events-none"></div>
        <img
          ref={imageRef}
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full max-h-[220px] object-contain relative z-10 drop-shadow-[0_12px_20px_rgba(0,0,0,0.25)] mix-blend-normal transform scale-[1.05]"
        />
      </div>

      {/* Product Info Section */}
      <div className="w-full md:w-[52%] relative z-10 flex flex-col py-1">
        {/* Name Stack */}
        <div className="flex flex-col mb-4">
          {displayName.map((part, i) => (
            <h3
              key={i}
              className="text-[2.6rem] sm:text-[2.8rem] md:text-[3.2rem] font-bold tracking-tighter uppercase leading-[0.8] condense-font"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              {part}
            </h3>
          ))}
        </div>

        {/* Divider line */}
        <div className="w-full h-1px bg-black opacity-10 mb-3"></div>

        {/* Technical Specs Labels */}
        <div className="flex flex-col gap-[3px] text-[8px] sm:text-[8.5px] font-mono uppercase tracking-[0.15em] font-bold opacity-60 text-white">
          <p>FABRIC: {product.fabric}</p>
          <p>INSULATION: {product.insulation}</p>
        </div>

        {/* Bottom Interaction Area */}
        <div className="mt-auto pt-6 flex justify-between items-end w-full">
          {hasButton ? (
            <button className="w-full py-2.5 border border-black border-opacity-20 rounded-lg text-[#111] font-mono tracking-widest text-[9px] font-bold uppercase backdrop-blur-sm transition-all duration-300 hover:bg-black hover:text-white">
              ADD TO CART — ${product.price}
            </button>
          ) : (
            <>
              <div className="text-[9px] font-mono tracking-widest opacity-40 flex items-center gap-1.5 pb-0.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
                {idNumber || '825'}
              </div>
              <div className="text-black opacity-20 pb-0.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M7 7L17 17M17 17H7M17 17V7" />
                </svg>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
