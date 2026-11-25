---
id: expandable-toolbar
title: "可展开工具栏 Expandable Toolbar"
category: structure
styles: [glass]
input: both
viewport: mobile
status: verified
---
# 可展开工具栏 Expandable Toolbar

- **风格**：玻璃拟态
- **来源**：用户对话中提出 · 收录于 2026-11-25
- **适用场景**：编辑器浮动工具栏、FAB 展开

## 行为
收起时只有一个 44×44 按钮（圆角 14px）。点击后横向生长成胶囊，图标从左向右依次滑出（每个延迟 50ms），主图标旋转 45° 变成 ×。再点或点外部，图标逆序收回。

## 时长与曲线
- 展开：图标错峰 50ms，总约 350ms，含 +6px 宽度过冲
- 收回：350ms

## 视觉
胶囊按内容自适应宽度，毛玻璃 + 白色 70%

## 降级
`prefers-reduced-motion`：工具图标直接显示，不加错峰。
窄屏：自动换行为两行布局。

## 细节与反例
图标必须"依次"滑出，一起出现就没有节奏感。主图标 45° 旋转是点睛。

## 复刻提示词

见 [SKILL.md](../SKILL.md#合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
