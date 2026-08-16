import {preview100} from './intelligence100.js?v=100';
const cases=[
 ['نفذت برنامج عن القرآن',{family:'برنامج / فعالية',subject:'القرآن الكريم والدراسات الإسلامية',topic:'القرآن الكريم'}],
 ['سويت مسابقة لحفظ سورة الملك لطلاب الأول المتوسط',{family:'برنامج / فعالية',subject:'القرآن الكريم والدراسات الإسلامية',topic:'حفظ القرآن الكريم',stage:'متوسط'}],
 ['عملت برنامج لتحسين خط طلاب الصف الأول المتوسط',{family:'برنامج / فعالية',subject:'اللغة العربية',topic:'الخط والكتابة',stage:'متوسط'}],
 ['سويت برنامج عن الكسور',{family:'برنامج / فعالية',subject:'الرياضيات',topic:'الكسور'}],
 ['نفذت نشاط عن التجويد',{family:'برنامج / فعالية',subject:'القرآن الكريم والدراسات الإسلامية',topic:'أحكام التجويد'}],
 ['قدمت ورشة للمعلمين عن استراتيجيات تدريس العلوم',{family:'تطوير مهني',subject:'العلوم'}]
];
export function runAcceptance100(){return cases.map(([raw,want])=>{const got=preview100(raw),actual={family:got.family?.type||'',subject:got.subject?.name||'',topic:got.topic||'',stage:got.stage||''};const ok=Object.entries(want).every(([k,v])=>actual[k]===v);return{raw,want,actual,ok}})}
if(globalThis.__SCHOOL_ENGINE100_TEST__)console.table(runAcceptance100());
