---
id: spotlight-card
title: "Spotlight 光追卡片 Spotlight Card"
category: depth
styles: [noir]
input: pointer
viewport: both
status: verified
---
# Spotlight 光追卡片 Spotlight Card

- **风格**：暗黑奢华
- **来源**：用户对话中提出 · 收录于 2026-11-25
- **适用场景**：功能卡片、定价卡、Bento 网格

## 行为
鼠标移动时，240px 半径径向渐变光斑跟随光标。同时卡片描边在光标处形成一段高亮弧线。卡内图标与标题跟光标做 1.5px 反向视差。光标离开光斑 400ms 淡出。

## 时长与曲线
光斑跟手实时；离开 400ms 淡出，不要瞬灭。

## 视觉
- 卡片 `#131315`，圆角 16px
- 描边 `1px rgba(255,255,255,0.08)`
- 光斑：`rgba(120,160,255,0.16)` → transparent

## 变体记录

### 变体 B：卡片内聚光 · 边缘收敛（2026-11-25 收录自用户提示词）

基准方案是"光斑跟随光标 + 描边在光标处高亮"。

用户提示词强调的要点是：**光晕必须限制在面板内，中心微亮、边缘衰减**。

```css
/* 变体 B：径向渐变光晕，强制裁切在面板内 */
.spotlight-panel {
  position: relative;
  overflow: hidden;                    /* 关键：裁切光晕 */
  background: #131315;
}
.spotlight-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    260px circle at var(--mx, 50%) var(--my, 50%),
    rgba(110, 150, 255, 0.14) 0%,
    rgba(110, 150, 255, 0.05) 45%,
    transparent 70%
  );
  pointer-events: none;
  transition: opacity .4s ease;
}
```

差异点：
- 本变体**只做光晕**，不做描边高亮弧线（更简洁）
- 强调 `overflow: hidden` —— 没有它，光晕会溢出卡片边界
- 中心 → 边缘用**三段衰减**（0% / 45% / 70%），比两段更柔和

**取舍**：基准版的描边高亮更精致但实现更复杂；变体 B 更轻量，适合大面积面板。


## 降级
`prefers-reduced-motion`：光斑固定居中，不跟随光标。
触屏：改为按压缩放 0.98 加一层静态内发光。

## 细节与反例
描边高亮弧线是高级感的来源，只有光斑没有描边就会显得廉价。移动端改为触摸位置驱动 + 2° 倾斜。

## 复刻提示词

见 [SKILL.md](../SKILL.md#合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
