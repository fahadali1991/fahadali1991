import assert from 'node:assert/strict';
import {analysisSummary113,analysisDataPanel113} from './v10/analysis-data113.js';
import {analysisNextSteps121} from './v10/evidence85.js';
import {analysisBody113} from './v10/pdf-analysis113.js';
import {routeNextQuestion106} from './v10/question-router106.js';
import {mediumText80,bulletText80} from './v10/description-texts80.js';
import {applyContext85} from './v10/context85b.js';

function state(scores=[15,16,18,19]){
  return {classification:{type:'تحليل نتائج'},stage:'متوسط',grades:['الأول المتوسط'],audiences:['الطلاب'],metadata:{analysis:{maxScore:'20',masteryPercent:'80',scores,names:[],rawRows:scores.join('\n'),invalid:[]},familyMeta111:{assessmentType:'اختبار فترة',period:'الفصل الدراسي الأول'},familyDetails:{subject94:'اللغة العربية'}},answers:{goals:[],evidence:[]}};
}

const s=state();
const sum=analysisSummary113(s);
assert.equal(sum.weak,1,'حد الإتقان 80٪ يجب أن يصنف 15/20 دون الإتقان');
assert.equal(sum.advanced,2,'المتقدمون يجب أن يشتقوا من الدرجات');

const steps=analysisNextSteps121(s);
assert.equal(steps[0].title,'إنشاء خطة علاجية');
assert.match(steps[0].detail,/1 من الطلاب دون حد الإتقان/);
assert.ok(steps.some(x=>x.title==='إنشاء خطة إثرائية'));
assert.ok(!steps.some(x=>/تغذية راجعة|قياس بعدي/.test(x.title)),'لا توصية تنفيذية دون إجراء منفذ');
assert.ok(!JSON.stringify(steps).match(/\b9[1-8]\b/),'أرقام الشواهد لا تقود توصيات المستخدم');

s.metadata.familyDetails.actionStatus='نُفذ فعلًا';
assert.ok(analysisNextSteps121(s).some(x=>x.title==='إدخال قياس بعدي'));
s.metadata.analysis.effectMeasured=true;
assert.ok(!analysisNextSteps121(s).some(x=>x.title==='إدخال قياس بعدي'));

const invalid=state([18]);
invalid.metadata.analysis.rawRows='18\n25\nغير صالح';
invalid.metadata.analysis.invalid=['25','غير صالح'];
invalid.metadata.editAnalysisData113=true;
const preview=analysisDataPanel113(invalid);
assert.match(preview,/معاينة قبل الاعتماد/);
assert.match(preview,/2 سطر مرفوض/);

const matrix={questions:[{id:'cause',q:'سبب؟',opts:['سبب مدعوم','لا يوجد'],max:1},{id:'action',q:'إجراء؟',opts:['إعادة تدريس'],max:1},{id:'follow',q:'متابعة؟',opts:['اختبار لاحق'],max:1}]};
const flow=state();
let q=routeNextQuestion106(flow,matrix);
assert.equal(q.gap,'cause','لا يعاد سؤال أساس الاختبار أو النتيجة المحسوبة');
flow.metadata.familyDetails.cause='لا يوجد';
q=routeNextQuestion106(flow,matrix);
assert.equal(q.gap,'actionStatus');
flow.metadata.familyDetails.actionStatus='مخطط للتنفيذ';
q=routeNextQuestion106(flow,matrix);
assert.equal(q.gap,'action');
assert.ok(q.question.opts.every(x=>x.startsWith('مخطط: ')));
flow.metadata.familyDetails.action=q.question.opts[0];
flow.metadata.familyDetails.follow='اختبار قصير لاحق';
assert.equal(routeNextQuestion106(flow,matrix).done,true,'التحليل العددي لا يطلب إثبات أثر لمجرد ذكر الإتقان في النتيجة المشتقة');

const model={plan:{print:{mode:'compact'}},sections:[{def:{id:'title'},data:{title:'تحليل نتائج الاختبار'}}],context:{education:{subject:{value:'اللغة العربية'},stage:{value:'متوسط'},grades:['الأول المتوسط']},execution:{executor:{value:'المعلم'}}}};
const body=analysisBody113(model,s);
assert.match(body,/حد الإتقان المعتمد 80٪/,'يجب أن يظهر حد الإتقان الفعلي في القراءة المهنية');
assert.match(body,/دون حد الإتقان/,'يجب أن توضح القراءة وجود طلاب دون حد الإتقان');
assert.match(body,/قريب من الإتقان/,'V122 يقسم ما دون الإتقان إلى قريب من الإتقان وأولوية للتدخل');
assert.match(body,/أولوية للتدخل/);
assert.doesNotMatch(body,/بين 50٪ و70٪/);

const narrativeState=state();
Object.assign(narrativeState.metadata.familyDetails,{finding:'شمل التحليل 4 طلاب.',actionStatus:'مخطط للتنفيذ',action:'مخطط: إعداد خطة علاجية',follow:'اختبار قصير لاحق'});
const narrative=mediumText80(narrativeState);
assert.match(narrative,/خُطط للإجراء التالي: إعداد خطة علاجية/);
assert.doesNotMatch(narrative,/اتُّخذت إجراءات شملت مخطط/);
assert.doesNotMatch(narrative,/وأظهرت النتائج شمل التحليل/);
const bullets=bulletText80(narrativeState).join(' ');
assert.doesNotMatch(bullets,/\.\./,'صيغة النقاط لا تضيف علامة ترقيم مزدوجة');
assert.match(bullets,/حالة الإجراء: مخطط للتنفيذ/);

const contextual=state();
contextual.raw='تحليل نتائج عربي الأول المتوسط الفصل الأول';
applyContext85(contextual);
assert.equal(contextual.metadata.placeMode,undefined,'الفصل الدراسي في تحليل النتائج ليس مكان تنفيذ');
assert.equal(contextual.metadata.context85.placeMode,'','سياق التحليل لا يعيد مكانًا زائفًا إلى بدء الرحلة');
assert.match(body,/1 من الطلاب دون حد الإتقان/);
assert.doesNotMatch(body,/\d+ طلاب/,'بطاقات القرار تستخدم صياغة عربية سليمة مع جميع الأعداد');

const app88=await import('node:fs').then(fs=>fs.readFileSync(new URL('./v10/app88.js',import.meta.url),'utf8'));
assert.match(app88,/cleanEra/,'تنسيق التاريخ ينظف رمز الحقبة قبل إضافته مرة واحدة');
assert.doesNotMatch(app88,/return`\$\{h\} هـ هـ/,'لا يكرر رمز السنة الهجرية');

console.log('V121/V122 analysis release contract PASS: mastery, content-driven next steps, execution state, import preview and reduced questions.');
