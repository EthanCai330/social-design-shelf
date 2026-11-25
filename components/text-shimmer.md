---
id: text-shimmer
title: "文字流光 Text Shimmer"
category: motion
styles: [noir, fluid]
input: none
viewport: both
status: verified
---

# 文字流光 Text Shimmer

- **风格**：暗黑奢华 / 流体渐变
- **来源**：[Motion Primitives](https://motion-primitives.com/) · [CSS 实现参考](https://spell.sh) · 收录于 2026-11-25
- **许可**：Motion Primitives 采用 MIT 许可，可自由使用。
- **适用场景**：Hero 标题、定价高亮、加载中的状态文字、"AI 正在思考"

> 一道高光带从文字表面扫过。字本身不变形、不位移，只是被一束光"刷"过。

## 行为

文字底色是一段渐变（暗色为主 + 中间一道亮带），
亮带通过移动 `background-position` 从右向左扫过整个文字。

核心是三个属性协作：
1. `background: linear-gradient(...)` —— 带高光带的渐变
2. `background-clip: text` —— 把背景裁成文字形状
3. `animation` —— 移动背景位置

**字不动，只有光在动**——这是它与"逐字入场"类效果的本质区别。

## 时长与曲线

- 循环周期：`3000ms`
- 缓动：`ease-in-out`（**不要用 linear**，那会让光带匀速滑过，显得机械）
- 无限循环

## 视觉

```css
.shimmer {
  background: linear-gradient(
    90deg,
    #334155 0%,      /* 基底色 */
    #334155 40%,
    #e2e8f0 50%,     /* 高光带 */
    #334155 60%,
    #334155 100%
  );
  background-size: 200% 100%;      /* 渐变宽度为元素 2 倍，留出移动空间 */
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: shimmer-slide 3s ease-in-out infinite;
}
@keyframes shimmer-slide {
  0%   { background-position: 100% center; }   /* 从右侧外开始 */
  100% { background-position: -100% center; }  /* 扫到左侧外 */
}
```

**关键参数解释**：

- `background-size: 200% 100%` —— 渐变比元素宽一倍，才有地方滑动
- `40% / 50% / 60%` —— 高光带占渐变的 20% 宽，是"一道光"而非"一片亮"
- `100% → -100%` —— 从完全在右侧外面，扫到完全在左侧外面

**暗色主题**（本库常用）：
```css
background: linear-gradient(90deg,
  #94a3b8 0%, #94a3b8 40%,
  #f8fafc 50%,
  #94a3b8 60%, #94a3b8 100%);
```

**品牌色高光**：
```css
background: linear-gradient(90deg,
  #6366f1 0%, #6366f1 40%,
  #ec4899 50%,                /* 洋红高光扫过靛蓝文字 */
  #6366f1 60%, #6366f1 100%);
```

## 细节与反例

- **不要用 `linear`**。整段匀速移动像"进度条"，`ease-in-out` 才有"光扫过"的呼吸感。
- **高光带不要超过 25% 宽**。太宽就变成"整块变亮"而不是"一道光"。
- **不要用在正文**。只用于标题和短句——长段落会分散注意力且伤眼。
- **字重最好 ≥ 600**。细字体在 `background-clip: text` 下高光不明显。
- **必须 `overflow: visible`**。有些斜体字形的边缘会被裁掉。
- 性能：只动 `background-position`，不触发布局，开销很小；但**不要给大段文字加**。

## 降级
- `prefers-reduced-motion`：停止动画，保留静态渐变（文字仍然好看）
- 不支持 `background-clip: text`：回退为纯色文字（不要留透明文字！）

```css
@supports not (background-clip: text) {
  .shimmer { color: #334155; background: none; }
}
```

- 高对比度模式：关闭流光，保证文字可读

## 复刻提示词

见 [SKILL.md](../SKILL.md#6-合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
