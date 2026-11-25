---
id: ai-research-poster
title: "AI 研究海报 · 新瑞士生成艺术 AI Research Poster"
category: screen
styles: [swiss, fluid]
input: none
viewport: desktop
status: draft
---

# AI 研究海报 · 新瑞士生成艺术 AI Research Poster

- **风格**：瑞士排版 / 流体渐变（生成艺术）
- **来源**：用户提供的 AI Prompt · 收录于 2026-11-25
- **适用场景**：产品发布视觉、研究机构品牌页、技术大会主视觉、AI 产品落地页 Hero

> 这是一条**图像生成提示词**（给 Midjourney / DALL·E / SD 等用），产出的是参考图，不是可直接落地的 UI 规格。
> 收录它的目的是：作为整页视觉语言的方向锚点，后续拆解成实际的排版与图形规范。

## 原始提示词

```
A futuristic AI research exhibition poster and digital identity design, inspired by
Swiss editorial design and modern technology branding.

Minimal white background with large bold sans-serif typography, strict grid layout,
clean information hierarchy.

Featuring abstract computational visuals: neural network structures, particle fields,
halftone dot patterns, generative AI landscapes, digital organisms made of thousands
of tiny particles.

The visual language combines scientific precision with digital art aesthetics,
like an AI laboratory, computational art exhibition, and next-generation technology platform.

Style: Swiss modernism, Neo Swiss design, generative art, AI visualization,
futuristic editorial design, Apple-inspired minimalism, DeepMind-inspired research aesthetic.
ASCII particles. Ultra high resolution
```

## 行为

无交互。这是一张静态海报 / 视觉识别，行为层面只有"被观看"。

若转成网页，唯一的动态是背景粒子的极慢漂移（周期 `40s+`），且不应抢过排版。

## 时长与曲线
- 粒子漂移：`40000ms` 以上，`linear`，几乎察觉不到在动
- 若完全不做动效，静态版本同样成立

## 视觉语言拆解

| 维度 | 特征 |
|---|---|
| 底色 | 极简白，无渐变、无纹理 |
| 排版 | 超大粗体无衬线，严格网格，信息层级清晰 |
| 图形主体 | 神经网络结构 / 粒子场 / 半调网点 / 生成式景观 / 粒子构成的数字生物 |
| 对比策略 | 文字极简克制，图形极复杂，形成"静 vs 繁"的张力 |
| 气质 | 科学严谨 + 数字艺术，像 AI 实验室与计算艺术展 |

## 设计意图

这条提示词的核心不是某个具体图形，而是**两种极端并置**：

1. **排版极静** —— 瑞士网格、无装饰、大留白
2. **图形极动** —— 成千上万粒子的生成式结构

两者的反差就是"AI 研究"这个主题的视觉化：秩序与涌现性共存。

## 落地时的转化建议

如果要把这套视觉转成实际网页：

- **字体**：Inter / Neue Haas Grotesk，标题 `clamp(48px, 7vw, 120px)`，字重 700~800，字距 `-0.03em`
- **网格**：12 栏，`max-width: 1440px`，边距 `48px`（桌面）/ `20px`（移动）
- **色彩**：纯白底 `#FFFFFF`，文字近黑 `#0A0A0A`，**唯一强调色**留给数据或图形
- **图形**：粒子/网点部分用 Canvas 或 WebGL 生成，不要用位图；粒子数 `2000~8000`
- **半调网点**：`radial-gradient` 平铺 + `background-size: 8px 8px`，透明度 `0.06`
- **动效**：几乎不要动效，或只做极慢的粒子漂移（`40s+`），强调"静"

## 细节与反例

- **不要让图形抢过排版**。这类视觉的高级感来自"文字极其克制"，图形再怎么复杂都只是背景。
- **白底不要加噪点或纸纹**。要的就是数字时代的洁净感，加纹理反而降级。
- **不要用多种强调色**。瑞士排版的核心是单色系 + 一个信号色。
- **粒子要"有结构"**。随机撒点显得廉价，应该呈现网络拓扑、流体场或密度渐变。

## 降级
- `prefers-reduced-motion`：粒子完全静止，作为静态纹理
- 低端设备：粒子数降到 `500`，关闭 WebGL 改用 Canvas 2D
- 无 Canvas：用预渲染的静态 SVG 粒子图

## 复刻提示词

这条条目本身就是提示词，见上方「原始提示词」。
若要转成可落地 UI，请按「落地时的转化建议」逐步实现，不要直接用生成图当页面背景。
