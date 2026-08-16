import './app89.js?v=91';
import {installReasonGoals91} from './reason-goals91.js?v=91';
import {installDetails91} from './details91.js?v=91';
import {installProofreader91} from './proofreader91.js?v=91';
const boot=()=>{const app=document.getElementById('app');if(!app)return;installReasonGoals91(app);installDetails91(app);installProofreader91(app)};
if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
