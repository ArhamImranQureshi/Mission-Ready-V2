(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $$ = function(s,r){ return [].slice.call((r||document).querySelectorAll(s)); };

  /* mobile menu */
  var tg = document.querySelector('.menu-toggle'), menu = document.getElementById('site-menu');
  function setMenu(o){
    tg.setAttribute('aria-expanded', o); tg.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
    menu.classList.toggle('open', o); document.body.classList.toggle('menu-open', o);
  }
  if (tg && menu){
    tg.addEventListener('click', function(){ setMenu(tg.getAttribute('aria-expanded') !== 'true'); });
    $$('a', menu).forEach(function(a){ a.addEventListener('click', function(){ setMenu(false); }); });
    addEventListener('keydown', function(e){ if (e.key === 'Escape') setMenu(false); });
  }

  /* transparent header at top, navy glass once scrolled */
  var nav = document.querySelector('.nav');
  function navState(){ if (nav) nav.classList.toggle('scrolled', scrollY > 40); }
  addEventListener('scroll', navState, {passive:true}); navState();

  /* reveal on scroll */
  var rv = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold:.12, rootMargin:'0px 0px -6% 0px'});
    rv.forEach(function(el){ io.observe(el); });
  } else rv.forEach(function(el){ el.classList.add('in'); });

  /* scroll progress + scenes (home page drives its own scenes) */
  var bar = document.querySelector('.progress');
  var scenes = document.getElementById('pin') ? [] : $$('[data-scene]');
  function clamp(v){ return v < 0 ? 0 : v > 1 ? 1 : v; }
  var ticking = false;
  function update(){
    ticking = false;
    var vh = innerHeight, dh = document.documentElement.scrollHeight - vh;
    if (bar && !document.getElementById('pin')) bar.style.setProperty('--doc', dh > 0 ? (scrollY/dh).toFixed(4) : 0);
    scenes.forEach(function(el){
      var r = el.getBoundingClientRect(), p, m = el.dataset.scene;
      if (m === 'pin') p = -r.top / Math.max(1, r.height - vh);
      else if (m === 'exit') p = -r.top / r.height;
      else if (m === 'enter') p = (vh - r.top) / (vh * .75);
      else if (m === 'center') p = (vh * .6 - r.top) / r.height;
      else p = (vh - r.top) / (vh + r.height);
      el.style.setProperty('--p', clamp(p).toFixed(4));
    });
  }
  if (!reduce){
    addEventListener('scroll', function(){ if (!ticking){ ticking = true; requestAnimationFrame(update); } }, {passive:true});
    addEventListener('resize', update);
  }
  update();

  /* FAQ accordion */
  $$('.faq-q').forEach(function(b){
    b.addEventListener('click', function(){
      var open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', open);
      document.getElementById(b.getAttribute('aria-controls')).classList.toggle('open', open);
    });
  });

  /* demo forms */
  $$('form[data-demo]').forEach(function(f){
    var msg = f.querySelector('.form-msg');
    f.addEventListener('submit', function(e){
      e.preventDefault();
      var bad = $$('[required]', f).some(function(i){ return !i.value.trim(); });
      msg.hidden = false;
      msg.textContent = bad ? 'Please fill in the required fields.' : 'Thank you. This form is a visual preview only and has not been sent.';
    });
  });
})();
