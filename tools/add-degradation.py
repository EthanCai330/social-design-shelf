# 为没有降级说明的条目追加「## 降级」章节（按交互类型给不同内容）
import os, re, pathlib

ROOT = pathlib.Path(os.path.expanduser('~/.dsh/skills/design-collection'))
COMP = ROOT / 'components'

# 按 slug 定制降级说明，避免千篇一律
DEGRADE = {
 'magnification-dock':      ('`prefers-reduced-motion`：取消放大，改为 hover 高亮描边。\n触屏：长按显示标签，不做连续放大。', 'in 行为'),
 'animated-segmented-control': ('`prefers-reduced-motion`：指示器直接跳位，不做 spring 与形变。\n键盘：左右方向键切换，focus 环沿用指示器位置。', ''),
 'floating-navigation':     ('`prefers-reduced-motion`：光晕直接定位，去掉挤压回弹。\n无 backdrop-filter 的浏览器：退化为 `rgba(255,255,255,.92)` 实底。', ''),
 'morphing-dialog':         ('`prefers-reduced-motion`：跳过形变，直接淡入 150ms。\n不支持 backdrop-filter：遮罩用纯色 `rgba(0,0,0,.4)`。', ''),
 'expandable-card':         ('`prefers-reduced-motion`：高度直接切到终值，内容瞬时显示。\n`<details>/<summary>` 可作为无 JS 的等效实现。', ''),
 'expandable-toolbar':      ('`prefers-reduced-motion`：工具图标直接显示，不加错峰。\n窄屏：自动换行为两行布局。', ''),
 'smart-popover':           ('`prefers-reduced-motion`：直接显示，无缩放。\n不支持 backdrop-filter：改用不透明 `#fff` 加阴影。', ''),
 'spotlight-card':          ('`prefers-reduced-motion`：光斑固定居中，不跟随光标。\n触屏：改为按压缩放 0.98 加一层静态内发光。', ''),
 '3d-tilt-card':            ('`prefers-reduced-motion`：禁用倾斜，仅保留 hover 阴影加深。\n触屏：按压时轻微缩放 0.98 代替倾斜。', ''),
 'morphing-icon-button':    ('`prefers-reduced-motion`：三条线直接切换为 ×，不做形变。\n按钮必须有 `aria-expanded` 与可读 `aria-label`。', ''),
 'number-ticker':           ('`prefers-reduced-motion`：数字直接替换，不滚动。\n必须给屏幕阅读器提供 `aria-live="polite"` 的最终值，避免朗读每一位。', ''),
 'shimmer-skeleton':        ('`prefers-reduced-motion`：取消流光，只保留静态骨架块。\n骨架块必须有 `aria-busy="true"`。', ''),
 'animated-counter-ring':   ('`prefers-reduced-motion`：弧线与数字直接跳到终值。\n给 `<svg>` 加 `role="img"` 与描述性 `aria-label`。', ''),
 'elastic-toggle':          ('`prefers-reduced-motion`：滑块直接位移，不做拉伸与过冲。\n必须用 `<input type="checkbox" role="switch">` 保证无障碍与表单提交。', ''),
 'swipe-actions':           ('`prefers-reduced-motion`：取消倾斜与图标摇摆，只保留位移。\n无障碍：滑动不是唯一入口，每行需要可聚焦的删除/标记按钮。', ''),
 'glass-sheet':             ('`prefers-reduced-motion`：面板直接显示/隐藏，无跟手动画。\n不支持 backdrop-filter：改用不透明底加阴影。给 `aria-modal` 与焦点陷阱。', ''),
 'rotating-text':           ('`prefers-reduced-motion`：只显示第一个词，不轮换。\n屏幕阅读器：轮换区域用 `aria-hidden`，同时提供静态完整文案。', ''),
 'expandable-avatar-group': ('`prefers-reduced-motion`：头像直接排列到位，不做错峰。\n无障碍：点击区域用 `<button aria-expanded>`，头像是装饰时 `alt=""`。', ''),
 'liquid-progress-task':    ('`prefers-reduced-motion`：底色直接跳到目标比例，去掉完成闪亮。\n必须提供文字进度（如"2/4"），不能只靠底色表达。', ''),
 'horizontal-accordion':    ('`prefers-reduced-motion`：宽度直接切换，内容同步显示。\n窄屏：改为纵向手风琴。键盘：Tab 到每条，Enter 展开。', ''),
 'component-tray':          ('`prefers-reduced-motion`：托盘直接展开/收起，不做滑出。\n无障碍：主组件与托盘用 `aria-controls` 关联，托盘内内容用 `aria-hidden` 控制。', ''),
 'finger-tracking-icon-row': ('`prefers-reduced-motion`：取消连续放大，改为点击选中 + 描边。\n必须同时支持键盘方向键与直接点击。', ''),
 'pull-to-expand-summary':  ('`prefers-reduced-motion`：松手后直接吸附到终态，无 spring。\n无障碍：胶囊必须是可聚焦按钮，Enter 也能展开；不能让手势成为唯一入口。', ''),
}

changed = []
for p in sorted(COMP.glob('*.md')):
    text = p.read_text(encoding='utf-8')
    if re.search(r'^## 降级\s*$', text, re.M) or re.search(r'reduced-motion', text):
        continue
    slug = p.stem
    if slug not in DEGRADE:
        print('NO-TEMPLATE:', slug)
        continue
    body, _ = DEGRADE[slug]
    section = f'## 降级\n{body}\n\n'
    # 插到「## 细节与反例」之前；没有就追加到文末
    m = re.search(r'^## 细节与反例\s*$', text, re.M)
    if m:
        new = text[:m.start()] + section + text[m.start():]
    else:
        new = text.rstrip() + '\n\n' + section
    p.write_text(new, encoding='utf-8')
    changed.append(slug)

print(f'已追加降级说明 {len(changed)} 个')
for c in changed:
    print('  ✓', c)
