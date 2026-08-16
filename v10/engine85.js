import * as core from './engine84.js?v=100';
export * from './engine84.js?v=100';
import {applyContext85} from './context85b.js?v=85b';
import {analyze100} from './intelligence100.js?v=100';
export function analyze(raw,entryIntent='smart'){
 if(globalThis.__SCHOOL_ENGINE100__)return applyContext85(analyze100(raw,entryIntent));
 return applyContext85(core.analyze(raw,entryIntent));
}
