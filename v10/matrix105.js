import {matrix103,matrixFacts103} from './matrix103.js?v=103';
import {resolveSkill105} from './skill-resolver105.js?v=105';
import {DOMAIN_PACKS105} from './domain-packs105.js?v=105';
const uniq=a=>[...new Set((a||[]).filter(Boolean))];
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const domain=s=>clean(s?.metadata?.schoolDomain101||s?.metadata?.semantic101?.schoolDomain?.name||'');
const subject=s=>clean(s?.metadata?.subjectHint101||s?.metadata?.semantic101?.subject?.name||'');
const merge=(a,b)=>uniq([...(b||[]),...(a||[])]).slice(0,10);
function overlayQuestion(q,pack){if(!pack)return q;const x=pack.overlays?.[q.id]||[];return x.length?{...q,opts:merge(q.opts,x)}:q}
function skillQuestion(r){if(!r.needsSkillQuestion)return null;return{id:'skillFocus',q:`ما الجانب أو المهارة الأدق داخل ${r.branch||r.topic||'الموضوع'}؟`,help:'اختر فقط إذا كان وصفك لم يحدد المهارة الدقيقة بعد. هذا الاختيار يؤثر في الأهداف والصياغة.',opts:r.skillOptions,max:1,kind:'UserChoice',importance:6,prefill:[],known:false}}
export function matrix105(s){const base=matrix103(s),r=resolveSkill105(s),pack=DOMAIN_PACKS105[domain(s)]||DOMAIN_PACKS105[subject(s)]||null;let qs=(base.questions||[]).filter(q=>q.id!=='skillFocus').map(q=>overlayQuestion(q,pack));const sq=skillQuestion(r);if(sq)qs=[sq,...qs];if(pack?.measurement?.length)qs=qs.map(q=>q.id==='follow'?{...q,opts:merge(q.opts,pack.measurement)}:q);return{...base,subject:r.subject||base.subject,branch:r.branch||base.branch,topic:r.topic||base.topic,skill:r.skill||'',skillKnown:r.skillKnown,domain:domain(s),questions:qs};}
export function matrixFacts105(s){const m=matrix105(s),old=matrixFacts103(s);return{...old,subject:{value:m.subject,type:m.subject?'Inference':'Unknown'},branch:{value:m.branch,type:m.branch?'Inference':'Unknown'},topic:{value:m.topic,type:m.topic?'Inference':'Unknown'},skill:{value:m.skill,type:m.skill?'Fact':'Unknown'},domain:{value:m.domain,type:m.domain?'Inference':'Unknown'}}}
