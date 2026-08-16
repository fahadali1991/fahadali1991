const norm=s=>String(s||'').toLowerCase().replace(/[ًٌٍَُِّْـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/\s+/g,' ').trim();
const has=(t,...xs)=>xs.some(x=>t.includes(norm(x)));
export const TIME_PLACE86={
 'برنامج / فعالية':{place:true,time:'execution'},
 'اجتماع / متابعة إدارية':{place:true,time:'meeting'},
 'تحليل نتائج':{place:false,time:'dataPeriod'},
 'خطة':{place:false,time:'planPeriod'},
 'إجراء متابعة':{place:false,time:'followup'},
 'تطوير مهني':{place:true,time:'pd'}
};
export function placeSpec86(type){
 if(type==='برنامج / فعالية')return{inside:['فصل دراسي','المسرح المدرسي','الساحة أو الملعب','المكتبة','مركز مصادر التعلم','معمل أو مختبر','قاعة التدريب','مرافق المدرسة','مكان آخر'],remote:['منصة مدرستي','اجتماع مرئي','منصة إلكترونية أخرى','أخرى'],outside:true,multi:true};
 if(type==='اجتماع / متابعة إدارية')return{inside:['غرفة الاجتماعات','مكتب الإدارة','قاعة التدريب','مكان آخر'],remote:['اجتماع مرئي','منصة إلكترونية أخرى','أخرى'],outside:true,multi:false};
 if(type==='تطوير مهني')return{inside:['قاعة التدريب','غرفة الاجتماعات','مكان آخر'],remote:['منصة مدرستي','منصة تدريب إلكترونية','اجتماع مرئي','أخرى'],outside:true,multi:false};
 return null;
}
export function inferPlace86(raw,type){const n=norm(raw);if(!placeSpec86(type))return{};if(has(n,'منصة مدرستي','عن بعد','اونلاين','أونلاين'))return{mode:'عن بُعد',choice:has(n,'مدرستي')?'منصة مدرستي':''};if(has(n,'خارج المدرسة','زيارة خارجية','مركز صحي','جامعة','مركز ثقافي'))return{mode:'خارج المدرسة',choice:''};let c='';if(has(n,'المسرح'))c='المسرح المدرسي';else if(has(n,'الساحة','الملعب'))c='الساحة أو الملعب';else if(has(n,'المكتبة'))c='المكتبة';else if(has(n,'مصادر التعلم'))c='مركز مصادر التعلم';else if(has(n,'المعمل','المختبر'))c='معمل أو مختبر';else if(has(n,'غرفة الاجتماعات'))c='غرفة الاجتماعات';else if(has(n,'مكتب الإدارة','مكتب الادارة'))c='مكتب الإدارة';else if(has(n,'قاعة التدريب'))c='قاعة التدريب';else if(has(n,'الفصل','الصف'))c='فصل دراسي';if(c||has(n,'داخل المدرسة'))return{mode:'داخل المدرسة',choice:c};return{};}
const num=(n,re)=>{const m=n.match(re);return m?Number(m[1]):0};
export function inferTime86(raw,type){const n=norm(raw),r={};if(type==='برنامج / فعالية'){if(has(n,'حصة واحدة','حصه واحده'))r.duration='حصة واحدة';else if(has(n,'حصتين','حصتان'))r.duration='حصتان';else {const m=n.match(/(\d+)\s*حص/);if(m)r.duration=`${m[1]} حصص`;}if(has(n,'يوم واحد'))r.period='يوم واحد';else if(has(n,'يومين','يومان'))r.period='يومان';else {const d=num(n,/(\d+)\s*ايام?/);if(d)r.period=`${d} أيام`;const w=num(n,/(\d+)\s*اسابيع?/);if(w)r.period=`${w} أسابيع`;if(has(n,'اسبوعين'))r.period='أسبوعان';else if(has(n,'اسبوع'))r.period=r.period||'أسبوع';}const rep=num(n,/(\d+)\s*(مرات|مره)/);if(rep)r.repeat=`${rep} مرات`;}
 if(type==='اجتماع / متابعة إدارية'){const m=n.match(/(\d+)\s*دقيق/);if(m)r.duration=`${m[1]} دقيقة`;else if(has(n,'نصف ساعة'))r.duration='30 دقيقة';else if(has(n,'ساعتين','ساعتان'))r.duration='ساعتان';else if(has(n,'ساعة'))r.duration='ساعة';}
 if(type==='تحليل نتائج'){if(has(n,'اختبار تشخيصي'))r.period='الاختبار التشخيصي';else if(has(n,'الفترة الأولى','فتره اولى'))r.period='الفترة الأولى';else if(has(n,'الفترة الثانية','فتره ثانيه'))r.period='الفترة الثانية';else if(has(n,'اختبار نهائي'))r.period='الاختبار النهائي';}
 if(type==='خطة'){if(has(n,'فصل دراسي'))r.period='فصل دراسي';else if(has(n,'شهر'))r.period='شهر';else if(has(n,'اسبوعين'))r.period='أسبوعان';else if(has(n,'اسبوع'))r.period='أسبوع';}
 if(type==='إجراء متابعة'){if(has(n,'يوميا','يومي'))r.frequency='يومية';else if(has(n,'اسبوعيا','اسبوعي'))r.frequency='أسبوعية';else if(has(n,'كل اسبوعين'))r.frequency='كل أسبوعين';else if(has(n,'شهريا','شهري'))r.frequency='شهرية';else if(has(n,'مستمر'))r.frequency='مستمرة';if(has(n,'لمدة شهر','مده شهر'))r.period='شهر';else if(has(n,'لمدة اسبوعين','مده اسبوعين'))r.period='أسبوعان';else if(has(n,'لمدة اسبوع','مده اسبوع'))r.period='أسبوع';}
 if(type==='تطوير مهني'){const h=num(n,/(\d+)\s*ساع/);if(h)r.hours=`${h} ساعات تدريبية`;else if(has(n,'ساعتين','ساعتان'))r.hours='ساعتان تدريبيتان';else if(has(n,'ساعة'))r.hours='ساعة تدريبية';const d=num(n,/(\d+)\s*ايام?/);if(d)r.days=`${d} أيام`;else if(has(n,'يومين','يومان'))r.days='يومان';}
 return r;}
export function initTimePlace86(state){const type=state.classification?.type||'',p=inferPlace86(state.raw,type),t=inferTime86(state.raw,type);return{...p,time:t};}
