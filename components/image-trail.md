---
id: image-trail
title: "图片拖尾 Image Trail"
category: motion
styles: [noir]
input: pointer
viewport: desktop
status: draft
---

# 图片拖尾 Image Trail

- **风格**：暗黑奢华
- **来源**：[ReactBits](https://reactbits.dev/animations/image-trail) · 收录于 2026-11-25
- **许可**：⚠️ ReactBits 采用 **MIT + Commons Clause**：可免费用于个人与商业项目，但**不得将本组件作为竞品组件库转售**。本条目收录的是技术规格与参数，不是源码。
- **适用场景**：作品集、摄影站、品牌页的鼠标交互区

> 光标划过处，一串图片依次浮现又淡出，形成"视觉足迹"。

## 行为

光标移动时，按**位移阈值**决定是否"掉落"一张新图：
- 光标累计移动超过 `threshold`（默认 `80px`）→ 在当前位置生成一张图
- 图片以 z-stack 方式堆叠，最新的在最上
- 每张图有自己的生命周期，到时间后淡出

不是"拖尾的粒子"，而是**离散的图片序列**——这是它与 Cursor Trail 的区别。

## 时长与曲线

- 生成阈值：每移动 `80px` 触发一次
- 单张图片生命周期：约 `1000~1400ms`
- 淡出：`400ms`，`ease-out`
- 进入：从 `scale(0.6)` + `opacity: 0` 到 `scale(1)` + `opacity: 1`，`300ms`，`cubic-bezier(0.22, 1, 0.36, 1)`

## 视觉

来自 ReactBits 的默认参数：

| 参数 | 默认值 | 说明 |
|---|---|---|
| `size` | `190px` | 每张图的宽度 |
| `aspectRatio` | `1.1` | 宽高比（width / height） |
| `radius` | `15px` | 圆角 |
| `threshold` | `80px` | 触发新图的位移阈值 |

- 图片**居中于光标位置**（`translate(-50%, -50%)`）
- 新图 `z-index` 最高，旧图逐渐下沉
- 可选 `tilt` 参数：朝出现方向做 3D 倾斜（`0~15deg`）
- 可选 `stack` 参数：保留 N 张图堆叠不消失（而不是逐张淡出）

## 实现要点

**ReactBits 原始实现依赖 GSAP**（`gsap@^3.13.0`）。如果要零依赖，用原生方案：

```js
let lastX = 0, lastY = 0;
const THRESHOLD = 80;

function onPointerMove(e) {
  const dx = e.clientX - lastX, dy = e.clientY - lastY;
  if (Math.hypot(dx, dy) < THRESHOLD) return;   // 未达阈值，不生成
  lastX = e.clientX; lastY = e.clientY;
  spawnImage(e.clientX, e.clientY, Math.atan2(dy, dx));
}
```

**关键**：
- 用**累计位移**判断，不是"每次移动都生成"——否则快速滑动会瞬间生成几百张，直接卡死
- 生成后要**复用 DOM 节点**（对象池），不要无限创建/销毁
- 同时存在的图片数要设上限（如 `8~12` 张）

## 细节与反例

- **阈值太小会拖垮性能**。`80px` 是个经验值，低于 `40px` 在快速滑动时会生成过多。
- **必须设同时存在上限**。否则长时间移动会让 DOM 无限增长。
- **图片要预加载**。首次拖尾时如果图片还在加载，会出现空白方块。
- **不要在内容密集区用**。会遮挡正文，破坏可读性。
- **移动端不要做**。手指自带遮挡，拖尾完全看不见，而且没有 hover 概念。
- **z-index 顺序很重要**。新图必须压住旧图，否则看起来"从下面钻出来"。

## 降级
- `prefers-reduced-motion`：禁用，或用极简版本（只在点击时弹一张）
- 触屏设备（`input: pointer` 不可用）：禁用
- 低端设备：减少同时存在的图片数，缩短生命周期

## 复刻提示词

见 [SKILL.md](../SKILL.md#6-合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
