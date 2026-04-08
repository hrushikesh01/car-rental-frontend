// Mobile hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  
  // Create side drawer elements if they don't exist
  if (!document.querySelector('.side-drawer')) {
    createSideDrawer();
  }

  function createSideDrawer() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'side-drawer-overlay';

    // Create side drawer
    const drawer = document.createElement('div');
    drawer.className = 'side-drawer';

    // Create header
    const header = document.createElement('div');
    header.className = 'side-drawer-header';

    const logo = document.createElement('div');
    logo.className = 'side-drawer-logo';
    logo.textContent = 'DRIVE';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'side-drawer-close';
    closeBtn.innerHTML = '×';

    header.appendChild(logo);
    header.appendChild(closeBtn);

    // Create navigation
    const nav = document.createElement('nav');
    nav.className = 'side-drawer-nav';

    const navList = document.createElement('ul');

    // Get current page to set active link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    const navItems = [
      { href: 'budget.html', text: 'Budget' },
      { href: 'premium.html', text: 'Premium' },
      { href: 'luxury.html', text: 'Luxury' }
    ];

    // Dynamic Auth Link
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      navItems.push({ href: 'account.html', text: 'Account' });
    } else {
      navItems.push({ href: 'login.html', text: 'Login' });
    }

    navItems.forEach(item => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.text;

      if (currentPath === item.href) {
        a.classList.add('active');
      }

      li.appendChild(a);
      navList.appendChild(li);
    });

    nav.appendChild(navList);
    drawer.appendChild(header);
    drawer.appendChild(nav);

    // Add to body
    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    // Update references
    const sideDrawer = document.querySelector('.side-drawer');
    const sideDrawerOverlay = document.querySelector('.side-drawer-overlay');
    const sideDrawerClose = document.querySelector('.side-drawer-close');

    // Event listeners
    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', toggleMenu);
    }

    if (sideDrawerOverlay) {
      sideDrawerOverlay.addEventListener('click', closeMenu);
    }

    if (sideDrawerClose) {
      sideDrawerClose.addEventListener('click', closeMenu);
    }

    // Close menu when clicking on navigation links
    document.addEventListener('click', function(e) {
      if (e.target.closest('.side-drawer-nav a')) {
        closeMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeMenu();
      }
    });
  }

  // Toggle menu function
  function toggleMenu() {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const sideDrawer = document.querySelector('.side-drawer');
    const sideDrawerOverlay = document.querySelector('.side-drawer-overlay');

    if (hamburgerBtn && sideDrawer && sideDrawerOverlay) {
      hamburgerBtn.classList.toggle('active');
      sideDrawer.classList.toggle('active');
      sideDrawerOverlay.classList.toggle('active');

      // Prevent body scroll when menu is open
      document.body.style.overflow = sideDrawer.classList.contains('active') ? 'hidden' : '';
    }
  }

  // Close menu function
  function closeMenu() {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const sideDrawer = document.querySelector('.side-drawer');
    const sideDrawerOverlay = document.querySelector('.side-drawer-overlay');

    if (hamburgerBtn && sideDrawer && sideDrawerOverlay) {
      hamburgerBtn.classList.remove('active');
      sideDrawer.classList.remove('active');
      sideDrawerOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
});