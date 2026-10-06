/**
 * LearnHub API Client
 * HTTP client for communicating with the PHP backend API
 * Used when LearnHubConfig.api.useBackend is true
 */

class LearnHubApiClient {
    constructor() {
        const config = window.LearnHubConfig || { api: { baseUrl: '/learning-platform/api' } };
        this.baseUrl = config.api?.baseUrl || '/learning-platform/api';
    }

    /**
     * Make an API request
     * @param {string} endpoint - API endpoint (e.g., '/auth.php?action=login')
     * @param {Object} options - Fetch options
     * @returns {Promise<Object>}
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;

        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            },
            credentials: 'include' // Include cookies for session
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    /**
     * GET request
     */
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    /**
     * POST request with JSON body
     */
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // ==========================================
    // AUTH ENDPOINTS
    // ==========================================

    async login(email, password) {
        return this.post('/auth.php?action=login', { email, password });
    }

    async register(name, email, password) {
        return this.post('/auth.php?action=register', { name, email, password });
    }

    async logout() {
        return this.post('/auth.php?action=logout', {});
    }

    async getCurrentUser() {
        return this.get('/auth.php?action=me');
    }

    // ==========================================
    // COURSE ENDPOINTS
    // ==========================================

    async getCourses(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        return this.get(`/courses.php${params ? '?' + params : ''}`);
    }

    async getCourse(courseId) {
        return this.get(`/courses.php?id=${courseId}`);
    }

    async getMyCourses() {
        return this.get('/courses.php?action=my');
    }

    async createCourse(courseData) {
        return this.post('/courses.php?action=create', courseData);
    }

    async updateCourse(courseId, updates) {
        return this.post('/courses.php?action=update', { id: courseId, ...updates });
    }

    async submitCourseForReview(courseId) {
        return this.post('/courses.php?action=submit', { id: courseId });
    }

    // ==========================================
    // ENROLLMENT ENDPOINTS
    // ==========================================

    async getEnrollments() {
        return this.get('/enrollments.php');
    }

    async enrollInCourse(courseId) {
        return this.post('/enrollments.php?action=enroll', { course_id: courseId });
    }

    async updateProgress(lessonId, completed = true, timeSpent = 0) {
        return this.post('/enrollments.php?action=progress', {
            lesson_id: lessonId,
            completed,
            time_spent: timeSpent
        });
    }
}

// Create singleton instance
const LearnHubApi = new LearnHubApiClient();

// Export for global use
if (typeof window !== 'undefined') {
    window.LearnHubApi = LearnHubApi;
    window.LearnHubApiClient = LearnHubApiClient;
}

// Export for Node.js modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LearnHubApi, LearnHubApiClient };
}
