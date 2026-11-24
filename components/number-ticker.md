---
id: number-ticker
title: "数字滚动 Number Ticker"
category: data
styles: [swiss, noir]
input: none
viewport: both
status: verified
---
# 数字滚动 Number Ticker

- **风格**：瑞士排版 / 暗黑奢华
- **来源**：用户对话中提出 · 收录于 2026-11-25
- **适用场景**：余额、指标、统计数字

## 行为
从旧值到新值时每位数字独立滚动，像老虎机滚轮向上翻转到目标位，每位延迟 30ms。

## 时长与曲线
总 600ms，`cubic-bezier(0.22,1,0.36,1)`

## 视觉
- 等宽 `tabular-nums`，滚动中容器宽度不变
- 小数部分字号 70%、字重更轻、颜色淡一档

## 降级
`prefers-reduced-motion`：数字直接替换，不滚动。
必须给屏幕阅读器提供 `aria-live="polite"` 的最终值，避免朗读每一位。

## 细节与反例
不用等宽字体会导致数字抖动，这是廉价感的主要来源。

## 复刻提示词

见 [SKILL.md](../SKILL.md#合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
