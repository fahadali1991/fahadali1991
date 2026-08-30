import * as core from './engine84.js?v=101';
import {preview101} from './intelligence101.js?v=120.1';
const uniq=a=>[...new Set((a||[]).filter(Boolean))];
function forceDirectEntry134(s,entryIntent){
 s.metadata=s.metadata||{};
 if(entryIntent==='analysis'){if(core.setType)core.setType(s,'تحليل نتائج');if(core.setSubtype)core.setSubtype(s,'تحليل نتائج');s.metadata.directEntry134='analysis';return}
 if(entryIntent==='classification'){if(core.setType)core.setType(s,'تحليل نتائج');if(core.setSubtype)core.setSubtype(s,'تحليل نتائج');s.metadata.directEntry134='classification';return}
 if(entryIntent==='remedial'){if(core.setType)core.setType(s,'تحليل نتائج');if(core.setSubtype)core.setSubtype(s,'تحليل نتائج');s.metadata.directEntry134='remedial';return}
 if(entryIntent==='enrichment'){if(core.setType)core.setType(s,'تحليل نتائج');if(core.setSubtype)core.setSubtype(s,'تحليل نتائج');s.metadata.directEntry134='enrichment';return}
}
export function analyze101(raw,entryIntent='smart'){
 const s=core.analyze(raw,entryIntent),f=preview101(raw);s.metadata=s.metadata||{};s.metadata.semantic101=f;
 if(f.family){if(core.setType)core.setType(s,f.family.type);else s.classification={...(s.classification||{}),type:f.family.type};if(f.subtype&&core.setSubtype)core.setSubtype(s,f.subtype)}
 if(f.topic)s.topic=f.topic;if(f.stage)s.stage=f.stage;if(f.grades?.length)s.grades=f.grades;if(f.audiences?.length)s.suggestedAudiences=uniq([...(s.suggestedAudiences||[]),...f.audiences]);
 s.metadata.subjectHint101=f.subject?.name||'';s.metadata.subjectConfidence101=f.subject?.confidence||0;s.metadata.schoolDomain101=f.schoolDomain?.name||'';s.metadata.semanticDuration101=f.duration||'';s.metadata.semanticIntent101=f.intent||'';s.metadata.semanticFinding101=f.finding||'';s.metadata.semanticPurpose101=f.purpose||'';s.metadata.semanticContent101=f.content||'';s.metadata.semanticLocation101=f.location||'';s.metadata.semanticScope101=f.scope||'';
 if(f.count!==null&&f.count!==undefined&&f.count!=='')s.metadata.count=String(f.count);
 if(f.section){s.metadata.section111=f.section;s.metadata.familyMeta111={...(s.metadata.familyMeta111||{}),section:f.section}}
 if(f.location&&!s.metadata.place)s.metadata.place=f.location;
 forceDirectEntry134(s,entryIntent);
 return s;
}
