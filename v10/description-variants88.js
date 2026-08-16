import {shortText80,mediumText80,longText80,bulletText80} from './description-texts80.js?v=88';
export function descriptionVariants88(s){const b=bulletText80(s);return[
{id:'short',label:'مختصر',help:'مباشر وسريع دون تكرار بيانات الوثيقة',mode:'text',text:shortText80(s)},
{id:'medium',label:'متوسط',help:'متوازن ويستخدم المجال والمؤشر المعتمدين',mode:'text',text:mediumText80(s)},
{id:'long',label:'مفصل',help:'تفصيلي حسب عائلة العمل مع الارتباط بالدليل',mode:'text',text:longText80(s)},
{id:'bullets',label:'على شكل نقاط',help:'يحافظ على النقاط حتى الإخراج النهائي',mode:'bullets',items:b,text:b.map(x=>`• ${x}`).join('\n')}
]}
