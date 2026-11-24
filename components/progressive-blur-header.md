---
id: progressive-blur-header
title: "渐进模糊头部 Progressive Blur Header"
category: gesture
styles: [quiet, glass]
input: touch
viewport: mobile
status: verified
---
# 渐进模糊头部 Progressive Blur Header

- **风格**：静谧极简 / 玻璃拟态
- **来源**：用户对话中提出 · 收录于 2026-11-25
- **适用场景**：大标题页面、内容流

## 行为
模糊由滚动距离驱动，不是开关式。scrollY 0~60px 之间背景从透明渐变到 `rgba(255,255,255,0.85)`，blur 0→16px，分隔线透明度 0→6%。大标题 32px→17px 并上移，字重不变。缩小时左侧淡入返回按钮。

## 时长与曲线
由滚动位置连续驱动，无独立时长。滚动区间 `scrollY 0~60px` 映射为进度 `k = clamp(scrollY/60, 0, 1)`。

## 视觉
- 头部高度 `52px`
- 背景：`rgba(250,249,247,0)` → `rgba(250,249,247,0.85)`，随 `k` 线性插值
- 背景模糊：`blur(0px)` → `blur(16px)`
- 底部分隔线：`.5px` 高度，`rgba(0,0,0,.06)`，透明度 `0 → 1`（乘 `k`）
- 大标题：`32px` → `17px`，字重保持 Medium，同时上移 `8px`
- 缩小后居中显示小标题，左侧淡入返回按钮（`k > 0.6` 后开始出现）

## 降级
- `prefers-reduced-motion`：头部背景改为在 60px 处一次性切换，不做逐帧插值
- 低端设备：把 `blur` 固定为 16px，只动背景透明度（逐帧改 blur 在安卓机上易掉帧）

## 细节与反例
关键在"连续"，一旦是切换就会闪。标题缩小时字重保持不变——变了就很跳。

## 复刻提示词

见 [SKILL.md](../SKILL.md#合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
