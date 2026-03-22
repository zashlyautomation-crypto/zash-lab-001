import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import gsap from 'gsap';
import cartManager from '../cart/CartManager';
import { closeCart } from '../store/cartSlice';
import animationController from '../utils/AnimationController';
import { startCheckoutTransition } from '../utils/checkoutTransition';
import { useNavigate } from 'react-router-dom';

// ─── CartItemCard ────────────────────────────────────────────────────────────
const CartItemCard = ({ item, onRemove, onIncrease, onDecrease }) => {
    const cardRef = useRef(null);
    const [isRemoving, setIsRemoving] = useState(false);

    const handleRemove = () => {
        if (isRemoving) return;
        setIsRemoving(true);

        // Animate out before removing
        gsap.to(cardRef.current, {
            opacity: 0,
            x: 30,
            height: 0,
            marginBottom: 0,
            paddingTop: 0,
            paddingBottom: 0,
            duration: 0.32,
            ease: 'power3.in',
            onComplete: () => onRemove(item._key),
        });
    };

    return (
        <div
            ref={cardRef}
            className="relative border border-white/5 bg-transparent rounded-none mb-0"
            style={{ overflow: 'hidden' }}
        >
            {/* Top bar with item label */}
            <div className="flex items-center justify-between px-4 pt-3 pb-1">
                <span className="text-[9px] font-inter tracking-[0.35em] text-white/25 uppercase font-bold">
                    {item.color} — {item.name.split(' ')[0]}
                </span>
                <button
                    onClick={handleRemove}
                    className="text-white/25 hover:text-white/80 transition-colors duration-200"
                    aria-label="Remove item"
                >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            {/* Card body */}
            <div className="flex gap-0 px-4 pb-4">
                {/* Product Image */}
                <div className="relative w-[110px] h-[130px] shrink-0 bg-[#0d1a28] overflow-hidden mr-5">
                    <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover p-0 opacity-90"
                    />
                    {/* Corner tag */}
                    <div className="absolute bottom-0 left-0 px-2 py-1 bg-white/30 backdrop-blur-md">
                        <span className="text-[7px] font-inter tracking-[0.2em] text-white uppercase font-bold">
                            ARTIC-01
                        </span>
                    </div>
                </div>

                {/* Info */}
                <div className="flex flex-col justify-between flex-1 py-1">
                    {/* Name + Category */}
                    <div>
                        <h3 className="text-[15px] font-bebas tracking-[0.15em] text-white leading-tight mb-0.5">
                            {item.name}
                        </h3>
                        <p className="text-[8px] font-inter tracking-[0.25em] text-white/35 uppercase font-semibold mb-3">
                            {item.color} FINISH // INSULATED SHELL
                        </p>

                        {/* Size / Color row */}
                        <div className="grid grid-cols-2 gap-x-2 mb-3">
                            <div>
                                <div className="text-[8px] font-inter tracking-[0.2em] text-white/30 uppercase font-bold mb-0.5">SIZE</div>
                                <div className="text-[10px] font-inter tracking-[0.15em] text-white/70 font-semibold">
                                    {item.size}
                                </div>
                            </div>
                            <div>
                                <div className="text-[8px] font-inter tracking-[0.2em] text-white/30 uppercase font-bold mb-0.5">COLOR</div>
                                <div className="text-[10px] font-inter tracking-[0.15em] text-white/70 font-semibold truncate">
                                    {item.color}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quantity + Price row */}
                    <div className="flex items-center justify-between">
                        {/* Qty controls */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => onDecrease(item._key)}
                                className="text-[12px] font-inter text-white/40 hover:text-white w-5 h-5 flex items-center justify-center transition-colors"
                                aria-label="Decrease quantity"
                            >
                                −
                            </button>
                            <span className="text-[12px] font-inter font-semibold text-white/70 w-4 text-center tabular-nums">
                                {String(item.qty).padStart(2, '0')}
                            </span>
                            <button
                                onClick={() => onIncrease(item._key)}
                                className="text-[12px] font-inter text-white/40 hover:text-white w-5 h-5 flex items-center justify-center transition-colors"
                                aria-label="Increase quantity"
                            >
                                +
                            </button>
                            <button
                                onClick={handleRemove}
                                className="text-[8px] font-inter tracking-[0.2em] text-white/10 hover:text-white/70 uppercase font-bold transition-colors ml-3"
                            >
                                DECLINE
                            </button>
                        </div>

                        {/* Line price */}
                        <span className="text-[14px] font-inter font-light text-white/90 tracking-tight">
                            ${(item.price * item.qty).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── CartSidebar ─────────────────────────────────────────────────────────────
const CartSidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isOpen = useSelector((state) => state.cart.isOpen);

    const [cartItems, setCartItems] = useState([]);
    const sidebarRef = useRef(null);
    const backdropRef = useRef(null);
    const listRef = useRef(null);

    // ── Cart data sync ───────────────────────────────────────
    useEffect(() => {
        // Hydrate from localStorage precisely on mount inside the client
        setCartItems(cartManager.getCart());

        const handleUpdate = () => setCartItems(cartManager.getCart());
        window.addEventListener('zash:cart:update', handleUpdate);
        return () => window.removeEventListener('zash:cart:update', handleUpdate);
    }, []);

    // ── GSAP open / close animations ─────────────────────────
    useEffect(() => {
        const sidebar = sidebarRef.current;
        const backdrop = backdropRef.current;
        if (!sidebar || !backdrop) return;

        if (isOpen) {
            // Kill active tweens to prevent timeline overlap during spam
            gsap.killTweensOf([sidebar, backdrop]);
            if (listRef.current) {
                gsap.killTweensOf(listRef.current.querySelectorAll('[data-cart-item]'));
            }

            // Prevent body scroll and stop Lenis smooth scrolling
            document.body.style.overflow = 'hidden';
            animationController.toggleScroll(false);

            // Make visible first (it's hidden via translateX)
            gsap.set(sidebar, { x: '100%', opacity: 1 });
            gsap.set(backdrop, { opacity: 0, display: 'block' });

            const tl = gsap.timeline();
            tl.to(backdrop, { opacity: 1, duration: 0.4, ease: 'power2.out' })
                .to(sidebar, { x: '0%', duration: 0.55, ease: 'power3.out' }, '-=0.3');

            // Stagger cart items in
            if (listRef.current) {
                const items = listRef.current.querySelectorAll('[data-cart-item]');
                if (items.length > 0) {
                    gsap.fromTo(items,
                        { opacity: 0, x: 25 },
                        { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out', delay: 0.35 }
                    );
                }
            }
        } else {
            // Kill active tweens before closing
            gsap.killTweensOf([sidebar, backdrop]);
            if (listRef.current) {
                gsap.killTweensOf(listRef.current.querySelectorAll('[data-cart-item]'));
            }

            // Close
            const tl = gsap.timeline({
                onComplete: () => {
                    document.body.style.overflow = '';
                    animationController.toggleScroll(true);
                    gsap.set(backdrop, { display: 'none' });
                }
            });
            tl.to(sidebar, { x: '100%', duration: 0.4, ease: 'power3.in' })
                .to(backdrop, { opacity: 0, duration: 0.3, ease: 'power2.in' }, '-=0.25');
        }
    }, [isOpen]);

    // ── Handlers ─────────────────────────────────────────────
    const handleRemove = (key) => cartManager.removeItem(key);
    const handleIncrease = (key) => cartManager.increaseQuantity(key);
    const handleDecrease = (key) => cartManager.decreaseQuantity(key);
    const handleClose = () => dispatch(closeCart());

    const handleCheckout = (e) => {
        e.preventDefault();
        startCheckoutTransition(navigate);
    };

    // ── Computed totals ──────────────────────────────────────
    const subtotal = cartManager.getTotal();
    const formattedSubtotal = subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Tax at hypothetical 4%
    const tax = subtotal * 0.04;
    const formattedTax = tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const totalWithTax = subtotal + tax;
    const formattedTotal = totalWithTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const totalItems = cartManager.getTotalItems();

    return (
        <>
            {/* ── Backdrop ──────────────────────────────────────── */}
            <div
                ref={backdropRef}
                onClick={handleClose}
                style={{ display: 'none' }}
                className="fixed inset-0 z-1000 bg-black/60 backdrop-blur-md"
            />

            {/* ── Sidebar Panel ─────────────────────────────────── */}
            <div
                ref={sidebarRef}
                style={{ transform: 'translateX(100%)' }}
                className="fixed top-0 right-0 z-1001 h-screen w-full md:w-[48%] lg:w-[40%] xl:w-[35%] bg-[#0e1217] border-l border-white/5 flex flex-col"
            >
                {/* ── Header ──────────────────────────────────────── */}
                <div className="flex items-start justify-between px-8 pt-4 pb-3 border-b border-white/5 shrink-0">
                    <div>
                        <h2 className="font-bebas text-[36px] tracking-[0.05em] text-white leading-none">
                            YOUR CART
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-white/30 hover:text-white transition-colors duration-200 p-1 mt-1"
                        aria-label="Close cart"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* ── Product List ─────────────────────────────────── */}
                <div
                    ref={listRef}
                    className="flex-1 overflow-y-auto scrollbar-hide scroll-auto"
                >
                    {cartItems.length === 0 ? (
                        /* Empty state */
                        <div className="flex flex-col items-center justify-center h-full gap-4 px-8">
                            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center">
                                <svg className="w-7 h-7 text-white/20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <p className="text-[10px] font-inter tracking-[0.3em] text-white/25 uppercase font-semibold text-center">
                                YOUR BAG IS EMPTY
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-5 px-8 py-6">
                            {cartItems.map((item) => (
                                <div key={item._key} data-cart-item="">
                                    <CartItemCard
                                        item={item}
                                        onRemove={handleRemove}
                                        onIncrease={handleIncrease}
                                        onDecrease={handleDecrease}
                                    />
                                </div>
                            ))}

                            {/* Internal brand label */}
                            <div className="pt-8 pb-6 flex items-center justify-center">
                                <p className="text-[7px] font-inter tracking-[0.5em] text-white/10 uppercase font-bold text-center">
                                    BUILT FOR COLD · MADE FOR HEIGHT · FORGED TO LAST
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Footer / Totals ──────────────────────────────── */}
                {cartItems.length > 0 && (
                    <div className="shrink-0 border-t border-white/5 px-4 pt-3 pb-8">
                        {/* Logistics row */}
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[9px] font-inter tracking-[0.35em] text-white/40 uppercase font-bold">
                                ESTIMATED TAX [4%]
                            </span>
                            <span className="text-[13px] font-inter font-light text-white/60 tracking-tight">
                                ${formattedTax}
                            </span>
                        </div>

                        {/* Total row */}
                        <div className="flex items-end justify-between mb-3 mt-3 border-t border-white/5 pt-3">
                            <span className="font-bebas text-[22px] tracking-[0.15em] text-white">
                                TOTAL
                            </span>
                            <div className="text-right">
                                <div className="text-[10px] font-inter tracking-[0.2em] text-white/30 uppercase font-bold mb-0.5">
                                    USD
                                </div>
                                <span className="font-bebas text-[27px] tracking-[0.05em] text-white leading-none">
                                    ${formattedTotal}
                                </span>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <button 
                            onClick={handleCheckout}
                            className="w-full py-4 bg-white text-[#0e1217] flex items-center justify-center gap-3 group transition-all duration-300 hover:bg-ice active:scale-[0.98]">
                            <span className="text-[10px] font-inter font-black tracking-[0.3em] uppercase">
                                PROCEED TO CHECKOUT
                            </span>
                            <svg
                                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>

                    </div>
                )}
            </div>
        </>
    );
};

export default CartSidebar;
