import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const base=process.env.BASE_URL||'http://127.0.0.1:4173/home106.html?v=133';
const rows=['أحمد 12','خالد 15','سعد 16','محمد 18','علي 19','ناصر 20','حسن 14','ماجد 17','سلمان 13','عبدالله 18'].join('\n');
const legacy=/(?:^|[\s>])المحك(?:[\s<]|$)|خط الأساس/;
async function visible(l){return Boolean(await l.count())&&await l.first().isVisible()}
async function clickIfOff(l){if(await l.count()&&!(await l.getAttribute('class'))?.includes('on'))await l.click()}
async function chooseUnderstanding(page){
 const analysisType=page.locator('[data-type]').filter({hasText:'تحليل نتائج'}).first();if(await analysisType.count())await clickIfOff(analysisType);
 await clickIfOff(page.locator('[data-audience="الطلاب"]').first());
 await clickIfOff(page.locator('[data-stage="متوسط"]').first());
 await clickIfOff(page.locator('[data-grade]').filter({hasText:'الأول'}).first());
}
async function fillProfile(page){
 for(const [id,value] of [['schoolName','مدرسة حطين المتوسطة'],['educationOffice','الإدارة العامة للتعليم بنجران'],['academicYear','1448هـ'],['principalName','مدير المدرسة'],['executorName','معلم اللغة العربية']]){const x=page.locator(`#${id}`).first();if(await visible(x))await x.fill(value)}
}
async function completeMeta(page){
 for(let guard=0;guard<8;guard++){
  const host=page.locator('[data-family-meta-host111]').first();if(!(await visible(host)))break;
  const field=await host.getAttribute('data-field111');let choice=host.locator('[data-family-meta-choice111]').first();
  if(field==='period'){const p=host.locator('[data-family-meta-choice111]').filter({hasText:'الفصل الدراسي الأول'}).first();if(await p.count())choice=p}
  if(field==='assessmentType'){const p=host.locator('[data-family-meta-choice111]').filter({hasText:/تشخيص/}).first();if(await p.count())choice=p}
  assert.ok(await choice.count(),`metadata ${field}: no choice`);await choice.click();const next=host.locator('[data-family-meta-next111]').first();if(await next.count())await next.click();
 }
}
async function ensureSubject(page){
 const block=page.locator('.subjectBlock109').first();if(await block.count()&&/اللغة العربية/.test(await block.textContent()))return;
 const hidden=page.locator('[data-family-field="subject94"]').first();if(await hidden.count()&&/العربية/.test(await hidden.inputValue()))return;
 const edit=page.locator('[data-subject-edit109]').first();if(await edit.count())await edit.click();const arabic=page.locator('[data-subject109]').filter({hasText:/العربية|عربي|لغتي/}).first();assert.ok(await arabic.count(),'Arabic subject option missing');await arabic.click();
}
async function chooseScope(page,id='single_assessment'){const host=page.locator('[data-analysis-context134]').first();if(await visible(host)){const b=host.locator(`[data-analysis-scope134="${id}"]`).first();assert.ok(await b.count(),`scope ${id} missing`);await b.click();await page.waitForTimeout(50)}}
async function fillScores(page,{targetMode='percent'}={}){
 const data=page.locator('[data-analysis-host113]').first();await data.waitFor({state:'visible'});await data.locator('[data-analysis-max113]').fill('٢٠');
 if(targetMode==='score'){
  const mode=page.locator('[data-target-mode134="score"]').first();await mode.click();const score=page.locator('[data-target-score134]').first();await score.fill('١٦');await page.waitForTimeout(80);assert.match(await page.locator('[data-analysis-target134]').textContent(),/16 من 20|١٦ من ٢٠|80٪|٨٠٪/);
 }else if(targetMode==='none'){await page.locator('[data-target-mode134="none"]').first().click()}else{await page.locator('[data-target-mode134="percent"]').first().click();await page.locator('[data-target-percent134]').first().fill('٨٠')}
 const expected=data.locator('[data-analysis-expected118]');if(await expected.count()){assert.equal(await expected.getAttribute('type'),'text');await expected.fill('١٠')}
 await data.locator('[data-analysis-rows113]').fill(rows);await page.waitForTimeout(180);assert.match(await data.locator('.analysisLive114').textContent(),/10|١٠/);await data.locator('[data-analysis-next113]').click();
}
async function finishAdaptive(page){for(let guard=0;guard<8;guard++){const q=page.locator('[data-adaptive-question]').first();if(!(await visible(q)))break;const id=await q.getAttribute('data-adaptive-question');assert.ok(!['cause','actionStatus','action','follow'].includes(id),`pre-result question leaked: ${id}`);const pick=q.locator('[data-adaptive-pick]').first();assert.ok(await pick.count(),`${id}: no pick`);await pick.click();await q.locator('[data-adaptive-continue]').click()}}
async function start(page,entry,raw,targetMode='percent'){
 await page.goto(base,{waitUntil:'networkidle'});const discard=page.locator('[data-action="discard-draft"]').first();if(await visible(discard))await discard.click();
 await page.locator(`[data-entry="${entry}"]`).click();await page.locator('#raw').fill(raw);await page.locator('[data-action="analyze"]').click();await chooseUnderstanding(page);
 const section=page.locator('#analysisSection111');if(await section.count())assert.equal(await section.inputValue(),'ب');await fillProfile(page);await page.locator('[data-action="go-goals"]').click();await completeMeta(page);await ensureSubject(page);await chooseScope(page);await fillScores(page,{targetMode});await finishAdaptive(page);
 const labels={analysis:/عرض تحليل النتائج/,classification:/عرض تصنيف الطلاب/,remedial:/إعداد الخطة العلاجية/,enrichment:/إعداد الخطة الإثرائية/};const show=page.locator('[data-action="finalize"]').filter({hasText:labels[entry]}).first();await show.waitFor({state:'visible'});await show.click();await page.locator('.analysisResult134').first().waitFor({state:'visible'});
}
async function screenGuards(page,label){const text=await page.locator('body').textContent();assert.doesNotMatch(text,legacy,`${label}: legacy terminology visible`);const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);assert.ok(overflow<=1,`${label}: horizontal overflow ${overflow}px`);assert.equal(await page.locator('h1').filter({hasText:'الأهداف'}).count(),0,`${label}: generic goals page leaked`)}
async function fullAnalysis(browser,name,viewport,targetMode='percent'){
 const context=await browser.newContext({viewport,locale:'ar-SA'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 try{
  await start(page,'analysis','تحليل نتايج عربي أول متوسط الفصل الدراسي الأول اختبار تشخيصي شعبة ب عدد الطلاب 10',targetMode);await screenGuards(page,`${name} analysis`);
  const result=await page.locator('.analysisResult134').textContent();assert.match(result,/81٪/);assert.match(result,/توزيع مستويات الأداء/);assert.match(result,/قراءة سريعة/);assert.match(result,/أولوية التحسين/);assert.match(result,/4/);
  const out=page.locator('[data-analysis-output-host134]');assert.equal(await out.count(),1);assert.equal(await page.locator('.analysisPages134 .analysisSheet134').count(),1,`${name}: default must be one page`);
  await fs.mkdir('artifacts',{recursive:true});await page.screenshot({path:`artifacts/v134-analysis-${name}.png`,fullPage:true});
  for(const key of ['classification','remedial','enrichment']){const input=page.locator(`[data-analysis-output134="${key}"]`);assert.ok(await input.count(),`${name}: ${key} option missing`);if(!(await input.isChecked()))await input.check()}
  await page.waitForTimeout(100);const sheets=page.locator('.analysisPages134 .analysisSheet134');assert.equal(await sheets.count(),4,`${name}: full bundle must be four sheets`);const classes=await sheets.evaluateAll(xs=>xs.map(x=>x.className));assert.match(classes[0],/mainAnalysis134/);assert.match(classes[1],/classificationSheet134/);assert.match(classes[2],/remedial/);assert.match(classes[3],/enrichment/);const pack=await page.locator('.analysisPages134').textContent();assert.doesNotMatch(pack,legacy);assert.match(pack,/لا (?:يسجل|يثبت)[^\n]{0,100}(?:تحسن|أثر)/);
  if(name==='desktop'){
   await page.emulateMedia({media:'print'});const geos=await sheets.evaluateAll(nodes=>nodes.map(sheet=>{const r=sheet.getBoundingClientRect(),logo=sheet.querySelector('.analysisOfficialLogo114')?.getBoundingClientRect(),px=r.width/210;return{scrollHeight:sheet.scrollHeight,clientHeight:sheet.clientHeight,logoTop:logo?(logo.top-r.top)/px:null,logoLeft:logo?(logo.left-r.left)/px:null,logoRight:logo?(r.right-logo.right)/px:null}}));for(const [i,g] of geos.entries()){assert.ok(g.scrollHeight<=g.clientHeight+3,`sheet ${i+1} clips ${JSON.stringify(g)}`);assert.ok((g.logoTop??0)>=14.5,`sheet ${i+1} logo top clearance`);assert.ok(Math.min(g.logoLeft??Infinity,g.logoRight??Infinity)>=14.5,`sheet ${i+1} logo side clearance`)}const pdf=await page.pdf({format:'A4',printBackground:true,preferCSSPageSize:true,path:'artifacts/v134-analysis-full-desktop.pdf'});const count=(pdf.toString('latin1').match(/\/Type\s*\/Page\b/g)||[]).length;assert.equal(count,4,`desktop full PDF pages=${count}`);await page.emulateMedia({media:'screen'});
  }
  assert.equal(errors.length,0,`${name}: browser errors ${errors.join(' | ')}`);
 }catch(e){await fs.mkdir('artifacts',{recursive:true});await page.screenshot({path:`artifacts/v134-analysis-${name}-failure.png`,fullPage:true}).catch(()=>{});await fs.writeFile(`artifacts/v134-analysis-${name}-failure.txt`,String(e?.stack||e));throw e}finally{await context.close()}
}
async function directRoute(browser,entry,viewport){const context=await browser.newContext({viewport,locale:'ar-SA'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));try{const raw=entry==='classification'?'تصنيف الطلاب عربي أول متوسط اختبار تشخيصي شعبة ب عدد الطلاب 10':entry==='remedial'?'ابي خطة علاجيه عربي أول متوسط اختبار تشخيصي شعبة ب':'ابي خطة إثرائيه عربي أول متوسط اختبار تشخيصي شعبة ب';await start(page,entry,raw,'score');await screenGuards(page,entry);const sheets=page.locator('.analysisPages134 .analysisSheet134');assert.equal(await sheets.count(),1,`${entry}: standalone should have one sheet`);const text=await sheets.textContent();if(entry==='classification')assert.match(text,/تصنيف الطلاب حسب مستوياتهم/);if(entry==='remedial')assert.match(text,/الخطة العلاجية/);if(entry==='enrichment')assert.match(text,/الخطة الإثرائية/);assert.doesNotMatch(text,/تحليل نتائج الطلاب/,`${entry}: standalone must not prepend analysis page`);assert.doesNotMatch(text,legacy);await fs.mkdir('artifacts',{recursive:true});await page.screenshot({path:`artifacts/v134-${entry}-desktop.png`,fullPage:true});assert.equal(errors.length,0,`${entry}: ${errors.join(' | ')}`)}finally{await context.close()}}

const browser=await chromium.launch({headless:true});
try{await fullAnalysis(browser,'mobile',{width:390,height:844},'percent');await fullAnalysis(browser,'desktop',{width:1440,height:1000},'score');for(const entry of ['classification','remedial','enrichment'])await directRoute(browser,entry,{width:1440,height:1000});console.log('V134 browser PASS: mobile/desktop Analysis, percentage/score target, 4-page A4 bundle, and standalone classification/remedial/enrichment.')}finally{await browser.close()}
