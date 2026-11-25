---
id: partial-neon-edge
title: "局部霓虹发光边缘 Partial Neon Edge"
category: surface
styles: [noir]
input: none
viewport: both
status: draft
---

# 局部霓虹发光边缘 Partial Neon Edge

- **风格**：暗黑奢华
- **来源**：用户提供的提示词 · 收录于 2026-11-25
- **适用场景**：赛博风界面、选中态卡片、数据重点标注

> 原始提示词：Partial neon glowing edge, localized bright segments on border, non-continuous light stroke, cyber accent lighting, high contrast neon trim, futuristic UI card, bold color pop on dark surface.

## 行为

边框只有**几段被点亮**，其余部分暗淡或完全消失。
亮段短促、边缘锐利，像霓虹灯管只亮了一小节。亮段位置可固定或缓慢游走。

与前几个边框的本质区别：**克制**。只点亮 10%~25% 的周长，
大面积留暗，靠少量高对比色制造"cyber accent"。

## 时长与曲线
- 亮段游走（若开启）：`4000ms` 一周，`linear`
- 亮段呼吸：`1500ms`，`ease-in-out`，亮度 `0.8 ↔ 1.0`
- 点亮瞬间（可选，用于状态切换）：`300ms`，`cubic-bezier(0.32,0.72,0,1)`

## 视觉

**推荐实现：SVG stroke + dasharray**

```html
<svg class="neon-frame" viewBox="0 0 300 200" preserveAspectRatio="none">
  <rect x="0.75" y="0.75" width="298.5" height="198.5" rx="20"
        fill="none" stroke="rgba(255,255,255,.06)" stroke-width="1.5"/>
  <rect class="glow" x="0.75" y="0.75" width="298.5" height="198.5" rx="20"
        fill="none" stroke="#00FFC8" stroke-width="1.5"
        stroke-dasharray="60 1000" stroke-linecap="round"/>
</svg>
```

```css
.glow {
  filter: drop-shadow(0 0 6px #00FFC8) drop-shadow(0 0 16px rgba(0,255,200,.5));
  animation: travel 4s linear infinite;
}
@keyframes travel {
  to { stroke-dashoffset: -1060; }   /* 周长约为 1060 */
}
```

关键点：
- **底层永远有一条极暗的完整边框**（`rgba(255,255,255,.06)`），否则未点亮区域完全消失，
  卡片边界不成立
- `stroke-dasharray: 60 1000` 里的 `60` 就是亮段长度（约周长的 5.6%）
- **双层 drop-shadow**：近层锐利（6px）+ 远层柔和（16px），单层看起来像廉价发光
- 亮段建议只占 `10%~25%` 周长

**配色**：高对比青色 `#00FFC8`、洋红 `#FF2D95`、亮黄 `#FFE94A`。一次只用一种，不要混。

## 细节与反例

### 辉光必须用多层零偏移阴影堆叠（实测）

单层阴影看起来是平的。专业做法是用**一堆零偏移阴影**：

```css
.neon {
  box-shadow:
    /* 白色内芯 3 层 */
    0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff,
    /* 彩色光晕 5 层 */
    0 0 42px #00FFC8, 0 0 82px #00FFC8,
    0 0 92px #00FFC8, 0 0 102px #00FFC8, 0 0 151px #00FFC8;
}
```

按字号缩放：84px 字号时白芯约 `0.08/0.12/0.25em`，彩色约 `0.5/1.0/1.2em`。
来源：[CSS-Tricks](https://css-tricks.com/how-to-create-neon-text-with-css/)

### 闪烁有严格安全预算

**每次闪烁事件最多 2 个暗帧，每 2 秒最多一次，且只在入场时。**
这远低于 WCAG 2.3.1 的每秒 3 次阈值（光敏癫痫风险）。

超过一个节拍的动画，**优先用缓慢脉冲（辉光半径涨落）而不是闪烁**。
霓虹"开灯"入场：辉光透明度 `0→0.6`（2帧）→`0.2`（1帧）→`1`（3帧）→保持。

### 颜色对比度

白芯配彩色光晕：`#FF4FD8` 在 `#0B0B12` 上对比度 **6.9:1**（达标）。
激活态**增强光晕强度**而不是换颜色，保持双色调。

### 其他

- **必须保留暗边**。很多人只画亮段，结果卡片没有轮廓，像漂浮的线段。
- **不要均匀点亮整圈**。那就变成普通霓虹边框，失去了"局部"这个设计意图。
- **亮段长度要短**。超过周长 30% 就不是 accent 了。
- **不要用 `box-shadow` 模拟**。`box-shadow` 无法只亮一段，必须用 dasharray 或遮罩。
- 亮段游走时，转角处要减速，否则视觉上像"卡过去"。

## 降级
- `prefers-reduced-motion`：亮段固定在一角，不游走
- 不支持 SVG filter：去掉外层 drop-shadow，只保留内层
- 低端设备：drop-shadow 减为单层 6px

## 复刻提示词

见 [SKILL.md](../SKILL.md#6-合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
