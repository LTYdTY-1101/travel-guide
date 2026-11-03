const fs=require('fs'),path=require('path'),ts=require('typescript'),assert=require('assert/strict'),turf=require('@turf/turf');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true,resolveJsonModule:true}}).outputText,f);
const {DEFAULT_TOUR,buildTour,entranceSeconds,evaluateStep,totalFrames,OPENING_SECONDS,CLOSING_SECONDS,beat}=require('../src/journey/tour-data.ts');
const p=DEFAULT_TOUR,tour=buildTour(p),steps=tour.steps,ids=['eiffel','notre-dame','casa','mila','trevi','vatican'];
const paris=steps.filter(s=>s.id==='visit-eiffel'||s.id==='visit-notre-dame');
assert.equal(paris[0].to.revealDelay,paris[1].to.revealDelay,'Paris entrances start after the same delay');
for(const local of [.1,.3,.5,.8])assert(Math.abs(evaluateStep(paris[0],paris[0].start+paris[0].to.revealDelay+local).reveal-evaluateStep(paris[1],paris[1].start+paris[1].to.revealDelay+local).reveal)<1e-10,'Paris entrances use identical progress');
assert(entranceSeconds('casa')>entranceSeconds('eiffel'),'Barcelona gets time for a distinct flattened phase');
assert.deepEqual(steps.filter(s=>s.kind==='hold').map(s=>s.to.id),ids);
assert.deepEqual(steps.filter(s=>s.kind==='hold').map(s=>s.day),[1,2,4,4,6,7]);
assert.equal(steps.filter(s=>s.kind==='flight').length,3);assert.equal(steps.filter(s=>s.kind==='tram').length,6);
assert(!steps.some(s=>s.id==='notre-dame--cdg'||s.id==='cdg--bcn'));
assert(steps.some(s=>s.id==='notre-dame--bcn'&&s.kind==='flight'));
assert(steps.some(s=>s.id==='fco--trevi'&&s.kind==='tram'));assert(steps.some(s=>s.id==='trevi--vatican'&&s.kind==='tram'));
assert.equal(steps.at(-1).id,'visit-vatican');assert(!steps.some(s=>s.to.id==='pvg'));
assert.equal(totalFrames({...p,playbackSpeed:3}),Math.ceil(totalFrames(p)/3));
const checks=[],violations=[],events=[];let maxHeading=0,maxCamera=0;
for(let i=0;i<steps.length;i++){
 const s=steps[i];if(s.to.image)assert(fs.existsSync(path.join('public',s.to.image)),s.to.image);
 if(s.kind==='hold'&&s.departing){assert.equal(evaluateStep(s,s.end-.04).modelScale,0,'building must vanish before its shot ends: '+s.id);assert.equal(evaluateStep(s,s.end).modelScale,0,'building cannot reappear at handoff');}
 if(i){const a=evaluateStep(steps[i-1],steps[i-1].end),b=evaluateStep(s,s.start);assert(turf.distance(a.target,b.target)<.00001,'camera position: '+s.id);for(const k of ['zoom','pitch','anchorY'])assert(Math.abs(a[k]-b[k])<.00001,k+' boundary: '+s.id);assert(Math.abs(((a.bearing-b.bearing+540)%360)-180)<.0001,'bearing boundary: '+s.id);}
 let previous;
 for(let f=0;f<Math.ceil(s.seconds*30);f++){
  const v=evaluateStep(s,s.start+f/30);assert([v.zoom,v.bearing,v.pitch,v.anchorY,...v.position].every(Number.isFinite));
  const heading=turf.bearing(v.tangentBefore,v.tangentAfter);
  if(previous){const camera=Math.abs(((v.bearing-previous.bearing+540)%360)-180);maxCamera=Math.max(maxCamera,camera);if(camera>8)violations.push({id:s.id,frame:f,camera});if(s.kind==='tram'){const delta=Math.abs(((heading-previous.heading+540)%360)-180);maxHeading=Math.max(maxHeading,delta);if(delta>30)violations.push({id:s.id,frame:f,heading:delta});}}
  previous={bearing:v.bearing,heading};
 }
 checks.push({id:s.id,kind:s.kind,day:s.day,start:s.start,end:s.end,mainStartFrame:Math.round((s.start+OPENING_SECONDS)*30),mainEndFrame:Math.round((s.end+OPENING_SECONDS)*30),seconds:s.seconds});
 if(s.kind==='hold'){
  const time=OPENING_SECONDS+s.start+s.to.revealDelay+entranceSeconds(s.to.id),grid=Array.from({length:56},(_,j)=>({beat:j*4,time:beat(j*4)})),nearest=grid.reduce((a,b)=>Math.abs(a.time-time)<Math.abs(b.time-time)?a:b);
  // The Paris flight is deliberately shortened to match the reference camera pace.
  events.push({event:s.to.name+' 完整亮相',time,frame:Math.round(time*30),beat:nearest.beat,errorMs:(time-nearest.time)*1000});
 }
}
assert.equal(violations.length,0,JSON.stringify(violations.slice(0,5)));
const sections=['full','paris-stage','paris','barcelona','rome'].map(section=>({section,frames:totalFrames({...p,section}),seconds:totalFrames({...p,section})/30}));
const result={sections,stops:ids,flights:3,groundLegs:6,cameraBoundaryChecks:steps.length-1,maxHeadingDegreesPerFrame:maxHeading,maxCameraDegreesPerFrame:maxCamera,opening:OPENING_SECONDS,closing:CLOSING_SECONDS,steps:checks,musicEvents:events,violations};
fs.mkdirSync('previews/six-stop',{recursive:true});fs.writeFileSync('previews/six-stop/timeline-audit.json',JSON.stringify(result,null,2));console.log(JSON.stringify({...result,steps:undefined},null,2));
