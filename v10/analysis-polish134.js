function polish134(){
 document.querySelectorAll('.analysisPage134').forEach(x=>{
  const raw=(x.textContent||'').trim();
  const m=raw.match(/^(\d+)\s*\/\s*(\d+)$/);
  if(m)x.textContent=`صفحة ${m[1]} من ${m[2]}`;
  x.setAttribute('dir','rtl');
  x.style.direction='rtl';
  x.style.unicodeBidi='isolate';
 });
 document.querySelectorAll('.analysisMetrics134 b,.analysisClassTable134 .row>* ,.planStudents134 small,.directTargets134 small').forEach(x=>{
  const raw=(x.textContent||'').trim();
  const m=raw.match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
  if(m)x.textContent=`${m[1]} من ${m[2]}`;
 });
 document.querySelectorAll('.analysisIndicator134').forEach(x=>{
  if(x.querySelector('bdi[data-indicator-code134]'))return;
  x.innerHTML=x.innerHTML.replace(/2-2-1-3/g,'<bdi dir="ltr" data-indicator-code134>2-2-1-3</bdi>');
 });
 document.querySelectorAll('.analysisResult134 p,.analysisSheet134 p').forEach(x=>{
  const before=x.textContent||'';
  const after=before.replace(/حقق مستوى الإتقان المستهدف\s+(\d+)\s+من\s+(\d+)\s+طالبًا/g,'حقق $1 من $2 طلاب مستوى الإتقان المستهدف');
  if(after!==before)x.textContent=after;
 });
}
if(typeof document!=='undefined'){
 new MutationObserver(polish134).observe(document.documentElement,{childList:true,subtree:true});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',polish134,{once:true});else polish134();
}
