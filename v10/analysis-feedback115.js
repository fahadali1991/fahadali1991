function title115(){return document.querySelector('.analysisHero113 h1,.pdfHero107 h1')?.textContent?.trim()||'وثيقة مدرسية'}
function shareText115(){const subject=document.querySelector('.analysisHero113 h2')?.textContent?.trim();return [title115(),subject].filter(Boolean).join(' - ')}
function ensureToolbar115(){
 const host=document.querySelector('.pdfToolbarActions107');if(!host||host.querySelector('[data-pdf-share115]'))return;
 host.insertAdjacentHTML('beforeend','<button type="button" class="btn pdfShare115" data-pdf-whatsapp115><b>◉</b><span>واتساب</span></button><button type="button" class="btn pdfShare115" data-pdf-share115><b>↗</b><span>مشاركة</span></button>');
}
function normalizeAnalysisMeta115(){document.querySelectorAll('.analysisMeta113 span').forEach(x=>{if(x.textContent.trim()==='الفترة')x.textContent='الفصل الدراسي'})}
function apply115(){ensureToolbar115();normalizeAnalysisMeta115()}
async function share115(){const data={title:title115(),text:shareText115(),url:location.href};if(navigator.share){try{await navigator.share(data);return}catch(e){if(e?.name==='AbortError')return}}try{await navigator.clipboard.writeText([data.text,data.url].join('\n'));alert('تم نسخ رابط الوثيقة للمشاركة.')}catch{prompt('انسخ رابط الوثيقة للمشاركة:',data.url)}}
function whatsapp115(){const text=encodeURIComponent(`${shareText115()}\n${location.href}`);window.open(`https://wa.me/?text=${text}`,'_blank','noopener,noreferrer')}
document.addEventListener('click',e=>{if(e.target.closest('[data-pdf-share115]')){share115();return}if(e.target.closest('[data-pdf-whatsapp115]'))whatsapp115()},true);
new MutationObserver(apply115).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply115,{once:true});else apply115();
