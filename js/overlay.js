/* ============================================================
   IN PIAZZA — overlay.js
   Comportamento condiviso da tutte le pagine: hamburger + menu overlay
   (tenda d'onda) e modal recensioni (Google / Tripadvisor). Ogni pagina
   aggiunge poi un proprio <script> per la logica specifica (rendering
   del menu e scroll-spy in index.html, reveal-on-scroll in chi-siamo.html).
   ============================================================ */
(function(){
  'use strict';
  document.documentElement.classList.add('js');

  /* ---------- SOCIAL (UNICO elenco: menu a tendina + footer di tutte le pagine) ----------
     Per cambiare un link modifica SOLO `href` qui sotto. Con href vuoto l'icona resta
     visibile ma non cliccabile (segnaposto). Ordine = ordine delle icone. */
  var SOCIAL = [
    { name:'Facebook',    href:'', glyph:'f' },
    { name:'Tripadvisor', href:'https://www.tripadvisor.com/Restaurant_Review-g12083518-d15848178-Reviews-In_Piazza-Caldine_Tuscany.html',
      svg:'<svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="7" cy="14" r="4.2"/><circle cx="17" cy="14" r="4.2"/><circle cx="7" cy="14" r="1.5" fill="currentColor" stroke="none"/><circle cx="17" cy="14" r="1.5" fill="currentColor" stroke="none"/><path d="M1 9.2h3.2C6.3 7.2 9.2 6.1 12 6.1s5.7 1.1 7.8 3.1H23"/><path d="M10.6 15.2 12 17l1.4-1.8z" fill="currentColor"/></svg>' },
    { name:'Instagram',   href:'',
      svg:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.1"/><circle cx="17.3" cy="6.7" r=".6" fill="currentColor"/></svg>' }
  ];
  document.querySelectorAll('[data-social]').forEach(function(box){
    SOCIAL.forEach(function(sc){
      var inner = sc.svg || '<span aria-hidden="true">'+sc.glyph+'</span>';
      var el = document.createElement(sc.href ? 'a' : 'span');
      el.className = 'social-dot';
      if(sc.href){
        el.href = sc.href; el.target = '_blank'; el.rel = 'noopener noreferrer';
        el.setAttribute('aria-label', sc.name);
      } else {
        el.setAttribute('aria-hidden', 'true');
      }
      el.innerHTML = inner;
      box.appendChild(el);
    });
  });

  /* due hamburger possono coesistere nel DOM (header mobile + barra
     desktop di index.html): solo uno è visibile per volta, entrambi
     aprono/chiudono lo stesso menu. */
  var hamburgers = Array.prototype.slice.call(document.querySelectorAll('.hamburger'));
  var closeBtn   = document.querySelector('.overlay-close');
  var overlay    = document.getElementById('overlay-menu');

  function openMenu(){
    document.body.classList.add('menu-open');
    hamburgers.forEach(function(h){ h.setAttribute('aria-expanded','true'); });
    overlay.setAttribute('aria-hidden','false');
    overlay.inert = false;
  }
  function closeMenu(){
    document.body.classList.remove('menu-open');
    hamburgers.forEach(function(h){ h.setAttribute('aria-expanded','false'); });
    overlay.setAttribute('aria-hidden','true');
    overlay.inert = true;
  }
  hamburgers.forEach(function(h){ h.addEventListener('click', openMenu); });
  closeBtn.addEventListener('click', closeMenu);

  overlay.querySelectorAll('.menu-overlay__nav .ov-link:not(#review-trigger)').forEach(function(a){
    a.addEventListener('click', function(e){
      var href = a.getAttribute('href');
      closeMenu();
      if(href && href.charAt(0) === '#'){
        e.preventDefault();
        var target = document.querySelector(href);
        if(target) target.scrollIntoView({ behavior:'smooth', block:'start' });
      }
    });
  });
  overlay.querySelectorAll('.menu-overlay__bar a').forEach(function(a){ a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && document.body.classList.contains('menu-open') && !document.body.classList.contains('review-open')) closeMenu();
  });

  /* modal recensioni (Google / Tripadvisor) — il menu resta aperto e frenato
     dietro il vetro smerigliato: chiudendo il modal si torna alla selezione */
  var reviewTrigger = document.getElementById('review-trigger');
  var reviewModal   = document.getElementById('review-modal');
  var reviewClose   = reviewModal ? reviewModal.querySelector('.review-modal__close') : null;
  function openReview(){ document.body.classList.add('review-open'); reviewModal.setAttribute('aria-hidden','false'); reviewModal.inert = false; }
  function closeReview(){ document.body.classList.remove('review-open'); reviewModal.setAttribute('aria-hidden','true'); reviewModal.inert = true; }
  if(reviewTrigger && reviewModal){
    reviewTrigger.addEventListener('click', openReview);
    reviewClose.addEventListener('click', closeReview);
    reviewModal.addEventListener('click', function(e){ if(e.target === reviewModal) closeReview(); });
    reviewModal.querySelectorAll('.review-card').forEach(function(a){ a.addEventListener('click', function(){ setTimeout(closeReview, 200); }); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && document.body.classList.contains('review-open')) closeReview(); });
  }
})();
