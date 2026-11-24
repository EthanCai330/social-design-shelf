---
id: horizontal-accordion
title: "横向手风琴 Horizontal Accordion"
category: expand
styles: [swiss, oriental]
input: both
viewport: both
status: verified
---
# 横向手风琴 Horizontal Accordion

- **风格**：瑞士排版 / 东方留白
- **来源**：用户提供的提示词 · 收录于 2026-11-25
- **适用场景**：作品分类、图集、功能分区、活动会场

## 行为
几个竖条并排，默认都很窄，只显示图标和竖排名称。点中一条，它横向展开变宽，其他条同步收窄。展开后的内容等宽度变化结束再淡入，不与宽度动画同时出现。

## 时长与曲线
- 宽度变化：420–500ms，`cubic-bezier(0.32,0.72,0,1)`
- 内容淡入：延迟到宽度结束，200ms，translateY 8px → 0
- 竖排名称在展开条上淡出（120ms），在新展开条的内容里淡入

## 视觉
- 收起条约 64–72px 宽，展开条约占容器 60–70%
- 竖排名称用 `writing-mode: vertical-rl`，居中
- 竖条间 8px 间隙，圆角 16px，各自独立圆角

## 降级
`prefers-reduced-motion`：宽度直接切换，内容同步显示。
窄屏：改为纵向手风琴。键盘：Tab 到每条，Enter 展开。

## 细节与反例
- **"等宽度结束再淡入"是灵魂**：内容跟着宽度一起挤进来，会显得很挤、很廉价。宁可中间有 100ms 空白。
- 竖排文字在窄条上必须真正竖排（vertical-rl），只是缩小字体会显得像故障。
- 宽度变化用 flex-grow 或固定宽度过渡都行，但不要用 max-width 硬撑。
- 其他条同步收窄意味着总宽度恒定，容器不能跳动。

## 复刻提示词

见 [SKILL.md](../SKILL.md#合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
