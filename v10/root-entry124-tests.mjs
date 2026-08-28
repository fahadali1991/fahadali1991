import {chromium} from 'playwright';
import assert from 'node:assert/strict';

const root='http://127.0.0.1:4173/';
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
    assert.equal(url.pathname,'/home106.html',`${s.label}: root did not enter the tested V123 application; got ${page.url()}`);
    assert.equal(url.searchParams.get('v'),'123',`${s.label}: V123 cache/version marker missing from root entry`);
    assert.ok(await page.locator('.workspace109').isVisible(),`${s.label}: V123 workspace did not render after root redirect`);
    assert.ok(await page.getByText('وثّق عملك بسهولة').isVisible(),`${s.label}: tested V123 home screen was not visible`);
    assert.equal(errors.length,0,`${s.label}: browser errors after root redirect: ${errors.join(' | ')}`);
    await context.close();
    console.log(`✓ root-entry-${s.label}`);
  }
}finally{
  await browser.close();
}
console.log('V124 root entry acceptance PASS: / routes to tested V123 app on mobile and desktop.');
