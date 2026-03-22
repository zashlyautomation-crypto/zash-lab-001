import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import animationController from '../utils/AnimationController';
import { closeOverlay } from '../store/productSlice';
import { products } from '../data/products';
import cartManager from '../cart/CartManager';
import addToCartAnimator from '../cart/AddToCartAnimator';

// ─── Accordion Item ────────────────────────────────────────────────────────────
const AccordionItem = ({ title, content }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-white/10">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex justify-between items-center py-4 text-left group"
            >
                <span className="text-[11px] font-inter tracking-[0.2em] text-white/50 uppercase group-hover:text-white transition-all font-semibold">
                    {title}
                </span>
                <span
                    className={`text-white transition-transform duration-500 ${open ? 'rotate-180' : ''}`}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0'}`}
            >
                <p className="text-[12px] font-inter leading-relaxed text-white/60 font-medium">
                    {content}
                </p>
            </div>
        </div>
    );
};

// ─── Feature Card ──────────────────────────────────────────────────────────────
const FeatureCard = ({ feature, index }) => (
    <div
        className="po-feature-card flex items-start gap-4 flex-1 min-w-[200px] max-w-[280px] opacity-0"
    >
        <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-[#162332] border border-white/10">
            <img
                src={feature.img}
                alt={feature.title}
                className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700"
            />
        </div>
        <div className="flex flex-col gap-1.5 pt-1">
            <h4 className="text-[11px] font-inter font-extrabold tracking-[0.18em] text-white uppercase">{feature.title}</h4>
            <p className="text-[11px] font-inter leading-snug text-white/40 line-clamp-3 font-medium">{feature.desc}</p>
        </div>
    </div>
);

const ProductOverview = () => {
    const dispatch = useDispatch();
    const { selectedProductId } = useSelector((state) => state.product);

    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColorIdx, setSelectedColorIdx] = useState(0);
    const [showFullDesc, setShowFullDesc] = useState(false);

    const containerRef = useRef(null);

    // Find exact product by ID
    const selectedProduct = products.find(p => p.id === selectedProductId);

    // ── Add to Cart handler ───────────────────────────────────────────────────
    const handleAddToCart = () => {
        if (!selectedProduct) return;

        const currentColorData = selectedProduct.colors?.[selectedColorIdx];

        // 1. Build variant object
        const variant = {
            productID: selectedProduct.id,
            name: selectedProduct.name,
            color: currentColorData?.name || selectedProduct.color,
            size: selectedSize,
            price: parseFloat(selectedProduct.price.replace(',', '')),
            image: currentColorData?.productImg || selectedProduct.image,
        };

        // 2. Business logic runs FIRST — synchronously
        cartManager.addItem(variant);

        // 3. Animation fires after — purely decorative
        const sourceEl = containerRef.current?.querySelector('.po-main-image');
        const targetEl = document.getElementById('cart-icon-el');

        addToCartAnimator.play({
            sourceEl,
            targetEl,
            onComplete: () => dispatch(closeOverlay()),
        });
    };

    // Reset state when product changes
    useEffect(() => {
        if (selectedProduct) {
            setSelectedColorIdx(0);
            setSelectedSize('M');
            setShowFullDesc(false);
        }
    }, [selectedProductId]);

    // GSAP Intro Animation
    useEffect(() => {
        if (!selectedProduct) return;
        if (!containerRef.current) return;

        animationController.registerGroup('ProductOverviewIntro', () => {
            const tl = animationController.gsap.timeline({ defaults: { ease: 'power4.out' } });

            animationController.gsap.set('.po-animate', { opacity: 0, y: 20 });
            animationController.gsap.set('.po-main-image', { opacity: 0, scale: 0.9, y: 40 });
            animationController.gsap.set('.po-side-animate', { opacity: 0, x: 40 });

            tl.to('.po-badge', { opacity: 1, y: 0, duration: 0.6 })
                .to('.po-title', { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
                .to('.po-price', { opacity: 1, y: 0, duration: 0.6 }, '-=0.5')
                .to('.po-desc', { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
                .to('.po-accordion', { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, '-=0.3')
                .to('.po-main-image', { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '-=1.0')
                .to('.po-size-panel', { opacity: 1, x: 0, duration: 0.7 }, '-=0.8')
                .to('.po-color-panel', { opacity: 1, x: 0, duration: 0.7 }, '-=0.5')
                .to('.po-buttons', { opacity: 1, x: 0, duration: 0.6 }, '-=0.4')
                .to('.po-feature-card', { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, '-=0.4');
        }, containerRef);

        return () => animationController.unregisterGroup('ProductOverviewIntro');
    }, [selectedProductId, selectedProduct]);

    if (!selectedProduct) return null;

    const currentColor = selectedProduct.colors?.[selectedColorIdx];
    const mainImage = currentColor?.productImg || selectedProduct.image;
    const shortDesc = selectedProduct.description.split('. ').slice(0, 2).join('. ') + '.';

    return (
        <div
            ref={containerRef}
            className="w-full h-screen relative bg-[#0d1520] overflow-hidden"
        >
            {/* Grain/Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
                style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/asfalt-dark.png")` }}
            />

            {/* back button */}
            <button
                onClick={() => dispatch(closeOverlay())}
                className="absolute top-6 left-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Container */}
            <div className="w-full max-w-[1500px] mx-auto px-6 md:px-12 lg:px-20 py-10 relative z-10 h-full overflow-y-auto">

                {/* ─── Layout Grid ────────────────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-[26%_48%_26%] gap-0 items-start">

                    {/* ─────────────── LEFT PANEL ─────────────── */}
                    <div className="flex flex-col pr-0 lg:pr-12 pt-4">
                        <div className="po-animate po-badge text-[12px] font-inter tracking-[0.3em] text-ice uppercase font-bold mb-4">
                            New Collection
                        </div>

                        <h1 className="po-animate po-title font-bebas tracking-tight text-white border-b border-white/10 leading-[0.88] mb-6"
                            style={{ fontSize: 'clamp(3.5rem, 6vw, 5.5rem)' }}>
                            {selectedProduct.name}
                        </h1>

                        <div className="po-animate po-price text-3xl font-inter font-light text-white/90 mb-10 tracking-tight">
                            ${selectedProduct.price}
                        </div>

                        {/* Product Description */}
                        <div className="po-animate po-desc text-[13px] font-inter leading-relaxed text-white/60 mb-2 lg:mb-10 max-w-sm">
                            {showFullDesc ? selectedProduct.description : shortDesc}
                            {selectedProduct.description.length > shortDesc.length && (
                                <button
                                    onClick={() => setShowFullDesc(!showFullDesc)}
                                    className="ml-2 text-ice font-bold hover:underline"
                                >
                                    {showFullDesc ? 'Show Less' : 'Read More'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ─────────────── CENTER PANEL ─────────────── */}
                    <div className="flex items-center justify-center min-h-[50vh] lg:min-h-screen">
                        <div className="absolute w-full aspect-square flex items-center justify-center">
                            <img
                                key={mainImage}
                                src={mainImage}
                                alt={selectedProduct.name}
                                className="po-main-image w-screen h-screen object-cover drop-shadow-[0_50px_80px_rgba(0,0,0,0.4)]"
                            />
                        </div>
                    </div>

                    {/* ─────────────── RIGHT PANEL ─────────────── */}
                    <div className="flex flex-col pl-0 lg:pl-12 pt-2 gap-12">

                        {/* Size Selector */}
                        <div className="po-side-animate po-size-panel">
                            <h3 className="text-[11px] font-inter tracking-[0.3em] text-white/50 mb-2 lg:mb-3 uppercase font-extrabold">Size</h3>
                            <div className="flex flex-wrap gap-3 lg:mb-3">
                                {(selectedProduct.sizes || ['S', 'M', 'L']).map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-11 h-11 rounded-full border-2 flex items-center justify-center text-[11px] font-inter transition-all duration-300 ${selectedSize === size
                                            ? 'bg-ice border-ice text-[#0d1520] font-extrabold shadow-[0_6px_20px_rgba(148,213,255,0.3)]'
                                            : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white bg-white/5'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Selector */}
                        <div className="po-side-animate po-color-panel">
                            <h3 className="text-[11px] font-inter tracking-[0.3em] text-white/50 mb-3 uppercase font-extrabold">Color</h3>
                            <div className="grid grid-cols-2 gap-4 max-w-[200px]">
                                {selectedProduct.colors?.map((color, idx) => (
                                    <div key={color.name} className="flex flex-col items-center gap-2">
                                        <button
                                            onClick={() => setSelectedColorIdx(idx)}
                                            className={`relative w-full aspect-square rounded-2xl border-2 transition-all duration-500 ${selectedColorIdx === idx
                                                ? 'border-ice shadow-[0_8px_25px_rgba(148,213,255,0.2)] scale-[1.02]'
                                                : 'border-transparent hover:border-white/20 bg-white/5'
                                                }`}
                                        >
                                            <img
                                                src={color.image}
                                                alt={color.name}
                                                className={`w-full h-full object-cover rounded-2xl transition-opacity duration-500 ${selectedColorIdx === idx ? 'opacity-100' : 'opacity-60'}`}
                                            />
                                        </button>
                                        <span className={`text-[9px] font-inter tracking-[0.2em] uppercase font-bold transition-colors ${selectedColorIdx === idx ? 'text-ice' : 'text-white/40'}`}>
                                            {color.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="po-side-animate po-buttons flex flex-col gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="w-full py-4 rounded-full bg-ice text-[#0d1520] text-[12px] font-inter font-black tracking-[0.3em] uppercase transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                ADD TO BAG
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductOverview;
