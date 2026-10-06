/**
 * Global Footer Component for Public Pages
 */

(function () {
  'use strict';

  // Footer HTML Template
  const footerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h4>Enginuvity Nexus Technologies</h4>
            <p>Engineering Intelligence for the Future</p>
            <p style="margin-top: 1rem;">Pioneering solutions in AI, Quantum Computing, and Engineering R&D.</p>
          </div>

          <div class="footer-section">
            <h4>Quick Links</h4>
            <a href="index.html">Home</a>
            <a href="industries.html">Industries</a>
            <a href="services.html">Services</a>
            <a href="academy.html">ENT Academy</a>
            <a href="about.html">About Us</a>
            <a href="blog.html">Blog</a>
            <a href="careers.html">Careers</a>
            <a href="contact.html">Contact</a>
          </div>

          <div class="footer-section">
            <h4>Services</h4>
            <a href="services.html">AI & Machine Learning</a>
            <a href="services.html">Quantum Computing</a>
            <a href="services.html">Digital Twin</a>
            <a href="services.html">Engineering R&D</a>
            <a href="services.html">Consultancy</a>
          </div>

          <div class="footer-section">
            <h4>Connect</h4>
            <a href="mailto:info@enginuvitynexus.com">Email Us</a>
            <a href="tel:+918075998325">Call Us</a>
            <p style="margin-top: 1rem; color: var(--color-text-tertiary);">Follow us on LinkedIn for the latest updates</p>
            <div class="social-links" style="margin-top: 1rem; display: flex; gap: 1rem;">
              <a href="https://www.linkedin.com/in/enginuvity-nexus-977a74398?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3Bl1XccOIYSr6%2FnlsGdi5itw%3D%3D" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style="color: #00d9ff; opacity: 0.8; transition: opacity 0.3s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.8'">
                <iconify-icon icon="mdi:linkedin" width="24" height="24"></iconify-icon>
              </a>
            </div>
          </div>
        </div>

        <div class="footer-bottom" style="position: relative; padding-bottom: 2rem;">
          <p>&copy; 2025 Enginuvity Nexus Technologies. All rights reserved.</p>
          <a href="/admin/login.php" aria-label="Staff Login" style="position: absolute; right: 20px; bottom: 20px; color: #666; opacity: 0.3; transition: opacity 0.3s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.3'">
            <iconify-icon icon="mdi:shield-key-outline" width="16" height="16"></iconify-icon>
          </a>
        </div>
      </div>
    </footer>
  `;

  // Render footer on page load
  const renderFooter = () => {
    const footerRoot = document.getElementById('footer-root');
    if (footerRoot) {
      footerRoot.innerHTML = footerHTML;
    }
  };

  // Auto-render when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderFooter);
  } else {
    renderFooter();
  }

  // Export for manual rendering if needed
  window.renderFooter = renderFooter;
})();
