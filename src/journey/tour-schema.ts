import {z} from 'zod/v3';
export const tourSchema=z.object({
  section:z.enum(['full','paris','paris-stage','barcelona','rome']).describe('预览分段'),
  playbackSpeed:z.number().min(.25).max(4).describe('画面速度（音乐保持原速；编排节奏默认 1）'),
  planeSize:z.number().min(70).max(320).describe('飞机尺寸'),
  tramSize:z.number().min(60).max(240).describe('电车尺寸'),
  tramArtBearing:z.number().describe('电车车头相对路线的方向偏移，0 为沿前进方向'),
  flightColor:z.string().describe('飞行航迹颜色'),groundColor:z.string().describe('已行驶路线颜色'),
  routeWidth:z.number().min(2).max(24).describe('路线像素宽度'),cameraPitch:z.number().min(0).max(45).describe('地图俯仰基准'),anchorY:z.number().min(.4).max(.7).describe('画面构图高度基准'),
  showLabels:z.boolean().describe('城市地名开关'),musicVolume:z.number().min(0).max(1).describe('音乐音量'),posterHoldSeconds:z.number().min(3).max(30).default(12).describe('终章海报稳定停留秒数'),
  stops:z.array(z.object({id:z.string(),name:z.string().describe('景点名称'),city:z.string(),day:z.number().min(1).max(7),date:z.string().describe('日期标签'),longitude:z.number(),latitude:z.number(),image:z.string().describe('建筑 PNG（public 相对路径）'),airport:z.boolean(),zoom:z.number().min(10).max(18).describe('地点缩放'),holdSeconds:z.number().min(0).max(30).describe('景点停留秒数'),size:z.number().min(150).max(1100).describe('建筑尺寸'),revealDelay:z.number().min(0).max(3).describe('建筑登场延迟'),offsetX:z.number().describe('建筑与接触阴影横向偏移'),offsetY:z.number().describe('建筑与接触阴影纵向偏移'),aspect:z.number().min(.3).max(3).describe('素材原始宽高比'),groundX:z.number().min(0).max(1).describe('底座中心 X / 图片宽度'),groundY:z.number().min(0).max(1).describe('底座中心 Y / 图片高度'),groundWidth:z.number().min(.1).max(1).describe('底座接触阴影宽度比例'),pitch:z.number().min(18).max(56).describe('本景点展示俯仰'),heading:z.number().describe('本景点地图观察方向'),heroY:z.number().min(.4).max(.8).describe('建筑锚点画面高度'),subtitle:z.string().describe('景点短字幕')})).describe('逐个地点 · 名称、日期、位置、底座、视角和停留时间'),
  legs:z.array(z.object({id:z.string(),kind:z.enum(['flight','tram']),from:z.string(),to:z.string(),seconds:z.number().min(1.2).max(60).describe('本交通段秒数'),day:z.number().min(1).max(7),cruiseZoom:z.number().min(2).max(10).describe('飞行巡航缩放')})).describe('逐段交通 · 飞机、电车和机场接驳时长'),
});
