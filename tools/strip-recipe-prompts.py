# 删除 27 个条目里与正文重复的「复刻提示词」段落
# 替换为统一指引，避免双维护源导致的规格漂移
import os, re, pathlib

ROOT = pathlib.Path(os.path.expanduser('~/.dsh/skills/design-collection'))
COMP = ROOT / 'components'

REPLACEMENT = """## 复刻提示词

见 [SKILL.md](../SKILL.md#合成复刻-prompt)：读取本条目参数，按目标技术栈动态合成，
不在此处硬编码，避免与正文产生第二份事实来源。
"""

changed, skipped = [], []
for p in sorted(COMP.glob('*.md')):
    text = p.read_text(encoding='utf-8')
    m = re.search(r'## 复刻提示词\s*\n(.*)\Z', text, re.S)
    if not m:
        skipped.append(p.name)
        continue
    body = m.group(1)
    if '自动合成' in body or '第二份事实来源' in body:
        skipped.append(p.name)
        continue
    new = text[:m.start()] + REPLACEMENT
    p.write_text(new, encoding='utf-8')
    changed.append(p.name)

print(f'已替换 {len(changed)} 个')
for c in changed:
    print('  ✓', c)
if skipped:
    print(f'跳过 {len(skipped)} 个（已处理或无该段落）')
    for s in skipped:
        print('  -', s)

# 校验：不应再有长段落的复刻提示词
left = []
for p in sorted(COMP.glob('*.md')):
    text = p.read_text(encoding='utf-8')
    m = re.search(r'## 复刻提示词\s*\n(.*)\Z', text, re.S)
    if m and len(m.group(1).strip()) > 200:
        left.append(p.name)
print('\n仍有冗长提示词的条目:', left if left else '无 ✓')
