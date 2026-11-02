import fs from 'node:fs/promises';
import * as turf from '@turf/turf';
const records=JSON.parse(await fs.readFile('public/journey/ground-routes.json','utf8'));
for(const record of Object.values(records)){
 const raw=turf.lineString(record.geometry.coordinates);
 let line=turf.bezierSpline(turf.simplify(raw,{tolerance:.000008,highQuality:true}),{resolution:Math.max(20000,record.geometry.coordinates.length*120),sharpness:.55});
 // Bound corner rounding to the original street corridor, including bridges.
 const check=turf.length(line);let deviation=0;
 for(let i=0;i<=50;i++)deviation=Math.max(deviation,turf.nearestPointOnLine(raw,turf.along(line,check*i/50)).properties.dist);
 if(deviation>.015)line=raw;
 const km=turf.length(line),count=Math.max(40,Math.min(800,Math.ceil(km/.008)));
 const heading=Array.from({length:count+1},(_,i)=>turf.bearing(turf.along(line,Math.max(0,km*i/count-.012)),turf.along(line,Math.min(km,km*i/count+.012))));
 const profile=[0];let total=0;
 for(let i=1;i<=count;i++){const turn=Math.abs(((heading[i]-heading[i-1]+540)%360)-180);total+=km/count+turn*.005;profile.push(total);}
 record.motion={geometry:line.geometry,km,roundingMaxDeviationMeters:deviation*1000,profile:profile.map(x=>x/total)};
 console.log(record.id,km.toFixed(3)+' km',count+' motion samples');
}
await fs.writeFile('public/journey/ground-routes.json',JSON.stringify(records));
