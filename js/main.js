/* ============================================================
   JOSEPHMARK.STUDIO — MAIN.JS
   - Custom cursor
   - Slide-out nav menu
   - Work card hover videos
   - Intersection observer fade-ins
   - Video autoplay on enter viewport
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── CUSTOM CURSOR ────────────────────────────────────────
  const cursor = document.createElement('div');
  cursor.classList.add('cursor');
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  document.querySelectorAll('a, button, .work-type-pill, .news-card-link, .btn-pill').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('expanded'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('expanded'));
  });


  // ── SLIDE-OUT MENU ────────────────────────────────────────
  const menuBtn = document.getElementById('menu-btn');
  const slideNav = document.getElementById('slide-nav');
  const navOverlay = document.getElementById('nav-overlay');
  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    slideNav.classList.add('open');
    navOverlay.classList.add('open');
    menuBtn.textContent = 'Close';
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuOpen = false;
    slideNav.classList.remove('open');
    navOverlay.classList.remove('open');
    menuBtn.textContent = 'Menu';
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
  navOverlay.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });


  // ── HERO VIDEO — fade in when loaded ─────────────────────
  const heroVideo = document.getElementById('hero-video');
  if (heroVideo) {
    const onLoaded = () => heroVideo.classList.add('loaded');
    heroVideo.addEventListener('loadeddata', onLoaded);
    if (heroVideo.readyState >= 2) onLoaded();
  }


  // ── ABOUT VIDEO — autoplay on intersect ──────────────────
  const aboutVideo = document.getElementById('about-video');
  if (aboutVideo) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          aboutVideo.play();
          aboutVideo.classList.add('loaded');
        } else {
          aboutVideo.pause();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(aboutVideo);
  }


  // ── WORK CARDS — hover video play/pause ──────────────────
  document.querySelectorAll('.work-card').forEach(card => {
    const video = card.querySelector('.work-card-video');
    const img = card.querySelector('.work-card-img');

    if (!video) return;

    card.addEventListener('mouseenter', () => {
      video.play().catch(() => {}); // catch autoplay policy errors
      video.style.opacity = '1';
      if (img) img.style.opacity = '0';
    });

    card.addEventListener('mouseleave', () => {
      video.pause();
      video.style.opacity = '0';
      if (img) img.style.opacity = '1';
    });
  });


  // ── INTERSECTION OBSERVER — general fade-ins ─────────────
  const fadeTargets = document.querySelectorAll('.work-card, .news-card, .client-logo');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  fadeTargets.forEach(el => fadeObserver.observe(el));


  // ── NEWS VIDEOS — autoplay when in viewport ───────────────
  document.querySelectorAll('.news-card-media video, .news-card-media img').forEach(media => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          media.classList.add('loaded');
          if (media.tagName === 'VIDEO') media.play().catch(() => {});
          io.unobserve(media);
        }
      });
    }, { threshold: 0.2 });
    io.observe(media);
  });


  // ── HUBSPOT NEWSLETTER SIGNUP ─────────────────────────────
  const HS_PORTAL  = '244284755';
  const HS_FORM    = '361c4ca5-f338-414b-960d-9c602bba56ce';
  const HS_ENDPOINT = `https://api.hsforms.com/submissions/v3/integration/submit/${HS_PORTAL}/${HS_FORM}`;

  function submitToHubSpot(email) {
    return fetch(HS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: [{ name: 'email', value: email }],
        context: { pageUri: window.location.href, pageName: document.title }
      })
    });
  }

  function showSuccess(btn, input) {
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9l4 4 8-8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    btn.style.opacity = '1';
    input.value = '';
  }

  // Footer mailing form (all pages)
  const mailingForm = document.getElementById('mailing-form');
  if (mailingForm) {
    mailingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = mailingForm.querySelector('input');
      const btn   = mailingForm.querySelector('button');
      if (!input.value) return;
      submitToHubSpot(input.value).finally(() => showSuccess(btn, input));
    });
  }

  // Contact page inline newsletter
  const contactNewsletterBtn   = document.getElementById('contact-newsletter-btn');
  const contactNewsletterInput = document.getElementById('contact-newsletter-input');
  if (contactNewsletterBtn && contactNewsletterInput) {
    contactNewsletterBtn.addEventListener('click', () => {
      if (!contactNewsletterInput.value) return;
      submitToHubSpot(contactNewsletterInput.value).finally(() => showSuccess(contactNewsletterBtn, contactNewsletterInput));
    });
  }

});
