import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import cartManager from '../cart/CartManager';
import { openCart } from '../store/cartSlice';

const CartIconBadge = () => {
    const dispatch = useDispatch();
    const [itemCount, setItemCount] = useState(0);
    const [bump, setBump] = useState(false);

    useEffect(() => {
        // Hydrate precisely on mount
        setItemCount(cartManager.getTotalItems());

        const handleUpdate = () => {
            const count = cartManager.getTotalItems();
            setItemCount(count);
            // Trigger badge bounce
            setBump(true);
            setTimeout(() => setBump(false), 400);
        };

        window.addEventListener('zash:cart:update', handleUpdate);
        return () => window.removeEventListener('zash:cart:update', handleUpdate);
    }, []);

    return (
        <button
            id="cart-icon-el"
            onClick={() => dispatch(openCart())}
            className="relative flex items-center justify-center w-10 h-10 group"
            aria-label={`Cart — ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
        >
            {/* Cart icon SVG */}
            <svg
                className="w-5 h-5 text-white/80 group-hover:text-white transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
            </svg>

            {/* Badge */}
            {itemCount > 0 && (
                <span
                    className={`
                        absolute -top-1 -right-1
                        min-w-[18px] h-[18px] px-1
                        flex items-center justify-center
                        rounded-full
                        bg-[#94d5ff] text-[#0d1520]
                        text-[10px] font-inter font-black
                        leading-none
                        transition-transform duration-300
                        ${bump ? 'scale-150' : 'scale-100'}
                    `}
                >
                    {itemCount > 99 ? '99+' : itemCount}
                </span>
            )}
        </button>
    );
};

export default CartIconBadge;
