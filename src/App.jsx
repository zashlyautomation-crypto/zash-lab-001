import { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import animationController from './utils/AnimationController';
import introVideo from './utils/introVideo';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CatalogSection from './components/CatalogSection';
import Footer from './components/Footer';
import Atmosphere from './components/Atmosphere';
import ProductOverview from './components/ProductOverview';
import AboutPage from './components/about/AboutPage';
import PageTransition from './components/about/PageTransition';
import NewArrivalsPage from './components/new-arrivals/NewArrivalsPage';
import Preloader from './components/Preloader';
import CartSidebar from './components/CartSidebar';
import CheckoutPage from './components/checkout/CheckoutPage';
import { NotFound } from './components/not-found/404';
import { useState } from 'react';

// ─── Home page wrapper ─────────────────────────────────────
function HomePage() {
  const { selectedProductId } = useSelector((state) => state.product);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Managed Transition via AnimationController Logic
  useEffect(() => {
    const target = selectedProductId ? '.product-content-wrapper' : '.home-content-wrapper';
    
    // Stop scroll when overflow is active
    animationController.toggleScroll(!selectedProductId);

    animationController.registerGroup('OverlayTransition', () => {
      animationController.gsap.set(target, { opacity: 0 });
      animationController.gsap.to(target, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        delay: 0.2, // Let the Preloader/Intro start first
        ease: 'power3.out',
        overwrite: 'auto'
      });
    }, null);

    return () => {
      animationController.unregisterGroup('OverlayTransition');
    };

  }, [selectedProductId]);

  return (
    <div className="relative w-full overflow-hidden">
      <Atmosphere />
      <div className="relative w-full flex flex-col">
        {!selectedProductId ? (
          <div className="w-full flex flex-col home-content-wrapper">
            <Navbar />
            <main className="z-10">
              <Hero />
              <CatalogSection />
            </main>
            <Footer />
          </div>
        ) : (
          <div className="w-full flex flex-col relative z-20 min-h-screen product-content-wrapper translate-y-5 opacity-0">
            <ProductOverview />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Root App with routing ─────────────────────────────────
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    animationController.init();
    introVideo.init();

    // Signal completion when everything (images, fonts, scripts) is fully loaded
    const handleLoad = () => {
      // Small artificial delay for premium feel if needed, but here we prioritize precision
      setLoading(false);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      const fallback = setTimeout(handleLoad, 4000); // Failsafe if onload gets stuck
      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(fallback);
      };
    }
  }, []);

  useEffect(() => {
    if (loading) {
      document.documentElement.classList.add('is-loading');
      animationController.toggleScroll(false);
    } else {
      document.documentElement.classList.remove('is-loading');
      animationController.toggleScroll(true);
    }
  }, [loading]);

  return (
    <HashRouter>
      <Preloader onComplete={() => setLoading(false)} isLoading={loading} />
      <CartSidebar />
      
      {/* Centralized Page Transition Manager */}
      <PageTransition />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/new-arrivals" element={<NewArrivalsPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
