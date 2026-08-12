(function () {
  var hero = document.querySelector('.hero-section');
  var revealBg = document.getElementById('revealBg');
  var canvas = document.getElementById('spotlightCanvas');
  var ctx = canvas.getContext('2d');
  var navbar = document.getElementById('navbar');
  var navLinks = document.querySelectorAll('.nav-link');

  var spotRadius = 140;
  var mouseX = -999;
  var mouseY = -999;
  var targetX = -999;
  var targetY = -999;
  var hasEntered = false;
  var isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  var img = new Image();
  img.src = 'pics/monza.jpg';

  /* ---------- Canvas spotlight ---------- */
  function resizeCanvas() {
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
    var rect = hero.getBoundingClientRect();
    var w = rect.width;
    var h = rect.height;
    ctx.clearRect(0, 0, w, h);

    if (!hasEntered || mouseX < 0) return;

    var dx = targetX - mouseX;
    var dy = targetY - mouseY;
    mouseX += dx * 0.12;
    mouseY += dy * 0.12;

    ctx.save();
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, spotRadius, 0, Math.PI * 2);
    ctx.clip();

    var scale = Math.max(w / img.width, h / img.height);
    var sw = img.width * scale;
    var sh = img.height * scale;
    var sx = (w - sw) / 2;
    var sy = (h - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh);

    ctx.restore();

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

    requestAnimationFrame(drawSpotlight);
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
    revealBg.classList.remove('active');
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
    if (!hero || !canvas || !revealBg) return;

    resizeCanvas();

    var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) {
      hero.addEventListener('mousemove', onMouseMove, { passive: true });
      hero.addEventListener('mouseenter', onMouseEnter);
      hero.addEventListener('mouseleave', onMouseLeave);
    } else {
      /* Touch: show full reveal bg */
      hero.style.cursor = 'auto';
      revealBg.classList.add('active');
      revealBg.style.opacity = '1';
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    window.addEventListener('resize', resizeCanvas);

    onScroll();
    updateActiveLink();
    drawSpotlight();
  }

  if (img.complete) {
    init();
  } else {
    img.addEventListener('load', init);
  }
})();
