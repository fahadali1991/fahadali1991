import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const base='http://127.0.0.1:4173/home106.html?v=123';
const browser=await chromium.launch({headless:true});
await fs.mkdir('artifacts',{recursive:true});

async function clickIf(page,selector){const l=page.locator(selector).first();if(await l.count()&&await l.isVisible()){await l.click();return true}return false}

async function runJourney({label,viewport,exerciseReload=false}){
 const context=await browser.newContext({viewport,locale:'ar-SA'});
 const page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 try{
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('[data-entry="smart"]').first().click();
  await page.locator('#raw').fill('سويت تحليل نتايج عربي اول متوسط ب 20 طالب الفصل الأول اختبار فترة');
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
  await page.waitForTimeout(250);

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
  assert.match(await page.locator('.subjectKnown109, .subjectBlock109').first().textContent(),/اللغة العربية|عربي|لغتي/,'Arabic subject inference missing');
  await clickIf(page,'[data-subject109]');

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
  assert.equal(await data.locator('[data-analysis-expected118]').inputValue(),'20','inferred count must prefill optional expected-count validation');
  await data.locator('[data-analysis-rows113]').fill('١٠\n٩٫٥\n٨\n٧٫٥\n٦\n٥\n٤\n٣\n٢\n١\n١٠\n٩\n٨\n٧\n٦\n٥\n٤\n٣');
  await page.waitForTimeout(120);
  const consistency=await data.locator('.analysisConsistency116').textContent();assert.match(consistency,/18|20|ناقص|درجة/,'count mismatch warning missing');
  assert.match(await data.locator('.analysisLive114').textContent(),/18/,'valid scores were dropped because expected count did not match');
  await data.locator('[data-analysis-next113]').click();

  const seenQuestions=[];
  for(let guard=0;guard<12;guard++){
   const q=page.locator('[data-adaptive-question]').first();if(!(await q.count())||!(await q.isVisible()))break;
   const gap=await q.getAttribute('data-adaptive-question');seenQuestions.push(gap);
   assert.notEqual(gap,'finding','derived finding must never be asked as a question');
   const picks=q.locator('[data-adaptive-pick]');assert.ok(await picks.count(),`${label}/${gap}: adaptive choice missing`);
   if(gap==='actionStatus'){
    const planned=picks.filter({hasText:'مخطط للتنفيذ'}).first();if(await planned.count())await planned.click();else await picks.first().click();
   }else await picks.first().click();
   await q.locator('[data-adaptive-continue]').click();
  }
  assert.ok(seenQuestions.includes('actionStatus'),`${label}: action execution status was not separated from the action`);
  assert.ok(!seenQuestions.includes('finding'),`${label}: derived finding leaked into adaptive questions`);

  await page.locator('[data-action="family-details-next"]').click();
  await page.locator('[data-goal]').first().click();
  await page.locator('[data-action="go-description"]').click();
  await page.locator('[data-title-accept]').first().click();
  assert.equal(await page.locator('[data-description-variant="medium"]').count(),0,'analysis must use the V122 automatic professional reading instead of asking for a description variant');
  for(let guard=0;guard<12;guard++){const fix=page.locator('[data-spell76-from]').first();if(!(await fix.count()))break;await fix.click()}
  if(await page.locator('[data-action="go-evidence-direct"]').count())await page.locator('[data-action="go-evidence-direct"]').click();
  await clickIf(page,'[data-evidence]');
  await page.locator('[data-action="finalize"]').first().click();
  await page.waitForSelector('[data-pdf-preview-host107]');
  await page.waitForSelector('[data-pdf-share115]');

  assert.equal(await page.locator('[data-pdf-whatsapp115]').count(),0,'WhatsApp-specific share button must not exist');
  assert.equal(await page.locator('[data-pdf-share115]').count(),1,'native share button missing');
  const shareSource=await page.evaluate(()=>fetch('v10/analysis-feedback115.js?v=120.1').then(r=>r.text()));assert.match(shareSource,/navigator\.share/,'share implementation must use the native Web Share API when available');
  assert.match(await page.locator('.analysisHero113 h2').textContent(),/اللغة العربية/,'canonical Arabic subject missing from print preview');
  assert.match(await page.locator('.analysisMeta113').textContent(),/شعبة ب/,'section missing from print preview');
  assert.match(await page.locator('.analysisMeta113').textContent(),/18/,'actual student count must come from accepted scores');
  assert.match(await page.locator('.analysisPrintWarn116').textContent(),/20|18|ناقص|درجة/,'optional count mismatch warning missing from print preview');
  assert.match(await page.locator('.analysisApproval113').textContent(),/مدير الاختبار/,'principal name missing from approval block');

  const logo=page.locator('.analysisOfficialLogo114').first();assert.ok(await logo.count(),'Ministry logo container missing');
  const bg=await logo.evaluate(el=>getComputedStyle(el).backgroundImage);assert.match(bg,/moe-logo-green\.png/,'official Ministry logo asset is not used as the visual logo');
  const logoFetch=await page.evaluate(()=>fetch('v10/assets/moe-logo-green.png').then(r=>({ok:r.ok,size:Number(r.headers.get('content-length')||0)})));assert.ok(logoFetch.ok,'official Ministry logo asset did not load');

  await page.screenshot({path:`artifacts/analysis-preview-v123-${label}.png`,fullPage:true});
  await page.emulateMedia({media:'print'});
  const sheets=page.locator('.pdfPages107 .analysisSheet113');assert.equal(await sheets.count(),1,`${label}: analysis print must contain one sheet`);
  const geometry=await sheets.first().evaluate(sheet=>{const sr=sheet.getBoundingClientRect(),footer=sheet.querySelector('.analysisFooter113')?.getBoundingClientRect(),approval=sheet.querySelector('.analysisApproval113')?.getBoundingClientRect();return{sheetTop:sr.top,sheetBottom:sr.bottom,scrollHeight:sheet.scrollHeight,clientHeight:sheet.clientHeight,footerTop:footer?.top,footerBottom:footer?.bottom,approvalBottom:approval?.bottom}});
  assert.ok(geometry.scrollHeight<=geometry.clientHeight+3,`${label}: print content overflows A4: ${JSON.stringify(geometry)}`);
  assert.ok(geometry.footerBottom<=geometry.sheetBottom+1&&geometry.footerTop>=geometry.sheetTop,`${label}: footer escaped A4 sheet`);
  assert.ok(geometry.approvalBottom<=geometry.footerTop+1,`${label}: approval overlaps footer`);
  const pdf=await page.pdf({format:'A4',printBackground:true,preferCSSPageSize:true,path:`artifacts/analysis-print-v123-${label}.pdf`});
  const pageCount=(pdf.toString('latin1').match(/\/Type\s*\/Page\b/g)||[]).length;assert.equal(pageCount,1,`${label}: Chromium generated ${pageCount} PDF pages instead of 1`);
  assert.equal(errors.length,0,`${label}: browser errors: ${errors.join(' | ')}`);
  return{label,seenMeta,seenQuestions,pageCount};
 }finally{await context.close()}
}

try{
 const mobile=await runJourney({label:'mobile',viewport:{width:390,height:844},exerciseReload:true});
 const desktop=await runJourney({label:'desktop',viewport:{width:1440,height:1000}});
 console.log('V123 analysis visual acceptance PASS',JSON.stringify({mobile,desktop}));
}finally{await browser.close()}
