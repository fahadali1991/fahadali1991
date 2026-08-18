import {familyDetailsPage106} from './family-details106.js?v=111';
import {subjectSelector109,applySubject109} from './subject-selector109.js?v=110.2';
import {familyMetaQuestion111,familyMetaPending111,bindFamilyMeta111} from './family-meta111.js?v=111';
let current=null;
function inject(html,state){const subject=subjectSelector109(state),meta=familyMetaQuestion111(state),pending=familyMetaPending111(state);const marker='<div data-adaptive-zone>';let out=html;if(subject&&out.includes(marker))out=out.replace(marker,`${subject}${marker}`);if(meta&&out.includes(marker))out=out.replace(marker,`${meta}<div data-adaptive-zone${pending?' hidden':''}>`);return out}
document.addEventListener('click',e=>{const b=e.target.closest('[data-subject109]');const g=e.target.closest('[data-subject-general109]');if(!current||(!b&&!g))return;if(g)applySubject109(current,'',{general:true});else applySubject109(current,b.dataset.subject109);const old=document.querySelector('.subjectBlock109');if(old)old.outerHTML=subjectSelector109(current);const hidden=document.querySelector('.subjectBlock109 [data-family-field="subject94"]');if(hidden)hidden.dispatchEvent(new Event('input',{bubbles:true}))},true);
export function familyDetailsPage109(state){current=state;bindFamilyMeta111(state);return inject(familyDetailsPage106(state),state)}
