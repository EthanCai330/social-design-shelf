---
name: design-collection
description: >-
  Manage and reuse a personal UI motion & visual design collection stored under this skill directory.
  Trigger ONLY when the user explicitly wants to (1) save/archive a UI reference into the library
  — a screenshot, an image, a web/Dribbble/Mobbin/App Store link, a one-line interaction idea, or a
  taste preference ("收录这个", "存进设计库", "这个好看记一下", "save this design", "add to my design library");
  (2) search or retrieve already-saved patterns ("我之前收藏过", "设计库里有没有", "查一下我的设计库",
  "find that card from my collection"); or (3) prototype or implement a component from a saved entry
  ("按库里的磁吸按钮做一个", "看看这个条目的效果", "build the pull-to-expand summary").
  Do NOT trigger for general UI coding, routine frontend work, design critiques or reviews,
  code review, or casual aesthetic remarks that carry no archival or reuse intent.
---

# 设计收藏库（Design Collection）

把用户看到的每一个好设计，转化成**结构化、可复用的视觉与动效规格**，长期积累成私人设计库。

## 1. 库的位置

**所有路径都相对本文件所在目录**，不要使用绝对路径，不要假设用户的用户名或桌面位置：

```
design-collection/
  SKILL.md                 ← 本文件
  README.md                ← 面向人类的使用说明（可开源）
  CONTRIBUTING.md          ← 收录门槛与流程
  INDEX.md                 ← 自动生成，勿手改
  build-index.py           ← 由 frontmatter 重建 INDEX.md
  validate.py              ← 条目校验（CI 用）
  taste-profile.md         ← 可选：用户的私人审美画像，不存在就跳过
  taste-profile.example.md ← 审美画像模板（可开源）
  components/              ← 组件级条目：<slug>.md
  screens/                 ← 整页 / 整屏条目：<slug>.md
  examples/                ← 可运行的最小原型（可选，用于验证参数）
```

`taste-profile.md` 是**私人文件**，通常被 `.gitignore` 排除。读到就参考，读不到就走通用规则，不要报错。

## 2. 数据模型：分类与风格正交

每个条目头部必须有 YAML frontmatter：

```yaml
---
id: magnetic-button          # 必须等于文件名（不含 .md）
title: "磁吸按钮 Magnetic Button"
category: micro              # 单选，决定 INDEX 分组
styles: [noir, quiet]        # 多选，只作标签
input: pointer               # pointer | touch | both | none
viewport: mobile             # mobile | desktop | both
status: verified             # draft | verified
---
```

**`category` 与 `styles` 是两个独立维度，不要混用：**

分类遵循 **「语义优先」（semantics first）** 原则——按**作用对象**分类，而不是按技术实现方式。
这个原则来自 ReactBits（215+ 组件库）的组织方式。

| category | 含义 | 判定问题 |
|---|---|---|
| `text` | 文字动效 | **作用在文字上**吗？（逐字入场、扫光、乱码） |
| `effect` | 动效效果 | 是**效果本身**吗？（光标、拖尾、悬停、入场） |
| `micro` | 微小交互 | 是**小而精的交互件**吗？（开关、按钮、指示器、校验反馈） |
| `structure` | 结构组件 | 有**结构或布局**吗？（导航、抽屉、浮层、列表、手势容器） |
| `surface` | 背景与材质 | 作用在**整个面板或背景**上吗？（边框、玻璃、极光） |
| `data` | 数据呈现 | 展示**数值、进度、加载**吗？ |
| `screen` | 整页与氛围 | 是**整页或整体视觉**吗？（放 `screens/` 目录） |

**判定顺序**（取第一个匹配的）：

1. 作用对象是**文字**？→ `text`
2. 作用对象是**背景/边框/材质**？→ `surface`
3. 是**小而精**的交互件（可独立点击/切换）？→ `micro`
4. 展示**数据**？→ `data`
5. 有**结构或布局**（包含多个子元素、有开合/拖拽）？→ `structure`
6. 其余**效果本身** → `effect`

**反例**（容易分错的）：

- 「磁吸按钮」→ `micro`（是小交互件），不是 `effect`
- 「3D 倾斜卡片」→ `effect`（是悬停效果），不是 `structure`
- 「形变对话框」→ `structure`（有布局结构），不是 `effect`
- 「文字流光」→ `text`，不是 `effect`——它只作用于字形
- 「极光背景」→ `surface`（作用在背景），不是 `effect`

`styles` 取值：`quiet` 静谧极简 · `noir` 暗黑奢华 · `glass` 玻璃拟态 · `swiss` 瑞士排版 · `oriental` 东方留白 · `fluid` 流体渐变

`input` 说明鼠标/触摸：`pointer` 表示强依赖 hover，`touch` 表示手势驱动，`none` 表示自动播放。
`viewport` 决定生成原型时的画布尺寸——**不要一律用手机尺寸**，桌面组件用桌面画布。

## 3. 单个条目的格式

文件名用 kebab-case 英文（`<slug>.md`），正文六段：

```markdown
# 中文名 英文名

- **风格**：静谧极简 / 暗黑奢华
- **来源**：Dribbble · https://... · 收录于 2026-11-25
- **适用场景**：主 CTA、悬浮操作

## 行为
触发方式 + 驱动方式 + 状态变化，写清公式与数值

## 时长与曲线
ms 数 + cubic-bezier 或 spring 参数（必须写明 mass）

## 视觉
hex + 圆角 + 内边距 + 阴影/描边 + 毛玻璃配方

## 细节与反例
离开如何处理；要避免什么；降级方案

## 复刻提示词
见下方「合成复刻 prompt」，不要在这里复述正文数值
```

## 4. 收录流程

1. **先看**。图片就真读；链接就 web_fetch 真读；不许凭标题臆测。
2. **判断粒度**。可交互元素 → `components/`；整页或整体观感 → `screens/`；纯偏好 → `taste-profile.md`。
3. **查重**。先读 `INDEX.md`。**同类**指同一交互机制（不是同名、也不是同风格）。命中就更新原条目，
   并在条目末尾追加一行 `- YYYY-MM-DD：<改了什么>` 作为迭代记录。
4. **写 frontmatter**。字段必须齐全，`id` 与文件名一致。
5. **重建索引**。运行 `python build-index.py`。**永远不要手改 `INDEX.md`。**
6. **校验**。运行 `python validate.py`，必须 0 错误。
7. **同步 README**（必做）。只要有下列任一变化，就必须更新 `README.md`：
   - 条目总数变了（README 顶部和「收录什么」表格都要改）
   - 分类或各分类数量变了
   - demo 组件数变了

   README 里的数字错了比没写还糟——它是仓库门面，访客第一眼看的就是它。
8. **回报**。一句话：收了什么、放哪、关键参数有哪几个。

## 5. 参数书写规范（最容易出错的地方）

收录时必须自检这几条，它们是这个库是否可信的核心：

- **衰减函数方向**。磁吸/放大这类"越近越强"的交互，系数必须是 `1 - d/R`（衰减到边缘归零），
  不能写成 `d/R`（那会导致越远越大、到边界突然跳回）。
- **圆角插值**。`border-radius: 999px` 在真实渲染时会被 clamp 到元素半高（36px 高的胶囊实际渲染 18px）。
  要做动画，从 `18px`（= 高度/2）插值，**不要从 999px 插值**，否则前 97% 行程视觉卡死。
- **过冲与曲线**。`cubic-bezier(x1,y1,x2,y2)` 只有在某个 y 控制点 `> 1` 时才会过冲。
  `cubic-bezier(0.32,0.72,0,1)` 是单调的，**不可能**产生过冲——要么删掉"过冲"，要么换 spring 或改 y 值。
- **spring 参数**。给 stiffness 就必须给 damping 和 mass，否则复现不了。
  粗略关系：`ζ = damping / (2 * sqrt(stiffness * mass))`；
  `ζ ≈ 1` 无过冲，`ζ ≈ 0.6` 约 8% 过冲。零过冲场景用 `damping >= 2 * sqrt(stiffness * mass)`。
- **跟手系数不要自相矛盾**。"1:1 跟手"和"带 0.85 阻尼"不能同时写；要减弱跟手就明说系数。
- **不用二选一**。规格里不能出现"或""可以不动"这类分支，否则复刻不可控。
- **降级方案**。必须在「细节与反例」里写清：触屏/桌面如何退化，以及 `prefers-reduced-motion` 下如何降级。

## 6. 合成复刻 prompt

用户要复刻或实现某个条目时，**不要**照抄条目里的提示词（条目本身也不该存长提示词）。
按下面的方式动态合成：

1. 读条目正文的「行为 / 时长与曲线 / 视觉 / 细节与反例」。
2. 问清楚或推断**目标技术栈**：原生 CSS/JS、React + Framer Motion、Vue、SwiftUI、Flutter。
3. 按技术栈输出对应实现：Framer Motion 给 `transition={{type:'spring', stiffness, damping, mass}}`；
   原生给 `cubic-bezier()` 或 Web Animations API；SwiftUI 给 `.spring(response:dampingFraction:)`。
4. 数值直接从条目取，不要重新发明。

## 7. 生成可运行原型

- 画布按条目的 `viewport` 选：`mobile` → 390×844；`desktop` → 1280×720；`both` → 桌面画布居中 + 移动壳。
- 单文件 HTML，内联 CSS + 原生 JS，无外部依赖，双击可开。
- 参数从条目取，不要临场发挥。
- 有 `examples/` 里对应的验证原型时，优先复用并对照。

## 8. 通用设计原则（基线，不是判据）

这些是**原设计未指定时的兜底值**，不是收录门槛——收录时应忠实还原原设计，即使它违反下列基线。

1. 克制：每屏一个视觉主角。
2. 一致中的微差：圆角 2~3 种、字号 5~6 级。
3. 控制对比度：不必用纯黑配纯白。
4. 打开慢、关闭快：打开 300~420ms，关闭 150~220ms。
5. 数字有量级：位移 4~12px、时长 150~600ms、spring stiffness 260~500。
6. 曲线统一：默认主曲线 `cubic-bezier(0.32,0.72,0,1)`。

## 9. 边界

- 不收录用户没提到、也没明显设计价值的东西。
- 不做没被要求的设计评审或改版。
- 收录是追加行为，不删除用户已有条目；除非用户明确说要删。
- 不要往用户桌面或其他目录写副本；本 skill 目录是唯一权威位置。
