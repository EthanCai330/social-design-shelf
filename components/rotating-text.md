---
id: rotating-text
title: "轮换文字 Rotating Text"
category: text
styles: [swiss, oriental]
input: none
viewport: both
status: verified
---
# 轮换文字 Rotating Text

- **风格**：瑞士排版 / 东方留白
- **来源**：用户对话中提出 · 收录于 2026-11-25
- **适用场景**：Hero 标题、品牌口号

## 行为
一行文字每 2.4s 轮换关键词。旧词逐字向上淡出（每字延迟 25ms），新词逐字从下方 100% 上移淡入。容器高度固定，文字裁切在轨道内。

## 时长与曲线
600ms，`cubic-bezier(0.76,0,0.24,1)`

## 视觉
旁边细竖线光标同步闪烁两次

## 降级
`prefers-reduced-motion`：只显示第一个词，不轮换。
屏幕阅读器：轮换区域用 `aria-hidden`，同时提供静态完整文案。

## 细节与反例
必须 overflow hidden 裁切，否则文字会从上方"飞过去"穿帮。逐字错峰是灵魂。

## 复刻提示词

见 [SKILL.md](../SKILL.md#合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
