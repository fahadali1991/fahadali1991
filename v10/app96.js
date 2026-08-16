import './app95.js?v=95';
import {installFixes96} from './fixes96.js?v=96';
const boot=()=>{const app=document.getElementById('app');if(app)installFixes96(app)};
if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
