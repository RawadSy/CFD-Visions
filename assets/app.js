(() => {
  const $$=(s,r=document)=>[...r.querySelectorAll(s)], $=(s,r=document)=>r.querySelector(s);
  function setLang(lang){
    if(!['ru','en'].includes(lang)) lang='ru';
    document.documentElement.lang=lang;
    localStorage.setItem('deebflow-lang',lang);
    $$('[data-ru]').forEach(el=>{const v=el.getAttribute('data-'+lang);if(v!==null) el.innerHTML=v});
    $$('[data-placeholder-ru]').forEach(el=>{const v=el.getAttribute('data-placeholder-'+lang);if(v!==null) el.placeholder=v});
    $$('[data-src-ru]').forEach(el=>{const v=el.getAttribute('data-src-'+lang); if(v!==null && el.getAttribute('src')!==v) el.setAttribute('src',v)});
    $$('[data-full-ru]').forEach(el=>{const v=el.getAttribute('data-full-'+lang); if(v!==null) el.dataset.full=v});
    $$('[data-poster-ru]').forEach(el=>{const v=el.getAttribute('data-poster-'+lang); if(v!==null) el.setAttribute('poster',v)});
    $$('[data-lang]').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
    const t=$('[data-title-ru]'); if(t) document.title=t.getAttribute('data-title-'+lang);
  }
  const saved=localStorage.getItem('deebflow-lang');
  setLang(saved || (navigator.language?.startsWith('ru')?'ru':'en'));
  $$('[data-lang]').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));
  const mt=$('.mobile-toggle'), nav=$('.nav');
  mt?.addEventListener('click',()=>nav.classList.toggle('open'));
  $$('a',nav||document).forEach(a=>a.addEventListener('click',()=>nav?.classList.remove('open')));

  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.11});
  $$('.reveal').forEach(x=>io.observe(x));

  const lb=$('.lightbox');
  if(lb){const img=$('img',lb), vid=$('video',lb);const close=()=>{lb.classList.remove('open');img.removeAttribute('src');vid.pause();vid.removeAttribute('src')};
    $$('.lightbox-close',lb).forEach(b=>b.addEventListener('click',close));
    lb.addEventListener('click',e=>{if(e.target===lb)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    $$('[data-lightbox]').forEach(el=>el.addEventListener('click',()=>{const src=el.dataset.full||el.currentSrc||el.src||$('img,video',el)?.dataset.full||$('img,video',el)?.src;if(!src)return;const isVid=/\.(mp4|mov|webm)(\?|$)/i.test(src);if(isVid){img.style.display='none';vid.style.display='block';vid.src=src;vid.play().catch(()=>{})}else{vid.style.display='none';img.style.display='block';img.src=src}lb.classList.add('open')}));
  }

  $$('.tilt').forEach(card=>{
    card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(1100px) rotateY(${x*3}deg) rotateX(${-y*3}deg)`});
    card.addEventListener('mouseleave',()=>card.style.transform='');
  });

  const c=$('#flowCanvas');
  if(c){const ctx=c.getContext('2d');let w,h,dpr,pts=[];function resize(){dpr=Math.min(devicePixelRatio||1,2);w=c.clientWidth;h=c.clientHeight;c.width=w*dpr;c.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);pts=Array.from({length:34},(_,i)=>({x:Math.random()*w,y:h*(.18+Math.random()*.64),v:.28+Math.random()*.55,a:Math.random()*Math.PI*2,amp:8+Math.random()*38,alpha:.06+Math.random()*.13}))}function draw(){ctx.clearRect(0,0,w,h);for(const p of pts){p.x+=p.v;if(p.x>w+80)p.x=-80;const y=p.y+Math.sin(p.x*.009+p.a)*p.amp;ctx.beginPath();for(let i=0;i<125;i+=5){const xx=p.x-i;const yy=p.y+Math.sin(xx*.009+p.a)*p.amp; i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy)}const g=ctx.createLinearGradient(p.x-125,y,p.x,y);g.addColorStop(0,'rgba(66,123,255,0)');g.addColorStop(1,`rgba(90,210,255,${p.alpha})`);ctx.strokeStyle=g;ctx.lineWidth=1;ctx.stroke()}requestAnimationFrame(draw)}resize();addEventListener('resize',resize);draw()}
})();
