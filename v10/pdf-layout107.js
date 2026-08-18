import {pdfSchema107,visiblePdfSections107} from './pdf-schema107.js?v=107';
const files=s=>s?.attachments||[];
const images=s=>files(s).filter(f=>String(f.type||f.file?.type||'').startsWith('image/'));
const nonImages=s=>files(s).filter(f=>!String(f.type||f.file?.type||'').startsWith('image/'));
function evidenceLayout(count){if(count<=0)return{mode:'none',page1:0,page2:0};if(count===1)return{mode:'single-large',page1:1,page2:0};if(count===2)return{mode:'two-large',page1:2,page2:0};if(count===3)return{mode:'one-plus-two',page1:3,page2:0};if(count===4)return{mode:'four-grid',page1:4,page2:0};return{mode:'four-plus-page',page1:4,page2:count-4}}
export const PRINT_TOKENS107={
 color:{ink:'#102a33',accent:'#0c6b63',muted:'#677a7f',border:'#d8e1e2',surface:'#ffffff',soft:'#f5f8f8',negative:'#ffffff'},
 grayscale:{ink:'#111111',accent:'#222222',muted:'#555555',border:'#c8c8c8',surface:'#ffffff',soft:'#f4f4f4',negative:'#ffffff'},
 rules:{noInformationByColorOnly:true,maxDarkCoverage:0.12,minBodyContrast:7,minimumPhotoWidthMm:58,minimumBodyPt:10,minimumCaptionPt:8.5}
};
export function printMode107(mode='color'){return mode==='grayscale'||mode==='bw'?{mode:'grayscale',tokens:PRINT_TOKENS107.grayscale,rules:PRINT_TOKENS107.rules}:{mode:'color',tokens:PRINT_TOKENS107.color,rules:PRINT_TOKENS107.rules}}
export function pdfPlan107(state,{mode='color'}={}){const schema=pdfSchema107(state),sections=visiblePdfSections107(state),pics=images(state),docs=nonImages(state),evidence=evidenceLayout(pics.length);return{schemaId:schema.id,family:state?.classification?.type||'',print:printMode107(mode),sections,evidence:{...evidence,imageCount:pics.length,otherCount:docs.length,moveOverflowToEvidencePage:evidence.page2>0},pagePolicy:{preferred:schema.preferredPages,allowExtraEvidencePage:evidence.page2>0,neverShrinkEvidenceBelowMm:58},imagePolicy:schema.imagePolicy}}
