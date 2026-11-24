---
id: 3d-tilt-card
title: "3D 倾斜卡片 3D Tilt Card"
category: depth
styles: [noir, fluid]
input: pointer
viewport: desktop
status: verified
---
# 3D 倾斜卡片 3D Tilt Card

- **风格**：暗黑奢华 / 流体渐变
- **来源**：用户对话中提出 · 收录于 2026-11-25
- **适用场景**：作品集卡片、产品展示、Bento

## 行为
鼠标移动根据相对中心位置计算旋转：`rotateX = -(dy/height)×8°`，`rotateY = (dx/width)×10°`，perspective 900px。表面高光层随角度移动，内容层 translateZ(24px)。离开 500ms spring 回 0°，允许 1.5° 过冲。

## 时长与曲线
跟手实时；离开 spring 500ms，过冲 1.5°。

## 视觉
- `transform-style: preserve-3d`
- 外层阴影 `0 24px 48px rgba(0,0,0,0.10)`，倾斜时同步偏移

## 降级
`prefers-reduced-motion`：禁用倾斜，仅保留 hover 阴影加深。
触屏：按压时轻微缩放 0.98 代替倾斜。

## 细节与反例
不要超过 10° 旋转，多了会晕。触屏设备禁用倾斜。内容层必须真抬高 translateZ，否则是假 3D。

## 复刻提示词

见 [SKILL.md](../SKILL.md#合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
