import './app99.js?v=100';
import {installLiveUnderstanding100} from './live-understanding100.js?v=100';
import {installSubjectHint100} from './subject-hint100.js?v=100';
import {installSemanticGoals100} from './goals-semantic100.js?v=100';
const boot=()=>{const app=document.getElementById('app');if(!app)return;installLiveUnderstanding100(app);installSubjectHint100(app);installSemanticGoals100(app)};
if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
