import fs from 'node:fs';
import path from 'node:path';

const sampleRate=44100;
const out=path.resolve('public/audio/sfx');
fs.mkdirSync(out,{recursive:true});

const clamp=(value)=>Math.max(-.96,Math.min(.96,value));
const noise=(index,seed=1)=>((Math.sin((index+seed*977)*12.9898)*43758.5453)%1)*2-1;
const smooth=(value)=>{const x=Math.max(0,Math.min(1,value));return x*x*(3-2*x);};

const writeStereo=(name,duration,generator)=>{
 const frames=Math.floor(duration*sampleRate),dataSize=frames*4,buffer=Buffer.alloc(44+dataSize);
 buffer.write('RIFF',0);buffer.writeUInt32LE(36+dataSize,4);buffer.write('WAVE',8);buffer.write('fmt ',12);
 buffer.writeUInt32LE(16,16);buffer.writeUInt16LE(1,20);buffer.writeUInt16LE(2,22);buffer.writeUInt32LE(sampleRate,24);
 buffer.writeUInt32LE(sampleRate*4,28);buffer.writeUInt16LE(4,32);buffer.writeUInt16LE(16,34);buffer.write('data',36);buffer.writeUInt32LE(dataSize,40);
 for(let i=0;i<frames;i++){
  const [left,right]=generator(i/sampleRate,i,frames);
  buffer.writeInt16LE(Math.round(clamp(left)*32767),44+i*4);
  buffer.writeInt16LE(Math.round(clamp(right)*32767),46+i*4);
 }
 fs.writeFileSync(path.join(out,name),buffer);
};

const centered=(value,width=.03)=>[value*(1-width),value*(1+width)];
const panned=(value,pan)=>{
 const angle=(pan+1)*Math.PI/4;
 return [value*Math.cos(angle)*Math.SQRT2,value*Math.sin(angle)*Math.SQRT2];
};

writeStereo('message-chime.wav',.62,(t)=>{
 const attack=smooth(t/.012),tail=Math.exp(-t*8.4);
 const bell=(Math.sin(2*Math.PI*1046.5*t)+.42*Math.sin(2*Math.PI*1569.8*t)+.18*Math.sin(2*Math.PI*2093*t))*attack*tail*.28;
 return centered(bell,.018);
});

writeStereo('tram-double-bell.wav',.72,(t)=>{
 const strike=(offset)=>t<offset?0:(Math.sin(2*Math.PI*920*(t-offset))+.5*Math.sin(2*Math.PI*1380*(t-offset))+.2*Math.sin(2*Math.PI*1840*(t-offset)))*Math.exp(-(t-offset)*13);
 return centered((strike(0)+strike(.23)*.92)*.3,.025);
});

writeStereo('tram-arrival.wav',.34,(t)=>centered((Math.sin(2*Math.PI*1180*t)+.3*Math.sin(2*Math.PI*1770*t))*Math.exp(-t*16)*.2,.02));

writeStereo('plane-engine.wav',7.2,(t,i)=>{
 const ramp=.32+.68*smooth(t/3.5),fade=Math.min(1,(7.2-t)/.35);
 const fundamental=52+10*smooth(t/7.2),rumble=Math.sin(2*Math.PI*fundamental*t)+.5*Math.sin(2*Math.PI*fundamental*2.03*t)+.2*Math.sin(2*Math.PI*fundamental*3.97*t);
 const air=noise(i,4)*(.16+.18*smooth(t/5));
 return centered((rumble*.16+air)*ramp*Math.max(0,fade),.012);
});

const takeoff=(name,seed,base,sweep)=>writeStereo(name,1.9,(t,i)=>{
 const env=Math.sin(Math.PI*Math.min(1,t/1.9))**1.25;
 const frequency=base+(base*sweep)*(1-t/1.9),phase=2*Math.PI*(frequency*t-base*sweep*t*t/(2*1.9));
 const body=Math.sin(phase)*.13+noise(i,seed)*.34+Math.sin(phase*.48)*.08;
 const pan=-.28+.56*smooth(t/1.9);
 return panned(body*env,pan);
});
takeoff('takeoff-pass-shanghai.wav',11,150,1.2);
takeoff('takeoff-pass-paris.wav',17,132,1.0);
takeoff('takeoff-pass-barcelona.wav',23,142,1.35);

const rise=(name,pan,seed)=>writeStereo(name,.72,(t,i)=>{
 const env=smooth(t/.08)*(1-smooth((t-.55)/.17));
 const phase=2*Math.PI*(540*t+760*t*t);
 return panned((Math.sin(phase)*.13+noise(i,seed)*.045)*env,pan);
});
rise('firework-rise-left.wav',-.72,31);
rise('firework-rise-center.wav',0,37);
rise('firework-rise-right.wav',.72,41);

const burst=(name,pan,seed,size)=>writeStereo(name,size==='large'?1.65:1.3,(t,i)=>{
 const duration=size==='large'?1.65:1.3;
 const impact=(Math.sin(2*Math.PI*(size==='large'?62:84)*t)+.45*Math.sin(2*Math.PI*(size==='large'?39:57)*t))*Math.exp(-t*(size==='large'?5.2:7.4))*(size==='large'?.48:.34);
 const snap=noise(i,seed)*Math.exp(-t*22)*(size==='large'?.52:.4);
 const crackTimes=size==='large'?[.18,.27,.39,.53,.66,.82,1.02,1.19]:[.16,.28,.43,.61,.8,.98];
 let crackle=0;
 for(let k=0;k<crackTimes.length;k++)if(t>=crackTimes[k])crackle+=noise(i,seed+k+4)*Math.exp(-(t-crackTimes[k])*38)*(size==='large'?.17:.13);
 const tail=noise(i,seed+91)*Math.exp(-t*2.7)*.045*(1-smooth((t-duration+.24)/.24));
 return panned(impact+snap+crackle+tail,pan);
});
for(const [position,pan,seed] of [['left',-.7,51],['center',0,61],['right',.7,71]]){
 burst(`firework-large-${position}.wav`,pan,seed,'large');
 burst(`firework-small-${position}.wav`,pan,seed+10,'small');
}

console.log(`Generated travel SFX in ${out}`);
