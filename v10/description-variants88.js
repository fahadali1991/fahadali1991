import {shortText80,mediumText80,longText80,bulletText80} from './description-texts80.js?v=110';
export function descriptionVariants88(s){const b=bulletText80(s);return[
{id:'short',label:'مختصر',help:'مباشر وسريع دون تكرار بيانات الوثيقة',mode:'text',text:shortText80(s)},
{id:'medium',label:'متوسط',help:'متوازن ويستخدم المجال والارتباطات المعتمدة دون ادعاء أثر غير مقاس',mode:'text',text:mediumText80(s)},
{id:'long',label:'مفصل',help:'تفصيلي حسب عائلة العمل، مع التمييز بين ما تم وما سيُتابع لاحقًا',mode:'text',text:longText80(s)},
{id:'bullets',label:'على شكل نقاط',help:'يعرض الحقائق والمخرجات على شكل نقاط واضحة قابلة للطباعة',mode:'bullets',items:b,text:b.map(x=>`• ${x}`).join('\n')}
]}
