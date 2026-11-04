const fs=require('fs'),assert=require('assert/strict'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true,resolveJsonModule:true}}).outputText,f);
const {openingState,mapOpeningStyle,OPENING_TIMES:t,OPENING_DURATION}=require('../src/opening/opening-state.ts');
const held=[t.ticketSettle,t.ticketSettle+.3,t.push-.01].map(openingState);
assert(held.every(s=>s.ticketCenter===1383&&s.ticketScale===.96&&s.ticketBlur===0&&s.ticketOpacity===1),'ticket must stay sharp and still');
assert.equal(openingState(t.ticketSettle).ticketRotateX,openingState(t.ticketSettle).mapRotateX,'ticket and map must use the same perspective angle');
let previous=openingState(t.push);
for(let i=0;i<=100;i++){
 const state=openingState(t.push+(t.fullMap-t.push)*i/100);
 assert(state.mapScale>=previous.mapScale&&state.ticketCenter>=previous.ticketCenter);
 assert(state.ticketScale>=previous.ticketScale,'ticket must retain its original foreground projection');
 if(state.ticketVisualTop<1920)assert.equal(state.ticketOpacity,1,'ticket cannot fade before crossing the bottom edge');
 previous=state;
}
const zoomEnd=openingState(t.push+(t.fullMap-t.push)/3);
assert.equal(zoomEnd.zoomPush,1,'map zoom must finish in one third of the push duration');
assert.equal(zoomEnd.mapScale,1,'map zoom must be three times as fast as the overall push');
const end=openingState(t.fullMap),style=mapOpeningStyle(end);
assert(end.ticketVisualTop>1920&&end.mapScale===1&&end.mapRadius===0&&end.cameraPitch===18&&end.anchorY===.57);
assert(style.width===1080&&style.height===1920&&!style.transform,'map hands over at identity');
assert.match(mapOpeningStyle(openingState(t.ticketSettle)).boxShadow,/255,255,255/,'folded map must have a white outline');
for(const seconds of [3.9,4.95,5.9,7.3,7.9,8.7]){const snapshot=JSON.stringify(openingState(seconds));for(const other of [8,0,5.7,7.8])openingState(other);assert.equal(JSON.stringify(openingState(seconds)),snapshot);}
console.log(JSON.stringify({duration:OPENING_DURATION,events:t,stableHoldSeconds:t.push-t.ticketSettle,checks:'equal parked gaps, matched perspective, 3x map zoom, original bottom-edge exit, white outline, identity handoff, deterministic seeking'},null,2));
