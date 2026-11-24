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

## 降级
`prefers-reduced-motion`：光斑固定居中，不跟随光标。
触屏：改为按压缩放 0.98 加一层静态内发光。

## 细节与反例
描边高亮弧线是高级感的来源，只有光斑没有描边就会显得廉价。移动端改为触摸位置驱动 + 2° 倾斜。

## 复刻提示词

见 [SKILL.md](../SKILL.md#合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
