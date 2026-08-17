import {matrix105} from './matrix105.js?v=105';
import {resolveSkill106} from './skill-resolver106.js?v=106';
import {routeNextQuestion106} from './question-router106.js?v=106';
import {buildCanonicalContext106} from './canonical-context106.js?v=106';
export function matrix106(state){const base=matrix105(state),skill=resolveSkill106(state);let questions=(base.questions||[]).filter(q=>q.id!=='skillFocus');if(skill.needsSkillQuestion)questions=[{id:'skillFocus',q:`ما المهارة أو الجانب الأدق داخل ${skill.branch||skill.topic||'الموضوع'}؟`,help:'اختر المهارة الدقيقة فقط إذا لم تكن واضحة من وصفك.',opts:skill.skillOptions,max:1,kind:'UserChoice'},...questions];return{...base,branch:skill.branch||base.branch,skill:skill.skill||'',skillKnown:skill.skillKnown,questions,canonical:buildCanonicalContext106(state)}}
export function nextAdaptiveQuestion106(state){const m=matrix106(state);return routeNextQuestion106(state,m)}
