/* ============ JM FLOORING · v1 · interactions ============ */

(function() {
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
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
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
    ba.addEventListener('pointermove', (e) => {
      if (active) setPos(e.clientX);
    });
    ba.addEventListener('pointerup', () => { active = false; });
    ba.addEventListener('pointercancel', () => { active = false; });

    // chip switching
    const after = ba.querySelector('.ba-after');
    document.querySelectorAll('.ba-text .chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.ba-text .chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const v = chip.dataset.variant;
        after.className = 'ba-after ba-after-' + v;
      });
    });
  }

  // ---- Marquee duplicate ----
  const track = document.querySelector('.marquee-track');
  if (track) {
    track.innerHTML = track.innerHTML + track.innerHTML;
  }

  // ---- Smooth anchor offset for sticky nav ----
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
})();
