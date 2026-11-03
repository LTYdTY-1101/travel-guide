import type React from 'react';
import {Img,staticFile} from 'remotion';

// The map follows the original artwork's heading; the source image stays intact.
export const Tram:React.FC<{x:number;y:number;size:number;heading:number;cameraBearing:number;pitch:number;opacity:number}>=({x,y,size,heading,cameraBearing,pitch,opacity})=>{
 return <div data-vehicle="tram" data-heading={heading} data-camera-bearing={cameraBearing} data-pitch={pitch} data-ground-x={x} data-ground-y={y} style={{position:'absolute',inset:0,opacity,pointerEvents:'none'}}>
  <svg width={size*2} height={size} style={{position:'absolute',left:x-size,top:y-size*.5,overflow:'visible'}}>
   <ellipse cx={size} cy={size*.5+3} rx={size*.28} ry={size*.065} fill="#283330" opacity={.22} style={{filter:'blur(3px)'}} />
  </svg>
  <Img name="交通工具 · 原版有轨电车" src={staticFile('tram-c4d.png')} style={{position:'absolute',left:x-size/2,top:y-size*.84,width:size,height:size,objectFit:'contain'}} />
 </div>;
};
