import {analysisSummary113} from './analysis-data113.js?v=116';

const clean=v=>String(v??'').trim();
export function declaredAnalysisCount117(state){
 const metadata=state?.metadata||{},familyMeta=metadata.familyMeta111||{};
 const explicit=clean(familyMeta.expectedCount||metadata.expectedCount111);
 if(explicit)return Number(explicit)||0;
 const prior=metadata.countSource101!=='derived'?clean(metadata.count):'';
 return Number(prior)||0;
}
export function analysisCountConsistency117(state){
 const expected=declaredAnalysisCount117(state),actual=analysisSummary113(state).count||0;
 if(!expected)return{status:'auto',expected:0,actual,message:`سيُحسب عدد الطلاب تلقائيًا من الدرجات المدخلة (${actual}).`};
 if(actual===expected)return{status:'ok',expected,actual,message:`مكتمل: تم إدخال ${actual} درجة من أصل ${expected} طالبًا.`};
 if(actual<expected)return{status:'missing',expected,actual,diff:expected-actual,message:`تنبيه: عدد طلاب الفصل ${expected}، بينما أُدخلت ${actual} درجة فقط. توجد ${expected-actual} درجة ناقصة ويمكنك المتابعة أو استكمالها.`};
 return{status:'extra',expected,actual,diff:actual-expected,message:`تنبيه: أُدخلت ${actual} درجة بينما عدد طلاب الفصل المسجل ${expected}. توجد ${actual-expected} درجة زائدة؛ راجع العدد أو الدرجات.`};
}
