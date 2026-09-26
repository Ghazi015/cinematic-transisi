gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ==========================================
   0. IMAGE ASSETS CONFIG
   ========================================== */
const IMG = {
  polaroid: "https://ibb.co"
};

/* ==========================================
   1. LENIS SMOOTH SCROLL FOR TOUCH DEVICES
   ========================================== */
let lenis = null;
if (!REDUCED && typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 1.15,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: true,          
    syncTouchLerp: 0.075,
    touchMultiplier: 1.7
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ==========================================
   2. GENERATE FLYING POLAROIDS 3D VALUE
   ========================================== */
const FLY = [
  { x: -0.55, y: -0.55, r: -30, s: 3.6, d: 0.00 },
  { x:  0.60, y: -0.40, r:  25, s: 3.1, d: 0.12 },
  { x: -0.45, y:  0.60, r: -20, s: 3.4, d: 0.24 },
  { x:  0.65, y:  0.45, r:  34, s: 2.8, d: 0.36 },
  { x: -0.15, y: -0.70, r: -14, s: 4.0, d: 0.48 },
  { x:  0.30, y:  0.75, r:  18, s: 3.2, d: 0.60 },
  { x: -0.75, y:  0.05, r: -38, s: 2.6, d: 0.72 }
];

const flyLayer = document.getElementById('flyLayer');
FLY.forEach((f, i) => {
  const el = document.createElement('div');
  el.className = 'fly-polaroid';
  el.innerHTML = `
    <div class="fp-img">
      <img src="${IMG.polaroid}" alt="Kenangan ${i + 1}" loading="lazy">
    </div>
    <span class="fp-line"></span>`;
  flyLayer.appendChild(el);
});
const flyEls = gsap.utils.toArray('.fly-polaroid');

/* ==========================================
   3. GENERATE ASYMMETRIC INJECT COLECTION
   ========================================== */
const MEMORIES = [
  { cap: "Senja di Ujung Jalan",   loc: "JAKARTA · 2021",      cls: "col-span-2 aspect-[4/3]",  pos: "50% 38%", rot: -1.4 },
  { cap: "Kopi Kedua",             loc: "BANDUNG · 2022",      cls: "col-span-1 aspect-[3/4]",  pos: "42% 30%", rot:  1.8 },
  { cap: "Hujan Bulan Juni",       loc: "YOGYAKARTA · 2020",   cls: "col-span-1 aspect-[3/4]",  pos: "58% 55%", rot: -2.2 },
  { cap: "Jalan Sore",             loc: "BALI · 2023",         cls: "col-span-1 aspect-square", pos: "35% 60%", rot:  2.4 },
  { cap: "Tawa di Loteng",         loc: "SEMARANG · 2019",     cls: "col-span-1 aspect-square", pos: "62% 42%", rot: -1.6 },
  { cap: "Cahaya Pukul Lima",      loc: "LABUAN BAJO · 2024",  cls: "col-span-2 aspect-[16/10]",pos: "50% 62%", rot:  1.1 },
  { cap: "Ruang Tunggu",           loc: "SURABAYA · 2022",     cls: "col-span-1 aspect-[3/4]",  pos: "45% 48%", rot: -2.6 },
  { cap: "Langit yang Sama",       loc: "FLORES · 2023",       cls: "col-span-1 aspect-[3/4]",  pos: "55% 28%", rot:  1.5 },
  { cap: "Pulang",                 loc: "RUMAH · 2025",        cls: "col-span-2 aspect-[4/3]",  pos: "50% 45%", rot: -1.2 }
];

const grid = document.getElementById('grid');
MEMORIES.forEach((m) => {
  const item = document.createElement('div');
  item.className = `g-item ${m.cls}`;
  item.innerHTML = `
    <div class="g-card" style="--rot:${m.rot}deg">
      <img src="${IMG.polaroid}" alt="${m.cap}" loading="lazy" style="object-position:${m.pos}">
      <div class="g-cap">
        <p>${m.cap}</p>
        <span>${m.loc}</span>
      </div>
    </div>`;
  grid.appendChild(item);
});

/* Tap Active Trigger */
const gItems = gsap.utils.toArray('.g-item');
gItems.forEach(item => {
  item.addEventListener('click', () => {
    const wasActive = item.classList.contains('active');
    gItems.forEach(el => el.classList.remove('active'));
    if (!wasActive) item.classList.add('active');
  });
});

/* ==========================================
   4. SCROLLTRIGGER CINEMATIC ORCHESTRATION
   ========================================== */
const heroTl = gsap.timeline({
  scrollTrigger: {
    trigger: '#hero', start: 'top top', end: '+=420%',
    scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true
  }
});

/* PHASE 1: Fade out Intro Narration */
heroTl
  .to('#introText', { opacity: 0, y: -70, duration: 1.4, ease: 'power1.in' }, 0)
  .to('#scrollHint', { opacity: 0, duration: 0.6, ease: 'power1.out' }, 0)
  .to('#shelfLayer', { scale: 2.3, duration: 6, ease: 'power2.in' }, 0)
  .to('#shelfDim', { opacity: 0.82, duration: 6, ease: 'power1.in' }, 0)

/* PHASE 2: Zoom Book to Center Viewport */
  .fromTo('#book',
    { scale: 0.62, yPercent: 26, rotateX: 18 },
    { scale: 1.02, yPercent: 0, rotateX: 0, duration: 4.2, ease: 'power2.out' },
    0.4)

/* PHASE 3: Book Glow and Hinge Open */
  .to('#bookGlow', { opacity: 0.9, duration: 1.6, ease: 'power2.out' }, 5.2)
  .to('#book', { scale: 1.3, duration: 1.8, ease: 'power2.inOut' }, 5.2)
  .to('#bookCover', { rotateY: -168, duration: 1.8, ease: 'power3.inOut' }, 5.4)

/* PHASE 4: Explosive Screen Flash Transition */
  .to('#flash', { opacity: 1, duration: 0.12, ease: 'power2.in' }, 7.10)
  .to('#flash', { opacity: 0, duration: 0.55, ease: 'power2.out' }, 7.24);

/* PHASE 5: Flying Polaroid Shoot past Camera */
flyEls.forEach((el, i) => {
  const f = FLY[i % FLY.length];
  const start = 7.30 + f.d;

  heroTl.fromTo(el,
    { x: 0, y: 0, scale: 0.05, opacity: 0, rotate: 0, transformOrigin: '50% 50%' },
    {
      x: () => window.innerWidth  * f.x,
      y: () => window.innerHeight * f.y,
      scale: f.s, rotate: f.r, opacity: 1, duration: 2.4, ease: 'power1.in'
    },
    start);
});

/* PHASE 6: Dim Down to Reveal Gallery Section */
heroTl.to('#veil', { opacity: 0.94, duration: 1.6, ease: 'power1.inOut' }, 10.30);

/* GRID CONTENT STAGGER REVEAL */
gItems.forEach((item, i) => {
  gsap.fromTo(item,
    { y: 62, opacity: 0, scale: 0.96 },
    {
      y: 0, opacity: 1, scale: 1, duration: 1.05, ease: 'power3.out',
      scrollTrigger: { trigger: item, start: 'top 92%', toggleActions: 'play none none reverse' },
      delay: (i % 3) * 0.06
    });
});

/* GENERAL TEXT REVEAL UP */
gsap.utils.toArray('.reveal-up').forEach((el, i) => {
  gsap.fromTo(el,
    { y: 38, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: (i % 3) * 0.07,
      scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none reverse' }
    });
});

window.addEventListener('load', () => { ScrollTrigger.refresh(); if (lenis) lenis.resize(); });
