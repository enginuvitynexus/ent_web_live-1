/**
 * LearnHub Data Service
 * Backend-ready data layer with localStorage fallback
 * Handles all CRUD operations for courses, users, quizzes, assignments, etc.
 */

class LearnHubDataServiceClass {
    constructor() {
        const config = window.LearnHubConfig || { storage: { prefix: 'lms_' } };
        this.storagePrefix = config.storage.prefix;
        this.initializeStorage();
    }

    // ===================================
    // STORAGE HELPERS
    // ===================================

    initializeStorage() {
        const keys = ['users', 'courses', 'quizzes', 'assignments', 'submissions',
            'enrollments', 'progress', 'certificates', 'notifications'];

        keys.forEach(key => {
            if (!this.getItem(key)) {
                this.setItem(key, []);
            }
        });
    }

    getItem(key) {
        try {
            const item = localStorage.getItem(this.storagePrefix + key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error(`Error reading ${key}:`, e);
            return null;
        }
    }

    setItem(key, value) {
        try {
            localStorage.setItem(this.storagePrefix + key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error(`Error saving ${key}:`, e);
            return false;
        }
    }

    // ===================================
    // USER MANAGEMENT
    // ===================================

    createUser(userData) {
        const users = this.getItem('users') || [];
        const utils = window.LearnHubUtils || window.Utils;

        if (users.find(u => u.email === userData.email)) {
            return { success: false, error: 'Email already registered' };
        }

        const user = {
            id: utils ? utils.generateId() : Date.now().toString(36),
            email: userData.email,
            password: userData.password,
            name: userData.name,
            role: userData.role,
            avatar: userData.avatar || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        users.push(user);
        this.setItem('users', users);

        return { success: true, user: this.sanitizeUser(user) };
    }

    authenticateUser(email, password) {
        const users = this.getItem('users') || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return { success: false, error: 'Invalid email or password' };
        }

        this.setItem('current_user', this.sanitizeUser(user));
        return { success: true, user: this.sanitizeUser(user) };
    }

    getCurrentUser() {
        return this.getItem('current_user');
    }

    updateUser(userId, updates) {
        const users = this.getItem('users') || [];
        const index = users.findIndex(u => u.id === userId);

        if (index === -1) {
            return { success: false, error: 'User not found' };
        }

        users[index] = {
            ...users[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.setItem('users', users);

        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
            this.setItem('current_user', this.sanitizeUser(users[index]));
        }

        return { success: true, user: this.sanitizeUser(users[index]) };
    }

    logout() {
        localStorage.removeItem(this.storagePrefix + 'current_user');
        return { success: true };
    }

    sanitizeUser(user) {
        const { password, ...sanitized } = user;
        return sanitized;
    }

    getAllUsers(role = null) {
        const users = this.getItem('users') || [];
        const filtered = role ? users.filter(u => u.role === role) : users;
        return filtered.map(u => this.sanitizeUser(u));
    }

    // ===================================
    // COURSE MANAGEMENT
    // ===================================

    createCourse(courseData) {
        const currentUser = this.getCurrentUser();
        const utils = window.LearnHubUtils || window.Utils;

        if (!currentUser || currentUser.role !== 'tutor') {
            return { success: false, error: 'Unauthorized' };
        }

        const courses = this.getItem('courses') || [];

        const course = {
            id: utils ? utils.generateId() : Date.now().toString(36),
            tutorId: currentUser.id,
            title: courseData.title,
            description: courseData.description,
            thumbnail: courseData.thumbnail || null,
            category: courseData.category || 'General',
            difficulty: courseData.difficulty || 'Beginner',
            duration: courseData.duration || 0,
            modules: courseData.modules || [],
            status: 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        courses.push(course);
        this.setItem('courses', courses);

        return { success: true, course };
    }

    updateCourse(courseId, updates) {
        const courses = this.getItem('courses') || [];
        const index = courses.findIndex(c => c.id === courseId);

        if (index === -1) {
            return { success: false, error: 'Course not found' };
        }

        courses[index] = {
            ...courses[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.setItem('courses', courses);
        return { success: true, course: courses[index] };
    }

    deleteCourse(courseId) {
        let courses = this.getItem('courses') || [];
        courses = courses.filter(c => c.id !== courseId);
        this.setItem('courses', courses);
        return { success: true };
    }

    getCourse(courseId) {
        const courses = this.getItem('courses') || [];
        return courses.find(c => c.id === courseId) || null;
    }

    getCourses(filters = {}) {
        let courses = this.getItem('courses') || [];

        if (filters.tutorId) {
            courses = courses.filter(c => c.tutorId === filters.tutorId);
        }
        if (filters.status) {
            courses = courses.filter(c => c.status === filters.status);
        }
        if (filters.category) {
            courses = courses.filter(c => c.category === filters.category);
        }
        if (filters.search) {
            const search = filters.search.toLowerCase();
            courses = courses.filter(c =>
                c.title.toLowerCase().includes(search) ||
                c.description.toLowerCase().includes(search)
            );
        }

        return courses;
    }

    // ===================================
    // QUIZ MANAGEMENT
    // ===================================

    createQuiz(quizData) {
        const currentUser = this.getCurrentUser();
        const utils = window.LearnHubUtils || window.Utils;

        if (!currentUser || currentUser.role !== 'tutor') {
            return { success: false, error: 'Unauthorized' };
        }

        const quizzes = this.getItem('quizzes') || [];

        const quiz = {
            id: utils ? utils.generateId() : Date.now().toString(36),
            courseId: quizData.courseId,
            tutorId: currentUser.id,
            title: quizData.title,
            description: quizData.description || '',
            questions: quizData.questions || [],
            timeLimit: quizData.timeLimit || null,
            passingGrade: quizData.passingGrade || 70,
            attempts: quizData.attempts || 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        quizzes.push(quiz);
        this.setItem('quizzes', quizzes);

        return { success: true, quiz };
    }

    updateQuiz(quizId, updates) {
        const quizzes = this.getItem('quizzes') || [];
        const index = quizzes.findIndex(q => q.id === quizId);

        if (index === -1) {
            return { success: false, error: 'Quiz not found' };
        }

        quizzes[index] = {
            ...quizzes[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.setItem('quizzes', quizzes);
        return { success: true, quiz: quizzes[index] };
    }

    deleteQuiz(quizId) {
        let quizzes = this.getItem('quizzes') || [];
        quizzes = quizzes.filter(q => q.id !== quizId);
        this.setItem('quizzes', quizzes);
        return { success: true };
    }

    getQuiz(quizId) {
        const quizzes = this.getItem('quizzes') || [];
        return quizzes.find(q => q.id === quizId) || null;
    }

    getQuizzes(filters = {}) {
        let quizzes = this.getItem('quizzes') || [];

        if (filters.courseId) {
            quizzes = quizzes.filter(q => q.courseId === filters.courseId);
        }
        if (filters.tutorId) {
            quizzes = quizzes.filter(q => q.tutorId === filters.tutorId);
        }

        return quizzes;
    }

    submitQuizAttempt(attemptData) {
        const submissions = this.getItem('submissions') || [];
        const utils = window.LearnHubUtils || window.Utils;

        const attempt = {
            id: utils ? utils.generateId() : Date.now().toString(36),
            quizId: attemptData.quizId,
            studentId: attemptData.studentId,
            answers: attemptData.answers,
            score: attemptData.score,
            percentage: attemptData.percentage,
            passed: attemptData.passed,
            timeSpent: attemptData.timeSpent,
            submittedAt: new Date().toISOString()
        };

        submissions.push(attempt);
        this.setItem('submissions', submissions);

        return { success: true, attempt };
    }

    getQuizAttempts(quizId, studentId = null) {
        let submissions = this.getItem('submissions') || [];
        submissions = submissions.filter(s => s.quizId === quizId);

        if (studentId) {
            submissions = submissions.filter(s => s.studentId === studentId);
        }

        return submissions;
    }

    // ===================================
    // ASSIGNMENT MANAGEMENT
    // ===================================

    createAssignment(assignmentData) {
        const currentUser = this.getCurrentUser();
        const utils = window.LearnHubUtils || window.Utils;

        if (!currentUser || currentUser.role !== 'tutor') {
            return { success: false, error: 'Unauthorized' };
        }

        const assignments = this.getItem('assignments') || [];

        const assignment = {
            id: utils ? utils.generateId() : Date.now().toString(36),
            courseId: assignmentData.courseId,
            tutorId: currentUser.id,
            title: assignmentData.title,
            description: assignmentData.description,
            dueDate: assignmentData.dueDate,
            maxPoints: assignmentData.maxPoints || 100,
            allowFileUpload: assignmentData.allowFileUpload !== false,
            allowTextSubmission: assignmentData.allowTextSubmission !== false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        assignments.push(assignment);
        this.setItem('assignments', assignments);

        return { success: true, assignment };
    }

    updateAssignment(assignmentId, updates) {
        const assignments = this.getItem('assignments') || [];
        const index = assignments.findIndex(a => a.id === assignmentId);

        if (index === -1) {
            return { success: false, error: 'Assignment not found' };
        }

        assignments[index] = {
            ...assignments[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.setItem('assignments', assignments);
        return { success: true, assignment: assignments[index] };
    }

    deleteAssignment(assignmentId) {
        let assignments = this.getItem('assignments') || [];
        assignments = assignments.filter(a => a.id !== assignmentId);
        this.setItem('assignments', assignments);
        return { success: true };
    }

    getAssignment(assignmentId) {
        const assignments = this.getItem('assignments') || [];
        return assignments.find(a => a.id === assignmentId) || null;
    }

    getAssignments(filters = {}) {
        let assignments = this.getItem('assignments') || [];

        if (filters.courseId) {
            assignments = assignments.filter(a => a.courseId === filters.courseId);
        }
        if (filters.tutorId) {
            assignments = assignments.filter(a => a.tutorId === filters.tutorId);
        }

        return assignments;
    }

    submitAssignment(submissionData) {
        const submissions = this.getItem('submissions') || [];
        const utils = window.LearnHubUtils || window.Utils;

        const submission = {
            id: utils ? utils.generateId() : Date.now().toString(36),
            assignmentId: submissionData.assignmentId,
            studentId: submissionData.studentId,
            textContent: submissionData.textContent || '',
            files: submissionData.files || [],
            status: 'submitted',
            grade: null,
            feedback: null,
            submittedAt: new Date().toISOString(),
            gradedAt: null
        };

        submissions.push(submission);
        this.setItem('submissions', submissions);

        return { success: true, submission };
    }

    gradeSubmission(submissionId, grade, feedback = '') {
        const submissions = this.getItem('submissions') || [];
        const index = submissions.findIndex(s => s.id === submissionId);

        if (index === -1) {
            return { success: false, error: 'Submission not found' };
        }

        submissions[index] = {
            ...submissions[index],
            status: 'graded',
            grade,
            feedback,
            gradedAt: new Date().toISOString()
        };

        this.setItem('submissions', submissions);

        const assignment = this.getAssignment(submissions[index].assignmentId);
        if (assignment) {
            this.createNotification({
                userId: submissions[index].studentId,
                title: 'Assignment Graded',
                message: `Your submission for "${assignment.title}" has been graded.`,
                type: 'grade',
                link: `/learning-platform/student-assignments.html?id=${assignment.id}`
            });
        }

        return { success: true, submission: submissions[index] };
    }

    getAssignmentSubmissions(assignmentId, studentId = null) {
        let submissions = this.getItem('submissions') || [];
        submissions = submissions.filter(s => s.assignmentId === assignmentId);

        if (studentId) {
            submissions = submissions.filter(s => s.studentId === studentId);
        }

        return submissions;
    }

    // ===================================
    // ENROLLMENT MANAGEMENT
    // ===================================

    enrollStudent(courseId, studentId = null) {
        const currentUser = this.getCurrentUser();
        const actualStudentId = studentId || currentUser?.id;
        const utils = window.LearnHubUtils || window.Utils;

        if (!actualStudentId) {
            return { success: false, error: 'User not found' };
        }

        const enrollments = this.getItem('enrollments') || [];

        if (enrollments.find(e => e.courseId === courseId && e.studentId === actualStudentId)) {
            return { success: false, error: 'Already enrolled' };
        }

        const enrollment = {
            id: utils ? utils.generateId() : Date.now().toString(36),
            courseId,
            studentId: actualStudentId,
            enrolledAt: new Date().toISOString(),
            completedAt: null,
            progress: 0
        };

        enrollments.push(enrollment);
        this.setItem('enrollments', enrollments);

        const course = this.getCourse(courseId);
        if (course) {
            this.createNotification({
                userId: actualStudentId,
                title: 'Enrollment Successful',
                message: `You've been enrolled in "${course.title}"`,
                type: 'enrollment',
                link: `/learning-platform/student-course-view.html?id=${courseId}`
            });
        }

        return { success: true, enrollment };
    }

    unenrollStudent(courseId, studentId = null) {
        const currentUser = this.getCurrentUser();
        const actualStudentId = studentId || currentUser?.id;

        let enrollments = this.getItem('enrollments') || [];
        enrollments = enrollments.filter(e => !(e.courseId === courseId && e.studentId === actualStudentId));
        this.setItem('enrollments', enrollments);

        return { success: true };
    }

    getEnrollments(filters = {}) {
        let enrollments = this.getItem('enrollments') || [];

        if (filters.courseId) {
            enrollments = enrollments.filter(e => e.courseId === filters.courseId);
        }
        if (filters.studentId) {
            enrollments = enrollments.filter(e => e.studentId === filters.studentId);
        }

        return enrollments;
    }

    isEnrolled(courseId, studentId = null) {
        const currentUser = this.getCurrentUser();
        const actualStudentId = studentId || currentUser?.id;
        const enrollments = this.getItem('enrollments') || [];
        return enrollments.some(e => e.courseId === courseId && e.studentId === actualStudentId);
    }

    // ===================================
    // PROGRESS TRACKING
    // ===================================

    updateProgress(progressData) {
        const progress = this.getItem('progress') || [];

        const existing = progress.findIndex(p =>
            p.studentId === progressData.studentId &&
            p.courseId === progressData.courseId &&
            p.moduleId === progressData.moduleId &&
            p.lessonId === progressData.lessonId
        );

        const progressItem = {
            studentId: progressData.studentId,
            courseId: progressData.courseId,
            moduleId: progressData.moduleId,
            lessonId: progressData.lessonId,
            completed: progressData.completed,
            completedAt: progressData.completed ? new Date().toISOString() : null
        };

        if (existing !== -1) {
            progress[existing] = progressItem;
        } else {
            progress.push(progressItem);
        }

        this.setItem('progress', progress);
        this.updateEnrollmentProgress(progressData.studentId, progressData.courseId);

        return { success: true };
    }

    getProgress(studentId, courseId = null) {
        let progress = this.getItem('progress') || [];
        progress = progress.filter(p => p.studentId === studentId);

        if (courseId) {
            progress = progress.filter(p => p.courseId === courseId);
        }

        return progress;
    }

    updateEnrollmentProgress(studentId, courseId) {
        const course = this.getCourse(courseId);
        if (!course) return;

        const progress = this.getProgress(studentId, courseId);
        const totalLessons = course.modules.reduce((sum, module) =>
            sum + (module.lessons || []).length, 0
        );
        const completedLessons = progress.filter(p => p.completed).length;
        const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        const enrollments = this.getItem('enrollments') || [];
        const index = enrollments.findIndex(e => e.studentId === studentId && e.courseId === courseId);

        if (index !== -1) {
            enrollments[index].progress = percentage;
            if (percentage === 100 && !enrollments[index].completedAt) {
                enrollments[index].completedAt = new Date().toISOString();
                this.generateCertificate(studentId, courseId);
            }
            this.setItem('enrollments', enrollments);
        }
    }

    // ===================================
    // CERTIFICATE MANAGEMENT
    // ===================================

    generateCertificate(studentId, courseId) {
        const certificates = this.getItem('certificates') || [];
        const utils = window.LearnHubUtils || window.Utils;

        if (certificates.find(c => c.studentId === studentId && c.courseId === courseId)) {
            return { success: false, error: 'Certificate already exists' };
        }

        const student = this.getAllUsers().find(u => u.id === studentId);
        const course = this.getCourse(courseId);

        if (!student || !course) {
            return { success: false, error: 'Student or course not found' };
        }

        const certificate = {
            id: utils ? utils.generateId() : Date.now().toString(36),
            studentId,
            courseId,
            studentName: student.name,
            courseTitle: course.title,
            issuedAt: new Date().toISOString(),
            verificationCode: (utils ? utils.generateId() : Date.now().toString(36)).substring(0, 12).toUpperCase()
        };

        certificates.push(certificate);
        this.setItem('certificates', certificates);

        this.createNotification({
            userId: studentId,
            title: 'Certificate Earned! 🎉',
            message: `Congratulations! You've earned a certificate for "${course.title}"`,
            type: 'certificate',
            link: '/learning-platform/student-certificates.html'
        });

        return { success: true, certificate };
    }

    getCertificates(studentId = null) {
        let certificates = this.getItem('certificates') || [];

        if (studentId) {
            certificates = certificates.filter(c => c.studentId === studentId);
        }

        return certificates;
    }

    // ===================================
    // NOTIFICATION MANAGEMENT
    // ===================================

    createNotification(notificationData) {
        const notifications = this.getItem('notifications') || [];
        const utils = window.LearnHubUtils || window.Utils;

        const notification = {
            id: utils ? utils.generateId() : Date.now().toString(36),
            userId: notificationData.userId,
            title: notificationData.title,
            message: notificationData.message,
            type: notificationData.type || 'info',
            link: notificationData.link || null,
            read: false,
            createdAt: new Date().toISOString()
        };

        notifications.push(notification);
        this.setItem('notifications', notifications);

        return { success: true, notification };
    }

    getNotifications(userId, unreadOnly = false) {
        let notifications = this.getItem('notifications') || [];
        notifications = notifications.filter(n => n.userId === userId);

        if (unreadOnly) {
            notifications = notifications.filter(n => !n.read);
        }

        return notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    markNotificationRead(notificationId) {
        const notifications = this.getItem('notifications') || [];
        const index = notifications.findIndex(n => n.id === notificationId);

        if (index !== -1) {
            notifications[index].read = true;
            this.setItem('notifications', notifications);
        }

        return { success: true };
    }

    markAllNotificationsRead(userId) {
        const notifications = this.getItem('notifications') || [];
        notifications.forEach(n => {
            if (n.userId === userId) {
                n.read = true;
            }
        });
        this.setItem('notifications', notifications);

        return { success: true };
    }

    // ===================================
    // ANALYTICS
    // ===================================

    getStudentAnalytics(studentId) {
        const enrollments = this.getEnrollments({ studentId });
        const certificates = this.getCertificates(studentId);
        const submissions = this.getItem('submissions') || [];
        const studentSubmissions = submissions.filter(s => s.studentId === studentId);

        return {
            totalCourses: enrollments.length,
            completedCourses: enrollments.filter(e => e.completedAt).length,
            inProgressCourses: enrollments.filter(e => !e.completedAt).length,
            averageProgress: enrollments.length > 0
                ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
                : 0,
            certificatesEarned: certificates.length,
            assignmentsSubmitted: studentSubmissions.filter(s => s.assignmentId).length,
            quizzesTaken: studentSubmissions.filter(s => s.quizId).length,
            averageQuizScore: this.calculateAverageQuizScore(studentId)
        };
    }

    getCourseAnalytics(courseId) {
        const enrollments = this.getEnrollments({ courseId });
        const quizzes = this.getQuizzes({ courseId });
        const assignments = this.getAssignments({ courseId });
        const submissions = this.getItem('submissions') || [];

        const quizSubmissions = submissions.filter(s =>
            quizzes.some(q => q.id === s.quizId)
        );

        const assignmentSubmissions = submissions.filter(s =>
            assignments.some(a => a.id === s.assignmentId)
        );

        return {
            totalStudents: enrollments.length,
            activeStudents: enrollments.filter(e => !e.completedAt).length,
            completedStudents: enrollments.filter(e => e.completedAt).length,
            averageProgress: enrollments.length > 0
                ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
                : 0,
            totalQuizzes: quizzes.length,
            totalAssignments: assignments.length,
            quizAttempts: quizSubmissions.length,
            assignmentSubmissions: assignmentSubmissions.length,
            averageQuizScore: quizSubmissions.length > 0
                ? Math.round(quizSubmissions.reduce((sum, s) => sum + s.percentage, 0) / quizSubmissions.length)
                : 0
        };
    }

    getTutorAnalytics(tutorId) {
        const courses = this.getCourses({ tutorId });
        const allEnrollments = this.getItem('enrollments') || [];
        const enrollments = allEnrollments.filter(e =>
            courses.some(c => c.id === e.courseId)
        );

        const allCertificates = this.getItem('certificates') || [];
        const certificates = allCertificates.filter(c =>
            courses.some(course => course.id === c.courseId)
        );

        return {
            totalCourses: courses.length,
            publishedCourses: courses.filter(c => c.status === 'published').length,
            draftCourses: courses.filter(c => c.status === 'draft').length,
            totalStudents: new Set(enrollments.map(e => e.studentId)).size,
            totalEnrollments: enrollments.length,
            certificatesIssued: certificates.length,
            averageCourseCompletion: enrollments.length > 0
                ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
                : 0
        };
    }

    calculateAverageQuizScore(studentId) {
        const submissions = this.getItem('submissions') || [];
        const quizSubmissions = submissions.filter(s => s.studentId === studentId && s.quizId);

        if (quizSubmissions.length === 0) return 0;

        const total = quizSubmissions.reduce((sum, s) => sum + (s.percentage || 0), 0);
        return Math.round(total / quizSubmissions.length);
    }
}

// Create global instance
const LearnHubDataService = new LearnHubDataServiceClass();

// Legacy alias for backward compatibility
const dataService = LearnHubDataService;
const DataService = LearnHubDataServiceClass;

// Export for global use
if (typeof window !== 'undefined') {
    window.LearnHubDataService = LearnHubDataService;
    window.LearnHubDataServiceClass = LearnHubDataServiceClass;
    window.dataService = dataService;
    window.DataService = DataService;
}

// Export for Node.js modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LearnHubDataService, LearnHubDataServiceClass };
}
