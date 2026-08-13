import {analyze,acceptHint,acceptDetected,setType,setSubtype,questionsFor} from './engine.js';
import {landing,entryForm,understanding,questions,ready} from './renderers.js';

const app=document.getElementById('app');
let state=null,entryIntent='smart',questionIndex=0;
const render=html=>{app.innerHTML=html;window.scrollTo({top:0,behavior:'smooth'})};
const syncMeta=()=>{if(!state)return;const w=document.getElementById('workTitle'),e=document.getElementById('executorName'),c=document.getElementById('count');if(w)state.metadata.workTitle=w.value.trim();if(e)state.metadata.executorName=e.value.trim();if(c)state.metadata.count=c.value.trim()};

function showLanding(){state=null;questionIndex=0;entryIntent='smart';render(landing())}
function showUnderstanding(){render(understanding(state))}
function showQuestion(){render(questions(state,questionIndex))}
function currentQuestion(){return state?questionsFor(state)[questionIndex]:null}

app.addEventListener('click',e=>{
  const entry=e.target.closest('[data-entry]');
  if(entry){entryIntent=entry.dataset.entry;render(entryForm(entryIntent));setTimeout(()=>document.getElementById('raw')?.focus(),0);return}
  const type=e.target.closest('[data-type]');
  if(type&&state){syncMeta();setType(state,type.dataset.type);showUnderstanding();return}
  const sub=e.target.closest('[data-subtype]');
  if(sub&&state){syncMeta();setSubtype(state,sub.dataset.subtype);showUnderstanding();return}
  const ans=e.target.closest('[data-answer]');
  if(ans&&state){
    const q=currentQuestion(),id=ans.dataset.answer,v=ans.dataset.value,a=state.answers[id]||[];
    if(a.includes(v)){state.answers[id]=a.filter(x=>x!==v);showQuestion();return}
    const max=q?.max??q?.opts?.length??99;
    if(a.length>=max){alert(`اختر بحد أقصى ${max} خيارات فقط؛ اختر الأهم والأقرب لما حدث.`);return}
    state.answers[id]=[...a,v];showQuestion();return;
  }
  const btn=e.target.closest('[data-action]');if(!btn)return;
  switch(btn.dataset.action){
    case 'home':showLanding();break;
    case 'analyze':{const raw=document.getElementById('raw')?.value.trim();if(!raw){alert('اكتب وصفًا مختصرًا أولًا');return}state=analyze(raw,entryIntent);showUnderstanding();break}
    case 'accept-hint':acceptHint(state);showUnderstanding();break;
    case 'accept-detected':acceptDetected(state);showUnderstanding();break;
    case 'questions':syncMeta();questionIndex=0;showQuestion();break;
    case 'next-question':{
      const q=currentQuestion(),selected=state.answers[q?.id]||[],min=q?.min??0;
      if(selected.length<min){alert(min===1?'اختر خيارًا واحدًا على الأقل قبل المتابعة.':`اختر ${min} خيارات على الأقل قبل المتابعة.`);return}
      questionIndex++;if(questionIndex>=questionsFor(state).length)render(ready(state));else showQuestion();break;
    }
    case 'understanding':showUnderstanding();break;
  }
});

showLanding();