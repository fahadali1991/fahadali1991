import {chromium} from 'playwright';
import assert from 'node:assert/strict';

const base='http://127.0.0.1:4173';
const devices=[['mobile',{width:390,height:844}],['desktop',{width:1440,height:1000}]];
const browser=await chromium.launch({headless:true});
try{
 for(const [name,viewport] of devices){
  const page=await browser.newPage({viewport});
  await page.goto(`${base}/home106.html?v=127`,{waitUntil:'domcontentloaded'});
  const result=await page.evaluate(async()=>{
   const mod=await import('./v10/analysis-decision127.js?v=127');
   const state={classification:{type:'تحليل نتائج'},stage:'متوسط',grades:['الأول المتوسط'],metadata:{analysis:{maxScore:'20',masteryPercent:'80',scores:[12,16,18,19],names:['أحمد','سعد','محمد','فهد']},familyDetails:{subject94:'اللغة العربية'}}};
   document.body.innerHTML=`<main id="v127-host">${mod.analysisDecisionPanel127(state)}</main>`;
   return {cards:document.querySelectorAll('.analysisDecisionCard127').length,rows:[...document.querySelectorAll('.analysisDecisionRow127')].map(x=>x.innerText),text:document.body.innerText};
  });
  assert.equal(result.cards,3,`${name}: يجب أن تظهر ثلاث فئات قرار فقط`);
  assert.equal(result.rows.length,4,`${name}: كل طالب يظهر مرة واحدة`);
  for(const label of ['يحتاج دعمًا','محقق للإتقان','متقدم للإثراء'])assert.match(result.text,new RegExp(label),`${name}: يظهر ${label}`);
  assert.match(result.rows[0],/أحمد/);assert.match(result.rows[0],/60٪/);assert.match(result.rows[0],/يحتاج دعمًا/);
  assert.match(result.rows[1],/سعد/);assert.match(result.rows[1],/80٪/);assert.match(result.rows[1],/محقق للإتقان/);
  assert.match(result.rows[2],/محمد/);assert.match(result.rows[2],/90٪/);assert.match(result.rows[2],/متقدم للإثراء/);
  assert.match(result.text,/تفاصيل التصنيف/);
  await page.locator('.analysisDecisionDetails127 summary').click();
  const details=await page.locator('.analysisDecisionDetails127').innerText();
  assert.match(details,/متوسط الشعبة/);
  assert.match(details,/ممتاز|جيد جدًا|جيد|مقبول/);
  assert.match(details,/أعلى من متوسط الشعبة|أقل من متوسط الشعبة/);
  const box=await page.locator('.analysisDecision127').boundingBox();
  assert.ok(box&&box.width<=viewport.width+1,`${name}: النموذج لا يتجاوز عرض الشاشة`);
  const horizontal=await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1);
  assert.equal(horizontal,true,`${name}: لا يوجد تمرير أفقي`);
  await page.screenshot({path:`artifacts/v127-analysis-decision-${name}.png`,fullPage:true});
  await page.close();
 }
 console.log('V127 analysis decision browser acceptance PASS: three primary groups + optional details on mobile + desktop');
} finally {await browser.close()}
