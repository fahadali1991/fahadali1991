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
   return {cards:document.querySelectorAll('.analysisLevelCard126').length,text:document.body.innerText};
  });
  assert.equal(result.cards,4,`${name}: يجب عرض المستويات الأربعة`);
  for(const label of ['إثراء وتميز','محقق للإتقان','قريب من الإتقان','أولوية للتدخل'])assert.match(result.text,new RegExp(label),`${name}: يظهر ${label}`);
  for(const student of ['أحمد','خالد','سعد','محمد'])assert.match(result.text,new RegExp(student),`${name}: يظهر تصنيف ${student}`);
  assert.match(result.text,/40٪/,`${name}: تظهر نسبة الطالب في أولوية التدخل`);
  assert.match(result.text,/95٪/,`${name}: تظهر نسبة الطالب في الإثراء`);
  const box=await page.locator('.analysisLevels126').boundingBox();
  assert.ok(box&&box.width<=viewport.width+1,`${name}: التصنيف لا يتجاوز عرض الشاشة`);
  const horizontal=await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1);
  assert.equal(horizontal,true,`${name}: لا يوجد تمرير أفقي بسبب التصنيف`);
  await page.screenshot({path:`artifacts/v126-analysis-levels-${name}.png`,fullPage:true});
  await page.close();
 }
 console.log('V126 analysis levels browser acceptance PASS: mobile + desktop');
} finally {await browser.close()}
