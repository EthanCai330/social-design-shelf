---
id: magnification-dock
title: "放大 Dock Magnification Dock"
category: effect
styles: [glass]
input: pointer
viewport: mobile
status: verified
---
# 放大 Dock Magnification Dock

- **风格**：玻璃拟态
- **来源**：用户对话中提出 · 收录于 2026-11-25
- **适用场景**：底部主导航、快捷入口

## 行为
5~7 个图标横向排列，间距 12px。光标靠近某图标时按高斯曲线放大：自身 1.35x，左右邻居 1.18x、1.08x，其余 1x。放大与上移（最高 10px）都由光标位置实时驱动。hover 图标下方浮出小标签。

## 时长与曲线
跟手实时，无过渡延迟。标签：150ms 上浮淡入。

## 视觉
- Dock 背景：`blur(20px)` + 白色 12% + 1px 顶部高光，圆角 28px
- 标签：深色胶囊，12px 字

## 降级
`prefers-reduced-motion`：取消放大，改为 hover 高亮描边。
触屏：长按显示标签，不做连续放大。

## 细节与反例
放大必须由光标位置连续驱动，不能用"进入时触发一次动画"。移动端改为长按后整排呼吸放大，松手弹回。

## 复刻提示词

见 [SKILL.md](../SKILL.md#合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
