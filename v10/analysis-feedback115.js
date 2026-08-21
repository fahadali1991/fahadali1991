function title115(){return document.querySelector('.analysisHero113 h1,.pdfHero107 h1')?.textContent?.trim()||'وثيقة مدرسية'}
function shareText115(){const subject=document.querySelector('.analysisHero113 h2')?.textContent?.trim();return [title115(),subject].filter(Boolean).join(' - ')}
function ensureToolbar115(){
 const host=document.querySelector('.pdfToolbarActions107');if(!host||host.querySelector('[data-pdf-share115]'))return;
 host.insertAdjacentHTML('beforeend','<button type="button" class="btn pdfShare115" data-pdf-share115><b>↗</b><span>مشاركة</span></button>');
}
function normalizeAnalysisMeta115(){document.querySelectorAll('.analysisMeta113 span').forEach(x=>{if(x.textContent.trim()==='الفترة')x.textContent='الفصل الدراسي'})}
function apply115(){ensureToolbar115();normalizeAnalysisMeta115()}
async function share115(){const data={title:title115(),text:shareText115(),url:location.href};if(navigator.share){try{await navigator.share(data);return}catch(e){if(e?.name==='AbortError')return}}try{await navigator.clipboard.writeText([data.text,data.url].join('\n'));alert('تعذر فتح قائمة المشاركة في هذا المتصفح؛ تم نسخ رابط الوثيقة.')}catch{prompt('انسخ رابط الوثيقة للمشاركة:',data.url)}}
document.addEventListener('click',e=>{if(e.target.closest('[data-pdf-share115]'))share115()},true);
new MutationObserver(apply115).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply115,{once:true});else apply115();
