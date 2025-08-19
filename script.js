/* ===========================
   Language switch (EN / RU)
=========================== */
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('lang') || 'ru';
  switchLang(saved);
  document.getElementById('langEN').addEventListener('click', () => switchLang('en'));
  document.getElementById('langRU').addEventListener('click', () => switchLang('ru'));
});

/* ===========================
   Shell-and-Tube Background
   Professional streamline-style visualization:
   - Shell-side crossflow (cool colors)
   - Tube-side axial flow inside tubes (hot colors)
=========================== */
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d', { alpha: true });
let W, H, DPR;

function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = canvas.width = Math.floor(window.innerWidth * DPR);
  H = canvas.height = Math.floor(window.innerHeight * DPR);
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
}
resize();
window.addEventListener('resize', resize);

/* Tube bundle layout (hexagonal pitch) */
const tubes = [];
(function buildTubes(){
  const pitch = 90;                 // px in CSS pixels (we scale by DPR)
  const radius = 26;                // tube radius (CSS px)
  const cols = Math.ceil(window.innerWidth / pitch) + 2;
  const rows = Math.ceil(window.innerHeight / pitch) + 2;
  for (let j=0; j<rows; j++){
    for (let i=0; i<cols; i++){
      const offset = (j % 2) ? pitch/2 : 0;
      const x = (i*pitch + offset);
      const y = (j*pitch);
      // place only within viewport margin
      if (x>-pitch && x<window.innerWidth+pitch && y>-pitch && y<window.innerHeight+pitch){
        tubes.push({
          x: x*DPR,
          y: y*DPR,
          R: radius*DPR
        });
      }
    }
  }
})();

/* Particles: shell & tube */
const shellParticles = [];
const tubeParticles  = [];
const NSHELL = 1400;
const NTUBE  = 700;

function rand(min,max){ return Math.random()*(max-min)+min; }

function initParticles(){
  shellParticles.length = 0;
  tubeParticles.length = 0;
  for (let i=0;i<NSHELL;i++){
    shellParticles.push({
      x: rand(0,W), y: rand(0,H),
      vx: 0, vy: 0,
      life: rand(0, 200),
      hue: 195 + Math.random()*40, // cool cyan/blue
      size: rand(0.8, 1.6)*DPR
    });
  }
  for (let i=0;i<NTUBE;i++){
    const t = tubes[(i*7) % tubes.length]; // distribute
    const r = Math.sqrt(Math.random()) * (t.R*0.9);
    const a = Math.random()*Math.PI*2;
    tubeParticles.push({
      x: t.x + r*Math.cos(a),
      y: t.y + r*Math.sin(a),
      tube: t,
      vx: 0, vy: 0,
      life: rand(0, 200),
      hue: 20 + Math.random()*50, // hot orange/red
      size: rand(0.9, 1.8)*DPR
    });
  }
}
initParticles();

/* Potential-like deflection around cylinders for shell-side flow */
function shellVelocity(x,y){
  // Base crossflow upwards (approx shell crossflow)
  let Ux = 0.0, Uy = -0.70; // CSS px/frame in device pixels
  // Superimpose deflection due to cylinders (potential flow approx)
  for (let k=0;k<tubes.length;k++){
    const t = tubes[k];
    const dx = x - t.x;
    const dy = y - t.y;
    const r2 = dx*dx + dy*dy;
    const R2 = t.R*t.R;
    // If near cylinder, apply potential-flow correction
    if (r2 < (R2*9)){                      // limit influence radius
      const r = Math.sqrt(r2) + 1e-3;
      const cos = dx / r;
      const sin = dy / r;
      // Uniform flow along +y (upwards): transform from classic formula
      // u_r = U(1 - a^2/r^2)cos(theta) ; u_theta = -U(1 + a^2/r^2)sin(theta)
      const a2r2 = (R2 / r2);
      const U = 1.0;                       // relative strength
      const u_r = U * (1 - a2r2) * sin;    // because main flow along +y ⇒ swap roles
      const u_t = -U * (1 + a2r2) * cos;
      // Convert to Cartesian (rotated)
      const ux = u_r * cos - u_t * (-sin);
      const uy = u_r * sin + u_t * cos;
      Ux += 0.35 * ux;
      Uy += 0.35 * uy;
    }
  }
  return {vx: Ux*DPR, vy: Uy*DPR};
}

/* Tube-side axial flow: inside each tube move left→right */
function tubeVelocity(p){
  // Parabolic profile across tube radius for realism
  const t = p.tube;
  const dx = p.x - t.x;
  const dy = p.y - t.y;
  const r = Math.sqrt(dx*dx + dy*dy);
  const R = t.R*0.95;
  const factor = Math.max(0, 1 - (r*r)/(R*R)); // 1 at center, 0 at wall
  const vmax = 1.6*DPR; // axial speed
  return {vx: vmax*factor, vy: 0};
}

/* Render tubes (subtle outlines + thermal ring) */
function drawTubes(){
  ctx.save();
  for (const t of tubes){
    // thermal rim (hot)
    const grad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, t.R*1.05);
    grad.addColorStop(0, 'rgba(255,128,0,0.35)');
    grad.addColorStop(1, 'rgba(255,128,0,0.0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.R*1.05, 0, Math.PI*2);
    ctx.fill();

    // tube border
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = Math.max(1, 1.2*DPR);
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.R, 0, Math.PI*2);
    ctx.stroke();
  }
  ctx.restore();
}

/* Animation loop with motion trails */
let last = 0;
function frame(ts){
  if (!last) last = ts;
  const dt = Math.min(32, ts - last); // ms
  last = ts;

  // fade old frame to create streaks
  ctx.fillStyle = 'rgba(10,12,18,0.18)';
  ctx.fillRect(0,0,W,H);

  // draw tubes
  drawTubes();

  // update & draw shell particles
  ctx.globalCompositeOperation = 'lighter';
  for (const p of shellParticles){
    const v = shellVelocity(p.x, p.y);
    p.vx = v.vx; p.vy = v.vy;
    p.x += p.vx; p.y += p.vy;

    // wrap around edges
    if (p.y < -10) { p.y = H + 10; p.x = (p.x + 80) % W; }
    if (p.y > H + 10) { p.y = -10; }
    if (p.x < -10) p.x = W + 10;
    if (p.x > W + 10) p.x = -10;

    // avoid inside tubes (shell flow stays outside)
    for (const t of tubes){
      const dx = p.x - t.x, dy = p.y - t.y;
      if (dx*dx + dy*dy < (t.R*t.R)){
        // push particle outside slightly
        const r = Math.sqrt(dx*dx + dy*dy) + 1e-3;
        p.x = t.x + dx/r * (t.R + 2);
        p.y = t.y + dy/r * (t.R + 2);
      }
    }

    // color cool (cyan/blue)
    ctx.fillStyle = `hsla(${p.hue}, 95%, 60%, 0.55)`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
    ctx.fill();
  }

  // update & draw tube particles
  for (const p of tubeParticles){
    const v = tubeVelocity(p);
    p.x += v.vx; p.y += v.vy;

    // keep inside the tube cross-section
    const t = p.tube;
    const dx = p.x - t.x, dy = p.y - t.y;
    const r = Math.sqrt(dx*dx + dy*dy);
    if (r > t.R*0.98){
      // reflect slightly inward
      const nx = dx / (r+1e-6), ny = dy / (r+1e-6);
      p.x = t.x + nx * (t.R*0.98);
      p.y = t.y + ny * (t.R*0.98);
    }

    // loop horizontally (simulate long tube)
    if (p.x > t.x + t.R*0.98) {
      p.x = t.x - t.R*0.98; // re-enter from left
    }

    // color hot (orange/red)
    ctx.fillStyle = `hsla(${p.hue}, 100%, 55%, 0.65)`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
    ctx.fill();
  }

  ctx.globalCompositeOperation = 'source-over';
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ===========================
   Lightbox (click-to-zoom)
=========================== */
const galleryImages = Array.from(document.querySelectorAll('#galleryGrid img'));
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
const lbClose = document.getElementById('lbClose');
let lbIndex = 0;

function openLB(i){
  lbIndex = i;
  lbImg.src = galleryImages[lbIndex].src;
  lb.classList.add('open');
  lb.setAttribute('aria-hidden','false');
}
function closeLB(){
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden','true');
  lbImg.src = '';
}
function prevLB(){ lbIndex = (lbIndex - 1 + galleryImages.length) % galleryImages.length; lbImg.src = galleryImages[lbIndex].src; }
function nextLB(){ lbIndex = (lbIndex + 1) % galleryImages.length; lbImg.src = galleryImages[lbIndex].src; }

galleryImages.forEach((img,i)=> img.addEventListener('click', ()=>openLB(i)));
lbClose.addEventListener('click', closeLB);
lbPrev.addEventListener('click', prevLB);
lbNext.addEventListener('click', nextLB);
lb.addEventListener('click', (e)=>{ if (e.target === lb) closeLB(); });
document.addEventListener('keydown', (e)=>{
  if(!lb.classList.contains('open')) return;
  if(e.key==='Escape') closeLB();
  if(e.key==='ArrowLeft') prevLB();
  if(e.key==='ArrowRight') nextLB();
});
