/**
 * LearnHub Notification System
 * Toast notifications, badges, and in-app notification management
 */

const LearnHubNotifications = {
    toastContainer: null,

    /**
     * Initialize notification container
     */
    init() {
        if (!document.getElementById('toastContainer')) {
            const container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            container.style.cssText = `
                position: fixed;
                top: var(--spacing-lg, 2rem);
                right: var(--spacing-lg, 2rem);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: var(--spacing-sm, 1rem);
                max-width: 400px;
            `;
            document.body.appendChild(container);
        }
        this.toastContainer = document.getElementById('toastContainer');
    },

    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {string} type - Type: success, error, warning, info
     * @param {number} duration - Duration in ms (0 for persistent)
     * @returns {HTMLElement} Toast element
     */
    showToast(message, type = 'info', duration = 3000) {
        this.init();

        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        const colors = {
            success: 'var(--success, hsl(145, 63%, 42%))',
            error: 'var(--error, hsl(0, 72%, 51%))',
            warning: 'var(--warning, hsl(40, 95%, 50%))',
            info: 'var(--info, hsl(210, 90%, 56%))'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            display: flex;
            align-items: flex-start;
            gap: var(--spacing-sm, 1rem);
            padding: var(--spacing-md, 1.5rem);
            background: var(--bg-elevated, white);
            border-radius: var(--radius-md, 1rem);
            box-shadow: var(--shadow-lg, 0 10px 15px rgba(0,0,0,0.1));
            border-left: 4px solid ${colors[type]};
            animation: slideInRight 0.3s ease-out;
            transition: all 0.3s ease-out;
        `;

        toast.innerHTML = `
            <div style="font-size: 1.5rem; line-height: 1; color: ${colors[type]};">${icons[type] || icons.info}</div>
            <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 0.25rem; color: var(--text-primary, #1a1a1a);">${this.capitalize(type)}</div>
                <div style="font-size: 0.875rem; color: var(--text-secondary, #666);">${message}</div>
            </div>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; color: var(--text-tertiary, #999); font-size: 1.25rem; cursor: pointer; padding: 0; margin-left: 0.5rem;">✕</button>
        `;

        this.toastContainer.appendChild(toast);

        if (duration > 0) {
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100px)';
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }

        return toast;
    },

    /**
     * Update notification badge count
     * @param {number} count - Notification count
     */
    updateNotificationBadge(count) {
        const badges = document.querySelectorAll('[data-notification-badge]');
        badges.forEach(badge => {
            if (count > 0) {
                badge.textContent = count > 9 ? '9+' : count;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        });
    },

    /**
     * Load notifications for current user
     * @returns {Array} Notifications array
     */
    loadNotifications() {
        const auth = window.LearnHubAuth || window.Auth;
        if (!auth || !auth.isAuthenticated()) return [];

        const user = auth.getCurrentUser();
        const dataService = window.LearnHubDataService || window.dataService;

        if (!dataService) return [];

        const notifications = dataService.getNotifications(user.id);
        const unreadCount = notifications.filter(n => !n.read).length;
        this.updateNotificationBadge(unreadCount);

        return notifications;
    },

    /**
     * Render notifications in a dropdown/list container
     * @param {HTMLElement} containerElement - Container element
     */
    renderNotifications(containerElement) {
        const notifications = this.loadNotifications();
        const utils = window.LearnHubUtils || window.Utils;

        if (notifications.length === 0) {
            containerElement.innerHTML = `
                <div class="empty-state" style="padding: var(--spacing-lg, 2rem); text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: var(--spacing-sm, 1rem);">🔔</div>
                    <div style="color: var(--text-tertiary, #999);">No notifications yet</div>
                </div>
            `;
            return;
        }

        containerElement.innerHTML = notifications.slice(0, 10).map(notif => `
            <div class="dropdown-item ${notif.read ? 'read' : 'unread'}" 
                 onclick="LearnHubNotifications.handleNotificationClick('${notif.id}', '${notif.link || ''}')"
                 style="flex-direction: column; align-items: flex-start; padding: var(--spacing-md, 1.5rem); border-bottom: 1px solid var(--border-light, #eee); cursor: pointer; ${!notif.read ? 'background: rgba(59, 130, 246, 0.05);' : ''}">
                <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 0.25rem;">
                    <strong style="color: var(--text-primary, #1a1a1a); font-size: var(--text-sm, 0.875rem);">${notif.title}</strong>
                    <span style="font-size: var(--text-xs, 0.75rem); color: var(--text-tertiary, #999);">${utils ? utils.formatDate(notif.createdAt, 'relative') : notif.createdAt}</span>
                </div>
                <div style="font-size: var(--text-sm, 0.875rem); color: var(--text-secondary, #666);">${notif.message}</div>
            </div>
        `).join('');

        // Add "Mark all as read" button if unread exist
        const unreadCount = notifications.filter(n => !n.read).length;
        if (unreadCount > 0) {
            const markAllBtn = document.createElement('div');
            markAllBtn.className = 'dropdown-item';
            markAllBtn.style.cssText = 'justify-content: center; color: var(--primary-color, #3b82f6); font-weight: 600; cursor: pointer; padding: var(--spacing-md, 1.5rem);';
            markAllBtn.textContent = 'Mark all as read';
            markAllBtn.onclick = () => this.markAllAsRead();
            containerElement.appendChild(markAllBtn);
        }
    },

    /**
     * Handle notification click
     * @param {string} notificationId - Notification ID
     * @param {string} link - Optional link to navigate to
     */
    handleNotificationClick(notificationId, link) {
        const dataService = window.LearnHubDataService || window.dataService;
        const auth = window.LearnHubAuth || window.Auth;

        if (dataService) {
            dataService.markNotificationRead(notificationId);
            if (auth && auth.isAuthenticated()) {
                this.updateNotificationBadge(dataService.getNotifications(auth.getCurrentUser().id, true).length);
            }
        }

        if (link) {
            window.location.href = link;
        }
    },

    /**
     * Mark all notifications as read
     */
    markAllAsRead() {
        const auth = window.LearnHubAuth || window.Auth;
        const dataService = window.LearnHubDataService || window.dataService;

        if (!auth || !auth.isAuthenticated()) return;

        const user = auth.getCurrentUser();
        if (dataService) {
            dataService.markAllNotificationsRead(user.id);
        }

        this.updateNotificationBadge(0);

        // Refresh notification display
        const container = document.querySelector('[data-notifications-list]');
        if (container) {
            this.renderNotifications(container);
        }

        this.showToast('All notifications marked as read', 'success');
    },

    /**
     * Capitalize first letter
     * @param {string} str - String to capitalize
     * @returns {string}
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
};

// Global shorthand function
function showToast(message, type = 'info', duration = 3000) {
    return LearnHubNotifications.showToast(message, type, duration);
}

// Legacy alias
const NotificationManager = LearnHubNotifications;

// Export for global use
if (typeof window !== 'undefined') {
    window.LearnHubNotifications = LearnHubNotifications;
    window.NotificationManager = NotificationManager;
    window.showToast = showToast;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    LearnHubNotifications.init();

    const auth = window.LearnHubAuth || window.Auth;
    if (auth && auth.isAuthenticated()) {
        LearnHubNotifications.loadNotifications();
    }
});

// Export for Node.js modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LearnHubNotifications;
}
