# Europe 7-Day — Remotion Studio

一套 1080×1920、30fps、72 秒的 Remotion 可交互项目。最终视觉基于冷白毛玻璃、浅色地图、红色路线和 2.5D 扁平建筑。

## 启动

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

## 真实 Google 地图

项目默认使用无网络依赖的浅色矢量地图占位层，以保证 Studio 可直接打开。正式制作时：

1. 使用 Google Maps Static API 导出对应构图的地图图像，并遵守 Google Maps Platform 服务条款与署名要求。
2. 将地图图像放入 `public/maps/`。
3. 在 Studio 中选中对应的 `Map · ...` 图层，通过资产控件替换 `src`；或直接修改该图层的 `src` 属性。

建议文件：`shanghai.png`、`eurasia.png`、`paris.png`、`barcelona.png`、`rome.png`、`vatican.png`、`europe.png`。

当前尚未接入 Google API。建筑及其动画不依赖 Key；之后接入地图时仍需根据真实地图视口校准航线、定位点和署名显示。

## 音频

`npm run audio` 会生成项目自有的 120 BPM 简约电子背景音乐和基础转场音效，文件位于 `public/audio/`。可在 Studio 时间线中替换为最终授权音乐。

## 视觉参考

最终分镜位于 `public/reference/storyboard-v3.png`。
