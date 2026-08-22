import {matrix105} from './matrix105.js?v=105';
import {resolveSkill106} from './skill-resolver106.js?v=106';
import {routeNextQuestion106} from './question-router106.js?v=121';
import {buildCanonicalContext106} from './canonical-context106.js?v=106';
import {normalizeQuestion109} from './source-contract109.js?v=109';
const uniq=a=>[...new Set((a||[]).filter(Boolean))];
function stageOf(s){const x=String(s?.stage||s?.metadata?.stage||'');if(/ابتدائ/.test(x))return'ابتدائي';if(/متوسط/.test(x))return'متوسط';if(/ثانو/.test(x))return'ثانوي';return''}
const STAGE_OVERLAYS={
 'ابتدائي':{skillFocus:['مهارة أساسية','تطبيق مباشر','قراءة وفهم مبسط'],method:['تعلم باللعب','نشاط عملي مبسط','صور وبطاقات تعليمية'],follow:['ملاحظة مباشرة','نشاط قصير للتحقق','إعادة تعليم مبسطة']},
 'متوسط':{skillFocus:['فهم المفهوم','تطبيق المهارة','حل مشكلة'],method:['تعلم تعاوني','تطبيق عملي','مهمة صفية'],follow:['مهمة تحقق قصيرة','تحليل أخطاء الطلاب','إعادة تدريس مستهدفة']},
 'ثانوي':{skillFocus:['تحليل وتفسير','تطبيق متقدم','حل مشكلة مركبة'],method:['تعلم قائم على المشروعات','استقصاء وتحليل','مهمة أدائية'],follow:['مهمة أدائية','تحليل بيانات الأداء','إجراء تحسيني مستهدف']}
};
function adapt(q,stage){const extra=STAGE_OVERLAYS[stage]?.[q.id]||[];if(!extra.length)return q;return{...q,opts:uniq([...extra,...(q.opts||[])]).slice(0,10),help:q.help||`خيارات مقترحة تناسب المرحلة ${stage}.`}}
function analysisPolicy(q,state){if(state?.classification?.type!=='تحليل نتائج')return q;if(!['basis','finding','cause','action','follow'].includes(q.id))return q;return{...q,max:0,help:q.help||'اختر كل ما ينطبق فعلًا؛ ستُستخدم جميع اختياراتك في صياغة الوثيقة والتحليل.'}}
export function matrix106(state){const base=matrix105(state),skill=resolveSkill106(state),stage=stageOf(state);state.metadata=state.metadata||{};state.metadata.resolvedSkill106=skill;state.metadata.adaptiveStage106=stage;let questions=(base.questions||[]).filter(q=>q.id!=='skillFocus').map(q=>analysisPolicy(normalizeQuestion109(state,adapt(q,stage)),state));if(skill.needsSkillQuestion){let sq={id:'skillFocus',q:`ما المهارة أو الجانب الأدق داخل ${skill.branch||skill.topic||'الموضوع'}؟`,help:'اختر المهارة الدقيقة فقط إذا لم تكن واضحة من وصفك.',opts:skill.skillOptions,max:1,kind:'UserChoice'};sq=normalizeQuestion109(state,adapt(sq,stage));questions=[sq,...questions]}return{...base,branch:skill.branch||base.branch,skill:skill.skill||'',skillKnown:skill.skillKnown,stageAdaptation106:stage,questions,canonical:buildCanonicalContext106(state)}}
export function nextAdaptiveQuestion106(state){const m=matrix106(state);return routeNextQuestion106(state,m)}
