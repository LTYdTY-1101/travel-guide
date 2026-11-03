const fs=require('fs'),assert=require('assert/strict'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true,resolveJsonModule:true}}).outputText,f);
const {openingState,mapOpeningStyle,OPENING_TIMES:t,OPENING_DURATION}=require('../src/opening/opening-state.ts');
const held=[t.ticketSettle,t.ticketSettle+.3,t.push-.01].map(openingState);
assert(held.every(s=>s.ticketCenter===1420&&s.ticketScale===.96&&s.ticketBlur===0&&s.ticketOpacity===1),'ticket must stay sharp and still');
let previous=openingState(t.push);
for(let i=0;i<=100;i++){
 const state=openingState(t.push+(t.fullMap-t.push)*i/100);
 assert(state.mapScale>=previous.mapScale&&state.ticketCenter>=previous.ticketCenter);
 assert(state.ticketScale/.96>=state.mapScale/.8,'foreground grows faster under the same camera move');
 if(state.ticketVisualTop<1920)assert.equal(state.ticketOpacity,1,'ticket cannot fade before crossing the bottom edge');
 previous=state;
}
const end=openingState(t.fullMap),style=mapOpeningStyle(end);
assert(end.ticketVisualTop>1920&&end.mapScale===1&&end.mapRadius===0&&end.cameraPitch===18&&end.anchorY===.57);
assert(style.width===1080&&style.height===1920&&!style.transform,'map hands over at identity');
for(const seconds of [3.9,4.95,5.9,7.3,7.9,8.7]){const snapshot=JSON.stringify(openingState(seconds));for(const other of [8,0,5.7,7.8])openingState(other);assert.equal(JSON.stringify(openingState(seconds)),snapshot);}
console.log(JSON.stringify({duration:OPENING_DURATION,events:t,stableHoldSeconds:t.push-t.ticketSettle,checks:'stable hold, depth ordering, bottom-edge exit, identity handoff, deterministic seeking'},null,2));
