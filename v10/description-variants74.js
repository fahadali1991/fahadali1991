import {shortText74,mediumText74,longText74,bulletText74} from './description-texts74.js?v=74';
export function descriptionVariants74(s){const b=bulletText74(s);return[
{id:'short',label:'مختصر',help:'مباشر وسريع دون تكرار بيانات الوثيقة',mode:'text',text:shortText74(s)},
{id:'medium',label:'متوسط',help:'متوازن ويذكر أقوى ارتباط بالدليل عند وضوحه',mode:'text',text:mediumText74(s)},
{id:'long',label:'مفصل',help:'تفصيلي ويستفيد من أكثر من ارتباط قوي',mode:'text',text:longText74(s)},
{id:'bullets',label:'على شكل نقاط',help:'يحافظ على النقاط حتى الإخراج النهائي',mode:'bullets',items:b,text:b.map(x=>`• ${x}`).join('\n')}
]}
