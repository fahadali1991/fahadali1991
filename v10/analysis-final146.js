import {analysisFinalPanel134,analysisOutputModel134} from './analysis-output134.js?v=134';

const COLORS={support:'#b84b47',mastered:'#16876f',advanced:'#3d7eb9'};
const pct=v=>`${Number(v).toFixed(1).replace(/\.0$/,'')}٪`;

function semanticRows146(m){
 const g=m?.groupMap||{};
 return [
  {id:'support',label:'يحتاج دعمًا',count:Number(g.support?.count||0),color:COLORS.support},
  {id:'mastered',label:'محقق للإتقان',count:Number(g.mastered?.count||0),color:COLORS.mastered},
  {id:'advanced',label:'مرشح للإثراء',count:Number(g.advanced?.count||0),color:COLORS.advanced}
 ];
}
function bands146(m){
 const rows=semanticRows146(m),total=Number(m?.total||0);
 return `<section class="analysisBlock134 analysisBands134 analysisBands146"><h2>توزيع مستويات الأداء</h2><div>${rows.map(r=>{const w=total?r.count/total*100:0;return`<div class="analysisBar134 ${r.id}"><span>${r.label}</span><i><em style="width:${w}%"></em></i><b>${r.count} (${pct(w)})</b></div>`}).join('')}</div></section>`;
}
function gradient146(m){
 const rows=semanticRows146(m),total=Number(m?.total||0)||1;let at=0;
 return rows.map(r=>{const from=at;at+=r.count/total*100;return`${r.color} ${from}% ${at}%`}).join(',');
}
function recolorDecision146(html,m){
 let out=String(html||'');
 out=out.replace(/background:conic-gradient\([^\"]+\)/,`background:conic-gradient(${gradient146(m)})`);
 const colors=[COLORS.support,COLORS.mastered,COLORS.advanced];let i=0;
 out=out.replace(/<i style="background:[^"]+"><\/i>/g,x=>i<colors.length?`<i style="background:${colors[i++]}"></i>`:x);
 return out;
}
function harmonize146(html,m){
 let out=String(html||'');
 out=out.replace(/<section class="analysisBlock134 analysisBands134">[\s\S]*?<\/section>/,bands146(m));
 return recolorDecision146(out,m);
}
export function analysisFinalPanel146(state){
 const legacy=analysisFinalPanel134(state),model=analysisOutputModel134(state);
 if(!model?.ready||!model.criterion?.defined)return legacy;
 if(model.mode==='analysis')return harmonize146(legacy,model.decision);
 if(model.mode==='classification')return recolorDecision146(legacy,model.decision);
 return legacy;
}
