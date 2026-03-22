import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import animationController from '../utils/AnimationController';
import { getAssetPath } from '../utils/pathUtils';

// ─── Data ───────────────────────────────────────────────────────────────
const heroProducts = [
    {
        id: 1,
        name: 'ARTIC 01™',
        price: '$899.99',
        subtitle: 'SERIES: KINGS No. 1 // DROP 1',
        colors: ['WHITE', 'SILVER'],
        sizes: ['S', 'M', 'L', 'XL'],
        img: getAssetPath('/images/character1.png'),
        thumb: getAssetPath('/images/character1.png')
    },
    {
        id: 2,
        name: 'STEALTH 02™',
        price: '$949.99',
        subtitle: 'SERIES: KINGS No. 1 // DROP 2',
        colors: ['BLACK', 'CHARCOAL'],
        sizes: ['S', 'M', 'L', 'XL'],
        img: getAssetPath('/images/character2.png'),
        thumb: getAssetPath('/images/character2.png')
    }
];

// ─── Social SVG Icons ────────────────────────────────────────────────────
const IconIG = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
);
const IconFB = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);
const IconTW = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
);

const Hero = () => {
    const [activeIdx, setActiveIdx] = useState(0);
    const [activeColor, setActiveColor] = useState(0);
    const sectionRef = useRef(null);
    const audioRef = useRef(null);
    const carouselRef = useRef(null);
    const scrollTimeout = useRef(null);
    const characterRef = useRef(null);

    const p = heroProducts[activeIdx];
    const totalProducts = heroProducts.length;

    // Mouse parallax tracking using animationController's gsap
    useEffect(() => {
        const xTo = animationController.gsap.quickTo(characterRef.current, 'x', { duration: 0.8, ease: 'power3' });
        const yTo = animationController.gsap.quickTo(characterRef.current, 'y', { duration: 0.8, ease: 'power3' });

        const onMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 40;
            const y = (e.clientY / window.innerHeight - 0.5) * 30;
            xTo(x);
            yTo(y);
        };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, []);

    // Intro Animation Sequence
    useLayoutEffect(() => {
        animationController.registerGroup('HeroIntro', () => {
            const isMobile = window.innerWidth < 768;
            const tl = animationController.gsap.timeline();

            animationController.gsap.set('.hero-bg', { opacity: 0 });
            animationController.gsap.set('.hero-graffiti', { opacity: 0, scale: 1.05 });
            animationController.gsap.set('.hero-character', { opacity: 0, scale: isMobile ? 0.96 : 0.92 });
            animationController.gsap.set('.hero-title-inner', { opacity: 0, x: isMobile ? -15 : -40 });
            animationController.gsap.set('.hero-controls', { opacity: 0, y: isMobile ? 12 : 24 });
            animationController.gsap.set('.hero-carousel-item', { opacity: 0, x: isMobile ? 20 : 40 });
            animationController.gsap.set('.hero-socials', { opacity: 0 });

            tl.delay(1.2); // Sync with Preloader Logo Fade (duration 1.2)
            tl.to('.hero-bg', { opacity: 1, duration: 0.6, ease: 'power2.inOut' })
                .to('.hero-graffiti', { opacity: 0.07, scale: 1, duration: 1.0, ease: 'power2.out' }, '-=0.2')
                .to('.hero-character', { opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out' }, '-=0.6')
                .to('.hero-title-inner', { opacity: 1, x: 0, duration: 0.75, ease: 'power3.out' }, '-=0.7')
                .to('.hero-controls', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.55')
                .to('.hero-carousel-item', { opacity: 1, x: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }, '-=0.5')
                .to('.hero-socials', { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3');
        }, sectionRef);

        return () => animationController.unregisterGroup('HeroIntro');
    }, []);

    // Product Switch Animation
    useEffect(() => {
        const tl = animationController.gsap.timeline();
        tl.to('.hero-character-img', { opacity: 0, scale: 0.9, duration: 0.4, ease: 'power2.in' })
            .to('.hero-title-inner', { opacity: 0, x: 20, duration: 0.3 }, 0)
            .call(() => {
                // State update mid-animation
            })
            .set('.hero-title-inner', { x: -20 })
            .to('.hero-character-img', { opacity: 1, scale: 1.15, duration: 0.6, ease: 'power3.out' })
            .to('.hero-title-inner', { opacity: 1, x: 0, duration: 0.4 }, '-=0.4');
    }, [activeIdx]);

    const switchProduct = (idx) => {
        if (idx === activeIdx) return;
        setActiveIdx(idx);
        setActiveColor(0);
    };

    const handleCarouselScroll = (e) => {
        if (window.innerWidth >= 768) return;
        const target = e.target;
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

        scrollTimeout.current = setTimeout(() => {
            const scrollLeft = target.scrollLeft;
            const containerWidth = target.offsetWidth;
            const itemWidth = containerWidth > 0 ? (target.scrollWidth / totalProducts) : 0;
            if (itemWidth > 0) {
                const idx = Math.round(scrollLeft / itemWidth);
                if (idx !== activeIdx && idx >= 0 && idx < totalProducts) {
                    switchProduct(idx);
                }
            }
        }, 80);
    };

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-[#0d1520] max-md:h-auto! md:overflow-hidden overflow-x-hidden hide-scroll" style={{ height: '100vh', minHeight: '600px' }}
        >
            {/* ══════════ BACKGROUND ══════════ */}
            <div className="hero-bg absolute inset-0 z-0 pointer-events-none">
                <div
                    className="absolute inset-0 bg-center bg-cover bg-no-repeat"
                    style={{ backgroundImage: `url('${getAssetPath('/images/hero-section-bg.png')}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-right from-[#0d1520]/85 via-[#0d1520]/30 to-[#0d1520]/55" />
                <div className="absolute inset-0 bg-gradient-to-bottom from-[#0d1520]/60 via-transparent to-[#0d1520]/70" />
            </div>

            {/* ══════════ GRAFFITI WATERMARK ══════════ */}
            <div
                className="hero-graffiti absolute inset-0 z-1 flex items-center justify-center pointer-events-none overflow-hidden"
                style={{ mixBlendMode: 'screen' }}
            >
                <div
                    className="w-[70%] h-[80%] bg-contain bg-center bg-no-repeat opacity-0"
                    style={{ backgroundImage: `url('${getAssetPath('/images/hero-section-bg.png')}')` }}
                />
            </div>

            {/* ══════════ MAIN LAYOUT LAYER (z-20) ══════════ */}
            <div className="relative z-20 w-full max-md:h-auto md:h-full flex flex-col md:flex-row items-stretch px-6 md:px-14 lg:px-20 pt-24 md:pt-[80px] pb-12 md:pb-10 md:overflow-hidden overflow-x-hidden">

                {/* ─── LEFT COLUMN ─── */}
                <div className="flex flex-col justify-between pt-0 md:pt-[80px] pb-0 md:pb-10 w-full md:w-[42%] shrink-0 max-md:contents z-20">

                    {/* Top: title */}
                    <div className="hero-title order-1 max-md:w-full mt-0 md:pt-10 z-20 relative">
                        <div className="hero-title-inner">
                            <p className="text-[9px] md:text-[10px] tracking-[0.32em] text-white/45 mb-3 md:mb-5 uppercase font-light">
                                {p.subtitle}
                            </p>
                            <h1 className="font-bebas leading-[0.82] md:leading-[0.88] text-white drop-shadow-2xl"
                                style={{ fontSize: 'clamp(2.5rem, 10vw, 6rem)', letterSpacing: '-0.01em' }}>
                                COLLECTION<br />
                                {p.name}
                            </h1>
                        </div>
                    </div>

                    {/* ─── CHARACTER ─── */}
                    <div className="hero-character absolute md:absolute md:inset-0 z-10 flex items-center justify-center pointer-events-none order-2 md:order-0 h-[70vh] md:h-[115%] w-full max-md:top-[12%] md:top-[10%]">
                        <img
                            ref={characterRef}
                            src={p.img}
                            alt={p.name}
                            draggable="false"
                            className="hero-character-img h-full w-auto max-w-none object-contain transform-gpu"
                            style={{ filter: 'drop-shadow(0px 50px 80px rgba(0,0,0,0.8))' }}
                        />
                    </div>

                    {/* Bottom: controls */}
                    <div className="hero-controls flex flex-col gap-0 order-3 max-md:w-full max-md:mt-0 z-20 relative">
                        <div className="flex items-center gap-4 md:gap-6 mb-7 md:mb-9">
                            <span className="text-[9px] tracking-[0.28em] text-white/40 uppercase w-14 shrink-0">COLOUR</span>
                            <div className="flex gap-4 md:gap-5">
                                {p.colors.map((c, i) => (
                                    <button
                                        key={c}
                                        onClick={() => setActiveColor(i)}
                                        className={`text-[10px] tracking-widest transition-all duration-250 ${activeColor === i ? 'text-white border-b border-white pb-px' : 'text-white/35 hover:text-white/65'}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-5">
                            <div>
                                <span className="text-[1.65rem] font-inter font-light text-white tracking-tight inline-block">
                                    {p.price}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hidden md:block flex-1 z-10 pointer-events-none" />

                {/* ─── RIGHT CAROUSEL COLUMN ─── */}
                <div className="flex flex-col md:justify-center max-md:items-start md:items-end gap-3 max-md:pt-8 md:pt-[80px] pb-0 md:pb-10 w-full md:w-[210px] lg:w-[240px] shrink-0 order-4 md:order-0 z-20 relative">
                    <div ref={carouselRef} onScroll={handleCarouselScroll}
                        className="flex max-md:flex-row md:flex-col gap-4 md:gap-[10px] w-full flex-1 max-md:overflow-x-auto max-md:snap-x max-md:snap-mandatory hide-scroll max-md:-mx-6 max-md:px-6 max-md:pb-6">
                        {heroProducts.map((pData, i) => (
                            <div key={pData.id} onClick={() => switchProduct(i)}
                                className={`hero-carousel-item relative cursor-pointer transition-all duration-500 overflow-hidden shrink-0 max-md:w-[260px] max-md:snap-center md:w-full md:flex-1 ${activeIdx === i ? 'border border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.12)]' : 'border border-white/12 opacity-55 hover:opacity-85 hover:border-white/25'}`}
                                style={{ minHeight: '130px', borderRadius: '4px' }}>
                                <div className={`absolute inset-0 transition-opacity duration-500 ${activeIdx === i ? 'opacity-100' : 'opacity-0'}`}
                                    style={{ background: 'linear-gradient(135deg, #2a3f55 0%, #1c2e40 100%)' }} />
                                <div className="absolute inset-0 bg-[#0d1520]/70" />
                                <img src={pData.thumb} alt="" className="absolute inset-0 w-full h-[115%] object-contain -bottom-4 left-0 pointer-events-none" style={{ top: '-5%' }} />
                                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-top from-black/70 to-transparent z-10" />
                                <div className="absolute bottom-3 right-3 text-[9px] tracking-[0.2em] text-white/70 z-20 font-inter">0{i + 1}</div>
                            </div>
                        ))}
                    </div>

                    {/* Progress indicator (Desktop) */}
                    <div className="hidden md:flex items-center gap-2 mt-2 self-start w-full">
                        <span className="text-[10px] tracking-[0.15em] text-white/70 font-inter tabular-nums">0{activeIdx + 1}</span>
                        <div className="flex-1 h-px bg-white/25 relative">
                            <div className="absolute top-0 left-0 h-full bg-white/70 transition-all duration-500"
                                style={{ width: `${((activeIdx + 1) / totalProducts) * 100}%` }} />
                        </div>
                        <span className="text-[10px] tracking-[0.15em] text-white/35 font-inter">0{totalProducts}</span>
                    </div>
                </div>
            </div>

            <div className="hero-socials hidden md:flex absolute bottom-7 right-8 md:right-14 lg:right-20 z-30 gap-2">
                {[<IconIG key="ig" />, <IconFB key="fb" />, <IconTW key="tw" />].map((Icon, i) => (
                    <a key={i} href="#" className="w-7 h-7 border border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:border-white/55 transition-all duration-300">
                        {Icon}
                    </a>
                ))}
            </div>

            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-right from-transparent via-white/10 to-transparent z-20" />
            <style dangerouslySetInnerHTML={{ __html: `.hide-scroll::-webkit-scrollbar { display: none; } .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }` }} />
        </section>
    );
};

export default Hero;