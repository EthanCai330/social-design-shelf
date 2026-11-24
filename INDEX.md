# 设计收藏库 · 总目录

> **本文件由脚本自动生成，请勿手动编辑。**
> 修改条目后运行 `python build-index.py` 重建。
>
> 分类（category）决定分组，视觉风格（styles）只作标签——两者正交。

**统计**：28 个条目

**按输入方式**：`both` 12 · `touch` 7 · `pointer` 5 · `none` 4

**按视口**：`mobile` 16 · `both` 10 · `desktop` 2

---

## 动效交互 Motion

- [动效分段控制器 Animated Segmented Control](components/animated-segmented-control.md) — 宽度形变是灵魂，没有它就像低端 tab  
  <sub>`quiet` · 输入 `both`</sub>
- [可展开工具栏 Expandable Toolbar](components/expandable-toolbar.md) — 图标必须"依次"滑出，一起出现就没有节奏感  
  <sub>`glass` · 输入 `both`</sub>
- [墨晕触摸反馈 Ripple / Ink Touch](components/ripple-ink-touch.md) — 波纹颜色必须跟随该元素文字色，固定灰会在彩色按钮上突兀  
  <sub>`oriental` `quiet` · 输入 `touch`</sub>
- [弹力开关 Elastic Toggle](components/elastic-toggle.md) — 按压拉伸最容易做出"硅胶感"，很多 App 都缺这一步  
  <sub>`quiet` · 输入 `touch`</sub>
- [形变图标按钮 Morphing Icon Button](components/morphing-icon-button.md) — 最常见的错误是直接旋转，看起来呆板  
  <sub>`quiet` · 输入 `both`</sub>
- [悬浮导航 Floating Navigation](components/floating-navigation.md) — 切换时导航条要有一个"高度瞬间缩 4px 再回弹"的挤压感，这是它区别于普通 tab 的地方  
  <sub>`glass` · 输入 `both`</sub>
- [放大 Dock Magnification Dock](components/magnification-dock.md) — 放大必须由光标位置连续驱动，不能用"进入时触发一次动画"  
  <sub>`glass` · 输入 `pointer`</sub>
- [磁吸按钮 Magnetic Button](components/magnetic-button.md) — 光标离开用 spring，不要线性归位  
  <sub>`noir` `quiet` · 输入 `pointer`</sub>
- [轮换文字 Rotating Text](components/rotating-text.md) — 必须 overflow hidden 裁切，否则文字会从上方"飞过去"穿帮  
  <sub>`swiss` `oriental` · 输入 `none`</sub>
- [错峰入场 Staggered List Reveal](components/staggered-list-reveal.md) — 错峰超过 6 张用户就会等  
  <sub>`quiet` · 输入 `none`</sub>

## 玻璃与深度 Glass & Depth

- [3D 倾斜卡片 3D Tilt Card](components/3d-tilt-card.md) — 不要超过 10° 旋转，多了会晕  
  <sub>`noir` `fluid` · 输入 `pointer`</sub>
- [Spotlight 光追卡片 Spotlight Card](components/spotlight-card.md) — 描边高亮弧线是高级感的来源，只有光斑没有描边就会显得廉价  
  <sub>`noir` · 输入 `pointer`</sub>
- [形变对话框 Morphing Dialog](components/morphing-dialog.md) — 核心是"不消失再弹出"  
  <sub>`glass` `quiet` · 输入 `both`</sub>
- [智能浮层 Smart Popover](components/smart-popover.md) — transform-origin 必须锚定触发元素，不然就是"凭空出现"  
  <sub>`glass` · 输入 `both`</sub>
- [玻璃底部抽屉 Glass Sheet](components/glass-sheet.md) — "延迟 120ms 隐藏"是防闪白的关键，很多人漏了  
  <sub>`glass` · 输入 `touch`</sub>

## 展开与收纳 Expand & Reveal

- [下拉展开摘要 Pull-To-Expand Summary](components/pull-to-expand-summary.md) — 不要写"或保持不动由明细补充"这类二选一——规格必须唯一，否则复刻结果不可控  
  <sub>`glass` `quiet` · 输入 `touch`</sub>
- [可展开卡片 Expandable Card](components/expandable-card.md) — 高度不能一次性跳变，也不能用固定 max-height 硬撑  
  <sub>`quiet` · 输入 `both`</sub>
- [可展开头像组 Expandable Avatar Group](components/expandable-avatar-group.md) — 重叠必须有描边：两张头像直接叠会看不出边界，加 2px 描边（跟随页面底色）立刻干净  
  <sub>`quiet` · 输入 `both`</sub>
- [横向手风琴 Horizontal Accordion](components/horizontal-accordion.md) — 宽度变化用 flex-grow 或固定宽度过渡都行，但不要用 max-width 硬撑  
  <sub>`swiss` `oriental` · 输入 `both`</sub>
- [组件托盘 Component Tray](components/component-tray.md) — 托盘必须"从主组件下面滑出来"，即 z-index 低于主组件、被其遮挡上缘  
  <sub>`quiet` `glass` · 输入 `both`</sub>

## 数据与反馈 Data & Feedback

- [底色进度任务 Liquid Progress Task](components/liquid-progress-task.md) — 文字换色是这招的隐藏难点：填充线扫过文字时必须同步换色，否则中途完全读不清  
  <sub>`quiet` · 输入 `both`</sub>
- [数字滚动 Number Ticker](components/number-ticker.md) — 不用等宽字体会导致数字抖动，这是廉价感的主要来源  
  <sub>`swiss` `noir` · 输入 `none`</sub>
- [流光骨架屏 Shimmer Skeleton](components/shimmer-skeleton.md) — 骨架和内容不能同时消失，要有 100ms 交叉  
  <sub>`quiet` · 输入 `none`</sub>
- [进度环 Animated Counter Ring](components/animated-counter-ring.md) — 不要瞬间跳到新值  
  <sub>`quiet` `noir` · 输入 `both`</sub>

## 滚动与手势 Scroll & Gesture

- [渐进模糊头部 Progressive Blur Header](components/progressive-blur-header.md) — 关键在"连续"，一旦是切换就会闪  
  <sub>`quiet` `glass` · 输入 `touch`</sub>
- [滑动操作 Swipe Actions](components/swipe-actions.md) — 跟手必须 1:1，有延迟就假  
  <sub>`quiet` · 输入 `touch`</sub>
- [磁性拖拽 Magnetic Cursor Drag](components/magnetic-cursor.md) — 倾斜方向要跟速度，而不是固定角度  
  <sub>`noir` · 输入 `pointer`</sub>
- [跟手放大图标排 Finger-Tracking Icon Row](components/finger-tracking-icon-row.md) — 松手后所有图标必须归位，只有选中的保留轻微放大  
  <sub>`quiet` · 输入 `touch`</sub>

---

## 风格速查

| 风格 | 底色 | 关键动作 |
|---|---|---|
| 静谧极简 Quiet Minimal | `#FAF9F7` | 删分割线，只靠留白分层 |  
| 暗黑奢华 Noir Luxe | `#0B0B0D` | 低饱和 + 金属细渐变 |  
| 玻璃拟态 Glass | `动态底图` | 玻璃必须有内容在动 |  
| 瑞士排版 Swiss | `纯黑白` | 超大标题 + 极细正文 |  
| 东方留白 Oriental | `#F7F5F0` | 单屏 ≤5 元素，慢动效 |  
| 流体渐变 Fluid | `多色斑` | 背景花，前景极简 |  
