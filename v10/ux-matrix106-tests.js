import assert from 'node:assert/strict';
import {matrix106,nextAdaptiveQuestion106} from './matrix106.js';
const personas=[
 ['معلم القرآن والدراسات الإسلامية','القرآن الكريم والدراسات الإسلامية','', 'برنامج لتحسين تلاوة القرآن'],
 ['معلم اللغة العربية','اللغة العربية','', 'برنامج لتحسين القراءة'],
 ['معلم الرياضيات','الرياضيات','', 'عمل في الكسور'],
 ['معلم العلوم','العلوم','', 'نشاط تجربة علمية'],
 ['معلم اللغة الإنجليزية','اللغة الإنجليزية','', 'نشاط Reading باللغة الإنجليزية'],
 ['معلم المهارات الرقمية','المهارات الرقمية','', 'مشروع برمجة رقمي'],
 ['معلم الدراسات الاجتماعية','الدراسات الاجتماعية','', 'نشاط عن المواطنة'],
 ['معلم التربية الفنية','التربية الفنية','', 'نشاط فني تطبيقي'],
 ['معلم التربية البدنية','التربية البدنية','', 'نشاط مهارة حركية'],
 ['معلم المهارات الحياتية','المهارات الحياتية والأسرية','', 'نشاط مهارة حياتية'],
 ['رائد النشاط','', 'النشاط الطلابي','فعالية طلابية'],
 ['مسؤول الموهوبين','', 'الموهوبون','برنامج إثرائي للموهوبين'],
 ['معلم التربية الخاصة','', 'الشمول وذوو الإعاقة','متابعة دعم طالب'],
 ['الموجه الطلابي','', 'التوجيه الطلابي','برنامج توجيهي للطلاب']
];
const stages=[['ابتدائي','الصف الرابع'],['متوسط','الصف الثاني المتوسط'],['ثانوي','الصف الثاني الثانوي']];
const families=['برنامج / فعالية','اجتماع / متابعة إدارية','تحليل نتائج','خطة','إجراء متابعة','تطوير مهني','شراكة مجتمعية','صيانة وتجهيزات'];
function stateFor(p,stage,family){const [role,subject,domain,raw]=p;return{raw:`${raw} - ${stage[1]}`,classification:{type:family,subtype:family==='خطة'?'خطة علاجية':''},metadata:{familyDetails:{subject94:subject},subjectHint101:subject,schoolDomain101:domain,semantic101:{}},audiences:['الطلاب'],stage:stage[0],grades:[stage[1]],topic:subject==='الرياضيات'?'الكسور':subject==='اللغة العربية'?'القراءة':'',answers:{goals:[],evidence:[]},attachments:[]}}
function answer(q){const opts=q.opts||[];if(!opts.length)return'إجابة تجريبية';if(q.id==='participation'){return opts.find(x=>/مشاركة|تعاون|تفاعل/.test(x))||opts[0]}if(q.id==='measurement')return'لم يتم القياس بعد';return opts[0]}
function runOne(p,stage,family){const s=stateFor(p,stage,family),seen=[];for(let i=0;i<12;i++){matrix106(s);const r=nextAdaptiveQuestion106(s);if(r.done)return{done:true,steps:seen.length,seen,state:s};const id=r.question.id;if(seen.includes(id))return{done:false,steps:seen.length,seen,error:`تكرر السؤال ${id}`};seen.push(id);s.metadata.familyDetails[id]=answer(r.question)}return{done:false,steps:seen.length,seen,error:'لم ينته المسار خلال 12 سؤالًا'}}
const rows=[];for(const p of personas)for(const st of stages)for(const f of families)rows.push({role:p[0],stage:st[0],family:f,...runOne(p,st,f)});
for(const r of rows){assert.equal(r.done,true,`${r.role} / ${r.stage} / ${r.family}: ${r.error||'فشل'}`);assert.ok(r.steps<=8,`${r.role} / ${r.family}: أسئلة كثيرة ${r.steps}`)}
const total=rows.length,avg=rows.reduce((a,b)=>a+b.steps,0)/total,max=Math.max(...rows.map(x=>x.steps)),min=Math.min(...rows.map(x=>x.steps));
const byFamily=Object.fromEntries(families.map(f=>{const x=rows.filter(r=>r.family===f);return[f,{avg:Number((x.reduce((a,b)=>a+b.steps,0)/x.length).toFixed(2)),max:Math.max(...x.map(r=>r.steps)),min:Math.min(...x.map(r=>r.steps))}]}));
const byStage=Object.fromEntries(stages.map(st=>{const x=rows.filter(r=>r.stage===st[0]);return[st[0],Number((x.reduce((a,b)=>a+b.steps,0)/x.length).toFixed(2))]}));
const byRole=Object.fromEntries(personas.map(p=>{const x=rows.filter(r=>r.role===p[0]);return[p[0],Number((x.reduce((a,b)=>a+b.steps,0)/x.length).toFixed(2))]}));
console.log(JSON.stringify({total,passed:rows.filter(x=>x.done).length,avgSteps:Number(avg.toFixed(2)),minSteps:min,maxSteps:max,byFamily,byStage,byRole,samples:rows.filter((_,i)=>i%29===0).slice(0,12).map(x=>({role:x.role,stage:x.stage,family:x.family,steps:x.steps,sequence:x.seen}))},null,2));
