import {chromium} from 'playwright';
import assert from 'node:assert/strict';

const browser=await chromium.launch({headless:true});
const cases=[['mobile',{width:390,height:844}],['desktop',{width:1440,height:1000}]];
try{
 for(const [label,viewport] of cases){
  const page=await browser.newPage({viewport});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/v10/analysis-criterion131-fixture.html',{waitUntil:'domcontentloaded'});
  const diagnostics=await page.evaluate(async()=>{
   try{
    const mod=await import('/v10/analysis-data131.js?v=131');
    window.__s131={classification:{type:'تحليل نتائج'},stage:'متوسط',grades:['الأول المتوسط'],metadata:{analysis:{maxScore:'',masteryPercent:'70',scores:[],names:[],rawRows:'',entryMode:'paste'},familyMeta111:{assessmentType:'اختبار تشخيصي'},familyDetails:{subject94:'اللغة العربية'}}};
    mod.bindAnalysisData131(window.__s131);mod.renderAnalysisSlot131();
    await new Promise(r=>setTimeout(r,20));
    return{ok:true,slot:document.querySelector('[data-analysis-slot113]')?.innerHTML||'',body:document.body.innerText};
   }catch(e){return{ok:false,error:String(e?.stack||e)}}
  });
  assert.equal(diagnostics.ok,true,`${label}: fixture import/render failed ${diagnostics.error||''}`);
  assert.ok(diagnostics.slot,`${label}: analysis slot remained empty; body=${diagnostics.body}`);
  await page.waitForSelector('[data-analysis-host113]',{state:'visible',timeout:5000});
  const criterion=page.locator('[data-analysis-mastery120]');
  assert.equal(await criterion.inputValue(),'',`${label}: fresh legacy 70 seed must be cleared`);
  const criterionLabel=await criterion.locator('xpath=..').innerText();
  assert.match(criterionLabel,/محك الأداء لهذا الاختبار/);
  assert.match(criterionLabel,/اختياري/);
  await page.locator('[data-analysis-max113]').fill('٢٠');
  await page.locator('[data-analysis-rows113]').fill('أحمد ١٢\nسعد ١٦\nمحمد ١٨\nفهد ١٩');
  await page.waitForTimeout(150);
  assert.equal(await criterion.inputValue(),'',`${label}: score entry must not resurrect 70`);
  const noCriterionState=await page.evaluate(()=>({mastery:window.__s131.metadata.analysis.masteryPercent,source:window.__s131.metadata.analysis.criterionSource131,finding:window.__s131.metadata.familyDetails.finding}));
  assert.equal(noCriterionState.mastery,'');
  assert.equal(noCriterionState.source,'none');
  assert.match(noCriterionState.finding,/لم يحدد محك أداء/);

  const neutral=await page.evaluate(async()=>{const d=await import('/v10/analysis-decision131.js?v=131');const p=await import('/v10/analysis-plans131.js?v=131');return{decision:d.analysisDecisionPanel131(window.__s131),plans:p.analysisPlansPanel131(window.__s131)}});
  assert.match(neutral.decision,/المؤشرات الكمية/);
  assert.doesNotMatch(neutral.decision,/محقق للإتقان/);
  assert.match(neutral.plans,/لا توجد خطة آلية دون محك أداء/);

  await criterion.fill('٨٠');
  await page.waitForTimeout(120);
  const explicit=await page.evaluate(async()=>{const d=await import('/v10/analysis-decision131.js?v=131');return{mastery:window.__s131.metadata.analysis.masteryPercent,source:window.__s131.metadata.analysis.criterionSource131,html:d.analysisDecisionPanel131(window.__s131)}});
  assert.equal(Number(explicit.mastery),80,`${label}: explicit criterion must persist`);
  assert.equal(explicit.source,'user');
  assert.match(explicit.html,/يحتاج دعمًا/);
  assert.match(explicit.html,/تعليم متمايز/);
  assert.equal(errors.length,0,`${label}: browser errors ${errors.join(' | ')}`);
  const horizontal=await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1);assert.equal(horizontal,true,`${label}: horizontal overflow`);
  await page.screenshot({path:`artifacts/v131-explicit-criterion-${label}.png`,fullPage:true});
  await page.close();
 }
 console.log('V131 browser acceptance PASS: optional criterion stays blank until teacher defines it on mobile + desktop.');
}finally{await browser.close()}
