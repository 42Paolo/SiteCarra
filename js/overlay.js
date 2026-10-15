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
