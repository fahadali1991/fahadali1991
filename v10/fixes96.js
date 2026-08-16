const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
function getMem(k){try{return sessionStorage.getItem(k)||''}catch{return''}}
function setMem(k,v){try{sessionStorage.setItem(k,v)}catch{}}
function rawKey(){const raw=getMem('v94_raw').slice(0,120),subjects=getMem('v94_subjects');return `v96_goals|${raw}|${subjects}`}
function chosen(){return getMem(rawKey()).split('|||').filter(Boolean)}
function saveChosen(a){setMem(rawKey(),[...new Set(a)].join('|||'))}
function showAllDetails(root){const step=$('.familyDetailsStep',root);if(!step)return;$$('.v92More',step).forEach(x=>x.remove());$$('[data-family-pick]',step).forEach(b=>{b.style.display='';b.hidden=false});$$('.v92Tag',step).forEach(x=>x.remove());$$('.familyChoice',step).forEach(g=>g.classList.add('v96AllOptions'))}
function cleanGoals(root){const h=$('h1',root);if(!h||clean(h.textContent)!=='الأهداف')return;const card=h.closest('.card')||root;$$('.v92More,.v94MoreGoals',card).forEach(x=>x.remove());$$('[data-goal]',card).forEach(b=>{b.classList.remove('v95PrimaryGoal');b.style.display='';b.hidden=false});const active=new Set(chosen());$$('[data-goal]',card).forEach(b=>b.classList.toggle('on',active.has(b.dataset.goal)));const lead=$('.lead',card);if(lead)lead.textContent='اختر الهدف أو الأهداف التي تناسب عملك. لا يحدد النظام أي هدف نيابةً عنك.'}
function apply(root){showAllDetails(root);cleanGoals(root)}
export function installFixes96(root=document){document.addEventListener('click',e=>{const g=e.target.closest('[data-goal]');if(!g)return;const v=g.dataset.goal;if(!v)return;let a=chosen();a=a.includes(v)?a.filter(x=>x!==v):[...a,v];saveChosen(a);setTimeout(()=>apply(root),0)},false);new MutationObserver(()=>requestAnimationFrame(()=>apply(root))).observe(root,{childList:true,subtree:true});apply(root)}
