import {joinAr} from './engine80.js?v=80';
import {displayAudiences} from './output-quality-v5.js';
import {guideSupportSentence76,strongGuideLinks76} from './guide-link76.js?v=110.1';
import {bestTitle108} from './title108.js?v=110.1';
const c=s=>String(s||'').replace(/\|{2,}/g,'، ').replace(/\s*،\s*/g,'، ').replace(/\s+/g,' ').replace(/\.\s*\./g,'.').trim();
const d=(fd,k)=>c(fd?.[k]||'');
const ctx=s=>({a:joinAr(displayAudiences(s))||'الفئة المستفيدة',t:s.classification?.type||'',title:bestTitle108(s),fd:s.metadata?.familyDetails||{}});
const add=(a,text)=>{const x=c(text);if(x)a.push(/[.!؟]$/.test(x)?x:`${x}.`)};
function placePhrase(s){const m=s.metadata||{},mode=m.placeMode||'',place=c(m.place||m.placeChoice||'');if(!mode&&!place)return'';if(mode==='عن بُعد')return place&&place!=='عن بُعد'?` عن بُعد باستخدام ${place}`:' عن بُعد';if(mode==='خارج المدرسة'){const x=place.replace(/^خارج المدرسة\s*-?\s*/,'').trim();return x?` خارج المدرسة في ${x}`:' خارج المدرسة';}if(mode==='داخل المدرسة')return place&&place!=='داخل المدرسة'?` في ${place}`:' داخل المدرسة';return place?` في ${place}`:''}
function durationPhrase(s){const v=c(s.metadata?.duration||s.metadata?.durationChoice||'');if(!v)return'';if(v==='مستمر')return' بصورة مستمرة';if(v==='فصل دراسي')return' على مدى فصل دراسي';if(/حصة|حصتان|حصص/.test(v))return` خلال ${v}`;if(/يوم|أيام|يومان|أسبوع|أسابيع|أسبوعان/.test(v))return` على مدى ${v}`;return` خلال ${v}`}
function contextTail(s){return`${placePhrase(s)}${durationPhrase(s)}`}
function measured(f){const x=d(f,'measurement');if(!x)return'';if(/لم يتم القياس بعد/.test(x))return'لم يُقَس الأثر بعد، وستُستكمل المتابعة عند توفر بيانات كافية.';return`وقيس التقدم باستخدام ${x}.`}
function focus(f){const x=d(f,'skillFocus');return x?`تركز العمل على ${x}.`:''}
function core(s,level='medium'){
 const x=ctx(s),f=x.fd,a=[],tail=contextTail(s),foc=focus(f);
 if(x.t==='برنامج / فعالية'){
  add(a,`نُفذ ${x.title} لـ${x.a}${tail}`); add(a,foc);
  if(d(f,'reason')) add(a,`انطلق العمل من ${d(f,'reason')}`);
  if(d(f,'goal')) add(a,`وهدف إلى ${d(f,'goal')}`);
  if(d(f,'method')) add(a,`ونُفذت أنشطته من خلال ${d(f,'method')}`);
  if(level!=='short'&&d(f,'participation')) add(a,`وأظهرت المتابعة أثناء التنفيذ ${d(f,'participation')}`);
  if(level==='long') add(a,measured(f));
 } else if(x.t==='اجتماع / متابعة إدارية'){
  add(a,`عُقد ${x.title} بمشاركة ${x.a}${tail}`); add(a,foc);
  if(d(f,'purpose')) add(a,`وخصص لمناقشة ${d(f,'purpose')}`);
  if(d(f,'work')) add(a,`وتناول المجتمعون ${d(f,'work')}`);
  if(level!=='short'&&d(f,'product')) add(a,`وخلص الاجتماع إلى ${d(f,'product')}`);
  if(d(f,'owner')) add(a,`وأسندت مسؤولية التنفيذ أو المتابعة إلى ${d(f,'owner')}`);
  if(level==='long'&&d(f,'follow')) add(a,`وتتابع القرارات من خلال ${d(f,'follow')}`);
 } else if(x.t==='تحليل نتائج'){
  add(a,`أُجري ${x.title} لـ${x.a}${durationPhrase(s)}`); add(a,foc);
  if(d(f,'basis')) add(a,`واعتمد التحليل على ${d(f,'basis')}`);
  if(d(f,'finding')) add(a,`وأبرزت البيانات ${d(f,'finding')}`);
  if(level!=='short'&&d(f,'cause')) add(a,`وتشير البيانات والملاحظات المتاحة إلى ${d(f,'cause')}`);
  if(d(f,'action')) add(a,`وبناءً على ذلك، حُددت إجراءات تشمل ${d(f,'action')}`);
  if(d(f,'follow')) add(a,`وتتابع فاعلية الإجراءات من خلال ${d(f,'follow')}`);
  if(level==='long') add(a,measured(f));
 } else if(x.t==='خطة'){
  add(a,`أُعدت ${x.title} لـ${x.a}${durationPhrase(s)}`); add(a,foc);
  if(d(f,'basis')) add(a,`واستند إعدادها إلى ${d(f,'basis')}`);
  if(d(f,'goal')) add(a,`وحددت الخطة هدفًا يتمثل في ${d(f,'goal')}`);
  if(d(f,'method')) add(a,`وتنفذ عبر إجراءات تشمل ${d(f,'method')}`);
  if(d(f,'follow')) add(a,`ويتابع التنفيذ من خلال ${d(f,'follow')}`);
  if(level==='long') add(a,measured(f));
 } else if(x.t==='إجراء متابعة'){
  add(a,`نُفذ ${x.title} لـ${x.a}${durationPhrase(s)}`); add(a,foc);
  const goal=d(f,'goal')||d(f,'reason')||d(f,'purpose'),method=d(f,'method')||d(f,'tool')||d(f,'basis'),action=d(f,'action')||d(f,'outcome')||d(f,'product');
  if(goal)add(a,`وهدفت المتابعة إلى ${goal}`); if(method)add(a,`واستندت إلى ${method}`); if(level!=='short'&&action)add(a,`وأسفرت المتابعة عن إجراء تمثل في ${action}`); if(level==='long')add(a,measured(f));
 } else if(x.t==='تطوير مهني'){
  add(a,`نُفذ ${x.title} لـ${x.a}${tail}`); add(a,foc);
  const need=d(f,'need')||d(f,'reason')||d(f,'basis'),method=d(f,'method')||d(f,'content'),application=d(f,'application')||d(f,'product')||d(f,'impact');
  if(need)add(a,`واستند إلى احتياج مهني يتمثل في ${need}`); if(method)add(a,`وتناول ${method}`);
  if(level!=='short'&&application){if(application==='لم يبدأ التطبيق بعد')add(a,'ولم يبدأ التطبيق العملي للممارسة المستهدفة بعد');else add(a,`وظهر التطبيق العملي في ${application}`)}
  if(level==='long'&&d(f,'follow'))add(a,`وتتابع الممارسة من خلال ${d(f,'follow')}`); if(level==='long')add(a,measured(f));
 } else if(x.t==='شراكة مجتمعية'){
  add(a,`نُفذت ${x.title} بمشاركة ${x.a}${tail}`); if(d(f,'reason'))add(a,`وهدفت الشراكة إلى دعم ${d(f,'reason')}`); if(d(f,'method'))add(a,`وتحققت المشاركة من خلال ${d(f,'method')}`); if(level!=='short'&&d(f,'participation'))add(a,`وأظهرت المتابعة ${d(f,'participation')}`);
 } else if(x.t==='صيانة وتجهيزات'){
  add(a,`نُفذ ${x.title}${tail}`); if(d(f,'reason'))add(a,`واستهدف معالجة ${d(f,'reason')}`); if(d(f,'method'))add(a,`ونُفذ الإجراء من خلال ${d(f,'method')}`); if(level!=='short'&&d(f,'status'))add(a,`وبلغت حالة الإجراء: ${d(f,'status')}`); if(level==='long'&&d(f,'follow'))add(a,`وتستمر المتابعة من خلال ${d(f,'follow')}`);
 } else { add(a,`نُفذ ${x.title} لـ${x.a}${tail}`); add(a,foc); if(d(f,'reason'))add(a,`واستهدف معالجة ${d(f,'reason')}`); if(d(f,'method'))add(a,`ونُفذ من خلال ${d(f,'method')}`); }
 return c(a.join(' '));
}
export function shortText80(s){return core(s,'short')}
export function mediumText80(s){const g=guideSupportSentence76(s,1);return c(`${core(s,'medium')}${g?` ${g}`:''}`)}
export function longText80(s){const g=guideSupportSentence76(s,2);return c(`${core(s,'long')}${g?` ${g}`:''}`)}
const LABELS={skillFocus:'المهارة أو الجانب المستهدف: ',reason:'مبرر التنفيذ: ',goal:'الهدف: ',method:'أسلوب التنفيذ: ',participation:'ملاحظة أثناء التنفيذ: ',purpose:'غرض الاجتماع: ',work:'أبرز ما نوقش: ',product:'القرار أو المخرج: ',basis:'أساس العمل: ',finding:'أبرز ما أظهرته البيانات: ',cause:'تفسير مدعوم: ',action:'الإجراء: ',follow:'المتابعة: ',need:'الاحتياج المهني: ',application:'التطبيق: ',measurement:'القياس: ',owner:'المسؤول: ',status:'حالة الإجراء: '};
export function bulletText80(s){const x=ctx(s),verb=x.t==='اجتماع / متابعة إدارية'?'عُقد':x.t==='خطة'?'أُعدت':x.t==='تحليل نتائج'?'أُجري':'نُفذ',a=[`${verb} ${x.title}${x.a?` لـ${x.a}`:''}.`],place=c(s.metadata?.place||s.metadata?.placeChoice||''),duration=c(s.metadata?.duration||s.metadata?.durationChoice||'');if(place)a.push(`المكان: ${place}.`);if(duration)a.push(`المدة: ${duration}.`);for(const [k,v] of Object.entries(x.fd).filter(([,v])=>c(v)).slice(0,7)){const value=c(v);if(k==='application'&&value==='لم يبدأ التطبيق بعد')a.push('التطبيق: لم يبدأ التطبيق العملي بعد.');else a.push(`${LABELS[k]||'تفصيل: '}${value}.`)}strongGuideLinks76(s).slice(0,2).forEach(z=>a.push(`يرتبط العمل بممارسات ${String(z.text||'').replace(/\.$/,'')} ضمن مجال ${z.domainName}.`));return a.slice(0,9)}
