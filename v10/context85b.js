import {extractContext85 as baseExtract} from './context85.js?v=85';
const n=s=>String(s||'').replace(/[ًٌٍَُِّْـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/\s+/g,' ').trim().toLowerCase();
const has=(t,...xs)=>xs.some(x=>t.includes(n(x)));
export function extractContext85(raw,type=''){
 const x=baseExtract(raw,type),t=n(raw);
 if(x.occasion==='اليوم العالمي للغة العربية')x.topic='تعزيز اللغة العربية';
 if(x.topic==='توظيف التقنية في التدريس'&&has(t,'مدرستي')&&!has(t,'تدريس','حصة','حصه','الدرس','داخل الصف'))x.topic='توظيف التقنية في التعليم';
 if(type==='اجتماع / متابعة إدارية'&&has(t,'مستوى الانجاز','مستوى الإنجاز','متابعه الانجاز','متابعة الإنجاز'))x.familyDetails.purpose='مراجعة مستوى الإنجاز';
 if(x.methods?.includes('مسابقة أو تحدٍ')&&has(t,'تحديات','التحديات')&&!has(t,'مسابقه','مسابقة','تحدي ','تحدٍ'))x.methods=x.methods.filter(v=>v!=='مسابقة أو تحدٍ');
 if(type==='برنامج / فعالية'&&x.methods?.length)x.familyDetails.method=x.methods.join('|||');
 if(type==='تحليل نتائج'){x.placeMode='';x.placeChoice=''}
 return x;
}
export function applyContext85(state){const type=state.classification?.type||'',x=extractContext85(state.raw||'',type);state.metadata=state.metadata||{};state.metadata.context85=x;state.metadata.pdRole85=x.pdRole||'';if(x.topic)state.topic=x.topic;if(x.stage)state.stage=x.stage;if(x.grades?.length)state.grades=[...new Set([...(state.grades||[]),...x.grades])];state.suggestedAudiences=[...new Set([...(state.suggestedAudiences||[]),...(x.audiences||[])])];if(type!=='تحليل نتائج'&&x.placeMode){state.metadata.placeMode=x.placeMode;state.metadata.placeChoice=x.placeChoice||state.metadata.placeChoice||''}state.metadata.familyDetails={...(state.metadata.familyDetails||{}),...(x.familyDetails||{})};if(x.evidence?.length)state.metadata.contextEvidence85=x.evidence;return state}
