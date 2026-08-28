import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const base=process.env.BASE_URL||'http://127.0.0.1:4173/home106.html';
const scenarios=[
 {name:'mobile',viewport:{width:390,height:844}},
 {name:'desktop',viewport:{width:1440,height:1000}}
];

async function startAnalysis(page){
 await page.goto(base,{waitUntil:'networkidle'});
 const discard=page.locator('[data-action="discard-draft"]');
 if(await discard.count())await discard.click();
 await page.locator('[data-entry="analysis"]').click();
 await page.locator('#raw').fill('تحليل نتائج عربي أول متوسط اختبار الفترة الأولى شعبة ب عدد الطلاب 10');
 await page.locator('[data-action="analyze"]').click();
 await page.locator('.analysisSchoolInfo122').waitFor({state:'visible'});
}

async function profileFromDb(page){
 return page.evaluate(async()=>{
  const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('school-engine-v106',2);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
  return await new Promise((resolve,reject)=>{const r=db.transaction('meta','readonly').objectStore('meta').get('school-profile-v133');r.onsuccess=()=>resolve(r.result?.value||null);r.onerror=()=>reject(r.error)});
 });
}

const browser=await chromium.launch({headless:true});
try{
 for(const scenario of scenarios){
  const context=await browser.newContext({viewport:scenario.viewport,locale:'ar-SA'});
  const page=await context.newPage();
  await startAnalysis(page);

  const suffix=scenario.name==='mobile'?'الجوال':'سطح المكتب';
  const values={schoolName:`مدرسة حطين المتوسطة - ${suffix}`,educationOffice:'الإدارة العامة للتعليم بنجران',academicYear:'1448هـ',principalName:'مدير المدرسة'};
  for(const [id,value] of Object.entries(values))await page.locator(`#${id}`).fill(value);
  await page.waitForTimeout(450);

  const status=page.locator('[data-school-profile-status133]');
  await status.waitFor({state:'visible'});
  assert.match(await status.textContent(),/محفوظة للاستخدام القادم/);
  const saved=await profileFromDb(page);
  assert.equal(saved?.schoolName,values.schoolName);
  assert.equal(saved?.educationOffice,values.educationOffice);
  assert.equal(saved?.academicYear,values.academicYear);
  assert.equal(saved?.principalName,values.principalName);

  await page.locator('[data-ws109="home"]').click();
  await page.waitForLoadState('networkidle');
  const discard=page.locator('[data-action="discard-draft"]');
  if(await discard.count())await discard.click();
  await page.locator('[data-entry="analysis"]').click();
  await page.locator('#raw').fill('تحليل نتائج رياضيات ثاني متوسط اختبار تشخيصي شعبة أ عدد الطلاب 8');
  await page.locator('[data-action="analyze"]').click();
  const host=page.locator('.analysisSchoolInfo122');await host.waitFor({state:'visible'});await page.waitForTimeout(350);

  for(const [id,value] of Object.entries(values))assert.equal(await page.locator(`#${id}`).inputValue(),value,`${scenario.name}: ${id} should be reused from permanent school profile`);
  const form=host.locator('.formGrid');
  assert.equal(await form.isHidden(),true,`${scenario.name}: completed profile should collapse on a new analysis`);
  await host.locator('[data-school-profile-toggle133]').click();
  assert.equal(await form.isVisible(),true,`${scenario.name}: teacher can reopen school details for editing`);

  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=1,`${scenario.name}: no horizontal overflow (${overflow}px)`);

  fs.mkdirSync('artifacts',{recursive:true});
  await page.screenshot({path:`artifacts/v133-school-profile-${scenario.name}.png`,fullPage:true});
  await context.close();
 }
 console.log('V133A school profile browser PASS: first-entry persistence, new-analysis reuse, compact collapse/edit, mobile/desktop, no horizontal overflow.');
}finally{await browser.close()}
