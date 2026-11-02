# 上海浦东 → 巴黎：独立矢量飞行预览

预览：`http://localhost:3000/ShanghaiParisVectorFlight`

2026-11-02 更新：本镜头的地图、相机、飞机投影与渲染等待逻辑已扩展接入 `Europe7DayInteractive`，独立预览继续保留。完整七日路线与验收见 [欧洲全片实现与验收](欧洲全片实现与验收.md)。下文记录独立预览本身的设计与验证。

## 使用与编辑

```bash
npm install
npm run dev
```

选择 `ShanghaiParisVectorFlight`。在 Composition 的 Default Props 编辑起终点经纬度、飞行秒数、起飞/巡航/抵达 zoom、飞机尺寸、蓝色航迹颜色/像素宽度、飞机画面位置比例、标签开关和相机俯仰。也可在 JSON 中修改。飞机位置默认 `[0.5, 0.57]`。修改飞行时长后，`calculateMetadata` 自动更新总时长；巴黎衔接额外占 10 秒。

默认规格：1080×1920、30fps。默认时间线：

| 时间 | 内容 |
| --- | --- |
| 0–22 秒 | 浦东机场起飞、大圆航线巡航、抵达戴高乐机场 |
| 22–23.5 秒 | 机场停稳、飞机及跨洲航迹淡出 |
| 23.5–29.5 秒 | 独立市内相机移动，由机场衔接巴黎市区 |
| 29.5–32 秒 | 埃菲尔铁塔景观翻起 |

飞机不会飞到铁塔。市内段是相机移动示意，不代表道路导航或真实驾车路线；修改终点为其他城市时，巴黎市内尾段仍需另行修改。

## 地图与时间

- MapLibre GL JS + OpenFreeMap Liberty 矢量数据，无需 API Key。保留米白陆地、浅蓝水系、少量暖色主干道；移除卫星影像、地形、3D 建筑、POI、道路盾牌及密集小字。
- 配色文件：`public/maps/openfreemap-flight.json`。上游原样式另存 `openfreemap-liberty-original.json`，便于比对。
- 本地 worker 与实际安装版本一并保存于 `public/vendor/`；升级 MapLibre 时必须同时更新 worker 文件。
- 起点 `[121.8183,31.1303]`，终点 `[2.555,49.0097]`，铁塔 `[2.2945,48.8584]`，均为 `[经度, 纬度]`。
- Turf `greatCircle` 生成约 9268 km 的地理大圆，`along`、`lineSliceAlong`、`bearing` 分别读取位置、已飞航迹及方向。它不是实际航班空管航路。
- 单调三次 Hermite 曲线控制沿线速度与缩放，中间关键帧保持一阶连续；任意帧可直接求值，不需要播放历史。
- `jumpTo` 按帧更新同一张地图。padding 留出前方视野；飞机方向来自投影后的航线切线，飞机、机场定位、铁塔始终使用同一 MapLibre 投影。
- 全部运动由 `useCurrentFrame()/fps` 决定；没有 `flyTo`、动画定时器或用于驱动时间的 `requestAnimationFrame`。地图内部的 WebGL 绘制循环不承担视频计时。
- `fadeDuration:0`、关闭交互、保留绘图缓冲。初始化与每帧均等待地图 idle、瓦片及样式就绪；叠加层等待 React 提交。PBF 资源最多重试 4 次，耗尽后明确失败并中止渲染。

## 渲染与验证

```bash
npm run lint
node scripts/validate-vector-flight.mjs
npx remotion render src/index.ts ShanghaiParisVectorFlight out/shanghai-paris-vector-preview.mp4 --gl=angle --concurrency=1 --port=3105 --timeout=120000
```

测试环境使用本机 Chrome，因此导出时额外传入：

```text
--browser-executable='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
```

单独的 3105 渲染端口避免与当前 Studio 的 3000 端口发生 IPv4/IPv6 绑定冲突。`validate-vector-flight.mjs` 需要支持 TypeScript 类型剥离的 Node（本机 Node 25）；老版本可用支持 TS 的执行器运行等效检查。

本次验证记录：

- `npm run lint` 通过；曲线检查覆盖 661 帧，验证真实机场端点、大圆距离、位置单调、关键帧速度连续、逐帧方向/缩放连续和乱序跳帧一致性。
- 最终实时地图复核覆盖 0、30、90、180、330、480、600、660、720、810、900、940 帧，全部等待 idle 成功，无地图错误。飞行阶段飞机投影锚点 `[540,1094.4]`，抽查误差小于 1 px。
- `out/vector-flight-takeoff-test.mp4`：3 秒起飞测试，540×960、30fps。
- `out/shanghai-paris-vector-preview.mp4`：32 秒全流程测试快照，1080×1920、30fps、960 帧，包含机场抵达、飞机退出、市内移动和铁塔登场。
- 完成全流程导出后，进一步减少区域/城市小字并避免每帧重复修改静态样式；`out/vector-flight-cruise-validation.mp4` 额外复核最终样式的 9–14 秒巡航区间，1080×1920、30fps、150 帧。
- 全流程视频已解码检查 960 帧，无整帧平色空白；末尾静止段相邻帧平均像素差约 0.0015/255，未见地图抖动。逐帧数值审计不代替视觉检查：近景道路、起飞投影、航迹和巴黎衔接另有连续抽帧复核。没有因闪烁问题切换到固定图片方案。
- 冷加载后的抽查跳帧等待约 0.4–3.8 秒；实际逐帧导出遇到部分新瓦片需更长等待，仍先等加载完成再截帧。已保留明确失败路径，不承诺公共瓦片服务的实时帧率。

参考视频已按 0.5 秒间隔提取连续画面，重点观察 7–18.5 秒的起飞、巡航、减速和地面衔接，检查图在 `previews/flight-reference/flight-continuous.jpg`。地图阶段截图保存在 `previews/vector-flight/`。

## 来源、联网与限制

配置和来源核对日期：2026-11-02。

- [OpenFreeMap 官方接入说明](https://openfreemap.org/quick_start/)
- [Liberty 官方样式](https://tiles.openfreemap.org/styles/liberty)
- [MapLibre jumpTo / project 等 API](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/)
- [Turf greatCircle](https://turfjs.org/docs/api/greatCircle)
- [OpenStreetMap 版权及数据许可](https://www.openstreetmap.org/copyright)
- [OpenMapTiles](https://openmaptiles.org/)

画面持续保留 OpenFreeMap、OpenMapTiles、OpenStreetMap 署名。本预览是实时在线矢量地图；新设备首次打开及导出需要网络，公共服务不保证可用性。字体、矢量瓦片数据与数据版本可能随上游更新；若需要逐像素可复现的长期离线渲染，应另行固化所需瓦片与字体快照并保留许可。改变真实经纬度后须重新检查瓦片、标签密度和缩放曲线；跨日期变更线路线当前明确报错，未静默截断。
