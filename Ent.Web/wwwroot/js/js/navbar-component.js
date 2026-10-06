/**
 * Global Navbar Component for Public Pages
 * Auto-detects current page and highlights active menu item
 */

(function () {
  'use strict';

  // Get current page from URL
  const getCurrentPage = () => {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    return page;
  };

  // Check if a link should be active
  const isActive = (href) => {
    const currentPage = getCurrentPage();
    return href === currentPage;
  };

  // Navbar HTML Template
  const navbarHTML = `
    <nav class="navbar" id="navbar">
      <div class="container">
        <a href="index.html" class="navbar-brand">
          <img src="images/logo.png" alt="ENT Logo" class="h-9 sm:h-10 md:h-11 lg:h-12 xl:h-14 2xl:h-16">
        </a>

        <!-- Mobile Company Name -->
        <div class="mobile-company-name">
          <span>Enginuvity Nexus Technologies</span>
        </div>

        <ul class="navbar-menu !flex !flex-col md:!flex-row md:!justify-end md:!gap-8 md:!pt-0 !justify-start !gap-0 !pt-16">
          <li class="!flex-none !h-auto border-b border-white/10 md:border-none">
            <a href="index.html" class="${isActive('index.html') ? 'active' : ''}">Home</a>
          </li>

          <!-- Industries Dropdown -->
          <li class="dropdown !flex-none !h-auto border-b border-white/10 md:border-none">
            <a href="industries.html" class="dropdown-toggle ${isActive('industries.html') ? 'active' : ''}">
              Industries
              <iconify-icon icon="mdi:chevron-down" style="margin-left: 4px; opacity: 0.7; font-size: 10px;"></iconify-icon>
            </a>
            <div class="dropdown-menu split-menu">
              <div class="dropdown-list">
                <a href="software-solutions.html" class="${isActive('software-solutions.html') ? 'active' : ''}">Software solutions</a>
                <a href="automotive.html" class="${isActive('automotive.html') ? 'active' : ''}">Automotive</a>
                <a href="aerospace.html" class="${isActive('aerospace.html') ? 'active' : ''}">Aerospace</a>
                <a href="marine.html" class="${isActive('marine.html') ? 'active' : ''}">Marine</a>
                <a href="education.html" class="${isActive('education.html') ? 'active' : ''}">Education</a>
              </div>
              <div class="dropdown-preview">
                <div class="preview-content">
                  <h3>Industries</h3>
                  <p>Explore our diverse engineering expertise across key sectors.</p>
                </div>
              </div>
            </div>
          </li>

          <!-- Services Dropdown -->
          <li class="dropdown !flex-none !h-auto border-b border-white/10 md:border-none">
            <a href="services.html" class="dropdown-toggle ${isActive('services.html') ? 'active' : ''}">
              Services
              <iconify-icon icon="mdi:chevron-down" style="margin-left: 4px; opacity: 0.7; font-size: 10px;"></iconify-icon>
            </a>
            <div class="dropdown-menu split-menu">
              <div class="dropdown-list">
                <a href="quantum-computing.html" class="${isActive('quantum-computing.html') ? 'active' : ''}">Quantum Computing</a>
                <a href="ai-ml.html" class="${isActive('ai-ml.html') ? 'active' : ''}">AI &ML</a>
                <a href="simulations.html" class="${isActive('simulations.html') ? 'active' : ''}">Simulations</a>
                <a href="digital-twin.html" class="${isActive('digital-twin.html') ? 'active' : ''}">Digital Twin</a>
                <a href="customized-software.html" class="${isActive('customized-software.html') ? 'active' : ''}">Customized software development</a>
                <a href="ai-system-integration.html" class="${isActive('ai-system-integration.html') ? 'active' : ''}">AI-Powered System Integration</a>
                <a href="consultancy.html" class="${isActive('consultancy.html') ? 'active' : ''}">Project support and consultancy Services</a>
                <a href="engineering-rd.html" class="${isActive('engineering-rd.html') ? 'active' : ''}">Engineering R&D</a>
              </div>
              <div class="dropdown-preview">
                <div class="preview-content">
                  <h3>Services</h3>
                  <p>Transforming businesses with cutting-edge technological services.</p>
                </div>
              </div>
            </div>
          </li>

          <!-- ENT Academy Dropdown -->
          <li class="dropdown !flex-none !h-auto border-b border-white/10 md:border-none">
            <a href="academy.html" class="dropdown-toggle ${isActive('academy.html') ? 'active' : ''}">
              ENT Academy
              <iconify-icon icon="mdi:chevron-down" style="margin-left: 4px; opacity: 0.7; font-size: 10px;"></iconify-icon>
            </a>
            <div class="dropdown-menu split-menu">
              <div class="dropdown-list">
                <a href="quantum-computing-courses.html" class="${isActive('quantum-computing-courses.html') ? 'active' : ''}">Quantum Computing</a>
                <a href="cfd-courses.html" class="${isActive('cfd-courses.html') ? 'active' : ''}">CFD Courses</a>
              </div>
              <div class="dropdown-preview">
                <div class="preview-content">
                  <h3>ENT Academy</h3>
                  <p>Empowering the next generation of engineering leaders.</p>
                </div>
              </div>
            </div>
          </li>

          <li class="!flex-none !h-auto border-b border-white/10 md:border-none">
            <a href="about.html" class="${isActive('about.html') ? 'active' : ''}">About Us</a>
          </li>
          <li class="!flex-none !h-auto border-b border-white/10 md:border-none">
            <a href="blog.html" class="${isActive('blog.html') ? 'active' : ''}">Blog</a>
          </li>
          <li class="!flex-none !h-auto border-b border-white/10 md:border-none">
            <a href="careers.html" class="${isActive('careers.html') ? 'active' : ''}">Careers</a>
          </li>
          <li class="!flex-none !h-auto border-b border-white/10 md:border-none mobile-only-menu-item">
            <a href="contact.html">Contact Us</a>
          </li>
        </ul>

        <div class="navbar-actions">
          <a href="contact.html">Contact Us</a>
          <div style="border-left: 1px solid rgba(255,255,255,0.2); padding-left: 1.5rem; margin-left: 1.5rem;">
            <span style="font-weight: 700; font-size: 1.2rem; letter-spacing: 2px;">ENT</span>
          </div>
        </div>

        <!-- Mobile Toggle -->
        <button class="navbar-toggle" id="navbar-toggle">
          <span>&#9776;</span>
        </button>
      </div>
    </nav>
  `;

  // Render navbar on page load
  const renderNavbar = () => {
    const navbarRoot = document.getElementById('navbar-root');
    if (navbarRoot) {
      navbarRoot.innerHTML = navbarHTML;
    }
  };

  // Auto-render when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderNavbar);
  } else {
    renderNavbar();
  }

  // Export for manual rendering if needed
  window.renderNavbar = renderNavbar;
})();
