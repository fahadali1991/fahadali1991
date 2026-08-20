/* Smart Follow-up Tracker V2 — turns minutes decisions into actionable items */
(function(){
 const KEY='gc_followups_v2';
 function read(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}}
 function write(items){localStorage.setItem(KEY,JSON.stringify(items));return items}
 function norm(x={}){return {id:x.id||('FU-'+Date.now()+'-'+Math.random().toString(36).slice(2,7)),source:x.source||'manual',sourceTitle:String(x.sourceTitle||''),task:String(x.task||''),owner:String(x.owner||''),due:String(x.due||''),status:String(x.status||'قيد المتابعة'),createdAt:x.createdAt||new Date().toISOString(),completedAt:x.completedAt||''}}
 function add(item){const a=read();const n=norm(item);a.push(n);write(a);return n}
 function addMany(items){const a=read();for(const x of items||[])a.push(norm(x));write(a);return a}
 function update(id,patch){const a=read();const i=a.findIndex(x=>x.id===id);if(i<0)return null;Object.assign(a[i],patch||{});if(a[i].status==='مكتمل'&&!a[i].completedAt)a[i].completedAt=new Date().toISOString();write(a);return a[i]}
 function fromMinutes(){const m=window.GC_MINUTES_V2?.get?.()||window.cur?.docMeta?.minutes||{}, tasks=Array.isArray(m.tasks)?m.tasks:[];if(!tasks.length)return[];const title=typeof workName==='function'?workName():(window.cur?.workTitle||'محضر اجتماع');return addMany(tasks.filter(t=>t.task).map(t=>({source:'minutes',sourceTitle:title,task:t.task,owner:t.owner,due:t.due,status:t.status||'قيد المتابعة'})))}
 function summary(){const a=read();return {total:a.length,pending:a.filter(x=>x.status==='قيد المتابعة').length,done:a.filter(x=>x.status==='مكتمل').length,late:a.filter(x=>x.status==='متأخر').length,items:a}}
 window.GC_FOLLOWUP_V2={version:'2.0',read,write,add,addMany,update,fromMinutes,summary,clear(){write([])}};
})();