#!/usr/bin/env python3
"""从条目的 YAML frontmatter 自动重建 INDEX.md。

用法：
    python build-index.py            # 重建 INDEX.md
    python build-index.py --check    # 只校验，不写；不一致时退出码 1（CI 用）

条目的唯一事实来源是 components/*.md 的 frontmatter 与正文，
INDEX.md 是派生产物，不要手动编辑。
"""
import os, re, sys, pathlib, collections

# Windows 控制台默认 GBK 打不了 ✓ ✗，统一转 UTF-8
try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

ROOT = pathlib.Path(__file__).resolve().parent
COMP = ROOT / 'components'
SCREENS = ROOT / 'screens'

CATEGORY_LABEL = {
    'motion':  ('动效交互', 'Motion'),
    'depth':   ('玻璃与深度', 'Glass & Depth'),
    'expand':  ('展开与收纳', 'Expand & Reveal'),
    'data':    ('数据与反馈', 'Data & Feedback'),
    'gesture': ('滚动与手势', 'Scroll & Gesture'),
    'surface': ('材质与边框', 'Surface & Border'),
    'screen':  ('整页与氛围', 'Screen & Ambience'),
}
CATEGORY_ORDER = ['motion', 'depth', 'expand', 'data', 'gesture', 'surface', 'screen']

STYLE_LABEL = {
    'quiet':    ('静谧极简', 'Quiet Minimal', '#FAF9F7', '删分割线，只靠留白分层'),
    'noir':     ('暗黑奢华', 'Noir Luxe', '#0B0B0D', '低饱和 + 金属细渐变'),
    'glass':    ('玻璃拟态', 'Glass', '动态底图', '玻璃必须有内容在动'),
    'swiss':    ('瑞士排版', 'Swiss', '纯黑白', '超大标题 + 极细正文'),
    'oriental': ('东方留白', 'Oriental', '#F7F5F0', '单屏 ≤5 元素，慢动效'),
    'fluid':    ('流体渐变', 'Fluid', '多色斑', '背景花，前景极简'),
}


def parse_frontmatter(text):
    m = re.match(r'^---\s*\n(.*?)\n---\s*\n', text, re.S)
    if not m:
        return None
    fm = {}
    for line in m.group(1).splitlines():
        if ':' not in line:
            continue
        k, v = line.split(':', 1)
        k, v = k.strip(), v.strip()
        if v.startswith('[') and v.endswith(']'):
            fm[k] = [x.strip() for x in v[1:-1].split(',') if x.strip()]
        elif v.startswith('"') and v.endswith('"'):
            fm[k] = v[1:-1]
        else:
            fm[k] = v
    return fm


def one_liner(text):
    """从「细节与反例」里取一句最精炼的要点，限长，优先取不完整不截断的短句。"""
    m = re.search(r'^## 细节与反例\s*\n(.*?)(?=^## |\Z)', text, re.M | re.S)
    if not m:
        return ''
    body = m.group(1)
    # 切成句子
    parts = re.split(r'(?<=[。；])', body.replace('\n', ' '))
    cands = []
    for s in parts:
        s = s.strip().lstrip('-*• ').strip()
        s = re.sub(r'\*\*', '', s)
        s = s.rstrip('。；')
        if 8 <= len(s) <= 52:
            cands.append(s)
    if not cands:
        return ''
    # 优先带"不要/避免/必须/不能"这类判据的句子
    for key in ('不要', '避免', '必须', '不能', '禁止'):
        for c in cands:
            if key in c:
                return c
    return cands[0]


def collect():
    entries, problems = [], []
    for p in sorted(COMP.glob('*.md')) + sorted(SCREENS.glob('*.md')):
        if p.name.startswith('_'):
            continue
        text = p.read_text(encoding='utf-8')
        fm = parse_frontmatter(text)
        if not fm:
            problems.append(f'{p.name}: 缺少 frontmatter')
            continue
        for key in ('id', 'title', 'category', 'styles', 'input', 'viewport'):
            if key not in fm:
                problems.append(f"{p.name}: 缺少字段 {key}")
        cat = fm.get('category', '')
        if cat not in CATEGORY_LABEL:
            problems.append(f"{p.name}: 未知 category '{cat}'")
        for s in fm.get('styles', []):
            if s not in STYLE_LABEL:
                problems.append(f"{p.name}: 未知 style '{s}'")
        if fm.get('id') != p.stem:
            problems.append(f"{p.name}: id 与文件名不一致")
        entries.append({'file': p.name, 'fm': fm, 'desc': one_liner(text)})
    return entries, problems


def render(entries):
    by_cat = collections.defaultdict(list)
    for e in entries:
        by_cat[e['fm']['category']].append(e)

    out = []
    out.append('# 设计收藏库 · 总目录')
    out.append('')
    out.append('> **本文件由脚本自动生成，请勿手动编辑。**')
    out.append('> 修改条目后运行 `python build-index.py` 重建。')
    out.append('>')
    out.append('> 分类（category）决定分组，视觉风格（styles）只作标签——两者正交。')
    out.append('')
    out.append(f'**统计**：{len(entries)} 个条目')
    out.append('')

    # 环境索引
    inp = collections.Counter(e['fm'].get('input', '') for e in entries)
    vp = collections.Counter(e['fm'].get('viewport', '') for e in entries)
    out.append('**按输入方式**：' + ' · '.join(f'`{k}` {v}' for k, v in inp.most_common()))
    out.append('')
    out.append('**按视口**：' + ' · '.join(f'`{k}` {v}' for k, v in vp.most_common()))
    out.append('')
    out.append('---')
    out.append('')

    for cat in CATEGORY_ORDER:
        items = by_cat.get(cat, [])
        label = CATEGORY_LABEL[cat]
        out.append(f'## {label[0]} {label[1]}')
        out.append('')
        for e in sorted(items, key=lambda x: x['fm']['title']):
            styles = ' '.join(f'`{s}`' for s in e['fm'].get('styles', []))
            dev = e['fm'].get('input', '')
            desc = f' — {e["desc"]}' if e['desc'] else ''
            sub = f'components/{e["file"]}' if e['fm']['category'] != 'screen' else f'screens/{e["file"]}'
            out.append(f'- [{e["fm"]["title"]}]({sub}){desc}  ')
            out.append(f'  <sub>{styles} · 输入 `{dev}`</sub>')
        out.append('')

    out.append('---')
    out.append('')
    out.append('## 风格速查')
    out.append('')
    out.append('| 风格 | 底色 | 关键动作 |')
    out.append('|---|---|---|')
    for key, (zh, en, bg, act) in STYLE_LABEL.items():
        n = sum(1 for e in entries if key in e['fm'].get('styles', []))
        out.append(f'| {zh} {en} | `{bg}` | {act} |  ')
    out.append('')
    return '\n'.join(out)


def main():
    entries, problems = collect()
    if problems:
        print('发现以下问题：')
        for p in problems:
            print('  ✗', p)
        if '--check' in sys.argv:
            sys.exit(1)

    content = render(entries)
    target = ROOT / 'INDEX.md'
    if '--check' in sys.argv:
        old = target.read_text(encoding='utf-8') if target.exists() else ''
        if old.strip() != content.strip():
            print('✗ INDEX.md 与条目不一致，请运行 python build-index.py 重建')
            sys.exit(1)
        print(f'✓ INDEX.md 一致（{len(entries)} 条）')
        return

    target.write_text(content, encoding='utf-8')
    print(f'✓ 已重建 INDEX.md（{len(entries)} 条，{len(problems)} 个问题）')


if __name__ == '__main__':
    main()

