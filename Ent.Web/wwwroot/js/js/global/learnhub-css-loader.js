/**
 * LearnHub CSS Loader
 * Dynamically loads the learning platform stylesheets
 * This allows pages outside /learning-platform/ to use the same styles
 */

(function () {
    'use strict';

    // Get base path - works from any page location
    const basePath = '/learning-platform/css/';

    // CSS files to load in order
    const cssFiles = [
        'styles.css',
        'components.css',
        'layout.css'
    ];

    // Check if already loaded
    if (window.LearnHubCSSLoaded) return;
    window.LearnHubCSSLoaded = true;

    // Load each CSS file
    cssFiles.forEach(file => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = basePath + file;
        link.id = 'learnhub-' + file.replace('.css', '');
        document.head.appendChild(link);
    });

    console.log('[LearnHub] CSS styles loaded');
})();
