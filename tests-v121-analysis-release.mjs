import assert from 'node:assert/strict';
import {analysisSummary113,analysisDataPanel113} from './v10/analysis-data113.js';
import {analysisNextSteps121} from './v10/evidence85.js';
import {analysisBody113} from './v10/pdf-analysis113.js';
import {routeNextQuestion106} from './v10/question-router106.js';

function state(scores=[15,16,18,19]){
  return {classification:{type:'تحليل نتائج'},stage:'متوسط',grades:['الأول المتوسط'],audiences:['الطلاب'],metadata:{analysis:{maxScore:'20',masteryPercent:'80',scores,names:[],rawRows:scores.join('\n'),invalid:[]},familyMeta111:{assessmentType:'اختبار فترة',period:'الفصل الدراسي الأول'},familyDetails:{subject94:'اللغة العربية'}},answers:{goals:[],evidence:[]}};
}

const s=state();
const sum=analysisSummary113(s);
assert.equal(sum.weak,1,'حد الإتقان 80٪ يجب أن يصنف 15/20 دون الإتقان');
assert.equal(sum.advanced,2,'المتقدمون يجب أن يشتقوا من الدرجات');

const steps=analysisNextSteps121(s);
assert.equal(steps[0].title,'إنشاء خطة علاجية');
assert.match(steps[0].detail,/1 طالبًا دون حد الإتقان/);
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
assert.match(body,/دون حد الإتقان المعتمد \(80٪\)/);
assert.match(body,/أولوية للتدخل/);
assert.doesNotMatch(body,/بين 50٪ و70٪/);

console.log('V121 analysis release contract PASS: mastery, content-driven next steps, execution state, import preview and reduced questions.');
