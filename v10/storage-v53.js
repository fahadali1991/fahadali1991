import {saveDraft109,loadDraft109,deleteDraft109,saveDocument109} from './document-repository106.js?v=109';
export async function saveDraft(state,screen='understanding'){if(!state)return false;const rec=await saveDraft109(state,{screen});if(screen==='final')await saveDocument109(state,{id:rec.id,status:'final'});return true}
export async function loadDraft(){const rec=await loadDraft109();if(!rec)return null;return{state:rec.state,screen:rec.screen||'understanding',savedAt:rec.updatedAt||rec.createdAt||Date.now(),id:rec.id}}
export async function clearDraft(){return deleteDraft109()}
export function formatSavedAt(ts){try{return new Intl.DateTimeFormat('ar-SA',{dateStyle:'medium',timeStyle:'short'}).format(new Date(ts))}catch{return''}}
