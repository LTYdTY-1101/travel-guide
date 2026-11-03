import type React from 'react';
import {Interactive} from 'remotion';
import {ticketOpeningStyle,type OpeningState} from '../opening/opening-state';

type Props = {readonly style?: React.CSSProperties; readonly domestic?: boolean;readonly opening?:OpeningState;readonly mapReady?:boolean};

/** The card and every information block remain separate selectable Studio layers. */
export const FlightTicket: React.FC<Props> = ({style, domestic = false,opening,mapReady=true}) => (
  <Interactive.Div name="机票 · 整体" data-opening-ticket={opening?true:undefined} data-opening-push={opening?.push} data-ticket-visual-top={opening?.ticketVisualTop} style={{position: 'absolute', width: 862, height: 515, ...style,...(opening?ticketOpeningStyle(opening):{}),visibility:mapReady?undefined:'hidden'}}>
    <Interactive.Div name="机票 · 白色票面" style={{position: 'absolute', inset: 0, borderRadius: 34, background: 'rgba(255,255,255,.97)', boxShadow: '0 30px 72px rgba(56,80,108,.22)', border: '1px solid rgba(255,255,255,.9)'}} />
    <Interactive.Div name="机票 · 顶部标签" style={{position: 'absolute', left: 54, top: 39, color: '#8d9aa9', fontFamily: 'Arial, sans-serif', fontSize: 23, fontWeight: 800, letterSpacing: 7}}>HOLIDAY FLIGHT</Interactive.Div>
    <Interactive.Div name="机票 · 航班号" style={{position: 'absolute', right: 51, top: 35, color: '#5b9dd8', fontFamily: 'Arial, sans-serif', fontSize: 27, fontWeight: 800}}>{domestic ? 'CHINA 07' : 'EUROPE 07'}</Interactive.Div>
    <Interactive.Div name="机票 · 出发城市" style={{position: 'absolute', left: 54, top: 113, color: '#172b43', fontFamily: 'PingFang SC, Arial, sans-serif', fontSize: 53, fontWeight: 850}}>上海 <span style={{color: '#94a5b5', fontSize: 27}}>PVG</span></Interactive.Div>
    <Interactive.Div name="机票 · 目的城市" style={{position: 'absolute', right: 54, top: 113, color: '#172b43', fontFamily: 'PingFang SC, Arial, sans-serif', fontSize: 53, fontWeight: 850, textAlign: 'right'}}>{domestic ? '三亚' : '巴黎'} <span style={{color: '#94a5b5', fontSize: 27}}>{domestic ? 'SYX' : 'CDG'}</span></Interactive.Div>
    <Interactive.Div name="机票 · 航线符号" style={{position: 'absolute', left: 376, top: 116, color: '#589bda', fontFamily: 'Arial, sans-serif', fontSize: 49, fontWeight: 500}}>→</Interactive.Div>
    <Interactive.Div name="机票 · 时间与日期" style={{position: 'absolute', left: 54, right: 54, top: 213, display: 'flex', justifyContent: 'space-between', fontFamily: 'Arial, PingFang SC, sans-serif', color: '#10233d'}}>
      <div><div style={{fontSize: 26, color: '#9ba7b5', marginBottom: 9}}>DEPARTURE · 10/01</div><div style={{fontSize: 79, fontWeight: 900, lineHeight: 1}}>08:20</div></div>
      <div style={{textAlign: 'right'}}><div style={{fontSize: 26, color: '#9ba7b5', marginBottom: 9}}>ARRIVAL · LOCAL</div><div style={{fontSize: 79, fontWeight: 900, lineHeight: 1}}>{domestic ? '11:45' : '14:40'}</div></div>
    </Interactive.Div>
    <Interactive.Div name="机票 · 分隔线" style={{position: 'absolute', left: 54, right: 54, top: 378, borderTop: '2px dashed #d6e2ec'}} />
    <Interactive.Div name="机票 · 底部信息" style={{position: 'absolute', left: 54, right: 54, bottom: 40, display: 'flex', justifyContent: 'space-between', color: '#728398', fontFamily: 'Arial, PingFang SC, sans-serif', fontSize: 25, fontWeight: 700}}><span>{domestic ? '国内地点 · 欧洲建筑' : '国庆欧洲 7 日 · 3 座城市'}</span><span>PVG  →  {domestic ? 'SYX' : 'CDG'}</span></Interactive.Div>
  </Interactive.Div>
);
