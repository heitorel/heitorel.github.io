async function loadResume() {
  const res = await fetch('assets/data/resume.json');
  if (!res.ok) throw new Error('Não consegui carregar assets/data/resume.json');
  return res.json();
}
function el(id){ return document.getElementById(id); }
function pill(text){ const s=document.createElement('span'); s.className='pill'; s.textContent=text; return s; }
function setText(id, text){ const e=el(id); if(e) e.textContent = text; }
function setHref(id, href){ const e=el(id); if(e && href) e.href = href; }
function renderHighlights(list){
  const c = document.getElementById('highlights'); if(!c) return;
  c.innerHTML='';
  (list||[]).forEach(h=>{
    const card=document.createElement('div');
    card.className='stat';
    card.innerHTML=`<div class="stat-num">${h.label}</div><div class="stat-sub">${h.sub}</div>`;
    c.appendChild(card);
  });
}
function renderSkillsGroups(groups){
  const c = document.getElementById('skills-groups'); if(!c) return;
  c.innerHTML='';
  Object.entries(groups||{}).forEach(([group, items])=>{
    const card=document.createElement('div'); card.className='group-card';
    const title=document.createElement('div'); title.className='section-sub'; title.style.fontWeight='700'; title.textContent=group;
    const wrap=document.createElement('div'); wrap.className='flex flex-wrap gap-2 mt-2';
    (items||[]).forEach(i=> wrap.appendChild(pill(i)));
    card.appendChild(title); card.appendChild(wrap); c.appendChild(card);
  });
}
function renderExperience(list){
  const c=el('experience'); if(!c) return; c.innerHTML='';
  (list||[]).forEach(exp=>{
    const w=document.createElement('div'); w.className='relative pl-10';
    const dot=document.createElement('div'); dot.className='dot'; w.appendChild(dot);
    const h=document.createElement('h4'); h.className='font-semibold';
    h.innerHTML = `${exp.role} • <span class="muted">${exp.company}</span>`;
    const p=document.createElement('p'); p.className='period'; p.textContent = exp.period + (exp.location? ` • ${exp.location}`: '');
    const ul=document.createElement('ul'); ul.className='mt-2 list-disc pl-5'; ul.style.color='var(--emphasis)';
    (exp.bullets||[]).forEach(b=>{ const li=document.createElement('li'); li.textContent=b; ul.appendChild(li); });
    w.appendChild(h); w.appendChild(p); w.appendChild(ul); c.appendChild(w);
  });
}
function renderEducation(list){
  const c=el('education'); if(!c) return; c.innerHTML='';
  (list||[]).forEach(ed=>{
    const div=document.createElement('div');
    div.innerHTML = `<div class="font-semibold">${ed.degree}</div>
    <div class="period">${ed.institution} • ${ed.period}${ed.location? ' • '+ed.location:''}</div>`;
    c.appendChild(div);
  });
}
function renderLanguages(list){
  const c=el('languages'); if(!c) return; c.innerHTML='';
  (list||[]).forEach(l=>{
    const div=document.createElement('div'); div.className='period'; div.textContent = `${l.name} — ${l.level}`; c.appendChild(div);
  });
}

(async ()=>{
  try{
    const cv = await loadResume();
    setText('dev-name', cv.name);
    setText('card-name', cv.name);
    setText('footer-name', cv.name);
    setText('dev-role', cv.role);
    setText('card-role', cv.role);
    setText('dev-tagline', cv.tagline);
    setText('dev-location', '📍 ' + (cv.location||''));
    setText('dev-phone', cv.phone||'');
    setHref('email-link', 'mailto:' + (cv.email||''));
    setHref('email-link2', 'mailto:' + (cv.email||''));
    setHref('whatsapp-link', cv.whatsapp||'#');
    setHref('whatsapp-link2', cv.whatsapp||'#');
    setHref('github-link', cv.github||'#');
    setHref('linkedin-link', cv.linkedin||'#');
    document.getElementById('year').textContent = new Date().getFullYear();
    document.getElementById('about-text').textContent = cv.about||'';
    renderHighlights(cv.highlights);
    renderSkillsGroups(cv.skills||{});
    renderExperience(cv.experience);
    renderEducation(cv.education);
    renderLanguages(cv.languages);
  }catch(e){ console.error(e); }
})();
(function () {
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');

  // estado inicial: localStorage > preferência do SO > dark por padrão do seu HTML
  const stored = localStorage.getItem('theme');
  if (stored === 'light') {
    root.classList.remove('dark');
    btn && (btn.textContent = '☀️');
  } else if (stored === 'dark') {
    root.classList.add('dark');
    btn && (btn.textContent = '🌙');
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      root.classList.add('dark');
      btn && (btn.textContent = '🌙');
    } else {
      root.classList.remove('dark');
      btn && (btn.textContent = '☀️');
    }
  }

  // clique -> alterna classe e salva preferência
  btn?.addEventListener('click', () => {
    const isDark = root.classList.toggle('dark');
    btn.textContent = isDark ? '🌙' : '☀️';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
})();