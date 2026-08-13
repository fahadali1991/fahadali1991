import {analyze,acceptHint,acceptDetected,setType,setSubtype} from './engine.js';
import {landing,entryForm,understanding,goalsPage,descriptionPage,ready} from './renderers.js';
import {executionDescription} from './output-quality.js';

const app=document.getElementById('app');
let state=null,entryIntent='smart';
const render=html=>{app.innerHTML=html;window.scrollTo({top:0,behavior:'smooth'})};
const readValue=id=>document.getElementById(id)?.value?.trim()||'';
const syncMeta=()=>{
 if(!state)return;
 const nextTitle=readValue('workTitle');
 if(nextTitle){if(nextTitle!==state.metadata.workTitle)state.metadata.titleManual=true;state.metadata.workTitle=nextTitle}
 ['executorName','count','place','duration','dateHijri','dateGregorian','otherAudience','otherGoal'].forEach(id=>{const el=document.getElementById(id);if(el)state.metadata[id]=el.value.trim()});
 const desc=document.getElementById('generatedDescription');if(desc)state.metadata.generatedDescription=desc.value.trim();
};
function showLanding(){state=null;entryIntent='smart';render(landing())}
function showUnderstanding(){render(understanding(state))}
function showGoals(){render(goalsPage(state))}
function showDescription(regenerate=false){syncMeta();if(regenerate||!state.metadata.generatedDescription)state.metadata.generatedDescription=executionDescription(state);render(descriptionPage(state))}

app.addEventListener('click',e=>{
 const entry=e.target.closest('[data-entry]');
 if(entry){entryIntent=entry.dataset.entry;render(entryForm(entryIntent));setTimeout(()=>document.getElementById('raw')?.focus(),0);return}
 const audience=e.target.closest('[data-audience]');
 if(audience&&state){syncMeta();const v=audience.dataset.audience,a=state.audiences||[];state.audiences=a.includes(v)?a.filter(x=>x!==v):[...a,v];showUnderstanding();return}
 const goal=e.target.closest('[data-goal]');
 if(goal&&state){syncMeta();const v=goal.dataset.goal,a=state.answers.goals||[];state.answers.goals=a.includes(v)?a.filter(x=>x!==v):[...a,v];showGoals();return}
 const type=e.target.closest('[data-type]');if(type&&state){syncMeta();setType(state,type.dataset.type);state.metadata.generatedDescription='';showUnderstanding();return}
 const sub=e.target.closest('[data-subtype]');if(sub&&state){syncMeta();setSubtype(state,sub.dataset.subtype);state.metadata.generatedDescription='';showUnderstanding();return}
 const btn=e.target.closest('[data-action]');if(!btn)return;
 switch(btn.dataset.action){
  case'home':showLanding();break;
  case'analyze':{const raw=document.getElementById('raw')?.value.trim();if(!raw){alert('اكتب وصفًا مختصرًا أولًا');return}state=analyze(raw,entryIntent);state.suggestedAudiences=[...(state.audiences||[])];state.audiences=[];state.answers={goals:[]};state.metadata={...state.metadata,place:'',duration:'',dateHijri:'',dateGregorian:'',otherAudience:'',otherGoal:'',otherGoalEnabled:false,generatedDescription:'',titleManual:false};showUnderstanding();break}
  case'accept-hint':acceptHint(state);state.answers={goals:[]};state.metadata.generatedDescription='';showUnderstanding();break;
  case'accept-detected':acceptDetected(state);state.answers={goals:[]};state.metadata.generatedDescription='';showUnderstanding();break;
  case'understanding':syncMeta();showUnderstanding();break;
  case'go-goals':syncMeta();if(!state.audiences?.length){alert('اختر المستفيدين من العمل قبل المتابعة.');return}if(state.audiences.includes('فئة أخرى')&&!state.metadata.otherAudience){alert('اكتب اسم الفئة الأخرى أو ألغِ اختيار «فئة أخرى».');return}showGoals();break;
  case'toggle-other-goal':syncMeta();state.metadata.otherGoalEnabled=!state.metadata.otherGoalEnabled;if(!state.metadata.otherGoalEnabled)state.metadata.otherGoal='';showGoals();break;
  case'go-description':syncMeta();showDescription(true);break;
  case'regenerate-description':showDescription(true);break;
  case'edit-description':showDescription(false);break;
  case'finalize':syncMeta();if(!state.metadata.generatedDescription)state.metadata.generatedDescription=executionDescription(state);render(ready(state));break;
 }
});
showLanding();
