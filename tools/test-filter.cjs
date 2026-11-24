const FILE = 'file:///' + require('path').resolve(__dirname, '../showcase/index.html').replace(/\\\\/g, '/');
const sleep = ms => new Promise(r => setTimeout(r, ms));
class CDP {
  constructor(ws) { this.ws = ws; this.id = 0; this.pending = new Map(); this.events = []; }
  static async connect(url) {
    const ws = new WebSocket(url);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    const c = new CDP(ws);
    ws.onmessage = ev => { const m = JSON.parse(ev.data); if (m.id && c.pending.has(m.id)) { const { res, rej } = c.pending.get(m.id); c.pending.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); } else if (m.method) c.events.push(m); };
    return c;
  }
  send(method, params = {}) { const id = ++this.id; this.ws.send(JSON.stringify({ id, method, params })); return new Promise((res, rej) => this.pending.set(id, { res, rej })); }
  async eval(e) { const r = await this.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; }
}
(async () => {
  const list = await (await fetch('http://127.0.0.1:9333/json/list')).json();
  const cdp = await CDP.connect(list.find(t => t.type === 'page').webSocketDebuggerUrl);
  await cdp.send('Runtime.enable'); await cdp.send('Page.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1500, height: 1600, deviceScaleFactor: 1, mobile: false });
  await cdp.send('Page.navigate', { url: FILE }); await sleep(2500);

  const chips = await cdp.eval(`[...document.querySelectorAll('.chip')].map(c=>({label:c.textContent.replace(/\\s+/g,' ').trim(), cat:c.dataset.cat}))`);
  console.log('筛选按钮:', JSON.stringify(chips, null, 0));

  const total = await cdp.eval(`document.querySelectorAll('#grid .tile').length`);
  const shown = await cdp.eval(`document.querySelector('#shown-count').textContent`);
  console.log(`\n初始：grid=${total} 显示计数=${shown}`);

  // 逐个分类点击
  for (const cat of ['motion','depth','expand','data','gesture','all']) {
    await cdp.eval(`document.querySelector('.chip[data-cat="${cat}"]').click()`);
    await sleep(250);
    const n = await cdp.eval(`document.querySelectorAll('#grid .tile').length`);
    const cnt = await cdp.eval(`document.querySelector('.chip[data-cat="${cat}"] .cnt').textContent`);
    const tagMatch = await cdp.eval(`[...document.querySelectorAll('#grid .tile')].every(t=>document.querySelector('.chip[data-cat="${cat}"]').dataset.cat==='all' || t.dataset.cat==='${cat}')`);
    console.log(`  ${cat.padEnd(8)} 显示 ${String(n).padStart(2)} 个，按钮计数 ${cnt}，标签匹配 ${tagMatch ? '✓' : '✗'}`);
  }

  // 搜索
  await cdp.eval(`(()=>{const s=document.querySelector('.search');s.value='磁';s.dispatchEvent(new Event('input',{bubbles:true}))})()`);
  await sleep(250);
  const s1 = await cdp.eval(`document.querySelectorAll('#grid .tile').length`);
  const t1 = await cdp.eval(`[...document.querySelectorAll('#grid .tile .t')].map(x=>x.textContent)`);
  console.log(`\n搜索"磁" -> ${s1} 个: ${t1}`);

  await cdp.eval(`(()=>{const s=document.querySelector('.search');s.value='zzzz';s.dispatchEvent(new Event('input',{bubbles:true}))})()`);
  await sleep(250);
  const s2 = await cdp.eval(`document.querySelectorAll('#grid .tile').length`);
  const emptyShown = await cdp.eval(`getComputedStyle(document.querySelector('#empty-hint')).display`);
  console.log(`搜索"zzzz" -> ${s2} 个，空提示 display=${emptyShown}`);

  // 清空恢复
  await cdp.eval(`(()=>{const s=document.querySelector('.search');s.value='';s.dispatchEvent(new Event('input',{bubbles:true}))})()`);
  await sleep(250);
  const s3 = await cdp.eval(`document.querySelectorAll('#grid .tile').length`);
  console.log(`清空搜索 -> 恢复 ${s3} 个`);

  const errs = cdp.events.filter(e => e.method === 'Runtime.exceptionThrown');
  console.log('\n运行期异常:', errs.length);
  errs.slice(0,3).forEach(e => console.log('  ', (e.params.exceptionDetails.exception?.description||'').split('\n')[0]));

  const ok = total === 28 && s3 === 28 && emptyShown === 'block';
  console.log(ok ? '\n✓ 筛选功能正常' : '\n✗ 有问题');
  cdp.ws.close(); process.exit(ok ? 0 : 1);
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });

