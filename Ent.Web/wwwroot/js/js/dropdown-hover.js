// Dropdown Hover Descriptions
// This script dynamically updates the dropdown preview panel with specific descriptions for each submenu item

document.addEventListener('DOMContentLoaded', function () {
    // Descriptions for each submenu item
    const descriptions = {
        // Industries
        'software-solutions.html': {
            title: 'Software Solutions',
            text: 'Innovative software development for diverse industry needs with cutting-edge technology.'
        },
        'automotive.html': {
            title: 'Automotive',
            text: 'Advanced engineering solutions for next-generation vehicles and mobility systems.'
        },
        'aerospace.html': {
            title: 'Aerospace',
            text: 'Precision engineering and simulation for aviation and space exploration technologies.'
        },
        'marine.html': {
            title: 'Marine',
            text: 'Hydrodynamic analysis and vessel optimization for maritime excellence.'
        },
        'education.html': {
            title: 'Education',
            text: 'Training programs and academic solutions to develop future engineering talent.'
        },

        // Services
        'quantum-computing.html': {
            title: 'Quantum Computing',
            text: 'Harnessing quantum algorithms to solve complex computational challenges.'
        },
        'ai-ml.html': {
            title: 'AI & Machine Learning',
            text: 'Intelligent systems and predictive analytics powered by advanced machine learning.'
        },
        'simulations.html': {
            title: 'Simulations',
            text: 'High-fidelity CFD, FEA, and multi-physics simulations for engineering optimization.'
        },
        'digital-twin.html': {
            title: 'Digital Twin',
            text: 'Virtual replicas of physical systems for real-time monitoring and optimization.'
        },
        'customized-software.html': {
            title: 'Customized Software',
            text: 'Tailored software solutions designed to meet your unique business requirements.'
        },
        'ai-system-integration.html': {
            title: 'AI System Integration',
            text: 'Seamless integration of AI capabilities into existing workflows and systems.'
        },
        'consultancy.html': {
            title: 'Consultancy Services',
            text: 'Expert guidance and project support to accelerate your engineering initiatives.'
        },
        'engineering-rd.html': {
            title: 'Engineering R&D',
            text: 'Research and development services driving innovation across engineering domains.'
        },

        // ENT Academy
        'quantum-computing-courses.html': {
            title: 'Quantum Computing Courses',
            text: 'Comprehensive training in quantum algorithms, gates, and real-world applications.'
        },
        'cfd-courses.html': {
            title: 'CFD Courses',
            text: 'Master computational fluid dynamics with hands-on simulation training.'
        }
    };

    // Default descriptions for each dropdown category
    const defaultDescriptions = {
        'Industries': {
            title: 'Industries',
            text: 'Explore our diverse engineering expertise across key sectors.'
        },
        'Services': {
            title: 'Services',
            text: 'Transforming businesses with cutting-edge technological services.'
        },
        'ENT Academy': {
            title: 'ENT Academy',
            text: 'Empowering the next generation of engineering leaders.'
        }
    };

    // Get all dropdown menus
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        const previewContent = dropdown.querySelector('.preview-content');
        const menuLinks = dropdown.querySelectorAll('.dropdown-list a');

        if (!previewContent || !menuLinks.length) return;

        // Get the dropdown category name from the toggle
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const categoryName = toggle ? toggle.textContent.trim() : '';

        // Store original content
        const originalH3 = previewContent.querySelector('h3');
        const originalP = previewContent.querySelector('p');
        const originalTitle = originalH3 ? originalH3.textContent : '';
        const originalText = originalP ? originalP.textContent : '';

        // Add hover events to each menu link
        menuLinks.forEach(link => {
            link.addEventListener('mouseenter', function () {
                const href = this.getAttribute('href');
                const description = descriptions[href];

                if (description && originalH3 && originalP) {
                    // Update with specific description
                    originalH3.textContent = description.title;
                    originalP.textContent = description.text;

                    // Add animation class
                    previewContent.style.opacity = '0';
                    setTimeout(() => {
                        previewContent.style.opacity = '1';
                    }, 50);
                }
            });

            link.addEventListener('mouseleave', function () {
                // Only reset if mouse is not over the preview panel
                setTimeout(() => {
                    const isHoveringDropdown = dropdown.matches(':hover');
                    if (!isHoveringDropdown && originalH3 && originalP) {
                        // Reset to default category description
                        const defaultDesc = defaultDescriptions[categoryName];
                        if (defaultDesc) {
                            originalH3.textContent = defaultDesc.title;
                            originalP.textContent = defaultDesc.text;
                        } else {
                            originalH3.textContent = originalTitle;
                            originalP.textContent = originalText;
                        }
                    }
                }, 100);
            });
        });

        // Reset when leaving the entire dropdown
        dropdown.addEventListener('mouseleave', function () {
            if (originalH3 && originalP) {
                const defaultDesc = defaultDescriptions[categoryName];
                if (defaultDesc) {
                    originalH3.textContent = defaultDesc.title;
                    originalP.textContent = defaultDesc.text;
                } else {
                    originalH3.textContent = originalTitle;
                    originalP.textContent = originalText;
                }
            }
        });
    });

    // Add smooth transition CSS
    const style = document.createElement('style');
    style.textContent = `
    .preview-content {
      transition: opacity 0.2s ease-in-out;
    }
    
    .dropdown-list a {
      position: relative;
    }
    
    .dropdown-list a::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 0;
      background: linear-gradient(135deg, #00d9ff 0%, #7b2cbf 100%);
      transition: height 0.2s ease;
      border-radius: 2px;
    }
    
    .dropdown-list a:hover::before {
      height: 60%;
    }
  `;
    document.head.appendChild(style);
});
