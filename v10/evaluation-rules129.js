const clean=v=>String(v??'').replace(/\s+/g,' ').trim();

export const V129_FORBIDDEN_FROM_TOTAL_SCORE=Object.freeze([
 'precise_skill_gap',
 'weakness_cause',
 'learning_style',
 'measured_impact',
 'system_pass_fail_without_system_scope'
]);

export function number129(value){
 const raw=String(value??'')
  .replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d))
  .replace(/٫/g,'.')
  .replace(/,/g,'.')
  .trim();
 const n=Number(raw);
 return Number.isFinite(n)?n:null;
}

export function normalizeSubject129(value){
 const s=clean(value).toLowerCase();
 if(!s)return'';
 if(['لغتي','عربي','العربي','لغة عربية','اللغة العربية'].includes(s))return'اللغة العربية';
 if(['رياضيات','الرياضيات'].includes(s))return'الرياضيات';
 if(['دين','اسلامية','إسلامية','التربية الإسلامية','قرآن','القرآن','القرآن الكريم والدراسات الإسلامية'].includes(s))return'القرآن الكريم والدراسات الإسلامية';
 return clean(value);
}

export function normalizePurpose129(value){
 const s=clean(value);
 if(/تشخيص|قبلي/.test(s))return'diagnostic';
 if(/تكوين|مستمر|بنائي/.test(s))return'formative';
 if(/ختام|نهائي|نهاية/.test(s))return'summative';
 return'unknown';
}

export function normalizeStage129(value){
 const s=clean(value);
 if(/ابتد/.test(s))return'primary';
 if(/متوسط/.test(s))return'middle';
 if(/ثانو/.test(s))return'secondary';
 return'unknown';
}

const ordinalMap=new Map([
 ['الأول',1],['اول',1],['أول',1],['1',1],['١',1],
 ['الثاني',2],['ثاني',2],['2',2],['٢',2],
 ['الثالث',3],['ثالث',3],['3',3],['٣',3],
 ['الرابع',4],['رابع',4],['4',4],['٤',4],
 ['الخامس',5],['خامس',5],['5',5],['٥',5],
 ['السادس',6],['سادس',6],['6',6],['٦',6]
]);

export function gradeIndex129(value){
 const s=clean(value);
 for(const [token,n] of ordinalMap){if(s.includes(token))return n}
 const n=number129(s.match(/[0-9٠-٩]+/)?.[0]);
 return n&&n>=1&&n<=6?n:null;
}

export function evidenceStrength129(value){
 const v=clean(value)||'total_score';
 if(v==='multi_evidence')return{type:v,rank:4,label:'أدلة متعددة'};
 if(v==='standards')return{type:v,rank:3,label:'أدلة معايير'};
 if(v==='skill_scores')return{type:v,rank:2,label:'درجات مهارات/أسئلة'};
 return{type:'total_score',rank:1,label:'درجة كلية فقط'};
}

export function evaluationPolicy129(context={}){
 const stage=normalizeStage129(context.stage),grade=gradeIndex129(context.grade),subject=normalizeSubject129(context.subject),purpose=normalizePurpose129(context.purpose),scope=clean(context.resultScope)||'single_assessment';
 const earlyPrimary=stage==='primary'&&(grade===1||grade===2);
 const arabicOrMath=subject==='اللغة العربية'||subject==='الرياضيات';
 const standardsBased=earlyPrimary&&!arabicOrMath;
 const systemGradeScope=['subject_period','final_subject','year_subject'].includes(scope);
 let gradeScale={enabled:false,id:null,reason:'درجة الاختبار لا تعني تلقائيًا تقدير المادة النظامي'};
 if(systemGradeScope&&((stage==='primary'&&grade!==null&&grade>=3)||(stage==='middle'))){gradeScale={enabled:true,id:'primary3-middle-v2025',reason:'السياق يمثل نتيجة مادة نظامية ضمن المرحلة التي يطبق عليها هذا السلم'}}
 if(stage==='secondary'&&systemGradeScope){gradeScale={enabled:false,id:null,reason:'سلم الثانوية التفصيلي غير مرمز في V129 حتى يثبت في جدول مستقل موثق ومختبر'}}
 return{
  stage,grade,subject,purpose,resultScope:scope,
  evaluationMode:standardsBased?'standards_based':'score_or_evidence_based',
  requiresStandardsEvidence:standardsBased,
  earlyPrimaryArabicMathException:earlyPrimary&&arabicOrMath,
  gradeScale,
  individualMastery:{officialFixed80:false,criterionRequired:true,source:'explicit_or_assessment_design'},
  cohortTeachingRule:{enabled:true,bands:['gte80','gte50_lt80','lt50'],basis:'share_of_students_meeting_explicit_criterion'},
  relativePosition:{decisionAuthority:false,label:'تفسير إضافي فقط'},
  canInferLearningStyleFromScores:false,
  canInferWeaknessCauseFromScores:false,
  canClaimImpactBeforeRemeasurement:false,
  forbiddenFromTotalScore:[...V129_FORBIDDEN_FROM_TOTAL_SCORE]
 };
}

export function gradeLabelForSystemResult129({pct,policy}){
 const p=number129(pct);
 if(p===null||!policy?.gradeScale?.enabled)return null;
 if(policy.gradeScale.id==='primary3-middle-v2025'){
  if(p>=90)return'ممتاز';
  if(p>=80)return'جيد جدًا';
  if(p>=70)return'جيد';
  if(p>=50)return'مقبول';
  return'راسب';
 }
 return null;
}

export function cohortTeachingDecision129({achievedCount,totalCount}){
 const a=number129(achievedCount),t=number129(totalCount);
 if(a===null||t===null||t<=0||a<0||a>t)return{ready:false};
 const rate=a/t*100;
 if(rate>=80)return{ready:true,rate,band:'continue_targeted_support',label:'استمرار التدريس مع دعم مستهدف',actions:['الاستمرار في الخطة','دعم من لم يحقق المحك','إعادة قياس المستهدفين']};
 if(rate>=50)return{ready:true,rate,band:'differentiate',label:'تعليم متمايز',actions:['دعم موجه لمن لم يحقق','أنشطة إثرائية/تحدٍ مناسب لمن حقق','إعادة قياس']};
 return{ready:true,rate,band:'reteach',label:'إعادة تدريس أوسع',actions:['إعادة تدريس الموضوع/المهارة','تنويع الاستراتيجية','إعادة قياس لاحقة']};
}

export function studentDecision129({score,maxScore,criterionPct,evidenceType='total_score',purpose='unknown',outcomeMastered=null,remeasurement=null}={}){
 const scoreN=number129(score),maxN=number129(maxScore),criterion=number129(criterionPct),strength=evidenceStrength129(evidenceType),p=normalizePurpose129(purpose);
 if(scoreN===null||maxN===null||maxN<=0)return{ready:false,reason:'missing_score'};
 const pct=scoreN/maxN*100;
 const impactAllowed=remeasurement&&number129(remeasurement.before)!==null&&number129(remeasurement.after)!==null;
 if(criterion===null&&outcomeMastered===null)return{ready:true,pct,decision:'insufficient_for_mastery',label:'لا يكفي للحكم على الإتقان',remedial:false,enrichment:'not_determined',impactAllowed,strength};
 const met=outcomeMastered===true||(outcomeMastered===null&&criterion!==null&&pct>=criterion);
 if(!met)return{ready:true,pct,criterionPct:criterion,decision:'support',label:'يحتاج دعمًا',remedial:true,enrichment:false,impactAllowed,strength};
 const enrichment=strength.rank>=2||outcomeMastered===true?'eligible':'candidate';
 return{ready:true,pct,criterionPct:criterion,decision:'mastered',label:'محقق للإتقان',remedial:false,enrichment,impactAllowed,strength,note:enrichment==='candidate'?'الدرجة الكلية المرتفعة مؤشر ترشيح، وليست وحدها دليلًا كافيًا على إتقان كل ناتج مستهدف':null};
}

export function diagnosticDisplay129({score,maxScore,criterionPct=null}={}){
 const scoreN=number129(score),maxN=number129(maxScore),criterion=number129(criterionPct);
 if(scoreN===null||maxN===null||maxN<=0)return{ready:false};
 const pct=scoreN/maxN*100;
 return{ready:true,pct,systemPassFail:null,baselineLabel:`خط الأساس ${Number(pct.toFixed(1))}٪`,supportStatus:criterion===null?'غير محدد حتى يعرّف المحك':pct<criterion?'يحتاج دعمًا':'حقق المحك'};
}
