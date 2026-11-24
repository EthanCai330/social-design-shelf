---
id: swipe-actions
title: "滑动操作 Swipe Actions"
category: gesture
styles: [quiet]
input: touch
viewport: mobile
status: verified
---
# 滑动操作 Swipe Actions

- **风格**：静谧极简
- **来源**：用户对话中提出 · 收录于 2026-11-25
- **适用场景**：消息列表、任务列表

## 行为
左滑露出操作按钮，列表项跟手 1:1，超过 72px 吸附展开。滑动时项圆角 12→16，阴影加深（被抬起）。删除图标被滑出后有"上浮 + 轻微摇摆 + 落定"的 micro-animation。右滑到底触发另一操作，带涟漪。

## 时长与曲线
吸附用 spring

## 视觉
删除 `#FF3B30`，更多按钮灰色

## 降级
`prefers-reduced-motion`：取消倾斜与图标摇摆，只保留位移。
无障碍：滑动不是唯一入口，每行需要可聚焦的删除/标记按钮。

## 细节与反例
跟手必须 1:1，有延迟就假。抬起阴影让"拖拽"有重量感。

## 复刻提示词

见 [SKILL.md](../SKILL.md#合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
