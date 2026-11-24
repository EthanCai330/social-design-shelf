---
id: smart-popover
title: "智能浮层 Smart Popover"
category: depth
styles: [glass]
input: both
viewport: both
status: verified
---
# 智能浮层 Smart Popover

- **风格**：玻璃拟态
- **来源**：用户对话中提出 · 收录于 2026-11-25
- **适用场景**：上下文菜单、Tooltip、快捷操作

## 行为
自动判断可用空间：优先下方，空间不足翻到上方，并调整水平对齐避免出屏。从触发点方向以 transform-origin 展开（从按钮里长出来）。内部每行错峰 25ms 淡入。

## 时长与曲线
- 打开：200ms
- 关闭：150ms（打开慢关闭快）

## 视觉
毛玻璃 `blur(16px)` + 白 85% + 圆角 14px + 双层阴影

## 降级
`prefers-reduced-motion`：直接显示，无缩放。
不支持 backdrop-filter：改用不透明 `#fff` 加阴影。

## 细节与反例
transform-origin 必须锚定触发元素，不然就是"凭空出现"。关闭比打开快是潜规则。

## 复刻提示词

见 [SKILL.md](../SKILL.md#合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
