import {analysisOutputModel132,analysisOutputPreview132 as basePreview132,analysisOutputPanel132 as basePanel132,bindAnalysisOutput132 as baseBind132} from './analysis-output132.js?v=132';
import {analysisCountConsistency116} from './analysis-data113.js?v=120.1';

const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
const esc=v=>clean(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const guardMarker='<section class="bundleGuard132"><b>ضبط الاستنتاج</b>';

function releaseExtras132(state){
 const consistency=analysisCountConsistency116(state),parts=[];
 if(['missing','extra','invalid'].includes(consistency.status))parts.push(`<section class="bundleCountWarn132 analysisPrintWarn116"><b>تحقق من اكتمال الدرجات</b><span>${esc(consistency.message)}</span></section>`);
 const principal=clean(state?.metadata?.principalName),executor=clean(state?.metadata?.executorName);
 if(principal||executor)parts.push(`<section class="bundleApproval132 analysisApproval113"><div><span>إعداد / تنفيذ</span><b>${esc(executor||'—')}</b></div><div><span>اعتماد مدير المدرسة</span><b>${esc(principal||'—')}</b></div></section>`);
 return parts.join('');
}

function decorate132(state,html){
 if(!html||html.includes('data-v132-release-extras'))return html;
 const extras=releaseExtras132(state);if(!extras)return html;
 return html.replace(guardMarker,`<div data-v132-release-extras>${extras}</div>${guardMarker}`);
}

export {analysisOutputModel132};
export function analysisOutputPreview132(state){return decorate132(state,basePreview132(state))}
export function analysisOutputPanel132(state){return decorate132(state,basePanel132(state))}

let current=null,observer=null,patching=false;
function patchDom132(){
 if(patching||!current||typeof document==='undefined')return;patching=true;
 try{
  const page=document.querySelector('.analysisBundlePages132 .analysisPage132');if(!page||page.querySelector('[data-v132-release-extras]'))return;
  const guard=page.querySelector('.bundleGuard132');if(!guard)return;
  const extras=releaseExtras132(current);if(!extras)return;
  guard.insertAdjacentHTML('beforebegin',`<div data-v132-release-extras>${extras}</div>`);
 }finally{patching=false}
}
export function bindAnalysisOutput132(state){
 current=state;baseBind132(state);
 if(typeof document==='undefined')return;
 if(!observer){observer=new MutationObserver(()=>queueMicrotask(patchDom132));observer.observe(document.documentElement,{subtree:true,childList:true})}
 queueMicrotask(patchDom132)
}

if(typeof document!=='undefined'&&!document.getElementById('analysis-output132-release-style')){
 const s=document.createElement('style');s.id='analysis-output132-release-style';s.textContent=`.bundleCountWarn132{display:flex;gap:2mm;align-items:flex-start;padding:2.4mm 3mm;border:1px solid #e7c989;background:#fff8e8;border-radius:3mm;font-size:7pt;line-height:1.5}.bundleCountWarn132 b{color:#8a620f;white-space:nowrap}.bundleCountWarn132 span{color:#65583d}.bundleApproval132{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:3mm;border:1px solid #dce7e3;border-radius:3mm;padding:2.5mm 3mm;background:#fbfdfc}.bundleApproval132>div{text-align:center;min-height:10mm}.bundleApproval132 span{display:block;color:#71817d;font-size:6.5pt;margin-bottom:1.2mm}.bundleApproval132 b{font-size:8pt;color:#274d44}@media(max-width:650px){.bundleApproval132{grid-template-columns:1fr 1fr}.bundleCountWarn132{display:block}.bundleCountWarn132 b{display:block;margin-bottom:2px}}`;
 document.head.appendChild(s)
}
