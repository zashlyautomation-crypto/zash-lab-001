import * as THREE from 'three';
import gsap from 'gsap';
import barba from '@barba/core';
import { store } from '../store';
import { closeCart } from '../store/cartSlice';

/**
 * Handles the cinematic transition from Cart to Checkout.
 * - Extracts visual elements and morphs into an energy sphere.
 * - Animates the sphere into the Cart Icon.
 * - Triggers barba.go('/checkout').
 * - Cleans up Three.js scenes to avoid memory leaks.
 */
export const startCheckoutTransition = (navigate) => {
    return new Promise((resolve) => {
        // Close the sidebar UI immediately or via animation
        store.dispatch(closeCart());

        // Create overlay container
        const container = document.createElement('div');
        Object.assign(container.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            zIndex: '9999',
            pointerEvents: 'none',
        });
        document.body.appendChild(container);

        // Three.js Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 10;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // ZASH "ice / crystal" energy sphere
        const geometry = new THREE.SphereGeometry(1.2, 64, 64);
        const material = new THREE.MeshPhysicalMaterial({
            color: 0xc8dbf0,        // Ice blue
            metalness: 0.1,
            roughness: 0.1,
            transmission: 0.95,     // Glass-like
            thickness: 0.8,
            emissive: 0x94d5ff,
            emissiveIntensity: 0.4,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0xffffff, 2);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // Start position (right side, where the cart sidebar is)
        sphere.position.set(4, 0, 0);
        sphere.scale.set(0, 0, 0); // Start tiny, expand as if aggregating items

        // Animation Loop
        let rafId;
        const animate = () => {
            rafId = requestAnimationFrame(animate);
            sphere.rotation.y += 0.015;
            sphere.rotation.x += 0.01;
            renderer.render(scene, camera);
        };
        animate();

        // Calculate Target Position (Cart Icon Badge)
        const cartIcon = document.getElementById('cart-icon-el');
        let targetX = 0;
        let targetY = 4; // fallback

        if (cartIcon) {
            const rect = cartIcon.getBoundingClientRect();
            // Convert to Normalized Device Coordinates (NDC)
            const ndcX = (rect.left + rect.width / 2) / window.innerWidth * 2 - 1;
            const ndcY = -(rect.top + rect.height / 2) / window.innerHeight * 2 + 1;
            
            // Map NDC to Three.js World space at z=0 (since camera is at z=10, distance is 10)
            const vector = new THREE.Vector3(ndcX, ndcY, 0.5);
            vector.unproject(camera);
            const dir = vector.sub(camera.position).normalize();
            const distance = -camera.position.z / dir.z;
            const pos = camera.position.clone().add(dir.multiplyScalar(distance));
            
            targetX = pos.x;
            targetY = pos.y;
        }

        // GSAP Timeline for cinematic transition
        const tl = gsap.timeline({
            onComplete: () => {
                // VERY IMPORTANT: cleanup to prevent memory leaks!
                cancelAnimationFrame(rafId);
                geometry.dispose();
                material.dispose();
                scene.remove(sphere);
                renderer.dispose();
                if (container.parentNode) {
                    container.parentNode.removeChild(container);
                }

                resolve();
                
                // Route to checkout
                if (navigate) {
                    navigate('/checkout'); // Use React Router for reliable component mounting
                } else {
                    try {
                        barba.go('/checkout');
                    } catch (e) {
                        window.location.href = '/checkout';
                    }
                }
            }
        });

        tl.to(sphere.scale, {
            x: 1, y: 1, z: 1,
            duration: 0.6,
            ease: 'back.out(1.2)'
        })
        .to(sphere.position, {
            x: 0,
            duration: 0.8,
            ease: 'power3.inOut' // Center screen
        }, '-=0.2')
        .to(sphere.scale, {
            x: 1.3, y: 1.3, z: 1.3,
            duration: 0.5,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: 1
        })
        .to(sphere.position, {
            x: targetX,
            y: targetY,
            duration: 0.7,
            ease: 'power4.inOut' // Move to header icon
        }, '+=0.2')
        .to(sphere.scale, {
            x: 0, y: 0, z: 0,
            duration: 0.7,
            ease: 'power4.inOut' // Shrink into the icon
        }, '<');
    });
};
