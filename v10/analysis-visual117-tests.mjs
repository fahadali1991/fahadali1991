import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const base='http://127.0.0.1:4173/home106.html?v=117';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},locale:'ar-SA'});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(String(e)));
async function clickIf(selector){const l=page.locator(selector).first();if(await l.count()&&await l.isVisible()){await l.click();return true}return false}
try{
 await page.goto(base,{waitUntil:'networkidle'});
 await page.locator('[data-entry="smart"]').first().click();
 await page.locator('#raw').fill('سويت تحليل نتايج عربي اول متوسط ب');
 await page.locator('[data-action="analyze"]').click();
 const fam=page.locator('[data-type]').filter({hasText:'تحليل نتائج'}).first();if(!(await fam.getAttribute('class'))?.includes('on'))await fam.click();
 if(!(await page.locator('[data-audience="الطلاب"].on').count()))await page.locator('[data-audience="الطلاب"]').click();
 if(!(await page.locator('[data-stage="متوسط"].on').count()))await page.locator('[data-stage="متوسط"]').click();
 const firstGrade=page.locator('[data-grade]').filter({hasText:'الأول'}).first();if(!(await firstGrade.getAttribute('class'))?.includes('on'))await firstGrade.click();
 await page.locator('[data-action="go-goals"]').click();
 await clickIf('[data-subject109]');
 const expectedOrder=['section','period','assessmentType','expectedCount'];const seen=[];
 for(let guard=0;guard<8;guard++){
  const host=page.locator('[data-family-meta-host111]').first();if(!(await host.count())||!(await host.isVisible()))break;
  const id=await host.getAttribute('data-field111');seen.push(id);
  if(id==='section'||id==='expectedCount'){
   const input=host.locator('[data-family-meta111]').first();await input.fill(id==='section'?'ب':'20');
  }else{
   const choice=host.locator('[data-family-meta-choice111]').first();assert.ok(await choice.count(),`${id}: missing choice`);await choice.click();
  }
  await host.locator('[data-family-meta-next111]').click();
 }
 assert.deepEqual(seen,expectedOrder,`analysis metadata order mismatch: ${seen.join(' > ')}`);
 const data=page.locator('[data-analysis-host113]').first();assert.ok(await data.isVisible(),'analysis data panel missing');
 await data.locator('[data-analysis-max113]').fill('10');
 await data.locator('[data-analysis-rows113]').fill('10\n9\n8\n7\n6\n5\n4\n3\n2\n1\n10\n9\n8\n7\n6\n5\n4\n3');
 const consistency=await data.locator('.analysisConsistency116').textContent();assert.match(consistency,/18|20|ناقص|درجة/,'count mismatch warning missing');
 await data.locator('[data-analysis-next113]').click();
 for(let guard=0;guard<12;guard++){
  const q=page.locator('[data-adaptive-question]').first();if(!(await q.count())||!(await q.isVisible()))break;
  const picks=q.locator('[data-adaptive-pick]');assert.ok(await picks.count(),'adaptive choice missing');await picks.first().click();await q.locator('[data-adaptive-continue]').click();
 }
 await page.locator('[data-action="family-details-next"]').click();
 await page.locator('[data-goal]').first().click();await page.locator('[data-action="go-description"]').click();
 await page.locator('[data-title-accept]').first().click();await page.locator('[data-description-variant="medium"]').click();await page.locator('[data-action="go-evidence"]').click();
 for(let guard=0;guard<12;guard++){const fix=page.locator('[data-spell76-from]').first();if(!(await fix.count()))break;await fix.click()}
 if(await page.locator('[data-action="go-evidence-direct"]').count())await page.locator('[data-action="go-evidence-direct"]').click();
 await clickIf('[data-evidence]');await page.locator('[data-action="finalize"]').first().click();await page.waitForSelector('[data-pdf-preview-host107]');
 assert.equal(await page.locator('[data-pdf-whatsapp115]').count(),0,'WhatsApp-specific share button must not exist');
 assert.equal(await page.locator('[data-pdf-share115]').count(),1,'native share button missing');
 const logo=page.locator('.analysisOfficialLogo114 img').first();assert.ok(await logo.count(),'Ministry logo element missing');
 await logo.waitFor({state:'visible'});const logoOK=await logo.evaluate(img=>img.complete&&img.naturalWidth>40&&img.naturalHeight>20);assert.ok(logoOK,'Ministry logo asset did not load visually');
 await fs.mkdir('artifacts',{recursive:true});await page.screenshot({path:'artifacts/analysis-preview-v117.png',fullPage:true});
 await page.emulateMedia({media:'print'});
 const sheets=page.locator('.pdfPages107 .analysisSheet113');assert.equal(await sheets.count(),1,'analysis print must contain one sheet');
 const geometry=await sheets.first().evaluate(sheet=>{const sr=sheet.getBoundingClientRect(),footer=sheet.querySelector('.analysisFooter113')?.getBoundingClientRect(),approval=sheet.querySelector('.analysisApproval113')?.getBoundingClientRect();return{sheetTop:sr.top,sheetBottom:sr.bottom,scrollHeight:sheet.scrollHeight,clientHeight:sheet.clientHeight,footerTop:footer?.top,footerBottom:footer?.bottom,approvalBottom:approval?.bottom}});
 assert.ok(geometry.scrollHeight<=geometry.clientHeight+3,`print content overflows A4: ${JSON.stringify(geometry)}`);
 assert.ok(geometry.footerBottom<=geometry.sheetBottom+1&&geometry.footerTop>=geometry.sheetTop,'footer escaped A4 sheet');
 assert.ok(geometry.approvalBottom<=geometry.footerTop+1,'approval overlaps footer');
 const pdf=await page.pdf({format:'A4',printBackground:true,preferCSSPageSize:true,path:'artifacts/analysis-print-v117.pdf'});const pageCount=(pdf.toString('latin1').match(/\/Type\s*\/Page\b/g)||[]).length;assert.equal(pageCount,1,`Chromium generated ${pageCount} PDF pages instead of 1`);
 assert.equal(errors.length,0,`browser errors: ${errors.join(' | ')}`);
 console.log(`V117 visual acceptance PASS: order=${seen.join(' > ')}, logo loaded, native share only, one-page PDF.`);
}finally{await context.close();await browser.close()}
