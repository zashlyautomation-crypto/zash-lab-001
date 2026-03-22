/**
 * AddToCartAnimator — ZASH Cinematic Add-To-Cart Animation
 * Uses GSAP for motion and Three.js for particle trail effect.
 *
 * Architecture rule: Business logic (CartManager) runs BEFORE this fires.
 * This module is purely decorative — it has NO cart logic.
 */

import gsap from 'gsap';
import * as THREE from 'three';

class AddToCartAnimator {
    constructor() {
        this.isPlaying = false;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.canvas = null;
        this.rafId = null;
        this.clock = null;
    }

    /**
     * Main entry point.
     * @param {Object} options
     * @param {HTMLElement} options.sourceEl - The product image element (.po-main-image)
     * @param {HTMLElement} options.targetEl  - The cart icon element (#cart-icon-el)
     * @param {Function} options.onComplete   - Callback when animation finishes
     */
    play({ sourceEl, targetEl, onComplete }) {
        if (this.isPlaying) return;
        if (!sourceEl || !targetEl) {
            if (onComplete) onComplete();
            return;
        }

        this.isPlaying = true;

        // ── 1. Measure positions ────────────────────────────────
        const srcRect = sourceEl.getBoundingClientRect();
        const tgtRect = targetEl.getBoundingClientRect();

        // ── 2. Clone the product image ─────────────────────────
        const clone = sourceEl.cloneNode(true);
        clone.style.cssText = `
            position: fixed;
            left: ${srcRect.left}px;
            top: ${srcRect.top}px;
            width: ${srcRect.width}px;
            height: ${srcRect.height}px;
            margin: 0;
            padding: 0;
            z-index: 99999;
            pointer-events: none;
            object-fit: contain;
            transform-origin: center center;
            border-radius: 8px;
            filter: drop-shadow(0 20px 60px rgba(0,0,0,0.5));
        `;
        document.body.appendChild(clone);

        // Calculate target center
        const tgtCX = tgtRect.left + tgtRect.width / 2 - srcRect.left - srcRect.width / 2;
        const tgtCY = tgtRect.top + tgtRect.height / 2 - srcRect.top - srcRect.height / 2;

        // ── 3. Spawn Three.js particle canvas ─────────────────
        this._spawnParticleCanvas(srcRect, tgtRect);

        // ── 4. GSAP timeline ───────────────────────────────────
        const tl = gsap.timeline({
            onComplete: () => {
                this._destroy(clone, targetEl, onComplete);
            },
        });

        // Phase 2 — Shrink
        tl.to(clone, {
            scale: 0.55,
            duration: 0.35,
            ease: 'power2.inOut',
        });

        // Phase 3 — Fly toward cart icon
        tl.to(clone, {
            x: tgtCX,
            y: tgtCY,
            scale: 0.15,
            opacity: 0.8,
            duration: 0.75,
            ease: 'power4.in',
            onUpdate: () => {
                // Drive particle positions with the clone's current position
                const progress = tl.progress();
                const currentX = srcRect.left + tgtCX * gsap.utils.interpolate(0, 1, progress);
                const currentY = srcRect.top + tgtCY * gsap.utils.interpolate(0, 1, progress);
                this._updateParticleTarget(currentX, currentY);
            },
        }, '-=0.05');

        // Phase 4 — Impact: cart bounces
        tl.to(targetEl, {
            scale: 1.35,
            duration: 0.18,
            ease: 'power2.out',
        }, '-=0.15');

        tl.to(targetEl, {
            scale: 1,
            duration: 0.45,
            ease: 'elastic.out(1, 0.45)',
        });

        // Phase 5 — Clone fades out + particle burst
        tl.to(clone, {
            scale: 0,
            opacity: 0,
            duration: 0.25,
            ease: 'power3.in',
            onStart: () => {
                this._triggerBurst(tgtRect);
            },
        }, '-=0.4');
    }

    // ─── Three.js Particle System ──────────────────────────────

    _spawnParticleCanvas(srcRect, tgtRect) {
        // Create full-screen canvas overlay
        this.canvas = document.createElement('canvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            z-index: 99998;
            pointer-events: none;
        `;
        document.body.appendChild(this.canvas);

        // Three.js setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(
            0, window.innerWidth, 0, window.innerHeight, -1, 1
        );
        // Flip Y so screen coords match
        this.camera = new THREE.OrthographicCamera(
            0, window.innerWidth, window.innerHeight, 0, -1, 1
        );
        this.camera.position.z = 1;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: false,
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);

        // Particle geometry — 40 trail particles
        const COUNT = 40;
        const positions = new Float32Array(COUNT * 3);
        const colors = new Float32Array(COUNT * 3);
        const sizes = new Float32Array(COUNT);
        const velocities = [];

        // Start all particles at source
        for (let i = 0; i < COUNT; i++) {
            positions[i * 3] = srcRect.left + srcRect.width / 2;
            positions[i * 3 + 1] = srcRect.top + srcRect.height / 2;
            positions[i * 3 + 2] = 0;

            // Ice-white color palette
            const t = Math.random();
            colors[i * 3] = 0.85 + t * 0.15;     // R
            colors[i * 3 + 1] = 0.92 + t * 0.08; // G
            colors[i * 3 + 2] = 1.0;              // B

            sizes[i] = 4 + Math.random() * 8;

            velocities.push({
                x: (Math.random() - 0.5) * 3,
                y: (Math.random() - 0.5) * 3,
                life: Math.random(),
                maxLife: 0.6 + Math.random() * 0.8,
            });
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const mat = new THREE.PointsMaterial({
            size: 6,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            sizeAttenuation: false,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        this.particles = new THREE.Points(geo, mat);
        this.scene.add(this.particles);

        this._particleTarget = {
            x: srcRect.left + srcRect.width / 2,
            y: srcRect.top + srcRect.height / 2,
        };
        this._velocities = velocities;
        this._burstTriggered = false;

        this.clock = new THREE.Clock();

        // Render loop
        const animate = () => {
            if (!this.renderer || !this.isPlaying) {
                if (this.rafId) cancelAnimationFrame(this.rafId);
                return;
            }
            this.rafId = requestAnimationFrame(animate);

            const delta = this.clock.getDelta();
            this._tickParticles(delta);
            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }

    _tickParticles(delta) {
        if (!this.particles) return;
        const positions = this.particles.geometry.attributes.position.array;
        const COUNT = this._velocities.length;

        for (let i = 0; i < COUNT; i++) {
            const v = this._velocities[i];

            // Trail particles converge toward target
            if (!this._burstTriggered) {
                const px = positions[i * 3];
                const py = positions[i * 3 + 1];

                const dx = this._particleTarget.x - px;
                const dy = this._particleTarget.y - py;

                positions[i * 3] += dx * 0.08 + v.x * (1 - v.life / v.maxLife);
                positions[i * 3 + 1] += dy * 0.08 + v.y * (1 - v.life / v.maxLife);
            } else {
                // Burst: fly outward
                positions[i * 3] += v.x * 4;
                positions[i * 3 + 1] += v.y * 4;
                v.life += delta;
            }
        }

        this.particles.geometry.attributes.position.needsUpdate = true;

        // Fade out material over time
        if (this._burstTriggered) {
            this.particles.material.opacity = Math.max(0, this.particles.material.opacity - delta * 2);
        }
    }

    _updateParticleTarget(x, y) {
        if (this._particleTarget) {
            this._particleTarget.x = x;
            this._particleTarget.y = y;
        }
    }

    _triggerBurst(tgtRect) {
        if (!this._velocities || !this.particles) return;
        this._burstTriggered = true;

        // Scatter velocities outward from cart icon
        const cx = tgtRect.left + tgtRect.width / 2;
        const cy = tgtRect.top + tgtRect.height / 2;
        const positions = this.particles.geometry.attributes.position.array;

        this._velocities.forEach((v, i) => {
            positions[i * 3] = cx;
            positions[i * 3 + 1] = cy;
            v.x = (Math.random() - 0.5) * 8;
            v.y = (Math.random() - 0.5) * 8;
            v.life = 0;
        });
        this.particles.geometry.attributes.position.needsUpdate = true;
    }

    // ─── Cleanup ───────────────────────────────────────────────

    _destroy(clone, targetEl, onComplete) {
        // Remove clone
        if (clone && clone.parentNode) {
            clone.parentNode.removeChild(clone);
        }

        // Reset target scale
        gsap.set(targetEl, { clearProps: 'scale' });

        // Delay canvas removal to let burst fade
        setTimeout(() => {
            this._killThreeJS();
            this.isPlaying = false;
            if (onComplete) onComplete();
        }, 600);
    }

    _killThreeJS() {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer = null;
        }
        if (this.scene) {
            this.scene.clear();
            this.scene = null;
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
            this.canvas = null;
        }
        this.particles = null;
        this.camera = null;
        this.clock = null;
        this._velocities = null;
        this._particleTarget = null;
        this._burstTriggered = false;
    }
}

const addToCartAnimator = new AddToCartAnimator();
export default addToCartAnimator;
