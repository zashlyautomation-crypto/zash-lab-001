import React, { useRef, useEffect } from 'react';
import animationController from '../utils/AnimationController';

const Footer = () => {
    const footerRef = useRef(null);
    const mountainRef = useRef(null);
    const graffitiRef = useRef(null);
    const contentRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const mountain = mountainRef.current;
        const container = containerRef.current;
        const gsap = animationController.gsap;

        // 3D Tilt Effect
        const handleMouseMove = (e) => {
            if (!container || !mountain) return;
            const { clientX, clientY } = e;
            const { width, height, left, top } = container.getBoundingClientRect();

            const xPos = (clientX - left) / width - 0.5;
            const yPos = (clientY - top) / height - 0.5;

            gsap.to(mountain, {
                duration: 1,
                rotationY: xPos * 12,
                rotationX: -yPos * 10,
                x: xPos * 20,
                ease: "power2.out"
            });

            gsap.to(graffitiRef.current, {
                duration: 1.5,
                x: xPos * -30,
                y: yPos * -10,
                ease: "power2.out"
            });
        };

        const handleMouseLeave = () => {
            gsap.to([mountain, graffitiRef.current], {
                duration: 1.5,
                rotationY: 0,
                rotationX: 0,
                x: 0,
                y: 0,
                ease: "elastic.out(1, 0.6)"
            });
        };

        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
            container.addEventListener('mouseleave', handleMouseLeave);
        }

        // Reveal Animation
        animationController.registerGroup('FooterReveal', () => {
            if (contentRef.current) {
                gsap.fromTo(contentRef.current.querySelectorAll('.reveal-text'),
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1.5,
                        stagger: 0.1,
                        ease: "power4.out",
                        scrollTrigger: {
                            trigger: footerRef.current,
                            start: "top 80%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            }
        }, footerRef);

        return () => {
            if (container) {
                container.removeEventListener('mousemove', handleMouseMove);
                container.removeEventListener('mouseleave', handleMouseLeave);
            }
            animationController.unregisterGroup('FooterReveal');
        };
    }, []);

    return (
        <footer
            ref={footerRef}
            className="relative w-full min-h-[700px] bg-[#223344] flex flex-col justify-end overflow-hidden"
        >
            {/* GOOGLE FONTS IMPORT for Graffiti Script */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Sedgwick+Ave+Display&display=swap');
                .font-graffiti { font-family: 'Sedgwick Ave Display', cursive; }
                .text-stroke-none { -webkit-text-stroke: 0; }
            `}} />

            {/* Background Image Layer */}
            <div
                className="absolute inset-0 opacity-80 pointer-events-none "
                style={{
                    backgroundImage: "url('/images/footer/footer-bg.png')",
                    backgroundAttachment: 'fixed',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            {/* Atmospheric Gradients */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-[#223344] to-transparent z-1 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/40 via-transparent to-transparent z-1 pointer-events-none" />

            <div
                ref={containerRef}
                className="relative w-full h-full p-10 md:p-20 lg:p-24 perspective-2000"
            >



                {/* 3. LARGE STYLIZED GRAFFITI BACKGROUND ( behind mountain ) */}
                <div
                    ref={graffitiRef}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-2"
                >
                    <h2
                        className="text-[35vw] font-graffiti text-white opacity-10 leading-none tracking-tighter blur-2xl scale-125"
                    >

                    </h2>
                </div>

                {/* 4. MOUNTAIN FOREGROUND */}
                <div
                    ref={mountainRef}
                    className="absolute bottom-0 left-0 w-full h-full flex items-end justify-center pointer-events-none"
                    style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
                >
                    <img
                        src="/images/footer/mountain.png"
                        alt="Mountain"
                        className="w-screen h-screen object-cover object-bottom drop-shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
                    />
                </div>

                {/* 5. SLOGAN (BOTTOM LEFT) & BOTTOM RIGHT DETAILS */}
                <div
                    ref={contentRef}
                    className="absolute bottom-26 left-10 md:bottom-20 md:left-20 lg:left-24 right-10 md:right-20 lg:right-24 z-10 flex items-end justify-between font-bebas text-white"
                >
                    {/* Left: Main Slogan (SOLID WHITE) */}
                    <div className="flex flex-col text-left tracking-tight reveal-text">
                        <span className="text-4xl md:text-8xl lg:text-[7rem] drop-shadow-2xl opacity-100">BUILT FOR COLD</span>
                        <span className="text-4xl md:text-8xl lg:text-[6rem] drop-shadow-2xl opacity-100">MADE FOR HEIGHT</span>
                        <span className="text-5xl md:text-8xl lg:text-[5rem] drop-shadow-2xl opacity-100">FORGED TO LAST</span>
                    </div>

                    {/* Right: Copyright & Barcode */}
                    <div className="flex items-center gap-6 pb-6 reveal-text">
                        <div className="flex flex-col items-end gap-1 text-[9px] font-inter tracking-[0.2em] text-white uppercase font-light">
                            <span>©2026 ZASH WEAR</span>
                            <span>ALL RIGHTS RESERVED</span>
                        </div>

                        {/* Vertical Barcode SVG */}
                        <div className="w-12 h-10 opacity-60 invert">
                            <svg viewBox="0 0 40 20" className="w-full h-full">
                                <rect x="0" y="0" width="2" height="20" fill="white" />
                                <rect x="4" y="0" width="1" height="20" fill="white" />
                                <rect x="7" y="0" width="3" height="20" fill="white" />
                                <rect x="12" y="0" width="1" height="20" fill="white" />
                                <rect x="15" y="0" width="2" height="20" fill="white" />
                                <rect x="20" y="0" width="1" height="20" fill="white" />
                                <rect x="23" y="0" width="4" height="20" fill="white" />
                                <rect x="29" y="0" width="1" height="20" fill="white" />
                                <rect x="32" y="0" width="2" height="20" fill="white" />
                                <rect x="36" y="0" width="3" height="20" fill="white" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .perspective-2000 {
                    perspective: 2000px;
                }
            `}} />
        </footer>
    );
};

export default Footer;
