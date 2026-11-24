---
id: staggered-list-reveal
title: "错峰入场 Staggered List Reveal"
category: motion
styles: [quiet]
input: none
viewport: both
status: verified
---
# 错峰入场 Staggered List Reveal

- **风格**：静谧极简
- **来源**：用户对话中提出 · 收录于 2026-11-25
- **适用场景**：列表首屏、卡片网格

## 行为
卡片从 `translateY(16px) + opacity 0` 开始，每张延迟 60ms。scale 0.97→1，阴影从 0 淡入。首屏最多错峰 6 张，其余一次性淡入。返回页面不重播。

## 时长与曲线
- 单张卡片：420ms，`cubic-bezier(0.22,1,0.36,1)`
- 错峰间隔：60ms / 张
- 首屏最多错峰 6 张，第 7 张起统一在 300ms 处一次性淡入

## 视觉
- 起始态：`translateY(16px) + opacity 0 + scale 0.97`
- 终态：`translateY(0) + opacity 1 + scale 1`
- 阴影同步从 `0 0 0 rgba(0,0,0,0)` 淡入到 `0 1px 2px rgba(0,0,0,.03)`

## 降级
- `prefers-reduced-motion`：取消位移与缩放，只保留 200ms 淡入，且不做错峰
- 返回页面：不重播，直接显示终态

## 细节与反例
错峰超过 6 张用户就会等。返回时重播会让人烦。

## 复刻提示词

见 [SKILL.md](../SKILL.md#合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
