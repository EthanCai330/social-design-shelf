# 给 28 个条目注入 YAML frontmatter
# category = 交互分类（单选，决定 INDEX 分组）
# styles   = 视觉风格（多选，只作标签）
# input / viewport = 宿主环境
import json, os, re, pathlib

ROOT = pathlib.Path(os.path.expanduser('~/.dsh/skills/design-collection'))
COMP = ROOT / 'components'

META = {
 'magnetic-button':            ('motion',       ['noir','quiet'],          'pointer', 'both'),
 'magnification-dock':         ('motion',       ['glass'],                 'pointer', 'mobile'),
 'animated-segmented-control': ('motion',       ['quiet'],                 'both',    'mobile'),
 'floating-navigation':        ('motion',       ['glass'],                 'both',    'mobile'),
 'morphing-dialog':            ('depth',        ['glass','quiet'],         'both',    'mobile'),
 'expandable-card':            ('expand',       ['quiet'],                 'both',    'mobile'),
 'expandable-toolbar':         ('motion',       ['glass'],                 'both',    'mobile'),
 'smart-popover':              ('depth',        ['glass'],                 'both',    'both'),
 'spotlight-card':             ('depth',        ['noir'],                  'pointer', 'both'),
 '3d-tilt-card':               ('depth',        ['noir','fluid'],          'pointer', 'desktop'),
 'morphing-icon-button':       ('motion',       ['quiet'],                 'both',    'both'),
 'number-ticker':              ('data',         ['swiss','noir'],          'none',    'both'),
 'shimmer-skeleton':           ('data',         ['quiet'],                 'none',    'both'),
 'animated-counter-ring':      ('data',         ['quiet','noir'],          'both',    'mobile'),
 'elastic-toggle':             ('motion',       ['quiet'],                 'touch',   'mobile'),
 'magnetic-cursor':            ('gesture',      ['noir'],                  'pointer', 'desktop'),
 'swipe-actions':              ('gesture',      ['quiet'],                 'touch',   'mobile'),
 'progressive-blur-header':    ('gesture',      ['quiet','glass'],         'touch',   'mobile'),
 'ripple-ink-touch':           ('motion',       ['oriental','quiet'],      'touch',   'mobile'),
 'glass-sheet':                ('depth',        ['glass'],                 'touch',   'mobile'),
 'rotating-text':              ('motion',       ['swiss','oriental'],      'none',    'both'),
 'staggered-list-reveal':      ('motion',       ['quiet'],                 'none',    'both'),
 'expandable-avatar-group':    ('expand',       ['quiet'],                 'both',    'mobile'),
 'liquid-progress-task':       ('data',         ['quiet'],                 'both',    'both'),
 'horizontal-accordion':       ('expand',       ['swiss','oriental'],      'both',    'both'),
 'component-tray':             ('expand',       ['quiet','glass'],         'both',    'mobile'),
 'finger-tracking-icon-row':   ('gesture',      ['quiet'],                 'touch',   'mobile'),
 'pull-to-expand-summary':     ('expand',       ['glass','quiet'],         'touch',   'mobile'),
}

def title_of(text):
    m = re.match(r'^#\s+(.+)$', text, re.M)
    return m.group(1).strip() if m else ''

def first_style_line(text):
    m = re.search(r'^-\s+\*\*风格\*\*[：:]\s*(.+)$', text, re.M)
    return m.group(1).strip() if m else ''

def insert_fm(path, slug):
    text = path.read_text(encoding='utf-8')
    if text.startswith('---'):
        print('SKIP (has fm):', path.name); return
    cat, styles, inp, vp = META[slug]
    title = title_of(text)
    fm = ['---',
          f'id: {slug}',
          f'title: {json.dumps(title, ensure_ascii=False)}',
          f'category: {cat}',
          'styles: [' + ', '.join(styles) + ']',
          f'input: {inp}',
          f'viewport: {vp}',
          'status: verified',
          '---', '']
    path.write_text('\n'.join(fm) + text, encoding='utf-8')
    print('OK', path.name, '->', cat, styles)

missing = []
for slug, v in META.items():
    p = COMP / f'{slug}.md'
    if not p.exists():
        missing.append(slug); continue
    insert_fm(p, slug)

if missing:
    print('MISSING:', missing)
print('total md =', len(list(COMP.glob('*.md'))))
