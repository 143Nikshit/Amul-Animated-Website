/**
 * AMUL KOOL - INTERACTIVE SCROLL ANIMATION ENGINE
 * Powered by Lenis, GSAP 3 & HTML5 Canvas
 */

(function () {
  'use strict';

  // --- Configuration ---
  const TOTAL_FRAMES = 240;
  const IMAGES_DIR = 'Aimation_Images';
  const FRAME_PREFIX = 'ezgif-frame-';
  const FRAME_EXT = '.jpg';

  // DOM Elements
  const preloader = document.getElementById('preloader');
  const progressBar = document.getElementById('preloader-progress');
  const progressCounter = document.getElementById('preloader-counter');
  const canvas = document.getElementById('amul-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const siteHeader = document.getElementById('site-header');

  // Narrative Step Elements
  const steps = [
    document.getElementById('step-1'),
    document.getElementById('step-2'),
    document.getElementById('step-3'),
    document.getElementById('step-4')
  ];

  // Image Frame Store
  const frames = [];
  let imagesLoadedCount = 0;
  const animState = { frame: 0 };

  // =========================================================================
  // 1. LENIS SMOOTH SCROLL SETUP
  // =========================================================================
  let lenis;
  function initLenis() {
    if (typeof Lenis === 'undefined') {
      console.warn('Lenis library not loaded. Falling back to native scroll.');
      return;
    }

    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0,
      infinite: false
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  // =========================================================================
  // 2. RESPONSIVE CANVAS SIZING & RENDERING
  // =========================================================================
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    renderFrame(Math.round(animState.frame));
  }

  function renderFrame(index) {
    const safeIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(index)));
    const img = frames[safeIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Cover math: fill canvas while keeping image aspect ratio
    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const sx = (cw - sw) / 2;
    const sy = (ch - sh) / 2;

    ctx.drawImage(img, 0, 0, iw, ih, sx, sy, sw, sh);
  }

  // =========================================================================
  // 3. IMAGE SEQUENCE PRELOADER
  // =========================================================================
  function formatFrameNumber(num) {
    return String(num).padStart(3, '0');
  }

  function preloadImages() {
    return new Promise((resolve) => {
      let resolved = false;

      // Timeout fallback so preloader never hangs indefinitely
      const safetyTimeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          console.warn('Preloader timeout reached; starting experience.');
          completeLoading();
          resolve();
        }
      }, 12000);

      function onImageProgress() {
        imagesLoadedCount++;
        const percent = Math.min(100, Math.round((imagesLoadedCount / TOTAL_FRAMES) * 100));
        if (progressBar) progressBar.style.width = percent + '%';
        if (progressCounter) progressCounter.textContent = percent + '%';

        if (imagesLoadedCount >= TOTAL_FRAMES && !resolved) {
          resolved = true;
          clearTimeout(safetyTimeout);
          setTimeout(() => {
            completeLoading();
            resolve();
          }, 300);
        }
      }

      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        const frameNum = formatFrameNumber(i);
        img.src = `${IMAGES_DIR}/${FRAME_PREFIX}${frameNum}${FRAME_EXT}`;
        img.onload = onImageProgress;
        img.onerror = () => {
          console.warn(`Frame failed to load: ${img.src}`);
          onImageProgress();
        };
        frames.push(img);
      }
    });
  }

  function completeLoading() {
    if (preloader) {
      preloader.classList.add('loaded');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 800);
    }
    resizeCanvas();
    initScrollTimeline();
  }

  // =========================================================================
  // 4. GSAP SCROLLTRIGGER TIMELINE
  // =========================================================================
  function updateStorySteps(progress) {
    // 4 Distinct Narrative Phases:
    // Phase 1 (0.00 - 0.22): Awakening
    // Phase 2 (0.24 - 0.52): Milk Crest Erupts
    // Phase 3 (0.54 - 0.82): Bottle Plunges
    // Phase 4 (0.84 - 1.00): Grand Settled Bottle
    
    steps.forEach((step, idx) => {
      if (!step) return;
      let isActive = false;
      if (idx === 0 && progress < 0.22) isActive = true;
      else if (idx === 1 && progress >= 0.24 && progress < 0.52) isActive = true;
      else if (idx === 2 && progress >= 0.54 && progress < 0.82) isActive = true;
      else if (idx === 3 && progress >= 0.84) isActive = true;

      if (isActive) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  }

  function initScrollTimeline() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not found.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Initial first step active
    updateStorySteps(0);

    // Pin & Scrub the image sequence over the section scroll
    ScrollTrigger.create({
      trigger: '#hero-sequence',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.4,
      onUpdate: (self) => {
        const currentFrame = self.progress * (TOTAL_FRAMES - 1);
        animState.frame = currentFrame;
        renderFrame(currentFrame);
        updateStorySteps(self.progress);
      }
    });

    // Header styling on scroll
    ScrollTrigger.create({
      start: 'top -50',
      end: 99999,
      onUpdate: (self) => {
        if (self.direction === 1 && window.scrollY > 80) {
          siteHeader.classList.add('scrolled');
        } else if (window.scrollY <= 80) {
          siteHeader.classList.remove('scrolled');
        }
      }
    });

    // Reveal animations for Bento and Flavours
    gsap.utils.toArray('.flavour-card').forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        delay: index * 0.1,
        ease: 'power3.out'
      });
    });

    gsap.utils.toArray('.bento-card').forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 35,
        opacity: 0,
        duration: 0.8,
        delay: (index % 3) * 0.12,
        ease: 'power3.out'
      });
    });
  }

  // =========================================================================
  // 5. FLOATING ROSE PETALS CANVAS PARTICLE SYSTEM
  // =========================================================================
  const petalCanvas = document.getElementById('petals-canvas');
  const petalCtx = petalCanvas.getContext('2d');
  let petals = [];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * window.innerWidth;
      this.y = initial ? Math.random() * window.innerHeight : -20;
      this.size = Math.random() * 14 + 10;
      this.speedY = Math.random() * 0.8 + 0.5;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 1.5;
      this.opacity = Math.random() * 0.4 + 0.3;
      this.color = Math.random() > 0.4 ? '#ea2e68' : '#ff9ab6';
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.01) * 0.3;
      this.rotation += this.rotationSpeed;

      if (this.y > window.innerHeight + 20 || this.x < -30 || this.x > window.innerWidth + 30) {
        this.reset();
      }
    }

    draw() {
      petalCtx.save();
      petalCtx.translate(this.x, this.y);
      petalCtx.rotate((this.rotation * Math.PI) / 180);
      petalCtx.globalAlpha = this.opacity;
      petalCtx.fillStyle = this.color;

      petalCtx.beginPath();
      petalCtx.moveTo(0, 0);
      petalCtx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size);
      petalCtx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, 0);
      petalCtx.fill();
      petalCtx.restore();
    }
  }

  function resizePetalCanvas() {
    petalCanvas.width = window.innerWidth;
    petalCanvas.height = window.innerHeight;
  }

  function initPetals() {
    resizePetalCanvas();
    const count = window.innerWidth < 768 ? 16 : 32;
    petals = [];
    for (let i = 0; i < count; i++) {
      petals.push(new Petal());
    }

    function animatePetals() {
      petalCtx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);
      for (const petal of petals) {
        petal.update();
        petal.draw();
      }
      requestAnimationFrame(animatePetals);
    }
    animatePetals();
  }

  // =========================================================================
  // 6. INTERACTIVE 3D CARD TILT
  // =========================================================================
  function initCardTilts() {
    const tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = -(y / (rect.height / 2)) * 8;
        const rotateY = (x / (rect.width / 2)) * 8;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  // =========================================================================
  // 7. SMOOTH LINK JUMPS WITH LENIS
  // =========================================================================
  function initSmoothLinks() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElem = document.querySelector(targetId);
        if (targetElem) {
          e.preventDefault();
          if (lenis) {
            lenis.scrollTo(targetElem, { offset: -20, duration: 1.4 });
          } else {
            targetElem.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }

  // =========================================================================
  // INITIALIZATION
  // =========================================================================
  window.addEventListener('DOMContentLoaded', () => {
    initLenis();
    resizeCanvas();
    initPetals();
    initCardTilts();
    initSmoothLinks();
    preloadImages();
  });

  window.addEventListener('resize', () => {
    resizeCanvas();
    resizePetalCanvas();
  });

})();
