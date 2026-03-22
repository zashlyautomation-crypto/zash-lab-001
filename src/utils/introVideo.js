import animationController from './AnimationController';
import { getAssetPath } from './pathUtils';

/**
 * ZASH Intro Video System
 * 
 * Specifically designed for desktop-only playback (min-width: 1024px).
 * Plays once per session when the site fully loads.
 * Non-destructive implementation.
 */
class IntroVideoSystem {
    constructor() {
        this.overlay = null;
        this.video = null;
        // Dynamically locate the video file in the /intro-video/ directory
        this.videoSrc = getAssetPath('/intro-video/1db07f65-fcf2-4a3c-9173-28eae83bd48d.mp4');
        this.isDesktop = window.innerWidth >= 1024;
        this.hasSeenIntro = sessionStorage.getItem('zash_intro_seen') === 'true';
        this.isInitialized = false;
    }

    /**
     * Entry point for the intro system.
     */
    init() {
        if (this.isInitialized) return;

        if (!this.isDesktop || this.hasSeenIntro) {
            console.log('[IntroVideo] Skipping intro: ', {
                isDesktop: this.isDesktop,
                hasSeenIntro: this.hasSeenIntro
            });
            return;
        }

        this.isInitialized = true;

        // Wait for window.onload to ensure DOM and critical assets are ready
        if (document.readyState === 'complete') {
            this.setup();
        } else {
            window.addEventListener('load', () => this.setup());
        }
    }

    /**
     * Create the overlay and video element.
     */
    setup() {
        console.log('[IntroVideo] Initializing Overlay...');

        // 1. Create viewport-covering overlay
        this.overlay = document.createElement('div');
        this.overlay.id = 'zash-intro-overlay';
        Object.assign(this.overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: '#000', // Match ZASH theme
            zIndex: '2147483647', // Highest possible z-index
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            pointerEvents: 'all'
        });

        // 2. Create Video Element
        this.video = document.createElement('video');
        this.video.src = this.videoSrc;
        this.video.muted = true;
        this.video.autoplay = true;
        this.video.playsInline = true;
        this.video.preload = 'auto';

        Object.assign(this.video.style, {
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        });

        // 3. Assemble and Attach
        this.overlay.appendChild(this.video);
        document.body.appendChild(this.overlay);

        // 4. Lock Scroll (Wait a frame to ensure Lenis is ready if initialized)
        requestAnimationFrame(() => {
            animationController.toggleScroll(false);
        });

        // 5. Setup Event Listeners
        this.video.onerror = () => {
            console.warn('[IntroVideo] Video failed to load. Failsafe activated.');
            this.exit();
        };

        this.video.onended = () => {
            this.exit();
        };

        // Extra failsafe: click to skip if video is somehow stuck (optional but useful)
        // this.overlay.addEventListener('click', () => this.exit());
    }

    /**
     * Smoothly transition out of the intro.
     */
    exit() {
        if (!this.overlay) return;

        console.log('[IntroVideo] Transitioning out...');

        const fadeDuration = 1.2; // Premium duration

        if (animationController.gsap) {
            animationController.gsap.to(this.overlay, {
                opacity: 0,
                duration: fadeDuration,
                ease: 'power2.inOut',
                onComplete: () => this.cleanup()
            });
        } else {
            // CSS Fallback if GSAP isn't ready
            this.overlay.style.transition = `opacity ${fadeDuration}s ease-in-out`;
            this.overlay.style.opacity = '0';
            setTimeout(() => this.cleanup(), fadeDuration * 1000);
        }
    }

    /**
     * Final cleanup and state update.
     */
    cleanup() {
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }

        this.overlay = null;
        this.video = null;

        // Resume Scroll
        animationController.toggleScroll(true);

        // Mark as seen
        sessionStorage.setItem('zash_intro_seen', 'true');

        console.log('[IntroVideo] Intro complete.');
    }
}

const introVideo = new IntroVideoSystem();
export default introVideo;
