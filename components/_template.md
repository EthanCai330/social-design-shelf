---
id: your-slug
title: "中文名 English Name"
category: motion
styles: [quiet]
input: both
viewport: both
status: draft
---

# 中文名 English Name

- **风格**：静谧极简
- **来源**：来源名称 · https://... · 收录于 YYYY-MM-DD
- **适用场景**：用在哪

## 行为

触发方式 + 驱动方式 + 状态如何变化。**必须写公式与具体数值**，不要用"平滑""自然"这类词代替。

例：光标进入 `R = 120px` 半径内时，位移量为 `A * (1 - d/R)`，其中 `A = 12px`。

## 时长与曲线

- 主过渡：`420ms`，`cubic-bezier(0.32,0.72,0,1)`（该曲线单调，无过冲）
- 回弹：spring，`stiffness 300 / damping 26 / mass 1`（ζ≈0.75）
- 延迟/错峰：`60ms` / 个

**注意**：声明"过冲"就必须用 spring 或 y 控制点 >1 的贝塞尔，纯单调曲线做不到。

## 视觉

- 底色 `#FFFFFF`，文字 `#111111`
- 圆角 `16px`（做圆角动画时从 `高度/2` 插值，不要从 `999px` 插值）
- 阴影：`0 1px 2px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.06)`
- 毛玻璃：`backdrop-filter: blur(20px) saturate(160%)` + 白 10% + `inset 0 0 0 1px rgba(255,255,255,.18)`

## 细节与反例

- 要避免什么：最典型的错误做法是什么
- 关键判据：这个设计区别于"低端实现"的那一点是什么

## 降级

- `prefers-reduced-motion`：如何处理
- 触屏 / 桌面：如何退化（对应 frontmatter 的 `input`）
- 无障碍：键盘入口、`aria-*`、屏幕阅读器如何处理

## 复刻提示词

见 [SKILL.md](../SKILL.md#6-合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
