import {shortText72,mediumText72,longText72,bulletText72} from './description-texts72.js?v=72';
export function descriptionVariants72(s){const b=bulletText72(s);return[
{id:'short',label:'مختصر',help:'صياغة سريعة ومباشرة',mode:'text',text:shortText72(s)},
{id:'medium',label:'متوسط',help:'تفاصيل متوازنة مع الارتباط القوي بالدليل عند توفره',mode:'text',text:mediumText72(s)},
{id:'long',label:'مفصل',help:'تفاصيل أوسع تشمل المجال والمؤشر عند قوة الارتباط',mode:'text',text:longText72(s)},
{id:'bullets',label:'على شكل نقاط',help:`${b.length} نقاط مبنية على المدخلات`,mode:'bullets',items:b,text:b.map(x=>`• ${x}`).join('\n')}
]}
