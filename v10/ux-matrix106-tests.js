import assert from 'node:assert/strict';
import {matrix106,nextAdaptiveQuestion106} from './matrix106.js';
const specialties=[
 ['معلم القرآن والدراسات الإسلامية','القرآن الكريم والدراسات الإسلامية','', 'سويت شي للطلاب عشان التلاوة'],
 ['معلم اللغة العربية','اللغة العربية','', 'سويت برنامج قراءة للطلاب'],
 ['معلم الرياضيات','الرياضيات','', 'عندي ضعف بالكسور وسويت لهم عمل'],
 ['معلم العلوم','العلوم','', 'سوينا تجربة علمية للطلاب'],
 ['معلم اللغة الإنجليزية','اللغة الإنجليزية','', 'سويت نشاط Reading'],
 ['معلم المهارات الرقمية','المهارات الرقمية','', 'سويت مشروع برمجة'],
 ['معلم الدراسات الاجتماعية','الدراسات الاجتماعية','', 'فعلت نشاط عن المواطنة'],
 ['معلم التربية الفنية','التربية الفنية','', 'سوينا نشاط فني'],
 ['معلم التربية البدنية','التربية البدنية','', 'سويت نشاط مهارة حركية'],
 ['معلم المهارات الحياتية','المهارات الحياتية والأسرية','', 'سويت نشاط مهارة حياتية'],
 ['رائد النشاط','', 'النشاط الطلابي','فعلنا يوم عالمي'],
 ['مسؤول الموهوبين','', 'الموهوبون','سويت برنامج للطلاب الموهوبين'],
 ['معلم التربية الخاصة','', 'الشمول وذوو الإعاقة','تابعت دعم طالب'],
 ['الموجه الطلابي','', 'التوجيه الطلابي','سويت برنامج توجيهي للطلاب']
];
const literacy=[
 {id:'غير تقني',description:'يكتب عبارة قصيرة عامية، لا يعرف المصطلحات الإدارية، ويختار أوضح خيار دون تعديل متقدم'},
 {id:'متوسط',description:'يعرف النماذج الأساسية ويكتب وصفًا مختصرًا أوضح'},
 {id:'تقني',description:'يكتب وصفًا منظمًا ويستفيد من التصنيف والخيارات الدقيقة'}
];
const stages=[['ابتدائي','الصف الرابع'],['متوسط','الصف الثاني المتوسط'],['ثانوي','الصف الثاني الثانوي']];
const families=['برنامج / فعالية','اجتماع / متابعة إدارية','تحليل نتائج','خطة','إجراء متابعة','تطوير مهني','شراكة مجتمعية','صيانة وتجهيزات'];
function rawFor(p,level,family,stage){const base=p[3];if(level.id==='غير تقني')return`${base} ${stage[1]}`;if(level.id==='متوسط')return`${base} لطلاب ${stage[1]} وأحتاج توثيق ${family}`;return`تم تنفيذ ${family} في ${p[1]||p[2]||'المجال المدرسي'} لطلاب ${stage[1]} بهدف تحسين الممارسة وتوثيق التنفيذ`}
function stateFor(p,level,stage,family){const [role,subject,domain]=p;return{raw:rawFor(p,level,family,stage),classification:{type:family,subtype:family==='خطة'?'خطة علاجية':''},metadata:{familyDetails:{subject94:subject},subjectHint101:subject,schoolDomain101:domain,semantic101:{}},audiences:['الطلاب'],stage:stage[0],grades:[stage[1]],topic:subject==='الرياضيات'?'الكسور':subject==='اللغة العربية'?'القراءة':'',answers:{goals:[],evidence:[]},attachments:[]}}
function answer(q,level){const opts=q.opts||[];if(!opts.length)return level.id==='غير تقني'?'تم':'إجابة تجريبية';if(q.id==='participation')return opts.find(x=>/مشاركة|تعاون|تفاعل/.test(x))||opts[0];if(q.id==='measurement')return'لم يتم القياس بعد';return opts[0]}
function runOne(p,level,stage,family){const s=stateFor(p,level,stage,family),seen=[],optionCounts=[];for(let i=0;i<12;i++){matrix106(s);const r=nextAdaptiveQuestion106(s);if(r.done)return{done:true,steps:seen.length,seen,optionCounts,state:s};const q=r.question,id=q.id;if(!q.q||!/\S/.test(q.q))return{done:false,error:'سؤال بلا نص',seen};if(seen.includes(id))return{done:false,steps:seen.length,seen,error:`تكرر السؤال ${id}`};if((q.opts||[]).length>10)return{done:false,error:`خيارات كثيرة ${q.opts.length}`,seen};seen.push(id);optionCounts.push((q.opts||[]).length);s.metadata.familyDetails[id]=answer(q,level)}return{done:false,steps:seen.length,seen,error:'لم ينته المسار خلال 12 سؤالًا'}}
const rows=[];for(const p of specialties)for(const level of literacy)for(const st of stages)for(const f of families)rows.push({role:p[0],literacy:level.id,stage:st[0],family:f,...runOne(p,level,st,f)});
for(const r of rows){assert.equal(r.done,true,`${r.role} / ${r.literacy} / ${r.stage} / ${r.family}: ${r.error||'فشل'}`);assert.ok(r.steps<=8,`${r.role} / ${r.literacy} / ${r.family}: أسئلة كثيرة ${r.steps}`);if(r.literacy==='غير تقني')assert.ok(r.optionCounts.every(n=>n<=10),'واجهة غير مناسبة لغير التقني')}
const total=rows.length,avg=rows.reduce((a,b)=>a+b.steps,0)/total,max=Math.max(...rows.map(x=>x.steps)),min=Math.min(...rows.map(x=>x.steps));
const group=(key,values)=>Object.fromEntries(values.map(v=>{const x=rows.filter(r=>r[key]===v);return[v,{runs:x.length,success:x.filter(r=>r.done).length,avgSteps:Number((x.reduce((a,b)=>a+b.steps,0)/x.length).toFixed(2)),maxSteps:Math.max(...x.map(r=>r.steps))}]}));
const byLiteracy=group('literacy',literacy.map(x=>x.id)),byStage=group('stage',stages.map(x=>x[0])),byFamily=group('family',families),byRole=group('role',specialties.map(x=>x[0]));
const novice=rows.filter(r=>r.literacy==='غير تقني'),noviceSuccess=novice.filter(r=>r.done).length/novice.length;
assert.equal(noviceSuccess,1,'يجب أن يستطيع المستخدم غير التقني إكمال كل المسارات');
console.log(JSON.stringify({total,passed:rows.filter(x=>x.done).length,successRate:`${(rows.filter(x=>x.done).length/total*100).toFixed(1)}%`,noviceRuns:novice.length,noviceSuccessRate:`${(noviceSuccess*100).toFixed(1)}%`,avgSteps:Number(avg.toFixed(2)),minSteps:min,maxSteps:max,byLiteracy,byStage,byFamily,byRole,samples:rows.filter((_,i)=>i%83===0).slice(0,15).map(x=>({role:x.role,literacy:x.literacy,stage:x.stage,family:x.family,steps:x.steps,sequence:x.seen}))},null,2));
