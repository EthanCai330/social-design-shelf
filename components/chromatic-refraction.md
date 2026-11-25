---
id: chromatic-refraction
title: "色散折射 Chromatic Refraction"
category: surface
styles: [glass, fluid]
input: pointer
viewport: desktop
status: draft
---

# 色散折射 Chromatic Refraction

- **风格**：玻璃拟态 / 流体渐变
- **来源**：用户提供的提示词 · 收录于 2026-11-25
- **适用场景**：产品展示页、艺术导向的品牌站、需要"透过某物看"的交互

> 原始提示词：Chromatic Refraction：像透过棱镜，画面弯曲、边缘分色。鼠标附近形成折射区域，背景图像轻微扭曲，边缘产生 RGB 色散。

## 行为

鼠标所在位置形成一个**透镜区域**：
- 区域内的背景画面发生轻微弯曲（像透过玻璃或水看）
- 区域边缘出现 RGB 三色分离（色散）
- 区域内整体亮度略微提升，模拟折射聚光

这是一个"光学"效果，不是发光也不是模糊。

## 时长与曲线
- 跟随：`lerp 0.12`，略滞后于光标，显得有"重量"
- 进入/离开：折射强度 `300ms` 淡入淡出
- 无循环动画——它完全由光标驱动

## 视觉
- 折射半径：`90~140px`
- 弯曲强度：`displacement 6~10px`（以半径为单位偏移）
- 色散偏移：R 通道 `+1.5px`、B 通道 `-1.5px`（G 居中不动）
- 边缘衰减：`smoothstep`，中心最强、边界归零
- 亮度增益：中心 `+8%`

## 实现要点

三种可行路线，按复杂度排序：

**路线一：CSS + SVG filter（最简单）**
用 `feDisplacementMap` + `feColorMatrix` 做色散，配一个跟随光标的 `backdrop-filter` 区域。
局限：`backdrop-filter` 只能模糊/变色，**做不了位移扭曲**。

**路线二：Canvas 分层位移（推荐）**
把背景图绘制三次，分别用 R / G / B 通道，各自做径向位移：
```
偏移量 = direction * strength * smoothstep(1 - d/R)
```
三层用 `globalCompositeOperation: 'lighter'` 叠加。
优点：无需 WebGL，性能可控；缺点：需要把背景先渲染到 canvas。

**路线三：WebGL 着色器（最还原）**
片元着色器里对 UV 做折射偏移 + 分别采样 RGB。
优点：真实感最强；缺点：环境要求高，移动端可能不支持。

## 关键参数（路线二）

```
strength   = 8         // 最大位移像素
dispersion = 3         // R 与 B 的额外反向偏移
radius     = 120
falloff    = smoothstep(0, 1, 1 - dist / radius)
```

## 细节与反例

- **色散是"边缘分色"，不是"整体染色"**。很多人做成整块偏紫，那是滤镜，不是折射。
- **必须在边缘最强**。色散强度应随距离增大而在光晕边缘达到峰值，中心反而应接近 0
  （真实棱镜是边缘色散最明显）。
- **不要做成放大镜**。放大是 scale，折射是 displace，两者观感完全不同。
- **背景必须真有内容**。纯色背景上做了什么也看不出来，这是最容易踩的坑。
- 移动端谨慎：触屏没有 hover，只能做成长按触发。

## 降级
- `prefers-reduced-motion`：静态显示一个固定的折射区，不跟随
- 触屏：改为长按屏幕时在按压位置出现
- 不支持 canvas 混合模式：退化为简单的径向渐变高光

## 复刻提示词

见 [SKILL.md](../SKILL.md#6-合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
