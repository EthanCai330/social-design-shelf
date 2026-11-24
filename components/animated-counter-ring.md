---
id: animated-counter-ring
title: "进度环 Animated Counter Ring"
category: data
styles: [quiet, noir]
input: both
viewport: mobile
status: verified
---
# 进度环 Animated Counter Ring

- **风格**：静谧极简 / 暗黑奢华
- **来源**：用户对话中提出 · 收录于 2026-11-25
- **适用场景**：健康、下载、完成度

## 行为
数值变化时弧线 700ms spring 走向新值，端点 6px 发光小点跟随弧线移动。中心数字用 Number Ticker 同步滚动。100% 时整圈脉冲一次（scale 1.02→1）并变完成色。

## 时长与曲线
700ms spring

## 视觉
轨道 1.5% 灰，进度弧品牌色，圆头端点

## 降级
`prefers-reduced-motion`：弧线与数字直接跳到终值。
给 `<svg>` 加 `role="img"` 与描述性 `aria-label`。

## 细节与反例
不要瞬间跳到新值。端点的发光点是最容易忽略却最提质感的细节。

## 复刻提示词

见 [SKILL.md](../SKILL.md#合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
