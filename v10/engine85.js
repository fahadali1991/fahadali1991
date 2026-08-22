import * as core from './engine84.js?v=101';
export * from './engine84.js?v=101';
import {applyContext85} from './context85b.js?v=85b';
import {analyze100} from './intelligence100.js?v=100';
import {analyze101} from './intelligence101-runtime.js?v=119.1';
import {normalizeEducationState114} from './education-scope114.js?v=119.1';
function finalizeEducation114(state){return normalizeEducationState114(applyContext85(state))}
export function analyze(raw,entryIntent='smart'){
 if(globalThis.__SCHOOL_ENGINE101__)return finalizeEducation114(analyze101(raw,entryIntent));
 if(globalThis.__SCHOOL_ENGINE100__)return finalizeEducation114(analyze100(raw,entryIntent));
 return finalizeEducation114(core.analyze(raw,entryIntent));
}
