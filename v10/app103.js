import './app89.js?v=113';
import {installLiveUnderstanding101} from './live-understanding101.js?v=113';
import {installWorkspace109} from './workspace109.js?v=113';
const boot=()=>{const app=document.getElementById('app');if(!app)return;installWorkspace109(app);installLiveUnderstanding101(app)};
if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
