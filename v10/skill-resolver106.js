import {resolveSkill105} from './skill-resolver105.js?v=105';
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const normalize=s=>clean(s).replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').toLowerCase();
const aliases={
 'توحيد المقامات':['توحيد المقامات','توحيد مقام','المقامات'],
 'العمليات على الكسور':['جمع الكسور','طرح الكسور','ضرب الكسور','قسمة الكسور','العمليات على الكسور'],
 'الفهم القرائي':['الفهم القرائي','فهم المقروء'],
 'الطلاقة القرائية':['الطلاقة القرائية','طلاقة القراءة','القراءة الجهرية'],
 'أحكام التجويد':['احكام التجويد','التجويد'],
 'تلاوة القرآن الكريم':['تلاوة القرآن','التلاوة'],
 'حفظ القرآن الكريم':['حفظ القرآن','الحفظ']
};
function exactCandidates(raw,options){const n=normalize(raw),hits=[];for(const opt of options||[]){const phrases=aliases[opt]||[opt];const best=phrases.reduce((score,p)=>Math.max(score,n.includes(normalize(p))?normalize(p).length:0),0);if(best)hits.push({opt,score:best})}return hits.sort((a,b)=>b.score-a.score)}
export function resolveSkill106(state){const r=resolveSkill105(state),chosen=clean(state?.metadata?.familyDetails?.skillFocus||'');if(chosen)return{...r,skill:chosen,skillKnown:true,needsSkillQuestion:false,source:'user'};const hits=exactCandidates(`${state?.raw||''} ${state?.topic||''}`,r.skillOptions);if(hits.length&&(!hits[1]||hits[0].score>hits[1].score))return{...r,skill:hits[0].opt,skillKnown:true,needsSkillQuestion:false,source:'explicit'};return{...r,source:r.skillKnown?'explicit':'unknown'};}
