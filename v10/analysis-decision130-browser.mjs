import {chromium} from 'playwright';
import assert from 'node:assert/strict';

const base='http://127.0.0.1:4173';
const devices=[['mobile',{width:390,height:844}],['desktop',{width:1440,height:1000}]];
const browser=await chromium.launch({headless:true});
try{
 for(const [name,viewport] of devices){
  const page=await browser.newPage({viewport});
  await page.goto(`${base}/home106.html?v=130`,{waitUntil:'domcontentloaded'});
  const result=await page.evaluate(async()=>{
   const mod=await import('./v10/analysis-decision130.js?v=130');
   const state={classification:{type:'تحليل نتائج'},stage:'متوسط',grades:['الأول المتوسط'],metadata:{analysis:{maxScore:'20',masteryPercent:'80',scores:[12,16,18,19],names:['أحمد','سعد','محمد','فهد']},familyMeta111:{assessmentType:'اختبار تشخيصي'},familyDetails:{subject94:'اللغة العربية'}}};
   document.body.innerHTML=`<main id="v130-host">${mod.analysisDecisionPanel130(state)}</main>`;
   return {cards:document.querySelectorAll('.decisionCard130').length,rows:[...document.querySelectorAll('.decisionRow130')].map(x=>x.innerText),text:document.body.innerText};
  });
  assert.equal(result.cards,3,`${name}: ثلاث فئات قرار مختصرة`);
  assert.equal(result.rows.length,4,`${name}: كل طالب يظهر مرة واحدة`);
  assert.match(result.text,/القراءة التشخيصية/);
  assert.match(result.text,/خط أساس/);
  assert.match(result.text,/تعليم متمايز|استمرار التدريس مع دعم مستهدف|إعادة تدريس أوسع/);
  assert.doesNotMatch(result.text,/راسب|ممتاز|جيد جدًا|مقبول/,`${name}: لا يظهر تقدير المادة في تشخيص منفرد`);
  assert.match(result.rows[0],/أحمد/);assert.match(result.rows[0],/60٪/);assert.match(result.rows[0],/يحتاج دعمًا/);
  assert.match(result.rows[1],/سعد/);assert.match(result.rows[1],/80٪/);assert.match(result.rows[1],/محقق للمحك/);
  assert.match(result.rows[2],/محمد/);assert.match(result.rows[2],/90٪/);assert.match(result.rows[2],/مرشح للإثراء/);
  await page.locator('.decisionDetails130 summary').click();
  const details=await page.locator('.decisionDetails130').innerText();
  assert.match(details,/متوسط الشعبة/);
  assert.match(details,/لا يطبّق على هذا الاختبار المنفرد/);
  assert.match(details,/أعلى من متوسط الشعبة|أقل من متوسط الشعبة/);
  const box=await page.locator('.analysisDecision130').boundingBox();
  assert.ok(box&&box.width<=viewport.width+1,`${name}: النموذج لا يتجاوز عرض الشاشة`);
  const horizontal=await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1);
  assert.equal(horizontal,true,`${name}: لا يوجد تمرير أفقي`);
  await page.screenshot({path:`artifacts/v130-analysis-policy-${name}.png`,fullPage:true});
  await page.close();
 }
 console.log('V130 analysis policy browser acceptance PASS: diagnostic-safe decisions + cohort recommendation on mobile + desktop');
} finally {await browser.close()}
