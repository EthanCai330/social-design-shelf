---
id: fade-to-transparent-glow-edge
title: "淡出透明 + 轻微发光 Fade-to-Transparent Glow Edge"
category: surface
styles: [quiet, glass]
input: none
viewport: both
status: draft
---

# 淡出透明 + 轻微发光 Fade-to-Transparent Glow Edge

- **风格**：静谧极简 / 玻璃拟态
- **来源**：用户提供的提示词 · 收录于 2026-11-25
- **适用场景**：高级卡片、设置面板、需要"轻"的玻璃层

> 原始提示词：Fade-to-transparent border edge, subtle glow effect, soft luminosity fading outward, ethereal minimal UI panel, gentle light leakage, clean modern glass card, semi-transparent boundary.

## 行为

边框不是实线，而是**从边缘向内/向外渐隐的柔和光**。边界"若有若无"，
光向外渗出一层极淡的光晕（light leakage），卡片内部保持干净通透。

无交互，静态或极慢呼吸。

## 时长与曲线
- 呼吸：`5000ms`，`ease-in-out`，光晕透明度 `0.35 → 0.55` 之间往返
- 若不做呼吸，完全静态也成立——这是本效果的高级之处：**不必动**

## 视觉

**双层实现：内描边渐隐 + 外发光**

```css
.ethereal-panel {
  position: relative;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.10),     /* 内描边，极淡 */
    inset 0 1px 0 rgba(255, 255, 255, 0.18),       /* 顶边高光，模拟受光 */
    0 0 32px rgba(180, 200, 255, 0.12),            /* 外发光，向外淡出 */
    0 8px 32px rgba(0, 0, 0, 0.10);                /* 落地阴影 */
}
```

**如果要真正的"渐隐边框"**（描边本身在某方向消失），用遮罩：
```css
.fade-border::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(180deg, rgba(255,255,255,.35), rgba(255,255,255,0));
  -webkit-mask: linear-gradient(#000, #000) content-box, linear-gradient(#000, #000);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}
```

关键点：
- **内高光**（`inset 0 1px 0`）是玻璃质感的核心，少了它就像普通的半透明矩形
- 外发光透明度不要超过 `0.15`，超过就变成"发光按钮"，破坏静谧感
- 光色建议略偏冷（`rgba(180,200,255,...)`），暖色会显得陈旧

### 进阶：镜面扫光（让边缘真的"被光照到"）

均匀描边是平的。真正的玻璃会沿**左上边缘**捕捉一道明亮扫光并衰减，
这是人脑读作"光下的曲面玻璃"的关键线索。

```css
.glass::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;                      /* 边框粗细 */
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.7),        /* 左上最亮 */
    rgba(255, 255, 255, 0) 40%,      /* 快速衰减 */
    rgba(255, 255, 255, 0) 60%,
    rgba(255, 255, 255, 0.25)        /* 右下微弱回光 */
  );
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;   /* 只留 1px 环 */
  pointer-events: none;
}
```

### 必须加 grain 消色带

大模糊叠在平滑渐变上会产生可见的**色带**（阶梯状等值线）。一层淡噪点能抖动掉它：

```css
.glass::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit;
  pointer-events: none; opacity: 0.04;          /* 不要超过 0.06 */
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

`opacity` 超过 `0.06` 就不是"抖动"而是"纹理"了。
来源：[web-animation-skills/glass-recipes](https://raw.githubusercontent.com/iart-ai/web-animation-skills/main/skills/glassmorphism/references/glass-recipes.md)

## 细节与反例

- **不要用 `border: 1px solid` 直接做**。实线边框没有"淡出"，必须用 box-shadow 或遮罩。
- **发光要向外淡出**，不能是均匀的 `box-shadow` 模糊圈——那看起来像廉价霓虹。
- **在深色背景上效果最好**。浅色背景上几乎看不见，需要把发光透明度提高约 2 倍。
- **克制**：整个页面同类玻璃层不应超过 2~3 个，多了就没有"轻"的感觉了。

## 降级
- `prefers-reduced-motion`：去掉呼吸，保持静态
- 不支持 `backdrop-filter`：改用 `rgba(255,255,255,0.10)` 实底 + 更强的内高光
- 浅色背景场景：发光透明度 ×2，并把光色改为中性白

## 复刻提示词

见 [SKILL.md](../SKILL.md#6-合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
