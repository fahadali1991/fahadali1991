import './app89.js?v=103';
import {installPresentation92} from './presentation92.js?v=103';
import {installContext94} from './context94.js?v=103';
import {installSubjectState97} from './subject-state97.js?v=103';
import {installTitle98} from './title98.js?v=103';
import {installLiveUnderstanding101} from './live-understanding101.js?v=103';
const boot=()=>{const app=document.getElementById('app');if(!app)return;installPresentation92(app);installContext94(app);installSubjectState97(app);installTitle98(app);installLiveUnderstanding101(app)};
if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',boot,{once:true});else boot();