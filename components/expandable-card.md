---
id: expandable-card
title: "可展开卡片 Expandable Card"
category: expand
styles: [quiet]
input: both
viewport: mobile
status: verified
---
# 可展开卡片 Expandable Card

- **风格**：静谧极简
- **来源**：用户对话中提出 · 收录于 2026-11-25
- **适用场景**：列表、FAQ、消息摘要

## 行为
收起只显示标题 + 一行摘要，高 88px。点击高度 spring 增长到内容自然高度，隐藏内容错峰淡入（每行延迟 40ms）。标题字重 Medium→Semibold，箭头旋转 180°。同一时间只允许展开一张。

## 时长与曲线
- 高度：spring，`stiffness 300 / damping 30 / mass 1`（ζ≈0.87，过冲约 1.6%，即高度上不超过 2px）
- 箭头：220ms
- 其他卡片收起：260ms

## 视觉
- 圆角 12px → 16px
- 阴影展开时加深一档

## 降级
`prefers-reduced-motion`：高度直接切到终值，内容瞬时显示。
`<details>/<summary>` 可作为无 JS 的等效实现。

## 细节与反例
高度不能一次性跳变，也不能用固定 max-height 硬撑。展开时其他卡片要轻微上移补位。

## 复刻提示词

见 [SKILL.md](../SKILL.md#合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。

