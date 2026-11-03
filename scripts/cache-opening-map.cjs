const fs=require('fs'),path=require('path'),{execFile}=require('child_process'),{promisify}=require('util');
const run=promisify(execFile),root=path.resolve(__dirname,'..'),dir=path.join(root,'public/maps/opening-cache'),resources={};
const get=async(url,file)=>{
 const dest=path.join(dir,file);fs.mkdirSync(path.dirname(dest),{recursive:true});
 if(!fs.existsSync(dest)||fs.statSync(dest).size===0)await run('curl',['-L','--compressed','--fail','--silent','--show-error','--retry','2','--max-time','25','-o',dest,url]);
 resources[decodeURI(url)]='maps/opening-cache/'+file;return dest;
};
const pool=async(items,fn)=>{let i=0;await Promise.all(Array.from({length:8},async()=>{while(i<items.length)await fn(items[i++]);}));};
(async()=>{
 const meta=JSON.parse(fs.readFileSync(await get('https://tiles.openfreemap.org/planet','planet.json')));
 const lon=121.8183,lat=31.1303,tiles=[];
 for(let z=10;z<=14;z++){
  const n=2**z,x=Math.floor((lon+180)/360*n),y=Math.floor((1-Math.asinh(Math.tan(lat*Math.PI/180))/Math.PI)/2*n);
  for(let dx=-2;dx<=2;dx++)for(let dy=-3;dy<=3;dy++)tiles.push({z,x:x+dx,y:y+dy});
 }
 await pool(tiles,async({z,x,y})=>get(meta.tiles[0].replace('{z}',z).replace('{x}',x).replace('{y}',y),`tiles/${z}-${x}-${y}.pbf`));
 const {VectorTile}=await import('@mapbox/vector-tile'),{PbfReader}=await import('pbf'),ranges=new Set([0,256]);
 for(const {z,x,y} of tiles){
  const tile=new VectorTile(new PbfReader(fs.readFileSync(path.join(dir,`tiles/${z}-${x}-${y}.pbf`))));
  for(const layer of Object.values(tile.layers))for(let i=0;i<layer.length;i++)for(const [key,value] of Object.entries(layer.feature(i).properties))if(key.startsWith('name')&&typeof value==='string')for(const char of value){const code=char.codePointAt(0);if(code<65536)ranges.add(Math.floor(code/256)*256);}
 }
 const glyphs=[];for(const font of ['Noto Sans Regular','Noto Sans Bold','Noto Sans Italic'])for(const start of ranges)glyphs.push({font,start});
 await pool(glyphs,async({font,start})=>get(`https://tiles.openfreemap.org/fonts/${encodeURIComponent(font)}/${start}-${start+255}.pbf`,`fonts/${font.replaceAll(' ','-')}/${start}-${start+255}.pbf`));
 fs.writeFileSync(path.join(dir,'resources.json'),JSON.stringify({source:meta.tiles[0],resources},null,2));
 console.log(JSON.stringify({tiles:tiles.length,glyphRanges:ranges.size,resources:Object.keys(resources).length,directory:dir}));
})().catch(e=>{console.error(e.message);process.exitCode=1;});
