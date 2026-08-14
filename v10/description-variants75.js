import {shortText75,mediumText75,longText75,bulletText75} from './description-texts75.js?v=75';
export function descriptionVariants75(s){const b=bulletText75(s);return[
{id:'short',label:'مختصر',help:'مباشر وسريع دون تكرار بيانات الوثيقة',mode:'text',text:shortText75(s)},
{id:'medium',label:'متوسط',help:'متوازن ويذكر أقوى ارتباط بالدليل عند وضوحه',mode:'text',text:mediumText75(s)},
{id:'long',label:'مفصل',help:'تفصيلي ويستفيد من أكثر من ارتباط قوي',mode:'text',text:longText75(s)},
{id:'bullets',label:'على شكل نقاط',help:'يحافظ على النقاط حتى الإخراج النهائي',mode:'bullets',items:b,text:b.map(x=>`• ${x}`).join('\n')}
]}
