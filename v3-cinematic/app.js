/* ============ JM FLOORING · v3 CINEMATIC · animations ============ */

(function () {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = matchMedia('(max-width: 760px)').matches;

  gsap.registerPlugin(ScrollTrigger);

  // ============ Lenis smooth scroll ============
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // ============ Custom cursor ============
  const dot = document.querySelector('.cursor:not(.ring)');
  const ring = document.querySelector('.cursor.ring');
  const label = document.querySelector('.cursor-label');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  if (dot && ring && !isMobile) {
    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      if (label) label.style.transform = `translate(${mx + 14}px, ${my + 14}px)`;
      requestAnimationFrame(tick);
    };
    tick();

    // cursor states
    document.querySelectorAll('[data-cursor="drag"]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-drag');
        if (label) label.textContent = 'DRAG';
      });
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-drag'));
    });
    document.querySelectorAll('[data-cursor="call"]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-call');
        if (label) label.textContent = 'CALL';
      });
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-call'));
    });
    document.querySelectorAll('[data-cursor="pause"]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-pause');
        if (label) label.textContent = 'PAUSE';
      });
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-pause'));
    });
  }

  // ============ ACT 1: COLD OPEN ============
  const coldOpen = document.querySelector('.cold-open');
  document.body.classList.remove('loading');
  document.body.classList.add('loaded');

  // Lock scroll during cold open
  if (lenis) lenis.stop();
  document.documentElement.style.overflow = 'hidden';

  const introTl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      document.documentElement.style.overflow = '';
      if (lenis) lenis.start();
    }
  });
  introTl
    .from('.cold-open .logo', { opacity: 0, scale: 0.92, y: 12, duration: 1.1 })
    .from('.cold-open .stamp', { opacity: 0, y: 14, duration: 0.6 }, '-=0.4')
    .from('.cold-open .corners span', { opacity: 0, scale: 0.6, duration: 0.5, stagger: 0.05 }, '-=0.6')
    .to({}, { duration: 0.9 }) // hold
    .to('.cold-open', { yPercent: -100, duration: 1.0, ease: 'power3.inOut', onComplete: () => coldOpen && (coldOpen.style.display = 'none') });

  // ============ Cinema bars during hero & gallery ============
  ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: 'bottom 60%',
    onEnter: () => document.body.classList.add('cinema'),
    onLeave: () => document.body.classList.remove('cinema'),
    onEnterBack: () => document.body.classList.add('cinema'),
    onLeaveBack: () => document.body.classList.remove('cinema'),
  });
  ScrollTrigger.create({
    trigger: '.gallery-h',
    start: 'top center',
    end: 'bottom center',
    onEnter: () => document.body.classList.add('cinema'),
    onLeave: () => document.body.classList.remove('cinema'),
    onEnterBack: () => document.body.classList.add('cinema'),
    onLeaveBack: () => document.body.classList.remove('cinema'),
  });

  // ============ ACT 2: HERO ============
  // SplitText on hero title
  let heroChars = [];
  if (window.SplitType) {
    const heroSplit = new SplitType('.hero-title', { types: 'chars,words' });
    heroChars = heroSplit.chars;
    heroChars.forEach(c => c.classList.add('split-char'));
  }

  const heroTl = gsap.timeline({ delay: 3.0, defaults: { ease: 'power3.out' } });
  heroTl
    .from('.hero-eyebrow', { opacity: 0, y: 20, duration: 0.6 }, 0)
    .to('.hero-eyebrow', { opacity: 1, duration: 0.4 }, 0)
    .from(heroChars, { y: 110, opacity: 0, duration: 0.95, stagger: 0.018, ease: 'power3.out' }, 0.15)
    .to('.hero-sub .reveal-mask', { y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.4')
    .to('.hero-cta', { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
    .to('.hero-mini-cta', { opacity: 1, y: 0, duration: 0.6 }, '-=0.35');

  // Hero parallax
  if (!reduced) {
    gsap.to('.hero-bg', {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  // Gold dust particles
  const particles = gsap.utils.toArray('.hero-particles span');
  particles.forEach((p, i) => {
    const x = parseFloat(p.style.getPropertyValue('--x')) || (Math.random() * 100);
    const y = parseFloat(p.style.getPropertyValue('--y')) || (Math.random() * 100);
    gsap.set(p, { left: x + '%', top: y + '%' });
    gsap.to(p, { opacity: 0.8, duration: 1.0, delay: 3.2 + i * 0.08 });
    gsap.to(p, {
      y: -40 - Math.random() * 60,
      x: (Math.random() - 0.5) * 80,
      duration: 6 + Math.random() * 6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: Math.random() * 2,
    });
    gsap.to(p, {
      opacity: 0.2 + Math.random() * 0.6,
      duration: 2 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: Math.random() * 2,
    });
  });

  // ============ ACT 3: MARQUEE — scroll-velocity ============
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    // duplicate for seamless loop
    marqueeTrack.innerHTML = marqueeTrack.innerHTML + marqueeTrack.innerHTML;
    const baseSpeed = -50; // px/sec
    let direction = -1;
    const loop = gsap.to(marqueeTrack, {
      xPercent: -50,
      duration: 30,
      ease: 'none',
      repeat: -1,
      modifiers: { xPercent: gsap.utils.unitize(v => parseFloat(v) % -50) }
    });

    if (lenis) {
      lenis.on('scroll', ({ velocity }) => {
        const factor = 1 + Math.min(8, Math.abs(velocity) * 0.04);
        loop.timeScale(velocity > 0 ? factor : -factor || -1);
        gsap.delayedCall(0.5, () => loop.timeScale(direction));
      });
    }
  }

  // ============ ACT 4: SERVICES (static — list reveal) ============
  gsap.utils.toArray('.services-list li').forEach((li, i) => {
    gsap.from(li, {
      opacity: 0, y: 24, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: li, start: 'top 92%', toggleActions: 'play none none reverse' }
    });
  });
  gsap.from('.cta-band-inner', {
    opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '.cta-band', start: 'top 85%', toggleActions: 'play none none reverse' }
  });

  // ============ ACT 5: BEFORE / AFTER drag slider ============
  const baSlider = document.getElementById('ba-slider');
  if (baSlider) {
    const wrap = baSlider.querySelector('.ba-before-wrap');
    const handle = baSlider.querySelector('.ba-handle');
    let dragging = false;

    const setPos = (clientX) => {
      const r = baSlider.getBoundingClientRect();
      let p = ((clientX - r.left) / r.width) * 100;
      p = Math.max(2, Math.min(98, p));
      wrap.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
      handle.style.left = p + '%';
    };

    baSlider.addEventListener('pointerdown', (e) => {
      dragging = true;
      baSlider.setPointerCapture(e.pointerId);
      setPos(e.clientX);
    });
    baSlider.addEventListener('pointermove', (e) => { if (dragging) setPos(e.clientX); });
    const stop = () => { dragging = false; };
    baSlider.addEventListener('pointerup', stop);
    baSlider.addEventListener('pointercancel', stop);

    // subtle intro nudge so users notice it's interactive
    gsap.from(baSlider, {
      opacity: 0, y: 40, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: baSlider, start: 'top 80%', toggleActions: 'play none none reverse' }
    });
    ScrollTrigger.create({
      trigger: baSlider, start: 'top 60%', once: true,
      onEnter: () => {
        const obj = { p: 50 };
        gsap.to(obj, { p: 32, duration: 0.7, delay: 0.3, ease: 'power2.inOut', yoyo: true, repeat: 1,
          onUpdate: () => {
            wrap.style.clipPath = `inset(0 ${100 - obj.p}% 0 0)`;
            handle.style.left = obj.p + '%';
          }
        });
      }
    });
  }

  // ============ ACT 6: INSURANCE STORY mask reveal ============
  const storyLines = gsap.utils.toArray('.story-line .inner');
  if (storyLines.length) {
    gsap.timeline({
      scrollTrigger: {
        trigger: '.insurance-story',
        start: 'top 70%',
        end: 'top 30%',
        scrub: 0.6,
      }
    })
    .to(storyLines, { y: 0, duration: 1, stagger: 0.25, ease: 'power3.out' })
    .to('.story-cta', { opacity: 1, duration: 0.6 }, '-=0.2');

    // pulse on CTA
    gsap.to('.story-cta', {
      scale: 1.04,
      duration: 1.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }

  // ============ ACT 7: GALLERY auto-marquee + arrows + in-slot rotation ============
  const galleryTrack = document.getElementById('gallery-track');
  if (galleryTrack) {
    // duplicate cards once for a seamless loop
    galleryTrack.innerHTML = galleryTrack.innerHTML + galleryTrack.innerHTML;

    // rotate the stacked photos inside each card, in place
    gsap.utils.toArray('#gallery-track .gh-card').forEach((card, ci) => {
      const imgs = card.querySelectorAll('.gh-stack img');
      if (imgs.length < 2) return;
      let idx = 0;
      setInterval(() => {
        imgs[idx].classList.remove('active');
        idx = (idx + 1) % imgs.length;
        imgs[idx].classList.add('active');
      }, 2600 + (ci % 5) * 350);
      // pause auto-scroll when hovering a card
      card.addEventListener('mouseenter', () => { hovering = true; });
      card.addEventListener('mouseleave', () => { hovering = false; });
    });

    // rAF marquee — always moves, independent of reduced-motion
    let half = galleryTrack.scrollWidth / 2;
    let x = 0;
    const BASE = -0.45;      // px/frame, leftward
    const FAST = 3.0;        // arrow speed
    let speed = BASE;
    let arrowDir = 0;        // -1 left-button, +1 right-button, 0 none
    let hovering = false;
    let dragging = false;    // finger swipe on touch devices
    let dragStartX = 0;
    let dragStartTx = 0;

    const recalc = () => { half = galleryTrack.scrollWidth / 2; };
    window.addEventListener('resize', recalc);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(recalc);

    const step = () => {
      if (dragging) { requestAnimationFrame(step); return; }   // finger controls position
      // arrow held/hovered overrides pause; otherwise pause on card hover
      if (arrowDir !== 0) {
        speed = arrowDir > 0 ? FAST : -FAST;   // right btn -> content moves left (x decreases)
      } else {
        speed = hovering ? 0 : BASE;
      }
      // NOTE: left button should reveal earlier cards -> move content right (x up)
      x += speed;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      galleryTrack.style.transform = `translate3d(${x}px,0,0)`;
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);

    // ---- touch swipe (mobile): drag to scrub, auto-resumes on release ----
    const viewport = galleryTrack.parentElement;
    if (viewport) {
      viewport.addEventListener('touchstart', (e) => {
        dragging = true;
        dragStartX = e.touches[0].clientX;
        dragStartTx = x;
      }, { passive: true });
      viewport.addEventListener('touchmove', (e) => {
        if (!dragging) return;
        x = dragStartTx + (e.touches[0].clientX - dragStartX);
        if (x <= -half) x += half;
        if (x > 0) x -= half;
        galleryTrack.style.transform = `translate3d(${x}px,0,0)`;
      }, { passive: true });
      const endDrag = () => { dragging = false; };
      viewport.addEventListener('touchend', endDrag);
      viewport.addEventListener('touchcancel', endDrag);
    }

    const leftBtn = document.getElementById('gal-left');
    const rightBtn = document.getElementById('gal-right');
    // hover OR press to drive; left = +1 (content right), right = -1 (content left)
    const bind = (btn, dir) => {
      if (!btn) return;
      btn.addEventListener('mouseenter', () => { arrowDir = dir; });
      btn.addEventListener('mouseleave', () => { arrowDir = 0; });
      btn.addEventListener('pointerdown', () => { arrowDir = dir; });
      btn.addEventListener('pointerup', () => { arrowDir = 0; });
    };
    bind(leftBtn, 1);
    bind(rightBtn, -1);
  }

  // ============ ACT 8: PROCESS gold line + step reveals ============
  const goldLine = document.querySelector('.process-timeline .gold-line');
  const procRows = gsap.utils.toArray('.proc-row');
  if (goldLine && procRows.length) {
    gsap.to(goldLine, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.process-timeline',
        start: 'top 70%',
        end: 'bottom 80%',
        scrub: 0.6,
      }
    });

    procRows.forEach(row => {
      gsap.from(row, {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: row, start: 'top 80%', toggleActions: 'play none none reverse' }
      });
    });
  }

  // ============ ACT 9: COUNTERS ============
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          v: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(obj.v); }
        });
      }
    });
  });

  // ============ ACT 10: CLOSING ============
  let bigChars = [];
  if (window.SplitType) {
    const sp = new SplitType('.closing-big', { types: 'chars,words' });
    bigChars = sp.chars;
  }
  gsap.from(bigChars, {
    y: 80, opacity: 0, duration: 0.9, stagger: 0.02, ease: 'power3.out',
    scrollTrigger: { trigger: '.closing-big', start: 'top 70%', toggleActions: 'play none none reverse' }
  });
  gsap.from('.closing-form', {
    y: 50, opacity: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.closing-form', start: 'top 80%', toggleActions: 'play none none reverse' }
  });
  gsap.from('.closing .left', {
    y: 30, opacity: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.closing .left', start: 'top 80%', toggleActions: 'play none none reverse' }
  });

  // ============ FLOATING PHONE CTA after Act 4 ============
  const floatPhone = document.querySelector('.floating-phone');
  if (floatPhone) {
    ScrollTrigger.create({
      trigger: '.services',
      start: 'top 30%',
      onEnter: () => floatPhone.classList.add('in'),
    });
  }

  // ============ THUMBTACK entrance ============
  const ttSection = document.querySelector('.thumbtack');
  if (ttSection) {
    ScrollTrigger.create({
      trigger: ttSection,
      start: 'top 78%',
      onEnter: () => ttSection.classList.add('in'),
    });
    ScrollTrigger.create({
      trigger: '.closing',
      start: 'top 70%',
      onEnter: () => floatPhone.classList.remove('in'),
      onLeaveBack: () => floatPhone.classList.add('in'),
    });
  }

  // ============ LOCATION hover map popover (30-mile radius) ============
  const mapPop = document.getElementById('map-pop');
  const mapIframe = document.getElementById('map-iframe');
  const mapCity = document.getElementById('map-city');
  const pills = document.querySelectorAll('#area-pills .pill');
  if (mapPop && mapIframe && pills.length && !isMobile) {
    let hideTimer = null;
    // bbox sized so a 30-mile radius (60mi diameter) maps to ~76% of the frame.
    // half-frame spans ~39.5 miles each way from center.
    const HALF_LAT = 39.5 / 69;          // miles -> deg latitude
    const buildSrc = (lat, lon) => {
      const halfLon = 39.5 / (69 * Math.cos(lat * Math.PI / 180));
      const left = (lon - halfLon).toFixed(4);
      const right = (lon + halfLon).toFixed(4);
      const bottom = (lat - HALF_LAT).toFixed(4);
      const top = (lat + HALF_LAT).toFixed(4);
      return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lon}`;
    };

    const place = (pill) => {
      const r = pill.getBoundingClientRect();
      const w = mapPop.offsetWidth || 280;
      let left = r.left + r.width / 2 - w / 2;
      left = Math.max(12, Math.min(window.innerWidth - w - 12, left));
      const top = r.top - mapPop.offsetHeight - 14;
      mapPop.style.left = left + 'px';
      mapPop.style.top = (top < 12 ? r.bottom + 14 : top) + 'px';
    };

    pills.forEach((pill) => {
      pill.addEventListener('mouseenter', () => {
        clearTimeout(hideTimer);
        const lat = parseFloat(pill.dataset.lat);
        const lon = parseFloat(pill.dataset.lon);
        if (isNaN(lat) || isNaN(lon)) return;
        mapCity.textContent = pill.dataset.name || pill.textContent.trim();
        if (mapIframe.dataset.key !== lat + ',' + lon) {
          mapIframe.src = buildSrc(lat, lon);
          mapIframe.dataset.key = lat + ',' + lon;
        }
        mapPop.classList.add('show');
        mapPop.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(() => place(pill));
      });
      pill.addEventListener('mousemove', () => place(pill));
      pill.addEventListener('mouseleave', () => {
        hideTimer = setTimeout(() => {
          mapPop.classList.remove('show');
          mapPop.setAttribute('aria-hidden', 'true');
        }, 120);
      });
    });
  }
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length <= 1) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(t, { offset: -60, duration: 1.4 });
      } else {
        const y = t.getBoundingClientRect().top + window.scrollY - 60;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ============ Form submit fake ============
  const form = document.getElementById('estimate-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = form.querySelector('.submit-row .note');
      if (note) {
        note.textContent = '✓ Brief received — Jorge will reach out within 1 business day';
        note.style.color = 'var(--gold-glow)';
      }
    });
  }

  // ============ Refresh ScrollTrigger after fonts load ============
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { ScrollTrigger.refresh(); });
  }
  window.addEventListener('load', () => { ScrollTrigger.refresh(); });

})();
