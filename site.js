const rootPath = window.location.pathname.includes('/pages/') ? '../' : './';
const pageName = document.body.dataset.page || 'home';

const navigation = [
  ['Home', 'index.html', 'home'],
  ['About', 'pages/about.html', 'about'],
  ['Programmes', 'pages/courses.html', 'courses'],
  ['Admissions', 'pages/admissions.html', 'admissions'],
  ['Faculty', 'pages/faculty.html', 'faculty'],
  ['Careers', 'pages/placement.html', 'placement'],
  ['News & events', 'pages/events.html', 'events'],
  ['Campus gallery', 'pages/gallery.html', 'gallery'],
  ['Contact', 'pages/contact.html', 'contact'],
  ['Admin demo', 'pages/admin-panel.html', 'admin']
];

const header = document.querySelector('#site-header');
if (header) {
  const primaryLinks = navigation.slice(0, 7).map(([label, url, key]) =>
    `<li class="nav-item"><a class="nav-link ${pageName === key ? 'active' : ''}" ${pageName === key ? 'aria-current="page"' : ''} href="${rootPath}${url}">${label}</a></li>`
  ).join('');
  header.innerHTML = `
    <div class="utility-bar"><div class="container utility-inner"><span>Curiosity, craft and a better future.</span><div><a href="${rootPath}pages/events.html">Campus updates</a><a href="${rootPath}pages/contact.html">Visit Northbridge</a></div></div></div>
    <nav class="navbar navbar-expand-xl site-nav" aria-label="Main navigation"><div class="container">
      <a class="brand-mark" href="${rootPath}index.html" aria-label="Northbridge Institute of Technology home"><span class="brand-symbol">N</span><span class="brand-name">NORTHBRIDGE<small>INSTITUTE OF TECHNOLOGY</small></span></a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
      <div class="collapse navbar-collapse" id="mainNav"><ul class="navbar-nav ms-auto align-items-xl-center">${primaryLinks}
        <li class="nav-item dropdown"><a class="nav-link dropdown-toggle ${['gallery', 'contact', 'admin'].includes(pageName) ? 'active' : ''}" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">More</a><ul class="dropdown-menu"><li><a class="dropdown-item" href="${rootPath}pages/gallery.html">Campus gallery</a></li><li><a class="dropdown-item" href="${rootPath}pages/contact.html">Contact</a></li><li><hr class="dropdown-divider"></li><li><a class="dropdown-item" href="${rootPath}pages/admin-panel.html">Admin panel <span class="demo-tag">DEMO</span></a></li></ul></li>
        <li class="nav-item ms-xl-3"><a class="portal-link ${pageName === 'portal' ? 'active' : ''}" href="${rootPath}pages/student-portal.html"><i class="bi bi-person-circle"></i> Student portal</a></li>
      </ul></div>
    </div></nav>`;
}

const footer = document.querySelector('#site-footer');
if (footer) {
  footer.innerHTML = `
    <footer class="site-footer"><div class="container"><div class="footer-main"><div class="footer-brand"><a class="brand-mark brand-mark-light" href="${rootPath}index.html"><span class="brand-symbol">N</span><span class="brand-name">NORTHBRIDGE<small>INSTITUTE OF TECHNOLOGY</small></span></a><p>Engineering a more thoughtful future, together.</p></div><div class="footer-column"><span>Explore</span><a href="${rootPath}pages/about.html">About Northbridge</a><a href="${rootPath}pages/courses.html">Programmes</a><a href="${rootPath}pages/admissions.html">Admissions</a><a href="${rootPath}pages/faculty.html">Our faculty</a></div><div class="footer-column"><span>Community</span><a href="${rootPath}pages/placement.html">Careers &amp; placements</a><a href="${rootPath}pages/gallery.html">Campus gallery</a><a href="${rootPath}pages/events.html">News &amp; events</a><a href="${rootPath}pages/contact.html">Contact</a></div><div class="footer-contact"><span>Find us</span><p>42 University Avenue<br>Knowledge District, Noida 201301</p><a href="mailto:hello@northbridge.edu.in">hello@northbridge.edu.in</a><a href="tel:+911204800600">+91 120 480 0600</a></div></div><div class="footer-bottom"><span>© 2026 Northbridge Institute of Technology</span><span>Sample institution and information for demonstration purposes.</span><a href="${rootPath}pages/admin-panel.html">Admin demo <i class="bi bi-arrow-up-right"></i></a></div></div></footer>`;
}

const revealTargets = document.querySelectorAll('.section-space, .program-card, .news-card, .course-card, .faculty-card, .event-row');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealTargets.forEach((element) => {
    element.classList.add('reveal-on-scroll');
    revealObserver.observe(element);
  });
} else {
  revealTargets.forEach((element) => element.classList.add('is-visible'));
}

function applySearch(inputId, listId, emptyId) {
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);
  if (!input || !list) return;
  const items = [...list.querySelectorAll('[data-search]')];
  const empty = document.getElementById(emptyId);
  input.addEventListener('input', () => {
    const term = input.value.trim().toLowerCase();
    const activeFilter = document.querySelector(`.filter-chip.active[data-target="${listId}"]`);
    let visibleCount = 0;
    items.forEach((item) => {
      const matchesSearch = item.dataset.search.toLowerCase().includes(term);
      const matchesCategory = !activeFilter || activeFilter.dataset.filter === 'all' || item.dataset.category === activeFilter.dataset.filter;
      const matches = matchesSearch && matchesCategory;
      item.hidden = !matches;
      if (matches) visibleCount += 1;
    });
    if (empty) empty.hidden = visibleCount > 0;
  });
}

applySearch('course-search', 'course-list', 'course-empty');
applySearch('faculty-search', 'faculty-list', 'faculty-empty');
applySearch('event-search', 'event-list', 'event-empty');

const filterButtons = document.querySelectorAll('.filter-chip');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const target = document.getElementById(button.dataset.target);
    if (!target) return;
    const group = button.closest('.filter-row');
    group?.querySelectorAll('.filter-chip').forEach((chip) => chip.classList.toggle('active', chip === button));
    const entries = [...target.querySelectorAll('[data-category]')];
    entries.forEach((entry) => {
      const categoryMatches = button.dataset.filter === 'all' || entry.dataset.category === button.dataset.filter;
      const searchInput = target.id === 'faculty-list' ? document.getElementById('faculty-search') : target.id === 'event-list' ? document.getElementById('event-search') : null;
      const searchMatches = !searchInput || entry.dataset.search.toLowerCase().includes(searchInput.value.trim().toLowerCase());
      entry.hidden = !(categoryMatches && searchMatches);
    });
    const empty = document.getElementById(target.id === 'gallery-grid' ? 'gallery-empty' : target.id === 'faculty-list' ? 'faculty-empty' : 'event-empty');
    if (empty) empty.hidden = entries.some((entry) => !entry.hidden);
  });
});

const galleryLightbox = document.getElementById('gallery-lightbox');
if (galleryLightbox) {
  const closeGallery = () => {
    galleryLightbox.hidden = true;
    document.body.classList.remove('dialog-open');
  };
  document.querySelectorAll('.gallery-tile').forEach((tile) => tile.addEventListener('click', () => {
    galleryLightbox.querySelector('.lightbox-photo').style.backgroundImage = getComputedStyle(tile).backgroundImage;
    galleryLightbox.querySelector('.lightbox-caption').textContent = tile.dataset.caption;
    galleryLightbox.hidden = false;
    document.body.classList.add('dialog-open');
    galleryLightbox.querySelector('.lightbox-close').focus();
  }));
  galleryLightbox.querySelector('.lightbox-close').addEventListener('click', closeGallery);
  galleryLightbox.addEventListener('click', (event) => { if (event.target === galleryLightbox) closeGallery(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !galleryLightbox.hidden) closeGallery(); });
}

document.querySelectorAll('.demo-form').forEach((form) => form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const feedback = form.querySelector('.form-feedback');
  if (feedback) feedback.textContent = form.id === 'portal-login' ? 'Demo sign-in complete. Your sample dashboard is ready below.' : 'Thanks for reaching out. This demo form does not send or store your information.';
  if (form.id === 'portal-login') {
    const dashboard = document.getElementById('student-dashboard');
    dashboard.hidden = false;
    dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}));

document.querySelectorAll('[data-demo-link]').forEach((link) => link.addEventListener('click', (event) => {
  event.preventDefault();
  const feedback = link.closest('form')?.querySelector('.form-feedback');
  if (feedback) feedback.textContent = 'Password recovery is not available in this demo portal.';
}));

document.getElementById('portal-signout')?.addEventListener('click', () => {
  document.getElementById('student-dashboard').hidden = true;
  document.getElementById('portal-login').reset();
  document.querySelector('#portal-login .form-feedback').textContent = '';
  document.querySelector('.portal-access').scrollIntoView({ behavior: 'smooth' });
});

const adminTabs = document.querySelectorAll('[data-admin-tab]');
adminTabs.forEach((button) => button.addEventListener('click', () => {
  adminTabs.forEach((tab) => tab.classList.toggle('active', tab === button));
  document.querySelectorAll('.admin-view').forEach((view) => { view.hidden = view.id !== `admin-${button.dataset.adminTab}`; });
  const label = button.textContent.trim();
  const currentLabel = document.getElementById('admin-current-tab');
  if (currentLabel) currentLabel.textContent = label;
}));

document.querySelectorAll('[data-admin-task]').forEach((button) => button.addEventListener('click', () => {
  const feedback = document.querySelector('.admin-task-feedback');
  if (feedback) feedback.textContent = `${button.querySelector('strong').textContent} opened in this demo. No records are changed.`;
}));

document.getElementById('admin-export')?.addEventListener('click', () => {
  const rows = [['Applicant', 'Programme', 'Received', 'Status'], ['Riya Sharma', 'Computer Engineering', '21 Nov 2026', 'In review'], ['Arnav Patel', 'AI & Data Science', '20 Nov 2026', 'New'], ['Fatima Ali', 'Civil Engineering', '20 Nov 2026', 'Documents ready']];
  const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(',')).join('\n');
  const download = document.createElement('a');
  download.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  download.download = 'northbridge-demo-applications.csv';
  download.click();
  URL.revokeObjectURL(download.href);
});
