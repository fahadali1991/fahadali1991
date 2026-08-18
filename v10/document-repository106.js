const DB='school-engine-v106';const VERSION=2;const DRAFTS='drafts',DOCS='documents',FILES='attachments',META='meta';
function openDB(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB,VERSION);r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains(DRAFTS))db.createObjectStore(DRAFTS,{keyPath:'id'});if(!db.objectStoreNames.contains(DOCS))db.createObjectStore(DOCS,{keyPath:'id'});if(!db.objectStoreNames.contains(FILES))db.createObjectStore(FILES,{keyPath:'id'});if(!db.objectStoreNames.contains(META))db.createObjectStore(META,{keyPath:'id'});};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
export const repositoryId109=()=>globalThis.crypto?.randomUUID?.()||`doc-${Date.now()}-${Math.random().toString(36).slice(2)}`;
function store(db,name){return db.transaction(name,'readonly').objectStore(name)}
function put(name,value){return openDB().then(db=>new Promise((resolve,reject)=>{const tx=db.transaction(name,'readwrite');tx.objectStore(name).put(value);tx.oncomplete=()=>resolve(value);tx.onerror=()=>reject(tx.error)}))}
function get(name,id){return openDB().then(db=>new Promise((resolve,reject)=>{const r=store(db,name).get(id);r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error)}))}
function all(name){return openDB().then(db=>new Promise((resolve,reject)=>{const r=store(db,name).getAll();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>reject(r.error)}))}
function del(name,id){return openDB().then(db=>new Promise((resolve,reject)=>{const tx=db.transaction(name,'readwrite');tx.objectStore(name).delete(id);tx.oncomplete=()=>resolve(true);tx.onerror=()=>reject(tx.error)}))}
const titleOf=s=>String(s?.metadata?.workTitle||s?.metadata?.selectedTitle||s?.metadata?.pendingManualTitle||s?.metadata?.generatedTitle||s?.classification?.subtype||s?.classification?.type||'وثيقة بدون عنوان').trim();
const familyOf=s=>String(s?.classification?.type||'').trim();
const cloneState=s=>s;
export async function setCurrent109(id){return put(META,{id:'current',value:id||'',updatedAt:Date.now()})}
export async function currentId109(){return (await get(META,'current'))?.value||''}
export async function saveDraft109(state,{id,screen='understanding'}={}){state.metadata=state.metadata||{};const docId=id||state.metadata.documentId109||repositoryId109();state.metadata.documentId109=docId;const old=await get(DRAFTS,docId);const now=Date.now();const rec={id:docId,state:cloneState(state),screen,title:titleOf(state),family:familyOf(state),createdAt:old?.createdAt||now,updatedAt:now,schemaVersion:109,status:'draft'};await put(DRAFTS,rec);await setCurrent109(docId);return rec}
export async function loadDraft109(id){const key=id||await currentId109();return key?get(DRAFTS,key):null}
export async function listDrafts109(){return(await all(DRAFTS)).sort((a,b)=>b.updatedAt-a.updatedAt)}
export async function deleteDraft109(id){const key=id||await currentId109();if(!key)return false;await del(DRAFTS,key);if((await currentId109())===key)await setCurrent109('');return true}
export async function saveDocument109(state,{id,status='final'}={}){state.metadata=state.metadata||{};const docId=id||state.metadata.documentId109||repositoryId109();state.metadata.documentId109=docId;const old=await get(DOCS,docId);const now=Date.now();const rec={id:docId,state:cloneState(state),title:titleOf(state),family:familyOf(state),status,createdAt:old?.createdAt||now,updatedAt:now,schemaVersion:109};await put(DOCS,rec);await del(DRAFTS,docId);await setCurrent109('');return rec}
export async function listDocuments109(){return(await all(DOCS)).sort((a,b)=>b.updatedAt-a.updatedAt)}
export async function getDocument109(id){return get(DOCS,id)}
export async function editDocument109(id){const doc=await get(DOCS,id);if(!doc)return null;const state=doc.state;state.metadata=state.metadata||{};state.metadata.documentId109=id;const rec=await saveDraft109(state,{id,screen:'final'});return rec}
export async function deleteDocument109(id){return del(DOCS,id)}
export async function duplicateDocument109(id){const doc=await get(DOCS,id);if(!doc)return null;const state=typeof structuredClone==='function'?structuredClone(doc.state):JSON.parse(JSON.stringify(doc.state));state.metadata=state.metadata||{};delete state.metadata.documentId109;state.metadata.workTitle=`${titleOf(state)} - نسخة`;return saveDraft109(state,{screen:'understanding'})}
export async function saveAttachment109(documentId,file){const id=repositoryId109(),rec={id,documentId,name:file?.name||'ملف',type:file?.type||'',size:file?.size||0,blob:file,createdAt:Date.now()};await put(FILES,rec);return rec}
export async function listAttachments109(documentId){return(await all(FILES)).filter(x=>x.documentId===documentId)}
export async function deleteAttachment109(id){return del(FILES,id)}
// Backward-compatible V106 exports.
export async function saveDraft106(state,id='current'){return saveDraft109(state,{id:id==='current'?undefined:id})}
export async function loadDraft106(id='current'){return loadDraft109(id==='current'?undefined:id)}
export async function deleteDraft106(id='current'){return deleteDraft109(id==='current'?undefined:id)}
export async function archiveDocument106(state,{id,status='final'}={}){return saveDocument109(state,{id,status})}
export async function getDocument106(id){return getDocument109(id)}
export async function listDocuments106(){return listDocuments109()}
export async function saveAttachment106(documentId,file){return saveAttachment109(documentId,file)}
export async function listAttachments106(documentId){return listAttachments109(documentId)}
export async function deleteAttachment106(id){return deleteAttachment109(id)}
