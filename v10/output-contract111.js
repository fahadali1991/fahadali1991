// V111 — Reverse-engineered output contract.
// Source of truth: V10_OUTPUT_REVERSE_ENGINEERING.md.
// Every collected field must have an explicit destination in the final document.

export const VISIBLE_FAMILIES111=[
 'برنامج / فعالية',
 'اجتماع / متابعة إدارية',
 'تحليل نتائج',
 'خطة',
 'إجراء متابعة',
 'تطوير مهني'
];

const common=[
 {id:'title',label:'عنوان الوثيقة',source:'title',destination:'title',required:true},
 {id:'executor',label:'المنفذ/المعد',source:'metadata.executorName',destination:'meta',required:true},
 {id:'date',label:'التاريخ',source:'metadata.dateISO',destination:'meta',required:false},
 {id:'audiences',label:'المستفيدون',source:'audiences',destination:'meta',required:true}
];

const familyMeta={
 'برنامج / فعالية':[
  {id:'place',label:'المكان',source:'metadata.place',destination:'meta',required:false},
  {id:'duration',label:'المدة',source:'metadata.duration',destination:'meta',required:false},
  {id:'count',label:'العدد',source:'metadata.count',destination:'meta',required:false},
  {id:'grades',label:'الصفوف',source:'grades',destination:'meta',required:false}
 ],
 'اجتماع / متابعة إدارية':[
  {id:'meetingChair',label:'رئيس الاجتماع',source:'metadata.familyMeta111.meetingChair',destination:'meta',required:false},
  {id:'minutesWriter',label:'معد المحضر',source:'metadata.familyMeta111.minutesWriter',destination:'meta',required:false},
  {id:'place',label:'المكان',source:'metadata.place',destination:'meta',required:false},
  {id:'startTime',label:'وقت البداية',source:'metadata.familyMeta111.startTime',destination:'meta',required:false},
  {id:'endTime',label:'وقت النهاية',source:'metadata.familyMeta111.endTime',destination:'meta',required:false},
  {id:'attendees',label:'الحضور',source:'metadata.familyMeta111.attendees',destination:'meta',required:false}
 ],
 'تحليل نتائج':[
  {id:'subject',label:'المادة',source:'metadata.familyDetails.subject94',destination:'meta',required:false},
  {id:'grades',label:'الصف',source:'grades',destination:'meta',required:false},
  {id:'assessmentType',label:'نوع الاختبار',source:'metadata.familyMeta111.assessmentType',destination:'meta',required:false},
  {id:'period',label:'الفترة',source:'metadata.familyMeta111.period',destination:'meta',required:false},
  {id:'testedCount',label:'عدد الطلاب/المختبرين',source:'metadata.familyMeta111.testedCount',destination:'meta',required:false}
 ],
 'خطة':[
  {id:'owner',label:'المعد/المسؤول',source:'metadata.familyDetails.owner',destination:'meta',required:false},
  {id:'startDate',label:'البداية',source:'metadata.familyMeta111.startDate',destination:'meta',required:false},
  {id:'endDate',label:'النهاية',source:'metadata.familyMeta111.endDate',destination:'meta',required:false},
  {id:'team',label:'الفريق',source:'metadata.familyMeta111.team',destination:'meta',required:false},
  {id:'target',label:'الفئة',source:'audiences',destination:'meta',required:false}
 ],
 'إجراء متابعة':[
  {id:'owner',label:'المسؤول',source:'metadata.familyDetails.owner',destination:'meta',required:false},
  {id:'period',label:'الفترة',source:'metadata.familyMeta111.period',destination:'meta',required:false},
  {id:'casesCount',label:'الحالات/العدد',source:'metadata.familyMeta111.casesCount',destination:'meta',required:false},
  {id:'followMethod',label:'وسيلة المتابعة',source:'metadata.familyDetails.method',destination:'meta',required:false}
 ],
 'تطوير مهني':[
  {id:'provider',label:'الجهة',source:'metadata.familyMeta111.provider',destination:'meta',required:false},
  {id:'hours',label:'الساعات',source:'metadata.familyMeta111.hours',destination:'meta',required:false},
  {id:'deliveryMode',label:'نمط التنفيذ',source:'metadata.familyMeta111.deliveryMode',destination:'meta',required:false},
  {id:'certificateOrPresenter',label:'الشهادة أو مقدم النشاط',source:'metadata.familyMeta111.certificateOrPresenter',destination:'meta',required:false}
 ]
};

export const NARRATIVE_TRACE111={
 'برنامج / فعالية':{goal:['goal'],summary:['reason','method','participation']},
 'اجتماع / متابعة إدارية':{goal:['purpose'],summary:['purpose','work','product','owner','follow']},
 'تحليل نتائج':{goal:[],summary:['basis','finding','cause','action','follow','measurement']},
 'خطة':{goal:['goal'],summary:['basis','method','owner','follow','measurement']},
 'إجراء متابعة':{goal:['goal'],summary:['method','action','follow']},
 'تطوير مهني':{goal:[],summary:['need','method','application','follow']}
};

export function outputContract111(family){
 if(!VISIBLE_FAMILIES111.includes(family))return null;
 return{family,metadata:[...common,...familyMeta[family]],trace:NARRATIVE_TRACE111[family]};
}

export function allOutputContracts111(){return VISIBLE_FAMILIES111.map(outputContract111)}
