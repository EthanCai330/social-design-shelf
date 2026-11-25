---
id: nebula-flow-border
title: "星云流光边框 Nebula Flow Border"
category: surface
styles: [fluid, noir]
input: none
viewport: both
status: draft
---

# 星云流光边框 Nebula Flow Border

- **风格**：流体渐变 / 暗黑奢华
- **来源**：用户提供的提示词 · 收录于 2026-11-25
- **适用场景**：AI 创作结果、梦境/艺术类产品、暗色主题的大卡片

> 原始提示词：Nebula flow border, conic gradient inspired pattern, cosmic gaseous edge, purple-cyan-pink nebula colors, soft interstellar shimmer, organic light movement, dreamlike UI frame.

## 行为

边框由**多团气态色斑**构成，像星云气体在缓慢流动、彼此混合。
不是清晰的色带，而是柔和、有层次的雾气感。整体缓慢匀速移动，带有轻微的"呼吸性"明暗变化。

与「多色渐变流光边框」的区别：
- 多色流光 = 清晰的彩虹色带环绕（锐利）
- 星云 = 柔和色雾交融（有机、无边界）

## 时长与曲线
- 色雾漂移：`20000~30000ms`，`linear`，每个色团速度与方向各不相同
- 整体色相漂移：`30000ms`，缓慢旋转
- 呼吸：`6000ms`，`ease-in-out`，整体透明度 `0.7 ↔ 0.95`

## 视觉

**推荐实现：多层 radial-gradient 叠加 + 容器旋转**

```css
.nebula-frame {
  position: relative;
  border-radius: 24px;
  padding: 1.5px;
  overflow: hidden;
  background: #0B0B10;
}
.nebula-frame::before {
  content: '';
  position: absolute;
  inset: -60%;                      /* 放大以覆盖旋转时的角落 */
  background:
    radial-gradient(circle at 30% 30%, #7B3FE4 0%, transparent 45%),
    radial-gradient(circle at 70% 25%, #00C2FF 0%, transparent 42%),
    radial-gradient(circle at 65% 75%, #FF4FA8 0%, transparent 45%),
    radial-gradient(circle at 25% 70%, #3F5AE4 0%, transparent 40%),
    #0B0B10;
  filter: blur(18px);
  animation: drift 24s linear infinite, hue 30s linear infinite;
}
@keyframes drift {
  0%   { transform: rotate(0deg)   scale(1); }
  50%  { transform: rotate(180deg) scale(1.08); }
  100% { transform: rotate(360deg) scale(1); }
}
@keyframes hue {
  to { filter: blur(18px) hue-rotate(360deg); }
}
/** 挖空内部 */
.nebula-frame::after {
  content: '';
  position: absolute;
  inset: 1.5px;
  border-radius: 22.5px;
  background: rgba(11, 11, 16, 0.94);
  backdrop-filter: blur(20px);
}
```

关键点：
- **`inset: -60%` 必须放大**。旋转时边角会露空，不放大就会看到边框断口
- **`filter: blur()` 是灵魂**。不模糊的话就是普通的 4 色 conic 渐变，没有"气态"感
- 色团数量 `3~5` 个最佳，多了会糊成一团灰
- **色彩三原色固定**：紫 `#7B3FE4`、青 `#00C2FF`、粉 `#FF4FA8`，这是星云感的核心配色。

## 细节与反例

- **必须有 blur**。没有模糊就没有气态感，会退化成普通渐变边框。
- **转的不是渐变而是容器**。让整个 `::before` 旋转，而不是改 gradient 角度，
  因为 radial-gradient 的色团位置才是"星云"形状的来源。
- **别做快**。星云动得慢才像宇宙，任何小于 15s 的周期都会变成"彩色漩涡"。
- **深色底是硬前提**。浅色背景上这个效果完全失效。
- 内部面板必须接近不透明（`0.92~0.96`），否则色雾会透进来干扰内容阅读。

## 降级
- `prefers-reduced-motion`：冻结旋转，保留静态的星云渐变
- 低端设备：`blur` 从 18px 降到 10px，色团从 4 个减到 3 个
- 不支持 `filter`：用预先模糊好的图片资源代替

## 复刻提示词

见 [SKILL.md](../SKILL.md#6-合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
