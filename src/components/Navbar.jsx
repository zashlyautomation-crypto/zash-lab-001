import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import animationController from '../utils/AnimationController';
import CartIconBadge from './CartIconBadge';

const NAV_LINKS = [
    { label: 'HOME', href: '/', external: false },
    { label: 'NEW ARRIVALS', href: '/new-arrivals', external: false },
    { label: 'ABOUT', href: '/about', external: false },
];

const Navbar = () => {
    const location = useLocation();
    const headerRef = useRef(null);
    const menuRef = useRef(null);
    const menuOverlayRef = useRef(null);
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const linkRefs = useRef([]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', handleScroll);

        animationController.registerGroup('NavbarEntrance', () => {
            animationController.gsap.fromTo(headerRef.current,
                { y: -100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.2 }
            );
        }, headerRef);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            animationController.unregisterGroup('NavbarEntrance');
        };
    }, []);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
            animationController.gsap.fromTo(menuOverlayRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.5, ease: 'power2.out' }
            );
            animationController.gsap.fromTo(menuRef.current,
                { x: '100%' },
                { x: 0, duration: 0.8, ease: 'expo.out' }
            );

            // Staggered link animations
            animationController.gsap.fromTo(linkRefs.current,
                { y: 30, opacity: 0, scale: 0.95 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'back.out(1.4)',
                    delay: 0.3
                }
            );
        } else {
            document.body.style.overflow = 'unset';
            animationController.gsap.to(linkRefs.current,
                { y: -20, opacity: 0, duration: 0.3, stagger: 0.05, ease: 'power2.in' }
            );
            animationController.gsap.to(menuRef.current,
                { x: '100%', duration: 0.6, ease: 'expo.in', delay: 0.1 }
            );
            animationController.gsap.to(menuOverlayRef.current,
                { opacity: 0, duration: 0.5, ease: 'power2.in' }
            );
        }
    }, [isMenuOpen]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header
            ref={headerRef}
            className={`fixed top-0 left-0 w-full z-100 flex items-center justify-between px-8 md:px-14 lg:px-20 py-5 transition-all duration-500 ${scrolled
                ? 'bg-[#1a2533]/90 backdrop-blur-xl border-b border-white/10'
                : 'bg-transparent'
                }`}
        >
            {/* Brand Logo */}
            <Link to="/" className="text-xl font-bebas tracking-[0.25em] text-white select-none hover:text-#c8dbf0 transition-colors duration-300">
                LAB 001
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-12">
                {NAV_LINKS.map((link, i) => {
                    const isActive = !link.external && location.pathname === link.href;
                    const cls = `text-[10px] md:text-[11px] tracking-[0.25em] transition-colors duration-300 uppercase font-light ${isActive ? 'text-[#c8dbf0]' : 'text-white/55 hover:text-white'
                        }`;
                    return link.external ? (
                        <a key={link.href + i} href={link.href} className={cls}>{link.label}</a>
                    ) : (
                        <Link key={link.href + i} to={link.href} className={cls}>{link.label}</Link>
                    );
                })}
            </nav>

            {/* Right Icons & Toggler */}
            <div className="flex items-center gap-3">
                {/* Instagram icon - Hidden on mobile */}
                <button className="hidden sm:flex w-8 h-8 border border-white/20 items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-all duration-300">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
                    </svg>
                </button>
                <CartIconBadge />

                {/* Mobile Menu Toggle */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-110 bg-gradient-to-bottom from-[#1a2533]/80 via-#293a4c/80 to-[#1e3a5f]/80 backdrop-blur-md rounded-full border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-white/30"
                    aria-label="Toggle Menu"
                >
                    <span className={`w-5 h-[1.5px] bg-ice transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[4.5px]' : ''}`}></span>
                    <span className={`w-5 h-[1.5px] bg-ice transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`w-5 h-[1.5px] bg-ice transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[4.5px]' : ''}`}></span>
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                ref={menuOverlayRef}
                className={`fixed inset-0 bg-gradient-to-bottom-right from-[#1a2533]/70 via-#293a4c/70 to-[#1e3a5f]/80 backdrop-blur-xl z-101 md:hidden pointer-events-none ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'
                    }`}
                onClick={closeMenu}
            />

            {/* Mobile Menu Sidebar - Liquid Blue Glass */}
            <div
                ref={menuRef}
                className="fixed top-0 right-0 h-full w-full sm:w-[80%] max-w-[450px] bg-gradient-to-bottom from-[#1e3a5f]/80 via-#293a4c/80 to-[#1a2533]/90 backdrop-blur-3xl z-105 md:hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border-l border-white/10 flex flex-col p-12 transform translate-x-full"
            >
                {/* Glow effect at the top */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-right from-transparent via-ice/30 to-transparent" />

                <div className="flex flex-col gap-10 mt-24">
                    {NAV_LINKS.map((link, i) => {
                        const isActive = !link.external && location.pathname === link.href;
                        const cls = `text-4xl md:text-5xl tracking-[0.2em] font-bebas transition-all duration-500 uppercase block ${isActive ? 'text-ice' : 'text-white/40 hover:text-white hover:translate-x-4'
                            }`;
                        return (
                            <div key={'mobile-container-' + i} ref={el => linkRefs.current[i] = el}>
                                {link.external ? (
                                    <a href={link.href} onClick={closeMenu} className={cls}>{link.label}</a>
                                ) : (
                                    <Link to={link.href} onClick={closeMenu} className={cls}>{link.label}</Link>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-auto flex flex-col gap-6">
                    <div className="h-px w-full bg-gradient-to-right from-white/10 to-transparent" />
                    <div className="flex justify-between items-center px-2">
                        <p className="text-[10px] tracking-[0.3em] text-white/30 uppercase font-light">© LAB 001 - Winter Series</p>
                        <div className="flex gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-ice/50 animate-pulse" />
                            <div className="w-1.5 h-1.5 rounded-full bg-ice/30" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
