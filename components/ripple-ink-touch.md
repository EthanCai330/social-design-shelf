---
id: ripple-ink-touch
title: "墨晕触摸反馈 Ripple / Ink Touch"
category: micro
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

## 变体记录

### 变体 B：固定蓝色波纹 · 大缩放（2026-11-25 收录自用户提示词）

基准方案是"波纹颜色跟随文字色 + 扩张到覆盖元素"。

用户另提供一组更"水波"的参数：

| 参数 | 基准 | 变体 B |
|---|---|---|
| 颜色 | 跟随 `currentColor` | **固定浅蓝** `rgba(120, 180, 255, .45)` |
| 动画 | 半径 0 → 覆盖元素 | **`scale: 0 → 4`** |
| 透明 | `12% → 0` | **`1 → 0`** |
| 时长 | `500ms` | **`600ms`** |

```css
.ripple {
  position: absolute;
  border-radius: 50%;
  width: 100%; height: 100%;
  background: rgba(120, 180, 255, 0.45);
  animation: rippleOut .6s ease-out forwards;
  pointer-events: none;
}
@keyframes rippleOut {
  from { transform: scale(0); opacity: 1; }
  to   { transform: scale(4); opacity: 0; }
}
```

**注意**：变体 B 的初始不透明度是 `1`，意味着波纹起始时是**实心**的，
靠快速扩散才变"轻"。这比基准方案的起始 `12%` 更"实"，适合暗色背景上的浅蓝。

**取舍**：
- 基准方案更通用（颜色自适应，彩色按钮上不会突兀）
- 变体 B 观感更"水"，但**固定蓝色在非蓝色按钮上会违和**，慎用

## 细节与反例
波纹颜色必须跟随该元素文字色，固定灰会在彩色按钮上突兀。

## 复刻提示词

见 [SKILL.md](../SKILL.md#合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
