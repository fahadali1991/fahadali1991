const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
function rememberReason(v){try{sessionStorage.setItem('v90_reason',clean(v))}catch{}}
function getReason(){try{return sessionStorage.getItem('v90_reason')||''}catch{return''}}
function rankGoalText(text,reason){let score=0;const t=clean(text),r=clean(reason);const pairs=[
 [/مناسبة|وطني|هوية/,/هوية|انتماء|اعتزاز|وعي|قيم/],
 [/مهارة|مهارات/,/مهارة|إتقان|تطبيق|قدرة/],
 [/احتياج|ضعف|تحد|معالجة/,/معالجة|تحسين|رفع مستوى|إتقان|دعم/],
 [/سلوك|قيمة/,/سلوك|قيم|مسؤولية|انتماء|ممارسة/],
 [/دافعية|مشاركة/,/دافعية|مشاركة|تفاعل|مبادرة/],
 [/إثراء|موهبة/,/إثراء|موهبة|ابتكار|خبرات/],
 [/تقنية|رقمي/,/تقنية|رقمي|تعلم|خبرات/],
 [/سلامة|أمن/,/سلامة|وعي|تصرف|مسؤولية/]
 ];
 for(const [a,b] of pairs)if(a.test(r)&&b.test(t))score+=4;
 if(/الرئيسي|المستهدف|الأساسية/.test(t))score+=1;
 return score;
}
function compactReasonPage(root){const groups=$$('.familyChoice',root);const reason=groups.find(g=>{const s=$('small',g);return s&&/سبب|ليش|لماذا/.test(s.textContent)});if(!reason||reason.dataset.v90Done)return;reason.dataset.v90Done='1';const title=$('small',reason);if(title)title.textContent='لماذا نُفّذ هذا العمل؟';const help=$('.questionHelp',reason);if(help)help.innerHTML='<b>راجع اقتراح المحرك فقط.</b> اختر الأقرب لما حدث فعليًا.';const buttons=$$('[data-family-pick]',reason);if(!buttons.length)return;const on=buttons.filter(b=>b.classList.contains('on'));const ordered=[...on,...buttons.filter(b=>!on.includes(b))];const top=ordered.slice(0,3),rest=ordered.slice(3);top.forEach((b,i)=>{b.style.display='flex';b.style.alignItems='center';b.style.justifyContent='space-between';if(i===0){b.dataset.reasonRole='primary';b.innerHTML=`<span>${clean(b.textContent)}</span><small class="v90Badge">الأقرب ★</small>`}else{b.dataset.reasonRole='support';b.innerHTML=`<span>${clean(b.textContent)}</span><small class="v90Badge mutedBadge">قد ينطبق</small>`}});rest.forEach(b=>b.style.display='none');if(rest.length){const more=document.createElement('button');more.type='button';more.className='btn v90More';more.textContent=`عرض ${rest.length} أسباب أخرى`;more.addEventListener('click',()=>{const open=more.dataset.open==='1';rest.forEach(b=>b.style.display=open?'none':'flex');more.dataset.open=open?'0':'1';more.textContent=open?`عرض ${rest.length} أسباب أخرى`:'إخفاء الأسباب الإضافية'});reason.appendChild(more)}
 reason.addEventListener('click',e=>{const b=e.target.closest('[data-family-value]');if(b)rememberReason(b.dataset.familyValue||b.textContent)});
 const selected=on[0];if(selected)rememberReason(selected.dataset.familyValue||selected.textContent);
}
function compactGoalsPage(root){const heading=$('h1',root);if(!heading||clean(heading.textContent)!=='الأهداف')return;const card=heading.closest('.card')||root;if(card.dataset.v90Goals)return;card.dataset.v90Goals='1';const lead=$('.lead',card);if(lead)lead.textContent='اختر الهدف الذي يعكس عملك. يعرض النظام الأقرب أولًا، ويمكنك فتح بقية الاقتراحات عند الحاجة.';
 const all=$$('[data-goal]',card);if(!all.length)return;const reason=getReason();const ranked=all.map((b,i)=>({b,i,score:rankGoalText(b.textContent,reason)+(b.classList.contains('on')?8:0)})).sort((a,b)=>b.score-a.score||a.i-b.i);
 const top=ranked.slice(0,3).map(x=>x.b),rest=ranked.slice(3).map(x=>x.b);all.forEach(b=>b.style.display='none');top.forEach((b,i)=>{b.style.display='flex';b.style.alignItems='center';b.style.justifyContent='space-between';const txt=clean(b.textContent);if(i===0)b.innerHTML=`<span>${txt}</span><small class="v90Badge">الهدف الأقرب ★</small>`;else b.innerHTML=`<span>${txt}</span><small class="v90Badge mutedBadge">هدف داعم</small>`});
 const firstGrid=top[0]?.parentElement;if(firstGrid){let label=document.createElement('div');label.className='v90SectionLabel';label.innerHTML='<b>الأهداف المقترحة</b><small>هدف واحد يكفي للعمل البسيط، واختر أكثر فقط عند الحاجة.</small>';firstGrid.parentElement.insertBefore(label,firstGrid)}
 if(rest.length&&firstGrid){const more=document.createElement('button');more.type='button';more.className='btn v90More';more.textContent=`عرض ${rest.length} أهداف أخرى`;more.addEventListener('click',()=>{const open=more.dataset.open==='1';rest.forEach(b=>b.style.display=open?'none':'flex');more.dataset.open=open?'0':'1';more.textContent=open?`عرض ${rest.length} أهداف أخرى`:'إخفاء الأهداف الإضافية'});firstGrid.parentElement.insertBefore(more,firstGrid.nextSibling)}
}
function apply(){const app=document.getElementById('app');if(!app)return;compactReasonPage(app);compactGoalsPage(app)}
const observer=new MutationObserver(()=>requestAnimationFrame(apply));
window.addEventListener('DOMContentLoaded',()=>{const app=document.getElementById('app');if(app)observer.observe(app,{childList:true,subtree:true});apply()});
