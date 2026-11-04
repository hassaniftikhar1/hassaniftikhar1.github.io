/* Interactive research-studio enhancements. No data sent to a server. */
(() => {
  'use strict';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const hero = document.querySelector('#interactive-visual');
  const orbit = document.querySelector('#orbit-system');
  const canvas = document.querySelector('#network-canvas');
  const glow = document.querySelector('.cursor-glow');
  const ring = document.querySelector('.cursor-ring');

  // A restrained custom cursor halo with hover states; native cursor remains available.
  if (finePointer && !prefersReducedMotion) {
    let x = innerWidth / 2, y = innerHeight / 2, followX = x, followY = y;
    let hasMoved = false;
    document.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      x = e.clientX; y = e.clientY; hasMoved = true;
      glow.style.opacity = '.8'; ring.style.opacity = '1';
      glow.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    }, {passive:true});
    document.addEventListener('pointerover', e => {
      const interactive = e.target.closest('a,button,input,.project-card');
      ring.classList.toggle('on-link', !!interactive);
    }, {passive:true});
    function animateRing() {
      if (hasMoved) {
        followX += (x - followX) * .19; followY += (y - followY) * .19;
        ring.style.transform = `translate3d(${followX}px, ${followY}px, 0) translate(-50%, -50%)`;
      }
      requestAnimationFrame(animateRing);
    }
    requestAnimationFrame(animateRing);
  }

  // Hero particle field responds to cursor proximity, connecting LCA / AI / circularity nodes.
  if (canvas && hero && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const pointer = {x:-1000, y:-1000};
      let w = 1, h = 1, particles = [], running = true;
      const rand = (a,b) => a + Math.random()*(b-a);
      function resize() {
        const rect = hero.getBoundingClientRect();
        w = Math.max(1,Math.round(rect.width)); h = Math.max(1,Math.round(rect.height));
        const dpr = Math.min(window.devicePixelRatio || 1,2);
        canvas.width = Math.round(w*dpr); canvas.height = Math.round(h*dpr);
        canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
        ctx.setTransform(dpr,0,0,dpr,0,0);
        const count = Math.min(55,Math.max(23,Math.round(w*h/8300)));
        particles = Array.from({length:count},()=>({x:rand(5,w-5),y:rand(5,h-5),vx:rand(-.14,.14),vy:rand(-.14,.14),r:rand(.8,2.1)}));
      }
      function draw() {
        if (!running) return;
        ctx.clearRect(0,0,w,h);
        const light = document.documentElement.dataset.theme === 'light';
        for (let i=0;i<particles.length;i++) {
          const p=particles[i],dx=p.x-pointer.x,dy=p.y-pointer.y,dist=Math.hypot(dx,dy);
          if (dist<125 && dist>2) { const force=(1-dist/125)*.33; p.vx+=dx/dist*force; p.vy+=dy/dist*force; }
          p.vx*=.978;p.vy*=.978;p.x+=p.vx;p.y+=p.vy;
          if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;
          p.x=Math.max(0,Math.min(w,p.x));p.y=Math.max(0,Math.min(h,p.y));
          ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=light?'rgba(35,105,88,.47)':'rgba(153,245,195,.55)';ctx.fill();
          for(let j=i+1;j<particles.length;j++){
            const q=particles[j],sep=Math.hypot(p.x-q.x,p.y-q.y);
            if(sep<112){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=light?`rgba(36,123,96,${.16*(1-sep/112)})`:`rgba(138,243,207,${.22*(1-sep/112)})`;ctx.lineWidth=.85;ctx.stroke();}
          }
          const cursorDist=Math.hypot(p.x-pointer.x,p.y-pointer.y);
          if(cursorDist<145){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(pointer.x,pointer.y);ctx.strokeStyle=`rgba(185,255,130,${.26*(1-cursorDist/145)})`;ctx.stroke();}
        }
        requestAnimationFrame(draw);
      }
      hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();pointer.x=e.clientX-r.left;pointer.y=e.clientY-r.top;
        if (finePointer && orbit) { const mx=(pointer.x/w-.5),my=(pointer.y/h-.5);orbit.style.transform=`perspective(800px) rotateY(${mx*10}deg) rotateX(${-my*9}deg) translate3d(${mx*7}px,${my*7}px,0)`; }
      },{passive:true});
      hero.addEventListener('pointerleave',()=>{pointer.x=-1000;pointer.y=-1000;if(orbit)orbit.style.transform='';},{passive:true});
      window.addEventListener('resize',resize,{passive:true});
      document.addEventListener('visibilitychange',()=>{if(document.hidden)running=false;else if(!running){running=true;requestAnimationFrame(draw);}});
      resize();requestAnimationFrame(draw);
    }
  }

  // Headline focus typing: conveys method, not claims of a deployed AI system.
  const phraseEl = document.querySelector('#typed-focus');
  const phrases = ['life cycle assessment','circular materials','responsible AI','decarbonisation','urban mining'];
  if(phraseEl && !prefersReducedMotion){
    let idx=0, letter=phrases[0].length, deleting=false, tick=0;
    const type=()=>{
      const phrase=phrases[idx];
      if(!deleting && letter<phrase.length) letter++;
      else if (deleting && letter>0) letter--;
      phraseEl.textContent=phrase.slice(0,letter);
      let delay=deleting?36:75;
      if(letter===phrase.length&&!deleting){deleting=true;delay=1800;}
      else if(letter===0&&deleting){deleting=false;idx=(idx+1)%phrases.length;delay=330;}
      tick=window.setTimeout(type,delay);
    };
    tick=window.setTimeout(()=>{deleting=true;type();},2200);
    window.addEventListener('pagehide',()=>clearTimeout(tick));
  }

  // Project tiles reveal a light field that follows pointer position (event delegation
  // also supports cards recreated by search and category filtering).
  const projectGrid = document.querySelector('#project-grid');
  if (projectGrid && finePointer && !prefersReducedMotion) {
    projectGrid.addEventListener('pointermove', e => {
      const card = e.target.closest('.project-card');
      if (!card) return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX-r.left)/r.width;
      const py = (e.clientY-r.top)/r.height;
      card.style.setProperty('--mx', `${Math.round(px*100)}%`);
      card.style.setProperty('--my', `${Math.round(py*100)}%`);
      card.style.setProperty('--rx', `${(0.5-py)*2.3}deg`);
      card.style.setProperty('--ry', `${(px-0.5)*2.3}deg`);
    }, {passive:true});
    projectGrid.addEventListener('pointerout', e => {
      const card = e.target.closest('.project-card');
      if (card && !card.contains(e.relatedTarget)) {
        card.style.removeProperty('--rx');card.style.removeProperty('--ry');
      }
    }, {passive:true});
  }

  // Magnetic CTA movement; element returns to origin on pointer exit.
  if(finePointer && !prefersReducedMotion){
    document.querySelectorAll('.magnetic').forEach(el=>{
      el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();const dx=(e.clientX-(r.left+r.width/2))/r.width;const dy=(e.clientY-(r.top+r.height/2))/r.height;el.style.transform=`translate(${dx*10}px,${dy*9}px)`;},{passive:true});
      el.addEventListener('pointerleave',()=>el.style.transform='');
    });
  }
})();
