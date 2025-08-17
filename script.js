// Background animation
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth; canvas.height = window.innerHeight;
let particles = [];
const numParticles = 120;

function init() {
  particles = [];
  for (let i=0;i<numParticles;i++) {
    particles.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,vx:(Math.random()-0.5)*1.2,vy:(Math.random()-0.5)*1.2,size:Math.random()*2+1,hue:Math.random()*360});
  }
}
function animate() {
  ctx.fillStyle="rgba(0,0,0,0.15)"; ctx.fillRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{
    ctx.beginPath();
    ctx.fillStyle=`hsl(${p.hue},100%,50%)`;
    ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0||p.x>canvas.width) p.vx*=-1;
    if(p.y<0||p.y>canvas.height) p.vy*=-1;
    p.hue+=0.5;
  });
  requestAnimationFrame(animate);
}
window.addEventListener("resize",()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight;init();});
init(); animate();

// Lightbox
const lightbox=document.getElementById("lightbox");
const lightboxImg=lightbox.querySelector("img");
document.querySelectorAll(".gallery-grid img").forEach(img=>{
  img.addEventListener("click",()=>{lightbox.style.display="flex"; lightboxImg.src=img.src;});
});
lightbox.addEventListener("click",()=>{lightbox.style.display="none";});
