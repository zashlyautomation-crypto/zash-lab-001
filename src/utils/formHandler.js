/**
 * Handles communication with Formspree Endpoint.
 */
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mreyrblb';

export const submitOrder = async (orderObject) => {
    try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderObject)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Submission failed');
        }

        return { success: true, data: await response.json() };
    } catch (error) {
        console.error('Order Submission Error:', error);
        return { success: false, error: error.message || 'Network error occurred.' };
    }
};
