import places from '../../public/journey/europe-locations.json';
import streets from '../../public/journey/ground-routes.json';
import music from '../../public/journey/music-grid.json';
import * as turf from '@turf/turf';
import type {Feature,LineString} from 'geojson';
import {at,clamp,curve,flightState,makeRoute,slice,smooth,type Coordinate,type Route} from '../flight/flight-path';
import {OPENING_DURATION,openingMessageSeconds} from '../opening/opening-state';

export const beat=(n:number)=>{
 const whole=Math.floor(n/16),local=n-whole*16,i=Math.floor(local);
 return whole*music.phraseSeconds+music.localBeats[i]+(music.localBeats[i+1]-music.localBeats[i])*(local-i);
};
export const OPENING_SECONDS=OPENING_DURATION;
const FLIGHT_LANDING_SECONDS=.22,VEHICLE_FADE_SECONDS=.18,TRAM_FADE_IN_SECONDS=.14;
export const entranceSeconds=(id:string)=>id==='casa'||id==='mila'?1.15:.8;
const PARIS_REVEAL_DELAY=.16780045351474082;
export type Stop={id:string;name:string;city:string;day:number;date:string;longitude:number;latitude:number;image:string;airport:boolean;zoom:number;holdSeconds:number;size:number;revealDelay:number;offsetX:number;offsetY:number;aspect:number;groundX:number;groundY:number;groundWidth:number;pitch:number;heading:number;heroY:number;subtitle:string};
export type Leg={id:string;kind:'flight'|'tram';from:string;to:string;seconds:number;day:number;cruiseZoom:number};
export type TourProps={section:'full'|'paris'|'paris-stage'|'barcelona'|'rome';playbackSpeed:number;planeSize:number;tramSize:number;tramArtBearing:number;flightColor:string;groundColor:string;routeWidth:number;cameraPitch:number;anchorY:number;showLabels:boolean;musicVolume:number;posterHoldSeconds?:number;stops:Stop[];legs:Leg[]};

// Independently edited beats. Durations keep their individual musical phrasing.
const counts=[32,6,12,8,10,6,16,6,12,6,12,6,16,8,16,10,18];
const spans:{startBeat:number;endBeat:number;seconds:number}[]=[];let cursor=16;
for(const count of counts){spans.push({startBeat:cursor,endBeat:cursor+count,seconds:beat(cursor+count)-beat(cursor)});cursor+=count;}
const stopArt:Record<string,Partial<Stop>>={
 eiffel:{size:680,aspect:2/3,groundY:.86,groundWidth:.55,pitch:44,heading:-32,heroY:.72,zoom:16.1,revealDelay:PARIS_REVEAL_DELAY,subtitle:'塞纳河畔，抬头看巴黎。'},
 'notre-dame':{size:950,aspect:1,groundY:.84,groundWidth:.82,pitch:50,heading:58,heroY:.70,zoom:16.3,revealDelay:PARIS_REVEAL_DELAY,subtitle:'双塔与玫瑰窗，留住一眼巴黎。'},
 casa:{size:650,aspect:2/3,groundY:.85,groundWidth:.66,pitch:48,heading:38,heroY:.70,zoom:16.6,subtitle:'彩色屋顶，流动的立面。'},
 mila:{size:1000,aspect:1.5,groundY:.84,groundWidth:.85,pitch:44,heading:24,heroY:.60,zoom:16.6,subtitle:'波浪石墙，另一种城市想象。'},
 vatican:{size:1020,aspect:1,groundY:.83,groundWidth:.85,pitch:53,heading:-90,heroY:.68,zoom:16.1,subtitle:'沿着广场纵深，望向穹顶。'},
 trevi:{size:1030,aspect:1.5,groundY:.85,groundWidth:.88,pitch:49,heading:-8,heroY:.60,zoom:16.7,holdSeconds:5.946485260770977,subtitle:'把旅程，留在这一池碧水。'},
};
const holdIndices:Record<string,number>={eiffel:2,'notre-dame':4,casa:8,mila:10,vatican:14,trevi:16};
const leg=(i:number,kind:Leg['kind'],from:string,to:string,day:number,cruiseZoom=5.5):Leg=>({id:from+'--'+to,kind,from,to,seconds:spans[i].seconds,day,cruiseZoom});
export const DEFAULT_TOUR:TourProps={section:'full',playbackSpeed:1,planeSize:190,tramSize:132,tramArtBearing:0,flightColor:'#e43d37',groundColor:'#2584ed',routeWidth:8,cameraPitch:32,anchorY:.57,showLabels:true,musicVolume:.75,
 stops:places.map(p=>{
  const h=holdIndices[p.id],span=spans[h],fullBeat=span?Math.ceil((span.startBeat+2)/4)*4:0;
  return {id:p.id,name:p.name,city:p.city,day:p.day,date:'10/'+String(p.day).padStart(2,'0'),longitude:p.coord[0],latitude:p.coord[1],image:p.image??'',airport:p.airport??false,zoom:p.zoom,holdSeconds:span?.seconds??0,size:p.size??700,revealDelay:span?Math.max(.1,beat(fullBeat)-beat(span.startBeat)-.8):.2,offsetX:0,offsetY:0,aspect:1,groundX:.5,groundY:.84,groundWidth:.75,pitch:18,heading:0,heroY:.57,subtitle:'',...stopArt[p.id]};
 }),
 legs:[
  {...leg(0,'flight','pvg','cdg',1,3.4),seconds:5.3},
  leg(1,'tram','cdg','eiffel',1),
  leg(3,'tram','eiffel','notre-dame',2),
  {...leg(6,'flight','notre-dame','bcn',4,6),seconds:5.3},
  {...leg(7,'tram','bcn','casa',4),seconds:2.8},
  {...leg(9,'tram','casa','mila',4),seconds:2.8},
  {...leg(12,'flight','mila','fco',6,6),seconds:5.3},
  {...leg(13,'tram','fco','trevi',6),seconds:3},
  {...leg(15,'tram','trevi','vatican',7),seconds:3.5},
 ]};

type RoadRecord={motion:{geometry:LineString;km:number;profile:number[]};snappedStops:number[][];source:string};
const roadRecords=streets as unknown as Record<string,RoadRecord>;
const roadCache=new Map<string,Route>();
const smoothRoad=(id:string):Route=>{
 const cached=roadCache.get(id);if(cached)return cached;
 const record=roadRecords[id];
 const coordinates=record?.motion.geometry.coordinates??(
  id==='trevi--vatican'?[...roadRecords['vatican--trevi'].motion.geometry.coordinates].reverse():
  id==='fco--trevi'?[...roadRecords['fco--vatican'].motion.geometry.coordinates,...roadRecords['vatican--trevi'].motion.geometry.coordinates.slice(1)]:
  undefined
 );
 if(!coordinates)throw new Error('Missing road geometry '+id);
 const road=turf.lineString(coordinates),km=turf.length(road);
 const ends=[road.geometry.coordinates[0],road.geometry.coordinates.at(-1)!];
 const direct=turf.lineString(ends),directKm=turf.length(direct);
 // Keep the broad road corridor, remove local street zigzags, then round the joins.
 const anchors=Array.from({length:5},(_,i)=>{
  const t=i/4,a=turf.along(road,km*t).geometry.coordinates,b=turf.along(direct,directKm*t).geometry.coordinates;
  if(i===0||i===4)return ends[i===0?0:1];
  return turf.along(turf.lineString([a,b]),turf.distance(a,b)*.65).geometry.coordinates;
 });
 const line=turf.bezierSpline(turf.lineString(anchors),{resolution:12000,sharpness:.55});
 // Turf samples the spline just before its last endpoint; pin the actual destination.
 line.geometry.coordinates[0]=ends[0];line.geometry.coordinates[line.geometry.coordinates.length-1]=ends[1];
 const route={line,km:turf.length(line)};roadCache.set(id,route);return route;
};
export type Step={id:string;kind:'flight'|'tram'|'hold';from:Stop;to:Stop;day:number;start:number;end:number;seconds:number;route?:Route;leg?:Leg;profile?:number[];startBearing:number;endBearing:number;departing:boolean};
export const coord=(s:Stop):Coordinate=>[s.longitude,s.latitude];
export const shortAngle=(from:number,to:number)=>from+((to-from+540)%360)-180;
const artYaw=(pitch:number)=>180+Math.atan((1/3)/.36*Math.cos(pitch*Math.PI/180))*180/Math.PI;
const roadBearing=(route:Route,km:number,pitch:number)=>turf.bearing(at(route,km-.005),at(route,km+.005))-artYaw(pitch);
const signed=(a:number)=>a>180?a-360:a;
export const roadProgress=(t:number,profile:number[])=>{
 const p=smooth(t);let a=0,b=profile.length-1;while(b-a>1){const m=(a+b)>>1;if(profile[m]<p)a=m;else b=m;}
 return (a+(p-profile[a])/Math.max(1e-9,profile[b]-profile[a]))/(profile.length-1);
};
export const buildTour=(props:Pick<TourProps,'stops'|'legs'|'section'>)=>{
 const byId=new Map(props.stops.map(s=>[s.id,s]));const steps:Step[]=[];let time=0;
 for(const leg of props.legs){
  const from=byId.get(leg.from),to=byId.get(leg.to);if(!from||!to)throw new Error('Missing stop '+leg.id);
  let route:Route,profile:number[]|undefined;
  if(leg.kind==='flight')route=makeRoute(coord(from),coord(to));
  else{route=smoothRoad(leg.id);profile=[0,1];}
  const step:Step={id:leg.id,kind:leg.kind,from,to,day:leg.day,start:time,end:time+leg.seconds,seconds:leg.seconds,route,profile,leg,startBearing:from.heading,endBearing:to.heading,departing:true};
  steps.push(step);time=step.end;
  if(!to.airport){steps.push({id:'visit-'+to.id,kind:'hold',from:to,to,day:to.day,start:time,end:time+to.holdSeconds,seconds:to.holdSeconds,startBearing:to.heading,endBearing:to.heading,departing:true});time+=to.holdSeconds;}
 }
 steps[steps.length-1].departing=false;
 for(const s of steps)if(s.kind==='flight'&&s.route){s.startBearing=signed(flightState(0,s.seconds-FLIGHT_LANDING_SECONDS,s.route,s.from.zoom,s.leg!.cruiseZoom,s.to.zoom).heading);s.endBearing=signed(flightState(s.seconds,s.seconds-FLIGHT_LANDING_SECONDS,s.route,s.from.zoom,s.leg!.cruiseZoom,s.to.zoom).heading);}
 for(let i=0;i<steps.length;i++)if(steps[i].kind==='tram'){
  const s=steps[i];s.startBearing=roadBearing(s.route!,0,pose(s.from,true).pitch);s.endBearing=roadBearing(s.route!,s.route!.km,pose(s.to).pitch);
 }
 for(let i=0;i<steps.length;i++){
  const s=steps[i];
  if(s.kind==='hold'){s.startBearing=steps[i-1]?.endBearing??s.to.heading;s.endBearing=steps[i+1]?.kind==='tram'?steps[i+1].startBearing:s.to.heading;}
  if(s.kind==='flight'&&steps[i-1]?.kind==='tram')s.startBearing=steps[i-1].endBearing;
  if(s.kind==='flight'&&steps[i+1]?.kind==='tram')s.endBearing=steps[i+1].startBearing;
 }
 const first=props.section==='paris'?'cdg--eiffel':props.section==='barcelona'?'bcn--casa':props.section==='rome'?'fco--trevi':steps[0].id;
 const last=props.section==='paris'||props.section==='paris-stage'?'notre-dame--bcn':props.section==='barcelona'?'mila--fco':steps.at(-1)!.id;
 const a=steps.findIndex(s=>s.id===first),b=steps.findIndex(s=>s.id===last)+1;if(a<0||b<1)throw new Error('预览分段缺少对应交通段');
 const selected=steps.slice(a,b),offset=selected[0].start;
 if(props.section==='paris-stage')selected[selected.length-1]={...selected[selected.length-1],end:selected[selected.length-1].start+1.45};
 return {steps:selected.map(s=>({...s,start:s.start-offset,end:s.end-offset})),seconds:selected.at(-1)!.end-offset,offset};
};
const geoBlend=(a:Coordinate,b:Coordinate,t:number):Coordinate=>{
 if(t<=0)return a;if(t>=1)return b;const line=turf.lineString([a,b]);return turf.along(line,turf.length(line)*t).geometry.coordinates as Coordinate;
};
const pose=(stop:Stop,leaving=false)=>({zoom:stop.zoom-(leaving&&!stop.airport?.3:0),pitch:stop.airport?18:stop.pitch-(leaving?15:6),anchor:stop.heroY-(leaving&&!stop.airport?.06:0)});
export const evaluateStep=(step:Step,seconds:number)=>{
 const t=clamp((seconds-step.start)/step.seconds),local=seconds-step.start;
 let target=coord(step.to),zoom=step.to.zoom,bearing=step.to.heading,pitch=step.to.pitch,anchorY=step.to.heroY,position=target,altitude=0,progress=0,opacity=0,dim=0,reveal=0,modelScale=1;
 let line:Feature<LineString>=turf.lineString([target,target]);let ahead:Feature<LineString>=line;let tangentBefore=target,tangentAfter=target;
 if(step.kind==='flight'&&step.route){
  const s=flightState(local,step.seconds-FLIGHT_LANDING_SECONDS,step.route,step.from.zoom,step.leg!.cruiseZoom,step.to.zoom);
  target=position=s.position;zoom=s.zoom;bearing=signed(s.heading)-12*Math.sin(Math.PI*s.u)**2;pitch=18*(1-.72*Math.sin(Math.PI*s.u)**2);anchorY=.57;
  if(!step.from.airport){
   const handoff=smooth(local/1.2);
   zoom=(step.from.zoom-.3)*(1-handoff)+zoom*handoff;
   bearing=step.from.heading+(shortAngle(step.from.heading,bearing)-step.from.heading)*handoff;
   pitch=(step.from.pitch-15)*(1-handoff)+pitch*handoff;
   anchorY=(step.from.heroY-.06)*(1-handoff)+anchorY*handoff;
  }
  else bearing=step.startBearing+(shortAngle(step.startBearing,bearing)-step.startBearing)*smooth(local/1.2);
  altitude=s.altitude;progress=s.progress;opacity=1-smooth((local-(step.seconds-FLIGHT_LANDING_SECONDS))/VEHICLE_FADE_SECONDS);line=slice(step.route,s.km);tangentBefore=at(step.route,s.km-.05);tangentAfter=at(step.route,s.km+.05);
  bearing+=(shortAngle(bearing,step.endBearing)-bearing)*smooth((local-step.seconds+1.2)/1.2);
 }else if(step.kind==='tram'&&step.route){
  progress=roadProgress(clamp((local-.22)/(step.seconds-.44)),step.profile!);const km=progress*step.route.km;position=at(step.route,km);
  const look=Math.min(.35,Math.max(.018,step.route.km*.045)),focus=at(step.route,km+look);
  target=geoBlend(coord(step.from),focus,smooth(t/.18));target=geoBlend(target,coord(step.to),smooth((t-.70)/.30));
  const from=pose(step.from,true),to=pose(step.to),pull=Math.min(4.7,Math.max(.35,Math.log2(1+step.route.km)*.90));
  zoom=from.zoom+(to.zoom-from.zoom)*smooth(t)-pull*Math.sin(Math.PI*t)**2;
  pitch=from.pitch+(to.pitch-from.pitch)*smooth(t)+(step.route.km<6?5:1)*Math.sin(Math.PI*t)**2;
  anchorY=from.anchor+(to.anchor-from.anchor)*smooth(t)-.025*Math.sin(Math.PI*t)**2;
  // Follow the broad, smooth route so the unchanged tram artwork points forward.
  bearing=roadBearing(step.route,km,pitch);
  opacity=smooth(local/TRAM_FADE_IN_SECONDS)*(1-smooth((local-step.seconds+.3)/.3));line=slice(step.route,km);ahead=turf.lineSliceAlong(step.route.line,Math.min(km,step.route.km-.000001),step.route.km);
  tangentBefore=at(step.route,km-.005);tangentAfter=at(step.route,km+.005);
 }else{
  const leave=step.departing?smooth((local-step.seconds+.88)/.8):0;reveal=smooth((local-step.to.revealDelay)/entranceSeconds(step.to.id));
  zoom=curve(t,[0,.30,.78,1],[step.to.zoom,step.to.zoom+.20,step.to.zoom+.28,step.to.zoom+(step.departing?-.3:.28)]);
  pitch=curve(t,[0,.32,.78,1],[step.to.pitch-6,step.to.pitch,step.to.pitch+1,step.to.pitch-(step.departing?15:-1)]);
  anchorY=curve(t,[0,.32,.78,1],[step.to.heroY,step.to.heroY+.015,step.to.heroY+.015,step.to.heroY-(step.departing?.06:-.015)]);
  target=turf.destination(coord(step.to),.012*Math.sin(Math.PI*t)**2,step.to.heading+90).geometry.coordinates as Coordinate;
  const hero=shortAngle(step.startBearing,step.to.heading),depart=shortAngle(hero,step.endBearing);
  bearing=curve(t,[0,.30,.78,1],[step.startBearing,hero,hero,depart]);
  modelScale=1-leave;dim=smooth((local-step.to.revealDelay+.24)/.75)*.30*(1-leave);
 }
 return {step,t,local,target,zoom,bearing,pitch,anchorY,position,altitude,progress,opacity,line,ahead,tangentBefore,tangentAfter,dim,reveal,modelScale,vehicleHeading:turf.bearing(tangentBefore,tangentAfter)};
};
export type TourState=ReturnType<typeof evaluateStep>;
export const totalFrames=(p:TourProps)=>Math.ceil(Math.round((buildTour(p).seconds+(p.section==='full'?OPENING_SECONDS+3.6+(p.posterHoldSeconds??12):p.section==='paris-stage'?OPENING_SECONDS:0))*30)/p.playbackSpeed);
export const openingLegacySeconds=openingMessageSeconds;
