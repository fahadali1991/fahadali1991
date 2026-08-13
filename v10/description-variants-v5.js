import {shortText,mediumText,longText,bulletText} from './description-texts-v5.js';
export function descriptionVariants(s){const b=bulletText(s);return[
{id:'short',label:'مختصر',help:'صياغة سريعة ومباشرة',mode:'text',text:shortText(s)},
{id:'medium',label:'متوسط',help:'تفاصيل متوازنة للاستخدام اليومي',mode:'text',text:mediumText(s)},
{id:'long',label:'مفصل',help:'تفاصيل أوسع للوثائق المهمة',mode:'text',text:longText(s)},
{id:'bullets',label:'على شكل نقاط',help:`${b.length} نقاط مبنية على المدخلات`,mode:'bullets',items:b,text:b.map(x=>`• ${x}`).join('\n')}
]}
