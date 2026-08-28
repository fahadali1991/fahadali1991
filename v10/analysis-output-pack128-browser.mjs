import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
fs.mkdirSync('artifacts',{recursive:true});
const root='http://127.0.0.1:4173/';
const scenarios=[{label:'mobile',viewport:{width:390,height:844}},{label:'desktop',viewport:{width:1440,height:1000}}];
const browser=await chromium.launch({headless:true});
try{
 for(const s of scenarios){
  const context=await browser.newContext({viewport:s.viewport,locale:'ar-SA'});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(root,{waitUntil:'networkidle'});
  for(const text of ['تصنيف الطلاب','خطة علاجية','خطة إثرائية'])assert.ok(await page.getByText(text,{exact:true}).first().isVisible(),`${s.label}: missing home shortcut ${text}`);
  await page.evaluate(async()=>{
   const {analysisOutputChoicePanel128}=await import('./v10/analysis-output-choice128.js?v=128');
   const {pdfPreview107}=await import('./v10/pdf-renderer107.js?v=128');
   const st={classification:{type:'تحليل نتائج',subtype:'تحليل نتائج'},stage:'متوسط',grades:['الأول المتوسط'],audiences:['الطلاب'],metadata:{schoolName:'مدرسة حطين المتوسطة',educationOffice:'تعليم نجران',academicYear:'1448هـ',executorName:'معلم المادة',familyMeta111:{assessmentType:'اختبار فترة',period:'الفصل الدراسي الأول',section:'ب'},analysis:{maxScore:'20',masteryPercent:'80',scores:[8,12,16,19],names:['أحمد','خالد','سعد','محمد'],rawRows:'أحمد 8\nخالد 12\nسعد 16\nمحمد 19'},familyDetails:{subject94:'اللغة العربية',cause:'تفاوت في إتقان المهارة'}},answers:{goals:[],evidence:[]},attachments:[]};
   document.getElementById('app').innerHTML=analysisOutputChoicePanel128(st)+`<div data-pdf-preview-host107>${pdfPreview107(st,{mode:'color'})}</div>`;
  });
  assert.ok(await page.getByText('ماذا تريد إنشاءه من هذه النتائج؟').isVisible(),`${s.label}: output question missing`);
  assert.equal(await page.locator('.analysisOutputOption128.on').count(),3,`${s.label}: all applicable outputs should default selected`);
  assert.equal(await page.locator('.pdfPages107 .pdfSheet107').count(),4,`${s.label}: expected analysis + remedial + enrichment + classification pages`);
  const titles=await page.locator('.pdfPages107 .pdfSheet107 h1').allTextContents();assert.ok(titles.some(x=>x.includes('الخطة العلاجية')));assert.ok(titles.some(x=>x.includes('الخطة الإثرائية')));assert.ok(titles.some(x=>x.includes('تصنيف الطلاب حسب مستوياتهم')));
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);assert.ok(overflow<=2,`${s.label}: horizontal overflow ${overflow}`);
  await page.screenshot({path:`artifacts/v128-output-pack-${s.label}.png`,fullPage:true});
  if(s.label==='desktop'){
   await page.emulateMedia({media:'print'});
   const maxHeight=await page.locator('.pdfPages107').evaluate(el=>getComputedStyle(el).maxHeight);assert.notEqual(maxHeight,'292mm','multipage pack must not be clipped to legacy one-page height');
   const pdf=await page.pdf({format:'A4',printBackground:true,preferCSSPageSize:true,path:'artifacts/v128-analysis-output-pack.pdf'});const raw=pdf.toString('latin1'),pages=(raw.match(/\/Type\s*\/Page\b/g)||[]).length;assert.equal(pages,4,`printed pack should contain exactly 4 pages; got ${pages}`);
  }
  assert.equal(errors.length,0,`${s.label}: browser errors: ${errors.join(' | ')}`);await context.close();console.log(`✓ v128-output-pack-${s.label}`);
 }
 const context=await browser.newContext({viewport:{width:1000,height:900},locale:'ar-SA'});const page=await context.newPage();await page.goto(root,{waitUntil:'networkidle'});
 const counts=await page.evaluate(async()=>{const {pdfPreview107}=await import('./v10/pdf-renderer107.js?v=128');const direct={classification:{type:'تحليل نتائج',subtype:'تحليل نتائج'},stage:'متوسط',grades:['الأول المتوسط'],audiences:['الطلاب'],metadata:{directEntry128:'classification',familyMeta111:{assessmentType:'اختبار فترة',period:'الفصل الدراسي الأول'},analysis:{maxScore:'20',masteryPercent:'80',scores:[8,16,19],names:['أحمد','سعد','محمد']},familyDetails:{subject94:'اللغة العربية'}},answers:{goals:[],evidence:[]},attachments:[]};const plan={classification:{type:'خطة',subtype:'خطة علاجية'},stage:'متوسط',grades:['الأول المتوسط'],audiences:['الطلاب'],metadata:{directEntry128:'remedial',familyMeta111:{section:'ب'},familyDetails:{subject94:'اللغة العربية',targetStudents128:'أحمد، خالد',basis:'نتائج اختبار تشخيصي',goal:'رفع مستوى الإتقان',method:'إعادة تدريس المهارة',follow:'إعادة قياس المهارة',owner:'معلم أو مجموعة معلمين'}},answers:{goals:[],evidence:[]},attachments:[]};const a=document.createElement('div');a.innerHTML=pdfPreview107(direct);const b=document.createElement('div');b.innerHTML=pdfPreview107(plan);return{classification:a.querySelectorAll('.pdfSheet107').length,plan:b.querySelectorAll('.pdfSheet107').length,classText:a.textContent,planText:b.textContent}});
 assert.equal(counts.classification,1);assert.equal(counts.plan,1);assert.match(counts.classText,/تصنيف الطلاب حسب مستوياتهم/);assert.match(counts.planText,/الخطة العلاجية/);await context.close();
}finally{await browser.close()}
console.log('V128 browser acceptance PASS: home shortcuts, one-input output selection, four-page print pack, direct classification, standalone plan.');
