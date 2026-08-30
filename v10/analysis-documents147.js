import {analysisDecisionModel131} from './analysis-decision131.js?v=133';
import {explicitCriterion131} from './analysis-data131.js?v=133';

export const ANALYSIS_COLORS147=Object.freeze({support:'#B84B47',mastered:'#16876F',advanced:'#3D7EB9'});

export const ANALYSIS_DOCUMENTS147=Object.freeze({
 analysis:{id:'analysis',title:'تحليل النتائج',purpose:'قراءة النتائج واتخاذ القرار التعليمي',required:['subject','grade','assessment','maxScore','scores'],inherits:['school','office','year','principal','executor','section','period','names','targetLevel','skill']},
 classification:{id:'classification',title:'تصنيف الطلاب',purpose:'تحديد موقع كل طالب داخل الفئات التعليمية',required:['subject','grade','maxScore','scores'],inherits:['school','office','year','principal','executor','section','assessment','period','names','targetLevel']},
 remedial:{id:'remedial',title:'الخطة العلاجية',purpose:'سد الفجوة التعليمية ورفع مستوى الإتقان',required:['targetStudents'],inherits:['school','office','year','principal','executor','subject','grade','section','assessment','period','scores','targetLevel','skill']},
 enrichment:{id:'enrichment',title:'الخطة الإثرائية',purpose:'توسيع التعلم وتنمية التفكير والإبداع',required:['targetStudents'],inherits:['school','office','year','principal','executor','subject','grade','section','assessment','period','scores','targetLevel','skill']}
});

const clean=v=>String(v??'').trim();
export function analysisMode147(state){return clean(state?.metadata?.directEntry134||'analysis')||'analysis'}

export function analysisSemanticGroups147(state){
 const model=analysisDecisionModel131(state),criterion=explicitCriterion131(state);
 if(!model?.ready||!criterion?.defined)return{ready:false,model,criterion,groups:[]};
 const g=model.groupMap||{},total=Number(model.total||0);
 const defs=[
  ['support','يحتاج دعمًا',ANALYSIS_COLORS147.support],
  ['mastered','محقق للإتقان',ANALYSIS_COLORS147.mastered],
  ['advanced','مرشح للإثراء',ANALYSIS_COLORS147.advanced]
 ];
 const groups=defs.map(([id,label,color])=>{const count=Number(g[id]?.count||0);return{id,label,color,count,pct:total?count/total*100:0}});
 return{ready:true,model,criterion,total,groups};
}

export function availableAnalysisDocuments147(state){
 const mode=analysisMode147(state),sem=analysisSemanticGroups147(state),m=sem.model;
 if(!m?.ready)return[];
 const available=[{...ANALYSIS_DOCUMENTS147.analysis,reason:'بيانات الدرجات الحالية تكفي لإنشاء التحليل'},{...ANALYSIS_DOCUMENTS147.classification,reason:'يمكن تصنيف الطلاب من نفس بيانات الدرجات'}];
 if(sem.ready){
  const support=sem.groups.find(x=>x.id==='support')?.count||0;
  const advanced=sem.groups.find(x=>x.id==='advanced')?.count||0;
  if(support)available.push({...ANALYSIS_DOCUMENTS147.remedial,count:support,reason:`${support} من الطلاب يحتاجون دعمًا وفق مستوى الإتقان المستهدف`});
  if(advanced)available.push({...ANALYSIS_DOCUMENTS147.enrichment,count:advanced,reason:`${advanced} من الطلاب مرشحون للإثراء وفق النتائج الحالية`});
 }
 return available.filter(x=>x.id!==mode);
}

export function analysisDocumentAvailability147(state){
 return{current:analysisMode147(state),next:availableAnalysisDocuments147(state),registry:ANALYSIS_DOCUMENTS147};
}
