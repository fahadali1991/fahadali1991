const DOMAINS=['البرامج والأنشطة','الإدارة والمتابعة','التحصيل والتقويم','التخطيط والتحسين','الحضور والانضباط','التطوير المهني','التوجيه الطلابي','الأمن والسلامة','الشراكة المجتمعية','الجودة والتقويم الذاتي','التقنية والتحول الرقمي','القيم والهوية الوطنية'];
function enhance(){
 const app=document.getElementById('app');if(!app)return;
 const domainInput=document.getElementById('domainEdit');
 if(domainInput&&domainInput.tagName==='INPUT'){
  const sel=document.createElement('select');sel.id='domainEdit';sel.className=domainInput.className;
  const current=domainInput.value.trim();
  const first=document.createElement('option');first.value='';first.textContent='اختر المجال';sel.appendChild(first);
  [...new Set(current?[current,...DOMAINS]:DOMAINS)].forEach(x=>{const o=document.createElement('option');o.value=x;o.textContent=x;o.selected=x===current;sel.appendChild(o)});
  domainInput.replaceWith(sel);
 }
 const choosers=[...app.querySelectorAll('.chooser')];
 const family=choosers.find(x=>x.querySelector('small')?.textContent.trim()==='عائلة العمل');
 const subtype=choosers.find(x=>x.querySelector('small')?.textContent.trim()==='النوع الفرعي');
 const domain=document.getElementById('domainEdit')?.closest('label');
 const topic=document.getElementById('topicEdit')?.closest('label');
 if(family&&subtype&&domain&&topic){
  let block=app.querySelector('.classificationOrderBlock');
  if(!block){block=document.createElement('div');block.className='classificationOrderBlock chooser';const title=document.createElement('small');title.textContent='تصنيف العمل';block.appendChild(title);family.parentNode.insertBefore(block,family)}
  if(family.parentNode!==block)block.appendChild(family);
  if(subtype.parentNode!==block)block.appendChild(subtype);
  let row=block.querySelector('.classificationFields');if(!row){row=document.createElement('div');row.className='editGrid classificationFields';block.appendChild(row)}
  if(domain.parentNode!==row)row.appendChild(domain);
  if(topic.parentNode!==row)row.appendChild(topic);
 }
}
const obs=new MutationObserver(()=>requestAnimationFrame(enhance));obs.observe(document.documentElement,{childList:true,subtree:true});document.addEventListener('DOMContentLoaded',enhance);enhance();
