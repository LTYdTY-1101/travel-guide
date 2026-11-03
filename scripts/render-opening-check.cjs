const fs=require('fs'),path=require('path');
const {bundle}=require('@remotion/bundler');
const {openBrowser,selectComposition,renderStill,renderMedia}=require('@remotion/renderer');
const root=path.resolve(__dirname,'..'),out=path.join(root,'out/opening-transition');fs.mkdirSync(out,{recursive:true});
const browserExecutable='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const chromiumOptions={gl:'angle'};
(async()=>{
 const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),outDir:path.join(root,'out/opening-bundle')});
 const browser=await openBrowser('chrome',{browserExecutable,chromiumOptions});
 try{
  const composition=await selectComposition({serveUrl,port:3122,id:'Europe7DayInteractive',puppeteerInstance:browser,timeoutInMilliseconds:180000});
  const frames=[['01-message-map-handoff',118],['02-map-tilted',149],['03-ticket-readable',180],['04-ticket-passing-camera',220],['05-full-map-handoff',237],['06-same-plane-taking-off',264]];
  for(const [name,frame] of frames){await renderStill({serveUrl,port:3122,composition,puppeteerInstance:browser,frame,output:path.join(out,name+'.png'),imageFormat:'png',timeoutInMilliseconds:180000,chromiumOptions});console.log('STILL',name,frame);}
  await renderMedia({serveUrl,port:3122,composition,puppeteerInstance:browser,outputLocation:path.join(out,'opening-transition-test.mp4'),frameRange:[96,269],codec:'h264',crf:18,scale:2/3,concurrency:1,chromiumOptions,timeoutInMilliseconds:180000,imageFormat:'jpeg',jpegQuality:95,overwrite:true,onProgress:p=>{const n=Math.round(p.progress*100);if(n%10===0&&n!==global.lastOpeningProgress){global.lastOpeningProgress=n;console.log('VIDEO',n+'%');}}});
  fs.writeFileSync(path.join(out,'render-manifest.json'),JSON.stringify({composition:composition.id,originalFps:30,video:{file:'opening-transition-test.mp4',startFrame:96,endFrame:269,width:720,height:1280},frames},null,2));
  console.log('RENDERED',out);
 }finally{await browser.close({silent:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
