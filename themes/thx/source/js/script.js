(function () {
  var hero = document.querySelector('.hero-section');
  var canvas = document.getElementById('eraserCanvas');
  var ctx = canvas && canvas.getContext('2d');
  var cursorDot = document.getElementById('cursor-dot');
  var themeBtn = document.getElementById('theme-toggle');
  var navbar = document.getElementById('navbar');
  var navLinks = document.querySelectorAll('.nav-link');
  var html = document.documentElement;

  /* eraser radius */
  var eraserInner = 30;   /* fully erased center */
  var eraserOuter = 70;   /* fade-to-opaque edge */

  var mouseX = -999, mouseY = -999;
  var hasEntered = false;
  var prevX = -999, prevY = -999;
  var topImg = new Image();
  topImg.src = '/pics/2ferrari.jpg';

  /* ---------- Canvas sizing & init ---------- */
  function resizeCanvas() {
    if (!canvas || !ctx) return;
    var rect = hero.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      redrawFull();
    }
  }

  /* Draw 2ferrari.jpg (cover-fit) on canvas */
  function redrawFull() {
    if (!ctx || !topImg.width) return;
    var rect = hero.getBoundingClientRect();
    var w = rect.width, h = rect.height;
    ctx.globalCompositeOperation = 'source-over';
    var scale = Math.max(w / topImg.width, h / topImg.height);
    var sw = topImg.width * scale;
    var sh = topImg.height * scale;
    ctx.drawImage(topImg, (w - sw) / 2, (h - sh) / 2, sw, sh);
  }

  /* Erase a soft gradient hole at (x,y) */
  function eraseAt(x, y) {
    if (!ctx) return;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';

    var grad = ctx.createRadialGradient(x, y, eraserInner, x, y, eraserOuter);
    grad.addColorStop(0, 'rgba(0,0,0,1)');      /* fully erase center */
    grad.addColorStop(0.6, 'rgba(0,0,0,0.7)');   /* mostly erased */
    grad.addColorStop(1, 'rgba(0,0,0,0)');       /* no erase at edge */

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, eraserOuter, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /* Erase along the line from prev position to current */
  function eraseStroke(px, py, cx, cy) {
    var dx = cx - px, dy = cy - py;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 1) { eraseAt(cx, cy); return; }
    var steps = Math.max(1, Math.ceil(dist / 6));
    for (var i = 0; i <= steps; i++) {
      var t = i / steps;
      eraseAt(px + dx * t, py + dy * t);
    }
  }

  /* ---------- Mouse ---------- */
  function onMouseMove(e) {
    var rect = hero.getBoundingClientRect();
    var cx = e.clientX - rect.left;
    var cy = e.clientY - rect.top;

    /* cursor dot */
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';

    /* erase */
    if (hasEntered && prevX >= 0) {
      eraseStroke(prevX, prevY, cx, cy);
    }
    prevX = cx; prevY = cy;
    mouseX = cx; mouseY = cy;
  }

  function onMouseEnter() {
    hasEntered = true;
    cursorDot.style.display = 'block';
    prevX = -999; prevY = -999;
  }

  function onMouseLeave() {
    hasEntered = false;
    cursorDot.style.display = 'none';
    prevX = -999; prevY = -999;
  }

  /* ---------- Theme toggle ---------- */
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    try { localStorage.setItem('thx-theme', theme); } catch (e) {}
  }

  function initTheme() {
    var saved;
    try { saved = localStorage.getItem('thx-theme'); } catch (e) {}
    applyTheme(saved === 'light' ? 'light' : 'dark');
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var current = html.getAttribute('data-theme');
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  /* ---------- Scroll ---------- */
  function onScroll() {
    if ((window.scrollY || window.pageYOffset) > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  }

  function updateActiveLink() {
    var sections = document.querySelectorAll('section[id]');
    var scrollY = window.scrollY + 100;
    var current = 'home';
    sections.forEach(function (sec) {
      var top = sec.offsetTop;
      var height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current || link.getAttribute('href') === '/' && current === 'home') {
        link.classList.add('active');
      }
    });
  }

  /* ---------- Init ---------- */
  function init() {
    initTheme();
    onScroll();

    if (!hero) return;

    /* touch detection */
    var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) {
      hero.style.cursor = 'auto';
      /* on touch, just show canvas as-is (2ferrari visible) */
    } else {
      hero.addEventListener('mousemove', onMouseMove, { passive: true });
      hero.addEventListener('mouseenter', onMouseEnter);
      hero.addEventListener('mouseleave', onMouseLeave);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { resizeCanvas(); });

    if (canvas && ctx) { resizeCanvas(); }
  }

  if (topImg.complete) {
    init();
  } else {
    topImg.addEventListener('load', function () { resizeCanvas(); init(); });
  }
})();
