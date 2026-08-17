const DB='school-engine-v106';const VERSION=1;const DRAFTS='drafts',DOCS='documents',FILES='attachments';
function openDB(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB,VERSION);r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains(DRAFTS))db.createObjectStore(DRAFTS,{keyPath:'id'});if(!db.objectStoreNames.contains(DOCS))db.createObjectStore(DOCS,{keyPath:'id'});if(!db.objectStoreNames.contains(FILES))db.createObjectStore(FILES,{keyPath:'id'});};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
const uuid=()=>globalThis.crypto?.randomUUID?.()||`doc-${Date.now()}-${Math.random().toString(36).slice(2)}`;
function txStore(db,name,mode='readonly'){return db.transaction(name,mode).objectStore(name)}
function put(name,value){return openDB().then(db=>new Promise((resolve,reject)=>{const tx=db.transaction(name,'readwrite');tx.objectStore(name).put(value);tx.oncomplete=()=>resolve(value);tx.onerror=()=>reject(tx.error)}))}
function get(name,id){return openDB().then(db=>new Promise((resolve,reject)=>{const r=txStore(db,name).get(id);r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error)}))}
function all(name){return openDB().then(db=>new Promise((resolve,reject)=>{const r=txStore(db,name).getAll();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>reject(r.error)}))}
function del(name,id){return openDB().then(db=>new Promise((resolve,reject)=>{const tx=db.transaction(name,'readwrite');tx.objectStore(name).delete(id);tx.oncomplete=()=>resolve(true);tx.onerror=()=>reject(tx.error)}))}
export async function saveDraft106(state,id='current'){return put(DRAFTS,{id,state,updatedAt:Date.now(),schemaVersion:106})}
export async function loadDraft106(id='current'){return get(DRAFTS,id)}
export async function deleteDraft106(id='current'){return del(DRAFTS,id)}
export async function archiveDocument106(state,{id=uuid(),status='final'}={}){const doc={id,status,state,createdAt:Date.now(),updatedAt:Date.now(),schemaVersion:106};await put(DOCS,doc);return doc}
export async function getDocument106(id){return get(DOCS,id)}
export async function listDocuments106(){return (await all(DOCS)).sort((a,b)=>b.updatedAt-a.updatedAt)}
export async function saveAttachment106(documentId,file){const id=uuid(),rec={id,documentId,name:file?.name||'ملف',type:file?.type||'',size:file?.size||0,blob:file,createdAt:Date.now()};await put(FILES,rec);return rec}
export async function listAttachments106(documentId){return (await all(FILES)).filter(x=>x.documentId===documentId)}
export async function deleteAttachment106(id){return del(FILES,id)}
