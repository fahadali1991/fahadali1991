import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const base=process.env.BASE_URL||'http://127.0.0.1:4173/home106.html?v=150';
const rows=[
 ['أحمد',6],['خالد',7],['سعد',8],['محمد',9],['علي',10],['ناصر',11],['حسن',12],['ماجد',13],['سلمان',13],['عبدالله',13],
 ['يوسف',14],['عمر',14],['زياد',14],['فهد',15],['راكان',15],['تركي',15],['بدر',16],['نايف',16],['وليد',16],['عادل',17],
 ['صالح',17],['مشعل',17],['إبراهيم',18],['سامي',18],['منصور',18],['سلطان',19],['فيصل',19],['ياسر',20],['أنس',20],['معاذ',20]
].map(([n,s])=>n+' '+s).join('\n');

async function visible(l){return Boolean(await l.count())&&await l.first().isVisible()}
async function clickIfOff(l){if(await l.count()&&!(await l.getAttribute('class'))?.includes('on'))await l.click()}
async function chooseUnderstanding(page){
 const analysisType=page.locator('[data-type]').filter({hasText:'تحليل نتائج'}).first();if(await analysisType.count())await clickIfOff(analysisType);
 await clickIfOff(page.locator('[data-audience="الطلاب"]').first());
 await clickIfOff(page.locator('[data-stage="متوسط"]').first());
 await clickIfOff(page.locator('[data-grade]').filter({hasText:'الأول'}).first());
}
async function fillProfile(page){
 for(const [id,value] of [['schoolName','مدرسة حطين المتوسطة'],['educationOffice','الإدارة العامة للتعليم بنجران'],['academicYear','1448هـ'],['principalName','مدير المدرسة'],['executorName','معلم اللغة العربية']]){
  const x=page.locator('#'+id).first();if(await visible(x))await x.fill(value);
 }
}
async function completeMeta(page){
 for(let guard=0;guard<8;guard++){
  const host=page.locator('[data-family-meta-host111]').first();if(!(await visible(host)))break;
  const field=await host.getAttribute('data-field111');let choice=host.locator('[data-family-meta-choice111]').first();
  if(field==='period'){const p=host.locator('[data-family-meta-choice111]').filter({hasText:'الفصل الدراسي الأول'}).first();if(await p.count())choice=p}
  if(field==='assessmentType'){const p=host.locator('[data-family-meta-choice111]').filter({hasText:/تشخيص/}).first();if(await p.count())choice=p}
  assert.ok(await choice.count(),'metadata '+field+': no choice');await choice.click();
  const next=host.locator('[data-family-meta-next111]').first();if(await next.count())await next.click();
 }
}
async function ensureSubject(page){
 const hidden=page.locator('[data-family-field="subject94"]').first();
 if(await hidden.count()&&/العربية/.test(await hidden.inputValue()))return;
 const block=page.locator('.subjectBlock109').first();if(await block.count()&&/اللغة العربية/.test(await block.textContent()))return;
 const edit=page.locator('[data-subject-edit109]').first();if(await edit.count())await edit.click();
 const arabic=page.locator('[data-subject109]').filter({hasText:/العربية|عربي|لغتي/}).first();
 assert.ok(await arabic.count(),'Arabic subject option missing');await arabic.click();
}
async function finishAdaptive(page){
 for(let guard=0;guard<8;guard++){
  const q=page.locator('[data-adaptive-question]').first();if(!(await visible(q)))break;
  const pick=q.locator('[data-adaptive-pick]').first();assert.ok(await pick.count(),'adaptive question has no choice');
  await pick.click();await q.locator('[data-adaptive-continue]').click();
 }
}
async function runJourney(page){
 await page.goto(base,{waitUntil:'networkidle'});
 const discard=page.locator('[data-action="discard-draft"]').first();if(await visible(discard))await discard.click();
 await page.locator('[data-entry="analysis"]').click();
 await page.locator('#raw').fill('تحليل نتائج اللغة العربية أول متوسط الفصل الدراسي الأول اختبار تشخيصي شعبة ب عدد الطلاب 30');
 await page.locator('[data-action="analyze"]').click();
 await chooseUnderstanding(page);
 const section=page.locator('#analysisSection111');if(await section.count())assert.equal(await section.inputValue(),'ب');
 await fillProfile(page);
 await page.locator('[data-action="go-goals"]').click();
 await completeMeta(page);
 await ensureSubject(page);
 const ctx=page.locator('[data-analysis-context134]').first();
 if(await visible(ctx)){const single=ctx.locator('[data-analysis-scope134="single_assessment"]').first();if(await single.count())await single.click()}
 const data=page.locator('[data-analysis-host113]').first();await data.waitFor({state:'visible'});
 await data.locator('[data-analysis-max113]').fill('20');
 await page.locator('[data-target-mode134="percent"]').first().click();
 await page.locator('[data-target-percent134]').first().fill('70');
 await data.locator('[data-analysis-rows113]').fill(rows);
 await page.waitForTimeout(180);
 assert.match(await data.locator('.analysisLive114').textContent(),/30|٣٠/);
 await data.locator('[data-analysis-next113]').click();
 await finishAdaptive(page);
 const show=page.locator('[data-action="finalize"]').filter({hasText:/عرض تحليل النتائج/}).first();
 await show.waitFor({state:'visible'});await show.click();
 await page.locator('.analysisResult134').first().waitFor({state:'visible'});
 await page.waitForSelector('.mainAnalysis134.analysisV149[data-v149-ready="1"]');
}
function pageCount(pdf){return (pdf.toString('latin1').match(/\/Type\s*\/Page\b/g)||[]).length}

const browser=await chromium.launch({headless:true});
try{
 await fs.mkdir('artifacts',{recursive:true});

 const desktop=await browser.newContext({viewport:{width:1440,height:1000},locale:'ar-SA'});
 const page=await desktop.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await runJourney(page);
 const body=await page.locator('body').textContent();
 assert.match(body,/مدرسة حطين المتوسطة/);
 assert.match(body,/اللغة العربية/);
 assert.match(body,/الشعبة ب|شعبة ب/);
 assert.match(body,/30|٣٠/);
 assert.equal(await page.locator('.analysisResult134 .analysisScreenGrid134>.analysisBlock134').count(),3,'desktop live result must show distribution + ratio + decision');
 assert.equal(await page.locator('.mainAnalysis134 .analysisMainGrid134>.analysisBlock134').count(),3,'A4 preview must show the same three panels');
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 assert.ok(overflow<=2,'desktop horizontal overflow '+overflow+'px');
 const symbols=await page.locator('.mainAnalysis134 .analysisBands147 .analysisBar134 span').evaluateAll(els=>els.slice(0,3).map(el=>getComputedStyle(el,'::before').content.replace(/["']/g,'')));
 assert.deepEqual(symbols,['●','■','◆'],'print preview must keep three non-colour symbols');
 const barWidths=await page.locator('.mainAnalysis134 .analysisBands147 .analysisBar134 em').evaluateAll(els=>els.map(el=>el.getBoundingClientRect().width));
 assert.ok(Math.max(...barWidths)-Math.min(...barWidths)>8,'bars must represent different proportions');
 await page.screenshot({path:'artifacts/v150-committee-desktop.png',fullPage:true});
 const sheet=page.locator('.mainAnalysis134').first();
 await sheet.evaluate(el=>el.style.filter='grayscale(1)');
 await page.screenshot({path:'artifacts/v150-committee-grayscale.png',fullPage:true});
 await sheet.evaluate(el=>el.style.filter='');
 await page.emulateMedia({media:'print'});
 const print=await sheet.evaluate(el=>{const r=el.getBoundingClientRect(),logo=el.querySelector('.analysisOfficialLogo114')?.getBoundingClientRect(),px=r.width/210;return{scrollHeight:el.scrollHeight,clientHeight:el.clientHeight,logoTop:logo?(logo.top-r.top)/px:null,logoLeft:logo?(logo.left-r.left)/px:null,logoRight:logo?(r.right-logo.right)/px:null,direction:getComputedStyle(el).direction}});
 assert.equal(print.direction,'rtl');
 assert.ok(print.scrollHeight<=print.clientHeight+3,'A4 analysis clips vertically');
 assert.ok((print.logoTop??0)>=14.5,'logo top safe area');
 assert.ok(Math.min(print.logoLeft??Infinity,print.logoRight??Infinity)>=14.5,'logo side safe area');
 const pdf=await page.pdf({format:'A4',printBackground:true,preferCSSPageSize:true,path:'artifacts/v150-committee-a4.pdf'});
 assert.equal(pageCount(pdf),1,'analysis-only A4 must remain one page');
 await page.emulateMedia({media:'screen'});
 assert.equal(errors.length,0,'desktop browser errors: '+errors.join(' | '));
 await desktop.close();

 const mobile=await browser.newContext({viewport:{width:390,height:844},locale:'ar-SA'});
 const mp=await mobile.newPage();const mobileErrors=[];mp.on('pageerror',e=>mobileErrors.push(String(e)));
 await runJourney(mp);
 const mo=await mp.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 assert.ok(mo<=4,'390px mobile horizontal overflow '+mo+'px');
 assert.equal(await mp.locator('.analysisScreenGrid134').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),1,'mobile visual panels must stack');
 assert.equal(await mp.locator('.analysisMetrics134').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),3,'mobile KPIs must be readable 3×2');
 assert.equal(await mp.locator('.analysisScreenGrid134>.analysisBlock134').count(),3,'mobile must keep all three analysis panels');
 await mp.screenshot({path:'artifacts/v150-committee-mobile.png',fullPage:true});
 assert.equal(mobileErrors.length,0,'mobile browser errors: '+mobileErrors.join(' | '));
 await mobile.close();

 console.log('V150 COMMITTEE ACCEPTANCE PASS: 30-student real UI journey, desktop, 390px mobile, RTL, school/subject/section identity, three-panel visual language, grayscale-safe symbols, and one-page A4 all verified.');
}finally{await browser.close()}
