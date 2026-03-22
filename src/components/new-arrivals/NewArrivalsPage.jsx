import React, { useEffect } from 'react';
import animationController from '../../utils/AnimationController';
import Navbar from '../Navbar';
import SimpleFooter from './SimpleFooter';
import HeroSection from './HeroSection';
import ProductGridSection from './ProductGridSection';
import Atmosphere from '../Atmosphere';

const NewArrivalsPage = () => {
  useEffect(() => {
    // Initialize or refresh Lenis scroll via the global animation controller
    animationController.init();

    // Smooth fade in for the page
    animationController.gsap.to('.new-arrivals-wrapper', {
      opacity: 1,
      duration: 1,
      ease: 'power2.out'
    });

    window.scrollTo(0, 0);

    return () => {
      // Optional cleanup if needed (handled globally usually)
    };
  }, []);

  return (
    <div className="relative w-full bg-[#1a2533] text-white overflow-hidden overflow-x-hidden min-h-screen">
      <Atmosphere />
      <div className="opacity-0 new-arrivals-wrapper relative z-10 w-full flex flex-col min-h-screen">
        <main className="z-10 relative flex-1">
          <Navbar />
          <HeroSection />
          <ProductGridSection />
        </main>
        <SimpleFooter />
      </div>
    </div>
  );
};

export default NewArrivalsPage;
