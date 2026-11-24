---
id: morphing-icon-button
title: "形变图标按钮 Morphing Icon Button"
category: motion
styles: [quiet]
input: both
viewport: both
status: verified
---
# 形变图标按钮 Morphing Icon Button

- **风格**：静谧极简
- **来源**：用户对话中提出 · 收录于 2026-11-25
- **适用场景**：菜单开关、抽屉触发

## 行为
汉堡三线变成 ×：上线旋转 45° 下垂，下线同时旋转 -45° 上移，中线淡出。但要**先缩短到 60%，再旋转，最后拉长**。

## 时长与曲线
320ms，spring 缓动

## 视觉
hover 时 1.04 放大 + 8% 黑底圆形 hover 区

## 降级
`prefers-reduced-motion`：三条线直接切换为 ×，不做形变。
按钮必须有 `aria-expanded` 与可读 `aria-label`。

## 细节与反例
最常见的错误是直接旋转，看起来呆板。先缩短再旋转才有"器械感"。

## 复刻提示词

见 [SKILL.md](../SKILL.md#合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
