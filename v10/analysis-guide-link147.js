const INDICATOR='2-2-1-3';
const TEXT='تحلل المدرسة نتائج التقويم، وتوظفها في تحسين عمليات التعليم والتعلم والتقويم.';
function strip(){const d=document.createElement('div');d.className='guideLink147';d.innerHTML=`<b>ارتباط داعم بالدليل - المؤشر (${INDICATOR})</b><span>${TEXT} هذه الوثيقة تدعم ملف الأدلة ولا تعني بمفردها تحقق المؤشر.</span>`;return d}
function place(sheet){if(sheet.querySelector('.guideLink147'))return;const sign=sheet.querySelector('.analysisSign134,.model1ClassSign138');const footer=sheet.querySelector('.analysisFooter134');const node=strip();if(sign)sign.insertAdjacentElement('beforebegin',node);else if(footer)footer.insertAdjacentElement('beforebegin',node);else sheet.appendChild(node)}
function run(){document.querySelectorAll('.classificationSheet134,.planSheet134.remedial,.planSheet134.enrichment').forEach(place)}
if(typeof document!=='undefined'){new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run()}
