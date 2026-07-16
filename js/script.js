// =========================================================
// PORTFÓLIO DE ARTE — comportamento do site
// Menu mobile, marcação do link ativo e lightbox das imagens
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

    // Fecha o menu ao clicar em um link (útil no celular)
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

  // ---------- Lightbox simples para as imagens/placeholders ----------
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    var lightboxInner = lightbox.querySelector('.lightbox-inner');
    var closeBtn = lightbox.querySelector('.lightbox-close');

    document.querySelectorAll('.placeholder, .gallery figure img').forEach(function (el) {
      el.addEventListener('click', function () {
        // Se já houver uma <img> real dentro, mostra ela ampliada.
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
      });
    });

    function closeLightbox() { lightbox.classList.remove('open'); }

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

});
