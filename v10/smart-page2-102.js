import {preview101} from './intelligence101.js?v=101';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const mem=k=>{try{return sessionStorage.getItem('v94_'+k)||''}catch{return''}};
const raw=()=>mem('raw')||$('#raw')?.value||'';
const FAMILY_FIELDS={
 'برنامج / فعالية':{reason:'ما السبب الأقرب لتنفيذ هذا العمل؟',method:'كيف تم تنفيذ العمل؟',participation:'ما الذي لاحظته أثناء التنفيذ؟'},
 'اجتماع / متابعة إدارية':{purpose:'ما الغرض الرئيس من الاجتماع؟',work:'ما أبرز ما نوقش؟',product:'ما القرار أو المخرج الذي انتهى إليه الاجتماع؟',follow:'كيف ستتم متابعة القرارات؟'},
 'تحليل نتائج':{basis:'ما البيانات التي بُني عليها التحليل؟',finding:'ما أبرز ما أظهرته النتائج؟',cause:'ما التفسير الأقرب المدعوم بالبيانات أو الملاحظة؟',action:'ما الإجراء الذي اتُّخذ بناءً على النتائج؟',follow:'كيف سيُقاس التقدم بعد الإجراء؟'},
 'خطة':{basis:'على ماذا بُنيت الخطة؟',goal:'ما النتيجة التي تستهدفها الخطة؟',method:'ما أهم إجراءات التنفيذ؟',follow:'كيف ستتم متابعة تنفيذ الخطة؟'},
 'إجراء متابعة':{goal:'ما الذي كنت تتابعه؟',method:'كيف تمت المتابعة؟',action:'ما الإجراء الناتج عن المتابعة؟',follow:'ما الخطوة التالية في المتابعة؟'},
 'تطوير مهني':{need:'ما الاحتياج المهني الذي عالجه النشاط؟',method:'ما الذي تضمنه التنفيذ؟',application:'كيف سيُطبق ما تم تعلمه في الممارسة؟',follow:'كيف ستتم متابعة أثر التطوير المهني؟'},
 'شراكة مجتمعية':{reason:'ما الغرض من الشراكة؟',method:'كيف تم تنفيذ الشراكة؟',participation:'ما أبرز نتيجة أو ملاحظة ظهرت؟'},
 'صيانة وتجهيزات':{reason:'ما سبب الإجراء أو التجهيز؟',method:'ما الذي تم تنفيذه؟',participation:'ما حالة المرفق أو التجهيز بعد الإجراء؟'}
};
const BASE={
 'برنامج / فعالية':{
  reason:['معالجة احتياج لدى المستفيدين','تنمية مهارة محددة','دعم أحد أهداف المدرسة','تعزيز قيمة أو سلوك إيجابي','رفع المشاركة والدافعية','إثراء خبرات المتعلمين','معالجة تحدٍ أو ملاحظة قائمة'],
  method:['عرض ومناقشة','تطبيق عملي','أنشطة جماعية','أنشطة فردية','مسابقة أو تحدٍ','أركان ومحطات','ورشة مصغرة','توظيف التقنية والمنصات الرقمية','إنتاج أعمال أو منتجات'],
  participation:['تفاعل مرتفع من المستفيدين','مشاركة واسعة في الأنشطة','تعاون واضح بين المستفيدين','إنتاج أعمال أو منتجات','ظهور مهارات مميزة','تفاوت في مستويات المشاركة','ظهور احتياجات إضافية','حاجة بعض المستفيدين إلى دعم إضافي']
 },
 'اجتماع / متابعة إدارية':{
  purpose:['مناقشة نتائج أو بيانات','تنسيق تنفيذ عمل مشترك','معالجة تحدٍ قائم','مراجعة خطة أو إجراء','توزيع مسؤوليات ومهام','اتخاذ قرار تنظيمي'],
  work:['عرض البيانات أو الواقع الحالي','مناقشة جوانب القوة والاحتياج','مراجعة الإجراءات السابقة','مناقشة المقترحات والحلول','تحديد المسؤوليات والأدوار'],
  product:['اعتماد إجراء محدد','توزيع مهام ومسؤوليات','تحديد موعد متابعة','إقرار توصيات','تعديل خطة أو إجراء'],
  follow:['متابعة في اجتماع لاحق','متابعة التنفيذ وفق موعد محدد','رصد الإنجاز وتوثيقه','مراجعة النتائج بعد التنفيذ']
 },
 'تحليل نتائج':{
  basis:['نتائج اختبار أو تقويم','بيانات إتقان المهارات','مقارنة قبل وبعد','نتائج وطنية أو معيارية','ملاحظات صفية مدعومة ببيانات'],
  finding:['وجود مهارات غير متقنة','تفاوت بين مستويات المتعلمين','تحسن في عدد من المهارات','انخفاض في أداء مهارة محددة','وجود فئة تحتاج إثراءً'],
  cause:['حاجة إلى تدريب إضافي','صعوبة في مفهوم أو مهارة','تفاوت في الخبرات السابقة','حاجة إلى تنويع الاستراتيجيات','قلة الممارسة والتطبيق'],
  action:['إعداد خطة علاجية','إعداد خطة إثرائية','إعادة تدريس المهارة','تنويع الاستراتيجيات','تقديم تدريب إضافي','تقسيم الطلاب إلى مجموعات وفق الاحتياج'],
  follow:['اختبار قصير لاحق','مقارنة نتائج قبل وبعد','متابعة إتقان المهارة','رصد تقدم الفئة المستهدفة']
 },
 'خطة':{
  basis:['نتائج تحليل أو تقويم','احتياج تعليمي محدد','نتائج التقويم الذاتي','ملاحظة موثقة','هدف تطويري معتمد'],
  goal:['رفع مستوى الإتقان','معالجة جوانب الضعف','تنمية مستوى متقدم من الأداء','تحسين ممارسة أو إجراء','تحقيق هدف تطويري محدد'],
  method:['إجراءات متدرجة وفق الأولوية','تدريب وتطبيق عملي','متابعة فردية أو جماعية','توزيع مسؤوليات ومواعيد','أنشطة علاجية أو إثرائية'],
  follow:['مؤشر إنجاز واضح','قياس قبل وبعد','متابعة دورية','مراجعة مرحلية للخطة','توثيق الإنجاز والشواهد']
 },
 'إجراء متابعة':{
  goal:['متابعة تقدم المستفيدين','متابعة تنفيذ إجراء سابق','متابعة إتقان مهارة','متابعة التزام أو انضباط','متابعة إنجاز مسؤولية محددة'],
  method:['ملاحظة مباشرة','سجل متابعة','مراجعة نتائج أو أعمال','زيارة ميدانية','مقارنة مستوى الأداء'],
  action:['تقديم دعم إضافي','تعديل الإجراء','استمرار المتابعة','إحالة لمختص أو مسؤول','تعزيز الأداء الجيد'],
  follow:['متابعة أسبوعية','إعادة القياس لاحقًا','مراجعة الإنجاز في موعد محدد','إغلاق المتابعة بعد تحقق المطلوب']
 },
 'تطوير مهني':{
  need:['احتياج ظهر من تحليل الأداء','تطوير استراتيجية تدريس','رفع كفاءة استخدام أداة أو تقنية','معالجة احتياج تخصصي','تبادل خبرات بين المعلمين'],
  method:['عرض ومناقشة تطبيقية','نمذجة ممارسة تعليمية','ورشة عملية','تبادل خبرات','زيارة صفية تبادلية','تطبيق على حالات واقعية'],
  application:['تطبيق الاستراتيجية في الصف','إنتاج أداة أو مورد تعليمي','تجريب الممارسة ومشاركة النتائج','توظيف التقنية في التدريس','تعديل ممارسة قائمة'],
  follow:['زيارة أو ملاحظة تبادلية','مشاركة أثر التطبيق','مجتمع تعلم مهني','استبانة أو قياس أثر','مراجعة التطبيق بعد مدة']
 }
};
const SUBJECT={
 'القرآن الكريم والدراسات الإسلامية':{
  reason:['تنمية مهارات التلاوة والحفظ','رفع مستوى تطبيق أحكام التجويد','تنمية فهم معاني الآيات وربطها بالسلوك','تعزيز الصلة بالقرآن الكريم','معالجة تفاوت مستوى الطلاب في المهارة المستهدفة'],
  method:['تلاوة نموذجية وتصحيح مباشر','تلقين وترديد موجه','تسميع ومراجعة فردية','تطبيق أحكام التجويد على الآيات','مناقشة المعاني والقيم','مسابقة أو تحدي حفظ وتلاوة'],
  participation:['تحسن في التلاوة أو الحفظ','تفاوت في مستوى الإتقان','ارتفاع دافعية الطلاب للمراجعة','حاجة بعض الطلاب إلى متابعة إضافية','تفاعل جيد مع التطبيق القرآني']
 },
 'اللغة العربية':{
  reason:['تنمية المهارة اللغوية المستهدفة','معالجة ضعف في القراءة أو الكتابة','رفع مستوى الفهم والتطبيق','تنمية الطلاقة والدقة اللغوية','تعزيز الدافعية نحو القراءة والكتابة'],
  method:['نمذجة المهارة وتطبيق موجه','قراءة أو كتابة فردية','تدريب متدرج','مناقشة وتغذية راجعة','أنشطة لغوية جماعية','مقارنة نماذج قبل وبعد'],
  participation:['تحسن في الأداء اللغوي','تفاوت بين مستويات الطلاب','زيادة المشاركة في الأنشطة اللغوية','حاجة بعض الطلاب إلى تدريب إضافي','تحسن في دقة التطبيق']
 },
 'الرياضيات':{
  reason:['معالجة ضعف في فهم المهارة الرياضية','تقليل الأخطاء المتكررة في الحل','رفع مستوى الإتقان','تنمية الاستدلال وحل المشكلات','ربط المفهوم الرياضي بالتطبيق'],
  method:['أمثلة محلولة ونمذجة','مسائل متدرجة','تطبيق فردي','تعلم تعاوني','مسائل حياتية','ألعاب وتحديات رياضية','تقويم قصير أثناء التنفيذ'],
  participation:['تحسن دقة الحل','تفاوت في سرعة الاستيعاب','انخفاض بعض الأخطاء المتكررة','تحسن في تطبيق المهارة','حاجة بعض الطلاب إلى إعادة تدريب']
 },
 'العلوم':{
  reason:['تنمية الفهم العلمي','تنمية مهارات الاستقصاء والملاحظة','ربط المفهوم بالتطبيق العملي','معالجة صعوبة في مفهوم علمي','تنمية مهارات التجريب الآمن'],
  method:['تجربة عملية','ملاحظة واستقصاء','عرض نموذج علمي','عمل مجموعات','تسجيل النتائج وتفسيرها','مناقشة علمية','تقويم تطبيقي'],
  participation:['تحسن في تفسير النتائج','تفاعل مرتفع أثناء التطبيق العملي','تفاوت في مهارات الاستقصاء','تحسن في استخدام الأدوات والإجراءات','حاجة بعض الطلاب إلى دعم إضافي']
 },
 'اللغة الإنجليزية':{
  reason:['تنمية المهارة اللغوية المستهدفة','زيادة الممارسة الفعلية للغة','رفع الثروة اللغوية','معالجة ضعف في مهارة محددة','رفع الثقة في التواصل باللغة الإنجليزية'],
  method:['محادثة موجهة','تدريب على المفردات','استماع وتطبيق','قراءة موجهة','كتابة قصيرة','عمل أزواج أو مجموعات','نشاط تفاعلي'],
  participation:['تحسن في المشاركة باللغة الإنجليزية','تحسن في النطق أو المفردات','تفاوت في الطلاقة','ارتفاع الثقة في التواصل','حاجة بعض الطلاب إلى ممارسة إضافية']
 },
 'المهارات الرقمية':{
  reason:['تنمية مهارات رقمية تطبيقية','رفع الوعي بالأمان الرقمي','تنمية مهارات البرمجة وحل المشكلات','توظيف التقنية في التعلم','رفع جودة المنتج الرقمي'],
  method:['تطبيق عملي على الأجهزة','مشروع رقمي','تدريب برمجي متدرج','مهمة إنتاج رقمية','عمل تعاوني','عرض ومناقشة منتجات رقمية'],
  participation:['إنتاج منتجات رقمية','تحسن في استخدام الأدوات','تفاوت في المهارات التقنية','تعاون جيد في المشروعات','حاجة بعض الطلاب إلى دعم تقني إضافي']
 },
 'الدراسات الاجتماعية':{
  reason:['تنمية فهم المفاهيم الاجتماعية والوطنية','تعزيز المواطنة والمسؤولية','ربط المفهوم بالواقع والمجتمع','تنمية مهارات البحث والاستقصاء','تعزيز الهوية والانتماء'],
  method:['مناقشة وتحليل مواقف','خرائط ومصادر بصرية','مشروع أو بحث قصير','عمل جماعي','عرض طلابي','ربط بحدث أو مناسبة وطنية'],
  participation:['ارتفاع المشاركة في النقاش','تحسن في ربط المفاهيم بالواقع','ظهور مبادرات طلابية','تفاوت في عمق الفهم','إنتاج أعمال مرتبطة بالموضوع']
 }
};
const OCCASIONS=[
 {test:/اليوم العالمي|يوم عالمي/,label:'مناسبة عالمية',duration:'يوم واحد',reason:'تفعيل مناسبة تربوية أو عالمية',methods:['إذاعة أو عرض توعوي','أركان تعريفية','مسابقة مرتبطة بالمناسبة','أنشطة صفية','معرض أو منتجات طلابية','رسائل توعوية','مشاركة رقمية']},
 {test:/يوم التأسيس|اليوم الوطني/,label:'مناسبة وطنية',duration:'يوم واحد',reason:'تفعيل مناسبة وطنية وتعزيز الهوية',methods:['إذاعة مدرسية','أركان وطنية','مسابقات ثقافية','معرض أو منتجات طلابية','مشاركة رقمية','أنشطة صفية مرتبطة بالمناسبة']},
 {test:/الدفاع المدني|السلامة|الامن والسلامه|الأمن والسلامة/,label:'أمن وسلامة',duration:'يوم واحد',reason:'تعزيز الوعي بالأمن والسلامة',methods:['عرض توعوي','تدريب عملي','تجربة إخلاء','أركان توعوية','مشاركة جهة مختصة','مواد ورسائل توعوية']}
];
function context(){const p=preview101(raw());const selected=mem('subjects').split('|||').filter(Boolean)[0];return{...p,subjectName:selected||p.subject?.name||'',familyName:mem('family')||p.family?.type||'',subtypeName:mem('subtype')||p.subtype||''}}
function occasion(r){return OCCASIONS.find(x=>x.test.test(r))||null}
function merge(a,b){return[...new Set([...(b||[]),...(a||[])])].slice(0,9)}
function optionsFor(c,id){let list=BASE[c.familyName]?.[id]||[];const sp=SUBJECT[c.subjectName]?.[id];if(sp)list=merge(list,sp);const oc=occasion(raw());if(c.familyName==='برنامج / فعالية'&&oc){if(id==='reason')list=merge(list,[oc.reason]);if(id==='method')list=merge(list,oc.methods);if(id==='participation')list=merge(list,['تنفيذ الأنشطة المخطط لها','تفاعل المستفيدين مع المناسبة','إنتاج أعمال مرتبطة بالمناسبة','تفاوت في مستوى المشاركة','ظهور احتياج لمتابعة إضافية'])}return list}
function setField(group,id,value,proposed=false){const h=$(`[data-family-field="${id}"]`,group);if(!h)return;h.value=value;h.dispatchEvent(new Event('input',{bubbles:true}));$$(`[data-family-pick="${id}"]`,group).forEach(b=>b.classList.toggle('on',b.dataset.familyValue===value));group.dataset.auto102=proposed?'proposed':'confirmed';let badge=$('.autoBadge102',group);if(!badge){badge=document.createElement('span');badge.className='autoBadge102';group.querySelector('small')?.insertAdjacentElement('afterend',badge)}badge.textContent=proposed?'مقترح من المحرك — يمكنك تغييره':'فهمه المحرك من وصفك'}
function renderGroup(group,c){const hidden=$('[data-family-field]',group),grid=$('.choiceGrid',group);if(!hidden||!grid)return;const id=hidden.dataset.familyField,opts=optionsFor(c,id);if(!opts.length)return;const sig=`${c.familyName}|${c.subjectName}|${occasion(raw())?.label||''}|${id}`;if(group.dataset.smart102===sig)return;group.dataset.smart102=sig;const old=hidden.value;grid.innerHTML=opts.map(x=>`<button type="button" class="chip v102Choice ${old===x?'on':''}" data-family-pick="${id}" data-family-value="${x}">${x}</button>`).join('');const title=FAMILY_FIELDS[c.familyName]?.[id];const q=group.querySelector('b,h3,.questionTitle');if(title&&q)q.textContent=title;const oc=occasion(raw());if(c.familyName==='برنامج / فعالية'&&id==='reason'&&oc&&!old)setField(group,id,oc.reason,true)}
function prefillDuration(c,root){const oc=occasion(raw());if(!oc)return;const explicit=c.duration;if(explicit){chooseDuration(explicit,root,false);return}chooseDuration(oc.duration,root,true)}
function chooseDuration(value,root,proposed){const input=$('#durationSuggested',root);if(input&&(!input.value||input.dataset.auto102==='1')){input.value=value;input.dataset.auto102='1';input.dispatchEvent(new Event('input',{bubbles:true}))}const btn=$$('button',root).find(b=>clean(b.textContent)===value);if(btn&&!btn.classList.contains('on')){btn.classList.add('on');if(btn.dataset.duration||btn.dataset.durationChoice){btn.click()}}let box=$('.durationContext',root)||input?.closest('.field,.fullField');if(box){let note=$('.durationHint102',box);if(!note){note=document.createElement('div');note.className='durationHint102';box.appendChild(note)}note.textContent=proposed?`المدة المقترحة: ${value} — عدّلها إذا استمر التفعيل أكثر.`:`فهمت المدة من وصفك: ${value}.`}}
function addContextSummary(c,root){const card=$('.familyDetailsStep',root)||$('section.card',root);if(!card)return;let box=$('.smartSummary102',card);if(!box){box=document.createElement('div');box.className='smartSummary102';const anchor=card.querySelector('.lead');anchor?.insertAdjacentElement('afterend',box)}if(!box)return;const bits=[c.subtypeName||c.familyName,c.subjectName,c.topic,c.stage,(c.grades||[])[0],c.duration||occasion(raw())?.duration].filter(Boolean);box.innerHTML=`<small>فهمت من وصفك</small><div>${[...new Set(bits)].map(x=>`<span>${x}</span>`).join('')}</div><p>عبأت فقط ما كان واضحًا أو ذا احتمال قوي. يمكنك تغيير أي اقتراح.</p>`}
function apply(root=document){const c=context();if(!$('.familyDetailsStep',root))return;addContextSummary(c,root);$$('.familyChoice',root).forEach(g=>renderGroup(g,c));prefillDuration(c,root)}
export function installSmartPage2102(root=document){document.addEventListener('click',e=>{const b=e.target.closest('[data-family-pick]');if(!b)return;const g=b.closest('.familyChoice'),h=g?.querySelector('[data-family-field]');if(h){h.value=b.dataset.familyValue||'';h.dispatchEvent(new Event('input',{bubbles:true}));$$(`[data-family-pick="${h.dataset.familyField}"]`,g).forEach(x=>x.classList.toggle('on',x===b));g.querySelector('.autoBadge102')?.remove()}},true);new MutationObserver(()=>requestAnimationFrame(()=>apply(root))).observe(root,{childList:true,subtree:true});apply(root)}
