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
  var eraserInner = 28;   /* fully transparent center */
  var eraserOuter = 85;   /* fade-to-opaque edge */

  /* trail: erased marks fade back (heal) after trailLife ms */
  var trailLife = 300;      /* how long a mark stays erased before healing */
  var maxTrailPoints = 80;

  var trail = [];           /* [{x, y, t}] t = performance.now() stamp */
  var lastX = -999, lastY = -999;
  var topImg = new Image();
  topImg.src = '/pics/2ferrari.jpg';

  /* ---------- Canvas sizing ---------- */
  function resizeCanvas() {
    if (!canvas || !ctx) return;
    var rect = hero.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  /* Draw 2ferrari.jpg (cover-fit) as the fresh top layer.
     Runs EVERY frame, so any previously erased area is covered again -> heal. */
  function drawFullTop() {
    if (!ctx || !topImg.width) return;
    var rect = hero.getBoundingClientRect();
    var w = rect.width, h = rect.height;
    ctx.globalCompositeOperation = 'source-over';
    var scale = Math.max(w / topImg.width, h / topImg.height);
    var sw = topImg.width * scale;
    var sh = topImg.height * scale;
    ctx.drawImage(topImg, (w - sw) / 2, (h - sh) / 2, sw, sh);
  }

  /* Erase a soft gradient hole at (x,y). alpha 0..1 = how erased right now */
  function eraseAt(x, y, alpha) {
    if (!ctx) return;
    if (alpha <= 0.02) return;
    ctx.globalCompositeOperation = 'destination-out';
    var grad = ctx.createRadialGradient(x, y, eraserInner, x, y, eraserOuter);
    grad.addColorStop(0, 'rgba(0,0,0,' + alpha + ')');
    grad.addColorStop(0.6, 'rgba(0,0,0,' + (0.7 * alpha) + ')');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, eraserOuter, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }

  /* ---------- Main render loop ---------- */
  function render(now) {
    requestAnimationFrame(render);

    if (!ctx || !topImg.width) return;

    /* 1. Redraw the full top image -> heals everything from last frame */
    drawFullTop();

    /* 2. Re-erase only the trail marks that are still fresh.
          Marks older than trailLife are skipped, so they stay healed. */
    for (var i = trail.length - 1; i >= 0; i--) {
      var p = trail[i];
      var age = now - p.t;
      if (age > trailLife) {
        trail.splice(i, 1);
        continue;
      }
      var alpha = 1 - age / trailLife;
      eraseAt(p.x, p.y, alpha);
    }
  }

  /* ---------- Mouse ---------- */
  function onMouseMove(e) {
    var rect = hero.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var now = performance.now();

    /* stamp trail marks along the movement path (interpolated) */
    if (lastX < 0) {
      trail.push({ x: x, y: y, t: now });
    } else {
      var dx = x - lastX, dy = y - lastY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var steps = Math.max(1, Math.ceil(dist / 6));
      for (var i = 0; i <= steps; i++) {
        trail.push({
          x: lastX + (dx * i) / steps,
          y: lastY + (dy * i) / steps,
          t: now
        });
      }
    }
    while (trail.length > maxTrailPoints) trail.shift();
    lastX = x; lastY = y;

    if (cursorDot) {
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
    }
  }

  function onMouseEnter() {
    if (cursorDot) cursorDot.style.display = 'block';
  }

  function onMouseLeave() {
    if (cursorDot) cursorDot.style.display = 'none';
    lastX = -999; lastY = -999;
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

    if (canvas && ctx) {
      resizeCanvas();
      requestAnimationFrame(render);
    }
  }

  if (topImg.complete) {
    init();
  } else {
    topImg.addEventListener('load', function () { resizeCanvas(); init(); });
  }
})();
