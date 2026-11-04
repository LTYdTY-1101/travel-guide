import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sourcePath=path.join(root,'previews/six-stop-reference/source.wav');
const outDir=path.join(root,'public/audio/reference');
const sources=JSON.parse(fs.readFileSync(path.join(outDir,'SOURCES.json'),'utf8'));

const clips=[
 ['reference-message-clean.wav','reference-message.m4a',...sources.derivedEffects['reference-message.m4a'],.08,1.12],
 ['reference-map-flip-clean.wav','reference-map-flip.m4a',...sources.derivedEffects['reference-map-flip.m4a'],.12,1.12],
 ['reference-ticket-clean.wav','reference-ticket.m4a',...sources.derivedEffects['reference-ticket.m4a'],.12,1.12],
 ['reference-plane-clean.wav','reference-plane.m4a',...sources.derivedEffects['reference-plane.m4a'],.28,1.02],
 ['reference-fireworks-clean.wav','reference-fireworks.m4a',...sources.derivedEffects['reference-fireworks.m4a'],.14,1.08],
];

const readWav=(file)=>{
 const buffer=fs.readFileSync(file);
 if(buffer.toString('ascii',0,4)!=='RIFF'||buffer.toString('ascii',8,12)!=='WAVE')throw new Error('Expected a RIFF/WAVE file: '+file);
 let offset=12,format=null,data=null;
 while(offset+8<=buffer.length){
  const id=buffer.toString('ascii',offset,offset+4),size=buffer.readUInt32LE(offset+4),start=offset+8;
  if(id==='fmt ')format={audioFormat:buffer.readUInt16LE(start),channels:buffer.readUInt16LE(start+2),sampleRate:buffer.readUInt32LE(start+4),bits:buffer.readUInt16LE(start+14)};
  if(id==='data')data=buffer.subarray(start,start+size);
  offset=start+size+(size%2);
 }
 if(!format||!data||format.audioFormat!==1||format.bits!==16||format.channels!==2)throw new Error('Expected stereo 16-bit PCM: '+file);
 const frames=data.length/4,left=new Float32Array(frames),right=new Float32Array(frames);
 for(let i=0;i<frames;i++){left[i]=data.readInt16LE(i*4)/32768;right[i]=data.readInt16LE(i*4+2)/32768;}
 return {sampleRate:format.sampleRate,channels:[left,right]};
};

const writeWav=(file,sampleRate,channels)=>{
 const frames=channels[0].length,dataSize=frames*4,buffer=Buffer.alloc(44+dataSize);
 buffer.write('RIFF',0);buffer.writeUInt32LE(36+dataSize,4);buffer.write('WAVE',8);buffer.write('fmt ',12);buffer.writeUInt32LE(16,16);
 buffer.writeUInt16LE(1,20);buffer.writeUInt16LE(2,22);buffer.writeUInt32LE(sampleRate,24);buffer.writeUInt32LE(sampleRate*4,28);buffer.writeUInt16LE(4,32);buffer.writeUInt16LE(16,34);buffer.write('data',36);buffer.writeUInt32LE(dataSize,40);
 for(let i=0;i<frames;i++)for(let c=0;c<2;c++)buffer.writeInt16LE(Math.max(-32768,Math.min(32767,Math.round(channels[c][i]*32767))),44+i*4+c*2);
 fs.writeFileSync(file,buffer);
};

const fft=(real,imag,inverse=false)=>{
 const n=real.length;
 for(let i=1,j=0;i<n;i++){
  let bit=n>>1;for(;j&bit;bit>>=1)j^=bit;j^=bit;
  if(i<j){let v=real[i];real[i]=real[j];real[j]=v;v=imag[i];imag[i]=imag[j];imag[j]=v;}
 }
 for(let length=2;length<=n;length<<=1){
  const angle=(inverse?2:-2)*Math.PI/length,wr0=Math.cos(angle),wi0=Math.sin(angle);
  for(let start=0;start<n;start+=length){
   let wr=1,wi=0;
   for(let j=0;j<length/2;j++){
    const even=start+j,odd=even+length/2;
    const tr=wr*real[odd]-wi*imag[odd],ti=wr*imag[odd]+wi*real[odd];
    real[odd]=real[even]-tr;imag[odd]=imag[even]-ti;real[even]+=tr;imag[even]+=ti;
    const nextWr=wr*wr0-wi*wi0;wi=wr*wi0+wi*wr0;wr=nextWr;
   }
  }
 }
 if(inverse)for(let i=0;i<n;i++){real[i]/=n;imag[i]/=n;}
};

const median=(items)=>{items.sort((a,b)=>a-b);return items[items.length>>1];};

const isolateEffects=(channels,{floor,harmonicBias})=>{
 const size=2048,hop=512,bins=size/2+1,pad=size/2;
 const window=Float32Array.from({length:size},(_,i)=>.5-.5*Math.cos(2*Math.PI*i/(size-1)));
 const starts=[];for(let start=-pad;start<channels[0].length+pad;start+=hop)starts.push(start);
 const spectra=[[],[]],magnitudes=[];
 for(let frame=0;frame<starts.length;frame++){
  const start=starts[frame],channelMagnitude=[];
  for(let c=0;c<2;c++){
   const real=new Float64Array(size),imag=new Float64Array(size);
   for(let i=0;i<size;i++){const at=start+i;real[i]=(at>=0&&at<channels[c].length?channels[c][at]:0)*window[i];}
   fft(real,imag);
   spectra[c].push({real:Float32Array.from(real),imag:Float32Array.from(imag)});
   channelMagnitude.push(Float32Array.from({length:bins},(_,bin)=>Math.hypot(real[bin],imag[bin])));
  }
  magnitudes.push(Float32Array.from({length:bins},(_,bin)=>Math.hypot(channelMagnitude[0][bin],channelMagnitude[1][bin])/Math.SQRT2));
 }
 const harmonic=magnitudes.map(()=>new Float32Array(bins)),percussive=magnitudes.map(()=>new Float32Array(bins));
 const timeRadius=8,freqRadius=8,values=[];
 for(let frame=0;frame<magnitudes.length;frame++)for(let bin=0;bin<bins;bin++){
  values.length=0;for(let f=Math.max(0,frame-timeRadius);f<=Math.min(magnitudes.length-1,frame+timeRadius);f++)values.push(magnitudes[f][bin]);
  harmonic[frame][bin]=median(values);
 }
 for(let frame=0;frame<magnitudes.length;frame++)for(let bin=0;bin<bins;bin++){
  values.length=0;for(let b=Math.max(0,bin-freqRadius);b<=Math.min(bins-1,bin+freqRadius);b++)values.push(magnitudes[frame][b]);
  percussive[frame][bin]=median(values);
 }
 let maskSum=0,maskCount=0;
 for(let frame=0;frame<magnitudes.length;frame++){
  const mask=new Float32Array(bins);
  for(let bin=0;bin<bins;bin++){
   const p=percussive[frame][bin],h=harmonic[frame][bin]*harmonicBias;
   const ratio=p*p/(p*p+h*h+1e-12);
   mask[bin]=floor+(1-floor)*ratio;maskSum+=mask[bin];maskCount++;
  }
  for(let c=0;c<2;c++)for(let bin=0;bin<size;bin++){
   const mirrored=bin<=size/2?bin:size-bin,m=mask[mirrored];
   spectra[c][frame].real[bin]*=m;spectra[c][frame].imag[bin]*=m;
  }
 }
 const output=[new Float64Array(channels[0].length),new Float64Array(channels[0].length)],normalization=new Float64Array(channels[0].length);
 for(let frame=0;frame<starts.length;frame++){
  const start=starts[frame];
  for(let c=0;c<2;c++){
   const real=Float64Array.from(spectra[c][frame].real),imag=Float64Array.from(spectra[c][frame].imag);fft(real,imag,true);
   for(let i=0;i<size;i++){const at=start+i;if(at>=0&&at<output[c].length)output[c][at]+=real[i]*window[i];}
  }
  for(let i=0;i<size;i++){const at=start+i;if(at>=0&&at<normalization.length)normalization[at]+=window[i]*window[i];}
 }
 for(let c=0;c<2;c++)for(let i=0;i<output[c].length;i++)output[c][i]/=Math.max(1e-8,normalization[i]);
 return {channels:output.map((channel)=>Float32Array.from(channel)),averageMask:maskSum/maskCount};
};

const stats=(channels,sampleRate)=>{
 let sum=0,peak=0;for(const channel of channels)for(const value of channel){sum+=value*value;peak=Math.max(peak,Math.abs(value));}
 const rms=Math.sqrt(sum/(channels.length*channels[0].length));
 const window=Math.max(1,Math.round(sampleRate*.01)),envelope=[];
 for(let start=0;start<channels[0].length;start+=window){let energy=0,count=0;for(let i=start;i<Math.min(start+window,channels[0].length);i++){energy+=(channels[0][i]**2+channels[1][i]**2)/2;count++;}envelope.push(Math.sqrt(energy/Math.max(1,count)));}
 const envelopePeak=Math.max(...envelope),threshold=Math.max(envelopePeak*.09,(envelope.slice(0,5).reduce((a,b)=>a+b,0)/5)*2.5);
 const onsetIndex=envelope.findIndex((value,index)=>value>=threshold&&(envelope[index+1]??value)>=threshold*.72);
 return {rms,peak,onsetSeconds:Math.max(0,onsetIndex)*.01};
};

if(!fs.existsSync(sourcePath))throw new Error('Missing source WAV. Extract the supplied reference video to '+sourcePath);
fs.mkdirSync(outDir,{recursive:true});
const source=readWav(sourcePath),audit=[];
for(const [outputName,legacyName,startSeconds,endSeconds,floor,harmonicBias] of clips){
 const start=Math.round(startSeconds*source.sampleRate),end=Math.round(endSeconds*source.sampleRate);
 const original=source.channels.map((channel)=>channel.slice(start,end));
 const before=stats(original,source.sampleRate),isolated=isolateEffects(original,{floor,harmonicBias});
 const afterRaw=stats(isolated.channels,source.sampleRate),targetPeak=Math.min(.96,before.peak*.94),gain=Math.min(2.5,targetPeak/Math.max(1e-8,afterRaw.peak));
 const fade=Math.round(source.sampleRate*.008),clean=isolated.channels.map((channel)=>Float32Array.from(channel,(value,index)=>{
  const edge=Math.min(1,index/fade,(channel.length-1-index)/fade);return value*gain*Math.max(0,edge);
 }));
 const after=stats(clean,source.sampleRate),output=path.join(outDir,outputName);writeWav(output,source.sampleRate,clean);
 audit.push({output:outputName,replaces:legacyName,sourceSeconds:[startSeconds,endSeconds],durationSeconds:(end-start)/source.sampleRate,original:before,clean:after,averageEffectMask:isolated.averageMask,normalizationGain:gain,treatment:`HPSS effect stem, ${2048}-sample FFT, 512-sample hop, harmonic floor ${floor}`});
 console.log(outputName,JSON.stringify(audit.at(-1)));
}
fs.writeFileSync(path.join(outDir,'SFX-AUDIT.json'),JSON.stringify({source:sources.source,method:'Stereo harmonic/percussive masking with shared phase-preserving masks; no time stretch; no pitch shift',sampleRate:source.sampleRate,clips:audit},null,2));
