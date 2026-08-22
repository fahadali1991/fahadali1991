import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const home=read('home106.html'),app103=read('v10/app103.js'),app89=read('v10/app89.js'),app88=read('v10/app88.js');
const token=home.match(/v10\/app103\.js\?v=([^"']+)/)?.[1];
assert.ok(token,'home106.html must version the production app entry');
assert.ok(app103.includes(`./app89.js?v=${token}`),`app103.js must carry production token ${token} to app89.js`);
assert.ok(app89.includes(`./app88.js?v=${token}`),`app89.js must carry production token ${token} to app88.js`);
for(const [file,needle] of [
 ['v10/app88.js',`./family-details68.js?v=${token}`],
 ['v10/app88.js','./final76.js?v=111'],
 ['v10/family-details68.js',`./family-details109.js?v=${token}`],
 ['v10/family-details109.js',`./family-details106.js?v=${token}`],
 ['v10/family-details109.js',`./subject-selector109.js?v=${token}`],
 ['v10/final76.js','./pdf-renderer107.js?v=113'],
 ['v10/pdf-renderer107.js','./pdf-model107.js?v=113']
])assert.ok(read(file).includes(needle),`${file} must preserve validated dependency edge ${needle}`);
assert.ok(app88.includes('./description-ui88.js?v=112'),'unchanged description UI remains pinned to validated V112');
assert.ok(app88.includes('./description-variants88.js?v=112'),'unchanged description variants remain pinned to validated V112');
console.log(`Production cache chain PASS: shell token ${token}; changed analysis edges share the production token while unchanged modules remain pinned.`);
