# 贡献指南

感谢你的兴趣。这个库的价值在于**参数可信、可复刻**，所以门槛比一般的设计收藏高。

## 一个条目值不值得收

通过以下全部才收：

1. **可参数化**：能翻译成具体数值（hex、ms、px、cubic-bezier、spring 参数）。
   只有"高级感""很舒服"这类形容词的不收。
2. **有可辨识的机制**：一个可交互元素，或一种明确的视觉处理。整页照搬不收。
3. **不是已有条目的重复**：同一交互机制已在库中，应更新原条目并追加迭代记录，而非新建。
4. **你能说清"反例"**：知道它最容易做错的地方在哪。说不出的，说明还没理解透。

## 提交前必须自检

运行：

```bash
python validate.py      # 必须 0 错误
python build-index.py   # 重建 INDEX.md
python build-index.py --check   # 必须一致
```

`validate.py` 会检查这些**最容易犯的错**：

| 检查项 | 说明 |
|---|---|
| 衰减方向 | "越近越强"必须写 `1 - d/R`，写成 `d/R` 会在边界跳变 |
| 圆角插值 | `999px` 会被 clamp 到半高，动画要从 `高度/2` 插值 |
| 过冲与曲线 | `cubic-bezier(x1,y1,x2,y2)` 只有 y 控制点 >1 才过冲 |
| spring 完整性 | 有 stiffness 必须有 damping 与 mass |
| 跟手矛盾 | "1:1 跟手"和"带阻尼系数"不能同时写 |
| 必备章节 | 行为 / 时长与曲线 / 视觉 / 细节与反例 |
| 降级方案 | 必须提及 `prefers-reduced-motion` 与触屏/桌面退化 |

## 新增一个条目

1. 复制 `components/_template.md` 为 `components/<kebab-case-slug>.md`。
2. `id` 必须等于文件名（不含 `.md`）。
3. 填 frontmatter：

```yaml
---
id: your-slug
title: "中文名 English Name"
category: motion          # motion | depth | expand | data | gesture
styles: [quiet]           # quiet | noir | glass | swiss | oriental | fluid
input: pointer            # pointer | touch | both | none
viewport: mobile          # mobile | desktop | both
status: draft             # draft | verified
---
```

4. 写正文六个章节，`## 复刻提示词` 保留占位即可，**不要**在那里复述正文数值。
5. 运行上面的校验命令。
6. `status` 只有在你有可运行原型验证过之后才改成 `verified`。

## 关于 `category` 与 `styles`

这是两个**正交**维度，不要混用：

- `category` 决定条目在 `INDEX.md` 的分组，**单选**，看"核心是什么"。
- `styles` 只是标签，**多选**，看"长什么样"。

一个磁吸按钮可以 `category: motion` 同时 `styles: [noir, quiet]`。

## 修改 showcase 的视觉层

`showcase/index.html` 是单文件，但内部有清晰的**两层分离**：

| 层 | 内容 | 是否可改 |
|---|---|---|
| 视觉层 | `<style>` 全部内容 + `<body>` 到 `<script>` 之前的头部结构 | ✅ 可自由重写 |
| 交互层 | `<script>` 内 28 个组件的动画实现、筛选、搜索 | ❌ **不要改** |

**必须保留的 DOM 契约**（JS 依赖，改名字会导致功能失效）：

| 选择器 | 用途 |
|---|---|
| `#grid` | 组件网格容器，JS 往里 append 卡片 |
| `.grid-wrap` | `#grid` 的父容器，JS 往里插空状态提示 |
| `.page-head` | 页头，JS 往里 append 筛选栏 |
| `.tile` | 每张卡片，JS 设置 `data-cat` / `data-title` |
| `.tile-cap` `.tile-cap .n` `.tile-cap .t` `.tile-cap .s` | 编号 / 标题 / 风格标签 |
| `.phone` | 手机外框，**`aspect-ratio: 390/620` 不能改** |
| `.phone.dark` | 暗色变体 |
| `.stage` | 组件舞台，**`position:relative; overflow:hidden` 必须保留** |
| `.tile-meta` `.cat-tag` | 分类标签 |
| `.chip` `.chip.on` `.chip .cnt` | 筛选按钮 |
| `.search` `.filter-bar` `.filter-info` `.empty-hint` | 筛选与搜索 |

改完视觉层后**必须跑交互回归**，确认 28 个组件仍可用：

```bash
node tools/test-showcase.cjs      # 需要先启动带 --remote-debugging-port 的 Chrome
node tools/test-filter.cjs
```

### 为什么要用 `.stage` 驱动测试

组件的坐标计算依赖 `.stage` 的尺寸。如果你改了 `.phone` 的 `aspect-ratio` 或给 `.stage`
加了 padding / grid 布局，手势类组件（下拉展开、滑动操作、玻璃抽屉、跟手放大）的坐标会错位。
测试会抓出来，但最好一开始就别动。

## 不要做的事

- **不要手改 `INDEX.md`**，它是 `build-index.py` 的派生产物。
- **不要提交他人截图**。`references/` 已被 `.gitignore` 排除，只放外链记录或你自己录制的素材。
- **不要提交 `taste-profile.md`**，那是私人文件。
- 不要在条目里写"或""可选"这类分支，规格必须唯一。

## 提交 PR

- 标题格式：`feat(component): 新增 <slug>` 或 `fix(component): 修正 <slug> 的 <问题>`
- 描述里说明：来源链接（如可公开）、你验证用的原型或环境、改动的关键参数。
- CI 会跑 `validate.py` 和 `build-index.py --check`，不通过不会合并。
