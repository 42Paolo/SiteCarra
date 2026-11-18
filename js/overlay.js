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

  /* chi ha chiesto "movimento ridotto" non deve vedere scroll animati */
  var reduceMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches:false };

  /* ---------- SOCIAL (UNICO elenco: menu a tendina + footer di tutte le pagine) ----------
     Per cambiare un link modifica SOLO `href` qui sotto. Con href vuoto l'icona resta
     visibile ma non cliccabile (segnaposto). Ordine = ordine delle icone. */
  var SOCIAL = [
    { name:'Facebook',    href:'https://www.facebook.com/InPiazzaCaldine/', glyph:'f' },
    { name:'Tripadvisor', href:'https://www.tripadvisor.com/Restaurant_Review-g12083518-d15848178-Reviews-In_Piazza-Caldine_Tuscany.html',
      svg:'<svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="7" cy="14" r="4.2"/><circle cx="17" cy="14" r="4.2"/><circle cx="7" cy="14" r="1.5" fill="currentColor" stroke="none"/><circle cx="17" cy="14" r="1.5" fill="currentColor" stroke="none"/><path d="M1 9.2h3.2C6.3 7.2 9.2 6.1 12 6.1s5.7 1.1 7.8 3.1H23"/><path d="M10.6 15.2 12 17l1.4-1.8z" fill="currentColor"/></svg>' },
    { name:'Google',       href:'https://maps.app.goo.gl/5trc5QQUGpTFEYTVA',   /* stesso link delle recensioni Google */
      svg:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18.5 7.4A8 8 0 1 0 20 12h-7.5"/></svg>' }
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
  var hamburgers  = Array.prototype.slice.call(document.querySelectorAll('.hamburger'));
  var closeBtn    = document.querySelector('.overlay-close');
  var overlay     = document.getElementById('overlay-menu');
  var reviewTrigger = document.getElementById('review-trigger');
  var reviewModal   = document.getElementById('review-modal');
  var reviewClose   = reviewModal ? reviewModal.querySelector('.review-modal__close') : null;
  var curtain     = overlay.querySelector('.wave-curtain');

  /* il resto della pagina (header, menu, footer…) è reso inerte mentre un dialogo è aperto:
     il focus da tastiera e i lettori di schermo restano dentro al menu / alla finestra. */
  var pageEls = Array.prototype.filter.call(overlay.parentNode.children, function(el){
    return el !== overlay && el !== reviewModal && el.nodeName !== 'SCRIPT';
  });
  function setInert(list, on){ list.forEach(function(el){ el.inert = on; }); }
  function refocus(el){ if(el && document.contains(el) && el.focus) el.focus({ preventScroll:true }); }

  /* sfondo illustrato del menu su mobile: si carica a pagina finita (o appena l'utente
     si avvicina all'hamburger), così non compete con le risorse della prima schermata */
  function loadCurtain(){ if(curtain) curtain.classList.add('is-loaded'); }
  hamburgers.forEach(function(h){
    ['pointerdown','touchstart','focus'].forEach(function(t){ h.addEventListener(t, loadCurtain, { once:true, passive:true }); });
  });
  window.addEventListener('load', function(){
    if('requestIdleCallback' in window) requestIdleCallback(loadCurtain, { timeout:3000 }); else setTimeout(loadCurtain, 1500);
  });

  var menuOpener = null;
  function openMenu(){
    menuOpener = document.activeElement;
    loadCurtain();
    document.body.classList.add('menu-open');
    hamburgers.forEach(function(h){ h.setAttribute('aria-expanded','true'); });
    overlay.setAttribute('aria-hidden','false');
    overlay.inert = false;
    setInert(pageEls, true);
    closeBtn.focus({ preventScroll:true });
  }
  function closeMenu(){
    document.body.classList.remove('menu-open');
    hamburgers.forEach(function(h){ h.setAttribute('aria-expanded','false'); });
    overlay.setAttribute('aria-hidden','true');
    overlay.inert = true;
    setInert(pageEls, false);
    refocus(menuOpener); menuOpener = null;
  }
  hamburgers.forEach(function(h){ h.addEventListener('click', openMenu); });
  closeBtn.addEventListener('click', closeMenu);

  overlay.querySelectorAll('.menu-overlay__nav .ov-link:not(#review-trigger)').forEach(function(a){
    a.addEventListener('click', function(e){
      var href = a.getAttribute('href');
      if(href && href.charAt(0) === '#'){                       /* ancora nella stessa pagina */
        e.preventDefault();
        closeMenu();
        var target = document.querySelector(href);
        if(target) target.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block:'start' });
      } else if(a.getAttribute('aria-current') === 'page'){      /* la voce della pagina in cui siamo: basta chiudere */
        e.preventDefault();
        closeMenu();
      } else {
        /* altra pagina: la nuova pagina nasce con il menu già aperto e l'onda si ritira subito dopo
           (stessa scena, nessuno stacco). Il segnale vale pochi secondi (vedi sotto). */
        try{ sessionStorage.setItem('ip-menu-return', String(Date.now())); }catch(err){}
      }
    });
  });
  overlay.querySelectorAll('.menu-overlay__bar a').forEach(function(a){ a.addEventListener('click', closeMenu); });

  /* modal recensioni (Google / Tripadvisor) — il menu resta aperto e frenato
     dietro il vetro smerigliato: chiudendo il modal si torna alla selezione */
  var reviewOpener = null;
  function openReview(){
    reviewOpener = document.activeElement;
    document.body.classList.add('review-open');
    reviewModal.setAttribute('aria-hidden','false');
    reviewModal.inert = false;
    overlay.inert = true;                       /* il menu sotto al vetro non è raggiungibile */
    (reviewClose || reviewModal).focus({ preventScroll:true });
  }
  function closeReview(){
    document.body.classList.remove('review-open');
    reviewModal.setAttribute('aria-hidden','true');
    reviewModal.inert = true;
    if(document.body.classList.contains('menu-open')) overlay.inert = false;
    refocus(reviewOpener); reviewOpener = null;
  }
  if(reviewTrigger && reviewModal){
    reviewTrigger.addEventListener('click', openReview);
    reviewClose.addEventListener('click', closeReview);
    reviewModal.addEventListener('click', function(e){ if(e.target === reviewModal) closeReview(); });
    reviewModal.querySelectorAll('.review-card').forEach(function(a){ a.addEventListener('click', function(){ setTimeout(closeReview, 200); }); });
  }

  /* arrivo da un link del menu: lo script in testa al <body> ha già aperto l'overlay (senza animazione);
     appena la pagina è pronta lo chiudiamo, così si vede l'onda ritirarsi e rivelare la pagina nuova */
  if(document.body.classList.contains('menu-instant')){
    loadCurtain();
    var settled = false;
    var settle = function(){
      if(settled) return; settled = true;
      requestAnimationFrame(function(){ requestAnimationFrame(function(){
        document.body.classList.remove('menu-open', 'menu-instant');
      }); });
    };
    if(document.readyState === 'complete') settle(); else { window.addEventListener('load', settle); setTimeout(settle, 1200); }
  }

  /* Esc: chiude prima la finestra recensioni, poi il menu */
  document.addEventListener('keydown', function(e){
    if(e.key !== 'Escape') return;
    if(document.body.classList.contains('review-open')) closeReview();
    else if(document.body.classList.contains('menu-open')) closeMenu();
  });
})();
