// =========================================================
// PORTFÓLIO DE ARTE — Thais Ohnesorge
// v2 — menu lateral expansível, carrossel, header, reveal, lightbox
// =========================================================

document.addEventListener('DOMContentLoaded', function () {

  // ---------- Menu lateral (off-canvas) ----------
  var menuToggle = document.querySelector('.menu-toggle');
  var sidebar = document.querySelector('.sidebar');
  var overlay = document.querySelector('.sidebar-overlay');
  var sidebarClose = document.querySelector('.sidebar-close');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    menuToggle.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    sidebar.setAttribute('aria-hidden', 'false');
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    sidebar.setAttribute('aria-hidden', 'true');
  }
  if (menuToggle && sidebar && overlay) {
    menuToggle.addEventListener('click', function () {
      sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });
    overlay.addEventListener('click', closeSidebar);
    if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSidebar();
    });
    // fecha ao clicar em um link de destino (não no botão que abre submenu)
    sidebar.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeSidebar);
    });
  }

  // ---------- Submenu "Coleções" (acordeão) ----------
  document.querySelectorAll('.submenu-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var submenu = document.getElementById(btn.getAttribute('aria-controls'));
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if (submenu) submenu.classList.toggle('open', !expanded);
    });
  });

  // ---------- Marca o link ativo no menu conforme a página atual ----------
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-nav a').forEach(function (link) {
    var href = link.getAttribute('href').split('#')[0];
    if (href === currentPage) link.classList.add('active');
  });

  // ---------- Header encolhe ao rolar a página ----------
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---------- Carrossel ----------
  var carousel = document.querySelector('.carousel');
  if (carousel) {
    var track = carousel.querySelector('.carousel-track');
    var slides = carousel.querySelectorAll('.carousel-slide');
    var dots = carousel.querySelectorAll('.carousel-dot');
    var toggleBtn = carousel.querySelector('.carousel-toggle');
    var prevBtn = carousel.querySelector('.carousel-arrow.prev');
    var nextBtn = carousel.querySelector('.carousel-arrow.next');
    var iconPause = toggleBtn ? toggleBtn.querySelector('.icon-pause') : null;
    var iconPlay = toggleBtn ? toggleBtn.querySelector('.icon-play') : null;

    var current = 0;
    var total = slides.length;
    var playing = true;
    var timer = null;

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
    }
    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAutoplay() {
      stopAutoplay();
      timer = setInterval(next, 5000);
    }
    function stopAutoplay() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    function setPlaying(state) {
      playing = state;
      if (playing) { startAutoplay(); } else { stopAutoplay(); }
      if (iconPause) iconPause.style.display = playing ? 'block' : 'none';
      if (iconPlay) iconPlay.style.display = playing ? 'none' : 'block';
      if (toggleBtn) toggleBtn.setAttribute('aria-label', playing ? 'Pausar carrossel' : 'Reproduzir carrossel');
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); if (playing) startAutoplay(); });
    });
    if (nextBtn) nextBtn.addEventListener('click', function () { next(); if (playing) startAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); if (playing) startAutoplay(); });
    if (toggleBtn) toggleBtn.addEventListener('click', function () { setPlaying(!playing); });

    goTo(0);
    setPlaying(true);
  }

  // ---------- Scroll reveal ----------
  var revealSelectors = [
    '.section-head', '.stack-card', '.gallery figure',
    '.about-grid > *', '.contact-grid > *', '.page-hero .lede'
  ];
  var revealEls = document.querySelectorAll(revealSelectors.join(','));
  revealEls.forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 6) * 70 + 'ms';
  });
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  // ---------- Lightbox (páginas de coleção/categoria) ----------
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    var lightboxInner = lightbox.querySelector('.lightbox-inner');
    var closeBtn = lightbox.querySelector('.lightbox-close');

    document.querySelectorAll('.placeholder, .gallery figure img').forEach(function (el) {
      el.addEventListener('click', function () {
        var img = el.tagName === 'IMG' ? el : el.querySelector('img');
        var label = el.getAttribute('data-label') || (img ? img.alt : '') || 'Obra';

        lightboxInner.innerHTML = '';
        if (img) {
          var big = document.createElement('img');
          big.src = img.src;
          big.alt = label;
          lightboxInner.appendChild(big);
        }
        var caption = document.createElement('p');
        caption.textContent = label;
        lightboxInner.appendChild(caption);

        lightbox.classList.add('open');
        requestAnimationFrame(function () { lightbox.classList.add('show'); });
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('show');
      setTimeout(function () { lightbox.classList.remove('open'); }, 200);
    }
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLightbox(); });
  }

});
