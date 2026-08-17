import {joinAr} from './engine80.js?v=80';
import {displayAudiences,smartTitle} from './output-quality-v5.js';
import {guideSupportSentence76,strongGuideLinks76} from './guide-link76.js?v=80';
const c=s=>String(s||'').replace(/\|{2,}/g,'، ').replace(/\s*،\s*/g,'، ').replace(/\s+/g,' ').trim();
const d=(fd,k)=>c(fd?.[k]||'');
const ctx=s=>({a:joinAr(displayAudiences(s))||'الفئة المستفيدة',t:s.classification?.type||'',title:smartTitle(s),fd:s.metadata?.familyDetails||{}});
const sentence=(label,value)=>value?`${label}${value}.`:'';
function placePhrase(s){const m=s.metadata||{},mode=m.placeMode||'',place=c(m.place||m.placeChoice||'');if(!mode&&!place)return'';if(mode==='عن بُعد')return place&&place!=='عن بُعد'?` عن بُعد باستخدام ${place}`:' عن بُعد';if(mode==='خارج المدرسة'){const x=place.replace(/^خارج المدرسة\s*-?\s*/,'').trim();return x?` خارج المدرسة في ${x}`:' خارج المدرسة';}if(mode==='داخل المدرسة')return place&&place!=='داخل المدرسة'?` في ${place}`:' داخل المدرسة';return place?` في ${place}`:''}
function durationPhrase(s){const v=c(s.metadata?.duration||s.metadata?.durationChoice||'');if(!v)return'';if(v==='مستمر')return' بصورة مستمرة';if(v==='فصل دراسي')return' على مدى فصل دراسي';if(/حصة|حصتان|حصص/.test(v))return` خلال ${v}`;if(/يوم|أيام|يومان|أسبوع|أسابيع|أسبوعان/.test(v))return` على مدى ${v}`;return` خلال ${v}`}
function contextTail(s){return`${placePhrase(s)}${durationPhrase(s)}`}
function focusSentence(f){const x=d(f,'skillFocus');return x?`وركز العمل على ${x}.`:''}
function core(s,level='medium'){
 const x=ctx(s),f=x.fd,a=[],tail=contextTail(s),focus=focusSentence(f);
 if(x.t==='برنامج / فعالية'){
   a.push(`نُفذ ${x.title} لصالح ${x.a}${tail}.`);if(focus)a.push(focus);
   if(d(f,'reason'))a.push(sentence('وجاء التنفيذ استجابةً لـ',d(f,'reason')));
   if(d(f,'goal'))a.push(sentence('واستهدف العمل ',d(f,'goal')));
   if(d(f,'method'))a.push(sentence('واعتمد التنفيذ على ',d(f,'method')));
   if(level!=='short'&&d(f,'participation'))a.push(sentence('وخلال التنفيذ لوحظ ',d(f,'participation')));
 }else if(x.t==='اجتماع / متابعة إدارية'){
   a.push(`عُقد ${x.title} بمشاركة ${x.a}${tail}.`);if(focus)a.push(focus);
   if(d(f,'purpose'))a.push(sentence('وتركز الاجتماع على ',d(f,'purpose')));
   if(d(f,'work'))a.push(sentence('ونوقش خلاله ',d(f,'work')));
   if(level!=='short'&&d(f,'product'))a.push(sentence('وانتهى الاجتماع إلى ',d(f,'product')));
   if(level==='long'&&d(f,'follow'))a.push(sentence('واتُّفق على متابعة القرارات من خلال ',d(f,'follow')));
 }else if(x.t==='تحليل نتائج'){
   a.push(`أُجري ${x.title} لخدمة ${x.a}${durationPhrase(s)}.`);if(focus)a.push(focus);
   if(d(f,'basis'))a.push(sentence('واستند التحليل إلى ',d(f,'basis')));
   if(d(f,'finding'))a.push(sentence('وأظهرت النتائج ',d(f,'finding')));
   if(level!=='short'&&d(f,'cause'))a.push(sentence('ومن الأسباب المحتملة المدعومة بالبيانات أو الملاحظة: ',d(f,'cause')));
   if(d(f,'action'))a.push(sentence('وبناءً على التحليل اتُّخذت إجراءات شملت ',d(f,'action')));
   if(level==='long'&&d(f,'follow'))a.push(sentence('وسيُقاس التقدم من خلال ',d(f,'follow')));
 }else if(x.t==='خطة'){
   a.push(`أُعدت ${x.title} لخدمة ${x.a}${durationPhrase(s)}.`);if(focus)a.push(focus);
   if(d(f,'basis'))a.push(sentence('وبُنيت الخطة على ',d(f,'basis')));
   if(d(f,'goal'))a.push(sentence('وتركز على ',d(f,'goal')));
   if(d(f,'method'))a.push(sentence('وتتضمن إجراءات تنفيذ تشمل ',d(f,'method')));
   if(level==='long'&&d(f,'follow'))a.push(sentence('وتتم متابعة التنفيذ من خلال ',d(f,'follow')));
 }else if(x.t==='إجراء متابعة'){
   a.push(`نُفذ ${x.title} لخدمة ${x.a}${durationPhrase(s)}.`);if(focus)a.push(focus);
   const goal=d(f,'goal')||d(f,'reason')||d(f,'purpose'),method=d(f,'method')||d(f,'tool')||d(f,'basis'),action=d(f,'action')||d(f,'outcome')||d(f,'product'),follow=d(f,'follow');
   if(goal)a.push(sentence('وهدفت المتابعة إلى ',goal));if(method)a.push(sentence('واعتمدت المتابعة على ',method));if(level!=='short'&&action)a.push(sentence('وتم اتخاذ إجراء شمل ',action));if(level==='long'&&follow)a.push(sentence('وتستمر المتابعة من خلال ',follow));
 }else if(x.t==='تطوير مهني'){
   a.push(`نُفذ ${x.title} بما يخدم ${x.a}${tail}.`);if(focus)a.push(focus);
   const need=d(f,'need')||d(f,'reason')||d(f,'basis'),method=d(f,'method')||d(f,'content'),application=d(f,'application')||d(f,'product')||d(f,'impact'),follow=d(f,'follow');
   if(need)a.push(sentence('وجاء النشاط استجابةً لـ',need));if(method)a.push(sentence('وتضمن التنفيذ ',method));if(level!=='short'&&application)a.push(sentence('وتركزت الاستفادة التطبيقية في ',application));if(level==='long'&&follow)a.push(sentence('وتتم متابعة أثر التطوير من خلال ',follow));
 }else{a.push(`تم تنفيذ ${x.title} لصالح ${x.a}${tail}.`);if(focus)a.push(focus);if(d(f,'reason'))a.push(sentence('وجاء العمل استجابةً لـ',d(f,'reason')));if(d(f,'method'))a.push(sentence('وتضمن التنفيذ ',d(f,'method')));if(level!=='short'&&d(f,'participation'))a.push(sentence('ولوحظ ',d(f,'participation')))}
 return c(a.join(' '));
}
export function shortText80(s){return core(s,'short')}
export function mediumText80(s){const g=guideSupportSentence76(s,1);return c(`${core(s,'medium')}${g?` ${g}`:''}`)}
export function longText80(s){const g=guideSupportSentence76(s,2);return c(`${core(s,'long')}${g?` ${g}`:''}`)}
const LABELS={skillFocus:'المهارة/الجانب المستهدف: ',reason:'سبب التنفيذ: ',goal:'الهدف: ',method:'طريقة التنفيذ: ',participation:'ملاحظة أثناء التنفيذ: ',purpose:'غرض الاجتماع: ',work:'أبرز ما نوقش: ',product:'القرار أو المخرج: ',basis:'أساس العمل: ',finding:'أبرز ما ظهر: ',cause:'سبب محتمل: ',action:'الإجراء: ',follow:'المتابعة: ',need:'الاحتياج المهني: ',tool:'أداة المتابعة: ',content:'المحتوى: ',application:'التطبيق: ',impact:'الأثر: ',outcome:'الإجراء الناتج: '};
export function bulletText80(s){const x=ctx(s),a=[`تم تنفيذ ${x.title} لصالح ${x.a}.`],place=c(s.metadata?.place||s.metadata?.placeChoice||''),duration=c(s.metadata?.duration||s.metadata?.durationChoice||'');if(place)a.push(`مكان التنفيذ: ${place}.`);if(duration)a.push(`المدة: ${duration}.`);const entries=Object.entries(x.fd).filter(([,v])=>c(v));for(const [k,v] of entries.slice(0,6)){const label=LABELS[k]||'تفصيل: ';a.push(`${label}${c(v)}.`)}strongGuideLinks76(s).slice(0,2).forEach(z=>a.push(`يدعم العمل الممارسات المرتبطة بـ${String(z.text||'').replace(/\.$/,'')} ضمن مجال ${z.domainName}.`));return a.slice(0,9)}