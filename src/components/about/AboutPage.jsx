import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import animationController from '../../utils/AnimationController';

import Navbar from '../Navbar';
import Footer from '../Footer';
import AboutHero from './AboutHero';
import StorySlider from './StorySlider';
import FabricBreakdown from './FabricBreakdown';
import BrandValues from './BrandValues';

const AboutPage = () => {
  const lenisRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Lenis smooth scroll for this page
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
      mouseMultiplier: 0.9,
      smoothTouch: false,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    
    const ST = animationController.ScrollTrigger;
    const gsap = animationController.gsap;

    if (ST) {
      lenis.on('scroll', ST.update);
    }

    const tickerFn = (time) => {
      lenis.raf(time * 1000);
    };

    if (gsap) {
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);
    }

    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'instant' });
    lenis.scrollTo(0, { immediate: true });

    // Global Scroll-based Parallax for background elements
    animationController.registerGroup('AboutPageParallax', () => {
      if (!gsap || !ST) return;

      // Background Typography Parallax
      gsap.to('.background-parallax-text', {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });

      // Subtle scaling of sections on scroll
      gsap.utils.toArray('section').forEach((section) => {
        gsap.to(section, {
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
          y: section.dataset.parallax === 'true' ? -30 : 0,
          opacity: section.dataset.fade === 'true' ? 0.8 : 1,
        });
      });
    }, containerRef);

    if (ST) {
      ST.refresh();
    }

    return () => {
      lenis.destroy();
      if (gsap) {
        gsap.ticker.remove(tickerFn);
      }
      animationController.unregisterGroup('AboutPageParallax');
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden overflow-x-hidden bg-[#0d1520]"
      data-barba="wrapper"
    >
      <div data-barba="container" data-barba-namespace="about">
        <Navbar />
        <main>
          <AboutHero />
          <StorySlider />
          <FabricBreakdown />
          <BrandValues />
        </main>
        <Footer />
      </div>

      {/* Global Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20 overflow-hidden">
        <div className="background-parallax-text absolute top-[20%] left-[-10%] text-[25vw] sm:text-[30vw] font-bebas text-white/3 select-none leading-none">
          LAB001
        </div>
        <div className="background-parallax-text absolute bottom-[10%] right-[-5%] text-[20vw] sm:text-[25vw] font-bebas text-white/2 select-none leading-none">
          WINTER
        </div>
      </div>
    </div>
  );
};


export default AboutPage;
