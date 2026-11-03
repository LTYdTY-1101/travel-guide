const {chromium}=require('/Users/liutongyu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true,resolveJsonModule:true}}).outputText,f);
const {DEFAULT_TOUR,buildTour,OPENING_SECONDS}=require('../src/journey/tour-data.ts');
const root=path.resolve(__dirname,'..'),out=path.join(root,'previews/latest-polish');
fs.mkdirSync(out,{recursive:true});

(async()=>{
 const tour=buildTour(DEFAULT_TOUR),browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl']});
 assert.deepEqual(tour.steps.filter(step=>step.kind==='hold').map(step=>step.to.id).slice(-2),['trevi','vatican'],'Rome landmarks must play Trevi before St. Peter’s Basilica');
 const page=await browser.newPage({viewport:{width:1700,height:2000}}),checks=[];
 page.on('pageerror',e=>console.log('PAGE ERROR',e.message));
 try{
  await page.goto('http://localhost:3110/Europe7DayInteractive',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof window.remotion_setFrame==='function',null,{timeout:120000});
  const setFrame=async frame=>{await page.evaluate(f=>window.remotion_setFrame(f,'Europe7DayInteractive',1),frame);await page.waitForTimeout(220);};
  for(const step of tour.steps){
   const frame=Math.round((OPENING_SECONDS+step.start+Math.min(step.seconds*.5,.8))*30);
   await setFrame(frame);
   const expected=step.kind==='hold'?step.to.city:step.from.city;
   const cities=page.locator('[data-card-type="city"]');
   const count=await cities.count();
   if(expected==='上海')assert.equal(count,0,`${step.id}: Shanghai opening must not show a Europe city card`);
   else{
    assert.equal(count,1,`${step.id}: exactly one city card must be visible`);
    const city=await cities.first().evaluate(el=>({title:el.querySelector('[data-card-line="title"]')?.textContent,eyebrow:el.querySelector('[data-card-line="eyebrow"]')?.textContent,backgroundOpacity:Number(getComputedStyle(el.querySelector('[data-card-background]')).opacity),width:el.style.width}));
    assert.equal(city.title,expected,`${step.id}: city must match route state`);
    assert.equal(city.backgroundOpacity,.8,`${step.id}: city background opacity`);
    checks.push({step:step.id,frame,expected,...city});
   }
  }
  await setFrame(565);
  const landmark=await page.locator('[data-info-card="eiffel"]').evaluate(el=>({backgroundOpacity:Number(getComputedStyle(el.querySelector('[data-card-background]')).opacity),width:el.style.width,left:el.style.left,text:el.innerText}));
  assert.equal(landmark.backgroundOpacity,.8);assert.equal(landmark.width,'570px');assert(landmark.text.includes('埃菲尔铁塔'));
  const orderedCards=[];
  for(const card of [{id:'trevi',from:1690,title:'特莱维喷泉',day:'第6天'},{id:'vatican',from:1942,title:'圣彼得大教堂',day:'第7天'}]){
   await setFrame(Math.round(OPENING_SECONDS*30)+card.from+30);
   const text=await page.locator(`[data-info-card="${card.id}"]`).innerText();
   assert(text.includes(card.title)&&text.includes(card.day));orderedCards.push({id:card.id,text});
  }
  const posterStart=Math.round((OPENING_SECONDS+tour.seconds)*30);
  await setFrame(posterStart+126);
  await page.waitForSelector('[data-europe-travel-poster]');
  const poster=page.locator('[data-europe-travel-poster]');
  const visual=await poster.evaluate(el=>({foregrounds:el.querySelectorAll('[data-poster-foreground]').length,fireworkPaths:el.querySelectorAll('[data-firework-field] path').length,fireworkSparks:el.querySelectorAll('[data-firework-field] circle').length,buildings:el.querySelectorAll('[data-poster-building]').length}));
  assert.equal(visual.foregrounds,0);assert.equal(visual.buildings,6);assert(visual.fireworkPaths>=120);assert(visual.fireworkSparks>=120);
  const box=await poster.boundingBox();assert(box);
  await page.screenshot({path:path.join(out,'final-poster.png'),clip:box});
  await setFrame(checks.find(c=>c.expected==='巴塞罗那').frame);
  const player=page.locator('[data-tour-step]').first();const playerBox=await player.evaluate(el=>{const r=el.parentElement.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};});
  await page.screenshot({path:path.join(out,'city-barcelona.png'),clip:playerBox});
  fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify({cityChecks:checks,orderedCards,landmark,poster:visual,posterStart},null,2));
  console.log(JSON.stringify({citySamples:checks.length,romeOrder:['trevi','vatican'],landmark,poster:visual,posterStart},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
