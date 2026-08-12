(function () {
  var hero = document.querySelector('.hero-section');
  var revealBg = document.getElementById('revealBg');
  var canvas = document.getElementById('spotlightCanvas');
  var ctx = canvas && canvas.getContext('2d');
  var navbar = document.getElementById('navbar');
  var navLinks = document.querySelectorAll('.nav-link');

  /* ---------- Ripple settings ---------- */
  var ringWidth  = 32;        /* px, thickness of each ripple ring */
  var maxRadius  = 460;       /* px, max outer radius before ripple dies */
  var expandSpeed = 240;      /* px / second */
  var spawnIntervalFast = 0.045;  /* seconds between ripples when moving */
  var spawnIntervalSlow = 0.3;    /* seconds when stationary */
  var velThreshold = 3;       /* px/frame below which mouse is "still" */

  var ripples = [];
  var mouseX = -999;
  var mouseY = -999;
  var prevX = -999;
  var prevY = -999;
  var hasEntered = false;
  var lastSpawnTime = 0;
  var lastFrameTime = 0;
  var img = new Image();
  img.src = 'pics/monza.jpg';

  /* ---------- Render content from content.js ---------- */
  function renderContent() {
    var S = window.SITE;
    if (!S) return;

    var brand = document.querySelector('.nav-brand');
    if (brand && S.brand) brand.textContent = S.brand;

    var h1 = document.querySelector('.hero-title');
    if (h1 && S.heroTitle) h1.textContent = S.heroTitle;

    var sub = document.querySelector('.hero-subtitle');
    if (sub && S.heroSubtitle) sub.textContent = S.heroSubtitle;

    var grid = document.querySelector('.card-grid');
    if (grid && S.categories && S.categories.length) {
      grid.innerHTML = S.categories.map(function (c) {
        return '<div class="glass-card">' +
          '<div class="card-icon">' +
          '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
          c.icon +
          '</svg></div>' +
          '<h3>' + c.title + '</h3>' +
          '<p>' + c.desc + '</p>' +
          '</div>';
      }).join('');
    }

    var list = document.querySelector('.article-list');
    if (list && S.articles && S.articles.length) {
      list.innerHTML = S.articles.map(function (a) {
        var tag = a.tag ? '<span class="article-tag">' + a.tag + '</span>' : '';
        var desc = a.desc ? '<p>' + a.desc + '</p>' : '';
        return '<a class="article-row" href="' + (a.href || '#') + '">' +
          '<div class="article-info">' + tag +
          '<h3>' + a.title + '</h3>' + desc +
          '</div>' +
          '<span class="article-date">' + (a.date || '') + '</span>' +
          '</a>';
      }).join('');
    }
  }

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

  /* ---------- Ripple logic ---------- */
  function spawnRipple(x, y) {
    ripples.push({
      x: x,
      y: y,
      outerR: 0,
      age: 0,
      maxAge: maxRadius / expandSpeed
    });
  }

  function updateRipples(dt) {
    for (var i = ripples.length - 1; i >= 0; i--) {
      var r = ripples[i];
      r.age += dt;
      r.outerR = r.age * expandSpeed;
      if (r.age > r.maxAge) {
        ripples.splice(i, 1);
      }
    }
  }

  /* ---------- Canvas draw ---------- */
  function draw(timestamp) {
    requestAnimationFrame(draw);

    if (!canvas || !ctx) return;

    var now = timestamp / 1000;
    var dt = lastFrameTime ? Math.min(now - lastFrameTime, 0.1) : 0;
    lastFrameTime = now;

    var rect = hero.getBoundingClientRect();
    var w = rect.width;
    var h = rect.height;

    /* Spawn ripples while mouse is inside hero */
    if (hasEntered && mouseX >= 0) {
      var dx = mouseX - prevX;
      var dy = mouseY - prevY;
      var vel = Math.sqrt(dx * dx + dy * dy);
      var interval = vel >= velThreshold ? spawnIntervalFast : spawnIntervalSlow;

      if (now - lastSpawnTime >= interval) {
        lastSpawnTime = now;
        spawnRipple(mouseX, mouseY);
      }
      prevX = mouseX;
      prevY = mouseY;
    }

    updateRipples(dt);

    /* Clear and draw ripples */
    ctx.clearRect(0, 0, w, h);
    if (ripples.length === 0) return;

    /* Build clip path: each ripple is an outer CW arc + inner CCW arc → ring.
       nonzero winding rule means overlapping rings accumulate correctly. */
    ctx.beginPath();
    for (var i = 0; i < ripples.length; i++) {
      var r = ripples[i];
      ctx.arc(r.x, r.y, r.outerR, 0, Math.PI * 2, false);       /* CW  +1 */
      var inner = Math.max(0, r.outerR - ringWidth);
      if (inner > 0) {
        ctx.arc(r.x, r.y, inner, 0, Math.PI * 2, true);          /* CCW -1 */
      }
    }
    ctx.clip('nonzero');

    /* Draw monza.jpg cover-fit within clipped rings */
    if (img.width > 0) {
      var scale = Math.max(w / img.width, h / img.height);
      var sw = img.width * scale;
      var sh = img.height * scale;
      ctx.drawImage(img, (w - sw) / 2, (h - sh) / 2, sw, sh);
    }
  }

  /* ---------- Mouse events ---------- */
  function onMouseMove(e) {
    var rect = hero.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }

  function onMouseEnter() {
    hasEntered = true;
    if (mouseX < 0) {
      mouseX = prevX = targetX || 0;
      mouseY = prevY = targetY || 0;
    }
    if (mouseX < 0) mouseX = mouseY = prevX = prevY = 0;
    lastSpawnTime = 0; /* force immediate first ripple */
  }

  function onMouseLeave() {
    hasEntered = false;
  }

  /* ---------- Scroll ---------- */
  function onScroll() {
    var scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
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
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  /* ---------- Windows resize ---------- */
  function onResize() {
    resizeCanvas();
  }

  /* ---------- Init ---------- */
  function init() {
    renderContent();

    var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      /* Touch: show monza.jpg full-screen */
      hero.style.cursor = 'auto';
      if (revealBg) {
        revealBg.classList.add('active');
        revealBg.style.opacity = '1';
      }
    } else {
      hero.addEventListener('mousemove', onMouseMove, { passive: true });
      hero.addEventListener('mouseenter', onMouseEnter);
      hero.addEventListener('mouseleave', onMouseLeave);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    window.addEventListener('resize', onResize);

    onScroll();
    updateActiveLink();

    if (canvas && ctx) {
      resizeCanvas();
      requestAnimationFrame(draw);
    }
  }

  /* renderContent called early so text appears even before image loads */
  renderContent();

  if (img.complete) {
    init();
  } else {
    img.addEventListener('load', init);
  }
})();
