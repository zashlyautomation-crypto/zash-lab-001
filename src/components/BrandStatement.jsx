import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const BrandStatement = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo('.statement-text',
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.5,
                    stagger: 0.2,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 60%',
                    }
                }
            );

            gsap.fromTo('.statement-image',
                { scale: 1.1, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 2,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 70%',
                    }
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative w-full py-32 px-8 md:px-16" id="about">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">

                <div className="w-full md:w-1/2">
                    <h2 className="text-6xl md:text-8xl font-bebas leading-[0.85] tracking-tighter mb-12 mix-blend-screen text-transparent bg-clip-text bg-linear-to-br from-snow via-snow/80 to-snow/10">
                        <div className="statement-text overflow-hidden"><span className="block">BUILT FOR COLD</span></div>
                        <div className="statement-text overflow-hidden"><span className="block">MADE FOR ALTITUDE</span></div>
                        <div className="statement-text overflow-hidden"><span className="block text-ice">ENGINEERED FOR</span></div>
                        <div className="statement-text overflow-hidden"><span className="block text-ice">THE FUTURE</span></div>
                    </h2>

                    <div className="statement-text mt-8 text-sm font-inter tracking-widest font-light leading-relaxed text-snow/60 border-l border-snow/20 pl-8 max-w-md uppercase">
                        LAB 001 was born in extreme conditions, not as a trend, but as a response to the unyielding forces of nature. tactical, brutalist, and elegant.
                        <br /><br />
                        [ PROTOCOL: ALTITUDE_001.33 ]
                    </div>
                </div>

                <div className="w-full md:w-1/2 h-[500px] md:h-[800px] relative statement-image overflow-hidden bg-steel-dark border border-snow/10">
                    <div className="absolute inset-0 bg-linear-to-br from-ice/5 to-transparent z-10"></div>
                    {/* USER WILL INSERT ATMOSPHERIC IMAGE HERE */}
                    <div className="absolute inset-0 flex items-center justify-center text-snow/20 font-inter tracking-widest text-xs uppercase z-20">
                        [ Atmospheric Image Placeholder ]
                    </div>
                    <img
                        src="/images/placeholder_brand.png"
                        alt="Atmosphere"
                        className="w-full h-full object-cover mix-blend-overlay opacity-30 grayscale blur-[2px]"
                    />
                </div>

            </div>
        </section>
    );
};

export default BrandStatement;
