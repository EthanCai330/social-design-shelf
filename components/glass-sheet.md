---
id: glass-sheet
title: "玻璃底部抽屉 Glass Sheet"
category: structure
styles: [glass]
input: touch
viewport: mobile
status: verified
---
# 玻璃底部抽屉 Glass Sheet

- **风格**：玻璃拟态
- **来源**：用户对话中提出 · 收录于 2026-11-25
- **适用场景**：详情面板、分享菜单、设置

## 行为
从底部上滑的面板，初始露出 120px。上滑跟随手指，松手按速度吸附到全屏 / 半屏 / 收起三档。拖拽中遮罩 0→35% 与位移比例同步，背后内容缩到 0.96x 并变暗。收起时延迟 120ms 才隐藏，避免闪白。

## 时长与曲线
吸附 spring

## 视觉
顶部两道细弧线高光模拟玻璃边缘反射

## 降级
`prefers-reduced-motion`：面板直接显示/隐藏，无跟手动画。
不支持 backdrop-filter：改用不透明底加阴影。给 `aria-modal` 与焦点陷阱。

## 细节与反例
"延迟 120ms 隐藏"是防闪白的关键，很多人漏了。

## 复刻提示词

见 [SKILL.md](../SKILL.md#合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
