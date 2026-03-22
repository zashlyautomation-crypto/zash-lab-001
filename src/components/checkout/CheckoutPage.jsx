import { useState, useEffect } from 'react';
import animationController from '../../utils/AnimationController';
import cartManager from '../../cart/CartManager';
import { validateCheckoutForm } from '../../utils/validation';
import { buildOrderObject } from '../../utils/orderBuilder';
import { submitOrder } from '../../utils/formHandler';
import { Link } from 'react-router-dom';

const InputField = ({ label, name, type = 'text', value, onChange, error, placeholder }) => (
    <div className="flex flex-col mb-6">
        <label className="text-[10px] font-inter tracking-[0.2em] text-white/40 uppercase font-bold mb-3">
            {label}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'} text-white text-[13px] font-inter py-4 px-5 focus:outline-none focus:border-ice/50 transition-colors placeholder:text-white/20`}
        />
        {error && <span className="text-red-400 text-[10px] mt-2 tracking-wide">{error}</span>}
    </div>
);

const CheckoutPage = () => {
    // Scroll handling
    useEffect(() => {
        window.scrollTo(0, 0);
        animationController.toggleScroll(true);
        return () => animationController.toggleScroll(false); // Let App handle it, or just leave it
    }, []);

    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        address: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successState, setSuccessState] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [submitError, setSubmitError] = useState(null);

    useEffect(() => {
        const items = cartManager.getCart();
        setCartItems(items);
        const sub = cartManager.getTotal();
        setSubtotal(sub);
        setTax(sub * 0.04);
        setTotal(sub + sub * 0.04);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear specific error
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleConfirmOrder = async (e) => {
        e.preventDefault();
        setSubmitError(null);

        // Validation
        const validationErrors = validateCheckoutForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);

        const orderObj = buildOrderObject(formData);

        const response = await submitOrder(orderObj);

        if (response.success) {
            setOrderId(orderObj.meta.orderID);
            setSuccessState(true);
            cartManager.clearCart();
        } else {
            setSubmitError(response.error || "An error occurred during checkout.");
            setIsSubmitting(false);
        }
    };

    // Derived formatting
    const formattedTotal = total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Header simplified here
    return (
        <div className="min-h-screen bg-[#131a24] text-white pt-24 pb-20 px-6 md:px-14 lg:px-20 selection:bg-ice/30" data-barba="container" data-barba-namespace="checkout">
            {/* Simple Checkout Header matching ZASH Navbar style implicitly */}
            <div className="absolute top-0 left-0 w-full z-10 flex items-center justify-between px-8 md:px-14 lg:px-20 py-5 bg-[#1a2533]/90 backdrop-blur-xl border-b border-white/10">
                <Link to="/" className="text-xl font-bebas tracking-[0.25em] text-white select-none hover:text-ice transition-colors">
                    LAB 001
                </Link>
                <div className="flex items-center gap-8">
                    <span className="text-[10px] tracking-[0.25em] text-ice uppercase font-light">SECURE CHECKOUT</span>
                </div>
            </div>

            <main className="max-w-7xl mx-auto mt-20 flex flex-col lg:flex-row gap-16 xl:gap-24 relative">

                {/* LEFT SIDE: Form */}
                <div className="flex-1 w-full lg:max-w-2xl">
                    {!successState ? (
                        <>
                            <div className="mb-12">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-px bg-ice"></div>
                                    <span className="text-[10px] font-inter tracking-[0.3em] text-ice uppercase font-bold">
                                        STEP 02 / CHECKOUT
                                    </span>
                                </div>
                                <h1 className="text-5xl md:text-6xl font-bebas tracking-[0.02em] leading-none mb-6">
                                    Shipping Information
                                </h1>
                                <p className="text-[17px] font-inter font-light text-white/50 leading-relaxed max-w-lg">
                                    Arctic Elegance Collection — Limited Release. Secure your piece of the north.
                                </p>
                            </div>

                            <form onSubmit={handleConfirmOrder}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                    <InputField label="FULL NAME" name="name" value={formData.name} onChange={handleInputChange} error={errors.name} placeholder="Muhammad Ali" />
                                    <InputField label="EMAIL ADDRESS" name="email" type="email" value={formData.email} onChange={handleInputChange} error={errors.email} placeholder="[EMAIL_ADDRESS]" />
                                    <InputField label="PHONE NUMBER" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} error={errors.phone} placeholder="+92 300 0000000" />
                                    <InputField label="LOCATION (CITY/REGION)" name="city" value={formData.city} onChange={handleInputChange} error={errors.city} placeholder="Karachi, Pakistan" />
                                </div>
                                <div className="mt-2">
                                    <InputField label="DELIVERY ADDRESS" name="address" value={formData.address} onChange={handleInputChange} error={errors.address} placeholder="123 Main Street, Karachi, Pakistan" />
                                </div>

                                {/* Error Display for Submit */}
                                {submitError && (
                                    <div className="mt-6 p-4 border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                                        {submitError}
                                    </div>
                                )}
                            </form>
                        </>
                    ) : (
                        <div className="flex flex-col items-start justify-center py-20 animate-fade-in">
                            <div className="w-16 h-16 rounded-full border border-ice flex items-center justify-center mb-8">
                                <svg className="w-8 h-8 text-ice" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bebas tracking-wider mb-4">ORDER CONFIRMED</h2>
                            <p className="text-[15px] font-inter font-light text-white/60 mb-8 max-w-md leading-relaxed">
                                Thank you for your acquisition. Your order <span className="text-white font-medium">{orderId}</span> has been securely logged. A confirmation email with tracking details will be dispatched shortly.
                            </p>
                            <Link to="/" className="inline-block py-4 px-10 bg-white text-[#0e1217] text-[10px] font-inter font-black tracking-[0.3em] uppercase transition-all duration-300 hover:bg-ice active:scale-95">
                                RETURN TO COLLECTION
                            </Link>
                        </div>
                    )}
                </div>

                {/* RIGHT SIDE: Order Summary */}
                <div className="w-full lg:w-[420px] shrink-0">
                    <div className="border border-white/5 bg-[#17202c]/50 backdrop-blur-md p-8 sticky top-32">
                        <h3 className="text-[11px] font-inter tracking-[0.3em] text-white/40 uppercase font-bold mb-8">
                            ORDER SUMMARY
                        </h3>

                        {/* Items Preview */}
                        <div className="flex flex-col gap-6 mb-8 border-b border-white/5 pb-8">
                            {cartItems.length > 0 ? cartItems.map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-center">
                                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover bg-black/40" />
                                    <div className="flex flex-col flex-1 justify-center">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-[14px] font-bebas tracking-0.1em text-white">{item.name}</span>
                                            <span className="text-[13px] font-inter text-white/90 tabular-nums">${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <span className="text-[9px] font-inter tracking-[0.15em] text-white/40 uppercase">
                                            {item.color} / {item.size} {item.qty > 1 ? ` (x${item.qty})` : ''}
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-[13px] text-white/40 italic">Cart is empty.</div>
                            )}
                        </div>

                        {/* Summary Details */}
                        <div className="flex flex-col gap-5 mb-8 border-b border-white/5 pb-8">
                            <div className="flex justify-between items-center text-[12px] font-inter">
                                <span className="text-white/50 font-light">Delivery Time</span>
                                <span className="text-white tracking-0.1em uppercase">3-5 BUSINESS DAYS</span>
                            </div>
                            <div className="flex justify-between items-center text-[12px] font-inter">
                                <span className="text-white/50 font-light">Payment Method</span>
                                <span className="text-white tracking-0.1em uppercase">CASH ON DELIVERY</span>
                            </div>
                        </div>

                        {/* Security Notice */}
                        <div className="border border-white/5 bg-white/5 p-4 mb-8 flex gap-4 items-start">
                            <svg className="w-4 h-4 text-ice mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <p className="text-[9px] font-inter tracking-[0.15em] leading-relaxed text-white/60 uppercase">
                                SECURE PAYMENT UPON ARRIVAL. INSPECT YOUR GARMENT BEFORE FINAL TRANSACTION.
                            </p>
                        </div>

                        {/* Totals */}
                        <div className="flex items-end justify-between mb-8">
                            <span className="text-[11px] font-inter tracking-[0.3em] text-white/40 uppercase font-bold mb-1">
                                TOTAL
                            </span>
                            <span className="font-bebas text-[36px] tracking-[0.05em] text-white leading-none">
                                ${formattedTotal}
                            </span>
                        </div>

                        {/* Submit Button */}
                        {!successState && (
                            <button
                                onClick={handleConfirmOrder}
                                disabled={isSubmitting || cartItems.length === 0}
                                className={`w-full py-5 flex items-center justify-center gap-3 transition-all duration-300 ${isSubmitting || cartItems.length === 0 ? 'bg-ice/10 text-white/30 cursor-not-allowed' : 'bg-ice hover:bg-white text-[#131a24] active:scale-[0.98]'}`}
                            >
                                <span className="text-[12px] font-inter font-black tracking-[0.3em] uppercase">
                                    {isSubmitting ? 'PROCESSING...' : 'CONFIRM ORDER'}
                                </span>
                                {!isSubmitting && (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                )}
                            </button>
                        )}
                    </div>
                </div>

            </main>

            {/* Features Footer across bottom */}
            <div className="max-w-7xl mx-auto mt-24 border-t border-white/5 pt-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
                <div>
                    <div className="flex items-center gap-3 mb-4 text-[#c9e9fa]">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L9 9H2L7 14L5 22L12 17L19 22L17 14L22 9H15L12 2Z" /></svg>
                        <span className="text-[11px] font-inter font-black tracking-[0.2em] uppercase">RESISTANT</span>
                    </div>
                    <p className="text-[10px] font-inter text-white/40 uppercase tracking-0.1em leading-relaxed">
                        DESIGNED TO WITHSTAND TEMPERATURES DOWN TO -40°C WITH AEROGEL INSULATION TECHNOLOGY.
                    </p>
                </div>
                <div>
                    <div className="flex items-center gap-3 mb-4 text-[#c9e9fa]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        <span className="text-[11px] font-inter font-black tracking-[0.2em] uppercase">LIFETIME WARRANTY</span>
                    </div>
                    <p className="text-[10px] font-inter text-white/40 uppercase tracking-0.1em leading-relaxed">
                        EVERY GARMENT IS REGISTERED TO A UNIQUE BLOCKCHAIN IDENTIFIER FOR AUTHENTICITY.
                    </p>
                </div>
                <div>
                    <div className="flex items-center gap-3 mb-4 text-[#c9e9fa]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="text-[11px] font-inter font-black tracking-[0.2em] uppercase">Pakistan DISPATCH</span>
                    </div>
                    <p className="text-[10px] font-inter text-white/40 uppercase tracking-0.1em leading-relaxed">
                        SHIPPED DIRECTLY FROM OUR Store HUB TO ANY PART OF PAKISTAN.
                    </p>
                </div>
            </div>

            <div className="mt-20 text-center text-[9px] font-inter tracking-[0.3em] text-white/20 uppercase font-light">
                © 2024 ZASH ARCTIC SYSTEMS. ALL RIGHTS RESERVED.
            </div>
        </div>
    );
};

export default CheckoutPage;
