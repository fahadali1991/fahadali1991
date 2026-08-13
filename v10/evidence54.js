import {evidencePage as base,selectedEvidence} from './evidence-ui-v53.js';
export {selectedEvidence};
function previews(state){const files=state.attachments||[];const imgs=files.map((f,i)=>({f,i})).filter(x=>(x.f.type||'').startsWith('image/'));if(!imgs.length)return'';return `<section class="card"><h3>معاينة الصور قبل الاعتماد</h3><div class="imagePreviewGrid">${imgs.map(({f,i})=>{let src='';try{src=URL.createObjectURL(f.file||f)}catch{}return `<div class="imagePreviewItem">${src?`<img src="${src}" alt="${f.name||'صورة'}">`:''}<small>${f.name||'صورة'}</small><button class="linkBtn dangerText" data-remove-attachment="${i}">حذف</button></div>`}).join('')}</div></section>`}
export function evidencePage(state){return base(state)+previews(state)}
