// Simple section router + canvas background + year
function showSection(id) {
  document.querySelectorAll(".page-section").forEach(s => s.style.display = "none");
  const el = document.getElementById(id);
  if (el) el.style.display = "block";
  window.location.hash = id;
}
(function initRouter() {
  const id = location.hash?.replace("#","") || "about";
  showSection(id);
})();

document.getElementById("year").textContent = new Date().getFullYear();

// Minimal animated background
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
let w, h, t = 0;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();
function loop() {
  t += 0.003;
  ctx.clearRect(0,0,w,h);
  for (let i=0;i<70;i++){
    const x = (Math.sin(t+i)*0.5+0.5)*w;
    const y = (Math.cos(t*1.3+i)*0.5+0.5)*h;
    const r = 1.2 + (Math.sin(t*2+i)*1.2+1.2)*2.5;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,0.08)`;
    ctx.fill();
  }
  requestAnimationFrame(loop);
}
loop();
