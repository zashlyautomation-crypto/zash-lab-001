import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import animationController from '../../utils/AnimationController';

const FeatureCard = ({ product, className = "" }) => {
  const cardRef = useRef(null);

  const handleMouseEnter = () => {
    animationController.gsap.to(cardRef.current, {
      y: -5,
      boxShadow: "0 25px 50px rgba(0,0,0,0.35)",
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    animationController.gsap.to(cardRef.current, {
      y: 0,
      boxShadow: "10px 10px 30px rgba(0,0,0,0.15)",
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const handleSlideChange = () => {
    const images = cardRef.current.querySelectorAll('.swiper-slide-active img');
    if (images.length) {
      animationController.gsap.fromTo(images[0],
        { scale: 0.98, opacity: 0.5 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "power1.out" }
      );
    }
  };

  return (
    <div
      ref={cardRef}
      className={`relative rounded-xl bg-[#c5ced545] bg-opacity-[0.82] backdrop-blur-[30px] p-6 sm:p-7 flex flex-col justify-between overflow-hidden shadow-[10px_10px_30px_rgba(0,0,0,0.15)] border border-white border-opacity-30 cursor-pointer text-[#111] ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top Header Label */}
      <h2
        className="relative z-10 text-[2.8rem] sm:text-[3.2rem] font-bold tracking-tighter uppercase leading-none condense-font mb-4"
        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
      >
        {product.name}
      </h2>

      {/* Main Interactive Container with Corner Brackets */}
      <div className="relative z-10 w-full grow flex items-center justify-center py-6 px-1 border border-black border-opacity-[0.03] rounded-lg bg-white/10">

        {/* Frame Brackets */}
        <div className="absolute top-2 left-2 w-3 h-1px bg-black opacity-25"></div>
        <div className="absolute top-2 left-2 w-1px h-3 bg-black opacity-25"></div>
        <div className="absolute top-2 right-2 w-3 h-1px bg-black opacity-25"></div>
        <div className="absolute top-2 right-2 w-1px h-3 bg-black opacity-25"></div>

        <div className="absolute bottom-2 left-2 w-3 h-1px bg-black opacity-25"></div>
        <div className="absolute bottom-2 left-2 w-1px h-3 bg-black opacity-25"></div>
        <div className="absolute bottom-2 right-2 w-3 h-1px bg-black opacity-25"></div>
        <div className="absolute bottom-2 right-2 w-1px h-3 bg-black opacity-25"></div>

        {/* Swiper Visual Pointer */}
        <div className="absolute top-[18%] right-[28%] w-5 h-5 z-20 text-black opacity-40 pointer-events-none">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V14M16 11V14M16 14L15.9189 14.1623C15.1554 15.6893 13.9113 16.9377 12.3879 17.7126V17.7126M16 14V21M16 21H12.3879" />
          </svg>
        </div>

        <Swiper
          modules={[Navigation, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          navigation={{
            nextEl: '.swiper-button-next-custom-' + product.id,
            prevEl: '.swiper-button-prev-custom-' + product.id,
          }}
          onSlideChange={handleSlideChange}
          className="w-full h-full"
          speed={500}
        >
          {product.images.map((img, idx) => (
            <SwiperSlide key={idx} className="flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-radial from-white/20 to-transparent opacity-40 rounded-full blur-2xl pointer-events-none"></div>
              <img
                src={img}
                alt={`${product.name} view ${idx + 1}`}
                className="w-full h-auto max-h-[300px] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.3)] relative z-10"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Arrows */}
        <div className={`swiper-button-prev-custom-${product.id} absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center cursor-pointer z-30 text-black opacity-15 hover:opacity-100 transition-opacity`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M15 18L9 12L15 6" />
          </svg>
        </div>
        <div className={`swiper-button-next-custom-${product.id} absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center cursor-pointer z-30 text-black opacity-15 hover:opacity-100 transition-opacity`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M9 18L15 12L9 6" />
          </svg>
        </div>
      </div>

      {/* Cart Button Footer */}
      <div className="relative z-10 w-full mt-5">
        <button className="w-full py-3 border border-black border-opacity-20 rounded-lg text-[#111] font-mono tracking-widest text-[10px] sm:text-[11px] font-bold uppercase transition-all duration-300 hover:bg-black hover:text-white">
          ADD TO CART — ${product.price}
        </button>
      </div>
    </div>
  );
};

export default FeatureCard;
