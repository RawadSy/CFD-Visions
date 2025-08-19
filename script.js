const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
let W = window.innerWidth, H = window.innerHeight;
canvas.width = W; canvas.height = H;

// Tube parameters
const tube = {x:W/2, y:H/2, R:80};

// Logo inside tube
const logoImg = new Image();
logoImg.src = "assets/logo.png";

// Streamline particles
let particles = [];
let N = 800; // number of streamlines
let U = 120; // speed

function initParticles(){
    particles = [];
    for(let i=0;i<N;i++){
        particles.push({
            x: -Math.random()*300,
            y: Math.random()*H,
            px:0,
            py:0
        });
    }
}
initParticles();

// Velocity field
function velField(x,y){
    const dx = x - tube.x;
    const dy = y - tube.y;
    const r2 = dx*dx + dy*dy;
    const R2 = tube.R*tube.R;
    let vx = U, vy = 0;
    if(r2<R2) return {vx:0, vy:0};
    const r = Math.sqrt(r2);
    const theta = Math.atan2(dy, dx);
    const Vr = U*(1 - R2/r2)*Math.cos(theta);
    const Vt = -U*(1 + R2/r2)*Math.sin(theta);
    vx = Vr*Math.cos(theta) - Vt*Math.sin(theta);
    vy = Vr*Math.sin(theta) + Vt*Math.cos(theta);
    return {vx,vy};
}

// Heat gradient color
function tempColor(x,y){
    const dx = x - tube.x;
    const dy = y - tube.y;
    const r = Math.sqrt(dx*dx + dy*dy);
    const maxR = Math.max(W,H)/2;
    const t = Math.min(r/maxR,1);
    const rC = Math.floor(255*(1-t));
    const bC = Math.floor(255*t);
    const gC = 50;
    return `rgba(${rC},${gC},${bC},0.8)`;
}

// Draw tube + logo
function drawTube(){
    ctx.beginPath();
    ctx.fillStyle="rgba(80,80,80,0.9)";
    ctx.arc(tube.x,tube.y,tube.R,0,Math.PI*2);
    ctx.fill();
    if(logoImg.complete){
        const logoSize = tube.R*1.2;
        ctx.drawImage(logoImg, tube.x-logoSize/2, tube.y-logoSize/2, logoSize, logoSize);
    }
}

// Animate
function animate(){
    ctx.fillStyle="rgba(0,0,0,0.15)";
    ctx.fillRect(0,0,W,H);

    drawTube();

    for(let p of particles){
        p.px = p.x;
        p.py = p.y;
        const v = velField(p.x,p.y);
        p.x += v.vx*0.02 + (Math.random()-0.5)*3;
        p.y += v.vy*0.02 + (Math.random()-0.5)*3;

        ctx.beginPath();
        ctx.strokeStyle = tempColor(p.x,p.y);
        ctx.moveTo(p.px,p.py);
        ctx.lineTo(p.x,p.y);
        ctx.stroke();

        if(p.x>W+50 || p.x<-100 || p.y>H+50 || p.y<-50){
            p.x = -Math.random()*300;
            p.y = Math.random()*H;
        }
    }
    requestAnimationFrame(animate);
}
animate();

// Resize
window.addEventListener("resize", ()=>{
    W=canvas.width=window.innerWidth;
    H=canvas.height=window.innerHeight;
    tube.x=W/2; tube.y=H/2;
    initParticles();
});

// Show sections
function showSection(id){
    const allSections = document.querySelectorAll('#sections-container .page-section');
    allSections.forEach(sec => sec.style.display="none");
    const section = document.getElementById(id);
    if(section){
        section.style.display="block";
        section.scrollIntoView({behavior:"smooth"});
    }
    if(typeof applyTranslations === "function"){ applyTranslations(); }
}

// Controls sidebar
document.addEventListener('DOMContentLoaded', ()=>{
    const controlDiv = document.createElement('div');
    controlDiv.style.position='fixed';
    controlDiv.style.top='100px';
    controlDiv.style.right='20px';
    controlDiv.style.background='rgba(0,0,0,0.5)';
    controlDiv.style.padding='10px';
    controlDiv.style.borderRadius='10px';
    controlDiv.style.zIndex=2000;
    controlDiv.style.color='white';
    controlDiv.innerHTML=`
        <p style="margin:0;font-weight:bold;">Flow Controls</p>
        <button id="uInc">+ Speed</button>
        <button id="uDec">- Speed</button>
        <button id="nInc">+ Lines</button>
        <button id="nDec">- Lines</button>
        <p>Speed: <span id="speedVal">${U}</span></p>
        <p>Lines: <span id="linesVal">${N}</span></p>
    `;
    document.body.appendChild(controlDiv);

    document.getElementById("uInc").addEventListener("click", ()=>{
        U += 10;
        document.getElementById("speedVal").textContent=U;
    });
    document.getElementById("uDec").addEventListener("click", ()=>{
        U = Math.max(10,U-10);
        document.getElementById("speedVal").textContent=U;
    });
    document.getElementById("nInc").addEventListener("click", ()=>{
        N += 100; initParticles(); document.getElementById("linesVal").textContent=N;
    });
    document.getElementById("nDec").addEventListener("click", ()=>{
        N = Math.max(100,N-100); initParticles(); document.getElementById("linesVal").textContent=N;
    });
});
