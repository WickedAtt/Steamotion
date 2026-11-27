/* Steamotion: Steam data, pages, library and event handlers */
const vSet=()=>`<h2>Налаштування</h2><div class="panel"><b>Мова застосунку</b><div class="form">${[['en','English'],['uk','Українська'],['nb','Norsk bokmål']].map(([c,n])=>`<button class="btn ${c===LANG?'':'s'}" data-a="lang" data-c="${c}">${n}</button>`).join('')}</div></div><div class="panel"><b>Адреса Steam-проксі (Cloudflare Worker)</b><small style="display:block;margin:4px 0">Вбудований проксі працює за замовчуванням. Залиште поле порожнім, щоб повернути його.</small><div class="form"><input id="api" placeholder="https://….workers.dev" value="${E(S('se_api',''))}"><button class="btn" data-a="api">Зберегти</button></div></div>`;
let CH=null;
const DEF_API='',IK='005b4a2dbf0ec65a6ad887723d6d0c253045729f';
let API=S('se_api',''),LS=null,LE=false,LD={},DT=0;
const CC={UAH:'ua',NOK:'no',USD:'us'},SL={en:'english',uk:'ukrainian',nb:'norwegian'},LOC={uk:'uk-UA',en:'en-US',nb:'nb-NO'},lk=()=>st.cur+LANG;
const jina=async u=>{const r=await fetch('https://r.jina.ai/'+u);if(!r.ok)throw 0;const t=await r.text(),m='Markdown Content:',i=t.indexOf(m);return JSON.parse((i>=0?t.slice(i+m.length):t).trim())};
const itadId=async id=>{const r=await fetch(`https://api.isthereanydeal.com/games/lookup/v1?key=${IK}&appid=${id}`);const j=await r.json();return j&&j.found&&j.game?j.game.id:null};
async function dJ(p){
 const u=new URL(p,'http://x'),id=(u.searchParams.get('appid')||'').replace(/\D/g,'');
 if(u.pathname==='/players'&&id){
  const [now,info,sc]=await Promise.allSettled([
   jina(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${id}`),
   itadId(id).then(g=>g?fetch(`https://api.isthereanydeal.com/games/info/v2?key=${IK}&id=${g}`).then(r=>r.json()):null),
   jina(`https://steamcharts.com/app/${id}/chart-data.json`).catch(()=>fetch('https://api.allorigins.win/raw?url='+encodeURIComponent(`https://steamcharts.com/app/${id}/chart-data.json`)).then(r=>r.json()))
  ]);
  const series=sc.status==='fulfilled'&&Array.isArray(sc.value)?sc.value:[];
  const pl=info.status==='fulfilled'&&info.value&&info.value.players?info.value.players:{};
  let mx=pl.peak??null;for(const q of series)if(q[1]>(mx||0))mx=q[1];
  const cur=now.status==='fulfilled'&&now.value&&now.value.response&&now.value.response.result===1?now.value.response.player_count:(pl.recent??(series.length?series[series.length-1][1]:null));
  return {now:cur,peak24:pl.day??null,peakAll:mx,series};
 }
 if(u.pathname==='/prices'&&id){
  const cc=(u.searchParams.get('cc')||'US').toUpperCase(),g=await itadId(id);
  if(!g)return {found:false,history:[]};
  const r=await fetch(`https://api.isthereanydeal.com/games/history/v2?key=${IK}&id=${g}&country=${cc}&shops=61&since=2000-01-01T00:00:00Z`),hist=await r.json();
  const history=(hist||[]).filter(h=>h.deal&&h.deal.price).map(h=>({t:Date.parse(h.timestamp),p:h.deal.price.amount,r:h.deal.regular?h.deal.regular.amount:h.deal.price.amount,cut:h.deal.cut||0,cur:h.deal.price.currency})).sort((a,b)=>a.t-b.t);
  return {found:true,history};
 }
 return jina('https://store.steampowered.com/api'+p);
}
const J=async p=>{if(API){try{const r=await fetch(API.replace(/\/$/,'')+p);if(r.ok)return r.json()}catch(e){}}return dJ(p)};
const mn=(v,c)=>{try{return new Intl.NumberFormat(LOC[LANG],{style:'currency',currency:c}).format(v)}catch(e){return v+' '+c}};
const lp=x=>{const i=x.io,f=x.fi,s=i>f?Math.round((1-f/i)*100):0;return (s?`<span class="ds">−${s}%</span><span class="old">${mn(i/100,x.cu)}</span>`:'')+`<span class="np">${f?mn(f/100,x.cu):'Безкоштовно'}</span>`};
const lcard=x=>`<div class="card" data-a="lgame" data-id="${x.id}"><img class="im" src="${E(x.img||'')}" alt="" loading="lazy"><div class="inf"><b>${E(x.n)}</b><div class="pt">${lp(x)}</div></div></div>`;
async function loadStore(){const k=lk();LE=false;try{const d=await J(`/featuredcategories?cc=${CC[st.cur]}&l=${SL[LANG]}`);LS=((d.specials&&d.specials.items)||[]).map(x=>({id:x.id,n:x.name,img:x.header_image||x.large_capsule_image,fi:x.final_price,io:x.original_price,cu:x.currency}))}catch(e){LE=true;LS=[]}LS.k=k;if(st.v==='store'&&!st.live)R(false)}
const vLS=()=>{if(!LS||LS.k!==lk()){loadStore();return '<h2>Знижки та новинки</h2><p>Завантаження…</p>'}return `<h2>Знижки та новинки</h2>${LE?'<p>Не вдалося отримати дані від Steam. Перевірте адресу проксі в налаштуваннях.</p>':LS.map(lcard).join('')}<small>Ціни та знижки напряму зі Steam для вибраного регіону.</small>`};
function ddL(){const q=$('#q').value.trim(),box=$('#dd');box.style.display='block';
 if(!q){if(!LS||LS.k!==lk())loadStore();box.innerHTML=TR('<h6>Популярні пошукові запити</h6>')+(LS&&LS.k===lk()?LS.slice(0,4).map(lcard).join(''):TR('<h6>Завантаження…</h6>'));return}
 clearTimeout(DT);DT=setTimeout(async()=>{try{const d=await J(`/storesearch/?term=${encodeURIComponent(q)}&cc=${CC[st.cur]}&l=${SL[LANG]}`);if($('#q').value.trim()!==q)return;const L2=(d.items||[]).slice(0,8).map(x=>({id:x.id,n:x.name,img:x.tiny_image,fi:x.price&&x.price.final,io:x.price&&x.price.initial,cu:(x.price&&x.price.currency)||'USD'}));box.innerHTML=TR(L2.length?L2.map(lcard).join(''):'<h6>Нічого не знайдено</h6>')}catch(e){box.innerHTML=TR('<h6>Не вдалося отримати дані від Steam. Перевірте адресу проксі в налаштуваннях.</h6>')}},350)}
async function loadGame(id){const k=id+lk();if(LD[k]!==undefined||LD[k+'p'])return;LD[k+'p']=1;try{const r=await Promise.all(['ua','no','us'].map(c=>J(`/appdetails?appids=${id}&cc=${c}&l=${SL[LANG]}`)));LD[k]=r.map(o=>o[id]&&o[id].success?o[id].data:null)}catch(e){LD[k]=0}if(st.v==='game'&&st.live&&st.gid===id)R(false)}
const rq=h=>h?new DOMParser().parseFromString(h.replace(/<br\s*\/?>|<\/li>/g,'\n'),'text/html').body.textContent.trim():'';
function vLive(){const id=st.gid,D0=LD[id+lk()],back='<button class="back" data-a="nav" data-v="store">← Усі ігри</button>';
 if(D0===undefined){loadGame(id);return back+'<p>Завантаження…</p>'}
 if(!D0||!D0.some(Boolean))return back+'<p>Не вдалося отримати дані від Steam. Перевірте адресу проксі в налаштуваннях.</p>';
 const d=D0.find(Boolean),ci=['UAH','NOK','USD'].indexOf(st.cur),cur=D0[ci]||d,cp=cur.price_overview,ua=D0[0]&&D0[0].price_overview;
 st.lg={n:d.name,p:ua?ua.initial/100:(cp?cp.initial/100/RT[st.cur]:0),paid:ua?ua.final/100:(cp?cp.final/100/RT[st.cur]:0),c:'#3b4a8a',img:d.header_image||'',appid:id};st.pd=[d,cp];
 const mv=(d.movies||[]).filter(m=>m.mp4||m.webm).slice(0,3).map(m=>`<div class="sl"><video controls playsinline preload="none" poster="${E(m.thumbnail||'')}" style="width:100%;height:190px;background:#000"><source src="${E((m.mp4&&(m.mp4['480']||m.mp4.max))||'')}" type="video/mp4"><source src="${E((m.webm&&(m.webm['480']||m.webm.max))||'')}" type="video/webm"></video><small class="cnt">${E(m.name||'')}</small></div>`),
 sc=(d.screenshots||[]).slice(0,8).map(s=>`<div class="sl"><img src="${E(s.path_full)}" alt="" loading="lazy" style="width:100%;height:190px;object-fit:cover;display:block"></div>`),
 rg=[['UAH','Гривня',0],['NOK','Норвезька крона',1],['USD','Долар США',2]].map(([c,n,i])=>{const p=D0[i]&&D0[i].price_overview;return `<tr data-a="cur" data-c="${c}" class="${st.cur===c?'on':''}"><td>${n}</td><td>${p?`${p.discount_percent?`<span class="ds">−${p.discount_percent}%</span> <span class="old">${E(p.initial_formatted||'')}</span> `:''}<b>${E(p.final_formatted||'')}</b>`:(D0[i]&&D0[i].is_free?'Безкоштовно':'—')}</td></tr>`}).join(''),
 sp=[['Розробник',(d.developers||[]).join(', ')],['Видавець',(d.publishers||[]).join(', ')],['Дата виходу',d.release_date&&d.release_date.date],['Рецензії',d.recommendations&&d.recommendations.total.toLocaleString(LOC[LANG])],['Metacritic',d.metacritic&&d.metacritic.score],['Категорії',(d.categories||[]).map(c=>c.description).slice(0,6).join(', ')]].filter(r=>r[1]).map(r=>`<span>${r[0]}</span><span>${E(r[1])}</span>`).join(''),
 mi=rq(d.pc_requirements&&d.pc_requirements.minimum),re=rq(d.pc_requirements&&d.pc_requirements.recommended);
 return back+`<h2>${E(d.name)}</h2><div class="gal">${[...mv,...sc].join('')}</div><div class="chips">${(d.genres||[]).map(g=>`<span>${E(g.description)}</span>`).join('')}</div><p>${E(d.short_description||'')}</p><div class="panel kv">${sp}</div>
<div class="panel"><b>Ціна у валютах</b><small style="display:block;margin:4px 0">Ціни напряму зі Steam для кожного регіону, без конвертації.</small><table>${rg}</table><div class="form"><div class="row" style="justify-content:space-between"><small>Дата придбання</small><input type="date" id="pdt" value="${st.pdt||dstr(0)}" max="${dstr(0)}" style="background:#12124d;border:1px solid #2a2a8a;border-radius:6px;color:#fff;font:inherit;padding:6px"></div><div id="pdp">${pdpH()}</div><small>Буде записано ціну Steam на вибрану дату.</small><button class="btn" data-a="addg">У бібліотеку</button></div></div>
<div id="pl-box">${plBox()}</div><div id="pr-box">${prBox()}</div>
${mi?`<div class="panel"><b>Системні вимоги</b><small style="display:block;white-space:pre-line;margin-top:10px">${rqH(mi)}</small>${re?`<small style="display:block;white-space:pre-line;margin-top:18px;padding-top:14px;border-top:1px solid rgba(255,255,255,.12)">${rqH(re)}</small>`:''}</div>`:''}`}
const rqH=t=>{const[h,...r]=t.split('\n');return /:\s*$/.test(h)&&h.length<40?`<b style="display:block;margin-bottom:4px">${E(h.trim())}</b>${E(r.join('\n').trim())}`:E(t)};
function tipH(i){const{s,g}=CH,o=s.length-1-i,v=s[i],d=g.p?Math.round((1-v/g.p)*100):0;return `<b>${dstr(o)}</b><br>Ціна: ${F(v)}${d>0?` · знижка −${d}%`:''}<br><button class="btn s" style="margin-top:6px" data-a="setd" data-o="${o}">Показати ціни на цю дату</button>`}
const specs=g=>{const a=hist(g);let n=0;for(let i=1;i<730;i++)if(a[i]<a[i-1])n++;return `<div class="panel kv"><b style="grid-column:1/-1">Характеристики</b><span>Теги</span><span>${g.t.join(', ')}</span><span>Модель</span><span>${g.p?'Платна':'Безкоштовна'}</span><span>Базова ціна</span><span>${F(g.p)}</span><span>Мінімум (2 роки)</span><span>${F(Math.min(...a))}</span><span>Розпродажів</span><span>${n} за 2 роки</span></div>`};
const curT=g=>{const lo=Math.min(...hist(g)),v=pa(g,st.off);return `<div class="panel"><b>Ціна у валютах</b><small style="display:block;margin:4px 0">Торкніться валюти, щоб обрати її. Курси орієнтовні.</small><table>${['UAH','NOK','USD'].map(c=>`<tr data-a="cur" data-c="${c}" class="${st.cur===c?'on':''}"><td>${{UAH:'Гривня',NOK:'Норвезька крона',USD:'Долар США'}[c]}</td><td>${fc(v,c)}</td><td>${fc(lo,c)}</td></tr>`).join('')}</table><small>Колонки: на вибрану дату · мінімум за 2 роки</small></div>`};
const dateCtl=()=>`<div class="panel row"><small>Ціни на дату</small><input type="date" id="dt" value="${dstr(st.off)}" min="${dstr(729)}" max="${dstr(0)}" style="flex:1;background:#12124d;border:1px solid #2a2a8a;border-radius:6px;color:#fff;font:inherit;padding:6px"><button class="btn s" data-a="today">Сьогодні</button></div>`;
let st={v:'store',gid:null,sel:0,z:730,add:false,off:0,cur:S('se_cur','UAH')},lib=S('se_lib',[]),user=S('se_user',null);
const pr=g=>Math.round(g.p*(100-g.s)/100);
const RT={UAH:1,NOK:1/4.1,USD:1/41.5},SY={UAH:'₴',NOK:'kr',USD:'$'};
const fc=(n,c)=>n===0?'Безкоштовно':(n*RT[c]).toLocaleString(({uk:'uk-UA',en:'en-US',nb:'nb-NO'})[LANG]||'en-US',{minimumFractionDigits:c==='UAH'?0:2,maximumFractionDigits:c==='UAH'?0:2})+' '+SY[c];
const F=n=>fc(n,st.cur);
const cap=(g,h)=>`<div class="cap" style="height:${h}px;padding:0;position:relative">${art(g,0,h)}<b style="position:relative;padding:6px;text-shadow:0 1px 4px #000">${E(g.n)}</b></div>`;
const pt=(g,v=pr(g))=>{const s=g.p?Math.round((1-v/g.p)*100):0;return s>0?`<span class="ds">−${s}%</span><span class="old">${F(g.p)}</span><span class="np">${F(v)}</span>`:`<span class="np">${F(v)}</span>`};
const card=g=>`<div class="card" data-a="game" data-id="${g.id}">${cap(g,70)}<div class="inf"><b>${E(g.n)}</b><small>${g.t.join(', ')}</small><small>Дата випуску: ${g.d}</small><div class="pt">${pt(g,pa(g,st.off))}</div></div></div>`;
const mk=s=>()=>(s=s*16807%2147483647)/2147483647;
function hist(g){if(HC[g.id])return HC[g.id];const r=mk(g.id*7919),a=[];let d=0;
 while(d<730){const sale=r()<.35,v=sale?Math.round(g.p*(1-[.1,.2,.35,.5][r()*4|0])):g.p,n=sale?4+(r()*10|0):10+(r()*40|0);
  for(let i=0;i<n&&d<730;i++,d++)a.push(v)}
 for(let i=0;i<7;i++)a[729-i]=pr(g);return HC[g.id]=a}
function chart(g){
 const a=hist(g),lo=Math.min(...a),s=a.slice(-st.z),mx=Math.max(...s,1),Wd=360,H=150,x=i=>i*Wd/(s.length-1),y=v=>H-v/(mx*1.1)*H;
 let d=`M0 ${y(s[0]).toFixed(1)}`;
 for(let i=1;i<s.length;i++)if(s[i]!==s[i-1])d+=`L${x(i).toFixed(1)} ${y(s[i-1]).toFixed(1)}L${x(i).toFixed(1)} ${y(s[i]).toFixed(1)}`;
 d+=`L${Wd} ${y(s[s.length-1]).toFixed(1)}`;
 const avg=s.reduce((q,v)=>q+v,0)/s.length,cur=pr(g);CH={s,g};
 return `<div class="panel"><h2 style="margin-top:0">Історія цін (UA)</h2>
 <div class="z">${[[183,'6м'],[365,'1р'],[730,'2р']].map(([z,l])=>`<button data-a="zoom" data-z="${z}" class="${st.z===z?'on':''}">${l}</button>`).join('')}</div>
 <svg viewBox="0 0 360 160"><path d="${d}L${Wd} ${H}L0 ${H}Z" fill="rgba(164,208,7,.12)"/><path d="${d}" fill="none" stroke="#a4d007" stroke-width="2"/>
 <line x1="0" x2="${Wd}" y1="${y(lo)}" y2="${y(lo)}" stroke="#4aa3ff" stroke-dasharray="4 3"/>
 <text x="2" y="12" fill="#a9b4d6" font-size="10">${F(mx)}</text><line id="mk" x1="${Wd}" x2="${Wd}" y1="0" y2="150" stroke="#fff" stroke-width="1.5"/></svg><input type="range" id="sc" aria-label="Дата" min="0" max="${s.length-1}" value="${s.length-1}" style="width:100%"><div id="tip" class="tip">${tipH(s.length-1)}</div>
 <small>Зелена лінія — ціна, синя пунктирна — мінімум за 2 роки</small>
 <div class="st"><div><small>Зараз</small><b>${F(cur)}</b></div><div><small>Мінімум (2 роки)</small><b>${F(lo)}</b></div>
 <div><small>Максимум</small><b>${F(Math.max(...a))}</b></div><div><small>Середня за період</small><b>${F(avg)}</b></div></div>
 ${g.p&&cur<=lo?'<p style="color:var(--g)">Зараз — історичний мінімум ціни.</p>':''}</div>`}
function vStore(){return vLS()}
function vGame(){const g=G.find(x=>x.id===st.gid),today=new Date().toISOString().slice(0,10);
 return `<button class="back" data-a="nav" data-v="store">← Усі ігри</button><h2>${E(g.n)}</h2>${gal(g)}
 <div class="chips">${g.t.map(t=>`<span>${t}</span>`).join('')}</div>
 ${g.ds?`<p>${g.ds}</p>`:''}
 <div class="panel kv"><span>Рецензії</span><span>${g.rv||'—'}</span><span>Дата виходу</span><span>${g.d}</span><span>Розробник</span><span>${g.dev||'—'}</span></div>
 ${dateCtl()}<div class="panel"><div class="pt" style="justify-content:flex-start;font-size:18px">${pt(g,pa(g,st.off))}</div>
 <div class="form"><small>Буде записано ціну на вибрану дату.</small>
 
 <button class="btn" data-a="addg">У бібліотеку</button></div></div>
 ${specs(g)}${g.rq?`<div class="panel"><b>Системні вимоги</b><div class="chips" style="display:block">${g.rq.map(r=>`<small style="display:block">${r}</small>`).join('')}</div></div>`:''}
 ${chart(g)}${curT(g)}`}
function vLib(){
 const sp=lib.reduce((a,x)=>a+x.paid,0),sv=lib.reduce((a,x)=>a+Math.max(0,x.base-x.paid),0);
 let h=`<div class="sum"><div><small>Витрачено</small><b>${F(sp)}</b></div><div><small>Ігор</small><b>${lib.length}</b></div><div><small>Заощаджено</small><b>${F(sv)}</b></div></div>`;
 if(!lib.length)return h+`<div class="panel c"><p>Тут поки порожньо.</p><small>Відкрийте гру в крамниці, виберіть дату придбання й додайте її в бібліотеку.</small></div>`;
 const i=Math.min(st.sel,lib.length-1),x=lib[i],pc=x.base?Math.round((1-x.paid/x.base)*100):0;
 return h+`<div class="lib"><div class="side">${lib.map((y,j)=>`<div class="si ${j===i?'on':''}" data-a="sel" data-i="${j}"><i style="background:${y.c}"></i>${E(y.n)}</div>`).join('')}</div>
 <div>${x.img?`<img class="im" src="${E(x.img)}" alt="">`:cap({n:x.n,c:x.c},110)}<div style="margin-top:8px"><span class="pill">${lf(x,'paid')}</span><span class="pill ${pc>0?'g':''}">${pc>0?`зі знижкою −${pc}%`:'без знижки'}</span><span class="pill">${x.date?E(fd(Date.parse(x.date+'T12:00:00'),{day:'2-digit',month:'2-digit',year:'2-digit'})):'—'}</span>
 <div class="kv panel"><span>В магазині</span><span>${lf(x,'base')}</span><span>Заощаджено</span><span>${lf(x,'sv')}</span></div>
 <div class="row">${x.appid?`<button class="btn s" data-a="lgame" data-id="${x.appid}">Відкрити в крамниці</button>`:''}<button class="btn d" data-a="del">Видалити</button></div></div></div></div>`}
const lf=(x,k)=>{const v=k==='sv'?Math.max(0,x.base-x.paid):x[k];if(x.cur&&x.cur===st.cur&&x.paidC!=null){const c=k==='sv'?Math.max(0,x.baseC-x.paidC):x[k+'C'];return mn(c,x.cur)}return F(v)};
function vAcc(){
 if(!user)return `<div class="c"><div class="av">?</div><h2>Видно, тут нічого немає</h2><p><small>Увійдіть в акаунт, щоб бачити свою статистику.</small></p>
 <div class="form" style="max-width:280px;margin:0 auto"><input id="un" placeholder="Ваш нікнейм"><button class="btn" data-a="login">Увійти в акаунт</button></div></div>`;
 const sp=lib.reduce((a,x)=>a+x.paid,0);
 return `<div class="c"><div class="av">${E(user[0].toUpperCase())}</div><h2>${E(user)}</h2></div>
 <div class="sum"><div><small>Ігор</small><b>${lib.length}</b></div><div><small>Витрачено</small><b>${F(sp)}</b></div><div><small>Заощаджено</small><b>${F(lib.reduce((a,x)=>a+Math.max(0,x.base-x.paid),0))}</b></div></div>
 <button class="btn s" data-a="logout">Вийти</button><p><small>Це локальний вхід лише для цього пристрою. Прив’язати справжній акаунт Steam тут поки неможливо: для цього потрібен сервер (вхід через Steam і Steam Web API).</small></p>`}
function R(top=true){
 document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('on',b.dataset.v===(st.v==='game'?'store':st.v)));
 document.querySelectorAll('.nav button[data-k]').forEach(b=>b.textContent=TR(b.dataset.k));$('#q').placeholder=TR('Пошук ігор…');$('#v').innerHTML=TR(({store:vStore,lib:vLib,acc:vAcc,game:()=>st.live?vLive():vGame(),set:vSet})[st.v]());cDrawAll();if(top)scrollTo(0,0)}
function dd(){return ddL()}
document.addEventListener('input',e=>{if(e.target.id==='sc'){const i=+e.target.value,x=i*360/(CH.s.length-1);$('#mk').setAttribute('x1',x);$('#mk').setAttribute('x2',x);$('#tip').innerHTML=TR(tipH(i))}});
document.addEventListener('change',e=>{if(e.target.id==='cur'){st.cur=e.target.value;W('se_cur',st.cur);R(false)}if(e.target.id==='pdt'){const v=e.target.value,td=dstr(0);st.pdt=v&&v<td?v:null;if(v>td)e.target.value=td;const pe=$('#pdp');if(pe)pe.innerHTML=TR(pdpH())}if(e.target.id==='dt'){st.off=Math.min(729,Math.max(0,Math.round((Date.parse(dstr(0))-Date.parse(e.target.value))/864e5)||0));R(false)}});
$('#q').addEventListener('focus',dd);$('#q').addEventListener('input',dd);
document.addEventListener('click',e=>{
 const t=e.target.closest('[data-a]');
 if(!e.target.closest('.srch'))$('#dd').style.display='none';
 if(!t)return;const a=t.dataset.a;
 if(a==='nav'){st.v=t.dataset.v;st.add=false;$('#dd').style.display='none';R()}
 else if(a==='game'){st.live=0;st.v='game';st.gid=+t.dataset.id;st.z=730;$('#dd').style.display='none';$('#q').value='';R()}
 else if(a==='today'){st.off=0;R(false)}
 else if(a==='cur'){st.cur=t.dataset.c;$('#cur').value=st.cur;W('se_cur',st.cur);R(false)}
 else if(a==='lgame'){st.live=1;st.v='game';st.pdt=null;st.gid=+t.dataset.id;$('#dd').style.display='none';$('#q').value='';R()}
 else if(a==='api'){const v=$('#api').value.trim();W('se_api',v);API=v||DEF_API;LS=null;LD={};PL={};PH={};R(false)}
 else if(a==='lang'){LANG=t.dataset.c;W('se_lang',LANG);R(false)}
 else if(a==='setd'){st.off=+t.dataset.o;R(false);scrollTo(0,0)}
 else if(a==='zoom'){st.z=+t.dataset.z;R(false)}
 else if(a==='sel'){st.sel=+t.dataset.i;R(false)}
 else if(a==='cz'){const c=CHS[t.dataset.id],r=+t.dataset.r;if(c){c.b=c.t1;c.a=r?Math.max(c.t0,c.t1-r):c.t0;cDraw(t.dataset.id)}}
 else if(a==='addg'){if(st.live){const g=st.lg,b=st.buy;if(!g||!b)return;const rt=RT[b.cur]||RT[st.cur],bs=Math.max(b.r||0,b.p||0);lib.push({n:g.n,paid:(b.p||0)/rt,base:bs/rt,date:b.date,c:g.c,img:g.img||'',appid:g.appid||null,cur:b.cur,paidC:b.p||0,baseC:bs})}
  else{const g=G.find(x=>x.id===st.gid);if(!g)return;const paid=Math.max(0,pa(g,st.off)||0);lib.push({n:g.n,paid,base:Math.max(g.p||0,paid),date:dstr(st.off),c:g.c})}
  W('se_lib',lib);st.sel=lib.length-1;st.v='lib';R()}
 else if(a==='del'){lib.splice(st.sel,1);st.sel=0;W('se_lib',lib);R(false)}
 else if(a==='login'){const n=$('#un').value.trim();if(!n)return;user=n;W('se_user',user);R(false)}
 else if(a==='logout'){user=null;W('se_user',null);R(false)}
});
$('#cur').value=st.cur;R();
