import {norm} from './engine.js';
import {extractTitleFacts62} from './title62.js?v=75';
import {INDICATOR_REGISTRY73,GUIDE_DOMAINS} from './indicator-registry73.js?v=73';
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const N=s=>norm(clean(s));
const words=s=>N(s).split(/[^\u0600-\u06FF0-9]+/).filter(x=>x.length>2);
function contexts(s){const f=extractTitleFacts62(s);return{core:N([s.raw,s.topic,f.topicConcept,s.metadata?.titleClarification].filter(Boolean).join(' ')),secondary:N([Object.values(s.metadata?.familyDetails||{}).join(' '),(s.answers?.goals||[]).join(' ')].join(' ')),family:f.family||s.classification?.type||''}}
function conceptScore(text,c,full=5,partial=3){const n=N(c);if(!n)return 0;if(text.includes(n))return full;const ws=words(c);if(ws.length<2)return 0;const hits=ws.filter(w=>text.includes(w)).length;return hits>=Math.ceil(ws.length*.75)?partial:0}
function special(i,ctx){let score=0,reason='';const has=(...ks)=>ks.some(k=>ctx.core.includes(N(k)));
 if(i.code==='2-2-1-3'&&(ctx.family==='تحليل نتائج'||has('تحليل نتائج','نتائج الاختبار'))){score=8;reason='نوع العمل وموضوعه يرتبطان مباشرة بتحليل نتائج التقويم وتوظيفها في التحسين'}
 if(i.code==='1-4-1-5'&&(ctx.family==='تطوير مهني'||has('تطوير مهني','احتياج تدريبي'))){score=8;reason='موضوع العمل يتعلق مباشرة بالتطوير المهني أو الاحتياج التدريبي'}
 if(i.code==='1-4-1-7'&&ctx.family==='خطة'&&has('خطة تحسين','تحسين بناء على نتائج التقويم')){score=8;reason='العمل خطة تحسين مرتبطة بنتائج التقويم'}
 if(i.code.startsWith('3-1-1-')&&!has('اختبار وطني','اختبارات وطنية','نافس'))return{score:-99,reason:''};
 if(i.code==='1-2-1-4'&&!has('سلوك إيجابي','تعزيز السلوك','السلوك الايجابي'))return{score:-99,reason:''};
 if(i.code==='1-2-1-3'&&!has('انضباط','مواظبة','غياب','تأخر'))return{score:-99,reason:''};
 if(i.code==='4-2-1-1'&&!has('أمن وسلامة','امن وسلامه','إخلاء','اخلاء','سلامة مدرسية'))return{score:-99,reason:''};
 return{score,reason}}
function scoreIndicator(s,i){const ctx=contexts(s),sp=special(i,ctx);if(sp.score<0)return{score:-99,coreScore:0,hits:[],reason:''};let coreScore=0,secondaryScore=0,hits=[];for(const c of i.concepts||[]){const a=conceptScore(ctx.core,c,5,3);if(a){coreScore+=a;hits.push(c);continue}const b=conceptScore(ctx.secondary,c,1,1);if(b)secondaryScore+=b}secondaryScore=Math.min(secondaryScore,3);const score=Math.max(sp.score,coreScore+secondaryScore);return{score,coreScore,hits,reason:sp.reason||((coreScore>=3&&hits.length)?`تطابق موضوع العمل الأساسي مع مفاهيم: ${hits.slice(0,3).join('، ')}`:'')}}
function strength(r){if(r.score>=7&&r.coreScore>=4)return'قوي';if(r.score>=4&&r.coreScore>=3)return'متوسط';if(r.score>=7&&r.reason)return'قوي';return'ضعيف'}
export function guideLinks75(s){const out=INDICATOR_REGISTRY73.map(i=>{const r=scoreIndicator(s,i);return{...i,score:r.score,strength:strength(r),reason:r.reason}}).filter(z=>z.strength!=='ضعيف').sort((a,b)=>b.score-a.score||a.code.localeCompare(b.code,'ar'));return out.slice(0,5)}
export function strongGuideLinks75(s){return guideLinks75(s).filter(x=>x.strength==='قوي').slice(0,3)}
export function primaryGuideLink75(s){return strongGuideLinks75(s)[0]||guideLinks75(s)[0]||null}
export function guideDomain75(s){const p=primaryGuideLink75(s);return p?{id:p.domain,name:GUIDE_DOMAINS[p.domain]}:null}
export function guideSupportSentence75(s,limit=1){const links=strongGuideLinks75(s).slice(0,limit);if(!links.length)return'';if(links.length===1){const x=links[0];return `كما يسهم العمل في دعم الممارسات المرتبطة بالمؤشر (${x.code}) في مجال ${x.domainName}: ${x.text}`;}return `كما يسهم العمل في دعم الممارسات المرتبطة بالمؤشرات ${links.map(x=>`(${x.code})`).join(' و')} ضمن ${[...new Set(links.map(x=>x.domainName))].join(' و')}.`;}
export function evidenceSuggestions75(s){return [...new Set(strongGuideLinks75(s).flatMap(x=>x.evidence||[]))].slice(0,6)}
