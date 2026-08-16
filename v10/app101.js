import './app99.js?v=101';
import {installLiveUnderstanding101} from './live-understanding101.js?v=101';
const boot=()=>{const app=document.getElementById('app');if(app)installLiveUnderstanding101(app)};
if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
