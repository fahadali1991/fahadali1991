import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const base=process.env.BASE_URL||'http://127.0.0.1:4173/home106.html?v=149';
const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:1440,height:1100},locale:'ar-SA'});
  const page=await context.newPage();
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.evaluate(async()=>{
    document.body.innerHTML='<section class="analysisData113"><label><span>target</span><input data-analysis-mastery120 value=""></label></section>';
    const state={
      classification:{type:'تحليل نتائج'},stage:'متوسط',grades:['الأول'],
      metadata:{
        directEntry134:'analysis',
        schoolName:'مدرسة حطين المتوسطة',
        educationOffice:'الإدارة العامة للتعليم بنجران',
        academicYear:'1448هـ',
        principalName:'مدير المدرسة',
        executorName:'معلم اللغة العربية',
        analysis:{maxScore:'20',masteryPercent:'',criterionSource131:'none',scores:[6,9,11,12,13,14,14,15,16,17,18,20],names:['أحمد محمد','خالد علي','سلمان حسن','محمد عبدالله','عبدالعزيز سعد','يوسف أحمد','عمر خالد','زياد محمد','ناصر علي','فهد عبدالله','راكان سعد','ماجد حسن']},
        familyDetails:{subject94:'اللغة العربية'},
        familyMeta111:{section:'أ',assessmentType:'اختبار تشخيصي',period:'الفصل الدراسي الأول'}
      }
    };
    const target=await import('/v10/analysis-target-level134.js?v=149-browser');
    target.bindAnalysisTargetLevel134(state);
    window.__v149State=state;
  });
  await page.waitForSelector('[data-target-mode134="percent"]');
  await page.click('[data-target-mode134="percent"]');
  await page.locator('[data-target-percent134]').fill('70');
  await page.evaluate(async()=>{
    const render=await import('/v10/analysis-render147.js?v=149-browser');
    document.body.innerHTML=render.analysisFinalPanel147(window.__v149State)+render.analysisOutputPanel147(window.__v149State);
  });
  await page.waitForSelector('.mainAnalysis134.analysisV149[data-v149-ready="1"]');
  assert.equal(await page.locator('.mainAnalysis134 .analysisHeader134 .analysisDocMeta149').count(),1,'header must have document-meta zone');
  assert.equal(await page.locator('.mainAnalysis134 .analysisMainGrid134>.analysisBlock134').count(),3,'analysis grid must have distribution + ratio + decision');
  assert.equal(await page.locator('.mainAnalysis134 .analysisRatio149').count(),1,'ratio panel missing');
  assert.equal(await page.locator('.mainAnalysis134 .analysisDecision149').count(),1,'decision panel missing');
  assert.equal(await page.locator('.mainAnalysis134 .analysisBar134.support').getAttribute('data-symbol149'),'●');
  assert.equal(await page.locator('.mainAnalysis134 .analysisBar134.mastered').getAttribute('data-symbol149'),'■');
  assert.equal(await page.locator('.mainAnalysis134 .analysisBar134.advanced').getAttribute('data-symbol149'),'◆');
  assert.equal(await page.locator('.mainAnalysis134').evaluate(el=>getComputedStyle(el).direction),'rtl');
  await fs.mkdir('artifacts',{recursive:true});
  await page.screenshot({path:'artifacts/v149-analysis-desktop.png',fullPage:true});

  await page.setViewportSize({width:390,height:844});
  await page.evaluate(async()=>{
    const render=await import('/v10/analysis-render147.js?v=149-mobile');
    document.body.innerHTML=render.analysisFinalPanel147(window.__v149State);
  });
  await page.waitForSelector('.analysisResult134');
  const mobileOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(mobileOverflow<=4,'mobile Analysis must not create horizontal page overflow');
  assert.equal(await page.locator('.analysisScreenGrid134').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),1,'mobile analysis grid must collapse to one column');
  await page.screenshot({path:'artifacts/v149-analysis-mobile.png',fullPage:true});

  await page.setViewportSize({width:1440,height:1100});
  await page.evaluate(async()=>{
    const render=await import('/v10/analysis-render147.js?v=149-print');
    document.body.innerHTML=render.analysisOutputPanel147(window.__v149State);
  });
  await page.waitForSelector('.mainAnalysis134.analysisV149[data-v149-ready="1"]');
  await page.emulateMedia({media:'print'});
  const printStyle=await page.locator('.mainAnalysis134 .analysisBar134.support em').evaluate(el=>({filter:getComputedStyle(el).filter,background:getComputedStyle(el).backgroundColor}));
  assert.equal(printStyle.filter,'none','print must not force the support bar to grayscale');
  assert.ok(!/rgb\(62, 62, 62\)/.test(printStyle.background),'print must retain semantic colour');
  await page.pdf({path:'artifacts/v149-analysis-a4.pdf',format:'A4',printBackground:true,preferCSSPageSize:true});
  console.log('V149 browser PASS: desktop, 390px mobile, three-panel RTL A4 and colour-preserving print all verified.');
  await context.close();
}finally{
  await browser.close();
}