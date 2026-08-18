import assert from 'node:assert/strict';
import fs from 'node:fs';
import {matrix106} from './matrix106.js';
import {routeNextQuestion106} from './question-router106.js';
import {titleCandidates108,validateTitle108} from './title108.js';
import {goalGroups76} from './goals76.js';
import {narrative106} from './generators106.js';
import {suggestions108,qualityIssues108,applySuggestion108} from './spelling108.js';

const SUBJECTS=[
 ['القرآن الكريم والدراسات الإسلامية','القرآن الكريم','تلاوة القرآن الكريم'],
 ['اللغة العربية','القراءة','الفهم القرائي'],
 ['الرياضيات','الكسور','توحيد المقامات'],
 ['العلوم','التجارب العلمية','الاستقصاء والتجريب العلمي'],
 ['اللغة الإنجليزية','التواصل باللغة الإنجليزية','التحدث باللغة الإنجليزية'],
 ['المهارات الرقمية','البرمجة','البرمجة'],
 ['الدراسات الاجتماعية','المواطنة','الهوية الوطنية'],
 ['التربية الفنية','الإنتاج الفني','الإنتاج الفني'],
 ['التربية البدنية','اللياقة البدنية','اللياقة البدنية'],
 ['المهارات الحياتية والأسرية','المهارات الحياتية','السلامة الغذائية'],
 ['النشاط الطلابي','المشاركة الطلابية','المشاركة الطلابية'],
 ['الموهوبون','الإثراء','التفكير الإبداعي'],
 ['التربية الخاصة','التعلم الفردي','مهارة فردية مستهدفة'],
 ['التوجيه الطلابي','السلوك والانضباط','الانضباط المدرسي']
];
const STAGES=[['ابتدائي','الصف الخامس الابتدائي'],['متوسط','الصف الثاني المتوسط'],['ثانوي','الصف الثاني الثانوي']];
const PROFILES=['غير تقني','متوسط','تقني'];
const FAMILIES=['برنامج / فعالية','اجتماع / متابعة إدارية','تحليل نتائج','خطة','إجراء متابعة','تطوير مهني','شراكة مجتمعية','صيانة وتجهيزات'];
const NAMES=['نورة القحطاني','سلمان الغامدي','عبدالله الشهراني','ريم الحربي','محمد العتيبي','هند الزهراني'];
const PLAN_SUBTYPES=['خطة علاجية','خطة إثرائية','خطة تحسين','خطة تشغيلية'];
const forbidden=/undefined|null|\|\|\||__answered|__skill|MeasuredResult|UserChoice|Inference|\bFact\b|لـ|بـ/u;
const badArabic=/تنمية القرآن الكريم|خطة تحسين.*خطة علاجية|خطة تحسين.*خطة إثرائية|خطة تحسين.*خطة تشغيلية/u;
const stats={journeys:0,questions:0,maxQuestions:0,titles:0,goals:0,narratives:0,spellChecks:0};
function rawFor(profile,name,topic,skill,family){if(profile==='غير تقني')return`انا ${name} سويت شغله للطلاب عن ${topic} وكان عندهم مشكله، وابغا احسن مستواهم. تنفيد العمل كان في المدرسه والنتايج راح اراجعها بعدين`;if(profile==='متوسط')return`نفذت ${family} للطلاب في ${topic} بهدف تحسين ${skill}، وسأتابع النتائج بعد التنفيذ`;return`تم تنفيذ ${family} يستهدف ${skill} لدى الطلاب بناءً على احتياج محدد، مع توثيق التنفيذ والمتابعة`}
function subtypeFor(family,i){if(family==='خطة')return PLAN_SUBTYPES[i%PLAN_SUBTYPES.length];if(family==='برنامج / فعالية')return['برنامج','فعالية','مبادرة','مسابقة'][i%4];if(family==='اجتماع / متابعة إدارية')return'اجتماع';if(family==='تطوير مهني')return'تطوير مهني';return''}
function stateFor(subject,topic,skill,stage,grade,profile,family,i){const subtype=subtypeFor(family,i),name=NAMES[i%NAMES.length],raw=rawFor(profile,name,topic,skill,family);return{raw,topic,classification:{type:family,subtype},metadata:{executorName:name,familyDetails:{subject94:subject},semantic101:{}},audiences:['الطلاب'],stage,grades:[grade],attachments:[],answers:{goals:[],evidence:[]},suggestedAudiences:['الطلاب']}}
function cleanVisible(v,label){const s=String(v||'').trim();assert.ok(s.length>=2,`${label}: empty/too short`);assert.ok(!forbidden.test(s),`${label}: leaked technical/bad prefix text -> ${s}`);assert.ok(!badArabic.test(s),`${label}: bad Arabic phrase -> ${s}`);assert.ok(!/\s{2,}/.test(s),`${label}: repeated spaces -> ${s}`);return s}
function answerJourney(s,preferredSkill){let count=0,stageMethodSeen=false;for(let guard=0;guard<12;guard++){const m=matrix106(s),r=routeNextQuestion106(s,m);if(r.done)break;const q=r.question;count++;cleanVisible(q.q,'question');if(q.help)cleanVisible(q.help,'help');assert.ok((q.opts||[]).length>=2,`${q.id}: needs at least 2 choices`);assert.ok((q.opts||[]).length<=10,`${q.id}: too many choices`);assert.equal(new Set(q.opts).size,q.opts.length,`${q.id}: duplicate choices`);for(const o of q.opts)cleanVisible(o,`option ${q.id}`);if(q.id==='method'){const joined=q.opts.join(' ');if(s.stage==='ابتدائي')stageMethodSeen=/تعلم باللعب|نشاط عملي مبسط|صور وبطاقات/.test(joined);if(s.stage==='متوسط')stageMethodSeen=/تعلم تعاوني|تطبيق عملي|مهمة صفية/.test(joined);if(s.stage==='ثانوي')stageMethodSeen=/تعلم قائم على المشروعات|استقصاء وتحليل|مهمة أدائية/.test(joined)}let choice=q.opts[0];if(q.id==='skillFocus'&&preferredSkill&&q.opts.includes(preferredSkill))choice=preferredSkill;s.metadata.familyDetails[q.id]=choice}assert.ok(count<=8,`journey too long: ${count}`);return{count,stageMethodSeen}}
let idx=0;for(const [subject,topic,skill] of SUBJECTS){for(const [stage,grade] of STAGES){for(const profile of PROFILES){for(const family of FAMILIES){const s=stateFor(subject,topic,skill,stage,grade,profile,family,idx++);if(profile!=='غير تقني')s.metadata.familyDetails.skillFocus=skill;const {count,stageMethodSeen}=answerJourney(s,skill);stats.journeys++;stats.questions+=count;stats.maxQuestions=Math.max(stats.maxQuestions,count);if(['برنامج / فعالية','خطة','إجراء متابعة'].includes(family))assert.ok(stageMethodSeen||family==='خطة',`${stage}/${family}: stage-aware method choices not observed`);
 const titles=titleCandidates108(s);assert.ok(titles.length>=1&&titles.length<=3,`${family}: bad title count`);for(const t of titles){cleanVisible(t,'title');assert.ok(validateTitle108(t),`invalid title: ${t}`);assert.ok(!t.includes(s.metadata.executorName),`executor leaked into title: ${t}`);if(family==='خطة'&&s.classification.subtype!=='خطة تحسين')assert.ok(!/^خطة تحسين/.test(t),`wrong plan subtype in title: ${t}`);stats.titles++}
 const gg=goalGroups76(s).primary;assert.ok(gg.length>=2&&gg.length<=8,`${family}: bad goal count ${gg.length}`);for(const g of gg){cleanVisible(g,'goal');assert.ok(!g.includes('تنمية القرآن الكريم'),`bad Quran goal: ${g}`);stats.goals++}
 const n=narrative106(s);cleanVisible(n,'narrative');assert.ok(/[.!؟]$/.test(n),`narrative must end with punctuation: ${n}`);assert.ok(!n.includes(s.metadata.executorName),`executor unexpectedly leaked into narrative`);stats.narratives++;
 if(profile==='غير تقني'){const sug=suggestions108(s.raw);assert.ok(sug.some(x=>x.from==='تنفيد'),`misspelling تنفيد not detected`);assert.ok(sug.some(x=>x.from==='المدرسه'),`misspelling المدرسه not detected`);assert.ok(sug.some(x=>x.from==='النتايج'),`misspelling النتايج not detected`);let corrected=s.raw;for(const x of sug)corrected=applySuggestion108(corrected,x.from,x.to);assert.ok(!/تنفيد|المدرسه|النتايج/.test(corrected),`spelling corrections did not apply`);assert.equal(qualityIssues108(s.metadata.executorName).length,0,`valid name falsely flagged: ${s.metadata.executorName}`);stats.spellChecks++}
}}}}
const familyUI=fs.readFileSync(new URL('./family-details106.js',import.meta.url),'utf8');for(const text of ['أكمل الناقص فقط','ما فهمه المحرك حتى الآن','السؤال التالي','اكتملت التفاصيل المهمة','اعتماد والمتابعة'])assert.ok(familyUI.includes(text),`visible family copy missing: ${text}`);
const workspace=fs.readFileSync(new URL('./workspace109.js',import.meta.url),'utf8');for(const text of ['الرئيسية','السابق','التالي','الأرشيف والملفات'])assert.ok(workspace.includes(text),`workspace copy missing: ${text}`);
const quran={raw:'نفذت برنامج عن القرآن الكريم',topic:'القرآن الكريم',classification:{type:'برنامج / فعالية',subtype:'برنامج'},metadata:{familyDetails:{subject94:'القرآن الكريم والدراسات الإسلامية'}},audiences:['الطلاب'],stage:'متوسط',grades:['الصف الأول المتوسط'],answers:{goals:[],evidence:[]}};const quranTitles=titleCandidates108(quran).join(' | '),quranGoals=goalGroups76(quran).primary.join(' | ');assert.ok(!/تنمية القرآن الكريم/.test(`${quranTitles} ${quranGoals}`),'generic Quran wording regressed');
console.log(`V110 deep acceptance PASS: ${stats.journeys} journeys, ${stats.questions} adaptive questions, max ${stats.maxQuestions}, ${stats.titles} titles, ${stats.goals} goals, ${stats.narratives} narratives, ${stats.spellChecks} typo-heavy journeys.`);
