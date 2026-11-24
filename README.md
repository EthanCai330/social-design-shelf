# 设计收藏库 · Design Collection

把好看的设计，翻译成可以直接复刻的数值。

一个用于 **AI Agent 的 UI 动效与视觉设计收藏库**。你看到喜欢的设计——截图、链接、或一句话描述——
交给 AI 收进来，它会拆成结构化的规格：**行为、时长与曲线、视觉、细节与反例、降级方案**。
不是灵感板，是能直接交给前端实现的规格书。

> **28 个条目** · 全部带可交互验证原型 · 参数经过实测校验

---

## 它解决什么问题

大多数"设计灵感收藏"最后都烂在截图文件夹里，因为截图**不能变成代码**。
这个库要求每个设计都被翻译成参数：

| 收藏截图会得到 | 这个库会得到 |
|---|---|
| "这个按钮很高级" | 位移 `A * (1 - d/R)`，`R=120px`，`A=12px`，spring `260/20/1` |
| "切换很丝滑" | 指示器 spring `320/26/1`，中途宽度拉伸 8%，`200ms` 文字渐变 |
| "有点像玻璃" | `blur(24px)` + 白 72% + `inset 0 0 0 1px rgba(0,0,0,.06)` + 双层阴影 |

---

## 收录什么

| 分类 | 说明 | 数量 |
|---|---|---|
| `motion` 动效交互 | 元素自身的过渡、形变、反馈 | 10 |
| `depth` 玻璃与深度 | 层级、模糊、3D、空间关系 | 5 |
| `expand` 展开与收纳 | 内容的显露与收起 | 5 |
| `data` 数据与反馈 | 数值、进度、加载 | 4 |
| `gesture` 滚动与手势 | 由滚动或手指驱动 | 4 |

每个条目都标注了：

- **`styles`** — 视觉风格标签（静谧极简 / 暗黑奢华 / 玻璃拟态 / 瑞士排版 / 东方留白 / 流体渐变）
- **`input`** — 鼠标 `pointer` / 触摸 `touch` / 两者 `both` / 无输入 `none`
- **`viewport`** — 移动 `mobile` / 桌面 `desktop` / 通用 `both`

完整清单见 [INDEX.md](INDEX.md)。

---

## 快速开始

### 作为 Agent Skill 使用

这个目录本身就是一份 skill 定义。按你的客户端的约定放置即可：

```bash
# 方式一：克隆为一个 skill 目录
git clone <repo-url> ~/.dsh/skills/design-collection

# 方式二：作为符号链接
ln -s /path/to/repo ~/.dsh/skills/design-collection
```

`SKILL.md` 里的路径**全部相对 skill 目录**，不依赖任何绝对路径或用户名。
Claude Code、Cursor、Codex 等支持 skill / rules 的客户端也可直接复用 `SKILL.md` 的正文。

### 只想看效果

用浏览器打开 `showcase/index.html`（单文件，无依赖，无需联网）。

### 校验与重建

```bash
python validate.py               # 校验所有条目，0 错误才算通过
python build-index.py            # 由 frontmatter 重建 INDEX.md
python build-index.py --check    # CI 用：只检查是否一致
```

---

## 一个条目长什么样

```yaml
---
id: magnetic-button
title: "磁吸按钮 Magnetic Button"
category: motion
styles: [noir, quiet]
input: pointer
viewport: both
status: verified
---
```

正文六段：**行为 / 时长与曲线 / 视觉 / 细节与反例 / 降级 / 复刻提示词**。

关键是它**经得起验证**。库里的校验脚本会抓出这些隐性错误：

- 衰减方向写反（`d/R` 而非 `1 - d/R`）——会导致越远位移越大、到边界突兀跳回
- 把 `999px` 圆角当数值插值——实际渲染会被 clamp 到半高，动画前 97% 行程视觉卡死
- 声明"过冲"却给了单调贝塞尔——`cubic-bezier(0.32,0.72,0,1)` 的 y 控制点全在 `[0,1]`，物理上做不到过冲
- 给了 `stiffness` 却没给 `damping` / `mass`——参数无法复现
- 同时声称"1:1 跟手"和"带 0.85 阻尼"——自相矛盾

这些问题在纸面上看不出来，写进代码就是 bug。

---

## 个人审美画像

`taste-profile.md` 是**私人文件**，被 `.gitignore` 排除。
它记录你个人的偏好（喜欢什么手感、讨厌什么），AI 收录时会参考它。

从模板开始：

```bash
cp taste-profile.example.md taste-profile.md
```

不存在也没关系，AI 会走通用规则。

---

## 贡献

见 [CONTRIBUTING.md](CONTRIBUTING.md)。核心门槛：**可参数化、机制可辨识、不是已有条目的重复、说得出反例**。

## 许可

代码 MIT，文档 CC BY 4.0。详见 [LICENSE.md](LICENSE.md)。

**本仓库不包含他人的截图素材**——`references/` 已被排除，条目中的参数是对交互行为的原创技术描述。

## 免责声明

参数在 Chrome / Safari 上验证过，不保证在所有设备和浏览器上精确复现。生产环境请真机验证。
