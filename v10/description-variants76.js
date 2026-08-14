import {shortText76,mediumText76,longText76,bulletText76} from './description-texts76.js?v=76';
export function descriptionVariants76(s){const b=bulletText76(s);return[
{id:'short',label:'مختصر',help:'مباشر وسريع دون تكرار بيانات الوثيقة',mode:'text',text:shortText76(s)},
{id:'medium',label:'متوسط',help:'متوازن ويستخدم المجال والمؤشر المعتمدين',mode:'text',text:mediumText76(s)},
{id:'long',label:'مفصل',help:'تفصيلي مع الارتباط بالدليل عند وضوحه',mode:'text',text:longText76(s)},
{id:'bullets',label:'على شكل نقاط',help:'يحافظ على النقاط حتى الإخراج النهائي',mode:'bullets',items:b,text:b.map(x=>`• ${x}`).join('\n')}
]}
