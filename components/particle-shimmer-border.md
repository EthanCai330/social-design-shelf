---
id: particle-shimmer-border
title: "粒子流光边框 + 消散至虚空 Particle Shimmer Border"
category: surface
styles: [noir, fluid]
input: none
viewport: both
status: draft
---

# 粒子流光边框 + 消散至虚空 Particle Shimmer Border

- **风格**：暗黑奢华 / 流体渐变
- **来源**：用户提供的提示词 · 收录于 2026-11-25
- **适用场景**：科幻风界面、AI 生成结果容器、暗色 Dashboard 重点模块

> 原始提示词：Particle shimmer border, tiny glowing particles flowing along the edge, dissipating into void, dynamic particle system, sci-fi interface, real-time rendering feeling, dark background with sparkling dust.

## 行为

边框由**沿路径流动的小光点**构成，光点有大小与亮度差异。
部分光点在行进途中偏离路径、向外飘散并淡出（消散至虚空），营造"粒子系统在实时运行"的感觉。
背景配合散落的尘埃光点，形成星空感。

无交互，自动播放。

## 时长与曲线
- 粒子沿周长行进一周：`8000~12000ms`（**每个粒子周期不同**，这是关键，相同周期会形成整齐的"跑马灯"）
- 单个粒子淡入淡出：`600ms`，`ease-out`
- 飘散粒子：偏离路径后 `1200ms` 内从 `opacity 1` 线性衰减到 `0`，同时向外漂移 `20~40px`
- 尘埃闪烁：`2000~4000ms` 随机周期，`ease-in-out`

## 视觉

**推荐实现：Canvas 2D 粒子 + 圆角矩形路径采样**

参数建议：
- 粒子数量：`60~120` 个（少于 40 看不出"系统"，多于 160 会糊）
- 圆角矩形路径按 `getTotalLength()` 采样，粒子用 `t`(0~1) 参数沿路径插值
- 粒子半径：`0.6 ~ 2.2px` 随机，其中 20% 为"亮粒子"（`2.5~3.5px`）
- 粒子颜色：主体 `#9FE8FF` 到 `#C4A5FF` 之间按色相插值，亮粒子接近 `#FFFFFF`
- 粒子透明度：`0.3 ~ 1.0` 随机
- 光晕：每个粒子画一次 `radialGradient`，半径 `4~10px`，中心亮到边缘透明
- 尘埃：`40~80` 个背景点，半径 `0.4~1.2px`，透明度 `0.06~0.25`

**关键：用 `shadowBlur` 还是 `radialGradient`**
- `shadowBlur` 简单但性能差，粒子多时会明显掉帧
- `radialGradient` 需要更多代码但帧率稳定，推荐

**消散效果**：为每个粒子维护 `life` 状态。约 8% 的粒子在出发时标记 `willDissipate = true`，
行进到 `40%~80%` 时随机点开始向外偏移，同时 `life` 衰减到 0 后回收。

## 细节与反例

- **周期必须各不相同**。所有粒子同周期 = 跑马灯，是这套效果最容易翻车的地方。
- **粒子不能均匀分布**。出发点和速度都要有随机扰动，均匀分布会看出"机器感"。
- **不是"发光边框"**。如果只是给边框加 `box-shadow` 加几个点，缺少"消散"就没有科幻感，
  就退化成普通霓虹边框。消散是这个效果的灵魂。
- **暗底是前提**。浅色背景上粒子几乎不可见。
- 性能：粒子数超过 150 或用了 `shadowBlur`，移动端会掉到 30fps 以下。

## 降级
- `prefers-reduced-motion`：只保留静态尘埃，粒子凝固在初始位置
- 低端设备：粒子数降到 30，去掉光晕，只画实心圆点
- 无 Canvas 支持：退化为静态渐变边框 + 噪点纹理

## 复刻提示词

见 [SKILL.md](../SKILL.md#6-合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
