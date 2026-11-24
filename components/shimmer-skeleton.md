---
id: shimmer-skeleton
title: "流光骨架屏 Shimmer Skeleton"
category: data
styles: [quiet]
input: none
viewport: both
status: verified
---
# 流光骨架屏 Shimmer Skeleton

- **风格**：静谧极简
- **来源**：用户对话中提出 · 收录于 2026-11-25
- **适用场景**：任何加载态

## 行为
骨架块表面有一条 90° 白色渐变光带（宽 160px，透明度 0→0.6→0）从左到右扫过。整屏骨架块错峰 120ms 依次亮起，形成波纹节奏。加载完成后内容淡入 200ms，骨架延迟 100ms 淡出。

## 时长与曲线
光带 1.6s 循环，ease-in-out

## 视觉
骨架块颜色 = 背景深 3%，圆角与最终内容一致

## 降级
`prefers-reduced-motion`：取消流光，只保留静态骨架块。
骨架块必须有 `aria-busy="true"`。

## 细节与反例
骨架和内容不能同时消失，要有 100ms 交叉。骨架颜色不能太深，深 3% 刚好。

## 复刻提示词

见 [SKILL.md](../SKILL.md#合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
