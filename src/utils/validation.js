/**
 * Advanced Form Validation for Checkout
 * Checks required fields, lengths, and regex patterns.
 */
export const validateCheckoutForm = (formData) => {
    const errors = {};
    
    if (!formData.name || formData.name.trim().length < 2) {
        errors.name = "Full name must be at least 2 characters.";
    }
    
    // Strict email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email.trim())) {
        errors.email = "Please enter a valid email address.";
    }
    
    // Phone validation (allows international format +XX...)
    const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone.trim())) {
        errors.phone = "Valid phone number is required (e.g., +47 ...).";
    }
    
    if (!formData.city || formData.city.trim().length < 2) {
        errors.city = "Location (City/Region) is required.";
    }
    
    if (!formData.address || formData.address.trim().length < 5) {
        errors.address = "Detailed delivery address is required.";
    }
    
    return errors;
};
