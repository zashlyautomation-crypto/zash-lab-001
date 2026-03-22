import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilter } from '../store/catalogSlice';
import animationController from '../utils/AnimationController';

const filters = ['ALL', 'WHITE', 'SILVER', 'BLACK', 'BLUE'];

const ProductGrid = () => {
    const dispatch = useDispatch();
    const { products, activeFilter } = useSelector((state) => state.catalog);
    const sectionRef = useRef(null);
    const gridRef = useRef(null);

    useEffect(() => {
        animationController.registerGroup('CatalogHeader', () => {
            animationController.gsap.fromTo('.filter-btn',
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.1,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                    }
                }
            );

            // Batch Reveal for Product Cards
            animationController.createBatch('.grid-item', (elements) => {
                animationController.gsap.fromTo(elements,
                    { opacity: 0, y: 30, scale: 0.95 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1, 
                        stagger: 0.1, 
                        duration: 0.8, 
                        ease: 'power3.out',
                        overwrite: true 
                    }
                );
            });
        }, sectionRef);

        return () => animationController.unregisterGroup('CatalogHeader');
    }, []);

    // Animate items on filter change manually for instant feedback
    useEffect(() => {
        if (!gridRef.current) return;
        
        const cards = gridRef.current.querySelectorAll('.grid-item');
        animationController.gsap.fromTo(cards, 
            { opacity: 0, scale: 0.9, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }
        );
    }, [activeFilter]);

    const filteredProducts = products.filter(p => {
        if (activeFilter === 'ALL') return true;
        return p.colors.includes(activeFilter.toLowerCase());
    });

    return (
        <section ref={sectionRef} className="relative w-full py-24 px-8 md:px-16" id="collection">
            <div className="max-w-7xl mx-auto">

                {/* Header & Filters */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-snow/10 pb-8">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bebas tracking-wider mb-2">CATALOG // 01</h2>
                        <p className="text-xs font-inter tracking-[0.2em] text-snow/50 uppercase">Extreme Cold Line</p>
                    </div>

                    <div className="flex space-x-4 mt-8 md:mt-0">
                        {filters.map(f => (
                            <button
                                key={f}
                                onClick={() => dispatch(setFilter(f))}
                                className={`filter-btn text-xs font-inter tracking-widest uppercase px-4 py-2 border transition-colors ${activeFilter === f
                                    ? 'border-snow bg-snow text-steel-dark font-medium'
                                    : 'border-snow/20 text-snow/60 hover:border-snow hover:text-snow bg-steel-dark/50 backdrop-blur-sm'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="grid-item group relative bg-[#4c6278]/20 backdrop-blur-md border border-snow/5 hover:border-snow/30 p-6 flex flex-col items-center hover:shadow-[0_10px_40px_rgba(0,0,0,0.2)] transition-all duration-500"
                        >
                            {/* Image Area */}
                            <div className="w-full h-[400px] mb-8 relative flex items-center justify-center overflow-hidden mix-blend-luminosity opacity-80 group-hover:opacity-100 group-hover:mix-blend-normal transition-all duration-500">
                                <div className="absolute inset-0 bg-linear-to-b from-transparent to-steel-dark/50"></div>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                            </div>

                            {/* Details */}
                            <div className="w-full text-left">
                                <h3 className="text-xl font-bebas tracking-wider mb-1 uppercase">{product.name}</h3>
                                <div className="flex justify-between items-end">
                                    <div className="flex items-center space-x-2">
                                        {product.colors.map(c => (
                                            <div key={c} className="flex items-center">
                                                <span className={`w-2 h-2 rounded-full mr-1 border border-snow/30 ${c === 'white' ? 'bg-white' :
                                                    c === 'black' ? 'bg-black' :
                                                        c === 'silver' ? 'bg-gray-300' :
                                                            c === 'blue' ? 'bg-blue-500' :
                                                                c === 'navy' ? 'bg-blue-900' : 'bg-transparent'
                                                    }`}></span>
                                                <span className="text-[10px] font-inter uppercase text-snow/50 tracking-widest">{c}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-sm font-inter tracking-wider text-ice">${product.price}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="w-full py-24 text-center text-snow/50 font-inter tracking-widest uppercase text-sm">
                        No products found matching this filter.
                    </div>
                )}

            </div>
        </section>
    );
};

export default ProductGrid;
