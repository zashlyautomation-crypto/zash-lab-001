import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';
import animationController from '../../utils/AnimationController';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './StorySlider.css';

const SLIDES = [
  {
    id: 1,
    label: '01 / Origins',
    title: 'BORN IN THE\nCOLD',
    description:
      'LAB 001 was founded after a winter expedition where standard gear failed at -40°C. We decided the market needed jackets engineered to the millimeter.',
    accent: '#c8dbf0',
    image: '/images/character1.png',
  },
  {
    id: 2,
    label: '02 / Inspiration',
    title: 'ARCTIC\nBLUEPRINTS',
    description:
      'Every collection draws from extreme winter environments — glacial formations, mountain wind-patterns, and the thermal dynamics of sub-zero atmospheres.',
    accent: '#8aafd0',
    image: '/images/character2.png',
  },
  {
    id: 3,
    label: '03 / Technology',
    title: 'TECHNICAL\nINNOVATION',
    description:
      'We developed a proprietary 7-layer insulation matrix tested in wind tunnels. Each jacket is rated for sustained performance below -35°C.',
    accent: '#6f8ba4',
    image: '/images/character1.png',
  },
  {
    id: 4,
    label: '04 / Performance',
    title: 'TESTED\nIN THE FIELD',
    description:
      'From the Greenland Ice Sheet to the Siberian taiga — LAB 001 outerwear has been proven across 14 extreme terrain expeditions.',
    accent: '#415770',
    image: '/images/character2.png',
  },
];

const DISPLAY_SLIDES = [...SLIDES, ...SLIDES]; // Duplicate to fix loop warning

const StorySlider = () => {
  const sectionRef = useRef(null);
  const swiperRef = useRef(null);
  const headerRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    animationController.registerGroup('StorySliderIntro', () => {
      const tl = animationController.gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        }
      });

      if (headerRef.current) {
        tl.fromTo(headerRef.current.querySelectorAll('.story-header'),
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out' }
        )
          .fromTo('.story-swiper',
            { opacity: 0, y: 80 },
            { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out' },
            '-=0.7'
          )
          .fromTo(navRef.current,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' },
            '-=0.5'
          );
      }
    }, sectionRef);

    return () => animationController.unregisterGroup('StorySliderIntro');
  }, []);

    const handleProgress = (swiper) => {
        if (!swiper || !swiper.slides) return;

        // Update Progress Bar
        const totalProgress = swiper.realIndex / (SLIDES.length - 1);
        animationController.gsap.to('.swiper-progress-bar', {
            scaleX: totalProgress,
            duration: 0.8,
            ease: 'power2.out'
        });

        // Update Slide Transforms
        swiper.slides.forEach((slide) => {
            if (!slide) return;

            const slideProgress = slide.progress;
            const absProgress = Math.abs(slideProgress);

            const scale = 1.3 - (absProgress * 0.4); 
            const opacity = 1 - (absProgress * 0.8);  
            
            const card = slide.querySelector('.story-card');
            const img = slide.querySelector('.story-card-img');
            const title = slide.querySelector('.story-slide-title');
            const desc = slide.querySelector('.story-slide-desc');

            if (card) {
                animationController.gsap.set(card, {
                    scale: Math.max(0.85, scale),
                    opacity: Math.max(0.2, opacity),
                    zIndex: Math.round(100 - (absProgress * 10)),
                    filter: `brightness(${1 - absProgress * 0.4})`
                });
            }

            if (img) {
                animationController.gsap.set(img, {
                    scale: 1 + (0.1 / (absProgress + 1)), 
                    x: slideProgress * 50, 
                    opacity: Math.max(0.1, opacity * 0.4)
                });
            }

            if (title) {
                animationController.gsap.set(title, {
                    opacity: 1 - (absProgress * 2), 
                    y: absProgress * 30
                });
            }
            if (desc) {
                animationController.gsap.set(desc, {
                    opacity: 1 - (absProgress * 2.5),
                    y: absProgress * 40
                });
            }
        });
    };

  return (
    <section ref={sectionRef} className="story-slider-section relative w-full overflow-hidden py-28 md:py-40 bg-[#0d1520]">
      {/* Parallax Background Typography */}
      <div className="absolute top-10 left-[-5%] text-[20vw] font-bebas text-white/2 leading-none select-none pointer-events-none whitespace-nowrap">
        ENGINEERING COLD
      </div>

      {/* Section header */}
      <div ref={headerRef} className="px-6 md:px-20 mb-20">
        <p className="story-header text-[10px] tracking-[0.4em] text-#6f8ba4 uppercase mb-4 font-light">
          Our Story
        </p>
        <h2 className="story-header font-bebas text-[10vw] sm:text-[7vw] md:text-[5vw] leading-none text-white">
          THE <span className="text-ice">JOURNEY</span>
        </h2>
      </div>

      {/* Swiper */}
      <Swiper
        modules={[Navigation, Pagination, A11y, Autoplay]}
        slidesPerView={1.2}
        spaceBetween={0}
        centeredSlides={true}
        loop={true}
        speed={1200}
        grabCursor={true}
        watchSlidesProgress={true}
        navigation={{
          prevEl: '.story-btn-prev',
          nextEl: '.story-btn-next',
        }}
        pagination={{
          el: '.story-pagination',
          clickable: true,
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setTimeout(() => handleProgress(swiper), 100);
        }}
        onProgress={handleProgress}
        onSetTranslate={handleProgress}
        breakpoints={{
          640: { slidesPerView: 1.5 },
          1024: { slidesPerView: 1.8 },
          1440: { slidesPerView: 2.2 },
        }}
        className="story-swiper overflow-visible"
      >
        {DISPLAY_SLIDES.map((slide, idx) => (
          <SwiperSlide key={`${slide.id}-${idx}`} className="story-slide py-10">
            <div className="story-card relative overflow-hidden rounded-sm transition-none"
              style={{ background: 'linear-gradient(135deg, #1e2d3d 0%, #141f2b 100%)' }}
            >
              {/* Border accent */}
              <div className="absolute inset-0 rounded-sm border border-white/8 pointer-events-none z-10" />

              {/* Background jacket image */}
              <div className="absolute inset-0 flex items-end justify-end pointer-events-none">
                <img src={slide.image} alt="" aria-hidden="true"
                  className="story-card-img h-full object-contain object-bottom opacity-20"
                  draggable="false"
                />
              </div>

              {/* Accent glow */}
              <div
                className="absolute -top-16 -right-16 w-96 h-96 rounded-full blur-[120px] opacity-15 pointer-events-none"
                style={{ background: slide.accent }}
              />

              {/* Content */}
              <div className="relative z-5 p-10 md:p-16 flex flex-col justify-between h-full min-h-[500px] md:min-h-[600px]">
                {/* Top */}
                <div className="max-w-xl">
                  <p className="text-[10px] tracking-[0.5em] uppercase font-bold mb-10"
                    style={{ color: slide.accent }}>
                    {slide.label}
                  </p>
                  <h3 className="story-slide-title font-bebas text-6xl md:text-8xl text-white leading-none whitespace-pre-line">
                    {slide.title}
                  </h3>
                </div>

                {/* Bottom */}
                <div className="max-w-md">
                  <div className="w-12 h-px mb-8" style={{ background: slide.accent }} />
                  <p className="story-slide-desc text-sm md:text-base text-white/50 leading-relaxed font-light">
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation */}
      <div ref={navRef} className="flex flex-col md:flex-row items-center justify-between w-full mt-16 px-6 md:px-20 gap-10 md:gap-0">
        <div className="flex items-center gap-6 order-2 md:order-1">
          <button className="story-btn-prev story-nav-btn group">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:-translate-x-1 transition-transform">
              <path d="M19 12H5M5 12l7 7M5 12l7-7" />
            </svg>
          </button>
          <button className="story-btn-next story-nav-btn group">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:translate-x-1 transition-transform">
              <path d="M5 12h14M14 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-10 order-1 md:order-2">
          <div className="story-pagination flex items-center" />
          <div className="hidden md:block w-40 h-px bg-white/10 relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-ice origin-left scale-x-0 swiper-progress-bar w-full" />
          </div>
        </div>
      </div>

      <style>{`
        .story-nav-btn {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          cursor: pointer;
        }
        .story-nav-btn:hover {
          background: white;
          color: #0d1520;
          border-color: white;
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .story-pagination .swiper-pagination-bullet {
          width: 30px;
          height: 2px;
          background: rgba(255,255,255,0.15);
          opacity: 1;
          margin: 0 4px !important;
          transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
          border-radius: 0;
        }
        .story-pagination .swiper-pagination-bullet-active {
          background: #c8dbf0;
          width: 60px;
        }
        .story-slide {
          transition: none !important;
        }
      `}</style>
    </section>
  );
};


export default StorySlider;
