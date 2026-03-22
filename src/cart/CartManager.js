/**
 * CartManager — ZASH Ecommerce Cart Controller
 * Singleton class that mirrors the AnimationController pattern.
 * All cart data lives in localStorage. Redux stores UI state only.
 */

const STORAGE_KEY = 'zashCart';
const CART_EVENT = 'zash:cart:update';

class CartManager {
    constructor() {
        if (CartManager.instance) {
            return CartManager.instance;
        }
        this.cart = this._load();
        CartManager.instance = this;
    }

    // ─── Public API ────────────────────────────────────────────

    /**
     * Add a product variant to the cart.
     * If the same productID + color + size exists, increment qty.
     * @param {Object} variant - { productID, name, color, size, price, image }
     */
    addItem(variant) {
        const key = this._buildKey(variant);
        const existing = this.cart.find(item => item._key === key);

        if (existing) {
            existing.qty += 1;
        } else {
            this.cart.push({
                _key: key,
                productID: variant.productID,
                name: variant.name,
                color: variant.color,
                size: variant.size,
                price: variant.price,
                image: variant.image,
                qty: 1,
            });
        }

        this._save();
        this._emit(CART_EVENT);
    }

    /**
     * Remove an item from the cart by its composite key.
     * @param {string} key
     */
    removeItem(key) {
        this.cart = this.cart.filter(item => item._key !== key);
        this._save();
        this._emit(CART_EVENT);
    }

    /**
     * Increase quantity of a cart item by 1.
     * @param {string} key
     */
    increaseQuantity(key) {
        const item = this.cart.find(i => i._key === key);
        if (item) {
            item.qty += 1;
            this._save();
            this._emit(CART_EVENT);
        }
    }

    /**
     * Decrease quantity of a cart item by 1 (minimum qty: 1).
     * @param {string} key
     */
    decreaseQuantity(key) {
        const item = this.cart.find(i => i._key === key);
        if (item && item.qty > 1) {
            item.qty -= 1;
            this._save();
            this._emit(CART_EVENT);
        }
    }

    /**
     * Return a shallow copy of the cart array.
     */
    getCart() {
        return [...this.cart];
    }

    /**
     * Return the total price of all items.
     */
    getTotal() {
        return this.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    }

    /**
     * Return the total number of individual units in cart.
     */
    getTotalItems() {
        return this.cart.reduce((sum, item) => sum + item.qty, 0);
    }

    /**
     * Clear all items from the cart.
     */
    clearCart() {
        this.cart = [];
        this._save();
        this._emit(CART_EVENT);
    }

    // ─── Private Helpers ───────────────────────────────────────

    /**
     * Build a composite deduplication key.
     */
    _buildKey(variant) {
        return `${variant.productID}__${variant.color}__${variant.size}`;
    }

    /**
     * Persist the current cart to localStorage.
     */
    _save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cart));
        } catch (e) {
            console.warn('[CartManager] localStorage write failed:', e);
        }
    }

    /**
     * Load cart from localStorage on boot.
     */
    _load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.warn('[CartManager] localStorage read failed:', e);
            return [];
        }
    }

    /**
     * Dispatch a CustomEvent on window so React components can subscribe.
     * @param {string} eventName
     */
    _emit(eventName) {
        window.dispatchEvent(new CustomEvent(eventName));
    }
}

const cartManager = new CartManager();
export default cartManager;
