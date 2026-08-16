import './app89.js?v=99';
import {installPresentation92} from './presentation92.js?v=99';
import {installContext94} from './context94.js?v=99';
import {installSubjectState97} from './subject-state97.js?v=99';
import {installAdaptiveDetails97} from './adaptive-details97.js?v=99';
import {installTitle98} from './title98.js?v=99';
const boot=()=>{const app=document.getElementById('app');if(!app)return;installPresentation92(app);installContext94(app);installSubjectState97(app);installAdaptiveDetails97(app);installTitle98(app)};
if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
