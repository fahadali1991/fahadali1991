import {chromium} from 'playwright';
import assert from 'node:assert/strict';

const base='http://127.0.0.1:4173';
const devices=[['mobile',{width:390,height:844}],['desktop',{width:1440,height:1000}]];
const browser=await chromium.launch({headless:true});
try{
 for(const [name,viewport] of devices){
  const page=await browser.newPage({viewport});
  await page.goto(`${base}/home106.html?v=126`,{waitUntil:'domcontentloaded'});
  const result=await page.evaluate(async()=>{
   const mod=await import('./v10/analysis-levels126.js?v=126');
   const state={classification:{type:'تحليل نتائج'},stage:'متوسط',grades:['الأول المتوسط'],metadata:{analysis:{maxScore:'20',masteryPercent:'80',scores:[8,12,16,19],names:['أحمد','خالد','سعد','محمد']},familyDetails:{subject94:'اللغة العربية'}}};
   document.body.innerHTML=`<main id="v126-host">${mod.analysisStudentLevelsPanel126(state)}</main>`;
   return {summaries:document.querySelectorAll('.analysisLevelSummaryItem126').length,rows:[...document.querySelectorAll('.analysisStudentRow126')].map(x=>x.innerText),text:document.body.innerText};
  });
  assert.equal(result.summaries,9,`${name}: يجب عرض خمسة مستويات أداء وأربع فئات قرار`);
  assert.equal(result.rows.length,4,`${name}: يجب تصنيف كل طالب في صف مستقل`);
  for(const label of ['ممتاز','جيد جدًا','جيد','مقبول','ضعيف','إثراء وتميز','محقق للإتقان','قريب من الإتقان','أولوية للتدخل'])assert.match(result.text,new RegExp(label),`${name}: يظهر ${label}`);
  assert.match(result.rows[0],/أحمد/);assert.match(result.rows[0],/40٪/);assert.match(result.rows[0],/ضعيف/);assert.match(result.rows[0],/أولوية للتدخل/);
  assert.match(result.rows[1],/خالد/);assert.match(result.rows[1],/60٪/);assert.match(result.rows[1],/مقبول/);assert.match(result.rows[1],/قريب من الإتقان/);
  assert.match(result.rows[2],/سعد/);assert.match(result.rows[2],/80٪/);assert.match(result.rows[2],/جيد جدًا/);assert.match(result.rows[2],/محقق للإتقان/);
  assert.match(result.rows[3],/محمد/);assert.match(result.rows[3],/95٪/);assert.match(result.rows[3],/ممتاز/);assert.match(result.rows[3],/إثراء وتميز/);
  const box=await page.locator('.analysisLevels126').boundingBox();
  assert.ok(box&&box.width<=viewport.width+1,`${name}: التصنيف لا يتجاوز عرض الشاشة`);
  const horizontal=await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1);
  assert.equal(horizontal,true,`${name}: لا يوجد تمرير أفقي بسبب جدول التصنيف`);
  await page.screenshot({path:`artifacts/v126-analysis-levels-${name}.png`,fullPage:true});
  await page.close();
 }
 console.log('V126 analysis classification browser acceptance PASS: five performance levels + four decision bands on mobile + desktop');
} finally {await browser.close()}
