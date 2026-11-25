---
id: success-check
title: "成功勾选 Success Check"
category: micro
styles: [quiet]
input: none
viewport: both
status: verified
---

# 成功勾选 Success Check

- **风格**：静谧极简
- **来源**：[transitions.dev](https://transitions.dev/) · 收录于 2026-11-25
- **许可**：transitions.dev 许可：可自由用于个人与商业项目、可修改；唯一限制是不得把本库原样作为竞品转售。
- **适用场景**：支付完成、文件上传、消息发送、表单保存

> 当一个状态从"待处理/未知"变成"成功"时，让这一刻有完成感而不是瞬间跳变。

## 行为

图标同时执行**四条并行的入场动画**：
1. **淡入** —— opacity 0 → 1
2. **旋转归位** —— 从 `80deg` 转到 `0deg`
3. **去模糊** —— `blur(10px)` → `blur(0)`
4. **Y 轴上浮** —— 从 `translate(0, 40px)` 升到原位

如果图标是 SVG `<path>`，额外执行**描边绘制**：`stroke-dashoffset` 从全长归零。
描边延迟 `80ms` 开始，让"旋转归位"先发生，笔画随后画出。

用 `data-state="in"` 触发；初始为 `data-state="out"`（完全透明，不播放）。

## 时长与曲线

| 属性 | 时长 | 缓动 |
|---|---|---|
| 透明度 | `500ms` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| 旋转 | `500ms` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| 去模糊 | `500ms` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Y 轴上浮 | `500ms` | **`cubic-bezier(0.34, 1.35, 0.64, 1)`** ← y>1，有回弹 |
| 描边绘制 | `500ms` | `cubic-bezier(0.22, 1, 0.36, 1)` |

描边延迟：`80ms`。

**注意**：只有 Y 轴那条用了 `y=1.35`（会过冲），其余都是单调曲线。这个组合是刻意的——
只有"落定"这一个维度带弹跳，其余保持干净。

## 视觉

- 从 `80deg` 旋转入场 → 视觉上像"歪着倒下，然后扶正"
- 起手 `blur(10px)` → 从混沌中聚焦
- 上浮 `40px` → 从下方升起
- 描边用**圆头端点**（`stroke-linecap: round`），亚像素的溢出不可见

```css
.t-success-check {
  display: inline-block;
  transform-origin: center;
  opacity: 0;
  will-change: transform, opacity, filter;
}
.t-success-check svg { display: block; overflow: visible; }
.t-success-check svg path {
  stroke-dasharray: 20;      /* ← 换成 path.getTotalLength() 向上取整 */
  stroke-dashoffset: 20;
}
.t-success-check[data-state="in"] {
  animation:
    t-check-fade   500ms cubic-bezier(0.22, 1, 0.36, 1) forwards,
    t-check-rotate 500ms cubic-bezier(0.22, 1, 0.36, 1) forwards,
    t-check-blur   500ms cubic-bezier(0.22, 1, 0.36, 1) forwards,
    t-check-bob    500ms cubic-bezier(0.34, 1.35, 0.64, 1) forwards;
}
.t-success-check[data-state="in"] svg path {
  animation: t-check-draw 500ms cubic-bezier(0.22, 1, 0.36, 1) 80ms forwards;
}
@keyframes t-check-fade   { from { opacity: 0 } to { opacity: 1 } }
@keyframes t-check-rotate { from { transform: rotate(80deg) } to { transform: rotate(0deg) } }
@keyframes t-check-blur   { from { filter: blur(10px) } to { filter: blur(0) } }
@keyframes t-check-bob    { from { translate: 0 40px } to { translate: 0 0 } }
@keyframes t-check-draw   { to { stroke-dashoffset: 0 } }
```

## 关键实现要点

**`stroke-dasharray` 必须量出来**。CSS 里的 `20` 是占位符，实际要用你路径的长度：

```js
document.querySelector('.t-success-check svg path').getTotalLength()
// → 19.42 → 用 20（向上取整 1px 吸收亚像素抖动）
```

- **太短**：笔画会在动画开始前就预显出来
- **太长**：笔画会画出路径末端再淡入
- **向上取整 1px** 是安全做法

**重播需要强制回流**（否则 keyframes 不会重新开始）：

```js
function showCheck() {
  check.setAttribute('data-state', 'out');
  void check.offsetWidth;          // ← 强制回流
  check.setAttribute('data-state', 'in');
}
```

只有从"已显示"状态重播时才需要这一步；初次挂载直接设 `in` 就行。

## 细节与反例

- **本片段只覆盖"出现"**，不包含"消失"。成功态通常常驻，做退出动画往往不值得。
- **Y 轴的回弹是灵魂**。去掉 `cubic-bezier(0.34,1.35,0.64,1)` 后就变成普通的淡入上浮，失去"落定感"。
- **四条动画必须并行**，串行会拖到 2 秒以上，失去"瞬间确认"的意义。
- **描边延迟不要超过 150ms**。超过会让人以为图标卡住了。
- **不要在成功图标上叠太多效果**。这里已经有 5 个变化，再加会显得慌乱。

## 降级
- `prefers-reduced-motion`：全部关闭，直接 `opacity: 1`、`stroke-dashoffset: 0`
- 屏幕阅读器：容器加 `aria-hidden="true"`（纯装饰），状态用 `aria-live` 的文本传达
- 不支持 `translate` 独立属性：改用 `transform: translateY()`

## 复刻提示词

见 [SKILL.md](../SKILL.md#6-合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
