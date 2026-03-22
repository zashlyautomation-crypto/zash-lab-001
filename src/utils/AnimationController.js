import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import barba from '@barba/core';

gsap.registerPlugin(ScrollTrigger);

class AnimationController {
    constructor() {
        if (AnimationController.instance) {
            return AnimationController.instance;
        }

        this.lenis = null;
        this.rafId = null;
        this.animationGroups = new Map();
        this.gsap = gsap;
        this.ScrollTrigger = ScrollTrigger;
        
        AnimationController.instance = this;
    }

    /**
     * Initialize the core motion systems.
     * Should be called once in the root App component.
     */
    init() {
        if (this.lenis) return;

        console.log('[AnimationController] Initializing Motion System...');

        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
        });

        // Sync ScrollTrigger with Lenis
        this.lenis.on('scroll', ScrollTrigger.update);

        // Global RAF Loop
        const raf = (time) => {
            this.lenis.raf(time);
            requestAnimationFrame(raf);
        };
        this.rafId = requestAnimationFrame(raf);

        // Pre-configure GSAP defaults
        gsap.defaults({
            ease: 'power3.out',
            duration: 0.8
        });

        // Refresh on init
        ScrollTrigger.refresh();
    }

    /**
     * Centralized Barba Initialization.
     * @param {Object} options - Barba config with hooks.
     */
    initBarba(hooks) {
        if (barba.version) return;

        barba.init({
            transitions: [{
                name: 'global-transition',
                leave: async (data) => {
                    if (hooks.leave) await hooks.leave(data);
                },
                afterEnter: async (data) => {
                    this.resetScroll();
                    ScrollTrigger.refresh();
                    if (hooks.afterEnter) await hooks.afterEnter(data);
                }
            }]
        });
    }

    /**
     * Register a group of animations (e.g., HeroAnimations, CardBatch).
     * @param {string} id - Unique identifier for the group.
     * @param {Function} buildFn - Function that receives gsap/ScrollTrigger context.
     * @param {HTMLElement} scope - React ref or DOM element for context scoping.
     */
    registerGroup(id, buildFn, scope) {
        if (this.animationGroups.has(id)) {
            console.warn(`[AnimationController] Group "${id}" already exists. Re-registering...`);
            this.animationGroups.get(id).revert();
        }

        const ctx = gsap.context(buildFn, scope);
        this.animationGroups.set(id, ctx);
        return ctx;
    }

    /**
     * Unregister/Kill a specific animation group.
     */
    unregisterGroup(id) {
        if (this.animationGroups.has(id)) {
            this.animationGroups.get(id).revert();
            this.animationGroups.delete(id);
        }
    }

    /**
     * Reset the scroll position to the top.
     * Useful for page transitions.
     */
    resetScroll() {
        if (this.lenis) {
            this.lenis.scrollTo(0, { immediate: true });
        }
    }

    /**
     * Stop/Start Lenis (e.g., during menu open or transitions).
     */
    toggleScroll(active) {
        if (!this.lenis) return;
        if (active) this.lenis.start();
        else this.lenis.stop();
    }

    /**
     * Global batching utility for consistent behavior.
     */
    createBatch(targets, onEnter) {
        return ScrollTrigger.batch(targets, {
            onEnter: onEnter,
            start: 'top 85%',
        });
    }

    /**
     * Clean up everything on app unmount.
     */
    destroy() {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        if (this.lenis) {
            this.lenis.destroy();
            this.lenis = null;
        }
        this.animationGroups.forEach(ctx => ctx.revert());
        this.animationGroups.clear();
    }
}

const instance = new AnimationController();
export default instance;
