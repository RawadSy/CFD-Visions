// streamlines demo — side-buttons to change U and streamline count


// scene: cylinders
let cylinders = [];
function setupScene(){
cylinders = [];
const cx = W*0.5, cy = H*0.5; const scale = Math.min(W,H);
if(MODE === 'cylinder'){
const R = 0.14 * scale; cylinders.push({x:cx,y:cy,R});
} else {
const cols = 6, rows = 5; const pitch = 0.08 * scale; const R = 0.028 * scale; const x0 = W*0.28, y0 = H*0.30;
for(let j=0;j<rows;j++) for(let i=0;i<cols;i++){ const offset = (j%2===0)?0:pitch*0.5; cylinders.push({x:x0 + i*pitch*1.15 + offset, y:y0 + j*pitch, R}); }
}
}
setupScene();


// velocity field (uniform + potential approx around cylinders)
function velField(x,y){
let vx = U, vy = 0;
for(const c of cylinders){
const dx = x - c.x, dy = y - c.y; const r2 = dx*dx + dy*dy; const r = Math.sqrt(r2) + 1e-9; const a2 = c.R*c.R;
if(r < c.R*0.6){ const k = (c.R - r)/c.R; vx += (dx/r)*300*k; vy += (dy/r)*300*k; continue; }
const cosT = dx/r, sinT = dy/r;
const Vr = U * cosT * (1 - a2/Math.max(r2,1e-6));
const Vt = -U * sinT * (1 + a2/Math.max(r2,1e-6));
const vxc = Vr * cosT - Vt * sinT;
const vyc = Vr * sinT + Vt * cosT;
vx += (vxc - U); vy += (vyc - 0);
}
return {vx, vy};
}


// particles
let parts = [];
function seedParticle(){ const pad = 30; const y = Math.random() * H; const x = -pad - Math.random() * 300; return {x,y,px:x,py:y,life:0}; }
function resetParticles(){ parts = []; for(let i=0;i<Math.max(50, N); i++) parts.push(seedParticle()); }
resetParticles();


function insideAnyCylinder(x,y){ for(const c of cylinders){ const dx = x-c.x, dy = y-c.y; if(dx*dx + dy*dy < Math.pow(c.R*0.98,2)) return true; } return false; }


function speedColor(v){ const vmax = Math.max(1, U*2.0); const s = Math.max(0, Math.min(1, v/vmax)); const r = Math.floor(255 * Math.max(0,(s-0.5)*2)); const g = Math.floor(255 * (1 - Math.abs(s-0.5)*2)); const b = Math.floor(255 * Math.max(0,(0.5-s)*2)); return `rgba(${r},${g},${b},0.95)`; }


// animation
let last = performance.now();
function frame(now){
const dt = Math.min(0.033, (now - last)/1000); last = now;
ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(0,0,W,H);
// cylinders
ctx.save(); for(const c of cylinders){ ctx.beginPath(); ctx.fillStyle='rgba(255,255,255,0.06)'; ctx.arc(c.x,c.y,c.R,0,Math.PI*2); ctx.fill(); ctx.strokeStyle='rgba(255,255,255,0.12)'; ctx.lineWidth=1; ctx.stroke(); } ctx.restore();
// update particles
ctx.lineWidth = 1;
for(let p of parts){
const v = velField(p.x, p.y);
const speed = Math.hypot(v.vx, v.vy);
const jx = (Math.random()-0.5) * 8; const jy = (Math.random()-0.5) * 8;
const nx = p.x + (v.vx + jx) * dt; const ny = p.y + (v.vy + jy) * dt;
if(nx > W+60 || ny > H+60 || nx < -120 || ny < -60 || insideAnyCylinder(nx, ny)){ Object.assign(p, seedParticle()); continue; }
ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny); ctx.strokeStyle = speedColor(speed); ctx.stroke();
p.x = nx; p.y = ny; p.life++; if(p.life > 2000) Object.assign(p, seedParticle());
}
requestAnimationFrame(frame);
}
requestAnimationFrame(frame);


// expose controls for debugging
window.__CFD = { resetParticles, setupScene, parts, cylinders, setU: v => { U = v; if(uSlider) uSlider.value = v; }, setN: v => { N = v; if(nSlider) nSlider.value = v; resetParticles(); } };
})();