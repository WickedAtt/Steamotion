const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};
const UA = { 'User-Agent': 'Steamotion/1.0 (+https://wickedatt.github.io/Steamotion/)' };

const json = (data, ttl = 300, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': `public, max-age=${ttl}` },
  });

async function getJSON(url, init) {
  const r = await fetch(url, { headers: UA, ...init });
  if (!r.ok) throw new Error(`${url} -> ${r.status}`);
  return r.json();
}

async function steam(path, search) {
  const r = await fetch(`https://store.steampowered.com/api/${path}${search}`, { headers: UA });
  return new Response(r.body, {
    status: r.status,
    headers: { ...CORS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=600' },
  });
}

async function players(appid) {
  const [now, page, series] = await Promise.allSettled([
    getJSON(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appid}`),
    fetch(`https://steamcharts.com/app/${appid}`, { headers: UA }).then(r => (r.ok ? r.text() : '')),
    getJSON(`https://steamcharts.com/app/${appid}/chart-data.json`),
  ]);
  const out = { now: null, peak24: null, peakAll: null, series: [] };
  if (now.status === 'fulfilled' && now.value.response && now.value.response.result === 1) out.now = now.value.response.player_count;
  if (page.status === 'fulfilled' && page.value) {
    const nums = [...page.value.matchAll(/<div class="app-stat">\s*<span class="num">(\d+)<\/span>\s*<br>\s*([^<\n]*)/g)];
    for (const [, n, label] of nums) {
      if (/24-hour/.test(label)) out.peak24 = +n;
      else if (/all-time/.test(label)) out.peakAll = +n;
      else if (out.now == null) out.now = +n;
    }
  }
  if (series.status === 'fulfilled' && Array.isArray(series.value)) out.series = series.value;
  return json(out, 1800);
}

const DEF_ITAD_KEY = '005b4a2dbf0ec65a6ad887723d6d0c253045729f';
async function prices(appid, cc, env) {
  const key = (env && env.ITAD_KEY) || DEF_ITAD_KEY;
  const k = encodeURIComponent(key);
  const look = await getJSON(`https://api.isthereanydeal.com/games/lookup/v1?key=${k}&appid=${appid}`);
  if (!look.found) return json({ found: false, history: [] }, 86400);
  const id = look.game.id;
  const hist = await getJSON(
    `https://api.isthereanydeal.com/games/history/v2?key=${k}&id=${id}&country=${cc}&shops=61&since=2000-01-01T00:00:00Z`
  );
  const history = (hist || [])
    .filter(h => h.deal && h.deal.price)
    .map(h => ({
      t: Date.parse(h.timestamp),
      p: h.deal.price.amount,
      r: h.deal.regular ? h.deal.regular.amount : h.deal.price.amount,
      cut: h.deal.cut || 0,
      cur: h.deal.price.currency,
    }))
    .sort((a, b) => a.t - b.t);
  return json({ found: true, history }, 21600);
}

export default {
  async fetch(req, env, ctx) {
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
    if (req.method !== 'GET') return json({ error: 'method' }, 0, 405);
    const url = new URL(req.url);
    const cache = caches.default;
    const hit = await cache.match(req);
    if (hit) return hit;
    const p = url.pathname.replace(/\/+$/, '');
    const appid = (url.searchParams.get('appid') || '').replace(/\D/g, '');
    let res;
    try {
      if (p === '/appdetails' || p === '/featuredcategories' || p === '/storesearch') res = await steam(p.slice(1) + (p === '/storesearch' ? '/' : ''), url.search);
      else if (p === '/players' && appid) res = await players(appid);
      else if (p === '/prices' && appid) res = await prices(appid, (url.searchParams.get('cc') || 'US').replace(/[^a-z]/gi, '').slice(0, 2).toUpperCase(), env);
      else res = json({ ok: true, endpoints: ['/appdetails', '/featuredcategories', '/storesearch/', '/players?appid=', '/prices?appid=&cc='] }, 60);
    } catch (e) {
      return json({ error: String(e.message || e) }, 0, 502);
    }
    if (res.ok) ctx.waitUntil(cache.put(req, res.clone()));
    return res;
  },
};
