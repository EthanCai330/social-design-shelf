---
id: floating-navigation
title: "悬浮导航 Floating Navigation"
category: structure
styles: [glass]
input: both
viewport: mobile
status: verified
---
# 悬浮导航 Floating Navigation

- **风格**：玻璃拟态
- **来源**：用户对话中提出 · 收录于 2026-11-25
- **适用场景**：底部主 Tab

## 行为
药丸形浮动条，距屏幕边缘 20px，宽度自适应内容。4 个图标，当前项实心并放大 1.1x，下方浮出 4px 圆点。切 tab 时品牌色光晕从旧图标滑到新图标。上滚时导航条缩到 0.94x 并提高模糊，下滚恢复。

## 时长与曲线
- 光晕滑动：300ms
- 滚动吸附：挤压回弹，短促

## 视觉
- 毛玻璃：`blur(24px)` + `rgba(255,255,255,0.72)` + 1px `rgba(0,0,0,0.06)` 描边
- 阴影：`0 1px 2px` + `0 12px 32px rgba(0,0,0,0.10)`
- 圆角 999px

## 降级
`prefers-reduced-motion`：光晕直接定位，去掉挤压回弹。
无 backdrop-filter 的浏览器：退化为 `rgba(255,255,255,.92)` 实底。

## 细节与反例
切换时导航条要有一个"高度瞬间缩 4px 再回弹"的挤压感，这是它区别于普通 tab 的地方。

## 复刻提示词

见 [SKILL.md](../SKILL.md#合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
