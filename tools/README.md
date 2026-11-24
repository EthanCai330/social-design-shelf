# 维护工具

日常校验用根目录的 `validate.py` 与 `build-index.py`。这里是辅助脚本。

| 脚本 | 用途 | 何时用 |
|---|---|---|
| `sync-showcase-category.py` | 从 `components/*.md` 的 `category` 字段重新生成 `showcase/index.html` 的分类映射 | 修改条目 category 之后 |
| `test-showcase.cjs` | 28 个组件的交互回归测试 | 改 showcase 视觉层之后 |
| `test-filter.cjs` | 筛选与搜索功能测试 | 改筛选栏之后 |
| `inject-frontmatter.py` | 批量补 frontmatter | 仅历史迁移 |
| `add-degradation.py` | 批量追加降级说明 | 仅历史迁移 |
| `strip-recipe-prompts.py` | 移除重复的复刻提示词段落 | 仅历史迁移 |

## 运行交互测试

测试用 Chrome DevTools Protocol 驱动无头 Chrome，需要先启动浏览器：

```bash
# 1. 启动带调试端口的 Chrome（任选一个浏览器）
"C:/Program Files/Google/Chrome/Application/chrome.exe" \
  --headless=new --remote-debugging-port=9333 --disable-gpu about:blank &

# 2. 运行测试
node tools/test-showcase.cjs   # 期望输出：通过 28/28，运行期异常 0
node tools/test-filter.cjs     # 期望输出：✓ 筛选功能正常
```

测试会真实验证每个组件的交互结果（读计算后的 `transform`、高度、宽度等），
不是只看页面有没有渲染出来。改视觉层后**务必**跑这两个。

## 修改分类后的标准流程

```bash
# 1. 改条目的 frontmatter
# 2. 同步 showcase 的分类映射
python tools/sync-showcase-category.py
# 3. 重建索引
python build-index.py
# 4. 校验
python validate.py
# 5. 交互回归
node tools/test-showcase.cjs
```
