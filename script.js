(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- marquee content ---------- */
  var skills = ['Brand Identity', 'Typography', 'Illustration', 'Photoshop', 'Blender', 'Editorial Design', 'Color Theory', 'Canva'];
  var track = document.getElementById('marquee-track');
  function buildMarquee() {
    var html = '';
    for (var rep = 0; rep < 2; rep++) {
      skills.forEach(function (s) {
        html += '<span>' + s + '</span><span class="dot">✦</span>';
      });
    }
    track.innerHTML = html;
  }
  buildMarquee();

  /* ---------- cursor glow blob ---------- */
  var glow = document.getElementById('cursor-glow');
  if (!reduceMotion && glow) {
    var gx = window.innerWidth / 2, gy = window.innerHeight / 2, tx = gx, ty = gy;
    window.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
    });
    function loop() {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.transform = 'translate(' + gx + 'px,' + gy + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ---------- scroll reveals ---------- */
  var revealTargets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealTargets.forEach(function (el) { obs.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- animated stat counters ---------- */
  var counters = document.querySelectorAll('.stat-num');
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }
    var duration = 1200;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          cObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cObs.observe(el); });
  } else {
    counters.forEach(animateCounter);
  }
})();
