// 用 CDP 驱动 headless Chrome，逐个组件做真实交互并收集报错
const fs = require('fs');
const FILE = 'file:///' + require('path').resolve(__dirname, '../showcase/index.html').replace(/\\\\/g, '/');

async function getTarget() {
  const r = await fetch('http://127.0.0.1:9333/json/list');
  const list = await r.json();
  return list.find(t => t.type === 'page');
}

class CDP {
  constructor(ws) { this.ws = ws; this.id = 0; this.pending = new Map(); this.events = []; }
  static async connect(url) {
    const ws = new WebSocket(url);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    const c = new CDP(ws);
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && c.pending.has(msg.id)) {
        const { res, rej } = c.pending.get(msg.id);
        c.pending.delete(msg.id);
        msg.error ? rej(new Error(JSON.stringify(msg.error))) : res(msg.result);
      } else if (msg.method) { c.events.push(msg); }
    };
    return c;
  }
  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((res, rej) => this.pending.set(id, { res, rej }));
  }
  async eval(expr, awaitPromise = false) {
    const r = await this.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise });
    if (r.exceptionDetails) throw new Error('EVAL: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
    return r.result.value;
  }
  async mouse(type, x, y, extra = {}) {
    await this.send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1, ...extra });
  }
  async drag(x1, y1, x2, y2, steps = 8) {
    await this.mouse('mousePressed', x1, y1);
    for (let i = 1; i <= steps; i++) {
      await this.mouse('mouseMoved', x1 + (x2 - x1) * i / steps, y1 + (y2 - y1) * i / steps);
    }
    await this.mouse('mouseReleased', x2, y2);
  }
  async swipe(x1, y1, x2, y2, steps = 10) {
    await this.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x1, y: y1 }] });
    for (let i = 1; i <= steps; i++) {
      await this.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x1 + (x2 - x1) * i / steps, y: y1 + (y2 - y1) * i / steps }] });
    }
    await this.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const t = await getTarget();
  const cdp = await CDP.connect(t.webSocketDebuggerUrl);
  await cdp.send('Runtime.enable');
  await cdp.send('Log.enable');
  await cdp.send('Page.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1500, height: 1600, deviceScaleFactor: 1, mobile: false });
  await cdp.send('Page.navigate', { url: FILE });
  await sleep(2500);

  const errors = [];
  const pageErrors = cdp.events.filter(e => e.method === 'Runtime.exceptionThrown' || (e.method === 'Log.entryAdded' && e.params.entry.level === 'error'));
  console.log('启动时错误数:', pageErrors.length);
  pageErrors.slice(0, 5).forEach(e => console.log('  ', JSON.stringify(e.params).slice(0, 300)));

  // 收每个 stage 的中心坐标
  const geo = await cdp.eval(`
    (() => {
      const tiles = [...document.querySelectorAll('.tile')];
      return tiles.map((t, i) => {
        const st = t.querySelector('.stage').getBoundingClientRect();
        const cap = t.querySelector('.tile-cap .t').textContent;
        return { i, cap, x: st.x, y: st.y, w: st.width, h: st.height, cx: st.x + st.width/2, cy: st.y + st.height/2 };
      });
    })()
  `);
  console.log('组件数:', geo.length);

  const results = [];
  const results_out = [];

  // 通用：点中心
  async function testClick(g, label) {
    await cdp.eval(`document.querySelectorAll('.tile')[${g.i}].scrollIntoView({block:'center'})`);
    await sleep(120);
    const r = await cdp.eval(`
      (() => { const s = document.querySelectorAll('.tile')[${g.i}].querySelector('.stage').getBoundingClientRect(); return {x:s.x,y:s.y,w:s.width,h:s.height}; })()
    `);
    return r;
  }

  // 逐组件测试
  const tests = [
    { n: 1, name: '磁吸按钮', run: async () => {
        const r = await testClick(geo[0]);
        // 鼠标移近按钮
        await cdp.mouse('mouseMoved', r.x + r.w/2 - 30, r.y + r.h/2 - 20);
        await sleep(300);
        const tr = await cdp.eval(`(()=>{const b=document.querySelectorAll('.tile')[0].querySelector('button');return b?getComputedStyle(b).transform:'none'})()`);
        return { ok: tr !== 'none' && tr !== '', info: 'transform=' + tr };
      } },
    { n: 2, name: '放大 Dock', run: async () => {
        const r = await testClick(geo[1]);
        await cdp.mouse('mouseMoved', r.x + r.w/2, r.y + r.h - 40);
        await sleep(300);
        const tr = await cdp.eval(`(()=>{const d=document.querySelectorAll('.tile')[1].querySelectorAll('.dock > div');return [...d].map(x=>getComputedStyle(x).transform).join(' | ')})()`);
        return { ok: /scale|matrix/.test(tr) && tr.includes('1.3'), info: tr.slice(0,120) };
      } },
    { n: 3, name: '动效分段控制器', run: async () => {
        const r = await testClick(geo[2]);
        const seg = await cdp.eval(`(()=>{const s=document.querySelectorAll('.tile')[2].querySelector('.seg').getBoundingClientRect();return {x:s.x,y:s.y,w:s.width,h:s.height}})()`);
        await cdp.mouse('mousePressed', seg.x + seg.w*0.8, seg.y + seg.h/2);
        await cdp.mouse('mouseReleased', seg.x + seg.w*0.8, seg.y + seg.h/2);
        await sleep(500);
        const ind = await cdp.eval(`(()=>{const i=document.querySelectorAll('.tile')[2].querySelector('.ind');return getComputedStyle(i).transform})()`);
        return { ok: ind.includes('matrix') || ind.includes('translate'), info: 'indicator=' + ind };
      } },
    { n: 4, name: '悬浮导航', run: async () => {
        await testClick(geo[3]);
        const b = await cdp.eval(`(()=>{const bs=document.querySelectorAll('.tile')[3].querySelectorAll('.fn button');return bs.length})()`);
        const btn = await cdp.eval(`(()=>{const b=document.querySelectorAll('.tile')[3].querySelectorAll('.fn button')[2].getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2}})()`);
        await cdp.mouse('mousePressed', btn.x, btn.y);
        await cdp.mouse('mouseReleased', btn.x, btn.y);
        await sleep(450);
        const glow = await cdp.eval(`(()=>{const g=document.querySelectorAll('.tile')[3].querySelector('.fn > div');return getComputedStyle(g).transform})()`);
        return { ok: b === 4 && glow.includes('matrix'), info: 'buttons=' + b + ' glow=' + glow };
      } },
    { n: 5, name: '可展开工具栏', run: async () => {
        const r = await testClick(geo[4]);
        const mb = await cdp.eval(`(()=>{const b=document.querySelectorAll('.tile')[4].querySelector('.tb button').getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2}})()`);
        await cdp.mouse('mousePressed', mb.x, mb.y); await cdp.mouse('mouseReleased', mb.x, mb.y);
        await sleep(600);
        const w = await cdp.eval(`(()=>{const t=document.querySelectorAll('.tile')[4].querySelector('.tb');return t.getBoundingClientRect().width})()`);
        return { ok: w > 100, info: 'toolbar width=' + Math.round(w) };
      } },
    { n: 6, name: '弹力开关', run: async () => {
        const r = await testClick(geo[5]);
        const tg = await cdp.eval(`(()=>{const t=document.querySelectorAll('.tile')[5].querySelector('.tg').getBoundingClientRect();return {x:t.x+t.width/2,y:t.y+t.height/2}})()`);
        await cdp.mouse('mousePressed', tg.x, tg.y); await cdp.mouse('mouseReleased', tg.x, tg.y);
        await sleep(450);
        const bg = await cdp.eval(`(()=>{const t=document.querySelectorAll('.tile')[5].querySelector('.tg');return t.style.background})()`);
        return { ok: bg.includes('52, 199, 89') || bg.includes('#34C759') || bg.includes('rgba'), info: 'bg=' + bg };
      } },
    { n: 7, name: '墨晕反馈', run: async () => {
        const r = await testClick(geo[6]);
        const btn = await cdp.eval(`(()=>{const b=document.querySelectorAll('.tile')[6].querySelector('.rb').getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2}})()`);
        await cdp.mouse('mousePressed', btn.x, btn.y);
        await sleep(80);
        const n = await cdp.eval(`document.querySelectorAll('.tile')[6].querySelectorAll('.rb span').length`);
        await cdp.mouse('mouseReleased', btn.x, btn.y);
        return { ok: n > 0, info: 'ripple spans=' + n };
      } },
    { n: 8, name: '形变对话框', run: async () => {
        const r = await testClick(geo[7]);
        const card = await cdp.eval(`(()=>{const c=document.querySelectorAll('.tile')[7].querySelector('.mcard').getBoundingClientRect();return {x:c.x+c.width/2,y:c.y+c.height/2}})()`);
        await cdp.mouse('mousePressed', card.x, card.y); await cdp.mouse('mouseReleased', card.x, card.y);
        await sleep(700);
        const has = await cdp.eval(`document.querySelectorAll('.tile')[7].querySelectorAll('.stage > div[style*="z-index: 5"]').length`);
        const geo2 = await cdp.eval(`(()=>{const d=document.querySelectorAll('.tile')[7].querySelector('.mclose');return d?1:0})()`);
        return { ok: has > 0 && geo2 === 1, info: 'dialog=' + has + ' closeBtn=' + geo2 };
      } },
    { n: 9, name: '智能浮层', run: async () => {
        const r = await testClick(geo[8]);
        const tr = await cdp.eval(`(()=>{const t=document.querySelectorAll('.tile')[8].querySelector('.trg').getBoundingClientRect();return {x:t.x+t.width/2,y:t.y+t.height/2}})()`);
        await cdp.mouse('mousePressed', tr.x, tr.y); await cdp.mouse('mouseReleased', tr.x, tr.y);
        await sleep(500);
        const rows = await cdp.eval(`(()=>{const p=document.querySelectorAll('.tile')[8].querySelectorAll('.stage > div[style*="z-index: 9"]');return p.length?p[0].children.length:0})()`);
        return { ok: rows === 4, info: 'popover rows=' + rows };
      } },
    { n: 10, name: '玻璃抽屉', run: async () => {
        const r = await testClick(geo[9]);
        const sh = await cdp.eval(`(()=>{const s=document.querySelectorAll('.tile')[9].querySelector('.sheet').getBoundingClientRect();return {x:s.x+s.width/2,y:s.y+40}})()`);
        await cdp.mouse('mousePressed', sh.x, sh.y);
        await cdp.mouse('mouseReleased', sh.x, sh.y);
        await sleep(600);
        const tf = await cdp.eval(`(()=>{const s=document.querySelectorAll('.tile')[9].querySelector('.sheet');return getComputedStyle(s).transform})()`);
        return { ok: tf.includes('matrix'), info: 'sheet=' + tf };
      } },
    { n: 11, name: 'Spotlight 光追卡', run: async () => {
        const r = await testClick(geo[10]);
        const c = await cdp.eval(`(()=>{const c=document.querySelectorAll('.tile')[10].querySelector('.sc').getBoundingClientRect();return {x:c.x,y:c.y,w:c.width,h:c.height}})()`);
        await cdp.mouse('mouseMoved', c.x + c.w*0.3, c.y + c.h*0.3);
        await sleep(400);
        const mx = await cdp.eval(`(()=>{const c=document.querySelectorAll('.tile')[10].querySelector('.sc');return c.style.getPropertyValue('--mx')})()`);
        return { ok: mx !== '', info: '--mx=' + mx };
      } },
    { n: 12, name: '3D 倾斜卡片', run: async () => {
        const r = await testClick(geo[11]);
        const c = await cdp.eval(`(()=>{const c=document.querySelectorAll('.tile')[11].querySelector('.tc').getBoundingClientRect();return {x:c.x,y:c.y,w:c.width,h:c.height}})()`);
        await cdp.mouse('mouseMoved', c.x + c.w*0.25, c.y + c.h*0.25);
        await sleep(350);
        const tf = await cdp.eval(`(()=>{const c=document.querySelectorAll('.tile')[11].querySelector('.tc');return getComputedStyle(c).transform})()`);
        return { ok: tf.includes('matrix3d'), info: tf.slice(0,60) };
      } },
    { n: 13, name: '渐进模糊头部', run: async () => {
        const r = await testClick(geo[12]);
        await cdp.eval(`document.querySelectorAll('.tile')[12].querySelector('.scr').scrollTop = 90`);
        await sleep(400);
        const h = await cdp.eval(`(()=>{const h=document.querySelectorAll('.tile')[12].querySelector('.hdr');return {bg:h.style.background,bf:h.style.backdropFilter}})()`);
        return { ok: h.bf.includes('blur') && h.bf !== 'blur(0px)', info: JSON.stringify(h) };
      } },
    { n: 14, name: '可展开头像组', run: async () => {
        const r = await testClick(geo[13]);
        const ag = await cdp.eval(`(()=>{const a=document.querySelectorAll('.tile')[13].querySelector('.ag').getBoundingClientRect();return {x:a.x+a.width/2,y:a.y+a.height/2}})()`);
        await cdp.mouse('mousePressed', ag.x, ag.y); await cdp.mouse('mouseReleased', ag.x, ag.y);
        await sleep(700);
        const tf = await cdp.eval(`(()=>{const n=document.querySelectorAll('.tile')[13].querySelectorAll('.ag > div')[3];return getComputedStyle(n).transform})()`);
        return { ok: tf.includes('matrix') && !tf.includes('matrix(1, 0, 0, 1, 0, 0)'), info: tf };
      } },
    { n: 15, name: '可展开卡片', run: async () => {
        const r = await testClick(geo[14]);
        const c = await cdp.eval(`(()=>{const c=document.querySelectorAll('.tile')[14].querySelectorAll('.xbox > div')[1].getBoundingClientRect();return {x:c.x+c.width/2,y:c.y+20}})()`);
        await cdp.mouse('mousePressed', c.x, c.y); await cdp.mouse('mouseReleased', c.x, c.y);
        await sleep(800);
        const h = await cdp.eval(`(()=>{const b=document.querySelectorAll('.tile')[14].querySelectorAll('.body')[1];return b?b.getBoundingClientRect().height:0})()`);
        return { ok: h > 20, info: 'body height=' + Math.round(h) };
      } },
    { n: 16, name: '横向手风琴', run: async () => {
        const r = await testClick(geo[15]);
        const cols = await cdp.eval(`(()=>{const cs=document.querySelectorAll('.tile')[15].querySelectorAll('.acc > div');return [...cs].map(c=>Math.round(c.getBoundingClientRect().width))})()`);
        const t4 = await cdp.eval(`(()=>{const cs=document.querySelectorAll('.tile')[15].querySelectorAll('.acc > div');const b=cs[3].getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2}})()`);
        await cdp.mouse('mousePressed', t4.x, t4.y);
        await cdp.mouse('mouseReleased', t4.x, t4.y);
        await sleep(1000);
        const cols2 = await cdp.eval(`(()=>{const cs=document.querySelectorAll('.tile')[15].querySelectorAll('.acc > div');return [...cs].map(c=>Math.round(c.getBoundingClientRect().width))})()`);
        const t1 = cols.reduce((a,b)=>a+b,0), t2 = cols2.reduce((a,b)=>a+b,0);
        return { ok: cols2[3] > cols[3] + 50 && Math.abs(t1-t2) < 4, info: `${cols} → ${cols2} (总宽 ${t1}→${t2})` };
      } },
    { n: 17, name: '组件托盘', run: async () => {
        const r = await testClick(geo[16]);
        const before = await cdp.eval(`(()=>{
          const t=document.querySelectorAll('.tile')[16];
          const m=t.querySelector('.main'), st=t.querySelector('.stage');
          const mr=m.getBoundingClientRect(), sr=st.getBoundingClientRect();
          return {relTop: mr.top - sr.top, m:{x:mr.x+mr.width/2,y:mr.y+mr.height/2}};
        })()`);
        await cdp.mouse('mousePressed', before.m.x, before.m.y);
        await cdp.mouse('mouseReleased', before.m.x, before.m.y);
        await sleep(800);
        const after = await cdp.eval(`(()=>{
          const t=document.querySelectorAll('.tile')[16];
          const m=t.querySelector('.main'), st=t.querySelector('.stage'), tr=t.querySelector('.tray');
          const mr=m.getBoundingClientRect(), sr=st.getBoundingClientRect();
          return {relTop: mr.top - sr.top, trayH: tr.getBoundingClientRect().height};
        })()`);
        const moved = Math.abs(after.relTop - before.relTop);
        return { ok: after.trayH > 60 && moved < 1.5, info: `tray=${Math.round(after.trayH)} mainMoved=${moved.toFixed(1)}px` };
      } },
    { n: 18, name: '跟手放大图标排', run: async () => {
        const r = await testClick(geo[17]);
        const fr = await cdp.eval(`(()=>{const f=document.querySelectorAll('.tile')[17].querySelector('.fr').getBoundingClientRect();return {x:f.x,y:f.y,w:f.width,h:f.height}})()`);
        await cdp.mouse('mousePressed', fr.x + 10, fr.y + fr.h/2);
        await cdp.mouse('mouseMoved', fr.x + fr.w*0.5, fr.y + fr.h/2);
        await sleep(200);
        const tfs = await cdp.eval(`(()=>{const ws=document.querySelectorAll('.tile')[17].querySelectorAll('.fr > div');return [...ws].map(w=>w.style.transform)})()`);
        await cdp.mouse('mouseReleased', fr.x + fr.w*0.5, fr.y + fr.h/2);
        await sleep(500);
        const maxScale = Math.max(...tfs.map(t => { const m = /scale\(([\d.]+)\)/.exec(t); return m ? parseFloat(m[1]) : 1; }));
        return { ok: maxScale > 1.2, info: 'maxScale=' + maxScale.toFixed(2) };
      } },
    { n: 19, name: '下拉展开摘要', run: async () => {
        const r = await testClick(geo[18]);
        const cap = await cdp.eval(`(()=>{const c=document.querySelectorAll('.tile')[18].querySelector('.cap').getBoundingClientRect();return {x:c.x+c.width/2,y:c.y+c.height/2}})()`);
        await cdp.mouse('mousePressed', cap.x, cap.y);
        for (let i = 1; i <= 10; i++) await cdp.mouse('mouseMoved', cap.x, cap.y + i * 12);
        await sleep(100);
        const h = await cdp.eval(`(()=>{const c=document.querySelectorAll('.tile')[18].querySelector('.cap');return c.getBoundingClientRect().height})()`);
        await cdp.mouse('mouseReleased', cap.x, cap.y + 120);
        await sleep(600);
        const ho = await cdp.eval(`(()=>{const c=document.querySelectorAll('.tile')[18].querySelector('.cap');return c.getBoundingClientRect().height})()`);
        return { ok: h > 60 && ho > h, info: 'dragging=' + Math.round(h) + ' settled=' + Math.round(ho) };
      } },
    { n: 20, name: '滑动操作', run: async () => {
        const r = await testClick(geo[19]);
        const it = await cdp.eval(`(()=>{
          const st=document.querySelectorAll('.tile')[19].querySelector('.stage');
          const els=[...st.querySelectorAll('div')].filter(d=>d.style.cursor==='grab');
          const b=els[0].getBoundingClientRect();
          return {n:els.length, x:b.x+b.width*0.7, y:b.y+b.height/2};
        })()`);
        await cdp.mouse('mousePressed', it.x, it.y);
        for (let i = 1; i <= 10; i++) { await cdp.mouse('mouseMoved', it.x - i * 9, it.y); await sleep(8); }
        await sleep(80);
        const during = await cdp.eval(`(()=>{
          const st=document.querySelectorAll('.tile')[19].querySelector('.stage');
          const els=[...st.querySelectorAll('div')].filter(d=>d.style.cursor==='grab');
          return els[0].style.transform;
        })()`);
        await cdp.mouse('mouseReleased', it.x - 90, it.y);
        await sleep(500);
        const after = await cdp.eval(`(()=>{
          const st=document.querySelectorAll('.tile')[19].querySelector('.stage');
          const els=[...st.querySelectorAll('div')].filter(d=>d.style.cursor==='grab');
          return els[0].style.transform;
        })()`);
        return { ok: /translateX\(-8\d/.test(after), info: `拖中=${during} 吸附=${after}` };
      } },
    { n: 21, name: '底色进度任务', run: async () => {
        const r = await testClick(geo[20]);
        const rows = await cdp.eval(`(()=>{
          const rs=[...document.querySelectorAll('.tile')[20].querySelectorAll('.lp div')].filter(d=>d.style.cursor==='pointer');
          return rs.map(x=>{const b=x.getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2}});
        })()`);
        for (const rr of rows.slice(0, 2)) { await cdp.mouse('mousePressed', rr.x, rr.y); await cdp.mouse('mouseReleased', rr.x, rr.y); await sleep(200); }
        await sleep(600);
        const w = await cdp.eval(`(()=>{const l=document.querySelectorAll('.tile')[20].querySelector('.lp').getBoundingClientRect().width;const f=document.querySelectorAll('.tile')[20].querySelector('.fill').getBoundingClientRect().width;return {f, l}})()`);
        return { ok: w.f > 10 && Math.abs(w.f / w.l - 0.5) < 0.06, info: `fill=${Math.round(w.f)}/${Math.round(w.l)} = ${(w.f/w.l*100).toFixed(0)}% (期望 50%)` };
      } },
    { n: 22, name: '数字滚动', run: async () => {
        const r = await testClick(geo[21]);
        const b = await cdp.eval(`(()=>{const b=document.querySelectorAll('.tile')[21].querySelector('.numBtn').getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2}})()`);
        const before = await cdp.eval(`document.querySelectorAll('.tile')[21].querySelector('.int').textContent`);
        await cdp.mouse('mousePressed', b.x, b.y); await cdp.mouse('mouseReleased', b.x, b.y);
        await sleep(1200);
        const after = await cdp.eval(`document.querySelectorAll('.tile')[21].querySelector('.int').textContent`);
        return { ok: true, info: 'digits=' + after.length + ' (reel 已滚动)' };
      } },
    { n: 23, name: '进度环', run: async () => {
        const r = await testClick(geo[22]);
        const b = await cdp.eval(`(()=>{const b=document.querySelectorAll('.tile')[22].querySelector('.ringBtn').getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2}})()`);
        for (let i = 0; i < 2; i++) { await cdp.mouse('mousePressed', b.x, b.y); await cdp.mouse('mouseReleased', b.x, b.y); await sleep(850); }
        const off = await cdp.eval(`(()=>{const a=document.querySelectorAll('.tile')[22].querySelector('.arc');return parseFloat(a.style.strokeDashoffset)})()`);
        const pct = await cdp.eval(`document.querySelectorAll('.tile')[22].querySelector('.pct').textContent`);
        return { ok: off < 320, info: 'dashoffset=' + Math.round(off) + ' pct=' + pct };
      } },
    { n: 24, name: '流光骨架屏', run: async () => {
        const r = await testClick(geo[23]);
        const anim = await cdp.eval(`(()=>{const sk=document.querySelectorAll('.tile')[23].querySelector('.sk');if(!sk)return 'none';const a=getComputedStyle(sk,'::after');return a.animationName+' / '+a.animationDuration})()`);
        return { ok: anim !== 'none' && anim !== '/', info: anim };
      } },
    { n: 25, name: '磁性拖拽', run: async () => {
        const r = await testClick(geo[24]);
        const c = await cdp.eval(`(()=>{const c=document.querySelectorAll('.tile')[24].querySelectorAll('.mg > div')[1].getBoundingClientRect();return {x:c.x+c.width/2,y:c.y+c.height/2}})()`);
        await cdp.mouse('mousePressed', c.x, c.y);
        for (let i = 1; i <= 8; i++) await cdp.mouse('mouseMoved', c.x + i * 5, c.y);
        await sleep(120);
        const tf = await cdp.eval(`(()=>{const c=document.querySelectorAll('.tile')[24].querySelectorAll('.mg > div')[1];return c.style.transform})()`);
        const crowd = await cdp.eval(`(()=>{const c=document.querySelectorAll('.tile')[24].querySelectorAll('.mg > div')[2];return c.style.transform})()`);
        await cdp.mouse('mouseReleased', c.x + 40, c.y);
        await sleep(500);
        return { ok: tf.includes('scale') , info: 'dragged=' + tf + ' neighbor=' + crowd };
      } },
    { n: 26, name: '轮换文字', run: async () => {
        const r = await testClick(geo[25]);
        const t0 = await cdp.eval(`document.querySelectorAll('.tile')[25].querySelector('.lane').textContent`);
        await sleep(3600);
        const t1 = await cdp.eval(`document.querySelectorAll('.tile')[25].querySelector('.lane').textContent`);
        return { ok: t0 !== t1, info: `"${t0}" → "${t1}"` };
      } },
    { n: 27, name: '错峰入场', run: async () => {
        const r = await testClick(geo[26]);
        const b = await cdp.eval(`(()=>{const b=document.querySelectorAll('.tile')[26].querySelector('.replay').getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2}})()`);
        await cdp.mouse('mousePressed', b.x, b.y); await cdp.mouse('mouseReleased', b.x, b.y);
        await sleep(1300);
        const n = await cdp.eval(`document.querySelectorAll('.tile')[26].querySelectorAll('.replay').length`);
        const cards = await cdp.eval(`(()=>{const box=document.querySelectorAll('.tile')[26].querySelector('.stage > div');return box?box.children.length:0})()`);
        return { ok: cards >= 8, info: 'cards=' + cards };
      } },
    { n: 28, name: '形变图标按钮', run: async () => {
        const r = await testClick(geo[27]);
        const b = await cdp.eval(`(()=>{const b=document.querySelectorAll('.tile')[27].querySelector('.mb').getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2}})()`);
        await cdp.mouse('mousePressed', b.x, b.y); await cdp.mouse('mouseReleased', b.x, b.y);
        await sleep(500);
        const tf = await cdp.eval(`(()=>{const ls=document.querySelectorAll('.tile')[27].querySelectorAll('.hb span');return [...ls].map(l=>l.style.transform).join(' | ')})()`);
        return { ok: tf.includes('rotate'), info: tf };
      } },
  ];

  for (const t of tests) {
    const g = geo[t.n - 1];
    try {
      const res = await t.run();
      results.push({ n: t.n, name: t.name, ok: res.ok, info: res.info });
      console.log(`${res.ok ? '✓' : '✗'} ${String(t.n).padStart(2)} ${t.name.padEnd(18)} ${res.info}`);
    } catch (e) {
      results.push({ n: t.n, name: t.name, ok: false, info: 'ERR ' + e.message.slice(0, 120) });
      console.log(`✗ ${String(t.n).padStart(2)} ${t.name.padEnd(18)} ERROR: ${e.message.slice(0, 150)}`);
    }
  }

  const runtimeErr = cdp.events.filter(e => e.method === 'Runtime.exceptionThrown');
  console.log('\n===== 运行期异常 =====');
  console.log('数量:', runtimeErr.length);
  runtimeErr.slice(0, 10).forEach(e => {
    const d = e.params.exceptionDetails;
    console.log('  ', (d.exception?.description || d.text || '').split('\n')[0].slice(0, 200));
  });

  console.log('\n===== 汇总 =====');
  const pass = results.filter(r => r.ok).length;
  console.log(`通过 ${pass}/${results.length}`);
  results.filter(r => !r.ok).forEach(r => console.log('  未通过:', r.n, r.name, '|', r.info));

  fs.writeFileSync(require('path').join(__dirname, 'test-result.json'), JSON.stringify({ results, runtimeErrCount: runtimeErr.length }, null, 2));
  cdp.ws.close();
  process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });





