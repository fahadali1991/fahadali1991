import {analyze,acceptHint,acceptDetected,setType,setSubtype} from './engine.js';
import {landing,entryForm,understanding,goalsPage,descriptionPage,ready} from './renderers.js';
import {executionDescription} from './output-quality.js';

const app=document.getElementById('app');
let state=null,entryIntent='smart';

function enhanceTextInputs(){
  app.querySelectorAll('textarea,input:not([type="date"]):not([type="number"])').forEach(el=>{
    el.setAttribute('lang','ar');el.setAttribute('spellcheck','true');el.setAttribute('autocorrect','on');
  });
}
function render(html,toTop=true){
  const y=window.scrollY;app.innerHTML=html;enhanceTextInputs();
  requestAnimationFrame(()=>window.scrollTo({top:toTop?0:y,behavior:toTop?'smooth':'auto'}));
}
const val=id=>document.getElementById(id)?.value?.trim()||'';
function dateDisplay(iso){
 if(!iso)return'';
 const d=new Date(`${iso}T12:00:00`);
 const h=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'2-digit',month:'2-digit',year:'numeric'}).format(d);
 const g=new Intl.DateTimeFormat('ar-SA-u-ca-gregory',{day:'2-digit',month:'2-digit',year:'numeric'}).format(d);
 return `${h} هـ الموافق ${g} م`;
}
function sync(){
 if(!state)return;
 const w=document.getElementById('workTitle');
 if(w){const x=w.value.trim();if(x&&x!==state.metadata.workTitle){state.metadata.workTitle=x;state.metadata.titleManual=true;state.metadata.selectedTitle=''}}
 ['executorName','count','otherAudience','otherGoal','customDuration','customPlace'].forEach(id=>{const e=document.getElementById(id);if(e)state.metadata[id]=e.value.trim()});
 const domain=document.getElementById('domainEdit');if(domain)state.classification.domain=domain.value.trim()||state.classification.domain;
 const topic=document.getElementById('topicEdit');if(topic)state.topic=topic.value.trim();
 const di=document.getElementById('dateISO');if(di){state.metadata.dateISO=di.value;state.metadata.dateDisplay=dateDisplay(di.value)}
 const duration=document.getElementById('durationSelect');if(duration)state.metadata.durationChoice=duration.value;
 const place=document.getElementById('placeSelect');if(place)state.metadata.placeChoice=place.value;
 state.metadata.duration=state.metadata.durationChoice==='مدة أخرى'?(state.metadata.customDuration||''):state.metadata.durationChoice||'';
 state.metadata.place=state.metadata.placeChoice==='مكان آخر'?(state.metadata.customPlace||''):state.metadata.placeChoice||'';
 const de=document.getElementById('generatedDescription');if(de)state.metadata.generatedDescription=de.value.trim();
}
function home(){state=null;entryIntent='smart';render(landing(),true)}
const info=(top=true)=>render(understanding(state),top);
const goals=(top=true)=>render(goalsPage(state),top);
function description(regen=false){sync();if(regen||!state.metadata.generatedDescription)state.metadata.generatedDescription=executionDescription(state);render(descriptionPage(state),true)}

app.addEventListener('change',e=>{
 if(!state)return;
 if(e.target.id==='durationSelect'){
   sync();state.metadata.generatedDescription='';info(false);return;
 }
 if(e.target.id==='placeSelect'){
   sync();state.metadata.generatedDescription='';info(false);return;
 }
 if(e.target.id==='dateISO'){sync();return;}
});

app.addEventListener('click',e=>{
 const entry=e.target.closest('[data-entry]');if(entry){entryIntent=entry.dataset.entry;render(entryForm(entryIntent),true);setTimeout(()=>document.getElementById('raw')?.focus(),0);return}
 const aud=e.target.closest('[data-audience]');if(aud&&state){sync();const v=aud.dataset.audience,a=state.audiences||[];state.audiences=a.includes(v)?a.filter(x=>x!==v):[...a,v];info(false);return}
 const title=e.target.closest('[data-title-choice]');if(title&&state){sync();state.metadata.selectedTitle=title.dataset.titleChoice;state.metadata.workTitle=title.dataset.titleChoice;state.metadata.titleManual=false;state.metadata.generatedDescription='';info(false);return}
 const goal=e.target.closest('[data-goal]');if(goal&&state){sync();const v=goal.dataset.goal,a=state.answers.goals||[];state.answers.goals=a.includes(v)?a.filter(x=>x!==v):[...a,v];state.metadata.generatedDescription='';goals(false);return}
 const type=e.target.closest('[data-type]');if(type&&state){sync();setType(state,type.dataset.type);state.answers={goals:[]};state.metadata.generatedDescription='';info(false);return}
 const sub=e.target.closest('[data-subtype]');if(sub&&state){sync();setSubtype(state,sub.dataset.subtype);state.answers={goals:[]};state.metadata.generatedDescription='';info(false);return}
 const b=e.target.closest('[data-action]');if(!b)return;
 switch(b.dataset.action){
  case'home':home();break;
  case'analyze':{const raw=val('raw');if(!raw){alert('اكتب وصفًا مختصرًا أولًا');return}state=analyze(raw,entryIntent);state.suggestedAudiences=[...(state.audiences||[])];state.audiences=[];state.answers={goals:[]};state.metadata={...state.metadata,selectedTitle:'',titleManual:false,executorName:'',count:'',dateISO:'',dateDisplay:'',durationChoice:'',customDuration:'',duration:'',placeChoice:'',customPlace:'',place:'',otherAudience:'',otherGoal:'',otherGoalEnabled:false,generatedDescription:''};info(true);break}
  case'accept-hint':acceptHint(state);state.answers={goals:[]};state.metadata.generatedDescription='';info(false);break;
  case'accept-detected':acceptDetected(state);state.answers={goals:[]};state.metadata.generatedDescription='';info(false);break;
  case'understanding':sync();info(true);break;
  case'go-goals':sync();if(!state.audiences?.length){alert('اختر المستفيدين من العمل قبل المتابعة.');return}if(state.audiences.includes('مستفيدون آخرون')&&!state.metadata.otherAudience){alert('اكتب من هم المستفيدون الآخرون أو ألغِ هذا الاختيار.');return}if(state.metadata.durationChoice==='مدة أخرى'&&!state.metadata.customDuration){alert('اكتب المدة المطلوبة أو اختر مدة جاهزة.');return}if(state.metadata.placeChoice==='مكان آخر'&&!state.metadata.customPlace){alert('اكتب مكان التنفيذ أو اختر مكانًا جاهزًا.');return}goals(true);break;
  case'toggle-other-goal':sync();state.metadata.otherGoalEnabled=!state.metadata.otherGoalEnabled;if(!state.metadata.otherGoalEnabled)state.metadata.otherGoal='';goals(false);break;
  case'go-description':sync();description(true);break;
  case'regenerate-description':description(true);break;
  case'edit-description':description(false);break;
  case'finalize':sync();if(!state.metadata.generatedDescription)state.metadata.generatedDescription=executionDescription(state);render(ready(state),true);break;
 }
});
home();
