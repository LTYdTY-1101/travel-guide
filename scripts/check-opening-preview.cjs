const {chromium}=require('/Users/liutongyu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),root=path.resolve(__dirname,'..'),out=path.join(root,'out/opening-transition');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl']});
 const page=await browser.newPage({viewport:{width:1500,height:1100}}),errors=[],results=[];page.on('pageerror',e=>{errors.push(e.message);console.log('PAGE ERROR',e.message);});
 try{
  await page.goto('http://localhost:3110/Europe7DayInteractive',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('[data-tour-ready="true"]'),null,{timeout:120000});
  const seek=async(frame,id='Europe7DayInteractive')=>{
   await page.evaluate(({frame,id})=>window.remotion_setFrame(frame,id,1),{frame,id});
   await page.waitForFunction(f=>document.querySelector(`[data-tour-idle-frame="${f}"]`),frame,{timeout:120000});
   const data=await page.evaluate(()=>{
    const map=document.querySelector('[data-opening-map]'),candidate=document.querySelector('[data-opening-ticket]'),ticket=candidate&&getComputedStyle(candidate).visibility!=='hidden'&&candidate.getBoundingClientRect().width>0?candidate:null,plane=document.querySelector('[data-vehicle="plane"]'),canvas=map.querySelector('canvas');
    const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,top:r.top,bottom:r.bottom,right:r.right};};
    const frame=rect(map.parentElement);
    return {frame,push:Number(map.dataset.openingPush),map:{rect:rect(map),transform:map.style.transform,radius:map.style.borderRadius,shadow:map.style.boxShadow,canvasWidth:canvas.width,canvasHeight:canvas.height},ticket:ticket?{rect:rect(ticket),opacity:Number(ticket.style.opacity),filter:ticket.style.filter,transform:ticket.style.transform,push:Number(ticket.dataset.openingPush)}:null,plane:{left:plane.style.left,top:plane.style.top,width:plane.style.width,rotate:plane.style.rotate},planes:document.querySelectorAll('[data-vehicle="plane"]').length,canvases:document.querySelectorAll('.maplibregl-canvas').length};
   });
   assert.equal(data.planes,1);assert.equal(data.canvases,1);if(data.ticket&&frame<238)assert.equal(data.push,data.ticket.push);
   results.push({frame,id,...data});console.log('SEEK',id,frame,JSON.stringify(data));return data;
  };
  for(const frame of [237,118,180,220,149,264]){
   const s=await seek(frame);
   if(frame===180){assert(s.ticket.rect.top>s.frame.top&&s.ticket.rect.bottom<s.frame.bottom);assert.equal(s.ticket.filter,'blur(0px)');assert.match(s.map.shadow,/255/);assert(parseFloat(s.plane.width)<230);}
   if(frame===220){assert(s.ticket.rect.top<s.frame.bottom&&s.ticket.rect.bottom>s.frame.bottom);assert.equal(s.ticket.opacity,1);}
   if(frame===237){assert.equal(s.map.radius,'0px');assert.equal(s.map.transform,'');assert(s.ticket.rect.top>=s.frame.bottom);}
  }
  const before=await seek(237),after=await seek(238);
  for(const k of ['left','top','width'])assert(Math.abs(parseFloat(before.plane[k])-parseFloat(after.plane[k]))<.1,'plane jumps at full-screen handoff: '+k);
  await page.goto('http://localhost:3110/Scene01-Messages',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('[data-tour-ready="true"]'),null,{timeout:120000});
  const standalone=await seek(237,'Scene01-Messages');assert.deepEqual(standalone.plane,before.plane,'standalone and main opening disagree');
  await page.goto('http://localhost:3110/Europe7DayInteractive',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('[data-tour-ready="true"]'),null,{timeout:120000});
  await seek(96);await page.keyboard.press('Space');
  await page.waitForFunction(()=>Number(document.querySelector('[data-tour-frame]')?.dataset.tourFrame)>=270,null,{timeout:90000});
  await page.keyboard.press('Space');console.log('CONTINUOUS PLAYBACK PASSED');
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'browser-audit.json'),JSON.stringify({errors,results,continuousPlayback:true,randomSeeking:true,standaloneMatches:true},null,2));
 }catch(e){await page.screenshot({path:path.join(out,'browser-failure.png')});console.log((await page.locator('body').innerText()).slice(-2200));throw e;}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
