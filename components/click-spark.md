---
id: click-spark
title: "点击火花 Click Spark"
category: motion
styles: [noir]
input: both
viewport: both
status: verified
---

# 点击火花 Click Spark

- **风格**：暗黑奢华
- **来源**：[ReactBits](https://reactbits.dev/animations/click-spark) · 收录于 2026-11-25
- **许可**：⚠️ ReactBits 采用 **MIT + Commons Clause**：可免费用于个人与商业项目，但**不得将本组件作为竞品组件库转售**。本条目收录的是技术规格与参数，不是源码。
- **适用场景**：按钮点击、图标点击、任何需要"有回应"的交互点

> 点击处放射出 8 道短线火花，向外飞出并淡出。

## 行为

点击瞬间，从点击位置向**8 个方向均匀**发射线段：
- 每条线从中心向外飞出 `sparkRadius`
- 同时长度收缩、透明度衰减到 0
- 全部消失后清理节点

与墨晕涟漪的区别：
- **涟漪** = 一圈同心圆扩散（柔和、连续）
- **火花** = 多条放射线段（锐利、离散、有冲击力）

## 时长与曲线

- 总时长：`400ms`
- 缓动：`ease-out`
- 8 条火花**同时发射**（不是错峰），形成瞬间爆开的感觉

## 视觉

来自 ReactBits 的默认参数：

| 参数 | 默认值 | 说明 |
|---|---|---|
| `sparkColor` | `#fff` | 火花颜色 |
| `sparkSize` | `10px` | 线段长度 |
| `sparkRadius` | `15px` | 向外飞出的距离 |
| `sparkCount` | `8` | 火花数量 |
| `duration` | `400ms` | 总时长 |
| `easing` | `ease-out` | 缓动 |
| `extraScale` | `1.0` | 额外的放大系数 |

**8 个方向的参考坐标**（距离 `sparkRadius`）：

```js
const SPARK_TOP    = -sparkRadius;
const SPARK_BOTTOM =  sparkRadius;
const SPARK_LEFT   = -sparkRadius;
const SPARK_RIGHT  =  sparkRadius;
const SPARK_UP_LEFT    = [-sparkRadius * 0.7, -sparkRadius * 0.7];
const SPARK_UP_RIGHT   = [ sparkRadius * 0.7, -sparkRadius * 0.7];
const SPARK_DOWN_LEFT  = [-sparkRadius * 0.7,  sparkRadius * 0.7];
const SPARK_DOWN_RIGHT = [ sparkRadius * 0.7,  sparkRadius * 0.7];
```

**纯 CSS 实现**（用 `--tx` / `--ty` 变量指定方向）：

```css
.spark {
  position: absolute;
  width: 2.5px;
  height: 2.5px;
  border-radius: 50%;
  background: var(--spark-color, #fff);
  animation: sparkOut 400ms ease-out forwards;
  pointer-events: none;
}
@keyframes sparkOut {
  0%   { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
}
```

```html
<span class="spark" style="--tx: 34px; --ty: -22px"></span>
<span class="spark" style="--tx: 0;    --ty: -40px"></span>
<span class="spark" style="--tx: -34px; --ty: -22px"></span>
<!-- ...共 8 个 -->
```

## 细节与反例

- **8 个方向必须均匀分布**。偏斜会看起来像"漏了几个方向"。
- **时长不要超过 500ms**。火花是"瞬间"的反馈，拖长就失去爆发感。
- **不要用 `box-shadow` 发光**。8 个元素 × blur 会明显掉帧，纯色小圆点就够。
- **必须 `pointer-events: none`**，否则火花会挡住下方的点击区域。
- **必须在动画结束后清理节点**。连续点击会累积大量 DOM。
- **不要和墨晕涟漪叠用**。两种反馈同时出现会互相干扰，选一个。
- **快捷键触发也要有反馈**。用键盘激活的元素（Enter / Space）也应该在同一位置产生火花。

## 降级
- `prefers-reduced-motion`：直接不生成火花，或用一次瞬时高亮代替
- 触屏：同样可用（点击位置明确），但要考虑手指遮挡——可以稍微上移生成点
- 低端设备：减少到 4 个方向

## 复刻提示词

见 [SKILL.md](../SKILL.md#6-合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
