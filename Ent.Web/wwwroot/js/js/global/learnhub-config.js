/**
 * LearnHub Global Configuration
 * Centralized configuration for branding, theming, and API settings
 * Used across all learning platform pages for consistent behavior
 */

const LearnHubConfig = {
    // Branding - Can be customized per deployment
    branding: {
        name: "Enginuvity Academy",
        shortName: "Academy",
        logo: "/images/logo.png",
        favicon: "/images/favicon.png",
        tagline: "Transform your engineering knowledge",
        supportEmail: "academy@enginuvitynexus.com"
    },

    // Theme - Inherits from main site design system
    theme: {
        primaryColor: "hsl(220, 90%, 56%)",
        primaryDark: "hsl(220, 90%, 46%)",
        primaryLight: "hsl(220, 90%, 66%)",
        secondaryColor: "hsl(170, 76%, 42%)",
        accentPurple: "hsl(270, 70%, 60%)",
        accentOrange: "hsl(25, 95%, 58%)",
        successColor: "hsl(145, 63%, 42%)",
        warningColor: "hsl(40, 95%, 50%)",
        errorColor: "hsl(0, 72%, 51%)"
    },

    // API Configuration - Backend integration ready
    api: {
        baseUrl: "/learning-platform/api",
        endpoints: {
            auth: {
                login: "/auth.php?action=login",
                register: "/auth.php?action=register",
                logout: "/auth.php?action=logout",
                me: "/auth.php?action=me"
            },
            courses: "/courses.php",
            quizzes: "/quizzes.php",
            assignments: "/assignments.php",
            enrollments: "/enrollments.php",
            progress: "/enrollments.php?action=progress",
            certificates: "/certificates.php",
            notifications: "/notifications.php"
        },
        useBackend: false, // Set to true when database is available on staging/production
    },

    // Storage Configuration
    storage: {
        prefix: "lms_",
        sessionKey: "lms_current_user"
    },

    // Feature Flags
    features: {
        certificates: true,
        quizzes: true,
        assignments: true,
        notifications: true,
        darkMode: false,
        analytics: true
    },

    // Navigation Links
    navigation: {
        student: [
            { title: "Dashboard", href: "/learning-platform/student-dashboard.html", icon: "📊" },
            { title: "Browse Courses", href: "/learning-platform/student-courses.html", icon: "📚" },
            { title: "My Courses", href: "/learning-platform/student-courses.html?view=enrolled", icon: "🎓" },
            { title: "Assignments", href: "/learning-platform/student-assignments.html", icon: "📄" },
            { title: "Progress", href: "/learning-platform/student-progress.html", icon: "📈" },
            { title: "Certificates", href: "/learning-platform/student-certificates.html", icon: "🏆" }
        ],
        tutor: [
            { title: "Dashboard", href: "/learning-platform/tutor-dashboard.html", icon: "📊" },
            { title: "My Courses", href: "/learning-platform/tutor-courses.html", icon: "📚" },
            { title: "Students", href: "/learning-platform/tutor-students.html", icon: "👥" },
            { title: "Quizzes", href: "/learning-platform/tutor-quizzes.html", icon: "📝" },
            { title: "Assignments", href: "/learning-platform/tutor-assignments.html", icon: "📄" }
        ]
    },

    // Helper method to get full API URL
    getApiUrl(endpoint) {
        return this.api.baseUrl + endpoint;
    },

    // Helper method to get storage key with prefix
    getStorageKey(key) {
        return this.storage.prefix + key;
    }
};

// Freeze configuration to prevent accidental modifications
Object.freeze(LearnHubConfig);
Object.freeze(LearnHubConfig.branding);
Object.freeze(LearnHubConfig.theme);
Object.freeze(LearnHubConfig.api);
Object.freeze(LearnHubConfig.storage);
Object.freeze(LearnHubConfig.features);

// Export for global use
if (typeof window !== 'undefined') {
    window.LearnHubConfig = LearnHubConfig;
}

// Export for Node.js modules (testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LearnHubConfig;
}
