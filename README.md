# 欧洲旅行 · 六站音乐版

当前完整主片 `Europe7DayInteractive`：1080×1920、30fps、**1 分 51.1 秒**。默认速度已恢复为 1，逐段按参考配乐编排，音乐独立保持原速原调。

路线：上海浦东 → 巴黎（埃菲尔铁塔、巴黎圣母院）→ 巴塞罗那（巴特罗之家、米拉之家）→ 罗马 / 梵蒂冈（圣彼得大教堂、特莱维喷泉）。保留 3 段机场间飞行、8 段真实道路电车示意；喷泉后直接终章，无返程。日期沿用国庆周内的 D1、D2、D4、D6、D7，不把六站改成六天。

```bash
npm run dev
npm run lint
npm run check:tour
```

[完整主片](http://localhost:3000/Europe7DayInteractive) · [巴黎](http://localhost:3000/ParisTour) · [巴塞罗那](http://localhost:3000/BarcelonaTour) · [罗马 / 梵蒂冈](http://localhost:3000/RomeVaticanTour)。分段复用主片的相机、路线、景观和配乐时间位置。

Composition → Default Props 可编辑 `playbackSpeed`（只改变画面速度）、逐段时长、景点停留、地图缩放 / 倾斜 / 方向、建筑尺寸 / 底座锚点 / 构图高度 / 出现延迟、字幕和路线外观。默认速度 1 才是本轮音乐编排的观看速度；改变速度不会加速音乐，但会改变卡点关系。

原消息和机票设计继续保留，仍可选命名图层编辑。各 Composition 的 Default Props 独立保存；需要一致的自定义参数时，复制主片参数并保留城市各自的 `section`。

详见 [六站实现与验收](docs/欧洲全片实现与验收.md)。地图依赖联网；电车是沿 OSM 道路走廊的交通示意，不代表实际运营线路。既有资源和上一版源码保留在历史目录，当前主片不经过删除的景点。
