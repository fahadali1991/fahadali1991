import {finiteNumber120,latinDigits120} from './input-normalization120.js?v=120.1';
const clean=v=>String(v??'').trim();
let current=null,bound=false,observer=null;
const analysis=s=>{s.metadata=s.metadata||{};s.metadata.analysis=s.metadata.analysis||{};return s.metadata.analysis};
const maxScore=s=>finiteNumber120(analysis(s).maxScore);
const percentNumber=v=>finiteNumber120(latinDigits120(v).replace(/[٪%]/g,'').trim());
function modeOf(s){
 const a=analysis(s),hasPct=clean(a.masteryPercent)!=='';
 if(a.criterionMode134==='none'&&hasPct&&a.criterionSource131==='user')return a.criterionMode134='percent';
 if(['percent','score','none'].includes(a.criterionMode134))return a.criterionMode134;
 if(clean(a.criterionScore134))return a.criterionMode134='score';
 if(hasPct)return a.criterionMode134='percent';
 return a.criterionMode134='none';
}
function percentText(v){const n=finiteNumber120(v);return n===null?'':String(Number(n.toFixed(2))).replace('.', '٫')}
function targetSummary(s){const a=analysis(s),mode=modeOf(s),max=maxScore(s),pct=finiteNumber120(a.masteryPercent),score=finiteNumber120(a.criterionScore134);if(mode==='score'&&score!==null&&max)return`${score} من ${max}${pct!==null?` (${Number(pct.toFixed(1))}٪)`:''}`;if(mode==='percent'&&pct!==null)return`${Number(pct.toFixed(1))}٪`;return'غير محدد'}
function signature(s){const a=analysis(s);return[modeOf(s),maxScore(s)??'',finiteNumber120(a.masteryPercent)??'',clean(a.criterionScore134)].join('|')}
export function targetLevelDisplay134(state){return targetSummary(state)}
function panel(s){const a=analysis(s),mode=modeOf(s),max=maxScore(s),pct=finiteNumber120(a.masteryPercent),score=clean(a.criterionScore134),sig=signature(s);return`<section class="analysisTarget134" data-analysis-target134 data-target-sig134="${sig}"><div><b>مستوى الإتقان المستهدف <small>(اختياري)</small></b><p>حدده فقط إذا كان للاختبار مستوى مستهدف واضح. يمكنك إدخاله كنسبة أو كدرجة.</p></div><div class="analysisTargetModes134"><button type="button" class="${mode==='percent'?'on':''}" data-target-mode134="percent">نسبة مئوية</button><button type="button" class="${mode==='score'?'on':''}" data-target-mode134="score">درجة</button><button type="button" class="${mode==='none'?'on':''}" data-target-mode134="none">غير محدد</button></div>${mode==='percent'?`<label><span>النسبة المستهدفة</span><div class="analysisTargetInput134"><input type="text" inputmode="decimal" data-target-percent134 value="${pct===null?'':percentText(pct)}" placeholder="مثال: 70 أو 70٪"><b>٪</b></div></label>`:''}${mode==='score'?`<label><span>الدرجة المستهدفة</span><div class="analysisTargetInput134"><input type="text" inputmode="decimal" data-target-score134 value="${score}" placeholder="مثال: 16"><b>من ${max||'الدرجة العظمى'}</b></div>${score&&max?`<small class="analysisTargetCalc134">تعادل ${finiteNumber120(score)!==null?Number((finiteNumber120(score)/max*100).toFixed(1)):'—'}٪</small>`:''}</label>`:''}<div class="analysisTargetSummary134">المعتمد في هذا التحليل: <b>${targetSummary(s)}</b></div></section>`}
function originalInput(){return document.querySelector('[data-analysis-mastery120]')}
function commitPct(value){
 if(!current)return;
 const a=analysis(current),input=originalInput();
 a.masteryPercent=value===null?'':String(value);
 a.criterionSource131=value===null?'none':'user';
 if(input){input.value=a.masteryPercent;input.dispatchEvent(new Event('input',{bubbles:true}))}
 document.dispatchEvent(new CustomEvent('analysis-target-change134',{bubbles:true}));
}
function syncPanelText(){
 if(!current||typeof document==='undefined')return;
 document.querySelectorAll('[data-analysis-target134]').forEach(box=>{
  box.dataset.targetSig134=signature(current);
  const summary=box.querySelector('.analysisTargetSummary134 b');if(summary)summary.textContent=targetSummary(current);
  const calc=box.querySelector('.analysisTargetCalc134');
  if(calc){const a=analysis(current),score=finiteNumber120(a.criterionScore134),max=maxScore(current);calc.textContent=score!==null&&max?`تعادل ${Number((score/max*100).toFixed(1))}٪`:''}
 });
}
function setMode(mode){if(!current)return;const a=analysis(current);a.criterionMode134=mode;if(mode==='none'){a.criterionScore134='';commitPct(null)}else if(mode==='percent'){a.criterionScore134='';if(!clean(a.masteryPercent))commitPct(null)}else if(mode==='score'){const max=maxScore(current),score=finiteNumber120(a.criterionScore134);if(score!==null&&max&&score>=0&&score<=max)commitPct(score/max*100);else commitPct(null)}queueMicrotask(patch)}
function patch(){if(!current||typeof document==='undefined')return;const sig=signature(current);document.querySelectorAll('.analysisData113').forEach(host=>{const input=host.querySelector('[data-analysis-mastery120]');if(!input)return;const label=input.closest('label');if(label)label.style.display='none';const old=host.querySelector('[data-analysis-target134]');if(old?.dataset?.targetSig134===sig)return;const html=panel(current);if(old)old.outerHTML=html;else label?.insertAdjacentHTML('beforebegin',html)});}
export function bindAnalysisTargetLevel134(state){
 current=state;modeOf(state);
 if(bound||typeof document==='undefined'){queueMicrotask(patch);return}
 bound=true;
 document.addEventListener('click',e=>{const b=e.target.closest?.('[data-target-mode134]');if(b)setMode(b.dataset.targetMode134)},true);
 document.addEventListener('input',e=>{
  if(!current)return;
  if(e.target.matches?.('[data-target-percent134]')){
   const a=analysis(current),n=percentNumber(e.target.value);a.criterionMode134='percent';commitPct(n!==null&&n>0&&n<=100?n:null);syncPanelText();return;
  }
  if(e.target.matches?.('[data-target-score134]')){
   const a=analysis(current),raw=latinDigits120(e.target.value),n=finiteNumber120(raw),max=maxScore(current);a.criterionMode134='score';a.criterionScore134=raw;if(n!==null&&max&&n>=0&&n<=max)commitPct(n/max*100);else commitPct(null);syncPanelText();return;
  }
  if(e.target.matches?.('[data-analysis-max113]'))setTimeout(patch,0);
 },true);
 document.addEventListener('change',e=>{if(e.target.matches?.('[data-target-percent134],[data-target-score134]'))queueMicrotask(patch)},true);
 observer=new MutationObserver(()=>queueMicrotask(patch));observer.observe(document.documentElement,{subtree:true,childList:true});queueMicrotask(patch);
}
if(typeof document!=='undefined'&&!document.getElementById('analysis-target134-style')){const s=document.createElement('style');s.id='analysis-target134-style';s.textContent='.analysisTarget134{margin:12px 0;padding:13px;border:1px solid #dce8e4;border-radius:14px;background:#fbfdfc}.analysisTarget134>div:first-child b{color:#174f42}.analysisTarget134 small{font-weight:500;color:#71817c}.analysisTarget134 p{margin:4px 0 10px;color:#667973;font-size:12px}.analysisTargetModes134{display:flex;gap:7px;flex-wrap:wrap}.analysisTargetModes134 button{border:1px solid #d6e3df;background:#fff;border-radius:999px;padding:7px 11px;color:#405d55}.analysisTargetModes134 button.on{border-color:#07a869;background:#eaf8f2;color:#0b6d50;font-weight:850}.analysisTarget134 label{display:grid!important;gap:6px;margin-top:11px}.analysisTargetInput134{display:flex;align-items:center;gap:7px}.analysisTargetInput134 input{max-width:180px}.analysisTargetInput134 b{color:#536963}.analysisTargetCalc134{display:block}.analysisTargetSummary134{margin-top:10px;padding-top:9px;border-top:1px solid #e1ebe7;color:#64766f;font-size:12px}.analysisTargetSummary134 b{color:#174f42}';document.head.appendChild(s)}