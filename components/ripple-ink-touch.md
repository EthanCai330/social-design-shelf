---
id: ripple-ink-touch
title: "墨晕触摸反馈 Ripple / Ink Touch"
category: motion
styles: [oriental, quiet]
input: touch
viewport: mobile
status: verified
---
# 墨晕触摸反馈 Ripple / Ink Touch

- **风格**：东方留白 / 静谧极简
- **来源**：用户对话中提出 · 收录于 2026-11-25
- **适用场景**：所有可点击元素

## 行为
按下后从触摸点扩散一圈涟漪，半径从 0 生长到覆盖元素（最小 120px），透明度 12%→0。列表项被点击时整行背景 180ms 填充 8% 底色，随后转场，形成「按下—确认—离开」三段节奏。

## 时长与曲线
- 涟漪：500ms，`ease-out`
- 列表项整行底色填充：180ms
- 三段节奏：按下（0–180ms）→ 确认（180–300ms）→ 转场（300ms+）

## 视觉
- 涟漪颜色：**跟随该元素文字色**（当前 `color`），透明度 `12% → 0`
- 涟漪起始半径 `0`，终值 `max(元素对角线, 120px)`
- 列表项点击底色：元素文字色的 `8%`
- 涟漪层 `position: absolute; border-radius: 50%; pointer-events: none;`
  容器必须有 `overflow: hidden` 和 `position: relative`，否则会溢出到相邻元素

## 降级
- `prefers-reduced-motion`：取消涟漪扩散，只保留按下时的 8% 底色反馈
- 键盘操作：用 `:focus-visible` 的描边代替涟漪

## 细节与反例
波纹颜色必须跟随该元素文字色，固定灰会在彩色按钮上突兀。

## 复刻提示词

见 [SKILL.md](../SKILL.md#合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
