import cartManager from '../cart/CartManager';

/**
 * Builds the strictly structured Order Object.
 * @param {Object} formData 
 * @returns {Object} orderObject
 */
export const buildOrderObject = (formData) => {
    const cartItems = cartManager.getCart();
    
    const items = cartItems.map(item => ({
        productID: item.productID,
        name: item.name,
        color: item.color,
        size: item.size,
        price: item.price,
        qty: item.qty
    }));

    const subtotal = cartManager.getTotal();
    const tax = subtotal * 0.04; // 4% tax to match UI logic
    const total = subtotal + tax;

    // Generate unique professional order ID: ZASH-YYYYMMDD-XXXX
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderID = `ZASH-${dateStr}-${randomSuffix}`;

    return {
        customer: {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            city: formData.city.trim(),
            address: formData.address.trim()
        },
        items: items,
        pricing: {
            subtotal,
            tax,
            total
        },
        meta: {
            orderID,
            date: new Date().toISOString(),
            paymentMethod: "COD"
        }
    };
};
