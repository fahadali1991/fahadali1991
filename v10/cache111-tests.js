import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const checks=[
 ['home106.html','v10/app103.js?v=111'],
 ['v10/app103.js','./app89.js?v=111'],
 ['v10/app89.js','./app88.js?v=111'],
 ['v10/app88.js','./family-details68.js?v=111'],
 ['v10/app88.js','./final76.js?v=111'],
 ['v10/family-details68.js','./family-details109.js?v=111'],
 ['v10/final76.js','./pdf-renderer107.js?v=111'],
 ['v10/pdf-renderer107.js','./pdf-model107.js?v=111']
];
for(const [file,needle] of checks)assert.ok(read(file).includes(needle),`${file} must load ${needle}`);
console.log(`V111 cache chain PASS: ${checks.length}/${checks.length} production module edges point to V111.`);
