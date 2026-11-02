# Europe 7-Day — Remotion Studio

一套 1080×1920、30fps、72 秒的 Remotion 可交互项目。最终视觉基于冷白毛玻璃、浅色地图、红色路线和 2.5D 扁平建筑。

## 启动

新增独立的 OpenFreeMap + MapLibre 飞行测试：在 Studio 中选择 `ShanghaiParisVectorFlight`，查看真实地理位置的“上海浦东机场 → 巴黎戴高乐机场 → 巴黎市区 → 埃菲尔铁塔”。尚未接入主片。可在 Composition 的 Default Props 编辑起终点、时长、缩放、飞机、航迹及相机参数。详细实现、渲染方式和联网限制见 [OpenFreeMap 飞行预览](docs/OpenFreeMap飞行预览.md)。

`npm run check:flight` 检查航线和相机曲线；`npm run render:flight` 仅导出独立飞行预览。

```bash
npm install
npm run audio
npm run dev
```

主合成：`Europe7DayInteractive`

## Studio 编辑方式

- 主时间线分为 12 个已命名场景，每个场景同时注册为 Connected Composition。
- 双击场景即可进入独立时间线。
- 地图、路线、飞机、定位点、信息卡、消息气泡、苹果信息图标、建筑、标题、照片卡和烟花均为独立图层。
- 选中图层后可在 Studio 中移动、缩放、旋转或调节透明度。
- 已存在的 `interpolate()` 动画会显示为关键帧；也可以把播放头放到指定帧后添加或修改关键帧与缓动。

## V3 建筑素材（已接入）

8 座建筑已替换为带石质底座、树木、花坛、路灯和座椅的完整 C4D 风格景观 PNG，成品保存在 `public/landmarks/dioramas/`。它们是二维渲染素材，不是 `.c4d` 三维模型。城市镜头、8 张旅行手记卡、终章 4 张行程卡和 4 座前景建筑共 24 处均引用完整景观。此前的裸建筑素材保留在 `public/landmarks/`，未删除。

- 每个目的地的建筑、底座及装饰绿化作为一套完整景观，整套可独立移动、缩放、旋转和编辑翻起关键帧；外置落地阴影、定位点、名称标签继续分别为独立图层。
- 选中 `Landmark · ...` 或 `Final Landmark · ...`，在右侧 Source 点击铅笔 / Change source 更换图片；选择命名的外层，不要选择组件内重复使用的 `<Img>`。
- 在 Controls 的“翻起角度 X（度）”设置关键帧：约 `-78` 度为贴地，`0` 度为完整立起；建筑图片本身已包含俯视透视。
- 位移、缩放、旋转和透明度在 Transform 中独立编辑；播放头停在指定帧后点击菱形添加关键帧。
- 选中 `Card · ...` 或 `Final Card · ...`，可更换图片，并编辑城市和行程文字。
- 如果把建筑移动到新位置，请同时选中对应的 Shadow、Pin、Caption 图层一起移动，或在 Studio 中将这一组预合成。
- 苹果信息图标也已成为 `Icon · Apple Messages` 独立图层。

素材清单和替换说明见 `docs/建筑素材与替换指南.md`；本轮底座及绿化的生成提示词见 `docs/景观底座生成记录.md`。主时间线检查点：巴黎 00:19、巴塞罗那 00:36、罗马 00:51、梵蒂冈 00:56、旅行手记 01:01、终章 01:08。

## 真实地图（已接入）

10 个地图图层均使用本地真实地图素材，位于 `public/maps/`：

- 上海与上海展开：高德静态地图接口，1080×1920。
- 巴黎、巴塞罗那、罗马和梵蒂冈：Esri World Street Map 街道底图，1080×1920。当前高德 Key 的静态接口对巴黎返回空白，因此欧洲城市使用此来源。
- 欧亚航线、法国西班牙、地中海和欧洲终章：Natural Earth 真实海岸线和国界数据，按 Web Mercator 视口生成 SVG。
- 三段飞行的起点、终点、航线与飞机位置统一由城市经纬度计算。城市建筑插画沿用原有展示布局，属于示意插画，并非建筑坐标定位。

地图署名独立显示，不随地图缩放或淡出而被裁切。来源、视口和数据授权说明保存在 `public/maps/SOURCES.json`。Natural Earth 原始数据保留在 `public/maps/data/`。

普通播放和视频导出不需要联网，也不会把 API Key 带入前端。需要更新底图时，在本地 `.env.local` 中设置 `AMAP_KEY`（必须为高德 Web 服务类型；文件已被 Git 忽略），再运行：

```bash
npm run maps
```

更新脚本使用 Python 3 标准库，只向高德发送 `AMAP_KEY`，并保留地图本地缓存。可在 Studio 中通过地图图层的 Source 更换本地地图图片；调整地图视口时，同步更新 `scripts/generate-maps.py` 与 `src/components/GeographicFlight.tsx` 的视口参数，以保证飞行路径位置正确。

## 音频

`npm run audio` 会生成项目自有的 120 BPM 简约电子背景音乐和基础转场音效，文件位于 `public/audio/`。可在 Studio 时间线中替换为最终授权音乐。

## 视觉参考

最终分镜位于 `public/reference/storyboard-v3.png`。

## 编辑地点标签和首屏气泡

时间线底部有五个“地点登场”独立图层。选中后在右侧 Controls 中编辑地点文字、内置图标（定位针 / 飞机 / 旗帜）、自定义图标图片、图标大小和颜色、文字字号和颜色，以及字体。自定义图片使用图片本身的颜色，图标颜色控件只影响内置矢量图标。Transform 可移动、缩放和旋转整个标签。

标签入场后持续保持，跨转场至下一站开始才切换；梵蒂冈标签在旅行手记总结段开始时结束。地点下方的行程小字已移除。首屏使用 `src/on-screen-messages.element.tsx` 的 On-Screen Messages 效果，两条气泡统一为 54px、600 字重和同一中文字体栈。

## 飞行镜头与到达聚焦

三个飞行片段使用 `GeographicFlight`：起飞时地图从近景拉远，航线从当前城市逐段绘制，镜头与飞机跟随同一条贝塞尔曲线，抵达后居中衔接目的地街道图。城市镜头先用 1.2 秒从 1.05 倍拉近至 1.8 倍，再开始原有的建筑翻起动画。全部运动由 Remotion 帧数驱动，不使用实时 CSS 动画。

在 Studio 中选择“飞行镜头”可调整起飞、巡航和抵达倍率。加宽的 `*-camera.svg` 避免镜头平移时露出底图边缘，可通过 `npm run maps` 重新生成。城市底图以目的地真实经纬度为中心，并缓存对应的视口参数。
