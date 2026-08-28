import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

fs.mkdirSync('artifacts',{recursive:true});
const browser=await chromium.launch({headless:true});
const cases=[['mobile',{width:390,height:844}],['desktop',{width:1440,height:1000}]];
try{
 for(const [label,viewport] of cases){
  const page=await browser.newPage({viewport});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/v10/analysis-output132-fixture.html',{waitUntil:'networkidle'});
  await page.waitForSelector('[data-analysis-output-host132]');
  assert.match(await page.locator('[data-analysis-output-host132]').innerText(),/اختر ما تريد إنشاءه من التحليل نفسه/);
  assert.equal(await page.locator('.analysisBundleSheet132').count(),4,`${label}: النموذج الكامل يجب أن يكون 4 صفحات`);
  assert.match(await page.locator('.analysisBundlePages132').innerText(),/ملخص التحليل والقرار التربوي/);
  assert.match(await page.locator('.analysisBundlePages132').innerText(),/تصنيف الطلاب والقرار التربوي/);
  assert.match(await page.locator('.analysisBundlePages132').innerText(),/خطة علاجية مقترحة/);
  assert.match(await page.locator('.analysisBundlePages132').innerText(),/خطة إثرائية مقترحة/);
  assert.match(await page.locator('.analysisBundlePages132').innerText(),/أحمد/);
  assert.match(await page.locator('.analysisBundlePages132').innerText(),/المذكر والمؤنث/);

  await page.locator('[data-analysis-output132="remedial"]').uncheck();
  await page.waitForTimeout(80);
  assert.equal(await page.locator('.analysisBundleSheet132').count(),3,`${label}: إزالة العلاجية تحدث المعاينة مباشرة`);
  await page.locator('[data-analysis-output132="enrichment"]').uncheck();
  await page.waitForTimeout(80);
  assert.equal(await page.locator('.analysisBundleSheet132').count(),2,`${label}: التحليل والتصنيف فقط`);
  await page.locator('[data-analysis-output132="remedial"]').check();
  await page.locator('[data-analysis-output132="enrichment"]').check();
  await page.waitForTimeout(80);
  assert.equal(await page.locator('.analysisBundleSheet132').count(),4);

  const horizontal=await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+2);
  assert.equal(horizontal,true,`${label}: لا يوجد تمرير أفقي في واجهة الاختيار`);
  assert.equal(errors.length,0,`${label}: browser errors ${errors.join(' | ')}`);
  await page.screenshot({path:`artifacts/v132-analysis-output-${label}.png`,fullPage:true});
  if(label==='desktop'){
   await page.emulateMedia({media:'print'});
   const pdf=await page.pdf({path:'artifacts/v132-analysis-output-model.pdf',printBackground:true,preferCSSPageSize:true});
   assert.ok(pdf.length>20000,'النموذج الطباعي يجب أن ينتج PDF فعليًا ذا محتوى');
  }
  await page.close();
 }
 console.log('V132 browser acceptance PASS: 4-page selectable model, mobile + desktop + printable PDF artifact.');
}finally{await browser.close()}
