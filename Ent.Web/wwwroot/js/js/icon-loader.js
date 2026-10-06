/**
 * Global Icon Loader
 * Loads Iconify icon library for use across all pages
 * Version: 1.0.0
 */

(function () {
    'use strict';

    // Iconify CDN configuration
    const ICONIFY_CDN = 'https://code.iconify.design/iconify-icon/2.0.0/iconify-icon.min.js';

    /**
     * Dynamically load Iconify library
     */
    function loadIconify() {
        // Check if already loaded
        if (document.querySelector('script[src*="iconify"]')) {
            return;
        }

        // Create script element
        const script = document.createElement('script');
        script.src = ICONIFY_CDN;
        script.async = false; // Load synchronously to ensure icons work immediately

        // Error handling
        script.onerror = function () {
            console.error('Failed to load Iconify library from CDN:', ICONIFY_CDN);
        };

        // Add to document head
        document.head.appendChild(script);
    }

    // Load immediately
    loadIconify();
})();
