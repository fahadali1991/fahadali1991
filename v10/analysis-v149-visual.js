const q=(r,s)=>r.querySelector(s);
const qa=(r,s)=>[...r.querySelectorAll(s)];
const clean=v=>String(v||'').replace(/\s+/g,' ').trim();

function pageLabel149(sheet){
  const p=q(sheet,'.analysisPage134');
  if(!p)return'';
  return clean(p.getAttribute('aria-label')||p.textContent);
}
function value149(sheet,label){
  const cells=qa(sheet,'.analysisMeta134>div,.planMeta134>div');
  const cell=cells.find(x=>clean(q(x,'span')?.textContent)===label);
  return clean(q(cell||document.createElement('div'),'b')?.textContent);
}
function header149(sheet){
  const header=q(sheet,'.analysisHeader134');
  if(!header||header.querySelector('.analysisDocMeta149'))return;
  const title=clean(q(sheet,'.analysisTitle134 h1')?.textContent);
  const kicker=clean(q(sheet,'.analysisTitle134 small')?.textContent);
  const subject=value149(sheet,'المادة');
  const page=pageLabel149(sheet);
  const box=document.createElement('div');
  box.className='analysisDocMeta149';
  const b=document.createElement('b');
  b.textContent=kicker||title||'وثيقة مدرسية';
  box.appendChild(b);
  if(subject){
    const s=document.createElement('span');
    s.textContent='المادة: '+subject;
    box.appendChild(s);
  }else if(title&&title!==kicker){
    const s=document.createElement('span');
    s.textContent=title;
    box.appendChild(s);
  }
  if(page){
    const small=document.createElement('small');
    small.textContent=page;
    box.appendChild(small);
  }
  header.appendChild(box);
}
function splitDecision149(sheet){
  if(!sheet.classList.contains('mainAnalysis134')||sheet.dataset.v149Split)return;
  const grid=q(sheet,'.analysisMainGrid134');
  const decision=grid&&q(grid,'.analysisDecision147');
  if(!grid||!decision)return;
  const wrap=q(decision,'.analysisDonutWrap147');
  const donut=wrap&&q(wrap,'.analysisDonutSvg147');
  const rows=wrap&&q(wrap,'.analysisDecisionRows147');
  if(!donut||!rows)return;
  const ratio=document.createElement('section');
  ratio.className='analysisBlock134 analysisRatio149';
  const ratioTitle=document.createElement('h2');
  ratioTitle.textContent='نسبة الطلاب في كل مستوى';
  ratio.append(ratioTitle,donut);
  const cards=document.createElement('section');
  cards.className='analysisBlock134 analysisDecision149';
  const cardsTitle=document.createElement('h2');
  cardsTitle.textContent='مؤشرات القرار';
  cards.append(cardsTitle,rows);
  decision.replaceWith(ratio,cards);
  sheet.dataset.v149Split='1';
}
function splitScreenDecision149(result){
  if(!result||result.dataset.v149ScreenSplit)return;
  const grid=q(result,'.analysisScreenGrid134');
  const decision=grid&&q(grid,'.analysisDecision147');
  if(!grid||!decision)return;
  const wrap=q(decision,'.analysisDonutWrap147');
  const donut=wrap&&q(wrap,'.analysisDonutSvg147');
  const rows=wrap&&q(wrap,'.analysisDecisionRows147');
  if(!donut||!rows)return;
  const ratio=document.createElement('section');
  ratio.className='analysisBlock134 analysisRatio149 analysisRatioScreen149';
  const ratioTitle=document.createElement('h2');
  ratioTitle.textContent='نسبة الطلاب في كل مستوى';
  ratio.append(ratioTitle,donut);
  const cards=document.createElement('section');
  cards.className='analysisBlock134 analysisDecision149 analysisDecisionScreen149';
  const cardsTitle=document.createElement('h2');
  cardsTitle.textContent='مؤشرات القرار';
  cards.append(cardsTitle,rows);
  decision.replaceWith(ratio,cards);
  result.dataset.v149ScreenSplit='1';
}
function semanticMarkers149(sheet){
  const symbols={support:'●',mastered:'■',advanced:'◆'};
  Object.entries(symbols).forEach(([id,symbol])=>{
    qa(sheet,'.analysisBands147 .analysisBar134.'+id+',.analysisDecisionRows147>div.'+id).forEach(el=>{
      el.dataset.symbol149=symbol;
      el.dataset.level149=id;
      const marker=q(el,'i');
      if(marker)marker.setAttribute('aria-hidden','true');
      const bar=q(el,'em');
      if(bar){
        const width=bar.style.width;
        if(width)bar.style.setProperty('width',width,'important');
        bar.style.setProperty('height','100%','important');
        bar.style.setProperty('margin','0','important');
      }
    });
  });
}
function enhance149(sheet){
  if(!sheet.classList.contains('analysisV149'))sheet.classList.add('analysisV149');
  header149(sheet);
  splitDecision149(sheet);
  semanticMarkers149(sheet);
  sheet.dataset.v149Ready='1';
}
function run149(){
  document.querySelectorAll('.analysisSheet134').forEach(enhance149);
  document.querySelectorAll('.analysisResult134').forEach(result=>{
    splitScreenDecision149(result);
    semanticMarkers149(result);
    result.dataset.v149ScreenReady='1';
  });
}
if(typeof document!=='undefined'){
  new MutationObserver(run149).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run149,{once:true});
  else run149();
}
export {run149};