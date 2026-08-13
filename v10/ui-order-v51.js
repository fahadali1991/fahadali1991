const DOMAINS=['البرامج والأنشطة','الإدارة والمتابعة','التحصيل والتقويم','التخطيط والتحسين','الحضور والانضباط','التطوير المهني','التوجيه الطلابي','الأمن والسلامة','الشراكة المجتمعية','الجودة والتقويم الذاتي','التقنية والتحول الرقمي','القيم والهوية الوطنية'];
function enhance(){
 const app=document.getElementById('app'); if(!app)return;
 const domainInput=document.getElementById('domainEdit');
 if(domainInput){
  const select=document.createElement('select');select.id='domainSelect';select.innerHTML='<option value="">اختر المجال</option>'+DOMAINS.map(x=>`<option value="${x}" ${x===domainInput.value?'selected':''}>${x}</option>`).join('');
  domainInput.replaceWith(select);
 }
 const topic=document.getElementById('topicEdit');
 const domain=document.getElementById('domainSelect');
 const family=[...app.querySelectorAll('.chooser')].find(x=>x.querySelector('small')?.textContent.trim()==='عائلة العمل');
 const subtype=[...app.querySelectorAll('.chooser')].find(x=>x.querySelector('small')?.textContent.trim()==='النوع الفرعي');
 if(family&&subtype&&domain&&topic){
  const host=family.parentElement;
  const box=document.createElement('div');box.className='card classificationOrganizer';box.innerHTML='<div class="muted">تصنيف العمل</div><p class="questionHelp">راجع التصنيف وعدله عند الحاجة.</p>';
  host.insertBefore(box,family);box.appendChild(family);box.appendChild(subtype);
  const df=domain.closest('label');const tf=topic.closest('label');if(df)box.appendChild(df);if(tf)box.appendChild(tf);
 }
}
new MutationObserver(()=>requestAnimationFrame(enhance)).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('DOMContentLoaded',enhance);
document.addEventListener('change',e=>{if(e.target?.id==='domainSelect'){const old=document.getElementById('domainEdit');if(old)old.value=e.target.value;}});
