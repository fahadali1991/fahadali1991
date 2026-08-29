import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const base='http://127.0.0.1:4173/home106.html?v=133';
const browser=await chromium.launch({headless:true});
await fs.mkdir('artifacts',{recursive:true});

async function clickIf(page,selector){const l=page.locator(selector).first();if(await l.count()&&await l.isVisible()){await l.click();return true}return false}
async function visible(locator){return Boolean(await locator.count())&&await locator.first().isVisible()}

async function ensureSubject(page){
 const block=page.locator('.subjectBlock109').first();
 if(await block.count()&&/اللغة العربية/.test(await block.textContent()))return;
 const edit=page.locator('[data-subject-edit109]').first();if(await edit.count())await edit.click();
 const arabic=page.locator('[data-subject109]').filter({hasText:/اللغة العربية|عربي|لغتي/}).first();
 if(await arabic.count())await arabic.click();
 assert.match(await page.locator('.subjectBlock109').first().textContent(),/اللغة العربية/,'Arabic alias was not normalized');
}

async function runJourney({label,viewport,exerciseReload=false}){
 const context=await browser.newContext({viewport,locale:'ar-SA'});
 const page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 try{
  await page.goto(base,{waitUntil:'networkidle'});
  const discard=page.locator('[data-action="discard-draft"]').first();if(await visible(discard))await discard.click();
  await page.locator('[data-entry="smart"]').first().click();
  await page.locator('#raw').fill('سويت تحليل نتايج عربي اول متوسط ب 20 طالب');
  await page.locator('[data-action="analyze"]').click();
  const fam=page.locator('[data-type]').filter({hasText:'تحليل نتائج'}).first();if(!(await fam.getAttribute('class'))?.includes('on'))await fam.click();
  if(!(await page.locator('[data-audience="الطلاب"].on').count()))await page.locator('[data-audience="الطلاب"]').click();
  if(!(await page.locator('[data-stage="متوسط"].on').count()))await page.locator('[data-stage="متوسط"]').click();
  const firstGrade=page.locator('[data-grade]').filter({hasText:'الأول'}).first();if(!(await firstGrade.getAttribute('class'))?.includes('on'))await firstGrade.click();

  assert.equal(await page.locator('#analysisSection111').inputValue(),'ب','section inferred from natural input was not carried forward');
  assert.match(await page.locator('.understoodCount119').textContent(),/20/,'inferred expected count missing from understanding screen');
  await page.locator('#schoolName').fill('مدرسة حطين المتوسطة');
  await page.locator('#educationOffice').fill('الإدارة العامة للتعليم بنجران');
  await page.locator('#academicYear').fill('1448هـ');
  await page.locator('#principalName').fill('مدير الاختبار');
  const executor=page.locator('#executorName');if(await executor.count())await executor.fill('معلم اللغة العربية');
  await page.waitForTimeout(300);

  if(exerciseReload){
   await page.reload({waitUntil:'networkidle'});
   const resume=page.locator('[data-action="resume-draft"]').first();
   assert.ok(await resume.count(),'saved draft resume action missing after reload');
   await resume.click();
   assert.equal(await page.locator('#schoolName').inputValue(),'مدرسة حطين المتوسطة','school data was not retained after reload');
   assert.equal(await page.locator('#principalName').inputValue(),'مدير الاختبار','principal data was not retained after reload');
   assert.equal(await page.locator('#analysisSection111').inputValue(),'ب','section was not retained after reload');
  }

  await page.locator('[data-action="go-goals"]').click();
  assert.equal(await page.locator('.adaptiveDuration106').count(),0,'analysis journey must not ask an irrelevant duration');
  await ensureSubject(page);

  const expectedMetaOrder=['period','assessmentType'];const seenMeta=[];
  for(let guard=0;guard<8;guard++){
   const host=page.locator('[data-family-meta-host111]').first();if(!(await host.count())||!(await host.isVisible()))break;
   const id=await host.getAttribute('data-field111');seenMeta.push(id);
   const choice=host.locator('[data-family-meta-choice111]').first();assert.ok(await choice.count(),`${label}/${id}: missing metadata choice`);await choice.click();
   await host.locator('[data-family-meta-next111]').click();
  }
  assert.deepEqual(seenMeta,expectedMetaOrder,`${label}: analysis metadata order mismatch: ${seenMeta.join(' > ')}`);

  const data=page.locator('[data-analysis-host113]').first();assert.ok(await data.isVisible(),`${label}: analysis data panel missing`);
  await data.locator('[data-analysis-max113]').fill('١٠');
  await data.locator('[data-analysis-mastery120]').fill('٨٠');
  const expected=data.locator('[data-analysis-expected118]');
  assert.equal(await expected.getAttribute('type'),'text',`${label}: expected-count field must accept Arabic digits`);
  assert.equal(await expected.inputValue(),'20','inferred count must prefill optional expected-count validation');
  await expected.fill('٢٠');
  assert.equal(await expected.inputValue(),'٢٠',`${label}: Arabic expected-count digits were rejected`);
  await data.locator('[data-analysis-rows113]').fill('١٠\n٩٫٥\n٨\n٧٫٥\n٦\n٥\n٤\n٣\n٢\n١\n١٠\n٩\n٨\n٧\n٦\n٥\n٤\n٣');
  await page.waitForTimeout(160);
  const consistency=await data.locator('.analysisConsistency116').textContent();assert.match(consistency,/18|20|ناقص|درجة/,'count mismatch warning missing before acceptance');
  assert.match(await data.locator('.analysisLive114').textContent(),/18/,'valid scores were dropped because expected count did not match');
  await data.locator('[data-analysis-next113]').click();

  const seenQuestions=[];
  for(let guard=0;guard<10;guard++){
   const q=page.locator('[data-adaptive-question]').first();if(!(await q.count())||!(await q.isVisible()))break;
   const gap=await q.getAttribute('data-adaptive-question');seenQuestions.push(gap);
   assert.ok(!['finding','cause','actionStatus','action','follow'].includes(gap),`${label}: ${gap} must not be asked before showing Analysis results`);
   const pick=q.locator('[data-adaptive-pick]').first();assert.ok(await pick.count(),`${label}/${gap}: adaptive choice missing`);await pick.click();
   await q.locator('[data-adaptive-continue]').click();
  }
  for(const id of ['finding','cause','actionStatus','action','follow'])assert.ok(!seenQuestions.includes(id),`${label}: ${id} leaked into pre-result questions`);

  const show=page.locator('[data-action="finalize"]').filter({hasText:'عرض تحليل النتائج'}).first();
  await show.waitFor({state:'visible'});await show.click();
  await page.waitForSelector('.analysisResult133');
  await page.waitForSelector('[data-analysis-output-host133]');
  await page.waitForSelector('[data-pdf-share115]');

  assert.equal(await page.locator('[data-analysis-output-host132]').count(),0,`${label}: old V132 output must not be stacked with V133`);
  assert.equal(await page.locator('[data-pdf-whatsapp115]').count(),0,'WhatsApp-specific share button must not exist');
  assert.equal(await page.locator('[data-pdf-share115]').count(),1,'native share button missing');
  const shareSource=await page.evaluate(()=>fetch('v10/analysis-feedback115.js?v=120.1').then(r=>r.text()));assert.match(shareSource,/navigator\.share/,'share implementation must use the native Web Share API when available');

  const resultText=await page.locator('.analysisResult133').textContent();
  assert.match(resultText,/اللغة العربية/,'canonical Arabic subject missing from V133 result');
  assert.match(resultText,/الشعبة ب/,'section missing from V133 result');
  assert.match(resultText,/18/,'actual student count must come from accepted scores');
  const output=page.locator('[data-analysis-output-host133]');
  assert.equal(await output.locator('.analysisPages133 .analysisSheet133').count(),1,`${label}: default V133 output must be one analysis page`);
  const printText=await output.locator('.analysisPages133').textContent();
  assert.match(printText,/اللغة العربية/,'canonical subject missing from V133 print page');
  assert.match(printText,/الشعبة ب/,'section missing from V133 print page');
  assert.match(printText,/18/,'actual accepted student count missing from V133 print page');
  assert.match(printText,/مدير الاختبار/,'principal name missing from V133 signature block');
  assert.match(printText,/لا يسجل التقرير تحسنًا أو أثرًا قبل وجود قياس لاحق فعلي/,'no-false-impact print guard missing');

  const logo=output.locator('.analysisOfficialLogo114').first();assert.ok(await logo.count(),'Ministry logo container missing');
  const bg=await logo.evaluate(el=>getComputedStyle(el).backgroundImage);assert.match(bg,/moe-logo-green\.png/,'official Ministry logo asset is not used as the visual logo');
  const logoFetch=await page.evaluate(()=>fetch('v10/assets/moe-logo-green.png').then(r=>({ok:r.ok,size:Number(r.headers.get('content-length')||0)})));assert.ok(logoFetch.ok,'official Ministry logo asset did not load');

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);assert.ok(overflow<=1,`${label}: horizontal overflow ${overflow}px`);
  await page.screenshot({path:`artifacts/analysis-preview-v133-${label}.png`,fullPage:true});
  await page.emulateMedia({media:'print'});
  const sheet=output.locator('.analysisPages133 .analysisSheet133').first();
  const geometry=await sheet.evaluate(el=>{const sr=el.getBoundingClientRect(),logo=el.querySelector('.analysisOfficialLogo114')?.getBoundingClientRect(),footer=el.querySelector('.analysisPrintFooter133')?.getBoundingClientRect(),pxPerMm=sr.width/210;return{scrollHeight:el.scrollHeight,clientHeight:el.clientHeight,sheetBottom:sr.bottom,footerBottom:footer?.bottom,logoTopMm:logo?(logo.top-sr.top)/pxPerMm:null,logoRightMm:logo?(sr.right-logo.right)/pxPerMm:null,logoLeftMm:logo?(logo.left-sr.left)/pxPerMm:null,footerBottomMm:footer?(sr.bottom-footer.bottom)/pxPerMm:null}});
  assert.ok(geometry.scrollHeight<=geometry.clientHeight+3,`${label}: V133 print content overflows A4: ${JSON.stringify(geometry)}`);
  assert.ok(geometry.footerBottom<=geometry.sheetBottom+1,`${label}: footer escaped A4 sheet`);
  assert.ok((geometry.footerBottomMm??0)>=4.5,`${label}: footer bottom clearance is below expected print geometry`);
  assert.ok((geometry.logoTopMm??0)>=14.5,`${label}: Ministry logo top clear-space below 15mm`);
  assert.ok(Math.min(geometry.logoRightMm??Infinity,geometry.logoLeftMm??Infinity)>=14.5,`${label}: Ministry logo nearest-side clear-space below 15mm`);
  const pdf=await page.pdf({format:'A4',printBackground:true,preferCSSPageSize:true,path:`artifacts/analysis-print-v133-${label}.pdf`});
  const pageCount=(pdf.toString('latin1').match(/\/Type\s*\/Page\b/g)||[]).length;assert.equal(pageCount,1,`${label}: Chromium generated ${pageCount} PDF pages instead of 1`);
  assert.equal(errors.length,0,`${label}: browser errors: ${errors.join(' | ')}`);
  return{label,seenMeta,seenQuestions,pageCount};
 }finally{await context.close()}
}

try{
 const mobile=await runJourney({label:'mobile',viewport:{width:390,height:844},exerciseReload:true});
 const desktop=await runJourney({label:'desktop',viewport:{width:1440,height:1000}});
 console.log('V123 protections on V133 Analysis acceptance PASS',JSON.stringify({mobile,desktop}));
}finally{await browser.close()}
