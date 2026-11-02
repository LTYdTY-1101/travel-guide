import places from '../../public/journey/europe-locations.json';
import streets from '../../public/journey/ground-routes.json';
import music from '../../public/journey/music-grid.json';
import * as turf from '@turf/turf';
import type {Feature,LineString} from 'geojson';
import {at,clamp,curve,flightState,makeRoute,slice,smooth,type Coordinate,type Route} from '../flight/flight-path';

export const beat=(n:number)=>{
 const whole=Math.floor(n/16),local=n-whole*16,i=Math.floor(local);
 return whole*music.phraseSeconds+music.localBeats[i]+(music.localBeats[i+1]-music.localBeats[i])*(local-i);
};
export const OPENING_SECONDS=beat(16),CLOSING_SECONDS=beat(8);
export type Stop={id:string;name:string;city:string;day:number;date:string;longitude:number;latitude:number;image:string;airport:boolean;zoom:number;holdSeconds:number;size:number;revealDelay:number;offsetX:number;offsetY:number;aspect:number;groundX:number;groundY:number;groundWidth:number;pitch:number;heading:number;heroY:number;subtitle:string};
export type Leg={id:string;kind:'flight'|'tram';from:string;to:string;seconds:number;day:number;cruiseZoom:number};
export type TourProps={section:'full'|'paris'|'barcelona'|'rome';playbackSpeed:number;planeSize:number;tramSize:number;tramArtBearing:number;flightColor:string;groundColor:string;routeWidth:number;cameraPitch:number;anchorY:number;showLabels:boolean;musicVolume:number;stops:Stop[];legs:Leg[]};

// Independently edited beats. Durations keep their individual musical phrasing.
const counts=[32,6,12,8,10,6,16,6,12,6,12,6,16,8,16,10,18];
const spans:{startBeat:number;endBeat:number;seconds:number}[]=[];let cursor=16;
for(const count of counts){spans.push({startBeat:cursor,endBeat:cursor+count,seconds:beat(cursor+count)-beat(cursor)});cursor+=count;}
const stopArt:Record<string,Partial<Stop>>={
 eiffel:{size:680,aspect:2/3,groundY:.86,groundWidth:.55,pitch:44,heading:-32,heroY:.72,zoom:16.1,subtitle:'塞纳河畔，抬头看巴黎。'},
 'notre-dame':{size:950,aspect:1,groundY:.84,groundWidth:.82,pitch:50,heading:58,heroY:.70,zoom:16.3,subtitle:'双塔与玫瑰窗，留住一眼巴黎。'},
 casa:{size:650,aspect:2/3,groundY:.85,groundWidth:.66,pitch:48,heading:38,heroY:.70,zoom:16.6,subtitle:'彩色屋顶，流动的立面。'},
 mila:{size:1000,aspect:1.5,groundY:.84,groundWidth:.85,pitch:44,heading:24,heroY:.60,zoom:16.6,subtitle:'波浪石墙，另一种城市想象。'},
 vatican:{size:1020,aspect:1,groundY:.83,groundWidth:.85,pitch:53,heading:-90,heroY:.68,zoom:16.1,subtitle:'沿着广场纵深，望向穹顶。'},
 trevi:{size:1030,aspect:1.5,groundY:.85,groundWidth:.88,pitch:49,heading:-8,heroY:.60,zoom:16.7,subtitle:'把旅程，留在这一池碧水。'},
};
const holdIndices:Record<string,number>={eiffel:2,'notre-dame':4,casa:8,mila:10,vatican:14,trevi:16};
const leg=(i:number,kind:Leg['kind'],from:string,to:string,day:number,cruiseZoom=5.5):Leg=>({id:from+'--'+to,kind,from,to,seconds:spans[i].seconds,day,cruiseZoom});
export const DEFAULT_TOUR:TourProps={section:'full',playbackSpeed:1,planeSize:170,tramSize:132,tramArtBearing:225,flightColor:'#378bb5',groundColor:'#d58a4e',routeWidth:8,cameraPitch:32,anchorY:.57,showLabels:true,musicVolume:.75,
 stops:places.map(p=>{
  const h=holdIndices[p.id],span=spans[h],fullBeat=span?Math.ceil((span.startBeat+2)/4)*4:0;
  return {id:p.id,name:p.name,city:p.city,day:p.day,date:'10/'+String(p.day).padStart(2,'0'),longitude:p.coord[0],latitude:p.coord[1],image:p.image??'',airport:p.airport??false,zoom:p.zoom,holdSeconds:span?.seconds??0,size:p.size??700,revealDelay:span?Math.max(.1,beat(fullBeat)-beat(span.startBeat)-.8):.2,offsetX:0,offsetY:0,aspect:1,groundX:.5,groundY:.84,groundWidth:.75,pitch:18,heading:0,heroY:.57,subtitle:'',...stopArt[p.id]};
 }),
 legs:[leg(0,'flight','pvg','cdg',1,3.4),leg(1,'tram','cdg','eiffel',1),leg(3,'tram','eiffel','notre-dame',2),leg(5,'tram','notre-dame','cdg',2),leg(6,'flight','cdg','bcn',4,6),leg(7,'tram','bcn','casa',4),leg(9,'tram','casa','mila',4),leg(11,'tram','mila','bcn',4),leg(12,'flight','bcn','fco',6,6),leg(13,'tram','fco','vatican',6),leg(15,'tram','vatican','trevi',7)]};

type RoadRecord={motion:{geometry:LineString;km:number;profile:number[]};snappedStops:number[][];source:string};
const roadRecords=streets as unknown as Record<string,RoadRecord>;
export type Step={id:string;kind:'flight'|'tram'|'hold';from:Stop;to:Stop;day:number;start:number;end:number;seconds:number;route?:Route;leg?:Leg;profile?:number[];rotationTrack?:number[];cameraTrack?:number[];startBearing:number;endBearing:number;departing:boolean};
export const coord=(s:Stop):Coordinate=>[s.longitude,s.latitude];
export const shortAngle=(from:number,to:number)=>from+((to-from+540)%360)-180;
const signed=(a:number)=>a>180?a-360:a;
const angleTrack=(angles:number[],radius:number,sigma:number)=>angles.map((_,i)=>{
 let sum=0,weight=0;for(let j=-radius;j<=radius;j++){const w=Math.exp(-j*j/(2*sigma*sigma));sum+=angles[Math.max(0,Math.min(angles.length-1,i+j))]*w;weight+=w;}return sum/weight;
});
const trackValue=(values:number[],t:number)=>{const n=clamp(t)*(values.length-1),i=Math.floor(n),j=Math.min(values.length-1,i+1);return values[i]+(values[j]-values[i])*(n-i);};
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
  else{const road=roadRecords[leg.id];if(!road)throw new Error('Missing road geometry '+leg.id);const line=turf.lineString(road.motion.geometry.coordinates);route={line,km:turf.length(line)};profile=road.motion.profile;}
  const step:Step={id:leg.id,kind:leg.kind,from,to,day:leg.day,start:time,end:time+leg.seconds,seconds:leg.seconds,route,profile,leg,startBearing:from.heading,endBearing:to.heading,departing:true};
  if(leg.kind==='tram'){
   const count=Math.ceil(leg.seconds*30),angles:number[]=[],cameras:number[]=[];
   for(let f=0;f<=count;f++){
    const km=roadProgress(clamp((f/30-.22)/(leg.seconds-.44)),profile!)*route.km;
    const noseLook=Math.max(.012,Math.min(.20,route.km*.02));
    const heading=turf.bearing(at(route,km-noseLook),at(route,km+noseLook));
    const look=Math.max(.06,Math.min(1.5,route.km*.12));
    const camera=turf.bearing(at(route,km-look),at(route,km+look));
    angles.push(f===0?heading:shortAngle(angles[f-1],heading));cameras.push(f===0?camera:shortAngle(cameras[f-1],camera));
   }
   step.rotationTrack=angleTrack(angles,27,9);step.cameraTrack=angleTrack(cameras,36,18);
  }
  steps.push(step);time=step.end;
  if(!to.airport){steps.push({id:'visit-'+to.id,kind:'hold',from:to,to,day:to.day,start:time,end:time+to.holdSeconds,seconds:to.holdSeconds,startBearing:to.heading,endBearing:to.heading,departing:true});time+=to.holdSeconds;}
 }
 steps[steps.length-1].departing=false;
 for(const s of steps)if(s.kind==='flight'&&s.route){s.startBearing=signed(flightState(0,s.seconds-.65,s.route,s.from.zoom,s.leg!.cruiseZoom,s.to.zoom).heading);s.endBearing=signed(flightState(s.seconds,s.seconds-.65,s.route,s.from.zoom,s.leg!.cruiseZoom,s.to.zoom).heading);}
 for(let i=0;i<steps.length;i++)if(steps[i].kind==='tram'){
  const s=steps[i];s.startBearing=s.from.airport?(steps[i-1]?.endBearing??0):s.from.heading;s.endBearing=s.to.airport?(steps[i+1]?.startBearing??0):s.to.heading;
 }
 const first=props.section==='paris'?'cdg--eiffel':props.section==='barcelona'?'bcn--casa':props.section==='rome'?'fco--vatican':steps[0].id;
 const last=props.section==='paris'?'notre-dame--cdg':props.section==='barcelona'?'mila--bcn':steps.at(-1)!.id;
 const a=steps.findIndex(s=>s.id===first),b=steps.findIndex(s=>s.id===last)+1;if(a<0||b<1)throw new Error('预览分段缺少对应交通段');
 const selected=steps.slice(a,b),offset=selected[0].start;
 return {steps:selected.map(s=>({...s,start:s.start-offset,end:s.end-offset})),seconds:selected.at(-1)!.end-offset,offset};
};
const geoBlend=(a:Coordinate,b:Coordinate,t:number):Coordinate=>{
 if(t<=0)return a;if(t>=1)return b;const line=turf.lineString([a,b]);return turf.along(line,turf.length(line)*t).geometry.coordinates as Coordinate;
};
const pose=(stop:Stop,leaving=false)=>({zoom:stop.zoom-(leaving&&!stop.airport?.3:0),pitch:stop.airport?18:stop.pitch-(leaving?15:6),anchor:stop.heroY-(leaving&&!stop.airport?.06:0)});
export const evaluateStep=(step:Step,seconds:number)=>{
 const t=clamp((seconds-step.start)/step.seconds),local=seconds-step.start;
 let target=coord(step.to),zoom=step.to.zoom,bearing=step.to.heading,pitch=step.to.pitch,anchorY=step.to.heroY,position=target,altitude=0,progress=0,opacity=0,dim=0,reveal=0,backdropScale=0,modelScale=1;
 let line:Feature<LineString>=turf.lineString([target,target]);let ahead:Feature<LineString>=line;let tangentBefore=target,tangentAfter=target;
 if(step.kind==='flight'&&step.route){
  const s=flightState(local,step.seconds-.65,step.route,step.from.zoom,step.leg!.cruiseZoom,step.to.zoom);
  target=position=s.position;zoom=s.zoom;bearing=signed(s.heading)-12*Math.sin(Math.PI*s.u)**2;pitch=18*(1-.72*Math.sin(Math.PI*s.u)**2);anchorY=.57;
  altitude=s.altitude;progress=s.progress;opacity=1-smooth((local-(step.seconds-.65))/.5);line=slice(step.route,s.km);tangentBefore=at(step.route,s.km-.05);tangentAfter=at(step.route,s.km+.05);
 }else if(step.kind==='tram'&&step.route){
  progress=roadProgress(clamp((local-.22)/(step.seconds-.44)),step.profile!);const km=progress*step.route.km;position=at(step.route,km);
  const look=Math.min(.35,Math.max(.018,step.route.km*.045)),focus=at(step.route,km+look);
  target=geoBlend(coord(step.from),focus,smooth(t/.18));target=geoBlend(target,coord(step.to),smooth((t-.70)/.30));
  const from=pose(step.from,true),to=pose(step.to),pull=Math.min(4.7,Math.max(.35,Math.log2(1+step.route.km)*.90));
  zoom=from.zoom+(to.zoom-from.zoom)*smooth(t)-pull*Math.sin(Math.PI*t)**2;
  pitch=from.pitch+(to.pitch-from.pitch)*smooth(t)+(step.route.km<6?5:1)*Math.sin(Math.PI*t)**2;
  anchorY=from.anchor+(to.anchor-from.anchor)*smooth(t)-.025*Math.sin(Math.PI*t)**2;
  const camera=step.cameraTrack!,end=shortAngle(step.startBearing,step.endBearing),middle=(step.startBearing+end)/2,course=trackValue(camera,.5);
  const limit=step.from.airport||step.to.airport?27:70;
  const offset=clamp(shortAngle(middle,course)-middle,-limit,limit),variation=clamp(trackValue(camera,t)-course,-15,15)*.25;
  // Airport handoffs can face opposite headings. Spread the reorientation over
  // the whole shot instead of chasing the first road turn or making a full spin.
  bearing=step.startBearing+(end-step.startBearing)*smooth(t)+(offset+variation)*Math.sin(Math.PI*t)**2;
  opacity=smooth(local/.22)*(1-smooth((local-step.seconds+.3)/.3));line=slice(step.route,km);ahead=turf.lineSliceAlong(step.route.line,Math.min(km,step.route.km-.000001),step.route.km);
  tangentBefore=position;tangentAfter=turf.destination(position,.02,trackValue(step.rotationTrack!,t)).geometry.coordinates as Coordinate;backdropScale=(1-smooth(t/.45))*.30;
 }else{
  const leave=step.departing?smooth((local-step.seconds+1.1)/1.1):0;reveal=smooth((local-step.to.revealDelay)/.8);
  zoom=curve(t,[0,.30,.78,1],[step.to.zoom,step.to.zoom+.20,step.to.zoom+.28,step.to.zoom+(step.departing?-.3:.28)]);
  pitch=curve(t,[0,.32,.78,1],[step.to.pitch-6,step.to.pitch,step.to.pitch+1,step.to.pitch-(step.departing?15:-1)]);
  anchorY=curve(t,[0,.32,.78,1],[step.to.heroY,step.to.heroY+.015,step.to.heroY+.015,step.to.heroY-(step.departing?.06:-.015)]);
  target=turf.destination(coord(step.to),.012*Math.sin(Math.PI*t)**2,step.to.heading+90).geometry.coordinates as Coordinate;
  modelScale=1-.70*leave;dim=smooth((local-step.to.revealDelay+.24)/.75)*.17*(1-leave);
 }
 return {step,t,local,target,zoom,bearing,pitch,anchorY,position,altitude,progress,opacity,line,ahead,tangentBefore,tangentAfter,dim,reveal,backdropScale,modelScale};
};
export type TourState=ReturnType<typeof evaluateStep>;
export const totalFrames=(p:TourProps)=>Math.ceil(Math.round((buildTour(p).seconds+(p.section==='full'?OPENING_SECONDS+CLOSING_SECONDS:0))*30)/p.playbackSpeed);
export const openingLegacySeconds=(seconds:number)=>curve(seconds,[0,beat(3),beat(7),beat(9),beat(10),beat(11),beat(14),OPENING_SECONDS],[0,1.30,3.50,4.35,4.90,5.50,6.80,8]);
