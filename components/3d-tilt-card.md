---
id: 3d-tilt-card
title: "3D 倾斜卡片 3D Tilt Card"
category: depth
styles: [noir, fluid]
input: pointer
viewport: desktop
status: verified
---
# 3D 倾斜卡片 3D Tilt Card

- **风格**：暗黑奢华 / 流体渐变
- **来源**：用户对话中提出 · 收录于 2026-11-25
- **适用场景**：作品集卡片、产品展示、Bento

## 行为
鼠标移动根据相对中心位置计算旋转：`rotateX = -(dy/height)×8°`，`rotateY = (dx/width)×10°`，perspective 900px。表面高光层随角度移动，内容层 translateZ(24px)。离开 500ms spring 回 0°，允许 1.5° 过冲。

## 时长与曲线
跟手实时；离开 spring 500ms，过冲 1.5°。

## 视觉
- `transform-style: preserve-3d`
- 外层阴影 `0 24px 48px rgba(0,0,0,0.10)`，倾斜时同步偏移

## 变体记录

### 变体 B：大倾角 · 短透视（2026-11-25 收录自用户提示词）

上图为基准方案（倾角 8°/10°，perspective 900px，spring 回正）。

用户另提供一组更激进的参数：

| 参数 | 基准 | 变体 B |
|---|---|---|
| 最大倾角 | `8°` / `10°` | **`12°`**（统一） |
| 透视距离 | `900px` | **`800px`**（更近，透视更强） |
| 回正 | spring 500ms，允许 1.5° 过冲 | **`400ms` 平滑回正，无过冲** |

```css
/* 变体 B */
.tilt { perspective: 800px; }
.tilt-inner {
  transition: transform .4s cubic-bezier(0.32, 0.72, 0, 1);
}
/* rotateX / rotateY 最大 ±12° */
```

**取舍说明**：
- 变体 B 透视更近、倾角更大，**视觉冲击更强**，但容易显得"过头"，适合展示型卡片
- 基准方案更克制，适合嵌在信息密集的界面里
- 变体 B 用贝塞尔而非 spring，回正更"干净"，但少了物理回弹感


## 降级
`prefers-reduced-motion`：禁用倾斜，仅保留 hover 阴影加深。
触屏：按压时轻微缩放 0.98 代替倾斜。

## 细节与反例
不要超过 10° 旋转，多了会晕。触屏设备禁用倾斜。内容层必须真抬高 translateZ，否则是假 3D。

## 复刻提示词

见 [SKILL.md](../SKILL.md#合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
