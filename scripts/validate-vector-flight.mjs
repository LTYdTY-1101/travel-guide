import assert from 'node:assert/strict';
import * as turf from '@turf/turf';
import {makeRoute, flightState, curve} from '../src/flight/flight-path.ts';

const start=[121.8183,31.1303], end=[2.555,49.0097];
const route=makeRoute(start,end);
const state=f=>flightState(f/30,22,route,15,3.4,14.5);
assert(turf.distance(start,state(0).position)<1e-6);
assert(turf.distance(end,state(660).position)<1e-6);
assert(route.km>9000 && route.km<10000);
let previous=state(0);
for(let frame=1;frame<=660;frame++){
 const value=state(frame);
 assert(Object.values(value).flat().every(Number.isFinite));
 assert(value.km>=previous.km,`route reverses at ${frame}`);
 assert(Math.abs(value.zoom-previous.zoom)<.12,`zoom discontinuity at ${frame}`);
 const angle=((value.heading-previous.heading+540)%360)-180;
 assert(Math.abs(angle)<3,`heading discontinuity at ${frame}`);
 previous=value;
}
const direct=JSON.stringify(state(411));
for(const frame of [660,0,92,502,1,320])state(frame);
assert.equal(JSON.stringify(state(411)),direct,'frame evaluation depends on seek history');
const xs=[0,.045,.12,.24,.38,.5,.62,.76,.88,.96,1];
const ys=[0,.00005,.0003,.006,.09,.5,.91,.994,.9997,.99997,1];
for(const x of xs.slice(1,-1)){
 const e=1e-7,left=(curve(x,xs,ys)-curve(x-e,xs,ys))/e,right=(curve(x+e,xs,ys)-curve(x,xs,ys))/e;
 assert(Math.abs(left-right)<.001,`velocity discontinuity at ${x}`);
}
console.log(`Validated 661 frames, ${route.km.toFixed(1)} km great-circle, exact airports, monotone travel, continuous velocity, zoom and heading, arbitrary seeking.`);
