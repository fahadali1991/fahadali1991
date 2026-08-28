import {chromium} from 'playwright';
import assert from 'node:assert/strict';

const base='http://127.0.0.1:4173';
const devices=[['mobile',{width:390,height:844}],['desktop',{width:1440,height:1000}]];
const browser=await chromium.launch({headless:true});
try{
 for(const [name,viewport] of devices){
  const page=await browser.newPage({viewport});
  await page.goto(`${base}/home106.html?v=125`,{waitUntil:'domcontentloaded'});
  const result=await page.evaluate(async()=>{
   const mod=await import('./v10/analysis-plans125.js?v=125');
   const state={classification:{type:'تحليل نتائج'},stage:'متوسط',grades:['الأول المتوسط'],metadata:{schoolName:'مدرسة حطين المتوسطة',educationOffice:'الإدارة العامة للتعليم بنجران',academicYear:'1448هـ',principalName:'مدير المدرسة',executorName:'معلم اللغة العربية',analysis:{maxScore:'20',masteryPercent:'80',scores:[15,16,18,19],names:['أحمد','خالد','محمد','فهد']},familyMeta111:{assessmentType:'اختبار تشخيصي',period:'الفصل الدراسي الأول'},familyDetails:{subject94:'اللغة العربية',skillFocus:'المذكر والمؤنث'}}};
   document.body.innerHTML=`<main id="v125-host">${mod.analysisPlansPanel125(state)}</main>`;
   mod.bindAnalysisPlans125(state);
   return {cards:document.querySelectorAll('[data-analysis-plan125]').length,text:document.body.innerText};
  });
  assert.equal(result.cards,2,`${name}: يجب أن يظهر اقتراح علاجي وإثرائي`);
  assert.match(result.text,/طالب واحد/,`${name}: العدد العلاجي مشتق من الدرجات`);
  assert.match(result.text,/طالبان/,`${name}: العدد الإثرائي مشتق من الدرجات`);
  await page.click('[data-analysis-plan125="remedial"]');
  let text=await page.locator('[data-analysis-plan-sheet125="remedial"]').innerText();
  assert.match(text,/أحمد/,`${name}: اسم الطالب العلاجي ينتقل من الإدخال`);
  assert.doesNotMatch(text,/محمد|فهد/,`${name}: لا تخلط الخطة العلاجية مع المتقدمين`);
  assert.match(text,/المذكر والمؤنث/,`${name}: المهارة المدخلة تنتقل للخطة`);
  assert.match(text,/مقترحة ولم تُنفذ بعد/,`${name}: لا ادعاء تنفيذ أو أثر`);
  await page.click('[data-analysis-plan-close125]');
  await page.click('[data-analysis-plan125="enrichment"]');
  text=await page.locator('[data-analysis-plan-sheet125="enrichment"]').innerText();
  assert.match(text,/محمد/,`${name}: أول طالب متقدم يظهر في الإثراء`);
  assert.match(text,/فهد/,`${name}: ثاني طالب متقدم يظهر في الإثراء`);
  assert.doesNotMatch(text,/أحمد/,`${name}: لا تخلط الخطة الإثرائية مع من دون الإتقان`);
  const box=await page.locator('.analysisPlanSheet125').boundingBox();
  assert.ok(box&&box.width<=viewport.width+1,`${name}: الخطة لا تتجاوز عرض الشاشة`);
  await page.screenshot({path:`artifacts/v125-analysis-plans-${name}.png`,fullPage:true});
  await page.close();
 }
 console.log('V125 analysis plans browser acceptance PASS: mobile + desktop');
} finally {await browser.close()}
