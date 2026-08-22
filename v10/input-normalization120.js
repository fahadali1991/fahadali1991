export function latinDigits120(value=''){
 return String(value??'')
  .replace(/[٠-٩]/g,d=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
  .replace(/[۰-۹]/g,d=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
}

export function normalizedNumberText120(value=''){
 return latinDigits120(value).replace(/٫/g,'.').replace(/٬/g,'');
}

export function finiteNumber120(value){
 const raw=normalizedNumberText120(value).trim();
 if(!/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(raw))return null;
 const number=Number(raw);
 return Number.isFinite(number)?number:null;
}

export function positiveInteger120(value){
 const number=finiteNumber120(value);
 return Number.isInteger(number)&&number>0?number:null;
}

export function percent120(value,fallback=70){
 const number=finiteNumber120(value);
 return number!==null&&number>=1&&number<=100?number:fallback;
}
