/**
 * LearnHub Icon Loader
 * Global Iconify icon management for the learning platform
 * Uses Material Design Icons (mdi) as the primary icon set
 */

// Icon mappings - centralized icon definitions
const LearnHubIcons = {
    // Navigation icons
    dashboard: 'mdi:view-dashboard',
    courses: 'mdi:book-multiple',
    myCourses: 'mdi:school',
    assignments: 'mdi:clipboard-text',
    progress: 'mdi:chart-line',
    certificates: 'mdi:trophy',
    students: 'mdi:account-group',
    quizzes: 'mdi:file-document-edit',

    // Action icons
    menu: 'mdi:menu',
    bell: 'mdi:bell',
    logout: 'mdi:logout',
    settings: 'mdi:cog',
    plus: 'mdi:plus',
    edit: 'mdi:pencil',
    delete: 'mdi:delete',
    save: 'mdi:content-save',
    close: 'mdi:close',
    search: 'mdi:magnify',
    filter: 'mdi:filter',

    // Status icons
    check: 'mdi:check',
    checkCircle: 'mdi:check-circle',
    warning: 'mdi:alert',
    error: 'mdi:alert-circle',
    info: 'mdi:information',

    // Content icons
    book: 'mdi:book-open-page-variant',
    video: 'mdi:play-circle',
    document: 'mdi:file-document',
    quiz: 'mdi:help-circle',

    // User icons
    user: 'mdi:account',
    tutor: 'mdi:account-tie',
    wave: 'mdi:hand-wave',

    // Misc icons
    clock: 'mdi:clock-outline',
    calendar: 'mdi:calendar',
    star: 'mdi:star',
    heart: 'mdi:heart',
    share: 'mdi:share-variant',
    download: 'mdi:download',
    upload: 'mdi:upload',
    link: 'mdi:link',
    arrowRight: 'mdi:arrow-right',
    arrowLeft: 'mdi:arrow-left',
    chevronDown: 'mdi:chevron-down',
    chevronUp: 'mdi:chevron-up',
    chevronRight: 'mdi:chevron-right',
    chevronLeft: 'mdi:chevron-left'
};

/**
 * Create an Iconify icon element
 * @param {string} iconName - Key from LearnHubIcons or direct Iconify icon name
 * @param {object} options - Optional styling options
 * @returns {string} HTML string for the icon element
 */
function createIcon(iconName, options = {}) {
    const icon = LearnHubIcons[iconName] || iconName;
    const style = options.style || '';
    const className = options.class || '';

    return `<span class="iconify ${className}" data-icon="${icon}" style="${style}"></span>`;
}

/**
 * Replace emoji icons with Iconify icons on page load
 * This function finds common emoji patterns and replaces them with proper icons
 */
function replaceEmojiIcons() {
    const emojiMap = {
        '📚': LearnHubIcons.book,
        '📊': LearnHubIcons.dashboard,
        '🎓': LearnHubIcons.myCourses,
        '📄': LearnHubIcons.assignments,
        '📈': LearnHubIcons.progress,
        '🏆': LearnHubIcons.certificates,
        '👥': LearnHubIcons.students,
        '📝': LearnHubIcons.quizzes,
        '🔔': LearnHubIcons.bell,
        '🚪': LearnHubIcons.logout,
        '⚙️': LearnHubIcons.settings,
        '➕': LearnHubIcons.plus,
        '✅': LearnHubIcons.checkCircle,
        '📋': LearnHubIcons.document,
        '👋': LearnHubIcons.wave,
        '☰': LearnHubIcons.menu,
        '⏰': LearnHubIcons.clock,
        '👨‍🏫': LearnHubIcons.tutor,
        '👨‍🎓': LearnHubIcons.user
    };

    // Find all text nodes containing emojis
    const walk = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    const nodesToReplace = [];
    while (walk.nextNode()) {
        const node = walk.currentNode;
        for (const [emoji, iconName] of Object.entries(emojiMap)) {
            if (node.textContent.includes(emoji)) {
                nodesToReplace.push({ node, emoji, iconName });
            }
        }
    }

    // Replace emojis with Iconify icons
    nodesToReplace.forEach(({ node, emoji, iconName }) => {
        const span = document.createElement('span');
        span.innerHTML = node.textContent.replace(
            emoji,
            `<span class="iconify" data-icon="${iconName}"></span>`
        );
        node.parentNode.replaceChild(span, node);
    });
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.LearnHubIcons = LearnHubIcons;
    window.createIcon = createIcon;
    window.replaceEmojiIcons = replaceEmojiIcons;
}
