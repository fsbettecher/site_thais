document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header shrink on scroll ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.classList.remove('open');
      });
    });
  }

  /* ---------- Gallery filter ---------- */
  const tabs = document.querySelectorAll('.filter-tabs button');
  const figures = document.querySelectorAll('.gallery figure');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      figures.forEach(fig => {
        const match = filter === 'todas' || fig.dataset.category === filter;
        if (match) {
          fig.classList.remove('hide');
          fig.classList.remove('enter');
          void fig.offsetWidth; /* restart animation */
          fig.classList.add('enter');
        } else {
          fig.classList.add('hide');
        }
      });
    });
  });

  /* ---------- Category cards -> jump to filtered gallery ---------- */
  document.querySelectorAll('.cat-card[data-goto]').forEach(card => {
    card.addEventListener('click', (e) => {
      const target = card.dataset.goto;
      const tab = document.querySelector(`.filter-tabs button[data-filter="${target}"]`);
      if (tab) {
        e.preventDefault();
        tab.click();
        document.getElementById('obras').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxInner = lightbox ? lightbox.querySelector('.lightbox-inner') : null;
  const closeBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;

  document.querySelectorAll('.gallery .frame img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxInner.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
      lightbox.classList.add('open');
    });
  });
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightboxInner.innerHTML = '';
  };
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) closeLightbox();
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Contact form: friendly inline confirmation ---------- */
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', () => {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Abrindo seu e-mail…';
      }
    });
  }

});
