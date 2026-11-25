---
id: text-scramble
title: "乱码解码 Text Scramble"
category: motion
styles: [swiss, noir]
input: none
viewport: both
status: draft
---

# 乱码解码 Text Scramble

- **风格**：瑞士排版 / 暗黑奢华
- **来源**：用户提供的提示词 · 收录于 2026-11-25
- **适用场景**：Hero 标题、加载完成瞬间、终端风界面

> 原始提示词：Text Scramble：随机字符逐个锁定，最终变成完整标题。标题先随机切换字母符号，再从左到右每 50ms 锁定一个正确字符。

## 行为

标题先显示为一串随机字符（乱码），然后**从左到右逐个锁定**为正确字符。
未锁定的位置继续随机跳动，已锁定的位置不再变化。最终全部变为完整标题。

可选变体：锁定顺序随机而非从左到右，更像"解密"。

## 时长与曲线
- 乱码跳动频率：`每 40~70ms` 换一次字符（要有微小随机，不能严格等间隔）
- 锁定节奏：`每 50ms` 锁定一个字符，`linear`
- 总时长 = 字符数 × 50ms。10 个字 = 500ms，20 个字 = 1s（超过 1.5s 会显得拖沓）
- 锁定瞬间可加 `80ms` 的亮度闪一下（可选）

## 视觉
- 乱码字符集：根据语言选
  - 英文：`ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\/[]{}=+*^?#`
  - 中文：乱码用同宽度的方块字或 `■▮▯▰` 之类，**不要用随机汉字**（会真的读出别的词）
- 乱码颜色：比正式文字浅一档（如 `#FF4D00` 或 `rgba(255,255,255,.35)`）
- 锁定后：立即变为最终文字颜色
- 字符宽度必须固定（`font-variant-numeric: tabular-nums` 或等宽字体），
  否则乱码跳动时整行会抖动

## 实现要点

```js
// 每个字符独立计时，不共享时间轴
chars.forEach((ch, i) => {
  const lockAt = i * 50;                       // 锁定时刻
  const timer = setInterval(() => {
    if (elapsed >= lockAt) {
      el.textContent = ch;                     // 锁定真实字符
      clearInterval(timer);
    } else {
      el.textContent = pick(SCRAMBLE_CHARS);   // 继续乱跳
    }
  }, 40 + Math.random() * 30);
});
```

- `textContent` 而非 `innerHTML`，避免 XSS 与重排
- 每个字符要包在独立的 `<span>` 里，否则无法逐个锁定
- 给容器设 `aria-label` 为完整正确文本，屏幕阅读器读到的应是最终结果

## 细节与反例

- **必须固定字符宽度**。宽度变化会让整行左右抖动，观感立刻廉价。
- **锁定节奏不要均匀死板**。给每个字符 `±10ms` 随机，避免"机关枪"般的机械感。
- **中文不要用随机汉字做乱码**。会出现真实词汇，看起来像故障而非效果。
- **不要超过 1.5 秒**。再长用户就不耐烦了。
- 页面上同时只用一个 scramble。多个标题一起解码会显得吵闹。

## 降级
- `prefers-reduced-motion`：直接显示最终文字，不做乱码
- 屏幕阅读器：容器 `aria-label` 给最终文本，乱码 span 加 `aria-hidden="true"`

## 复刻提示词

见 [SKILL.md](../SKILL.md#6-合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
