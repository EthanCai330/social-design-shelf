---
id: gooey-effect
title: "黏性融合 Gooey Effect"
category: effect
styles: [quiet, fluid]
input: both
viewport: mobile
status: draft
---

# 黏性融合 Gooey Effect

**替代说明**：原文标题误写为「黏性融合 Gooey Effect」，正确英文为 **Gooey Effect**（黏性/胶状效果）。

- **风格**：静谧极简 / 流体渐变
- **来源**：用户提供的提示词 · 收录于 2026-11-25
- **适用场景**：底部导航切换、Tab 指示器、气泡式选择器

> 原始提示词：Gooey Effect：像液滴一样拉伸、连接、再融合。导航切换时从旧位置拉伸至新位置，中间形成液态连接，再收缩成圆角胶囊。

## 行为

导航切换时，指示器（如胶囊或圆点）从旧位置**拉伸**向新位置，
两个位置之间形成一条**液态连接**（像口香糖被拉长），最终在新位置**收缩**成圆角胶囊。
旧位置的残余部分被吸走，不留痕迹。

## 时长与曲线
- 总时长：`420~520ms`
- 时间分配（这个比例很重要）：
  - `0~40%`：拉伸（旧位置保留部分质量，新位置出现）
  - `40~75%`：连接（中间形成黏性桥）
  - `75~100%`：收缩（桥断开，只剩新位置）
- 缓动：`cubic-bezier(0.4, 0, 0.2, 1)`，有"吸附"感但不是弹跳

## 视觉

**实现路线：SVG filter gooey（最常用）**

```html
<svg class="goo-defs"><filter id="goo">
  <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"/>
  <feColorMatrix in="blur" mode="matrix"
    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo"/>
</filter></svg>
```
```css
.goo-container {
  filter: url(#goo);
  background: transparent;
}
/* 内部元素自动产生融合效果 */
.goo-blob { background: #111; border-radius: 999px; }
```

关键参数：
- `stdDeviation` 控制"黏度"：取元素尺寸 × **0.06**（实测最佳比例）
- `feColorMatrix` 最后一行的 `18 -7`（或 `20 -10`）是阈值：`alpha × 18 - 7`，
  把模糊后的半透明区域"切"成实心，于是相邻元素自然融合
- **更陡（如 `24 -9`）融合更早但会爆边；更平（如 `12 -4`）永远连不上**
- 容器与内部元素都必须是**纯色或同色**，否则融合效果失效

### ⚠️ 最关键的一条：filter 必须包住整组

把 filter 加在**每个 blob** 上**完全无效**——这是让人误以为这个效果做不了的经典错误。

原理：重叠的模糊边缘会累加成比单个更高的 alpha，对比步骤才能把它们"吸附"成一个连通形状。
如果每个 blob 单独过滤，各自在自己内部完成锐化，永远不会融合。

```html
<!-- ❌ 错误：filter 加在每个 blob 上 -->
<span style="filter:url(#goo)"></span>
<span style="filter:url(#goo)"></span>

<!-- ✅ 正确：filter 加在包住整组的父容器上 -->
<div style="filter:url(#goo)">
  <span></span>
  <span></span>
</div>
```

来源：[Klyv GooeyLoader 源码](https://raw.githubusercontent.com/Klyv-UI/klyv/main/src/components/GooeyLoader/GooeyLoader.tsx)

### 纯 CSS 替代（更稳，跨浏览器）

```css
.gooey-container { filter: contrast(10) blur(6px); }   /* 父容器只设 contrast */
.blob { filter: blur(4px); }                            /* 小球只设 blur */
```

`blur + contrast` 分层组合是**唯一稳定跨浏览器的纯 CSS metaball 方案**：
小球仅设 `blur`，父容器仅设 `contrast`，容器需 `overflow: hidden`。

**不要用 Canvas 逐像素 metaball**——过时且难实现，纯 CSS 就够了。

## 细节与反例

- **`feColorMatrix` 的阈值是灵魂**。调不对就会变成"模糊的圆"而不是"融合的液体"。
- **元素必须同色**。多色元素用 gooey 会串色。
- **不要在小区域做**。黏性效果需要空间拉伸，太小的容器看不出"拉丝"。
- **移动端 iOS Safari 性能需实测**。SVG filter 在部分机型上很吃 GPU，
  切换频繁的底部导航可能掉帧。
- 这个效果容易"过度炫技"。底部导航切换用一次很惊艳，每个交互都用就腻了。

## 降级
- `prefers-reduced-motion`：直接用 200ms 位移切换，不做黏性
- 性能不足：退化为普通的宽度/位置过渡（`cubic-bezier` 即可）
- 不支持 SVG filter：同上

## 复刻提示词

见 [SKILL.md](../SKILL.md#6-合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
