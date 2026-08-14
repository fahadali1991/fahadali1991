import {norm} from './engine.js';
import {extractTitleFacts62} from './title62.js?v=73';
import {INDICATOR_REGISTRY73,GUIDE_DOMAINS} from './indicator-registry73.js?v=73';
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const N=s=>norm(clean(s));
const words=s=>N(s).split(/[^\u0600-\u06FF0-9]+/).filter(x=>x.length>2);
function context73(s){const f=extractTitleFacts62(s);return N([s.raw,s.topic,f.topicConcept,s.classification?.type,s.classification?.subtype,Object.values(s.metadata?.familyDetails||{}).join(' '),(s.answers?.goals||[]).join(' ')].join(' '))}
function specialBoost(s,i,x){let b=0,reason=[];const fam=s.classification?.type||'';
 const has=(...ks)=>ks.some(k=>x.includes(N(k)));
 if(i.code==='2-2-1-3'&&(fam==='تحليل نتائج'||has('تحليل نتائج','نتائج الاختبار'))){b+=7;reason.push('نوع العمل تحليل نتائج يرتبط مباشرة بتحليل نتائج التقويم وتوظيفها في التحسين')}
 if(i.code==='1-4-1-5'&&(fam==='تطوير مهني'||has('تطوير مهني','احتياج تدريبي'))){b+=7;reason.push('العمل تطوير مهني أو مبني على احتياج تدريبي')}
 if(i.code==='1-4-1-7'&&fam==='خطة'&&has('تحسين','خطة تحسين')){b+=7;reason.push('العمل خطة تحسين مرتبطة بنتائج التقويم')}
 if(i.code==='1-1-1-1'&&fam==='خطة'&&has('تشغيلية','خطة تشغيلية')){b+=7;reason.push('العمل يتعلق ببناء الخطة التشغيلية')}
 if(i.code==='1-1-1-2'&&has('متابعة الخطة','تنفيذ الخطة التشغيلية')){b+=6;reason.push('العمل يتناول متابعة تنفيذ الخطة التشغيلية')}
 if(i.code.startsWith('3-1-1-')&&!has('اختبار وطني','نافس','وطنية')) b-=6;
 if(i.code==='4-2-1-1'&&has('برنامج سلامة','توعية سلامة')&&!has('فحص','متطلبات','مبنى','مرافق')) b-=3;
 return{b,reason}
}
function scoreIndicator(s,i,x){let score=0,hits=[];for(const c of i.concepts||[]){const n=N(c);if(n&&x.includes(n)){score+=n.length>9?4:3;hits.push(c)}else{const ws=words(c);const m=ws.filter(w=>x.includes(w));if(ws.length>=2&&m.length>=Math.ceil(ws.length*.7)){score+=2;hits.push(c)}}}
 const sp=specialBoost(s,i,x);score+=sp.b;return{score,hits,reason:sp.reason[0]||''}}
function strength(score){return score>=7?'قوي':score>=4?'متوسط':'ضعيف'}
export function guideLinks73(s){const x=context73(s);const out=INDICATOR_REGISTRY73.map(i=>{const r=scoreIndicator(s,i,x);return{...i,score:r.score,strength:strength(r.score),reason:r.reason||(r.hits.length?`تطابق موضوع العمل مع مفاهيم: ${r.hits.slice(0,3).join('، ')}`:'')}}).filter(z=>z.score>=4).sort((a,b)=>b.score-a.score||a.code.localeCompare(b.code,'ar'));
 const chosen=[];for(const z of out){if(chosen.length>=5)break;if(!chosen.some(x=>x.code===z.code))chosen.push(z)}return chosen}
export function strongGuideLinks73(s){return guideLinks73(s).filter(x=>x.strength==='قوي').slice(0,3)}
export function primaryGuideLink73(s){return strongGuideLinks73(s)[0]||guideLinks73(s)[0]||null}
export function guideDomain73(s){const p=primaryGuideLink73(s);return p?{id:p.domain,name:GUIDE_DOMAINS[p.domain]}:null}
export function guideSupportSentence73(s,limit=1){const links=strongGuideLinks73(s).slice(0,limit);if(!links.length)return'';if(links.length===1){const x=links[0];return `كما يسهم العمل في دعم الممارسات المرتبطة بالمؤشر (${x.code}) في مجال ${x.domainName}: ${x.text}`;}return `كما يسهم العمل في دعم الممارسات المرتبطة بالمؤشرات ${links.map(x=>`(${x.code})`).join(' و')} ضمن ${[...new Set(links.map(x=>x.domainName))].join(' و')}.`}
export function evidenceSuggestions73(s){const links=strongGuideLinks73(s);return [...new Set(links.flatMap(x=>x.evidence||[]))].slice(0,6)}
