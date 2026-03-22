import { useState, useEffect, useRef } from 'react';
import animationController from '../utils/AnimationController';
import { useDispatch } from 'react-redux';
import { products } from '../data/products';
import { selectProduct } from '../store/productSlice';


const CatalogSection = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [carouselPage, setCarouselPage] = useState(0);
    const containerRef = useRef(null);
    const drawerRef = useRef(null);
    const overlayRef = useRef(null);
    const dispatch = useDispatch();

    const gridProducts = products.slice(0, 8);
    const carouselProducts = products.slice(8);
    const itemsPerPage = 6;
    const totalPages = Math.ceil(carouselProducts.length / itemsPerPage);

    useEffect(() => {
        animationController.registerGroup('CatalogSectionEntrance', () => {
            animationController.gsap.fromTo('.catalog-card',
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 80%',
                    }
                }
            );
        }, containerRef);

        return () => animationController.unregisterGroup('CatalogSectionEntrance');
    }, []);

    // Drawer Animation Logic
    useEffect(() => {
        if (isFilterOpen) {
            animationController.gsap.to(overlayRef.current, { opacity: 1, duration: 0.4, display: 'block' });
            animationController.gsap.to(drawerRef.current, { x: 0, duration: 0.6, ease: 'power4.out' });
        } else {
            animationController.gsap.to(drawerRef.current, { x: '100%', duration: 0.5, ease: 'power4.in' });
            animationController.gsap.to(overlayRef.current, { opacity: 0, duration: 0.4, display: 'none' });
        }
    }, [isFilterOpen]);

    const handleProductClick = (product) => {
        dispatch(selectProduct(product));
    };

    return (
        <section ref={containerRef} className="relative w-full pt-12 pb-24 md:py-24 px-6 md:px-12 bg-[#3c5064]/20" id="catalog">
            <div className="max-w-[1600px] mx-auto">

                {/* Header */}
                <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-8">
                    <div className="flex items-center gap-12">
                        <h2 className="text-5xl md:text-7xl font-bebas tracking-tighter">NEW COLLECTION</h2>
                        <div className="hidden lg:flex gap-8 text-[10px] font-inter tracking-[0.2em] text-white/40 uppercase">
                            <span>[ NEW COLLECTION ]</span>
                            <span>[ SEASON_01 ]</span>
                            <span>[ FW2026 ]</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex flex-col text-[10px] font-inter tracking-widest text-white/30 text-right">
                            <span>PUFFER JACKETS</span>
                            <span>METAL EDITION</span>
                            <span>CLOTH SERIES</span>
                            <span>EXTREME COLD LINE</span>
                        </div>
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="px-6 py-2 rounded-full border border-white/20 hover:border-white transition-colors text-[11px] font-inter tracking-[0.2em] bg-white/5 backdrop-blur-md uppercase"
                        >
                            Filters
                        </button>
                    </div>
                </div>

                {/* Grid Structure: Strictly 5 columns on desktop */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-24">

                    {/* Row 1: Poster Card (2 cols) + 3 Product Cards */}
                    <div className="col-span-2 aspect-square lg:aspect-[1.2/1] overflow-hidden rounded-2xl">
                        <img
                            src="/images/poster/2bf6a9f8-5467-4ce6-866a-a16dea55c11d.png"
                            alt="Aurora Collection"
                            className="w-full h-4/5 object-cover rounded-2xl"
                        />
                    </div>

                    {gridProducts.slice(0, 3).map((product) => (
                        <ProductCard key={product.id} product={product} onClick={() => handleProductClick(product)} />
                    ))}

                    {/* Row 2: 5 Product Cards */}
                    {gridProducts.slice(3, 8).map((product) => (
                        <ProductCard key={product.id} product={product} onClick={() => handleProductClick(product)} />
                    ))}
                </div>

                {/* Carousel Section: Only if products > 8 */}
                {carouselProducts.length > 0 && (
                    <div className="mt-32 pt-24 border-t border-white/5">
                        <div className="flex justify-between items-center mb-12 px-2">
                            <div>
                                <h4 className="text-3xl font-bebas tracking-wider opacity-80 mb-2">EXTENDED CATALOG</h4>
                                <p className="text-[10px] font-inter tracking-[0.3em] text-white/30 uppercase">Page {carouselPage + 1} of {totalPages}</p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setCarouselPage(Math.max(0, carouselPage - 1))}
                                    disabled={carouselPage === 0}
                                    className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-all ${carouselPage === 0 ? 'opacity-20' : 'hover:bg-white/10'}`}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="1.5" /></svg>
                                </button>
                                <button
                                    onClick={() => setCarouselPage(Math.min(totalPages - 1, carouselPage + 1))}
                                    disabled={carouselPage === totalPages - 1}
                                    className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-all ${carouselPage === totalPages - 1 ? 'opacity-20' : 'hover:bg-white/10'}`}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="1.5" /></svg>
                                </button>
                            </div>
                        </div>
                        <div className="relative overflow-hidden">
                            <div
                                style={{
                                    transform: `translateX(-${carouselPage * 100}%)`,
                                    transition: 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)'
                                }}
                                className="flex"
                            >
                                {Array.from({ length: totalPages }).map((_, pageIdx) => (
                                    <div key={`page-${pageIdx}`} className="shrink-0 w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                                        {carouselProducts.slice(pageIdx * itemsPerPage, (pageIdx + 1) * itemsPerPage).map((p) => (
                                            <ProductCard key={`carousel-${p.id}`} product={p} minimal onClick={() => handleProductClick(p)} />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Overlay */}
            <div
                ref={overlayRef}
                onClick={() => setIsFilterOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-150 opacity-0 hidden"
            />

            {/* Filter Drawer */}
            <div
                ref={drawerRef}
                style={{ transform: 'translateX(100%)' }}
                className="fixed top-0 right-0 w-full max-w-md h-full bg-[#1a2533] z-160 p-12 shadow-2xl overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-16">
                    <h2 className="text-3xl font-bebas tracking-widest">FILTERS</h2>
                    <button onClick={() => setIsFilterOpen(false)} className="text-white/40 hover:text-white transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" /></svg>
                    </button>
                </div>

                <FilterGroup title="COLOR" options={['WHITE', 'BLACK', 'NAVY', 'SILVER', 'GREEN', 'PURPLE', 'RED', 'BROWN']} />
                <FilterGroup title="COLLECTION" options={['WINTER FW26', 'METAL SERIES', 'ARCTIC']} />
                <FilterGroup title="PRICE" options={['$0 - $500', '$500 - $1000', '$1000+']} />
                <FilterGroup title="SORT BY" options={['NEWEST', 'PRICE: LOW - HIGH', 'PRICE: HIGH - LOW']} />

                <button
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full py-4 mt-8 bg-white text-[#1a2533] font-bebas tracking-widest text-lg hover:bg-ice transition-colors"
                >
                    APPLY FILTERS
                </button>
            </div>
        </section>
    );
};

const ProductCard = ({ product, minimal = false, onClick }) => {
    return (
        <div
            className={`catalog-card relative group flex flex-col cursor-pointer transition-transform duration-500 hover:-translate-y-2`}
            onClick={onClick}
        >
            <div
                className={`relative aspect-0.75/1 flex items-center justify-center transition-all duration-500 bg-[#7c9ab8]/30 group-hover:bg-[#7c9ab8]/50 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)]`}
                style={{
                    clipPath: 'polygon(12% 0, 100% 0, 100% 88%, 88% 100%, 0 100%, 0 12%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
            >
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-700 drop-shadow-2xl group-hover:scale-105"
                />
            </div>

            <div className="mt-6 flex flex-col gap-1">
                <div className="text-[10px] font-inter tracking-widest text-white/40 uppercase">{product.category}</div>
                <div className="flex justify-between items-start">
                    <h4 className="text-xl font-bebas tracking-wider leading-none">{product.name}</h4>
                    {!minimal && <div className="text-sm font-inter tracking-widest text-ice font-semibold leading-none">${product.price}</div>}
                </div>
                {!minimal && (
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: product.colorHex }}></div>
                        <span className="text-[9px] font-inter tracking-widest text-white/30 uppercase">{product.color}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const FilterGroup = ({ title, options }) => (
    <div className="mb-12">
        <h4 className="text-xs font-inter tracking-[0.3em] text-white/30 mb-6 border-b border-white/5 pb-2 uppercase">{title}</h4>
        <div className="flex flex-wrap gap-3">
            {options.map((opt) => (
                <button key={opt} className="px-4 py-1.5 text-[10px] font-inter tracking-widest border border-white/10 hover:border-white transition-colors uppercase">
                    {opt}
                </button>
            ))}
        </div>
    </div>
);

export default CatalogSection;
