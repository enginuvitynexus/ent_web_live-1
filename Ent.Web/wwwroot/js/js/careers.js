// ===================================
// CAREER DATA SERVICE - LocalStorage Management
// ===================================

class CareerDataService {
    constructor() {
        this.storagePrefix = 'ent_careers_';
        this.initializeStorage();
    }

    // ===================================
    // STORAGE HELPERS
    // ===================================

    initializeStorage() {
        const keys = ['jobs', 'applications'];

        keys.forEach(key => {
            if (!this.getItem(key)) {
                this.setItem(key, []);
            }
        });

        // Load demo data if storage is empty
        if (this.getItem('jobs').length === 0) {
            this.loadDemoData();
        }
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

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // ===================================
    // JOB MANAGEMENT
    // ===================================

    createJob(jobData) {
        const jobs = this.getItem('jobs') || [];

        const job = {
            id: this.generateId(),
            title: jobData.title,
            department: jobData.department,
            location: jobData.location,
            type: jobData.type, // Full-time, Part-time, Contract
            description: jobData.description,
            requirements: jobData.requirements || [],
            responsibilities: jobData.responsibilities || [],
            salary: jobData.salary || '',
            status: jobData.status || 'draft', // draft, published
            postedDate: new Date().toISOString(),
            updatedDate: new Date().toISOString()
        };

        jobs.push(job);
        this.setItem('jobs', jobs);

        return { success: true, job };
    }

    updateJob(jobId, updates) {
        const jobs = this.getItem('jobs') || [];
        const index = jobs.findIndex(j => j.id === jobId);

        if (index === -1) {
            return { success: false, error: 'Job not found' };
        }

        jobs[index] = {
            ...jobs[index],
            ...updates,
            updatedDate: new Date().toISOString()
        };

        this.setItem('jobs', jobs);
        return { success: true, job: jobs[index] };
    }

    deleteJob(jobId) {
        let jobs = this.getItem('jobs') || [];
        jobs = jobs.filter(j => j.id !== jobId);
        this.setItem('jobs', jobs);
        return { success: true };
    }

    getJob(jobId) {
        const jobs = this.getItem('jobs') || [];
        return jobs.find(j => j.id === jobId) || null;
    }

    getJobs(filters = {}) {
        let jobs = this.getItem('jobs') || [];

        if (filters.status) {
            jobs = jobs.filter(j => j.status === filters.status);
        }

        if (filters.department) {
            jobs = jobs.filter(j => j.department === filters.department);
        }

        if (filters.type) {
            jobs = jobs.filter(j => j.type === filters.type);
        }

        if (filters.search) {
            const search = filters.search.toLowerCase();
            jobs = jobs.filter(j =>
                j.title.toLowerCase().includes(search) ||
                j.description.toLowerCase().includes(search) ||
                j.department.toLowerCase().includes(search)
            );
        }

        return jobs.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    }

    publishJob(jobId) {
        return this.updateJob(jobId, { status: 'published' });
    }

    unpublishJob(jobId) {
        return this.updateJob(jobId, { status: 'draft' });
    }

    // ===================================
    // APPLICATION MANAGEMENT
    // ===================================

    async submitApplication(applicationData) {
        try {
            const formData = new FormData();
            formData.append('job_id', applicationData.jobId);
            formData.append('full_name', applicationData.applicantName);
            formData.append('email', applicationData.email);
            formData.append('phone', applicationData.phone);
            formData.append('cover_letter', applicationData.coverLetter || '');

            // Handle Resume - convert base64 back to blob or handle file input directly
            // In the HTML update, we'll pass the file object directly instead of base64
            if (applicationData.resumeFile) {
                formData.append('resume', applicationData.resumeFile);
            }

            const response = await fetch('admin/api/careers.php?action=apply', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error submitting application:', error);
            return { success: false, error: error.message };
        }
    }

    updateApplicationStatus(applicationId, status, notes = '') {
        const applications = this.getItem('applications') || [];
        const index = applications.findIndex(a => a.id === applicationId);

        if (index === -1) {
            return { success: false, error: 'Application not found' };
        }

        applications[index] = {
            ...applications[index],
            status,
            notes
        };

        this.setItem('applications', applications);
        return { success: true, application: applications[index] };
    }

    getApplication(applicationId) {
        const applications = this.getItem('applications') || [];
        return applications.find(a => a.id === applicationId) || null;
    }

    getApplications(filters = {}) {
        let applications = this.getItem('applications') || [];

        if (filters.jobId) {
            applications = applications.filter(a => a.jobId === filters.jobId);
        }

        if (filters.status) {
            applications = applications.filter(a => a.status === filters.status);
        }

        return applications.sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate));
    }

    deleteApplication(applicationId) {
        let applications = this.getItem('applications') || [];
        applications = applications.filter(a => a.id !== applicationId);
        this.setItem('applications', applications);
        return { success: true };
    }

    // ===================================
    // ANALYTICS
    // ===================================

    getAnalytics() {
        const jobs = this.getItem('jobs') || [];
        const applications = this.getItem('applications') || [];

        const publishedJobs = jobs.filter(j => j.status === 'published');

        // Applications by status
        const statusCounts = {
            new: applications.filter(a => a.status === 'new').length,
            reviewed: applications.filter(a => a.status === 'reviewed').length,
            shortlisted: applications.filter(a => a.status === 'shortlisted').length,
            rejected: applications.filter(a => a.status === 'rejected').length
        };

        // Jobs with application counts
        const jobsWithApplications = publishedJobs.map(job => ({
            ...job,
            applicationCount: applications.filter(a => a.jobId === job.id).length
        })).sort((a, b) => b.applicationCount - a.applicationCount);

        return {
            totalJobs: jobs.length,
            publishedJobs: publishedJobs.length,
            draftJobs: jobs.filter(j => j.status === 'draft').length,
            totalApplications: applications.length,
            statusCounts,
            topJobs: jobsWithApplications.slice(0, 5)
        };
    }

    // ===================================
    // EXPORT
    // ===================================

    exportApplicationsToCSV(jobId = null) {
        let applications = this.getApplications(jobId ? { jobId } : {});
        const jobs = this.getItem('jobs') || [];

        if (applications.length === 0) {
            return { success: false, error: 'No applications to export' };
        }

        // CSV Headers
        const headers = ['Application ID', 'Job Title', 'Applicant Name', 'Email', 'Phone', 'Status', 'Submitted Date', 'Notes'];

        // CSV Rows
        const rows = applications.map(app => {
            const job = jobs.find(j => j.id === app.jobId);
            return [
                app.id,
                job ? job.title : 'Unknown',
                app.applicantName,
                app.email,
                app.phone,
                app.status,
                new Date(app.submittedDate).toLocaleString(),
                app.notes.replace(/"/g, '""') // Escape quotes
            ];
        });

        // Create CSV content
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        return { success: true, csv: csvContent };
    }

    downloadCSV(csvContent, filename = 'applications.csv') {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // ===================================
    // DEMO DATA
    // ===================================

    loadDemoData() {
        const demoJobs = [
            {
                id: this.generateId(),
                title: 'Senior Software Engineer',
                department: 'Engineering',
                location: 'Visakhapatnam / Hybrid',
                type: 'Full-time',
                description: 'We are seeking an experienced Senior Software Engineer to join our innovative engineering team. You will work on cutting-edge projects involving AI, quantum computing, and advanced simulations.',
                requirements: [
                    'Bachelor\'s or Master\'s degree in Computer Science or related field',
                    '5+ years of software development experience',
                    'Strong proficiency in JavaScript, Python, or C++',
                    'Experience with cloud platforms (AWS, Azure, or GCP)',
                    'Knowledge of AI/ML frameworks is a plus',
                    'Excellent problem-solving and communication skills'
                ],
                responsibilities: [
                    'Design and develop scalable software solutions',
                    'Collaborate with cross-functional teams on complex projects',
                    'Mentor junior engineers and conduct code reviews',
                    'Participate in architectural decisions and technical planning',
                    'Stay updated with emerging technologies and best practices'
                ],
                salary: 'Competitive, based on experience',
                status: 'published',
                postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                updatedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: this.generateId(),
                title: 'Quantum Computing Research Scientist',
                department: 'Research & Development',
                location: 'Remote',
                type: 'Full-time',
                description: 'Join our R&D team to push the boundaries of quantum computing applications in engineering and simulation.',
                requirements: [
                    'Ph.D. in Physics, Computer Science, or related field',
                    'Strong background in quantum mechanics and quantum computing',
                    'Experience with Qiskit, Cirq, or similar quantum frameworks',
                    'Published research in quantum computing or related areas',
                    'Programming skills in Python and C++'
                ],
                responsibilities: [
                    'Conduct research on quantum algorithms for engineering applications',
                    'Develop quantum computing solutions for clients',
                    'Publish research findings in peer-reviewed journals',
                    'Collaborate with academic and industry partners',
                    'Present findings at conferences and workshops'
                ],
                salary: 'Highly competitive',
                status: 'published',
                postedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                updatedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: this.generateId(),
                title: 'CFD Engineer',
                department: 'Engineering',
                location: 'Visakhapatnam',
                type: 'Full-time',
                description: 'We are looking for a CFD Engineer to work on advanced computational fluid dynamics projects in aerospace, automotive, and marine industries.',
                requirements: [
                    'Master\'s degree in Mechanical Engineering, Aerospace Engineering, or related field',
                    '3+ years of experience in CFD analysis',
                    'Proficiency in ANSYS Fluent, OpenFOAM, or similar tools',
                    'Strong understanding of fluid mechanics and heat transfer',
                    'Experience with CAD software (SolidWorks, CATIA)'
                ],
                responsibilities: [
                    'Perform CFD simulations for various engineering applications',
                    'Analyze and interpret simulation results',
                    'Optimize designs based on CFD analysis',
                    'Collaborate with design teams and clients',
                    'Prepare technical reports and presentations'
                ],
                salary: '₹8-15 LPA',
                status: 'published',
                postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                updatedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: this.generateId(),
                title: 'Digital Marketing Specialist',
                department: 'Marketing',
                location: 'Remote',
                type: 'Part-time',
                description: 'Help us grow our brand presence and reach engineering professionals through strategic digital marketing campaigns.',
                requirements: [
                    'Bachelor\'s degree in Marketing, Communications, or related field',
                    '2+ years of digital marketing experience',
                    'Proficiency in SEO, SEM, and social media marketing',
                    'Experience with Google Analytics, Google Ads',
                    'Strong content creation and copywriting skills',
                    'B2B marketing experience preferred'
                ],
                responsibilities: [
                    'Develop and execute digital marketing strategies',
                    'Manage social media channels and content calendar',
                    'Optimize website for SEO and user engagement',
                    'Track and analyze marketing metrics',
                    'Create engaging content for various platforms'
                ],
                salary: '₹3-6 LPA (pro-rated for part-time)',
                status: 'published',
                postedDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
                updatedDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: this.generateId(),
                title: 'Course Instructor - AI & Machine Learning',
                department: 'ENT Academy',
                location: 'Visakhapatnam / Hybrid',
                type: 'Contract',
                description: 'We are seeking passionate instructors to teach AI and Machine Learning courses at ENT Academy.',
                requirements: [
                    'Master\'s or Ph.D. in Computer Science, AI, or related field',
                    'Strong expertise in machine learning and deep learning',
                    'Teaching or training experience',
                    'Excellent presentation and communication skills',
                    'Industry experience in AI/ML projects'
                ],
                responsibilities: [
                    'Develop course curriculum and materials',
                    'Conduct engaging lectures and workshops',
                    'Mentor students on projects and assignments',
                    'Evaluate student performance and provide feedback',
                    'Stay current with AI/ML trends and technologies'
                ],
                salary: 'Per course basis',
                status: 'published',
                postedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                updatedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];

        this.setItem('jobs', demoJobs);
        console.log('Demo career data loaded successfully');
    }

    clearAllData() {
        this.setItem('jobs', []);
        this.setItem('applications', []);
        console.log('All career data cleared');
    }
}

// Initialize service
const careerService = new CareerDataService();
