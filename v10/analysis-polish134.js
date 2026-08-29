function polish134(){
 document.querySelectorAll('.analysisPage134').forEach(x=>{if(x.getAttribute('dir')!=='ltr')x.setAttribute('dir','ltr')});
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
