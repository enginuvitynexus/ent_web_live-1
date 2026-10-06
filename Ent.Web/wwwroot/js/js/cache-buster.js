// Automatic Cache Clearing Script
// This forces browsers to reload when new versions are detected

(function () {
    'use strict';

    // Current version - update this whenever you make changes
    const CURRENT_VERSION = '20251220184900';
    const VERSION_KEY = 'site_version';

    // Check if we need to force reload
    function checkVersion() {
        try {
            const storedVersion = localStorage.getItem(VERSION_KEY);

            if (storedVersion !== CURRENT_VERSION) {
                console.log('New version detected. Clearing cache and reloading...');

                // Clear localStorage
                localStorage.clear();

                // Clear sessionStorage
                sessionStorage.clear();

                // Store new version
                localStorage.setItem(VERSION_KEY, CURRENT_VERSION);

                // Force hard reload (bypass cache)
                window.location.reload(true);
            }
        } catch (e) {
            console.error('Version check failed:', e);
        }
    }

    // Run version check immediately
    checkVersion();

    // Also check when page becomes visible (tab switching)
    document.addEventListener('visibilitychange', function () {
        if (!document.hidden) {
            checkVersion();
        }
    });

})();
