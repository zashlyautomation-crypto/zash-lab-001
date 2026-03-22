import React, { useEffect, useRef } from 'react';
import animationController from '../utils/AnimationController';

const NewCollection = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        animationController.registerGroup('NewCollectionReveal', () => {
            animationController.gsap.fromTo('.collection-item',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 80%',
                    }
                }
            );
        }, containerRef);

        return () => animationController.unregisterGroup('NewCollectionReveal');
    }, []);

    return (
        <section ref={containerRef} className="relative w-full py-24 px-8 md:px-16" id="new-arrivals">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-16 collection-item">
                    <h2 className="text-5xl md:text-7xl font-bebas font-semibold tracking-tighter">NEW COLLECTION</h2>
                    <div className="hidden md:flex text-xs font-inter tracking-[0.2em] text-snow/50 flex-col items-end">
                        <span>[ 2026_SEASON ]</span>
                        <span>WINTER DROP 01</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Main Large Card */}
                    <div className="lg:col-span-6 h-[500px] md:h-[700px] collection-item relative group overflow-hidden bg-steel-dark/30 backdrop-blur-sm border border-snow/10 hover:border-snow/40 transition-all duration-700 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:-translate-y-2">
                        <img
                            src="/images/product1.png"
                            alt="Aurora Puffer"
                            className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-70 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out"
                        />
                        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-linear-to-t from-steel-dark/90 to-transparent"></div>

                        <div className="absolute top-6 left-6 text-xs font-inter tracking-widest text-snow bg-snow/10 backdrop-blur-md px-3 py-1 border border-snow/20 uppercase">
                            Featured
                        </div>

                        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                            <div>
                                <h3 className="text-4xl font-bebas tracking-wider mb-2 drop-shadow-lg">AURORA™</h3>
                                <p className="text-xs font-inter tracking-widest text-snow/60 uppercase">Silver Reflective Puffer</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xl font-inter mb-1">$999.99</span>
                                <button className="text-[10px] tracking-widest font-inter border-b border-snow/50 hover:border-snow transition-colors uppercase">
                                    View Details
                                </button>
                            </div>
                        </div>

                        {/* Decal */}
                        <div className="absolute -bottom-8 -right-8 text-9xl font-bebas text-snow/5 font-bold pointer-events-none select-none rotate-12">
                            01
                        </div>
                    </div>

                    {/* Three Vertical Cards */}
                    <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[2, 3, 4].map((id) => (
                            <div key={id} className="h-[400px] lg:h-[700px] collection-item relative group overflow-hidden bg-steel/30 backdrop-blur-sm border border-snow/5 hover:border-snow/30 transition-all duration-500 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:-translate-y-2">
                                <img
                                    src={`/images/product${id}.png`}
                                    alt="Product"
                                    className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-60 group-hover:scale-110 group-hover:opacity-90 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-steel-dark/90 via-steel-dark/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>

                                <div className="absolute bottom-6 left-6 right-6">
                                    <h4 className="text-xl font-bebas tracking-wide mb-1">PROTOTYPE 0{id}</h4>
                                    <p className="text-[10px] font-inter tracking-wider text-snow/50 mb-3 uppercase">Tech Outerwear</p>
                                    <div className="flex justify-between items-center border-t border-snow/10 pt-3 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-500">
                                        <span className="text-xs font-inter tracking-widest">$1,299</span>
                                        <button className="w-8 h-8 rounded-full border border-snow/30 flex items-center justify-center hover:bg-snow hover:text-steel-dark transition-colors">
                                            <svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7 0V14M0 7H14" stroke="currentColor" strokeWidth="1.5" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewCollection;
