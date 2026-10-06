// ULTRA-SIMPLE MOBILE MENU - NO FANCY STUFF
document.addEventListener('DOMContentLoaded', function () {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Dynamic Dropdown Positioning - Prevent Viewport Overflow
    function positionDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');

        dropdowns.forEach(dropdown => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (!menu) return;

            // On hover, check if dropdown would overflow
            dropdown.addEventListener('mouseenter', function () {
                if (window.innerWidth > 768) { // Only for desktop
                    // Reset positioning first
                    menu.style.left = '';
                    menu.style.right = '';

                    // Get dropdown position
                    const rect = menu.getBoundingClientRect();
                    const viewportWidth = window.innerWidth;

                    // Check if dropdown extends beyond viewport
                    if (rect.right > viewportWidth) {
                        // Position from the right instead
                        menu.style.left = 'auto';
                        menu.style.right = '0';
                    }
                }
            });
        });
    }

    // Initialize dropdown positioning
    positionDropdowns();

    // Reposition on window resize
    window.addEventListener('resize', positionDropdowns);


    /* Hamburger button */
    const toggle = document.getElementById('navbar-toggle');
    const menu = document.querySelector('.navbar-menu');
    const dropdowns = document.querySelectorAll('.dropdown-toggle');

    // Toggle menu
    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            const isActive = menu.classList.toggle('active');
            const icon = this.querySelector('span');

            if (icon) {
                icon.textContent = isActive ? '✕' : '☰';
            }

            // If closing menu, collapse all dropdowns
            if (!isActive) {
                document.querySelectorAll('.dropdown.active').forEach(d => {
                    d.classList.remove('active');
                });
            }
        });

        // Close on link click
        menu.querySelectorAll('a:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
                const icon = toggle.querySelector('span');
                if (icon) icon.textContent = '☰';
            });
        });
    }

    // Simple dropdown toggle
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();

                const parent = this.parentElement;
                const wasActive = parent.classList.contains('active');

                // Close others
                document.querySelectorAll('.dropdown').forEach(d => {
                    if (d !== parent) {
                        d.classList.remove('active');
                    }
                });

                // Toggle this one
                parent.classList.toggle('active');

                // Toggle "submenu-open" state on main container for CSS resizing
                if (!wasActive) {
                    menu.classList.add('submenu-open');
                } else {
                    menu.classList.remove('submenu-open');
                }
            }
        });
    });

    // Close on link click logic
    menu.querySelectorAll('a:not(.dropdown-toggle)').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            menu.classList.remove('submenu-open'); // Reset layout
            const icon = toggle.querySelector('span');
            if (icon) icon.textContent = '☰';
        });
    });
});
