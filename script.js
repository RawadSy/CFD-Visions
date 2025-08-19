// streamlines demo — corrected and debug-friendly
if(nSlider){ nSlider.addEventListener('input', ()=>{ resetParticles(); }); }


function speedColor(v){
const vmax = Math.max(1, U * 2.0);
const s = Math.max(0, Math.min(1, v / vmax));
const r = Math.floor(255 * Math.max(0, (s - 0.5) * 2));
const g = Math.floor(255 * (1 - Math.abs(s - 0.5) * 2));
const b = Math.floor(255 * Math.max(0, (0.5 - s) * 2));
return `rgba(${r},${g},${b},0.92)`;
}


function insideAnyCylinder(x,y){
for(const c of cylinders){ const dx = x - c.x, dy = y - c.y; if(dx*dx + dy*dy < Math.pow(c.R * 0.98, 2)) return true; } return false;
}


// animation loop
let last = performance.now();
function frame(now){
const dt = Math.min(0.033, (now - last) / 1000);
last = now;


// slight fade for trails
ctx.fillStyle = 'rgba(0,0,0,0.12)';
ctx.fillRect(0,0,W,H);


// draw cylinders
ctx.save();
for(const c of cylinders){
ctx.beginPath(); ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.arc(c.x,c.y,c.R,0,Math.PI*2); ctx.fill();
ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1; ctx.stroke();
}
ctx.restore();


// update particles
ctx.lineWidth = 1;
for(let p of parts){
const v = velField(p.x, p.y);
const speed = Math.hypot(v.vx, v.vy);
// small jitter to create many streamlines
const jx = (Math.random() - 0.5) * 8;
const jy = (Math.random() - 0.5) * 8;
const nx = p.x + (v.vx + jx) * dt;
const ny = p.y + (v.vy + jy) * dt;


// respawn conditions: out of bounds or inside solid
if(nx > W + 60 || ny > H + 60 || nx < -120 || ny < -60 || insideAnyCylinder(nx, ny)){
Object.assign(p, seedParticle());
continue;
}


ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny);
ctx.strokeStyle = speedColor(speed);
ctx.stroke();


p.px = p.x; p.py = p.y; p.x = nx; p.y = ny; p.life++;
if(p.life > 2000) Object.assign(p, seedParticle());
}


requestAnimationFrame(frame);
}


requestAnimationFrame(frame);


// helpful debug hook
window.__CFD = { resetParticles, setupScene, parts, cylinders };


})();