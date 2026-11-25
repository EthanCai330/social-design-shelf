---
id: aurora-background
title: "极光背景 Aurora"
category: surface
styles: [fluid, noir]
input: none
viewport: both
status: draft
---

# 极光背景 Aurora

- **风格**：流体渐变 / 暗黑奢华
- **来源**：用户提供的提示词 · 收录于 2026-11-25
- **适用场景**：落地页 Hero、登录页背景、AI 产品首屏

> 原始提示词：Aurora：彩色光晕缓慢流动，背景轻轻呼吸。深蓝背景放紫、青、绿色大光斑，模糊 80px，各以约 12 秒周期漂移交融。

## 行为

深色底上有几团巨大的彩色光斑，各自缓慢漂移、彼此交叠融合，整体像极光在流动。
没有明确边界，色与色之间是柔和过渡。整体亮度有极缓的呼吸。

这是**纯背景**效果，上面可以放内容，但必须注意对比度。

## 时长与曲线
- 每个光斑漂移周期：`12s` 左右，但**各光斑周期不同**（如 11s / 13s / 14s），避免同步
- 漂移路径：椭圆或八字的闭合轨迹，`linear` 或极缓的 `ease-in-out`
- 整体呼吸：`8s`，`ease-in-out`，亮度 `0.9 ↔ 1.0`
- 无需缓动"弹"感——所有运动都必须平滑无顿挫

## 视觉
- 底色：深蓝 `#060B1A` 或 `#0A0E1F`
- 光斑颜色：紫 `#7B3FE4`、青 `#00D4FF`、绿 `#3FE4A0`
- 光斑尺寸：响应式，直径约为视口的 `60%~110%`
- 模糊：`blur(80px)`
- 不透明度：每团 `0.35~0.55`
- 混合模式：`screen` 或 `plus-lighter`，让交叠处自然提亮

**实现骨架**
```css
.aurora {
  position: fixed; inset: 0;
  background: #060B1A;
  overflow: hidden;
  z-index: -1;
}
.aurora i {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  mix-blend-mode: screen;
  will-change: transform;
}
.aurora i:nth-child(1) { width: 90vmax; height: 90vmax; background: #7B3FE4; opacity: .45; animation: drift1 12s ease-in-out infinite alternate; }
.aurora i:nth-child(2) { width: 70vmax; height: 70vmax; background: #00D4FF; opacity: .40; animation: drift2 14s ease-in-out infinite alternate; }
.aurora i:nth-child(3) { width: 60vmax; height: 60vmax; background: #3FE4A0; opacity: .32; animation: drift3 11s ease-in-out infinite alternate; }
@keyframes drift1 { from { transform: translate(-20%, -10%) } to { transform: translate(10%, 15%) } }
/* drift2/drift3 用不同方向与距离 */
```

## 细节与反例

- **周期必须各不相同**。全部 12s 会在同一时刻集体转向，一眼看出"机器感"。
- **不要用渐变做**。`linear-gradient` 是死的，必须用模糊后的圆形色块叠加才能"融"。
- **必须 `will-change: transform`**。移动 blob 时只改变换、不改尺寸/位置属性，
  否则浏览器每帧重绘 + 重算 blur，性能直接崩。
- **blur 值不要低于 60px**。低于这个会露出圆块的边缘。
- **内容对比度是最大风险**。极光背景上放白字，在亮色光斑经过时会完全读不清。
  必须给内容区加遮罩或半透明面板。
- 移动端：`blur(80px)` 很吃 GPU，建议降到 `blur(50px)` 并减少为 2 团。

## 降级
- `prefers-reduced-motion`：冻结在第一帧（静态极光），不做漂移
- 低端设备：光斑减少到 2 团，blur 降到 50px
- 不支持 `mix-blend-mode`：改用更低的不透明度叠加

## 复刻提示词

见 [SKILL.md](../SKILL.md#6-合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
