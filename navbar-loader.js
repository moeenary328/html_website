// ============================================
// NAVBAR LOADER - Dynamic Navbar for All Pages
// ============================================

// Function to load navbar from navbar.html
function loadNavbar() {
    fetch('navbar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Navbar file not found!');
            }
            return response.text();
        })
        .then(data => {
            // Insert navbar at the beginning of body
            document.body.insertAdjacentHTML('afterbegin', data);
            
            // Highlight active page in navbar
            highlightActivePage();
            
            // Initialize search functionality if on gallery page
            initializeSearch();
            
            // Add mobile menu toggle for responsive
            addMobileMenuToggle();
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
            // Fallback navbar if file not found
            createFallbackNavbar();
        });
}

// Function to highlight active page
function highlightActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Remove active class from all links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page link
    if (currentPage === 'index.html') {
        const homeLink = document.querySelector('.nav-home');
        if (homeLink) homeLink.classList.add('active');
    } else if (currentPage === 'index2.html') {
        const galleryLink = document.querySelector('.nav-gallery');
        if (galleryLink) galleryLink.classList.add('active');
    } else if (currentPage === 'index3.html') {
        const contactLink = document.querySelector('.nav-contact');
        if (contactLink) contactLink.classList.add('active');
    }
    
    // Also check for hash links (like index.html#contact)
    if (window.location.hash === '#contact') {
        const contactLink = document.querySelector('.nav-contact');
        if (contactLink) contactLink.classList.add('active');
    }
}

// Function to initialize search (only on gallery page)
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    
    if (searchInput && window.location.pathname.includes('index2.html')) {
        // Search functionality
        function handleSearch() {
            const searchTerm = searchInput.value.toLowerCase();
            if (searchTerm) {
                searchClear.style.display = 'block';
            } else {
                searchClear.style.display = 'none';
            }
            
            // Filter projects if displayProjects function exists
            if (typeof window.filterProjects === 'function') {
                window.filterProjects(searchTerm);
            }
        }
        
        searchInput.addEventListener('input', handleSearch);
        
        if (searchClear) {
            searchClear.addEventListener('click', () => {
                searchInput.value = '';
                searchClear.style.display = 'none';
                if (typeof window.filterProjects === 'function') {
                    window.filterProjects('');
                }
                showToastMessage('Search cleared! ✨');
            });
        }
    }
}

// Function to add mobile menu toggle
function addMobileMenuToggle() {
    const nav = document.querySelector('.glass-nav');
    if (nav && window.innerWidth <= 768) {
        // Check if toggle button already exists
        if (!document.querySelector('.mobile-toggle')) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'mobile-toggle';
            toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
            toggleBtn.style.cssText = `
                background: transparent;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                display: none;
            `;
            
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) {
                nav.insertBefore(toggleBtn, navLinks);
                toggleBtn.style.display = 'block';
                
                toggleBtn.addEventListener('click', () => {
                    navLinks.classList.toggle('show');
                });
            }
        }
    }
}

// Fallback navbar if navbar.html is missing
function createFallbackNavbar() {
    const fallbackNav = `
        <nav class="glass-nav">
            <a href="index.html" class="nav-logo">
                <img src="logo.jpeg" alt="Logo" class="nav-logo-img" onerror="this.src='https://via.placeholder.com/40/6a11cb/ffffff?text=M'">
                <span class="nav-logo-text">Moeen</span>
            </a>
            <ul class="nav-links">
                <li><a href="index.html" class="nav-home"><i class="fas fa-home"></i> Home</a></li>
                <li><a href="index2.html" class="nav-gallery"><i class="fas fa-grid-2"></i> Gallery</a></li>
                <li><a href="index.html#contact" class="nav-contact"><i class="fas fa-envelope"></i> Contact</a></li>
            </ul>
        </nav>
    `;
    document.body.insertAdjacentHTML('afterbegin', fallbackNav);
    highlightActivePage();
    showToastMessage('Navbar loaded (fallback mode)');
}

// Toast message function
function showToastMessage(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
        
        // Add toast styles if not present
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .toast {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    background: linear-gradient(135deg, #6a11cb, #2575fc);
                    color: white;
                    padding: 12px 25px;
                    border-radius: 50px;
                    display: none;
                    z-index: 10000;
                    font-size: 0.9rem;
                    animation: slideInRight 0.3s ease;
                }
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Function to reload navbar (useful after dynamic content changes)
function reloadNavbar() {
    const existingNav = document.querySelector('.glass-nav');
    if (existingNav) {
        existingNav.remove();
    }
    loadNavbar();
}

// Export functions for global use
window.loadNavbar = loadNavbar;
window.reloadNavbar = reloadNavbar;
window.showToastMessage = showToastMessage;

// Auto-load navbar when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavbar);
} else {
    loadNavbar();
}