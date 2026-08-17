const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
const arr=v=>Array.isArray(v)?v:String(v||'').split('|||').map(clean).filter(Boolean);
const first=(...vs)=>vs.map(clean).find(Boolean)||'';
const fact=(value,source='unknown',confidence=0)=>({value,source,confidence});
const fd=s=>s?.metadata?.familyDetails||{};
const sem=s=>s?.metadata?.semantic101||{};

function subjectValue(s){return first(fd(s).subject94,s?.metadata?.subjectHint101,sem(s)?.subject?.name)}
function skillValue(s){return first(fd(s).skillFocus,s?.metadata?.matrixFacts105?.skill?.value,s?.metadata?.matrixFacts103?.skill?.value)}
function durationValue(s){return first(s?.metadata?.durationChoice,s?.metadata?.duration,sem(s)?.duration)}
function placeValue(s){return first(s?.metadata?.place,s?.metadata?.placeChoice,sem(s)?.location)}
function audienceValue(s){return arr(s?.audiences).length?arr(s.audiences):arr(s?.suggestedAudiences)}

export function buildCanonicalContext106(s={}){
 const sf=fd(s),sm=sem(s),subject=subjectValue(s),skill=skillValue(s);
 return {
  schemaVersion:106,
  raw:clean(s.raw),
  document:{
   family:fact(first(s?.classification?.type,sm?.family?.type),'classification',s?.classification?.type?1:(sm?.family?.confidence||0)/100),
   subtype:fact(first(s?.classification?.subtype,sm?.subtype),'classification',s?.classification?.subtype?1:0.85)
  },
  education:{
   subject:fact(subject,fd(s).subject94?'user':subject?'inference':'unknown',fd(s).subject94?1:(s?.metadata?.subjectConfidence101||0)/100),
   branch:fact(first(s?.metadata?.matrixFacts105?.branch?.value,s?.metadata?.matrixFacts103?.branch?.value),'resolver',0.9),
   topic:fact(first(s?.topic,sm?.topic),'semantic',s?.topic?0.95:0.75),
   skill:fact(skill,fd(s).skillFocus?'user':skill?'resolver':'unknown',fd(s).skillFocus?1:skill?0.9:0),
   stage:fact(first(s?.stage,sm?.stage),'semantic',s?.stage?1:0.8),
   grades:arr(s?.grades).length?arr(s.grades):arr(sm?.grades),
   audiences:audienceValue(s)
  },
  execution:{
   duration:fact(durationValue(s),s?.metadata?.durationChoice?'user':sm?.duration?'inference':'unknown',s?.metadata?.durationChoice?1:sm?.duration?0.8:0),
   place:fact(placeValue(s),s?.metadata?.place?'user':sm?.location?'inference':'unknown',s?.metadata?.place?1:sm?.location?0.8:0),
   date:fact(first(s?.metadata?.dateDisplay,s?.metadata?.dateISO),'user',s?.metadata?.dateISO?1:0),
   executor:fact(clean(s?.metadata?.executorName),'user',s?.metadata?.executorName?1:0),
   count:fact(clean(s?.metadata?.count),'user',s?.metadata?.count?1:0)
  },
  details:{
   reason:fact(clean(sf.reason),sf.reason?'user':sm?.intent?'inference':'unknown',sf.reason?1:sm?.intent?0.75:0),
   goal:fact(clean(sf.goal),'user',sf.goal?1:0),
   method:fact(clean(sf.method),'user',sf.method?1:0),
   observation:fact(clean(sf.participation),'user',sf.participation?1:0),
   basis:fact(clean(sf.basis),'user',sf.basis?1:0),
   finding:fact(first(sf.finding,sm?.finding),sf.finding?'user':sm?.finding?'inference':'unknown',sf.finding?1:sm?.finding?0.8:0),
   cause:fact(clean(sf.cause),'user',sf.cause?1:0),
   action:fact(clean(sf.action),'user',sf.action?1:0),
   follow:fact(clean(sf.follow),'user',sf.follow?1:0),
   purpose:fact(first(sf.purpose,sm?.purpose),sf.purpose?'user':sm?.purpose?'inference':'unknown',sf.purpose?1:sm?.purpose?0.85:0),
   work:fact(clean(sf.work),'user',sf.work?1:0),
   product:fact(clean(sf.product),'user',sf.product?1:0),
   owner:fact(clean(sf.owner),'user',sf.owner?1:0),
   status:fact(clean(sf.status),'user',sf.status?1:0),
   need:fact(clean(sf.need),'user',sf.need?1:0),
   application:fact(clean(sf.application),'user',sf.application?1:0),
   measurement:fact(clean(sf.measurement),'user',sf.measurement?1:0)
  },
  domain:{
   schoolDomain:fact(first(s?.metadata?.schoolDomain101,sm?.schoolDomain?.name),'semantic',0.8),
   primaryGuideDomain:fact(clean(s?.metadata?.guidePrimaryDomain76),'user',s?.metadata?.guidePrimaryDomain76?1:0),
   relatedGuideDomain:fact(clean(s?.metadata?.guideRelatedDomain76),'user',s?.metadata?.guideRelatedDomain76?1:0)
  }
 };
}

export function contextValue106(ctx,path){return path.split('.').reduce((x,k)=>x?.[k],ctx)?.value??path.split('.').reduce((x,k)=>x?.[k],ctx)??''}
export function known106(node,min=0.85){return Boolean(node?.value)&&((node.source==='user'||node.source==='classification')||Number(node.confidence||0)>=min)}
export function withCanonicalContext106(state){state.metadata=state.metadata||{};state.metadata.canonical106=buildCanonicalContext106(state);return state.metadata.canonical106}
