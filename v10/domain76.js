import {GUIDE_DOMAINS} from './indicator-registry73.js?v=73';
export function selectedDomains76(state,autoDomain){const primary=Number(state.metadata?.guidePrimaryDomain76||autoDomain||0)||null;const related=Number(state.metadata?.guideRelatedDomain76||0)||null;return{primary,related:related&&related!==primary?related:null,primaryName:primary?GUIDE_DOMAINS[primary]:'',relatedName:related?GUIDE_DOMAINS[related]:''}}
export {GUIDE_DOMAINS};
