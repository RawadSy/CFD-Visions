const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
let W = window.innerWidth, H = window.innerHeight;
canvas.width = W; canvas.height = H;

// Tube parameters
const tube = {x:W/2, y:H/2, R:80};

// Load logo image
const logoImg = new Image();
logoImg.src = "assets/logo.png";

// Particles for streamlines
let particles = [];
let N = 800, U = 120;

function initParticles(){
    particles = [];
    for(let i=0;i<N;i++){
        particles.push({x:-Math.random()*300,y:Math.random()*H, px:0, py:0});
    }
}
initParticles();

// Velocity field around cylinder (potential flow approx)
function velField(x,y){
    const dx = x - tube.x;
    const dy = y - tube.y;
    const r2 = dx*dx + dy*dy;
    const R2 = tube.R*tube.R;
    let vx = U, vy = 0;
    if(r2<R2) return {vx:0,vy:0};
    const r = Math.sqrt(r2);
    const theta = Math.atan2(dy,dx);
    const Vr = U*(1 - R2/r2)*Math.cos(theta);
    const Vt = -U*(1 + R2/r2)*Math.sin(theta);
    vx = Vr*Math.cos(theta) - Vt*Math.sin(theta);
    vy = Vr*Math.sin(theta) + Vt*Math.cos(theta);
    return {vx,vy};
}

function speedColor(v){
    const vmax = U*2;
    const s = Math.min(v/vmax,1);
    const r = Math.floor(255*s);
    const g = Math.floor(100*(1-s));
    const b = Math.floor(255*(1-s));
    return `rgba(${r},${g},${b},0.8)`;
}

function drawTube(){
    // Draw tube
    ctx.beginPath();
    ctx.fillStyle="rgba(80,80,80,0.9)";
    ctx.arc(tube.x,tube.y,tube.R,0,Math.PI*2);
    ctx.fill();

    // Draw logo at center
    if(logoImg.complete){
        const logoSize = tube.R*1.2;
        ctx.drawImage(logoImg, tube.x - logoSize/2, tube.y - logoSize/2, logoSize, logoSize);
    }
}

function animate(){
    ctx.fillStyle="rgba(0,0,0,0.15)";
    ctx.fillRect(0,0,W,H);

    drawTube();

    for(let p of particles){
        p.px = p.x;
        p.py = p.y;
        const v = velField(p.x,p.y);
        p.x += v.vx*0.02 + (Math.random()-0.5)*5;
        p.y += v.vy*0.02 + (Math.random()-0.5)*5;
        const speed = Math.hypot(v.vx,v.vy);
        ctx.beginPath();
        ctx.strokeStyle = speedColor(speed);
        ctx.moveTo(p.px,p.py);
        ctx.lineTo(p.x,p.y);
        ctx.stroke();
        if(p.x>W+50||p.x<-100||p.y>H+50||p.y<-50) {
            p.x = -Math.random()*300;
            p.y = Math.random()*H;
        }
    }
    requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize",()=>{
    W=canvas.width=window.innerWidth;
    H=canvas.height=window.innerHeight;
    tube.x=W/2; tube.y=H/2;
    initParticles();
});

// Controls
document.getElementById("uInc").addEventListener("click",()=>{U+=10;});
document.getElementById("uDec").addEventListener("click",()=>{U=Math.max(10,U-10);});
document.getElementById("nInc").addEventListener("click",()=>{N+=100; initParticles();});
document.getElementById("nDec").addEventListener("click",()=>{N=Math.max(100,N-100); initParticles();});
