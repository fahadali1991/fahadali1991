import {chromium} from 'playwright';
import assert from 'node:assert/strict';

const base=process.env.BASE_URL||'http://127.0.0.1:4173/';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({locale:'ar-SA'});
try{
 await page.goto(base,{waitUntil:'domcontentloaded'});
 await page.evaluate(async()=>{
  document.body.innerHTML='<section class="analysisData113"><label><span>legacy target</span><input data-analysis-mastery120 value=""></label></section>';
  const state={
   classification:{type:'تحليل نتائج'},stage:'متوسط',grades:['الثاني'],
   metadata:{
    directEntry134:'analysis',
    analysis:{maxScore:'20',masteryPercent:'',criterionSource131:'none',scores:[6,9,11,12,13,14,14,15,16,17,18,20],names:['أحمد محمد','خالد علي','سلمان حسن','محمد عبدالله','عبدالعزيز سعد','يوسف أحمد','عمر خالد','زياد محمد','ناصر علي','فهد عبدالله','راكان سعد','ماجد حسن']},
    familyDetails:{subject94:'اللغة العربية'},familyMeta111:{section:'أ',assessmentType:'اختبار واحد'}
   }
  };
  window.__v148State=state;
  const target=await import('/v10/analysis-target-level134.js?v=148-regression');
  target.bindAnalysisTargetLevel134(state);
 });
 await page.waitForSelector('[data-target-mode134="percent"]');
 await page.click('[data-target-mode134="percent"]');
 const input=page.locator('[data-target-percent134]');
 await input.pressSequentially('٧٠٪',{delay:30});
 assert.equal(await input.inputValue(),'٧٠٪','human typing must stay in the same target field');
 assert.match(await page.locator('[data-analysis-target134]').textContent(),/70٪|٧٠٪/,'70% must be visibly accepted');
 const stateResult=await page.evaluate(async()=>{
  const out=await import('/v10/analysis-output134.js?v=148-regression');
  const model=out.analysisOutputModel134(window.__v148State);
  document.body.insertAdjacentHTML('beforeend',out.analysisOutputPanel134(window.__v148State));
  return {criterion:model.criterion?.value,remedial:model.available?.remedial?.targetCount||0,enrichment:model.available?.enrichment?.targetCount||0};
 });
 assert.equal(stateResult.criterion,70,'explicit target must remain 70%');
 assert.equal(stateResult.remedial,5,'sample data must produce 5 remedial students');
 assert.equal(stateResult.enrichment,2,'sample data must produce 2 enrichment candidates');
 assert.equal(await page.locator('[data-analysis-output134="remedial"]').isDisabled(),false,'remedial option must be enabled');
 assert.equal(await page.locator('[data-analysis-output134="enrichment"]').isDisabled(),false,'enrichment option must be enabled');
 console.log('V148 target regression PASS: human-typed 70% stays focused and enables remedial 5 / enrichment 2.');
}finally{
 await browser.close();
}
