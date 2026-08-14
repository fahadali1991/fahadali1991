import {titleCandidates62,validateTitle62} from './title62.js';
const base=(over={})=>({raw:'',topic:'',audiences:['الطلاب'],stage:'متوسط',grades:['الأول المتوسط'],metadata:{},classification:{type:'برنامج / فعالية',subtype:'برنامج'},...over});
const cases=[
 {name:'technology one grade',s:base({raw:'استخدمت التقنية في تدريس الطلاب',grades:['الأول المتوسط']}),must:'برنامج توظيف التقنية في التدريس لطلاب الصف الأول المتوسط'},
 {name:'technology two grades',s:base({raw:'استخدمت التقنية في تدريس الطلاب',grades:['الأول المتوسط','الثاني المتوسط']}),must:'برنامج توظيف التقنية في التدريس لطلاب الصفين الأول والثاني المتوسط'},
 {name:'technology three grades',s:base({raw:'استخدمت التقنية في تدريس الطلاب',grades:['الأول المتوسط','الثاني المتوسط','الثالث المتوسط']}),must:'برنامج توظيف التقنية في التدريس لطلاب الصفوف الأول، الثاني والثالث المتوسط'},
 {name:'analysis one grade',s:base({raw:'حللت نتائج الطلاب',classification:{type:'تحليل نتائج',subtype:'تحليل نتائج'}}),must:'تحليل نتائج طلاب الصف الأول المتوسط'},
 {name:'diagnostic analysis',s:base({raw:'حللت نتائج الاختبار التشخيصي',classification:{type:'تحليل نتائج',subtype:'تحليل نتائج'}}),must:'تحليل نتائج الاختبار التشخيصي لدى طلاب الصف الأول المتوسط'},
 {name:'reading program',s:base({raw:'نفذت نشاط قراءة وفهم قرائي',classification:{type:'برنامج / فعالية',subtype:'نشاط'}}),must:'نشاط تنمية مهارات القراءة والفهم القرائي لطلاب الصف الأول المتوسط'}
];
export function runTitle62SelfTests(){const failures=[];for(const c of cases){const got=titleCandidates62(c.s)[0]||'';if(got!==c.must)failures.push({name:c.name,expected:c.must,got});if(got&&!validateTitle62(got))failures.push({name:c.name+' validator',expected:'valid',got})}const forbidden=['برنامج استخدمت التقنية في تدريس الطلاب','تحليل نتائج تحليل نتائج الصف الأول متوسط','برنامج برنامج القراءة'];for(const x of forbidden)if(validateTitle62(x))failures.push({name:'forbidden title passed',got:x});return failures}
