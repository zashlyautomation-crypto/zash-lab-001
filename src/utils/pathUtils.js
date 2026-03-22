/**
 * Utility to resolve asset paths based on the Vite base URL.
 * This ensures that absolute paths work correctly when the app is deployed to a subfolder.
 */
export const getAssetPath = (path) => {
    if (!path) return '';
    
    // If it's already a full URL or a relative path, return it as is
    if (path.startsWith('http') || !path.startsWith('/')) {
        return path;
    }

    // Get the base URL from Vite's environment
    // import.meta.env.BASE_URL is handled by Vite at build time
    const baseUrl = import.meta.env.BASE_URL || '/';
    
    // Ensure baseUrl ends with a slash and the path starts with a slash
    const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

    return `${normalizedBase}${normalizedPath}`;
};
