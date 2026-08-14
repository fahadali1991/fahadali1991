import {runContext85Tests} from './context85-tests.js';
const results=runContext85Tests();
const failed=results.filter(x=>!x.pass);
console.log(`V85 context tests: ${results.length-failed.length}/${results.length} passed`);
for(const r of results)console.log(`${r.pass?'PASS':'FAIL'} | ${r.name} | ${r.actual.type||'غير محسوم'}`);
if(failed.length){console.error('\nFailed cases:');for(const r of failed){console.error(`- ${r.name}`);console.error(JSON.stringify(r.actual,null,2));}process.exit(1)}
