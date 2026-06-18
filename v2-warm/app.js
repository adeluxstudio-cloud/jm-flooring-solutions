/* ============ JM Flooring Solutions · v2 · interactions ============ */

(function () {
  'use strict';

  // ---- Nav scroll state ----
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (window.scrollY > 8) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Scroll reveal ----
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

  // ---- Before/After slider ----
  const ba = document.querySelector('.ba-stage');
  if (ba) {
    let active = false;
    const setPos = (clientX) => {
      const rect = ba.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(2, Math.min(98, pct));
      ba.style.setProperty('--ba-pos', pct + '%');
    };
    ba.addEventListener('pointerdown', (e) => {
      active = true;
      ba.setPointerCapture(e.pointerId);
      setPos(e.clientX);
    });
    ba.addEventListener('pointermove', (e) => { if (active) setPos(e.clientX); });
    ba.addEventListener('pointerup', () => { active = false; });
    ba.addEventListener('pointercancel', () => { active = false; });

    // Chip switching: swap the after image
    const afterImg = ba.querySelector('.ba-after img');
    document.querySelectorAll('.ba-text .chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.ba-text .chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const src = chip.dataset.src;
        if (afterImg && src) afterImg.src = src;
      });
    });
  }

  // ---- Marquee duplicate ----
  const track = document.querySelector('.marquee-track');
  if (track) track.innerHTML = track.innerHTML + track.innerHTML;

  // ---- Smooth anchor offset ----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length <= 1) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      const y = t.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  // ---- Subtle parallax for gallery ----
  const galImgs = document.querySelectorAll('.gal img');
  if (galImgs.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let raf;
    const update = () => {
      galImgs.forEach(img => {
        const rect = img.getBoundingClientRect();
        const vh = window.innerHeight;
        const center = rect.top + rect.height / 2 - vh / 2;
        const offset = Math.max(-30, Math.min(30, center / vh * -20));
        img.style.transform = `translate3d(0, ${offset}px, 0) scale(1.08)`;
      });
      raf = null;
    };
    window.addEventListener('scroll', () => {
      if (!raf) raf = requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  // ---- Testimonials carousel ----
  const testimonials = [
    {
      quote: "Jorge and his crew tore out 1,400 square feet of carpet and laid wide-plank LVP in four days. The seams are invisible, the baseboards are clean, and they left the house cleaner than they found it.",
      name: "Megan R.",
      place: "Aurora · LVP install",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      photo: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80"
    },
    {
      quote: "We had a basement flood and the insurance scope was a mess. JM Flooring handled the supplements, matched the engineered hardwood, and finished a week ahead of schedule.",
      name: "David K.",
      place: "Parker · Insurance claim",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      photo: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=900&q=80"
    },
    {
      quote: "Real wood, site-stained to match our 1920s bungalow. The crew was respectful, on time, and the trim work is the cleanest I've seen in twenty years of owning houses.",
      name: "Sara P.",
      place: "Highlands Ranch · Hardwood",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
      photo: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80"
    }
  ];
  let tIdx = 0;
  const render = () => {
    const t = testimonials[tIdx];
    const q = document.querySelector('.t-quote');
    const n = document.querySelector('.t-who .name');
    const p = document.querySelector('.t-who .place');
    const ava = document.querySelector('.t-avatar img');
    const ph = document.querySelector('.t-photo img');
    const c = document.querySelector('.t-count');
    if (!q) return;
    q.textContent = t.quote;
    n.textContent = t.name;
    p.textContent = t.place;
    ava.src = t.avatar;
    ph.src = t.photo;
    c.textContent = String(tIdx + 1).padStart(2, '0') + ' / ' + String(testimonials.length).padStart(2, '0');
  };
  const prev = document.querySelector('.t-prev');
  const next = document.querySelector('.t-next');
  if (prev && next) {
    prev.addEventListener('click', () => { tIdx = (tIdx - 1 + testimonials.length) % testimonials.length; render(); });
    next.addEventListener('click', () => { tIdx = (tIdx + 1) % testimonials.length; render(); });
    render();
  }

  // ---- Form fake submit ----
  const form = document.querySelector('.estimate-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = form.querySelector('.form-foot .note');
      if (note) note.textContent = "✓ Got it — Jorge will reach out within 1 business day.";
    });
  }
})();
