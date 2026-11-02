# Europe 7-Day — Remotion Studio

当前完整主片是 `Europe7DayInteractive`：1080×1920、30fps、默认 **3 倍速**，1 分 25.7 秒（2570 帧）；原速为 4 分 17 秒。开场消息、GO 回复、机票和翻面转场保留，后续统一使用 OpenFreeMap + MapLibre 真实道路地图。包含七日 14 个独立景点、4 段机场间飞行、17 段道路交通示意、返回上海及回顾终章。

```bash
npm install
npm run dev
```

Studio 默认入口：[完整主片](http://localhost:3000/Europe7DayInteractive)。城市分段：[巴黎](http://localhost:3000/ParisTour)、[巴塞罗那](http://localhost:3000/BarcelonaTour)、[罗马 / 梵蒂冈](http://localhost:3000/RomeVaticanTour)、[回程](http://localhost:3000/ReturnToShanghai)。所有分段共用主片的地图、路线、交通与建筑实现。

在 Composition 的 Default Props 中可用 `playbackSpeed` 调整整体速度（默认 `3`，设为 `1` 恢复原速），并编辑各段时长、景点停留、交通工具尺寸、路线颜色与粗细、地图俯仰和缩放、名称日期、建筑尺寸 / 锚点偏移 / 登场时间。保存会写回 `src/Root.tsx`；地图和总时长自动重算。原有开场可继续选中命名图层编辑。各 Composition 的默认参数分别保存；修改主片后若希望分段同步，需要复制对应 Default Props，保留各自的 `section` 值。

```bash
npm run lint
npm run check:tour
```

完整地点表、交通来源、编辑说明、实际渲染验收和限制见 [欧洲全片实现与验收](docs/欧洲全片实现与验收.md)。地图播放和渲染需要联网，无需 API Key。地面路线依据真实 OSM 步行道路走廊绘制，有轨电车仅为统一交通示意，不代表现实运营线路。

已认可的独立 `ShanghaiParisVectorFlight` 继续保留，说明见 [OpenFreeMap 飞行预览](docs/OpenFreeMap飞行预览.md)。本轮前的主片、Root 和说明保存在 `docs/archive/`，旧静态地图素材保留作历史资源，当前完整主片不再引用。

本轮短段导出位于 `out/europe-tests/`；完整主片尚未导出。正式导出可运行 `npm run render -- --gl=angle --concurrency=1 --port=3105 --timeout=120000`。
