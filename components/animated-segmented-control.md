---
id: animated-segmented-control
title: "动效分段控制器 Animated Segmented Control"
category: motion
styles: [quiet]
input: both
viewport: mobile
status: verified
---
# 动效分段控制器 Animated Segmented Control

- **风格**：静谧极简
- **来源**：用户对话中提出 · 收录于 2026-11-25
- **适用场景**：筛选、切换视图、二级导航

## 行为
2~4 个选项，选中项背后有一块指示器。切换时指示器 spring 滑向目标，并伴随宽度微形变（中间拉伸 8%，落定回正）。选中文字颜色和字重渐变。支持拖拽切换。

## 时长与曲线
- 指示器：spring，`stiffness 320 / damping 26 / mass 1`（ζ≈0.73，轻微过冲，符合滑动甩动感）
- 文字变色：200ms

## 视觉
- 外框：4% 灰底，圆角 10px
- 指示器：白色 + `0 1px 3px rgba(0,0,0,0.10)`
- 文字：`#8A8A8E` → `#111`，Regular → Medium

## 降级
`prefers-reduced-motion`：指示器直接跳位，不做 spring 与形变。
键盘：左右方向键切换，focus 环沿用指示器位置。

## 细节与反例
不要"跳"过去。宽度形变是灵魂，没有它就像低端 tab。未选中项在指示器经过时透明度短暂升到 0.9 再回落。

## 复刻提示词

见 [SKILL.md](../SKILL.md#合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。

