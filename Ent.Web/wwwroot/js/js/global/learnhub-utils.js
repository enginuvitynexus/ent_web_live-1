/**
 * LearnHub Global Utilities
 * Consolidated utility functions for the learning platform
 * Combines functionality from learning-platform/js/utils.js and admin global-components.js
 */

const LearnHubUtils = {
    // ===================================
    // ID & DATA UTILITIES
    // ===================================

    /**
     * Generate a unique ID
     * @returns {string} Unique identifier
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Deep clone an object
     * @param {Object} obj - Object to clone
     * @returns {Object} Cloned object
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    // ===================================
    // DATE & TIME FORMATTING
    // ===================================

    /**
     * Format date to readable string
     * @param {Date|string} date - Date to format
     * @param {string} format - Format type: 'default', 'short', 'time', 'relative', 'datetime'
     * @returns {string} Formatted date
     */
    formatDate(date, format = 'default') {
        const d = new Date(date);

        if (format === 'default') {
            return d.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        if (format === 'short') {
            return d.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }

        if (format === 'time') {
            return d.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        if (format === 'datetime') {
            return d.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        if (format === 'relative') {
            return this.getRelativeTime(d);
        }

        return d.toISOString();
    },

    /**
     * Get relative time (e.g., "2 hours ago")
     * @param {Date|string} date - Date to compare
     * @returns {string} Relative time string
     */
    getRelativeTime(date) {
        const now = new Date();
        const diff = now - new Date(date);
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return 'Just now';
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
        if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
        return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? 's' : ''} ago`;
    },

    /**
     * Calculate time remaining until a date
     * @param {Date|string} endDate - Target end date
     * @returns {string} Time remaining string
     */
    getTimeRemaining(endDate) {
        const now = new Date();
        const end = new Date(endDate);
        const diff = end - now;

        if (diff <= 0) return 'Expired';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) return `${days}d ${hours}h remaining`;
        if (hours > 0) return `${hours}h ${minutes}m remaining`;
        return `${minutes}m remaining`;
    },

    /**
     * Format duration (minutes to readable string)
     * @param {number} minutes - Duration in minutes
     * @returns {string} Formatted duration
     */
    formatDuration(minutes) {
        if (minutes < 60) return `${minutes} min`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
    },

    // ===================================
    // STRING & TEXT UTILITIES
    // ===================================

    /**
     * Truncate string with ellipsis
     * @param {string} str - String to truncate
     * @param {number} length - Max length
     * @returns {string} Truncated string
     */
    truncate(str, length = 50) {
        if (!str) return '';
        if (str.length <= length) return str;
        return str.substring(0, length) + '...';
    },

    /**
     * Get initials from name
     * @param {string} name - Full name
     * @returns {string} Initials (max 2 characters)
     */
    getInitials(name) {
        if (!name) return '??';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    },

    /**
     * Sanitize HTML to prevent XSS
     * @param {string} html - HTML string to sanitize
     * @returns {string} Sanitized string
     */
    sanitizeHTML(html) {
        const temp = document.createElement('div');
        temp.textContent = html;
        return temp.innerHTML;
    },

    // ===================================
    // FORMAT UTILITIES
    // ===================================

    /**
     * Format file size to human readable
     * @param {number} bytes - File size in bytes
     * @returns {string} Formatted size
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },

    /**
     * Calculate percentage
     * @param {number} value - Current value
     * @param {number} total - Total value
     * @returns {number} Percentage (0-100)
     */
    calculatePercentage(value, total) {
        if (total === 0) return 0;
        return Math.round((value / total) * 100);
    },

    /**
     * Get grade letter from percentage
     * @param {number} percentage - Score percentage
     * @returns {string} Grade letter
     */
    getGradeLetter(percentage) {
        if (percentage >= 90) return 'A';
        if (percentage >= 80) return 'B';
        if (percentage >= 70) return 'C';
        if (percentage >= 60) return 'D';
        return 'F';
    },

    // ===================================
    // VALIDATION UTILITIES
    // ===================================

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} Is valid
     */
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @returns {Object} { valid: boolean, errors: string[] }
     */
    validatePassword(password) {
        const errors = [];
        if (password.length < 8) errors.push('Password must be at least 8 characters');
        if (!/[A-Z]/.test(password)) errors.push('Password must contain an uppercase letter');
        if (!/[a-z]/.test(password)) errors.push('Password must contain a lowercase letter');
        if (!/[0-9]/.test(password)) errors.push('Password must contain a number');
        return {
            valid: errors.length === 0,
            errors
        };
    },

    // ===================================
    // FUNCTION UTILITIES
    // ===================================

    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // ===================================
    // ARRAY UTILITIES
    // ===================================

    /**
     * Shuffle array randomly
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled copy
     */
    shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    // ===================================
    // FILE & CLIPBOARD UTILITIES
    // ===================================

    /**
     * Convert file to base64
     * @param {File} file - File to convert
     * @returns {Promise<string>} Base64 string
     */
    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    },

    /**
     * Download content as file
     * @param {string} content - File content
     * @param {string} filename - Download filename
     * @param {string} mimeType - MIME type
     */
    downloadFile(content, filename, mimeType = 'text/plain') {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    },

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} Success status
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            return false;
        }
    },

    // ===================================
    // COLOR UTILITIES
    // ===================================

    /**
     * Get random color from palette
     * @returns {string} HSL color string
     */
    getRandomColor() {
        const colors = [
            'hsl(250, 95%, 62%)',
            'hsl(180, 85%, 55%)',
            'hsl(145, 75%, 55%)',
            'hsl(30, 95%, 60%)',
            'hsl(330, 85%, 65%)',
            'hsl(210, 85%, 62%)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
};

// Legacy alias for backward compatibility
const Utils = LearnHubUtils;

// Export for global use
if (typeof window !== 'undefined') {
    window.LearnHubUtils = LearnHubUtils;
    window.Utils = Utils; // Backward compatibility
}

// Export for Node.js modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LearnHubUtils;
}
