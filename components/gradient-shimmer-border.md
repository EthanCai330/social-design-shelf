---
id: gradient-shimmer-border
title: "多色渐变流光边框 Multi-color Gradient Shimmer Border"
category: surface
styles: [fluid, glass]
input: none
viewport: both
status: draft
---

# 多色渐变流光边框 Multi-color Gradient Shimmer Border

- **风格**：流体渐变 / 玻璃拟态
- **来源**：用户提供的提示词 · 收录于 2026-11-25
- **适用场景**：AI 产品卡片、高级会员卡、暗色界面重点模块

> 原始提示词：Multi-color gradient shimmer border, smooth flowing light along edge, iridescent neon transition, futuristic UI glassmorphism panel, dynamic rainbow stroke, cyberpunk tone, high-tech interface.

## 行为

沿卡片边框流动的多色光带，不是静态描边，而是**沿周长持续移动的一段渐变**。
光带经过的位置颜色在彩虹色相上连续变化；卡片内部是半透明玻璃面板，光带在内部形成微弱的色彩渗染。

无交互，纯自动播放的装饰层。

## 时长与曲线
- 光带环绕一周：`6000ms`，`linear`（必须是线性，任何缓动都会让环绕出现"顿挫"）
- 色相偏移：与环绕同步，整周完成 `360°` 色相旋转
- 发光呼吸：`4000ms` 周期，`ease-in-out`，透明度在 `.55 → .85` 之间

## 视觉

**推荐实现：conic-gradient 旋转 + mask 挖空**

```css
.shimmer-border {
  position: relative;
  border-radius: 20px;
  padding: 1.5px;                 /* 边框粗细 */
  background: conic-gradient(
    from var(--angle),
    #7B61FF, #00E0FF, #FF4FD8, #FFB547, #7B61FF
  );
  animation: spin 6s linear infinite;
}
.shimmer-border::before {
  content: '';
  position: absolute;
  inset: 1.5px;
  border-radius: 18.5px;          /* 外圆角 - 边框粗细 */
  background: rgba(20, 20, 26, 0.72);
  backdrop-filter: blur(24px) saturate(140%);
}
@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
@keyframes spin { to { --angle: 360deg; } }
```

关键点：
- `@property --angle` 是让 conic-gradient 可动画的前提，没有它渐变不会转
- 内圆角 = 外圆角 − 边框粗细，否则内角会露出背景
- 光带颜色首尾必须相接（示例里首尾都是 `#7B61FF`），否则环绕时会有接缝

**发光层**：在边框外侧再叠一层 `box-shadow: 0 0 24px rgba(123,97,255,.35), 0 0 60px rgba(0,224,255,.18)`，随呼吸动画改变透明度。

**内部渗染**：玻璃层加 `background: linear-gradient(135deg, rgba(123,97,255,.08), rgba(0,224,255,.05))`，让内部不是死板的灰。

## 细节与反例

- **必须线性动画**。用 `ease` 会让光带在一圈里明显加速减速，像卡住。
- **色相跨度不要超过 4 段**。5 段以上在 1.5px 边框上会糊成灰白，看不出"多色"。
- **不要在亮色背景上用**。这个效果依赖暗底对比，白底上会失色成浅彩色描边，廉价感明显。
- **边框不要超过 2px**。3px 以上光带会变成"粗彩条"，失去流光感。
- 性能：`conic-gradient` + `@property` 动画在低端安卓上可能掉帧，降级见下。

## 降级
- `prefers-reduced-motion`：冻结 `--angle` 在 `0deg`，只保留静态渐变边框
- 不支持 `@property` 的浏览器：改用 SVG 的 `stroke-dasharray` 动画，或直接静态渐变
- 低端设备：降低 `backdrop-filter` 到 `blur(12px)`，发光层减为单层

## 变体记录

### 变体 B：单点高光沿边框游走 BorderBeam（2026-11-25 收录自用户提示词）

基准方案是**整圈多色渐变一起旋转**（彩虹环绕）。

用户另提供一句话描述：**"一道亮光沿边框循环游走，conic-gradient 制作高光，4 秒一圈"**。

这两者是不同效果，别混淆：

| | 基准（多色流光） | 变体 B（BorderBeam） |
|---|---|---|
| 视觉 | 整圈都是彩色，一起转 | **只有一段亮光**，其余是暗边框 |
| 感知 | 边框本身就是彩的 | 一道光**沿着**暗边框跑 |
| 周期 | `6s` | **`4s`**（更快，因为是单点） |
| 色数 | 4~5 段彩虹 | **1 段高光 + 一个尾部拖影** |

```css
/* 变体 B：单段高光游走 */
.beam-frame {
  position: relative;
  border-radius: 20px;
  padding: 1px;
  background: rgba(255, 255, 255, 0.06);   /* 暗边框 */
  overflow: hidden;
}
.beam-frame::before {
  content: '';
  position: absolute;
  inset: -50%;
  background: conic-gradient(
    from var(--angle),
    transparent 0deg,
    transparent 300deg,
    rgba(120, 200, 255, 0.9) 340deg,
    #FFFFFF 355deg,
    transparent 360deg
  );
  animation: beamSpin 4s linear infinite;
}
@keyframes beamSpin { to { --angle: 360deg; } }
/* 内部挖空 + 内容层，同上 */
```

关键差异：**`conic-gradient` 里绝大部分是 `transparent`，只在末端留一小段亮光**。
这就是"一道光游走"和"彩虹环绕"的分界。

**取舍**：
- 变体 B 更克制、更像"提示性装饰"，适合角标、卡片边角
- 基准方案更张扬，适合暗色 Hero 的重点卡片

## 复刻提示词

见 [SKILL.md](../SKILL.md#6-合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
