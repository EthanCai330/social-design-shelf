---
id: elastic-toggle
title: "弹力开关 Elastic Toggle"
category: motion
styles: [quiet]
input: touch
viewport: mobile
status: verified
---
# 弹力开关 Elastic Toggle

- **风格**：静谧极简
- **来源**：用户对话中提出 · 收录于 2026-11-25
- **适用场景**：设置项开关

## 行为
按压时滑块横向拉伸 6px（橡皮感），松手回正。切换时滑块 spring 滑向另一端，轨道颜色渐变。开启时滑块位置扩散一层微弱径向光。

## 时长与曲线
- 滑块：spring，`stiffness 500 / damping 30 / mass 1`（ζ≈0.67，回弹明显，符合"弹力开关"定位）
- 轨道变色：200ms
- 光：150ms

## 视觉
轨道 51×31，圆角 15.5px；`#E5E5EA` → `#34C759`

## 降级
`prefers-reduced-motion`：滑块直接位移，不做拉伸与过冲。
必须用 `<input type="checkbox" role="switch">` 保证无障碍与表单提交。

## 细节与反例
按压拉伸最容易做出"硅胶感"，很多 App 都缺这一步。

## 复刻提示词

见 [SKILL.md](../SKILL.md#合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。

