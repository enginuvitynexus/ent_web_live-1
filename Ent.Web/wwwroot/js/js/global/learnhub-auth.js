/**
 * LearnHub Authentication Module
 * Handles user authentication, session management, and role-based access
 */

const LearnHubAuth = {
    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        const user = this.getCurrentUser();
        return user !== null;
    },

    /**
     * Get current authenticated user
     * @returns {Object|null} User object or null
     */
    getCurrentUser() {
        if (typeof LearnHubDataService !== 'undefined') {
            return LearnHubDataService.getCurrentUser();
        }
        // Fallback for when data service not loaded yet
        const config = window.LearnHubConfig || { storage: { prefix: 'lms_' } };
        const userData = localStorage.getItem(config.storage.prefix + 'current_user');
        return userData ? JSON.parse(userData) : null;
    },

    /**
     * Get login page URL
     * @returns {string}
     */
    getLoginUrl() {
        return '/learning-platform/index.html';
    },

    /**
     * Get dashboard URL based on role
     * @param {string} role - User role ('student' or 'tutor')
     * @returns {string}
     */
    getDashboardUrl(role) {
        return role === 'tutor'
            ? '/learning-platform/tutor-dashboard.html'
            : '/learning-platform/student-dashboard.html';
    },

    /**
     * Require authentication - redirect to login if not authenticated
     * @returns {boolean} True if authenticated
     */
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = this.getLoginUrl();
            return false;
        }
        return true;
    },

    /**
     * Require specific role
     * @param {string} role - Required role
     * @returns {boolean} True if correct role
     */
    requireRole(role) {
        if (!this.requireAuth()) return false;

        const user = this.getCurrentUser();
        if (user.role !== role) {
            window.location.href = this.getDashboardUrl(user.role);
            return false;
        }
        return true;
    },

    /**
     * Logout user and redirect to login
     */
    logout() {
        if (typeof LearnHubDataService !== 'undefined') {
            LearnHubDataService.logout();
        } else {
            const config = window.LearnHubConfig || { storage: { prefix: 'lms_' } };
            localStorage.removeItem(config.storage.prefix + 'current_user');
        }
        window.location.href = this.getLoginUrl();
    },

    /**
     * Initialize auth-required page
     * @param {string|null} requiredRole - Required role (optional)
     * @returns {Object|null} Current user or null if redirect
     */
    init(requiredRole = null) {
        if (!this.requireAuth()) return null;

        if (requiredRole && !this.requireRole(requiredRole)) return null;

        // Setup user UI elements
        this.setupUserUI();

        return this.getCurrentUser();
    },

    /**
     * Setup user UI elements (avatar, name, logout buttons)
     */
    setupUserUI() {
        const user = this.getCurrentUser();
        if (!user) return;

        // Update user name displays
        document.querySelectorAll('[data-user-name]').forEach(el => {
            el.textContent = user.name;
        });

        // Update user email displays
        document.querySelectorAll('[data-user-email]').forEach(el => {
            el.textContent = user.email;
        });

        // Update user avatar
        document.querySelectorAll('[data-user-avatar]').forEach(el => {
            if (user.avatar) {
                el.innerHTML = `<img src="${user.avatar}" alt="${user.name}">`;
            } else {
                const utils = window.LearnHubUtils || window.Utils;
                el.textContent = utils ? utils.getInitials(user.name) : user.name.substring(0, 2).toUpperCase();
            }
        });

        // Setup logout buttons
        document.querySelectorAll('[data-logout]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        });
    },

    /**
     * Redirect authenticated users away from login page
     */
    redirectIfAuthenticated() {
        const user = this.getCurrentUser();
        if (user) {
            window.location.href = this.getDashboardUrl(user.role);
            return true;
        }
        return false;
    },

    // ==========================================
    // ASYNC BACKEND METHODS
    // ==========================================

    /**
     * Check if backend mode is enabled
     */
    useBackend() {
        const config = window.LearnHubConfig;
        return config && config.api && config.api.useBackend === true;
    },

    /**
     * Login via backend API
     * @param {string} email
     * @param {string} password
     * @returns {Promise<Object>}
     */
    async loginAsync(email, password) {
        if (this.useBackend() && typeof LearnHubApi !== 'undefined') {
            try {
                const result = await LearnHubApi.login(email, password);
                if (result.success && result.data?.user) {
                    // Also cache user locally for quick access
                    const config = window.LearnHubConfig || { storage: { prefix: 'lms_' } };
                    localStorage.setItem(config.storage.prefix + 'current_user', JSON.stringify(result.data.user));
                }
                return result;
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
        // Fallback to localStorage
        if (typeof LearnHubDataService !== 'undefined') {
            return LearnHubDataService.authenticateUser(email, password);
        }
        return { success: false, error: 'Auth service not available' };
    },

    /**
     * Register via backend API
     * @param {string} name
     * @param {string} email
     * @param {string} password
     * @returns {Promise<Object>}
     */
    async registerAsync(name, email, password) {
        if (this.useBackend() && typeof LearnHubApi !== 'undefined') {
            try {
                const result = await LearnHubApi.register(name, email, password);
                if (result.success && result.data?.user) {
                    const config = window.LearnHubConfig || { storage: { prefix: 'lms_' } };
                    localStorage.setItem(config.storage.prefix + 'current_user', JSON.stringify(result.data.user));
                }
                return result;
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
        // Fallback to localStorage
        if (typeof LearnHubDataService !== 'undefined') {
            const userData = { name, email, password, role: 'student' };
            const result = LearnHubDataService.createUser(userData);
            if (result.success) {
                return LearnHubDataService.authenticateUser(email, password);
            }
            return result;
        }
        return { success: false, error: 'Auth service not available' };
    },

    /**
     * Logout via backend API
     */
    async logoutAsync() {
        if (this.useBackend() && typeof LearnHubApi !== 'undefined') {
            try {
                await LearnHubApi.logout();
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
        // Clear local storage regardless
        const config = window.LearnHubConfig || { storage: { prefix: 'lms_' } };
        localStorage.removeItem(config.storage.prefix + 'current_user');
        window.location.href = this.getLoginUrl();
    },

    /**
     * Verify session with backend
     * @returns {Promise<Object|null>}
     */
    async verifySession() {
        if (this.useBackend() && typeof LearnHubApi !== 'undefined') {
            try {
                const result = await LearnHubApi.getCurrentUser();
                if (result.success && result.authenticated && result.user) {
                    const config = window.LearnHubConfig || { storage: { prefix: 'lms_' } };
                    localStorage.setItem(config.storage.prefix + 'current_user', JSON.stringify(result.user));
                    return result.user;
                }
                // Session invalid, clear local cache
                localStorage.removeItem((window.LearnHubConfig?.storage?.prefix || 'lms_') + 'current_user');
                return null;
            } catch (error) {
                console.error('Session verify error:', error);
                return null;
            }
        }
        return this.getCurrentUser();
    }

};

// Legacy alias for backward compatibility
const Auth = LearnHubAuth;

// Export for global use
if (typeof window !== 'undefined') {
    window.LearnHubAuth = LearnHubAuth;
    window.Auth = Auth; // Backward compatibility
}

// Export for Node.js modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LearnHubAuth;
}
