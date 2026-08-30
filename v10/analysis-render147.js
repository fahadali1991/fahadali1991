import {analysisFinalPanel134,analysisOutputPanel134,analysisOutputModel134} from './analysis-output134.js?v=134';
import {analysisSemanticGroups147,ANALYSIS_COLORS147} from './analysis-documents147.js?v=147';
import {targetLevelDisplay134} from './analysis-target-level134.js?v=134';

const pct=v=>`${Number(v).toFixed(1).replace(/\.0$/,'')}٪`;
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));

function bars147(state){
 const sem=analysisSemanticGroups147(state);if(!sem.ready)return'';
 return `<section class="analysisBlock134 analysisBands134 analysisBands147"><h2>توزيع مستويات الأداء</h2><div>${sem.groups.map(r=>`<div class="analysisBar134 ${r.id}"><span>${esc(r.label)}</span><i><em style="width:${r.pct}%"></em></i><b>${r.count} (${pct(r.pct)})</b></div>`).join('')}</div></section>`;
}
function pattern147(id,color){
 if(id==='support')return `<pattern id="p-support147" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="${color}"/><path d="M-1,1 L1,-1 M0,7 L7,0 M6,8 L8,6" stroke="rgba(0,0,0,.35)" stroke-width="1.15"/></pattern>`;
 if(id==='advanced')return `<pattern id="p-advanced147" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="${color}"/><path d="M0,0 L8,8 M8,0 L0,8" stroke="rgba(255,255,255,.45)" stroke-width="1"/></pattern>`;
 return `<pattern id="p-mastered147" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="${color}"/><circle cx="4" cy="4" r="1.1" fill="rgba(255,255,255,.42)"/></pattern>`;
}
function donut147(state){
 const sem=analysisSemanticGroups147(state);if(!sem.ready)return'';
 let offset=0;
 const circles=sem.groups.map(g=>{const x=`<circle class="donutSeg147 ${g.id}" cx="60" cy="60" r="44" pathLength="100" fill="none" stroke="url(#p-${g.id}147)" stroke-width="18" stroke-dasharray="${g.pct} ${100-g.pct}" stroke-dashoffset="${-offset}" transform="rotate(-90 60 60)"/>`;offset+=g.pct;return x}).join('');
 return `<section class="analysisBlock134 analysisDecision134 analysisDecision147"><h2>نسبة الطلاب في كل مستوى</h2><div class="analysisDonutWrap147"><div class="analysisDonutSvg147"><svg viewBox="0 0 120 120" role="img" aria-label="نسبة الطلاب في مستويات الأداء"><defs>${pattern147('support',ANALYSIS_COLORS147.support)}${pattern147('mastered',ANALYSIS_COLORS147.mastered)}${pattern147('advanced',ANALYSIS_COLORS147.advanced)}</defs><circle cx="60" cy="60" r="44" fill="none" stroke="#edf2f0" stroke-width="18"/>${circles}<text x="60" y="57" text-anchor="middle" class="donutTotal147">${sem.total}</text><text x="60" y="72" text-anchor="middle" class="donutLabel147">طالب</text></svg></div><div class="analysisDecisionRows134 analysisDecisionRows147">${sem.groups.map(g=>`<div class="${g.id}"><i></i><span>${esc(g.label)}</span><b>${g.count} · ${pct(g.pct)}</b></div>`).join('')}<div class="target"><span>مستوى الإتقان المستهدف</span><b>${esc(targetLevelDisplay134(state))}</b></div></div></div></section>`;
}
function harmonize147(html,state){
 const model=analysisOutputModel134(state);if(!model?.ready||!model?.criterion?.defined)return String(html||'');
 let out=String(html||'');const b=bars147(state),d=donut147(state);
 out=out.replace(/<section class="analysisBlock134 analysisBands134[^>]*>[\s\S]*?<\/section>/g,b);
 out=out.replace(/<section class="analysisBlock134 analysisDecision134[^>]*>[\s\S]*?<\/section>/g,d);
 return out;
}
export function analysisFinalPanel147(state){return harmonize147(analysisFinalPanel134(state),state)}
export function analysisOutputPanel147(state){return harmonize147(analysisOutputPanel134(state),state)}
