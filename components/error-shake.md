---
id: error-shake
title: "错误抖动 Error Shake"
category: micro
styles: [quiet]
input: both
viewport: both
status: verified
---

# 错误抖动 Error Shake

- **风格**：静谧极简
- **来源**：[transitions.dev](https://transitions.dev/) · 收录于 2026-11-25
- **许可**：transitions.dev 许可：可自由用于个人与商业项目、可修改；唯一限制是不得把本库原样作为竞品转售。
- **适用场景**：表单校验失败、密码错误、必填项缺失、两次输入不一致

> 输入框左右抖动，边框变为错误色，下方浮现错误消息。
> 停留一段时间后（够读完消息），边框与消息自动淡回中性态。

## 行为

三段式：
1. **抖动** —— 输入框左右摆动：`+6px → -6px → +4px → 0`
2. **错误态** —— 边框变色，错误消息从下方以 opacity 淡入
3. **自动复位** —— 停留 `3000ms` 后，边框与消息淡回中性（`280ms`）

用户开始输入时，**立即取消自动复位**并清除错误态——避免在用户已经在修正时还在抖动。

## 时长与曲线

抖动的四个分段（**每段有独立的缓动**）：

| 分段 | 位移 | 时长 | 缓动 |
|---|---|---|---|
| 静止 → 右峰 | `0 → +6px` | `80ms` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| 右峰 → 左峰 | `+6px → -6px` | `80ms` | 同上 |
| 左峰 → 过冲 | `-6px → +4px` | `60ms` | 同上 |
| 过冲 → 静止 | `+4px → 0` | `60ms` | 同上 |

总时长 = `2×80 + 2×60 = 280ms`

**关键：四段用的是"大摆-大摆-小摆-收"的节奏**，不是对称的来回。
前两段幅度都是 `6px`（全幅），后两段只有 `4px`（收窄），所以看起来像"越抖越弱"，自然停止。

帧百分比（按累计时长）：
```
0%      → 0        (静止)
28.57%  → +6px     (80/280)
57.14%  → -6px     (160/280)
78.57%  → +4px     (220/280)
100%    → 0        (280/280)
```

## 视觉

```css
/* 边框色过渡：中性 150ms，复位 280ms */
.t-input {
  transition: border-color 150ms ease-out;
  will-change: transform;
}
.t-input.is-error {
  transition: border-color 280ms ease-out;   /* 复位要慢，与消息同步 */
}

/* 错误消息：进场立即显示，退场延迟到透明度淡完 */
.t-error-msg {
  opacity: 0;
  visibility: hidden;
  transition:
    opacity    280ms ease-out,
    visibility 0s linear 280ms;    /* ← 退场时延迟隐藏，保证淡出完整 */
}
.t-input-wrap.is-error .t-error-msg {
  opacity: 1;
  visibility: visible;
  transition:
    opacity    280ms ease-out,
    visibility 0s linear 0s;       /* ← 进场无延迟 */
}

.t-input.is-shaking {
  animation: t-input-shake 280ms linear;
}
@keyframes t-input-shake {
  0%      { transform: translateX(0);    animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); }
  28.57%  { transform: translateX(6px);  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); }
  57.14%  { transform: translateX(-6px); animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); }
  78.57%  { transform: translateX(4px);  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); }
  100%    { transform: translateX(0); }
}
```

## 关键实现要点

### 三个类各管一件事

| 类 | 挂在哪 | 管什么 |
|---|---|---|
| `.is-error` | wrapper | 错误**消息**的显隐 |
| `.is-error` | input | **边框颜色** |
| `.is-shaking` | input | 抖**动** |

**为什么抖动要独立于错误态**：重播抖动需要「移除 → 回流 → 添加」，
如果和 `.is-error` 混在一起，会在同一帧里让错误态闪一下。

### 重播需要强制回流

```js
input.classList.remove('is-shaking');
void input.offsetWidth;        // ← 必须
input.classList.add('is-shaking');
```

### 边框宽度必须恒定

错误态与中性态用**相同的 border-width**，只改颜色。
如果错误态加粗边框，内容会位移，画面会抖。

### 帧百分比是硬编码的

如果改了 `--shake-dur-a` / `--shake-dur-b` 的比例，**必须重算百分比**，
否则分段时长会和总时长脱节。

## 细节与反例

- **不要对称摇摆**。`+6 → -6 → +6 → 0` 看起来像机器在抖；
  `+6 → -6 → +4 → 0`（逐次收窄）才像"被惊到然后平复"。
- **幅度不要超过 8px**。超过就像整个页面在抖，很廉价。
- **总时长不要超过 400ms**。抖太久会让人烦躁。
- **必须提供自动复位**。错误态如果常驻，用户改对了还红着，体验很差。
- **用户输入要能打断**。否则会出现"用户已经在改，输入框还在抖"的荒谬场面。
- 抖动**不能是唯一的反馈**。有视觉障碍的用户感知不到，必须配文字消息。

## 降级
- `prefers-reduced-motion`：取消抖动，只保留边框变色与消息淡入
- 无障碍：错误消息用 `role="alert"` 或 `aria-live="assertive"`；
  输入框加 `aria-invalid="true"` 与 `aria-describedby` 指向消息
- 触摸设备：同上，抖动不是必要信息

## 复刻提示词

见 [SKILL.md](../SKILL.md#6-合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
