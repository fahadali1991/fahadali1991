/* Smart Meeting Minutes — V2 */
(function(){
  function clean(v){return String(v||'').trim()}
  function meta(){window.cur=window.cur||{};cur.docMeta=cur.docMeta||{};cur.docMeta.minutes=cur.docMeta.minutes||{};return cur.docMeta.minutes}
  function split(v){return clean(v).split(/\n|،|;/).map(x=>x.trim()).filter(Boolean)}
  window.GC_MINUTES_V2={
    version:'2.0',
    get:meta,
    set(patch){Object.assign(meta(),patch||{});return meta()},
    normalize(raw={}){
      const m=meta();
      Object.assign(m,raw);
      m.agenda=Array.isArray(m.agenda)?m.agenda:split(m.agenda);
      m.decisions=Array.isArray(m.decisions)?m.decisions:split(m.decisions);
      m.attendees=Array.isArray(m.attendees)?m.attendees:split(m.attendees);
      m.tasks=Array.isArray(m.tasks)?m.tasks:[];
      return m;
    },
    addTask(task,owner,due,status='قيد المتابعة'){
      const m=meta();m.tasks=Array.isArray(m.tasks)?m.tasks:[];
      m.tasks.push({task:clean(task),owner:clean(owner),due:clean(due),status:clean(status)});return m.tasks;
    },
    summary(){
      const m=meta(), tasks=Array.isArray(m.tasks)?m.tasks:[];
      return {agenda:(m.agenda||[]).length,decisions:(m.decisions||[]).length,tasks:tasks.length,pending:tasks.filter(x=>x.status!=='مكتمل').length};
    }
  };
})();