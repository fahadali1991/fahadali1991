const DB='school-engine-v53';
const STORE='drafts';
const KEY='current';
function openDB(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE)};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
export async function saveDraft(state,screen='understanding'){if(!state)return;const db=await openDB();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put({state,screen,savedAt:Date.now()},KEY);tx.oncomplete=()=>resolve(true);tx.onerror=()=>reject(tx.error)})}
export async function loadDraft(){const db=await openDB();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readonly');const r=tx.objectStore(STORE).get(KEY);r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error)})}
export async function clearDraft(){const db=await openDB();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(KEY);tx.oncomplete=()=>resolve(true);tx.onerror=()=>reject(tx.error)})}
export function formatSavedAt(ts){try{return new Intl.DateTimeFormat('ar-SA',{dateStyle:'medium',timeStyle:'short'}).format(new Date(ts))}catch{return''}}
