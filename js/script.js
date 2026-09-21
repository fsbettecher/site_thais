// =========================================================
// PORTFÓLIO DE ARTE — comportamento do site
// Menu mobile, header dinâmico, scroll reveal e lightbox
// =========================================================

document.addEventListener('DOMContentLoaded', function () {

  // ---------- Menu mobile (hambúrguer) ----------
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      var expanded = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
      });
    });
  }

  // ---------- Marca o link ativo no menu conforme a página atual ----------
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(function (link) {
    var href = link.getAttribute('href').split('#')[0];
    if (href === currentPage || (href === '' && currentPage === 'index.html')) {
      link.classList.add('active');
    }
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

  // ---------- Scroll reveal (fade + slide suave ao entrar na tela) ----------
  var revealSelectors = [
    '.section-head', '.art-types > a', '.gallery figure',
    '.about-grid > *', '.contact-grid > *', '.hero-index li',
    '.subsection-title', '.page-hero .lede'
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

  // ---------- Lightbox simples para as imagens/placeholders ----------
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
        caption.style.marginTop = '1rem';
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

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }


  // ---------- Filtro de categorias da galeria (Obras) ----------
  var tabs = document.querySelectorAll('.filter-tabs button');
  var figures = document.querySelectorAll('#obras .gallery figure');

  if (tabs.length && figures.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');

        var cat = tab.getAttribute('data-filter');
        figures.forEach(function (fig) {
          var figCat = fig.getAttribute('data-category');
          var show = cat === 'todas' || cat === figCat;
          fig.classList.toggle('hide', !show);
        });
      });
    });
  }

});