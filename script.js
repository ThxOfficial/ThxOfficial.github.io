(function () {
  var hero = document.querySelector('.hero-section');
  var revealBg = document.getElementById('revealBg');
  var canvas = document.getElementById('spotlightCanvas');
  var ctx = canvas && canvas.getContext('2d');
  var navbar = document.getElementById('navbar');
  var navLinks = document.querySelectorAll('.nav-link');

  var spotRadius = 140;
  var mouseX = -999;
  var mouseY = -999;
  var targetX = -999;
  var targetY = -999;
  var hasEntered = false;
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

  /* ---------- Canvas spotlight ---------- */
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

  function drawSpotlight() {
    /* Loop must continue every frame, even when idle, so the reveal
       resumes instantly when the mouse re-enters. */
    requestAnimationFrame(drawSpotlight);

    if (!canvas || !ctx) return;
    var rect = hero.getBoundingClientRect();
    var w = rect.width;
    var h = rect.height;
    ctx.clearRect(0, 0, w, h);

    if (!hasEntered || mouseX < 0) return;

    var dx = targetX - mouseX;
    var dy = targetY - mouseY;
    mouseX += dx * 0.12;
    mouseY += dy * 0.12;

    if (img.width > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, spotRadius, 0, Math.PI * 2);
      ctx.clip();

      var scale = Math.max(w / img.width, h / img.height);
      var sw = img.width * scale;
      var sh = img.height * scale;
      ctx.drawImage(img, (w - sw) / 2, (h - sh) / 2, sw, sh);

      ctx.restore();
    }

    /* Soft edge gradient ring */
    var grad = ctx.createRadialGradient(mouseX, mouseY, spotRadius - 20, mouseX, mouseY, spotRadius + 30);
    grad.addColorStop(0, 'rgba(15,23,42,0)');
    grad.addColorStop(0.5, 'rgba(15,23,42,0)');
    grad.addColorStop(1, 'rgba(15,23,42,0.95)');

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.arc(mouseX, mouseY, spotRadius - 15, 0, Math.PI * 2, true);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }

  function onMouseMove(e) {
    var rect = hero.getBoundingClientRect();
    targetX = e.clientX - rect.left;
    targetY = e.clientY - rect.top;
  }

  function onMouseEnter() {
    hasEntered = true;
    if (mouseX < 0) {
      mouseX = targetX;
      mouseY = targetY;
    }
  }

  function onMouseLeave() {
    hasEntered = false;
  }

  /* ---------- Nav scroll effect ---------- */
  function onScroll() {
    var scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* ---------- Active nav link on scroll ---------- */
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

  /* ---------- Init ---------- */
  function init() {
    renderContent();
    if (!hero || !canvas || !ctx) return;

    resizeCanvas();

    var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) {
      hero.addEventListener('mousemove', onMouseMove, { passive: true });
      hero.addEventListener('mouseenter', onMouseEnter);
      hero.addEventListener('mouseleave', onMouseLeave);
    } else {
      /* Touch: show full reveal bg */
      hero.style.cursor = 'auto';
      if (revealBg) {
        revealBg.classList.add('active');
        revealBg.style.opacity = '1';
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    window.addEventListener('resize', resizeCanvas);

    onScroll();
    updateActiveLink();
    drawSpotlight();
  }

  renderContent();
  if (img.complete) {
    init();
  } else {
    img.addEventListener('load', init);
  }
})();
