---
id: infinite-marquee
title: "无限滚动 Infinite Marquee"
category: motion
styles: [swiss]
input: none
viewport: both
status: verified
---

# 无限滚动 Infinite Marquee

- **风格**：瑞士排版
- **来源**：[Magic UI](https://magicui.design/) · 收录于 2026-11-25
- **许可**：Magic UI 采用 MIT 许可，可自由使用。
- **适用场景**：客户 Logo 墙、技术栈展示、评价轮播、公告条

> 内容无缝循环滚动，看不到起点也看不到终点。

## 行为

内容整体向左平移，到达一个完整副本的宽度后**瞬间复位**。
因为复位时第二份内容正好处在第一份的起始位置，视觉上完全无断层。

支持：
- 反向（向右滚）
- 垂直（上下滚）
- 悬停暂停
- 自定义重复份数

## 时长与曲线

- 默认 `--duration: 40s`
- 缓动：**`linear`** —— 必须线性，任何缓动都会让循环出现明显的"顿挫"
- 无限循环

## 视觉

**核心公式**（这是整个效果的关键）：

```css
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(calc(-100% - var(--gap))); }
}
```

`-100% - gap` 的 **`- gap` 部分最容易漏**：
如果只写 `-100%`，两份内容之间会少一个间距，接缝处会闪一下。

**容器结构**：内容需要**复制一份**拼在后面，且外层要 `overflow: hidden`。

```html
<div class="marquee" style="--duration: 40s; --gap: 2rem;">
  <div class="marquee-track">
    <!-- 第一份 -->
    <div class="marquee-group">...items...</div>
    <!-- 第二份，完全相同 -->
    <div class="marquee-group" aria-hidden="true">...items...</div>
  </div>
</div>
```

```css
.marquee {
  overflow: hidden;
  display: flex;
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
}
.marquee-track {
  display: flex;
  gap: var(--gap, 2rem);
  animation: marquee var(--duration, 40s) linear infinite;
}
.marquee-group {
  display: flex;
  gap: var(--gap, 2rem);
  flex-shrink: 0;
}
/* 悬停暂停 */
.marquee:hover .marquee-track { animation-play-state: paused; }
/* 反向 */
.marquee--reverse .marquee-track {
  animation-direction: reverse;
}
/* 垂直 */
@keyframes marquee-vertical {
  from { transform: translateY(0); }
  to   { transform: translateY(calc(-100% - var(--gap))); }
}
```

## 关键实现要点

1. **内容必须复制**。只有一份内容无法循环。
2. **第二份加 `aria-hidden="true"`**，否则屏幕阅读器会读两遍。
3. **`- gap` 不能漏**（见上）。
4. **两侧渐隐遮罩**（`mask-image`）让内容"淡入淡出"，比硬截断高级得多。
5. **容器必须 `overflow: hidden`**，否则会撑破布局。

## 数量与时长的关系

`--duration` 应该与内容总宽成正比，否则速度观感不一致：

- 内容宽度约 `1000px` → `20~30s`
- 内容宽度约 `2000px` → `40~60s`

**不要固定时长**：内容变多时，固定时长会让滚动变快，看起来很慌。

## 细节与反例

- **不要用 `<marquee>` 标签**。已废弃，且无法控制细节。
- **不要用 `linear` 之外的速度曲线**。这是无缝循环的硬要求。
- **接缝处必须无间隙**。漏掉 `- gap` 是最常见的翻车点。
- **不要在可交互元素上做 marquee**。用户在移动的按钮上点不中。
- **必须提供暂停方式**。WCAG 2.2.2 要求自动播放的内容可暂停——悬停暂停只是补充，
  移动端还需要额外的暂停按钮。
- **相邻元素间距要一致**。首尾相接处的间距必须是 `gap`，不能因为结构而不同。

## 降级
- `prefers-reduced-motion`：停止动画，内容静态显示（并允许水平滚动）
- 无障碍：第二份加 `aria-hidden="true"`；提供暂停按钮
- 窄屏：减少同时可见的元素数量

## 复刻提示词

见 [SKILL.md](../SKILL.md#6-合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
