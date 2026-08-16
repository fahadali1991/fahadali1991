import {guideLinks75} from './guide-link75.js?v=75';
import {selectedDomains76,GUIDE_DOMAINS} from './domain76.js?v=76';
const text=s=>`${s.raw||''} ${s.topic||''} ${s.metadata?.titleClarification||''}`;
const has=(s,re)=>re.test(text(s));
function validForCore(s,x){if(x.code==='2-1-1-4'&&!has(s,/(تقني|رقمي|مدرستي|ذكاء اصطناعي|إلكتروني|الكتروني)/))return false;if(x.code==='2-1-1-9'&&!has(s,/(دافعي|تحفيز|استمتاع)/))return false;return true}
export function autoGuideLinks76(s){return guideLinks75(s).filter(x=>validForCore(s,x));}
export function autoPrimaryDomain76(s){const p=autoGuideLinks76(s)[0];return p?Number(p.domain):null}
export function guideLinks76(s){const all=autoGuideLinks76(s),d=selectedDomains76(s,autoPrimaryDomain76(s));if(!d.primary)return all.slice(0,5);const primary=all.filter(x=>Number(x.domain)===d.primary);const related=d.related?all.filter(x=>Number(x.domain)===d.related):[];return [...primary.slice(0,3),...related.slice(0,2)].slice(0,5)}
export function strongGuideLinks76(s){return guideLinks76(s).filter(x=>x.strength==='قوي').slice(0,3)}
export function primaryGuideLink76(s){return strongGuideLinks76(s)[0]||guideLinks76(s)[0]||null}
export function guideSupportSentence76(s,limit=1){const links=strongGuideLinks76(s).slice(0,limit);if(!links.length)return'';if(links.length===1){const x=links[0];return `كما يسهم العمل في دعم الممارسات المرتبطة بـ${String(x.text||'').replace(/\.$/,'')} ضمن مجال ${x.domainName}.`;}return `كما يسهم العمل في دعم ممارسات مرتبطة بمجال ${[...new Set(links.map(x=>x.domainName))].join(' ومجال ')}.`}
export function selectedGuideDomains76(s){return selectedDomains76(s,autoPrimaryDomain76(s))}
export {GUIDE_DOMAINS};
