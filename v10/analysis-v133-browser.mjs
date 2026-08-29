import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const base=process.env.BASE_URL||'http://127.0.0.1:4173/home106.html?v=133';
const scenarios=[
 {name:'mobile',viewport:{width:390,height:844}},
 {name:'desktop',viewport:{width:1440,height:1000}}
];
const studentRows=['أحمد 12','خالد 15','سعد 16','محمد 18','علي 19','ناصر 20','حسن 14','ماجد 17','سلمان 13','عبدالله 18'].join('\n');

async function visible(locator){return Boolean(await locator.count())&&await locator.first().isVisible()}
async function selectUnderstanding(page){
 const analysisType=page.locator('[data-type]').filter({hasText:'تحليل نتائج'}).first();
 if(await analysisType.count()&&!(await analysisType.getAttribute('class'))?.includes('on'))await analysisType.click();
 const students=page.locator('[data-audience="الطلاب"]').first();if(await students.count()&&!(await students.getAttribute('class'))?.includes('on'))await students.click();
 const stage=page.locator('[data-stage="متوسط"]').first();if(await stage.count()&&!(await stage.getAttribute('class'))?.includes('on'))await stage.click();
 const grade=page.locator('[data-grade]').filter({hasText:'الأول'}).first();if(await grade.count()&&!(await grade.getAttribute('class'))?.includes('on'))await grade.click();
}
async function completeMeta(page){
 for(let guard=0;guard<8;guard++){
  const host=page.locator('[data-family-meta-host111]').first();if(!(await visible(host)))break;
  const field=await host.getAttribute('data-field111');
  let choice=host.locator('[data-family-meta-choice111]').first();
  if(field==='period'){const preferred=host.locator('[data-family-meta-choice111]').filter({hasText:'الفصل الدراسي الأول'}).first();if(await preferred.count())choice=preferred}
  if(field==='assessmentType'){const preferred=host.locator('[data-family-meta-choice111]').filter({hasText:/فترة|تشخيص/}).first();if(await preferred.count())choice=preferred}
  assert.ok(await choice.count(),`metadata ${field}: no choice`);await choice.click();
  const next=host.locator('[data-family-meta-next111]').first();if(await next.count())await next.click();
 }
}
async function ensureSubject(page){
 const hidden=page.locator('[data-family-field="subject94"]').first();
 if(await hidden.count()&&/العربية/.test(await hidden.inputValue()))return;
 const arabic=page.locator('[data-subject109]').filter({hasText:/العربية|عربي|لغتي/}).first();
 if(await arabic.count())await arabic.click();
 assert.ok(await page.locator('[data-family-field="subject94"]').count(),'subject field missing');
 assert.match(await page.locator('[data-family-field="subject94"]').first().inputValue(),/العربية/,'Arabic alias was not normalized');
}
async function finishAdaptive(page){
 const seen=[];
 for(let guard=0;guard<8;guard++){
  const q=page.locator('[data-adaptive-question]').first();if(!(await visible(q)))break;
  const id=await q.getAttribute('data-adaptive-question');seen.push(id);
  assert.ok(!['cause','actionStatus','action','follow'].includes(id),`pre-result question must not ask ${id}`);
  const pick=q.locator('[data-adaptive-pick]').first();assert.ok(await pick.count(),`${id}: no choice`);await pick.click();
  await q.locator('[data-adaptive-continue]').click();
 }
 return seen;
}

async function runScenario(browser,{name,viewport}){
 const context=await browser.newContext({viewport,locale:'ar-SA'});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 try{
  await page.goto(base,{waitUntil:'networkidle'});
  const discard=page.locator('[data-action="discard-draft"]').first();if(await visible(discard))await discard.click();
  await page.locator('[data-entry="analysis"]').click();
  await page.locator('#raw').fill('تحليل نتائج عربي أول متوسط الفصل الدراسي الأول اختبار الفترة الأولى شعبة ب عدد الطلاب 10');
  await page.locator('[data-action="analyze"]').click();
  await selectUnderstanding(page);
  assert.equal(await page.locator('#analysisSection111').inputValue(),'ب',`${name}: section inference missing`);
  await page.locator('#schoolName').fill('مدرسة حطين المتوسطة');
  await page.locator('#educationOffice').fill('الإدارة العامة للتعليم بنجران');
  await page.locator('#academicYear').fill('1448هـ');
  await page.locator('#principalName').fill('مدير المدرسة');
  await page.locator('#executorName').fill('معلم اللغة العربية');
  await page.locator('[data-action="go-goals"]').click();
  assert.equal(await page.locator('.adaptiveDuration106').count(),0,`${name}: Analysis must not ask duration`);
  await completeMeta(page);await ensureSubject(page);
  const data=page.locator('[data-analysis-host113]').first();await data.waitFor({state:'visible'});
  await data.locator('[data-analysis-max113]').fill('٢٠');
  await data.locator('[data-analysis-mastery120]').fill('٨٠');
  const expected=data.locator('[data-analysis-expected118]');if(await expected.count())await expected.fill('١٠');
  await data.locator('[data-analysis-rows113]').fill(studentRows);
  await page.waitForTimeout(180);
  assert.match(await data.locator('.analysisLive114').textContent(),/10|١٠/,`${name}: accepted score count not visible`);
  await data.locator('[data-analysis-next113]').click();
  const seen=await finishAdaptive(page);
  const show=page.locator('[data-action="finalize"]').filter({hasText:'عرض تحليل النتائج'}).first();await show.waitFor({state:'visible'});
  assert.ok(!seen.includes('cause')&&!seen.includes('action')&&!seen.includes('follow'),`${name}: cause/action/follow leaked before results`);
  await show.click();

  const result=page.locator('.analysisResult133').first();await result.waitFor({state:'visible'});
  const resultText=await result.textContent();
  assert.match(resultText,/اللغة العربية/,`${name}: canonical subject missing`);
  assert.match(resultText,/الشعبة ب/,`${name}: section missing`);
  assert.match(resultText,/81٪/,`${name}: expected 81% mean missing`);
  assert.match(resultText,/تعليم متمايز/,`${name}: cohort decision missing`);
  assert.match(resultText,/خطة علاجية[^\n]*4|4[^\n]*خطة علاجية/,`${name}: remedial target count missing`);
  assert.match(resultText,/خطة إثرائية[^\n]*4|4[^\n]*خطة إثرائية/,`${name}: enrichment target count missing`);
  assert.equal(await page.locator('h1').filter({hasText:'الأهداف'}).count(),0,`${name}: generic goals page leaked into final journey`);
  assert.equal(await page.locator('[data-analysis-output-host132]').count(),0,`${name}: old V132 bundle must not be stacked`);
  assert.equal(await page.locator('[data-analysis-output-host133]').count(),1,`${name}: V133 output host missing`);

  const students=result.locator('.analysisStudents133');await students.locator('summary').click();
  assert.equal(await students.locator('.analysisStudentRow133').count(),10,`${name}: student detail count mismatch`);
  assert.match(await students.textContent(),/أحمد/);assert.match(await students.textContent(),/عبدالله/);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);assert.ok(overflow<=1,`${name}: horizontal overflow ${overflow}px`);
  await fs.mkdir('artifacts',{recursive:true});await page.screenshot({path:`artifacts/v133-analysis-${name}.png`,fullPage:true});

  const defaultSheets=page.locator('.analysisPages133 .analysisSheet133');assert.equal(await defaultSheets.count(),1,`${name}: default print must be one page`);
  await page.emulateMedia({media:'print'});
  const geo=await defaultSheets.first().evaluate(sheet=>{
   const sr=sheet.getBoundingClientRect(),logo=sheet.querySelector('.analysisOfficialLogo114')?.getBoundingClientRect(),footer=sheet.querySelector('.analysisPrintFooter133')?.getBoundingClientRect();
   const pxPerMm=sr.width/210;return{width:sr.width,height:sr.height,scrollHeight:sheet.scrollHeight,clientHeight:sheet.clientHeight,logoTopMm:logo?(logo.top-sr.top)/pxPerMm:null,logoRightMm:logo?(sr.right-logo.right)/pxPerMm:null,logoLeftMm:logo?(logo.left-sr.left)/pxPerMm:null,footerBottomMm:footer?(sr.bottom-footer.bottom)/pxPerMm:null,footerTop:footer?.top,sheetBottom:sr.bottom};
  });
  assert.ok(geo.scrollHeight<=geo.clientHeight+3,`${name}: A4 analysis content clips: ${JSON.stringify(geo)}`);
  assert.ok(geo.logoTopMm!==null&&geo.logoTopMm>=14.5,`${name}: ministry logo top clear-space below 15mm: ${geo.logoTopMm}`);
  assert.ok(Math.max(geo.logoRightMm??0,geo.logoLeftMm??0)>=14.5,`${name}: ministry logo side clear-space below 15mm`);
  assert.ok((geo.footerBottomMm??0)>=4.5,`${name}: footer escaped print sheet`);
  const pdf=await page.pdf({format:'A4',printBackground:true,preferCSSPageSize:true,path:`artifacts/v133-analysis-${name}.pdf`});
  const pageCount=(pdf.toString('latin1').match(/\/Type\s*\/Page\b/g)||[]).length;assert.equal(pageCount,1,`${name}: default Chromium PDF should be one page, got ${pageCount}`);
  await page.emulateMedia({media:'screen'});

  for(const key of ['classification','remedial','enrichment']){const input=page.locator(`[data-analysis-output133="${key}"]`);assert.ok(await input.count(),`${name}: ${key} output option missing`);if(!(await input.isChecked()))await input.check()}
  await page.waitForTimeout(100);
  assert.equal(await page.locator('.analysisPages133 .analysisSheet133').count(),4,`${name}: selected derived package must be four pages`);
  const packageText=await page.locator('.analysisPages133').textContent();assert.match(packageText,/تصنيف الطلاب/);assert.match(packageText,/خطة علاجية/);assert.match(packageText,/خطة إثرائية/);
  assert.doesNotMatch(packageText,/تم التحسن|ثبت التحسن|تحقق الأثر/,`${name}: unmeasured impact claim leaked into print`);
  assert.equal(errors.length,0,`${name}: browser errors: ${errors.join(' | ')}`);
 }catch(err){await fs.mkdir('artifacts',{recursive:true});await page.screenshot({path:`artifacts/v133-analysis-${name}-failure.png`,fullPage:true}).catch(()=>{});await fs.writeFile(`artifacts/v133-analysis-${name}-failure.txt`,String(err?.stack||err));throw err}finally{await context.close()}
}

const browser=await chromium.launch({headless:true});
try{for(const scenario of scenarios)await runScenario(browser,scenario);console.log('V133 browser PASS: fast Analysis journey, policy result, one-page A4 default, optional derived pages, mobile/desktop and no overflow.')}finally{await browser.close()}
