import {BANK101,BANK101_RULES} from './bank101.js?v=101';
import {BANK101_EXPANDED} from './bank101-expanded.js?v=101';
export const BANK101_ALL=[...BANK101,...BANK101_EXPANDED];
export {BANK101_RULES};
export function bank101Stats(){
 const count=(key)=>BANK101_ALL.reduce((a,x)=>((a[x[key]||'غير محدد']=(a[x[key]||'غير محدد']||0)+1),a),{});
 return {total:BANK101_ALL.length,registers:count('register')};
}
