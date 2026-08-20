/* Ministry of Education visual identity tokens — derived from project brand guide */
(function(){
 const css=document.createElement('style');
 css.textContent=`:root{--moe-green:#07A869;--moe-blue:#3D7EB9;--moe-cyan:#0DA9A6;--moe-navy:#15445A;--moe-gold:#C1B48A;--moe-gray:#C2C1C1;--moe-font:'Helvetica Neue W23 for SKY','Helvetica Neue',Arial,sans-serif}body,#printDocument{font-family:var(--moe-font)}#printDocument{--brand-primary:var(--moe-green);--brand-secondary:var(--moe-navy);--brand-accent:var(--moe-cyan)}#printDocument h1,#printDocument h2,#printDocument h3,#printDocument b,#printDocument strong{font-family:var(--moe-font);font-weight:700}`;
 document.head.appendChild(css);
 window.GC_MOE_IDENTITY_V2={version:'2.0',colors:{green:'#07A869',blue:'#3D7EB9',cyan:'#0DA9A6',navy:'#15445A',gold:'#C1B48A',gray:'#C2C1C1'},font:'Helvetica Neue W23 for SKY'};
})();