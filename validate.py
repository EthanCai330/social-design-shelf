#!/usr/bin/env python3
"""校验设计收藏库的条目合规性。

用法：
    python validate.py           # 校验，有错误退出码 1
    python validate.py --json    # 机器可读输出

CI 里和 build-index.py --check 一起用。
"""
import os, re, sys, json, pathlib, math

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

ROOT = pathlib.Path(__file__).resolve().parent
COMP = ROOT / 'components'
SCREENS = ROOT / 'screens'

VALID_CATEGORIES = {'text', 'effect', 'micro', 'structure', 'surface', 'data', 'screen'}
VALID_STYLES = {'quiet', 'noir', 'glass', 'swiss', 'oriental', 'fluid'}
VALID_INPUT = {'pointer', 'touch', 'both', 'none'}
VALID_VIEWPORT = {'mobile', 'desktop', 'both'}
REQUIRED_FIELDS = ('id', 'title', 'category', 'styles', 'input', 'viewport')
REQUIRED_SECTIONS = ('行为', '时长与曲线', '视觉', '细节与反例')

errors, warnings = [], []


def err(f, msg):
    errors.append(f'{f}: {msg}')


def warn(f, msg):
    warnings.append(f'{f}: {msg}')


def parse_frontmatter(text):
    m = re.match(r'^---\s*\n(.*?)\n---\s*\n', text, re.S)
    if not m:
        return None, text
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
    return fm, text[m.end():]


def check_beziers(fname, body):
    """贝塞尔控制点合法性 + 过冲与曲线的矛盾检测。"""
    for m in re.finditer(r'cubic-bezier\(\s*([\d.]+)\s*,\s*([-\d.]+)\s*,\s*([\d.]+)\s*,\s*([-\d.]+)\s*\)', body):
        x1, y1, x2, y2 = map(float, m.groups())
        if not (0 <= x1 <= 1 and 0 <= x2 <= 1):
            err(fname, f'贝塞尔 x 控制点必须在 [0,1]：cubic-bezier({x1},{y1},{x2},{y2})')
    # 过冲声明 vs 单调曲线：只有在"声称确实有过冲"且没给替代方案时才算错
    if '过冲' in body and 'cubic-bezier(0.32,0.72,0,1)' in body:
        explained = re.search(
            r'y 控制点|不会过冲|单调|不过冲|删掉过冲|有意|若|二选一|或改用|替代',
            body)
        if not explained:
            err(fname, '声称有过冲，但给的曲线 y 控制点全在 [0,1] 内（单调，不可能过冲）')


def check_spring(fname, body):
    """spring 必须 stiffness/damping 成对，给出 mass 或说明默认。"""
    for m in re.finditer(r'stiffness\s*(\d+)', body):
        window = body[max(0, m.start() - 120): m.start() + 200]
        if not re.search(r'damping\s*[\d.]+', window):
            err(fname, f'stiffness {m.group(1)} 附近没有 damping，参数无法复现')
    if re.search(r'stiffness\s*\d+', body) and not re.search(r'mass', body):
        warn(fname, '有 spring 参数但未声明 mass（默认 1 则显式写出）')
    # 阻尼比与实际声明冲突
    for m in re.finditer(r'stiffness\s*(\d+)\s*/\s*damping\s*(\d+)', body):
        s, d = int(m.group(1)), int(m.group(2))
        zeta = d / (2 * math.sqrt(s))
        window = body[max(0, m.start() - 200): m.start() + 200]
        if zeta < 0.95 and '不过冲' in window and '有意' not in window:
            err(fname, f'ζ={zeta:.2f} 会有过冲，但附近声称"不过冲"')
        if zeta > 0.95 and '过冲' in window and '不会过冲' not in window and '无过冲' not in window:
            err(fname, f'ζ={zeta:.2f} 无过冲，但附近声称有过冲')


def check_radius(fname, body):
    """999px 与半高不该做插值。"""
    if re.search(r'999px\s*(→|->|到|变为)\s*\d+px', body):
        if '不要从 999px 插值' not in body and '实际渲染' not in body:
            err(fname, '把 999px 插值到具体像素是无效的（999 会被 clamp 到半高），应从高度/2 插值')
    if '999px' in body and re.search(r'插值|连续形变', body):
        if not re.search(r'18px|半高|clamp|不要从 999', body):
            warn(fname, '提到 999px 圆角形变，但未说明实际渲染会被 clamp 到半高')


def check_magnetic_direction(fname, body):
    """衰减函数方向。"""
    if '磁吸' in body or 'magnetic' in fname.lower():
        if re.search(r'位移(量)?\s*[=＝]\s*[（(]?\s*(光标到中心距离|d)\s*/\s*(最大半径|R)', body):
            if '早期版本' not in body and '写反' not in body:
                err(fname, '磁吸位移公式方向写反：必须是 1 - d/R，不是 d/R（后者到边界会跳变）')


def check_contradiction(fname, body):
    """1:1 跟手与阻尼系数不能并存。"""
    if re.search(r'1\s*:\s*1\s*跟手', body) and re.search(r'[×x]\s*0\.\d+\s*阻尼|阻尼[^。]*×\s*0\.\d+', body):
        if '矛盾' not in body and '不要同时' not in body:
            err(fname, '"1:1 跟手"与"带阻尼系数"自相矛盾')


def check_file(p):
    fname = p.name
    text = p.read_text(encoding='utf-8')
    fm, body = parse_frontmatter(text)
    if not fm:
        err(fname, '缺少 YAML frontmatter')
        return
    for k in REQUIRED_FIELDS:
        if k not in fm:
            err(fname, f'缺少字段 {k}')
    if fm.get('id') != p.stem:
        err(fname, f'id "{fm.get("id")}" 与文件名 "{p.stem}" 不一致')
    if fm.get('category') not in VALID_CATEGORIES:
        err(fname, f'非法 category "{fm.get("category")}"')
    for s in fm.get('styles', []):
        if s not in VALID_STYLES:
            err(fname, f'非法 style "{s}"')
    if not fm.get('styles'):
        err(fname, 'styles 不能为空')
    if fm.get('input') not in VALID_INPUT:
        err(fname, f'非法 input "{fm.get("input")}"')
    if fm.get('viewport') not in VALID_VIEWPORT:
        err(fname, f'非法 viewport "{fm.get("viewport")}"')
    for sec in REQUIRED_SECTIONS:
        if f'## {sec}' not in body:
            err(fname, f'缺少章节「## {sec}」')

    check_beziers(fname, body)
    check_spring(fname, body)
    check_radius(fname, body)
    check_magnetic_direction(fname, body)
    check_contradiction(fname, body)

    if not re.search(r'reduced-motion|降级|退化', body):
        warn(fname, '未提及降级方案（prefers-reduced-motion / 触屏或桌面退化）')
    if len(body) < 300:
        warn(fname, f'正文偏短（{len(body)} 字符）')


def main():
    skip = {'_template.md'}
    files = [p for p in sorted(COMP.glob('*.md')) + sorted(SCREENS.glob('*.md'))
             if p.name not in skip and not p.name.startswith('_')]
    if not files:
        print('✗ 没有找到任何条目')
        sys.exit(1)
    for p in files:
        check_file(p)

    # 索引链接校验
    idx = ROOT / 'INDEX.md'
    if idx.exists():
        idxtxt = idx.read_text(encoding='utf-8')
        links = re.findall(r'\]\((components/[^)]+)\)', idxtxt)
        for l in links:
            if not (ROOT / l).exists():
                err('INDEX.md', f'死链 {l}')

        # README 数字一致性校验：README 里的条目数必须与 INDEX 一致
        readme = ROOT / 'README.md'
        if readme.exists():
            rt = readme.read_text(encoding='utf-8')
            real_total = len(files)
            m = re.search(r'\*\*(\d+)\s*个条目\*\*', rt)
            if m:
                claimed = int(m.group(1))
                if claimed != real_total:
                    err('README.md', f'条目数写的是 {claimed}，实际 {real_total}')
            # 检查是否残留旧分类名
            for old_cat in ('`motion`', '`depth`', '`expand`', '`gesture`'):
                if old_cat in rt:
                    err('README.md', f'残留已废弃的分类名 {old_cat}')

    if '--json' in sys.argv:
        print(json.dumps({'errors': errors, 'warnings': warnings}, ensure_ascii=False, indent=2))
    else:
        for w in warnings:
            print('  ⚠', w)
        for e in errors:
            print('  ✗', e)
        print(f'\n校验 {len(files)} 个条目：{len(errors)} 错误 / {len(warnings)} 警告')
    sys.exit(1 if errors else 0)


if __name__ == '__main__':
    main()
