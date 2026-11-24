---
id: magnetic-cursor
title: "磁性拖拽 Magnetic Cursor Drag"
category: gesture
styles: [noir]
input: pointer
viewport: desktop
status: verified
---
# 磁性拖拽 Magnetic Cursor Drag

- **风格**：动效交互
- **来源**：用户对话中提出 · 收录于 2026-11-25
- **适用场景**：看板、可排序卡片、收藏夹

## 行为
拖拽时卡片 scale 1.03 并沿拖动速度方向倾斜 2°，松开 spring 吸回或吸到最近位置，落定瞬间 6px 挤压（squash & stretch）再恢复。拖动时其他卡片按距离轻微推开（每张最多 6px），形成"人浪"。

## 时长与曲线
- 拖拽跟手：由指针位移实时驱动，无过渡延迟
- 松手吸附：spring，`stiffness 320 / damping 28 / mass 1`（ζ≈0.78）
  该 spring 有轻微过冲，这是刻意的物理手感；吸附过程中的位移插值本身用单调曲线，无过冲
- 落定挤压：squash & stretch 340ms，`cubic-bezier(0.32,0.72,0,1)`（单调，无过冲）
- 周围卡片让位：200ms，`cubic-bezier(0.32,0.72,0,1)`

## 视觉
- 卡片：圆角 `12px`，白底或深卡 `#131315`，`box-shadow: 0 0 0 1px rgba(0,0,0,.03), 0 1px 3px rgba(0,0,0,.04)`
- 拖拽中阴影加深：`0 10px 26px rgba(0,0,0,.13)`
- 拖拽中 z-index 提升，其他卡片降低
- 倾斜角度上限 `±2°`（超过会显得失控）

## 降级
- `prefers-reduced-motion`：关闭倾斜与人浪，仅保留 1:1 跟手与吸附
- 触屏：倾斜改为按压反馈，松手吸附逻辑不变

## 细节与反例
倾斜方向要跟速度，而不是固定角度。周围卡片被推开是让人感觉"有物理世界"的关键。

## 复刻提示词

见 [SKILL.md](../SKILL.md#合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
