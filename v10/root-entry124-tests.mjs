import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const root='http://127.0.0.1:4173/';
const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const releaseToken=index.match(/home106\.html\?v=([^"'<>]+)/)?.[1];
assert.ok(releaseToken,'index.html must declare the active home106 release token');
const scenarios=[
  {label:'mobile',viewport:{width:390,height:844}},
  {label:'desktop',viewport:{width:1440,height:1000}},
];

const browser=await chromium.launch({headless:true});
try{
  for(const s of scenarios){
    const context=await browser.newContext({viewport:s.viewport,locale:'ar-SA'});
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',e=>errors.push(String(e)));
    await page.goto(root,{waitUntil:'networkidle'});
    const url=new URL(page.url());
    assert.equal(url.pathname,'/home106.html',`${s.label}: root did not enter the active application; got ${page.url()}`);
    assert.equal(url.searchParams.get('v'),releaseToken,`${s.label}: root redirect did not preserve active release token ${releaseToken}`);
    assert.ok(await page.locator('.workspace109').isVisible(),`${s.label}: workspace did not render after root redirect`);
    assert.ok(await page.getByText('وثّق عملك بسهولة').isVisible(),`${s.label}: active home screen was not visible`);
    assert.equal(errors.length,0,`${s.label}: browser errors after root redirect: ${errors.join(' | ')}`);
    await context.close();
    console.log(`✓ root-entry-${s.label}-v${releaseToken}`);
  }
}finally{
  await browser.close();
}
console.log(`V124 root entry acceptance PASS: / routes to active v${releaseToken} app on mobile and desktop.`);
