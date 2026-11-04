(()=>{
  'use strict';
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
  const projects=Array.isArray(window.PORTFOLIO_PROJECTS)?window.PORTFOLIO_PROJECTS:[];
  const state={category:'all',search:''};
  let toastTimeout;

  // Theme (preference stored only in the visitor's browser).
  const themeButton=$('.theme-toggle');
  try{if(localStorage.getItem('hassan-theme')==='light')document.documentElement.dataset.theme='light';}catch(_e){}
  const setThemeLabel=()=>{const isLight=document.documentElement.dataset.theme==='light';$('.theme-icon').textContent=isLight?'☾':'☼';themeButton.setAttribute('aria-label',isLight?'Switch to dark theme':'Switch to light theme');};
  setThemeLabel();
  themeButton.addEventListener('click',()=>{const newTheme=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=newTheme;try{localStorage.setItem('hassan-theme',newTheme);}catch(_e){}setThemeLabel();});

  // Mobile navigation.
  const menuButton=$('.menu-toggle'),nav=$('#primary-nav');
  function closeMenu(){nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');}
  menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
  $$('#primary-nav a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  window.addEventListener('resize',()=>{if(window.innerWidth>820)closeMenu();});

  // Scroll progress + active sections.
  function updateScroll(){const max=document.documentElement.scrollHeight-innerHeight;$('.scroll-progress').style.width=`${max>0?100*scrollY/max:0}%`;}
  window.addEventListener('scroll',updateScroll,{passive:true});window.addEventListener('resize',updateScroll);updateScroll();
  if('IntersectionObserver'in window){
    const navObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){$$('#primary-nav a').forEach(link=>link.classList.toggle('active',link.getAttribute('href')==='#'+entry.target.id));}});},{rootMargin:'-20% 0px -65% 0px'});
    $$('main section[id]').forEach(section=>navObserver.observe(section));
  }

  // Education / experience tabs, keyboard accessible.
  const tabs=$$('.journey-tab');
  function selectJourney(id){tabs.forEach(tab=>{const active=tab.dataset.journey===id;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});$$('.journey-panel').forEach(panel=>{panel.hidden=panel.id!==`panel-${id}`;});}
  tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectJourney(tab.dataset.journey));tab.addEventListener('keydown',e=>{if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;e.preventDefault();const delta=e.key==='ArrowRight'?1:-1;const next=tabs[(i+delta+tabs.length)%tabs.length];selectJourney(next.dataset.journey);next.focus();});});
  selectJourney('education');

  // Safely render project cards using DOM text nodes.
  const grid=$('#project-grid'),count=$('#project-count'),empty=$('#project-empty');
  const labelMap={lca:'LCA & Sustainability',circular:'Circularity',materials:'Materials',energy:'Energy',digital:'Data & Modelling',industry:'Industry'};
  function makeEl(tag,className,text){const element=document.createElement(tag);if(className)element.className=className;if(text!==undefined)element.textContent=text;return element;}
  function card(project,index){
    const button=makeEl('button','project-card');button.type='button';button.setAttribute('aria-label',`Explore ${project.title}`);button.addEventListener('click',()=>openModal(project,index));
    const art=makeEl('div','project-art');
    art.style.setProperty('--art-top',project.art[0]);
    art.style.setProperty('--art-bottom',project.art[1]);
    art.style.setProperty('--art-glow',project.art[2]);
    if(project.thumbnail){
      art.classList.add('has-thumbnail');
      const image=makeEl('img','project-thumbnail');
      image.src=project.thumbnail;image.alt='';image.loading='lazy';image.decoding='async';
      image.width=960;image.height=540;
      image.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;';
      art.append(image);
      image.addEventListener('error',()=>{
        art.classList.remove('has-thumbnail');image.remove();
        art.prepend(makeEl('span','project-art-index',String(index+1).padStart(2,'0')));
      },{once:true});
    }else{
      art.append(makeEl('span','project-art-index',String(index+1).padStart(2,'0')));
    }
    art.append(makeEl('span','project-badge',project.label),makeEl('span','project-visual-label','RESEARCH / ENGINEERING'));
    const info=makeEl('div','project-info'),meta=makeEl('div','project-meta');meta.append(makeEl('span','',project.year),makeEl('span','',project.context));
    const title=makeEl('h3','',project.title),desc=makeEl('p','',project.short),bottom=makeEl('div','project-bottom');bottom.append(makeEl('span','',project.tags.slice(0,3).join(' · ')),makeEl('span','','↗'));
    info.append(meta,title,desc,bottom);button.append(art,info);return button;
  }
  function renderProjects(){const filtered=projects.map((p,index)=>({p,index})).filter(({p})=>(state.category==='all'||p.categories.includes(state.category))&&[p.title,p.short,p.summary,p.context,p.year,...p.tags,...p.categories].join(' ').toLowerCase().includes(state.search));
    const fragment=document.createDocumentFragment();filtered.forEach(({p,index})=>fragment.append(card(p,index)));grid.replaceChildren(fragment);count.textContent=`SHOWING ${filtered.length} OF ${projects.length} PROJECTS`;empty.hidden=filtered.length!==0;
  }
  $$('.filter-btn').forEach(button=>button.addEventListener('click',()=>{state.category=button.dataset.filter;$$('.filter-btn').forEach(b=>{const selected=b===button;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});renderProjects();}));
  $('#project-search').addEventListener('input',event=>{state.search=event.target.value.toLowerCase().trim();renderProjects();});
  renderProjects();

  const dialog=$('#project-dialog');const closeDialog=$('.dialog-close');let previousFocus=null;
  function openModal(project,index){previousFocus=document.activeElement;$('#modal-category').textContent=project.label;$('#modal-index').textContent=String(index+1).padStart(2,'0');$('#modal-art').style.background=`radial-gradient(circle at 50% 50%,${project.art[2]},transparent 55%),linear-gradient(135deg,${project.art[0]},${project.art[1]})`;
    $('#modal-meta').textContent=`${project.year}   /   ${project.context}`;$('#modal-title').textContent=project.title;$('#modal-summary').textContent=project.summary;
    const sections=$('#modal-sections');sections.replaceChildren();const highlights=makeEl('section','modal-section');highlights.append(makeEl('h3','','PROJECT HIGHLIGHTS'));const list=makeEl('ul');project.highlights.forEach(item=>list.append(makeEl('li','',item)));highlights.append(list);sections.append(highlights);
    if(project.outcome){const result=makeEl('section','modal-section');result.append(makeEl('h3','','NOTES & OUTCOME'),makeEl('p','',project.outcome));sections.append(result);}
    const tags=$('#modal-tags');tags.replaceChildren();project.tags.forEach(tag=>tags.append(makeEl('span','',tag)));
    document.body.classList.add('modal-open');if(typeof dialog.showModal==='function'){dialog.showModal();}else{dialog.setAttribute('open','');}closeDialog.focus();
  }
  function dismissModal(){if(dialog.open){if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open');}document.body.classList.remove('modal-open');if(previousFocus?.isConnected)previousFocus.focus();}
  closeDialog.addEventListener('click',dismissModal);dialog.addEventListener('click',event=>{if(event.target===dialog)dismissModal();});dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(previousFocus?.isConnected)previousFocus.focus();});
  $('#jump-biodenim').addEventListener('click',()=>{state.category='all';state.search='biodenim';$('#project-search').value='biodenim';$$('.filter-btn').forEach(b=>{const selected=b.dataset.filter==='all';b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});renderProjects();});

  // Exact published-manuscript modelled reduction ranges: Bangladesh 21.8–25.6%; India 32.1–36.6%.
  // Range endpoints vary with the garment-assembly configuration. Conventional electricity is index 100.
  const climateRoutes={
    bangladesh:{min:21.8,max:25.6},
    india:{min:32.1,max:36.6}
  };
  function fmt(n){return Number(n).toFixed(1);}
  function setEnergyScenario(choice){
    const renewable=choice==='renewable';
    const panel=$('#energy-visual');if(!panel)return;
    panel.dataset.scenario=choice;
    $$('.energy-tab').forEach(b=>{
      const selected=b.dataset.energy===choice;
      b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));
    });
    Object.entries(climateRoutes).forEach(([country,values])=>{
      const bar=$('#'+country+'-bar');
      const range=$('#'+country+'-range');
      const label=$('#'+country+'-reduction');
      const context=$('#'+country+'-context');
      const index=$('#'+country+'-index');
      if(renewable){
        const upper=100-values.min,lower=100-values.max;
        bar.style.width=fmt(upper)+'%';
        range.style.left=fmt(lower)+'%';range.style.width=fmt(upper-lower)+'%';
        range.hidden=false;
        label.textContent=fmt(values.min)+'–'+fmt(values.max)+'% lower';
        context.textContent='Renewable-electricity sensitivity';
        index.textContent='Impact index: '+fmt(lower)+'–'+fmt(upper);
      }else{
        bar.style.width='100%';range.style.width='0%';range.hidden=true;
        label.textContent='100 · reference';
        context.textContent='Conventional electricity baseline';
        index.textContent='Impact index: 100';
      }
    });
    $('#scenario-cue').textContent=renewable?'RENEWABLE ELECTRICITY SCENARIO':'CONVENTIONAL ELECTRICITY BASELINE';
    $('#scenario-title').textContent=renewable?'Up to 36.6% lower modelled climate impact':'Conventional electricity is the reference';
    $('#scenario-description').textContent=renewable
      ?'Percentage reductions are relative to each route’s conventional-electricity counterpart. Each country’s range reflects two garment-assembly configurations.'
      :'Each conventional-electricity route is indexed to 100. Select renewable electricity to see the modelled percentage reduction for Bangladesh- and India-linked routes.';
  }
  $$('.energy-tab').forEach(b=>b.addEventListener('click',()=>setEnergyScenario(b.dataset.energy)));
  setEnergyScenario('renewable');

  // Toast + copy email (works on HTTPS and modern localhost browsers).
  function toast(message){const box=$('#toast');box.textContent=message;box.classList.add('visible');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>box.classList.remove('visible'),3000);}
  $('#copy-email').addEventListener('click',async()=>{const email='engr.hassaniftikhar@gmail.com';try{await navigator.clipboard.writeText(email);toast('Email copied to clipboard');}catch(_error){toast(`Email: ${email}`);}});
  $('#current-year').textContent=String(new Date().getFullYear());

  // Subtle section entrances; not applied without JS or when motion is reduced.
  if('IntersectionObserver'in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const targets=$$('.about-layout,.section-heading,.awards-grid,.skills-grid,.conference-strip,.impact-layout');const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});},{threshold:.07});targets.forEach(target=>{target.classList.add('reveal');observer.observe(target);});}
})();
