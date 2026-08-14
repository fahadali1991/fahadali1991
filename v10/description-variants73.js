import {shortText73,mediumText73,longText73,bulletText73} from './description-texts73.js?v=73';
export function descriptionVariants73(s){const b=bulletText73(s);return[
{id:'short',label:'مختصر',help:'مباشر وسريع',mode:'text',text:shortText73(s)},
{id:'medium',label:'متوسط',help:'متوازن ويذكر أقوى ارتباط بالدليل عند وضوحه',mode:'text',text:mediumText73(s)},
{id:'long',label:'مفصل',help:'تفصيلي ويستفيد من أكثر من ارتباط قوي',mode:'text',text:longText73(s)},
{id:'bullets',label:'على شكل نقاط',help:'مناسب للتقارير السريعة والمراجعة',mode:'bullets',items:b,text:b.map(x=>`• ${x}`).join('\n')}
]}
