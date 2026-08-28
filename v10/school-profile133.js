const DB='school-engine-v106',VERSION=2,META='meta',PROFILE_KEY='school-profile-v133';
const FIELDS=['schoolName','educationOffice','academicYear','principalName'];
const clean=v=>String(v??'').replace(/\s+/g,' ').trim();

function openDb133(){
 return new Promise((resolve,reject)=>{
  const r=indexedDB.open(DB,VERSION);
  r.onupgradeneeded=()=>{
   const db=r.result;
   if(!db.objectStoreNames.contains('drafts'))db.createObjectStore('drafts',{keyPath:'id'});
   if(!db.objectStoreNames.contains('documents'))db.createObjectStore('documents',{keyPath:'id'});
   if(!db.objectStoreNames.contains('attachments'))db.createObjectStore('attachments',{keyPath:'id'});
   if(!db.objectStoreNames.contains(META))db.createObjectStore(META,{keyPath:'id'});
  };
  r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);
 });
}
async function metaGet133(id){
 const db=await openDb133();return new Promise((resolve,reject)=>{const r=db.transaction(META,'readonly').objectStore(META).get(id);r.onsuccess=()=>resolve(r.result?.value??null);r.onerror=()=>reject(r.error)});
}
async function metaSet133(id,value){
 const db=await openDb133();return new Promise((resolve,reject)=>{const tx=db.transaction(META,'readwrite');tx.objectStore(META).put({id,value,updatedAt:Date.now()});tx.oncomplete=()=>resolve(value);tx.onerror=()=>reject(tx.error)});
}

export function normalizeSchoolProfile133(value={}){
 const out={};for(const key of FIELDS)out[key]=clean(value?.[key]);return out;
}
export function schoolProfileComplete133(value={}){
 const p=normalizeSchoolProfile133(value);return Boolean(p.schoolName&&p.educationOffice&&p.academicYear);
}
export function mergeSchoolProfile133(state,profile,{onlyMissing=true}={}){
 if(!state)return state;state.metadata=state.metadata||{};const p=normalizeSchoolProfile133(profile);
 for(const key of FIELDS){if(!p[key])continue;if(!onlyMissing||!clean(state.metadata[key]))state.metadata[key]=p[key]}
 return state;
}

let cache=null,loading=null;
export async function loadSchoolProfile133(){
 if(cache)return normalizeSchoolProfile133(cache);
 if(typeof indexedDB==='undefined')return normalizeSchoolProfile133({});
 if(!loading)loading=metaGet133(PROFILE_KEY).then(v=>{cache=normalizeSchoolProfile133(v||{});return cache}).catch(()=>normalizeSchoolProfile133({}));
 return normalizeSchoolProfile133(await loading);
}
export async function saveSchoolProfile133(value={}){
 const p=normalizeSchoolProfile133(value);cache=p;if(typeof indexedDB!=='undefined')await metaSet133(PROFILE_KEY,p);return p;
}

function fromPanel133(host){const p={};for(const key of FIELDS)p[key]=host.querySelector(`#${key}`)?.value||'';return normalizeSchoolProfile133(p)}
function setPanelField133(host,key,value){const el=host.querySelector(`#${key}`);if(!el||clean(el.value)||!value)return false;el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}));return true}
function updateSummary133(host){
 const p=fromPanel133(host),complete=schoolProfileComplete133(p),summary=host.querySelector('[data-school-profile-summary133]'),status=host.querySelector('[data-school-profile-status133]'),form=host.querySelector('.formGrid');
 if(summary)summary.textContent=[p.schoolName,p.educationOffice,p.academicYear].filter(Boolean).join(' · ')||'أكمل بيانات المدرسة الأساسية مرة واحدة';
 if(status){status.textContent=complete?'محفوظة للاستخدام القادم':'تحتاج إكمال';status.classList.toggle('ok133',complete)}
 if(form&&host.dataset.profileTouched133!=='1'&&complete){form.hidden=true;host.dataset.profileCollapsed133='1'}
}
function decoratePanel133(host){
 if(host.dataset.schoolProfile133==='1'){updateSummary133(host);return}
 host.dataset.schoolProfile133='1';host.classList.add('schoolProfile133');
 const title=host.querySelector(':scope > small');if(title)title.textContent='بيانات المدرسة';
 const help=host.querySelector(':scope > .questionHelp');if(help)help.textContent='تُحفظ تلقائيًا على هذا الجهاز وتُستخدم في تقارير تحليل النتائج الجديدة. عدّلها فقط عند تغيّرها.';
 const form=host.querySelector('.formGrid');if(form){
  const bar=document.createElement('div');bar.className='schoolProfileBar133';bar.innerHTML='<div><b data-school-profile-summary133></b><span data-school-profile-status133></span></div><button type="button" class="linkBtn" data-school-profile-toggle133>تعديل البيانات</button>';form.before(bar);
  const year=form.querySelector('#academicYear')?.closest('label');if(year){const s=year.querySelector('span');if(s)s.innerHTML='العام الدراسي <b>(يظهر في التقرير)</b>'}
  const principal=form.querySelector('#principalName')?.closest('label');if(principal){const s=principal.querySelector('span');if(s)s.innerHTML='مدير المدرسة <small>(اختياري للاعتماد)</small>'}
 }
 updateSummary133(host);
}
async function hydratePanel133(host){
 decoratePanel133(host);const profile=await loadSchoolProfile133();if(!host.isConnected)return;
 for(const key of FIELDS)setPanelField133(host,key,profile[key]);const current=fromPanel133(host);if(Object.values(current).some(Boolean))saveSchoolProfile133(current).catch(()=>{});updateSummary133(host);
}
function scan133(){if(typeof document==='undefined')return;document.querySelectorAll('.analysisSchoolInfo122').forEach(host=>{if(host.dataset.profileHydrating133==='1')return;host.dataset.profileHydrating133='1';hydratePanel133(host).finally(()=>{if(host.isConnected)delete host.dataset.profileHydrating133})})}

let saveTimer=null;
if(typeof document!=='undefined'){
 document.addEventListener('input',e=>{const host=e.target.closest?.('.analysisSchoolInfo122');if(!host||!FIELDS.includes(e.target.id))return;host.dataset.profileTouched133='1';updateSummary133(host);clearTimeout(saveTimer);saveTimer=setTimeout(()=>saveSchoolProfile133(fromPanel133(host)).catch(()=>{}),220)},true);
 document.addEventListener('click',e=>{const b=e.target.closest?.('[data-school-profile-toggle133]');if(!b)return;const host=b.closest('.analysisSchoolInfo122'),form=host?.querySelector('.formGrid');if(!form)return;host.dataset.profileTouched133='1';form.hidden=!form.hidden;host.dataset.profileCollapsed133=form.hidden?'1':'0';b.textContent=form.hidden?'تعديل البيانات':'إخفاء التفاصيل'},true);
 new MutationObserver(()=>queueMicrotask(scan133)).observe(document.documentElement,{subtree:true,childList:true});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan133,{once:true});else scan133();
 const style=document.createElement('style');style.id='school-profile133-style';style.textContent='.schoolProfile133{border:1px solid #d8e7e1;background:#fbfdfc;border-radius:16px;padding:14px}.schoolProfileBar133{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:10px 0 4px;padding:10px 12px;border-radius:12px;background:#f1f8f5;border:1px solid #dce9e4}.schoolProfileBar133>div{min-width:0;display:flex;flex-direction:column;gap:3px}.schoolProfileBar133 b{font-size:12px;color:#244f44;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.schoolProfileBar133 span{font-size:10px;color:#9a6a12}.schoolProfileBar133 span.ok133{color:#087c5c}.schoolProfile133 .formGrid[hidden]{display:none!important}@media(max-width:650px){.schoolProfileBar133{align-items:stretch;flex-direction:column}.schoolProfileBar133 .linkBtn{align-self:flex-start}}';document.head.appendChild(style);
}
