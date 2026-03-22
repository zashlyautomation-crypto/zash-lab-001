import { useEffect, useRef } from 'react';
import animationController from '../../utils/AnimationController';

const VALUES = [
  {
    id: 'durability',
    title: 'EXTREME\nDURABILITY',
    description: 'Every seam tested to withstand 1,200N of tensile force. Zippers rated 200,000+ open/close cycles.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-10 h-10">
        <path d="M20 4L36 12v16L20 36 4 28V12z" />
        <path d="M20 4v32M4 12l16 8 16-8" strokeOpacity="0.5" />
      </svg>
    ),
    accent: '#c8dbf0',
  },
  {
    id: 'cold',
    title: 'COLD\nRESISTANCE',
    description: 'Rated to -50°C sustained. Proprietary aerogel matrix retains thermal efficiency even when wet.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-10 h-10">
        <line x1="20" y1="4" x2="20" y2="36" />
        <line x1="4" y1="20" x2="36" y2="20" />
        <line x1="8.5" y1="8.5" x2="31.5" y2="31.5" />
        <line x1="31.5" y1="8.5" x2="8.5" y2="31.5" />
        <circle cx="20" cy="20" r="4" />
      </svg>
    ),
    accent: '#8aafd0',
  },
  {
    id: 'precision',
    title: 'TECHNICAL\nPRECISION',
    description: 'Pattern engineered for biomechanical movement mapping. Zero restriction at any shoulder angle.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-10 h-10">
        <circle cx="20" cy="20" r="14" />
        <circle cx="20" cy="20" r="3" />
        <line x1="20" y1="6" x2="20" y2="14" />
        <line x1="20" y1="26" x2="20" y2="34" />
        <line x1="6" y1="20" x2="14" y2="20" />
        <line x1="26" y1="20" x2="34" y2="20" />
      </svg>
    ),
    accent: '#6f8ba4',
  },
  {
    id: 'minimal',
    title: 'MINIMAL\nDESIGN',
    description: 'No noise. No excess. A visual language stripped to its functional core, inspired by industrial architecture.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-10 h-10">
        <rect x="8" y="8" width="24" height="24" />
        <rect x="14" y="14" width="12" height="12" />
        <line x1="8" y1="8" x2="14" y2="14" />
        <line x1="32" y1="8" x2="26" y2="14" />
        <line x1="32" y1="32" x2="26" y2="26" />
        <line x1="8" y1="32" x2="14" y2="26" />
      </svg>
    ),
    accent: '#415770',
  },
];

const BrandValues = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    animationController.registerGroup('BrandValuesEntrance', () => {
      animationController.gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          duration: 1, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );
    }, sectionRef);
    return () => animationController.unregisterGroup('BrandValuesEntrance');
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-28 md:py-40 overflow-hidden bg-[#1a2533]">
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
      />

      {/* Header */}
      <div className="px-6 md:px-20 mb-20 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-[10px] tracking-[0.4em] text-#6f8ba4 uppercase mb-4 font-light">Our Principles</p>
            <h2 className="font-bebas text-[10vw] sm:text-[7vw] md:text-[5vw] leading-none text-white">
              BRAND VALUES
            </h2>
          </div>
          <p className="text-[13px] text-white/35 max-w-xs font-light leading-relaxed">
            Four principles that govern every decision — from material sourcing to final stitching.
          </p>
        </div>
      </div>

      {/* Cards grid */}
      <div className="px-6 md:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VALUES.map((v, i) => (
            <div
              key={v.id}
              ref={(el) => cardsRef.current[i] = el}
              className="value-card group relative p-8 rounded-sm cursor-default opacity-0"
              style={{
                background: 'linear-gradient(135deg, rgba(30,45,61,0.6) 0%, rgba(20,31,43,0.6) 100%)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(8px)',
                transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease, border-color 0.4s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = `0 30px 60px rgba(0,0,0,0.4), 0 0 40px ${v.accent}18`;
                e.currentTarget.style.borderColor = `${v.accent}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
              }}
            >
              {/* Accent corner */}
              <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none">
                <div
                  className="absolute -top-6 -right-6 w-12 h-12 rotate-45 opacity-30"
                  style={{ background: v.accent }}
                />
              </div>

              {/* Icon */}
              <div
                className="mb-8 transition-transform duration-500 group-hover:scale-110"
                style={{ color: v.accent }}
              >
                {v.icon}
              </div>

              {/* Title */}
              <h3 className="font-bebas text-2xl leading-tight text-white whitespace-pre-line mb-4">
                {v.title}
              </h3>

              {/* Divider */}
              <div className="w-6 h-px mb-4 transition-all duration-500 group-hover:w-12"
                style={{ background: v.accent }} />

              {/* Description */}
              <p className="text-[12px] text-white/40 leading-relaxed font-light">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandValues;
