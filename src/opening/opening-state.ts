import type React from 'react';
import {Easing} from 'remotion';
import music from '../../public/journey/music-grid.json';
import {clamp,curve,smooth} from '../flight/flight-path';

// One clock for the message flip, map, foreground ticket and takeoff.
// These are the existing measured beats; the score itself is unchanged.
export const OPENING_DURATION=music.phraseSeconds;
const beats=music.localBeats;
export const OPENING_TIMES={
 messageFlip:beats[7],mapReveal:beats[8]-.19,messageSide:beats[8],
 messageGone:beats[8]+.09,mapOpen:beats[9],mapTilt:beats[10],
 ticketIn:beats[10],ticketSettle:beats[11],push:beats[13],
 fullMap:OPENING_DURATION-OPENING_DURATION/80,takeoff:OPENING_DURATION,
} as const;
const phase=(s:number,a:number,b:number)=>clamp((s-a)/(b-a));
const settle=Easing.bezier(.16,1,.3,1);

// Keep the existing message/GO entrance timing before the flip.
export const openingMessageSeconds=(seconds:number)=>curve(seconds,
 [0,beats[3],beats[7],beats[9],beats[10],beats[11],beats[14],OPENING_DURATION],
 [0,1.30,3.50,4.35,4.90,5.50,6.80,8]);

export const openingState=(seconds:number)=>{
 const t=OPENING_TIMES;
 const unfold=settle(phase(seconds,t.mapReveal,t.mapOpen));
 const tilt=smooth(phase(seconds,t.mapOpen,t.mapTilt));
 const push=smooth(phase(seconds,t.push,t.fullMap));
 // Camera travel / map depth = .20; camera travel / foreground depth = .625.
 // Both cards are projected by the same camera move, with a nearer ticket.
 const mapMagnification=1/(1-.20*push),ticketMagnification=1/(1-.625*push);
 const anchorY=.34+(.57-.34)*push;
 const mapHeight=(234+(1640-234)*unfold)+(1920-1640)*push;
 const mapTop=(685+(180-685)*unfold)*(1-push);
 const mapOriginY=(mapHeight/2)*(1-tilt)+anchorY*1920*tilt;
 const targetY=mapTop+anchorY*1920;
 const entry=settle(phase(seconds,t.ticketIn,t.ticketSettle));
 const parkedCenter=1420,initialTarget=180+.34*1920;
 const ticketCenter=seconds<t.push?2200+(parkedCenter-2200)*entry:targetY+(parkedCenter-initialTarget)*ticketMagnification;
 const ticketScale=.96*ticketMagnification;
 const ticketTop=ticketCenter-515/2;
 const ticketVisualTop=ticketCenter-515*ticketScale/2;
 return {
  seconds,push,entry,unfold,anchorY,mapHeight,mapTop,mapOriginY,targetY,
  mapScale:.8*mapMagnification,mapRotateY:-88*(1-unfold),mapRotateX:25*tilt*(1-push),
  mapOpacity:smooth(phase(seconds,t.mapReveal,t.messageSide+.08)),
  mapRadius:44*(1-push),mapShadow:1-push,
  cameraPitch:18*push,
  messageRotateY:88*Easing.bezier(.48,0,.9,.52)(phase(seconds,t.messageFlip,t.messageSide)),
  messageOpacity:1-smooth(phase(seconds,t.messageSide-.04,t.messageGone)),
  messageSeconds:openingMessageSeconds(seconds),
  ticketTop,ticketScale,ticketCenter,ticketVisualTop,
  ticketOpacity:seconds<t.ticketIn?0:1-smooth((ticketVisualTop-1920)/160),
  ticketBlur:seconds<t.push?5*(1-entry):14*push**2,
  ticketRotateX:8*(1-push),
  complete:seconds>=t.takeoff,fullMap:seconds>=t.fullMap,
 };
};
export type OpeningState=ReturnType<typeof openingState>;
export const mapOpeningStyle=(state:OpeningState):React.CSSProperties=>state.fullMap?{
 position:'absolute',left:0,top:0,width:1080,height:1920,overflow:'hidden',borderRadius:0,
}: {
 position:'absolute',left:0,top:state.mapTop,width:1080,height:state.mapHeight,
 transformOrigin:`540px ${state.mapOriginY}px`,
 transform:`perspective(1800px) rotateY(${state.mapRotateY}deg) rotateX(${state.mapRotateX}deg) scale(${state.mapScale})`,
 opacity:state.mapOpacity,borderRadius:state.mapRadius,overflow:'hidden',
 boxShadow:`0 45px 110px rgba(56,62,104,${.27*state.mapShadow})`,
};
export const ticketOpeningStyle=(state:OpeningState):React.CSSProperties=>({
 left:109,top:state.ticketTop,opacity:state.ticketOpacity,
 transform:`perspective(1800px) rotateX(${state.ticketRotateX}deg) scale(${state.ticketScale})`,
 transformOrigin:'50% 50%',filter:`blur(${state.ticketBlur}px)`,
});
