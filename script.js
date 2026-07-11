(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- kinetic headline: split into animated letters ---------- */
  var titleEl = document.getElementById('kinetic-title');
  var lines = ['ABHINAV', 'SRIVASTAV'];
  var totalDelayStep = 28; // ms per letter
  var globalIndex = 0;

  lines.forEach(function (word, li) {
    var lineEl = document.createElement('span');
    lineEl.className = 'line' + (li === 1 ? ' grad' : '');
    word.split('').forEach(function (ch) {
      var letter = document.createElement('span');
      letter.className = 'letter';
      letter.textContent = ch;
      if (!reduceMotion) {
        letter.style.animationDelay = (300 + globalIndex * totalDelayStep) + 'ms';
      }
      lineEl.appendChild(letter);
      globalIndex++;
    });
    titleEl.appendChild(lineEl);
  });

  /* ---------- typewriter role line ---------- */
  var roles = ['Full-Stack Web Developer', 'React & Python Engineer', 'Building things that ship'];
  var roleEl = document.getElementById('role-text');
  if (reduceMotion) {
    roleEl.textContent = roles[0];
  } else {
    var ri = 0, ci = 0, deleting = false;
    function tick() {
      var word = roles[ri];
      if (!deleting) {
        ci++;
        roleEl.textContent = word.slice(0, ci);
        if (ci === word.length) {
          deleting = true;
          setTimeout(tick, 1400);
          return;
        }
      } else {
        ci--;
        roleEl.textContent = word.slice(0, ci);
        if (ci === 0) {
          deleting = false;
          ri = (ri + 1) % roles.length;
        }
      }
      setTimeout(tick, deleting ? 35 : 65);
    }
    setTimeout(tick, globalIndex * totalDelayStep + 500);
  }

  /* ---------- marquee content ---------- */
  var skills = ['JavaScript', 'React.js', 'Python / Flask', 'MySQL', 'REST APIs', 'Git & GitHub', 'HTML5', 'CSS3', 'Chart.js'];
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
    var start = 0;
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

  /* ---------- timeline fill on scroll ---------- */
  var timeline = document.querySelector('.timeline');
  if (timeline && 'IntersectionObserver' in window) {
    var tObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          tObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    tObs.observe(timeline);
  }

  /* ---------- tilt on project cards ---------- */
  if (!reduceMotion) {
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        var rx = (py - 0.5) * -6;
        var ry = (px - 0.5) * 6;
        card.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-4px)';
        card.style.setProperty('--mx', (px * 100) + '%');
        card.style.setProperty('--my', (py * 100) + '%');
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  /* =====================================================
     GRAPHIC DESIGN VIEW — kinetic title, typewriter, marquee
     ===================================================== */
  var dTitleEl = document.getElementById('d-kinetic-title');
  if (dTitleEl) {
    var dLines = [
      { text: 'ABHINAV', cls: 'd-ink-line' },
      { text: 'CREATES', cls: 'd-accent-line' }
    ];
    var dStep = 30, dIndex = 0;
    dLines.forEach(function (row) {
      var lineEl = document.createElement('span');
      lineEl.className = 'd-line ' + row.cls;
      row.text.split('').forEach(function (ch) {
        var letter = document.createElement('span');
        letter.className = 'd-letter';
        letter.textContent = ch;
        if (!reduceMotion) letter.style.animationDelay = (250 + dIndex * dStep) + 'ms';
        lineEl.appendChild(letter);
        dIndex++;
      });
      dTitleEl.appendChild(lineEl);
    });
  }

  var dRoles = ['Graphic Designer', 'Brand & Visual Identity', 'Turning briefs into visuals'];
  var dRoleEl = document.getElementById('d-role-text');
  var dTypewriterStarted = false;
  function startDesignTypewriter() {
    if (dTypewriterStarted || !dRoleEl) return;
    dTypewriterStarted = true;
    if (reduceMotion) { dRoleEl.textContent = dRoles[0]; return; }
    var ri = 0, ci = 0, deleting = false;
    function tick() {
      var word = dRoles[ri];
      if (!deleting) {
        ci++;
        dRoleEl.textContent = word.slice(0, ci);
        if (ci === word.length) { deleting = true; setTimeout(tick, 1400); return; }
      } else {
        ci--;
        dRoleEl.textContent = word.slice(0, ci);
        if (ci === 0) { deleting = false; ri = (ri + 1) % dRoles.length; }
      }
      setTimeout(tick, deleting ? 35 : 65);
    }
    setTimeout(tick, 500);
  }

  var dSkills = ['Photoshop', 'Illustrator', 'Blender', 'CorelDRAW', 'Canva', 'Figma', 'Typography', 'Branding & Identity'];
  var dTrack = document.getElementById('d-marquee-track');
  if (dTrack) {
    var dHtml = '';
    for (var drep = 0; drep < 2; drep++) {
      dSkills.forEach(function (s) { dHtml += '<span>' + s + '</span><span class="d-dot">✦</span>'; });
    }
    dTrack.innerHTML = dHtml;
  }

  /* extra reveal observer for the design-view timeline */
  var dTimeline = document.querySelector('.d-timeline');
  if (dTimeline && 'IntersectionObserver' in window) {
    var dtObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); dtObs.unobserve(entry.target); }
      });
    }, { threshold: 0.2 });
    dtObs.observe(dTimeline);
  }

  /* ---------- registration-mark cursor (design mode) ---------- */
  var regCursor = document.getElementById('reg-cursor');
  if (!reduceMotion && regCursor) {
    var rgx = window.innerWidth / 2, rgy = window.innerHeight / 2, rtx = rgx, rty = rgy;
    window.addEventListener('mousemove', function (e) { rtx = e.clientX; rty = e.clientY; });
    function regLoop() {
      rgx += (rtx - rgx) * 0.22;
      rgy += (rty - rgy) * 0.22;
      regCursor.style.transform = 'translate(' + rgx + 'px,' + rgy + 'px)';
      requestAnimationFrame(regLoop);
    }
    regLoop();
  }

  /* =====================================================
     MODE TOGGLE — printing-press transition between
     the developer portfolio and the design portfolio
     ===================================================== */
  var modeToggle = document.getElementById('mode-toggle');
  var transitionEl = document.getElementById('mode-transition');
  var devView = document.getElementById('dev-view');
  var designView = document.getElementById('designer-view');
  var designEntered = false;

  function playPress(callback) {
    if (reduceMotion || !transitionEl) { callback(); return; }
    transitionEl.classList.remove('running');
    void transitionEl.offsetWidth; // restart animation
    transitionEl.classList.add('running');
    setTimeout(callback, 480);
    setTimeout(function () { transitionEl.classList.remove('running'); }, 1250);
  }

  /* =====================================================
     PROJECT CASE STUDIES — click a design card to expand
     ===================================================== */
  var projectData = {
    social: {
      tag: 'Social media & event design',
      title: 'Social Media Design — College Society',
      art: '<svg viewBox="0 0 200 200" class="d-art-svg"><rect x="52" y="20" width="96" height="160" rx="18" class="art-frame"/><rect x="66" y="46" width="68" height="68" rx="10" class="art-c"/><circle cx="100" cy="80" r="18" class="art-m"/><rect x="66" y="128" width="68" height="10" class="art-y-block"/></svg>',
      bullets: [
        'Designed promotional posters, banners, and social media graphics for college events.',
        "Created visually engaging content while following the society's branding guidelines.",
        'Collaborated with event coordinators to deliver creative designs within deadlines.',
        'Used Adobe Photoshop, Illustrator, and Canva to produce digital marketing materials.'
      ],
      tools: ['Photoshop', 'Illustrator', 'Canva']
    },
    ngo: {
      tag: 'Awareness campaign',
      title: 'Awareness Campaign Design — NGO',
      art: '<svg viewBox="0 0 200 200" class="d-art-svg"><circle cx="100" cy="95" r="58" class="art-frame"/><path d="M100 68c-9-14-32-10-32 8 0 20 32 40 32 40s32-20 32-40c0-18-23-22-32-8z" class="art-m"/><rect x="70" y="150" width="60" height="10" rx="5" class="art-y-block"/></svg>',
      bullets: [
        'Designed social media posts, posters, and awareness campaign creatives for an NGO.',
        'Developed impactful visuals to communicate campaign messages effectively.',
        'Worked closely with team members to ensure consistent branding across all designs.',
        'Delivered creative assets for both online and offline promotional activities.'
      ],
      tools: ['Photoshop', 'Illustrator', 'Canva']
    }
  };

  var projectModal = document.getElementById('d-project-modal');
  var lastFocusedCard = null;

  function openProjectModal(id) {
    var data = projectData[id];
    if (!data || !projectModal) return;
    projectModal.querySelector('.d-modal-art').innerHTML = data.art;
    projectModal.querySelector('.d-modal-tag').textContent = data.tag;
    projectModal.querySelector('.d-modal-title').textContent = data.title;
    var bulletsEl = projectModal.querySelector('.d-modal-bullets');
    bulletsEl.innerHTML = '';
    data.bullets.forEach(function (b) {
      var li = document.createElement('li');
      li.textContent = b;
      bulletsEl.appendChild(li);
    });
    var toolsEl = projectModal.querySelector('.d-modal-tools');
    toolsEl.innerHTML = '';
    data.tools.forEach(function (t) {
      var span = document.createElement('span');
      span.className = 'd-tag';
      span.textContent = t;
      toolsEl.appendChild(span);
    });
    projectModal.classList.add('is-open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var closeBtn = projectModal.querySelector('.d-modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('is-open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedCard) lastFocusedCard.focus();
  }

  document.querySelectorAll('.d-card[data-project]').forEach(function (card) {
    card.addEventListener('click', function () {
      lastFocusedCard = card;
      openProjectModal(card.getAttribute('data-project'));
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        lastFocusedCard = card;
        openProjectModal(card.getAttribute('data-project'));
      }
    });
  });

  if (projectModal) {
    projectModal.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', closeProjectModal);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && projectModal.classList.contains('is-open')) closeProjectModal();
    });
  }

  if (modeToggle) {
    modeToggle.addEventListener('click', function () {
      var goingToDesign = document.body.getAttribute('data-mode') !== 'design';
      playPress(function () {
        document.body.setAttribute('data-mode', goingToDesign ? 'design' : 'dev');
        if (goingToDesign) {
          devView.classList.remove('is-active');
          designView.classList.add('is-active');
          window.scrollTo(0, 0);
          if (!designEntered) { designEntered = true; startDesignTypewriter(); }
        } else {
          designView.classList.remove('is-active');
          devView.classList.add('is-active');
          window.scrollTo(0, 0);
        }
      });
    });
  }
})();
