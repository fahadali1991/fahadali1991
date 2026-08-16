import './app101.js?v=102';
import {installSmartPage2102} from './smart-page2-102.js?v=102';
const boot=()=>{const app=document.getElementById('app');if(app)installSmartPage2102(app)};
if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
