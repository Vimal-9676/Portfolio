/* ══════════════════════════════════════════════════
   VIMAL YADAV — PORTFOLIO SCRIPT
   ══════════════════════════════════════════════════ */

"use strict";

/* ─── Typed.js ──────────────────────────────────── */
const typed = new Typed("#typed-element", {
  strings: [
    "Software Developer",
    "Web Developer",
    "Data Analyst",
    "AI Enthusiast",
    "Problem Solver",
  ],
  typeSpeed: 60,
  backSpeed: 40,
  backDelay: 1400,
  loop: true,
  cursorChar: "|",
});

/* ─── Custom Cursor ─────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + "px";
    dot.style.top  = mouseY + "px";
  });

  // Smooth ring follow
  function followRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + "px";
    ring.style.top  = ringY + "px";
    requestAnimationFrame(followRing);
  }
  followRing();

  // Hover state on interactive elements
  const hoverEls = document.querySelectorAll(
    "a, button, .skill-pill, .project-card, .timeline-item, .social-icon, .csoc"
  );
  hoverEls.forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("hovered"));
    el.addEventListener("mouseleave", () => ring.classList.remove("hovered"));
  });
})();

/* ─── Scroll Progress Bar ───────────────────────── */
(function initScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;
  window.addEventListener("scroll", () => {
    const docH   = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / docH) * 100;
    bar.style.width = scrolled + "%";
  });
})();

/* ─── Navbar Scroll Class ───────────────────────── */
(function initNavbar() {
  const nav = document.getElementById("navbar");
  if (!nav) return;
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  });

  // Active link highlight
  const sections = document.querySelectorAll("section[id]");
  const navLinks  = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
  });
})();

/* ─── Mobile Menu ───────────────────────────────── */
(function initMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const menu   = document.getElementById("mobileMenu");
  const links  = document.querySelectorAll(".mob-link");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  links.forEach((l) => l.addEventListener("click", () => menu.classList.remove("open")));
})();

/* ─── Particle Canvas ───────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W, H, particles = [], mouse = { x: -9999, y: -9999 };
  const COUNT     = 90;
  const MAX_DIST  = 130;
  const MOUSE_RAD = 160;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // Track mouse relative to canvas
  canvas.closest("section").addEventListener("mousemove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  canvas.closest("section").addEventListener("mouseleave", () => {
    mouse.x = -9999; mouse.y = -9999;
  });

  // Create particles
  function createParticles() {
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        r:  Math.random() * 2.5 + 1,
      });
    }
  }
  createParticles();

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update + draw dots
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Mouse attraction
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < MOUSE_RAD) {
        p.vx += (dx / d) * 0.04;
        p.vy += (dy / d) * 0.04;
        // Clamp speed
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 2.5) { p.vx /= speed / 2.5; p.vy /= speed / 2.5; }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,255,136,0.7)";
      ctx.fill();
    });

    // Draw lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a  = particles[i];
        const b  = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          const alpha = (1 - d / MAX_DIST) * 0.4;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0,255,136,${alpha})`;
          ctx.lineWidth   = 1;
          ctx.stroke();
        }
      }

      // Lines to mouse
      const p  = particles[i];
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < MOUSE_RAD) {
        const alpha = (1 - d / MOUSE_RAD) * 0.6;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(0,255,136,${alpha})`;
        ctx.lineWidth   = 1;
        ctx.stroke();
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─── Intersection Observer (reveal animations) ── */
(function initReveal() {
  const els = document.querySelectorAll(
    ".reveal-up, .reveal-left, .reveal-right"
  );
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((el) => obs.observe(el));
})();

/* ─── Skill Bar Animations ──────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll(".sb-fill");
  if (!bars.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.width = e.target.dataset.width + "%";
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  bars.forEach((b) => obs.observe(b));
})();

/* ─── Drag-Scroll Projects Carousel ─────────────── */
(function initDragScroll() {
  const carousel = document.getElementById("projectsCarousel");
  if (!carousel) return;

  let isDown   = false;
  let startX   = 0;
  let scrollL  = 0;

  carousel.addEventListener("mousedown", (e) => {
    isDown  = true;
    startX  = e.pageX - carousel.offsetLeft;
    scrollL = carousel.scrollLeft;
    carousel.classList.add("active");
  });
  carousel.addEventListener("mouseleave", () => { isDown = false; });
  carousel.addEventListener("mouseup",    () => { isDown = false; });
  carousel.addEventListener("mousemove",  (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.6;
    carousel.scrollLeft = scrollL - walk;
  });
})();

/* ─── Card Tilt Effect ──────────────────────────── */
(function initTilt() {
  const cards = document.querySelectorAll("[data-tilt]");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width  / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -8;
      const rotY = ((x - cx) / cx) *  8;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
})();

/* ─── Magnetic Buttons ──────────────────────────── */
(function initMagnetic() {
  const magnets = document.querySelectorAll(".magnetic");
  magnets.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width  / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      el.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
})();

/* ─── Contact Form ──────────────────────────────── */
(function initContactForm() {
  const form    = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector(".form-submit");
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending…';
    btn.disabled  = true;

    // Simulate send (replace with real endpoint if needed)
    setTimeout(() => {
      form.reset();
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.disabled  = false;
      if (success) {
        success.style.display = "flex";
        success.style.alignItems = "center";
        success.style.gap = ".5rem";
        setTimeout(() => { success.style.display = "none"; }, 4000);
      }
    }, 1500);
  });
})();

/* ─── Hero entrance ─────────────────────────────── */
(function heroEntrance() {
  const items = document.querySelectorAll(".hero-content .reveal-up");
  items.forEach((el, i) => {
    setTimeout(() => el.classList.add("in-view"), 200 + i * 120);
  });
})();
