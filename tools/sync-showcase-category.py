# 从 components/*.md 的 frontmatter 生成 showcase 的分类映射
# 消除 showcase 里手写 CATEGORY 表与条目不一致的问题
import os, re, json, pathlib, sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

ROOT = pathlib.Path(os.path.expanduser('~/.dsh/skills/design-collection'))
COMP = ROOT / 'components'
SHOW = ROOT / 'showcase' / 'index.html'

# 编号 -> slug（顺序与 showcase 中 def() 的编号一致）
NUM2SLUG = {
 1:'magnetic-button', 2:'magnification-dock', 3:'animated-segmented-control',
 4:'floating-navigation', 5:'expandable-toolbar', 6:'elastic-toggle',
 7:'ripple-ink-touch', 8:'morphing-dialog', 9:'smart-popover',
 10:'glass-sheet', 11:'spotlight-card', 12:'3d-tilt-card',
 13:'progressive-blur-header', 14:'expandable-avatar-group', 15:'expandable-card',
 16:'horizontal-accordion', 17:'component-tray', 18:'finger-tracking-icon-row',
 19:'pull-to-expand-summary', 20:'swipe-actions', 21:'liquid-progress-task',
 22:'number-ticker', 23:'animated-counter-ring', 24:'shimmer-skeleton',
 25:'magnetic-cursor', 26:'rotating-text', 27:'staggered-list-reveal',
 28:'morphing-icon-button',
}

cat_of = {}
missing = []
for num, slug in NUM2SLUG.items():
    p = COMP / f'{slug}.md'
    if not p.exists():
        missing.append(slug); continue
    raw = p.read_text(encoding='utf-8')
    m = re.search(r'(?m)^category:\s*(\w+)', raw)
    if not m:
        missing.append(slug + ' (无 category)'); continue
    cat_of[num] = m.group(1)

if missing:
    print('缺失:', missing)
    sys.exit(1)

# 生成紧凑映射，每 6 个一行
items = sorted(cat_of.items())
lines, cur = [], []
for n, c in items:
    cur.append(f"{n}:'{c}'")
    if len(cur) == 4:
        lines.append(', '.join(cur)); cur = []
if cur:
    lines.append(', '.join(cur))
block = ',\n  '.join(lines)

html = SHOW.read_text(encoding='utf-8')
new_cat = f"const CATEGORY = {{\n  {block},\n}};"
html2, n = re.subn(r'const CATEGORY = \{[^}]*\};', new_cat, html, count=1, flags=re.S)
if n != 1:
    print('未找到 CATEGORY 块，替换失败'); sys.exit(1)
SHOW.write_text(html2, encoding='utf-8')

from collections import Counter
cnt = Counter(cat_of.values())
print('已同步 CATEGORY 到 showcase：')
for k in ['motion', 'depth', 'expand', 'data', 'gesture']:
    print(f'  {k:8} {cnt.get(k, 0)}')
print('  total   ', sum(cnt.values()))
