/* Steamotion: player and price statistics, charts with slider */
/* ---- Real statistics: players (SteamCharts + Steam Web API) and price history (IsThereAnyDeal) ---- */
let PL={},PH={};const CHS={},DAY=864e5;
const nf=(v,c)=>{try{return new Intl.NumberFormat(LOC[LANG],c?{notation:'compact',maximumFractionDigits:1}:{maximumFractionDigits:0}).format(v)}catch(e){return String(Math.round(v))}};
const fd=(t,o)=>new Date(t).toLocaleString(LOC[LANG],o);
const ZR=[[2*DAY,'48г'],[7*DAY,'1т'],[30*DAY,'1м'],[91*DAY,'3м'],[183*DAY,'6м'],[365*DAY,'1р'],[1095*DAY,'3р'],[0,'Усе']];
const lb=(d,t)=>{let l=0,h=d.length-1;while(l<h){const m=(l+h+1)>>1;if(d[m][0]<=t)l=m;else h=m-1}return l};
const nice=x=>{const p=Math.pow(10,Math.floor(Math.log10(x))),f=x/p;return (f<=1?1:f<=2?2:f<=2.5?2.5:f<=5?5:10)*p};
function chartH(id,d,o){const old=CHS[id],t0=d[0][0],t1=d[d.length-1][0],keep=old&&old.d.length===d.length&&old.t0===t0&&old.t1===t1;
 CHS[id]={d,t0,t1,step:!!o.step,fmt:o.fmt,ax:o.ax,low:o.low,lab:o.lab,col:o.col||'#a4d007',a:keep?old.a:t0,b:keep?old.b:t1};
 return `<div class="z" style="flex-wrap:wrap;margin-top:8px">${ZR.filter(([r])=>r===0||r<t1-t0).map(([r,l])=>`<button data-a="cz" data-id="${id}" data-r="${r}">${l}</button>`).join('')}</div><div class="ch" id="ch-${id}"><svg class="mn"></svg><div class="tt"></div><svg class="nv"></svg></div>`}
function sPath(pts,X,Y,step){let p='';pts.forEach((q,k)=>{const x=X(q[0]).toFixed(1),y=Y(q[1]).toFixed(1);p+=k?(step?`H${x}V${y}`:`L${x} ${y}`):`M${x} ${y}`});return p}
function cDraw(id){const c=CHS[id],el=document.getElementById('ch-'+id);if(!c||!el)return;
 const W=Math.max(220,el.clientWidth),H=190,PW=W-46,PT=10,PB=22,NH=46,{d,a,b}=c,span=Math.max(1,b-a);
 const X=t=>(t-a)/span*PW,i0=lb(d,a),i1=Math.min(d.length-1,lb(d,b)+1),vis=d.slice(i0,i1+1);
 let mx=0;for(const q of vis)mx=Math.max(mx,q[1]);if(c.low!=null)mx=Math.max(mx,c.low);
 const sp=nice((mx||1)/3),n=Math.max(1,Math.ceil(mx*1.04/sp)),top=n*sp,Y=v=>PT+(1-v/top)*(H-PT-PB);
 let p=sPath(vis,X,Y,c.step);if(c.step&&vis.length&&vis[vis.length-1][0]<b)p+=`H${PW}`;
 const ar=p+`V${Y(0).toFixed(1)}H${X(vis[0][0]).toFixed(1)}Z`;
 let g='';for(let k=0;k<=n;k++){const y=Y(k*sp).toFixed(1);g+=`<line x1="0" x2="${PW}" y1="${y}" y2="${y}" stroke="#ffffff1c"/><text x="${PW+5}" y="${+y+4}" fill="#a9b4d6" font-size="10">${c.ax(k*sp)}</text>`}
 const xo=span>400*DAY?{month:'short',year:'numeric'}:span>3*DAY?{day:'numeric',month:'short'}:{hour:'2-digit',minute:'2-digit'};
 for(let k=0;k<4;k++){const x=PW*(k+.5)/4;g+=`<text x="${x.toFixed(1)}" y="${H-6}" fill="#a9b4d6" font-size="10" text-anchor="middle">${E(fd(a+span*(k+.5)/4,xo))}</text>`}
 const lo=c.low!=null?`<line x1="0" x2="${PW}" y1="${Y(c.low).toFixed(1)}" y2="${Y(c.low).toFixed(1)}" stroke="#4aa3ff" stroke-dasharray="5 4"/>`:'';
 const mn=el.querySelector('.mn'),nv=el.querySelector('.nv');
 mn.setAttribute('viewBox',`0 0 ${W} ${H}`);
 mn.innerHTML=`<defs><clipPath id="cp-${id}"><rect x="0" y="0" width="${PW}" height="${H}"/></clipPath></defs>${g}<g clip-path="url(#cp-${id})"><path d="${ar}" fill="${c.col}" fill-opacity=".12"/><path d="${p}" fill="none" stroke="${c.col}" stroke-width="2" stroke-linejoin="round"/>${lo}</g><line class="cx" x1="0" x2="0" y1="${PT}" y2="${H-PB}" stroke="#ffffff99" visibility="hidden"/><circle class="cd" r="4.5" fill="${c.col}" stroke="#fff" stroke-width="1.5" visibility="hidden"/>`;
 const XN=t=>(t-c.t0)/Math.max(1,c.t1-c.t0)*PW;let nm=0;for(const q of d)nm=Math.max(nm,q[1]);const YN=v=>NH-4-v/(nm||1)*(NH-10);
 let np=sPath(d,XN,YN,c.step);const xa=XN(a),xb=XN(b);
 nv.setAttribute('viewBox',`0 0 ${W} ${NH}`);
 const hd=x=>`<rect x="${(x-6).toFixed(1)}" y="${NH/2-14}" width="12" height="28" rx="3" fill="#c8d4e8" stroke="#33415c"/><line x1="${(x-2).toFixed(1)}" x2="${(x-2).toFixed(1)}" y1="${NH/2-6}" y2="${NH/2+6}" stroke="#33415c"/><line x1="${(x+2).toFixed(1)}" x2="${(x+2).toFixed(1)}" y1="${NH/2-6}" y2="${NH/2+6}" stroke="#33415c"/>`;
 nv.innerHTML=`<rect x="0" y="0" width="${PW}" height="${NH}" rx="4" fill="#0d1a3a"/><path d="${np}V${NH}H0Z" fill="${c.col}" fill-opacity=".18"/><path d="${np}" fill="none" stroke="${c.col}" stroke-width="1"/><rect x="0" y="0" width="${xa.toFixed(1)}" height="${NH}" fill="#000" fill-opacity=".45"/><rect x="${xb.toFixed(1)}" y="0" width="${(PW-xb).toFixed(1)}" height="${NH}" fill="#000" fill-opacity=".45"/><rect x="${xa.toFixed(1)}" y="0" width="${Math.max(1,xb-xa).toFixed(1)}" height="${NH}" fill="#4aa3ff" fill-opacity=".14" stroke="#4aa3ff"/>${hd(xa)}${hd(xb)}`;
 c.L={W,H,PW,PT,PB,X,Y,XN};
 document.querySelectorAll(`[data-a="cz"][data-id="${id}"]`).forEach(bt=>{const r=+bt.dataset.r;bt.classList.toggle('on',r?Math.abs(c.b-c.t1)<1e3&&Math.abs(c.b-c.a-Math.min(r,c.t1-c.t0))<1e3:c.a===c.t0&&c.b===c.t1)});
 el.querySelector('.tt').style.display='none';
 if(!el.dataset.b){el.dataset.b=1;cBind(id,el)}}
function cBind(id,el){const mn=el.querySelector('.mn'),nv=el.querySelector('.nv'),tt=el.querySelector('.tt');
 const px=(e,s)=>{const r=s.getBoundingClientRect();return (e.clientX-r.left)*CHS[id].L.W/r.width};
 const tip=e=>{const c=CHS[id],L=c.L,x=px(e,mn);if(x<0||x>L.PW)return;const t=c.a+x/L.PW*(c.b-c.a);let i=lb(c.d,t);
  if(!c.step&&i<c.d.length-1&&t-c.d[i][0]>c.d[i+1][0]-t)i++;const q=c.d[i],qx=c.step?x:L.X(q[0]),qy=L.Y(q[1]);
  const gap=Math.abs(((c.d[i+1]||c.d[i-1]||q)[0])-q[0]);
  const dt=c.step?fd(t,{day:'numeric',month:'short',year:'numeric'}):gap>20*DAY?fd(q[0],{month:'long',year:'numeric'}):gap>20*36e5?fd(q[0],{day:'numeric',month:'short',year:'numeric'}):fd(q[0],{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
  mn.querySelector('.cx').setAttribute('x1',qx);mn.querySelector('.cx').setAttribute('x2',qx);mn.querySelector('.cx').setAttribute('visibility','visible');
  const cd=mn.querySelector('.cd');cd.setAttribute('cx',qx);cd.setAttribute('cy',qy);cd.setAttribute('visibility','visible');
  tt.innerHTML=TR(`<div>${E(dt)}</div><span style="color:${c.col}">●</span> ${c.lab}: <b>${E(c.fmt(q[1]))}</b>${q[2]>0?` <span class="ds">−${q[2]}%</span>`:''}`);
  tt.style.display='block';const w=tt.offsetWidth,r=mn.getBoundingClientRect(),sx=r.width/L.W;tt.style.left=Math.min(r.width-w/2,Math.max(w/2,qx*sx))+'px'};
 mn.addEventListener('pointerdown',tip);mn.addEventListener('pointermove',tip);
 mn.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'){tt.style.display='none';mn.querySelector('.cx').setAttribute('visibility','hidden');mn.querySelector('.cd').setAttribute('visibility','hidden')}});
 let g=null;
 nv.addEventListener('pointerdown',e=>{const c=CHS[id],L=c.L,x=px(e,nv),tot=c.t1-c.t0,xa=L.XN(c.a),xb=L.XN(c.b);let m;
  if(Math.abs(x-xa)<20&&(x<=xa||Math.abs(x-xa)<=Math.abs(x-xb)))m='a';else if(Math.abs(x-xb)<20)m='b';
  else{if(x<xa||x>xb){const w=c.b-c.a,t=c.t0+Math.min(1,Math.max(0,x/L.PW))*tot,na=Math.max(c.t0,Math.min(c.t1-w,t-w/2));c.a=na;c.b=na+w}m='m'}
  g={m,x0:x,a0:c.a,b0:c.b};nv.setPointerCapture(e.pointerId);e.preventDefault();cDraw(id)});
 nv.addEventListener('pointermove',e=>{if(!g)return;const c=CHS[id],L=c.L,tot=c.t1-c.t0,dt=(px(e,nv)-g.x0)/L.PW*tot,mw=Math.min(tot,Math.max(tot*.01,6*36e5));
  if(g.m==='a')c.a=Math.max(c.t0,Math.min(g.b0-mw,g.a0+dt));else if(g.m==='b')c.b=Math.min(c.t1,Math.max(g.a0+mw,g.b0+dt));
  else{const w=g.b0-g.a0,na=Math.max(c.t0,Math.min(c.t1-w,g.a0+dt));c.a=na;c.b=na+w}cDraw(id)});
 const up=()=>{g=null};nv.addEventListener('pointerup',up);nv.addEventListener('pointercancel',up)}
const cDrawAll=()=>Object.keys(CHS).forEach(cDraw);
const box=(t,b)=>`<div class="panel"><b>${t}</b>${b}</div>`;
function plBox(){const id=st.gid,P=PL[id],T='Онлайн гравців';
 if(P===undefined){loadPlayers(id);return box(T,'<p>Завантаження…</p>')}
 if(!P)return box(T,'<p>Не вдалося завантажити статистику.</p>');
 const s0=(P.series||[]).filter(q=>Array.isArray(q)&&q[1]!=null),s=s0.filter((q,i)=>q[1]>0||!(s0[i-1]&&s0[i-1][1]>0&&s0[i+1]&&s0[i+1][1]>0));
 if(s.length<2&&P.now==null)return box(T,'<p>Немає даних про онлайн для цієї гри.</p>');
 const v=x=>x!=null?nf(x):'—';
 return box(T,`<div class="st st3"><div><small>Зараз грають</small><b>${v(P.now)}</b></div><div><small>Пік за 24 години</small><b>${v(P.peak24)}</b></div><div><small>Рекорд за весь час</small><b>${v(P.peakAll)}</b></div></div>
 ${s.length>1?chartH('pl',s,{fmt:x=>nf(x),ax:x=>nf(x,1),lab:'Гравці'})+'<div class="lg"><span><i></i>Гравці</span></div><small>Перетягуйте рамку під графіком, щоб вибрати період. Торкніться графіка, щоб побачити значення.</small><br>':''}<small>Дані: SteamCharts і Steam Web API</small>`)}
function prBox(){const id=st.gid,[d,cp]=st.pd||[],k=id+CC[st.cur],P=PH[k],T='Історія цін у Steam';
 if(d&&d.is_free&&!cp)return box(T,'<p>Гра безкоштовна, історії цін немає.</p>');
 if(P===undefined){loadPrices(id);return box(T,'<p>Завантаження…</p>')}
 if(!P)return box(T,'<p>Не вдалося завантажити статистику.</p>');
 const S=prSeries();if(!S)return box(T,'<p>Немає історії цін для цієї гри.</p>');
 const {s,cu,now}=S,r0=now[3];
 const f=v=>mn(v,cu);let lo=Infinity,loT=0,mc=0,ns=0,ls=0;
 s.forEach((q,i)=>{if(q[1]<lo){lo=q[1];loT=q[0]}if(q[2]>mc)mc=q[2];if(q[2]>0&&!(i&&s[i-1][2]>0)){ns++;ls=q[0]}});
 const D=t=>fd(t,{day:'numeric',month:'short',year:'numeric'});
 return box(T,`<div class="st st3"><div><small>Ціна зараз</small><b>${f(now[1])}</b>${now[2]>0?`<span class="ds">−${now[2]}%</span>`:''}</div><div><small>Історичний мінімум</small><b>${f(lo)}</b><small>${D(loT)}</small></div><div><small>Звичайна ціна</small><b>${f(r0)}</b></div><div><small>Найбільша знижка</small><b>${mc?`−${mc}%`:'—'}</b></div><div><small>Кількість знижок</small><b>${ns}</b></div><div><small>Остання знижка</small><b>${ls?D(ls):'—'}</b></div></div>
 ${chartH('pr',s,{step:1,fmt:f,ax:v=>nf(v,1),low:lo,lab:'Ціна в Steam'})}<div class="lg"><span><i></i>Ціна в Steam</span><span><i class="d"></i>Історичний мінімум</span></div>
 ${mc&&now[1]<=lo?'<p style="color:var(--g)">Зараз — історичний мінімум ціни.</p>':''}<small>Перетягуйте рамку під графіком, щоб вибрати період. Торкніться графіка, щоб побачити значення.</small><br>${S.approx?`<small>Минулі ціни перераховано з історії Steam (${E(S.hc)}) за поточним співвідношенням регіональних цін, тому вони приблизні.</small><br>`:''}<small>Дані: IsThereAnyDeal (ціни Steam для вибраного регіону)</small>`)}
function prSeries(){const [d,cp]=st.pd||[],P=PH[st.gid+CC[st.cur]];if(P===undefined)return undefined;if(!P||!P.history||!P.history.length)return null;
 const h=P.history,hc=h[h.length-1].cur,cu=cp?cp.currency:hc,rl=h[h.length-1].r,sc=cp&&cp.currency!==hc&&rl>0?(cp.initial/100)/rl:1,cv=v=>sc===1?v:+(v*sc).toFixed(cu==='UAH'?0:2);
 const s=h.map(x=>[x.t,cv(x.p),x.cut,cv(x.r)]),last=s[s.length-1],nowT=Math.floor(Date.now()/36e5)*36e5;
 const now=cp?[nowT,cp.final/100,cp.discount_percent,cp.initial/100]:[nowT,last[1],last[2],last[3]];
 if(nowT>last[0])s.push(now);return {s,cu,hc,now,approx:sc!==1}}
function pdpH(){const [d,cp]=st.pd||[],today=dstr(0),dt=st.pdt||today;st.buy=null;
 if(d&&d.is_free&&!cp)return '<small>Гра безкоштовна.</small>';
 let o;
 if(dt>=today){if(!cp)return '<small>Ціна недоступна.</small>';o={p:cp.final/100,r:cp.initial/100,cut:cp.discount_percent,cur:cp.currency}}
 else{const S=prSeries();if(S===undefined){loadPrices(st.gid);return '<small>Завантаження…</small>'}if(!S)return '<small>Немає історії цін для цієї гри.</small>';
  const t=new Date(dt+'T23:59:59').getTime();if(t<S.s[0][0])return `<small>Немає даних про ціну до ${E(fd(S.s[0][0],{day:'numeric',month:'short',year:'numeric'}))}.</small>`;
  const q=S.s[lb(S.s,t)];o={p:q[1],r:Math.max(q[3],q[1]),cut:q[2],cur:S.cu,ap:S.approx}}
 st.buy={...o,date:dt>today?today:dt};
 return `<div class="row" style="justify-content:space-between"><small>Ціна на цю дату</small><span>${o.cut>0?`<span class="ds">−${o.cut}%</span> <span class="old">${mn(o.r,o.cur)}</span> `:''}<b>${o.ap?'≈ ':''}${o.p?mn(o.p,o.cur):'Безкоштовно'}</b></span></div>`}
const upd=(bid,fn,cid,id)=>{const el=document.getElementById(bid);if(el&&st.v==='game'&&st.live&&st.gid===id){el.innerHTML=TR(fn());cDraw(cid)}};
async function loadPlayers(id){if(PL[id+'p'])return;PL[id+'p']=1;let r=0;try{r=await J(`/players?appid=${id}`)}catch(e){}PL[id]=r;upd('pl-box',plBox,'pl',id)}
async function loadPrices(id){const k=id+CC[st.cur];if(PH[k+'p'])return;PH[k+'p']=1;let r=0;try{r=await J(`/prices?appid=${id}&cc=${CC[st.cur].toUpperCase()}`)}catch(e){}PH[k]=r;if(CC[st.cur]===k.slice(String(id).length)){upd('pr-box',prBox,'pr',id);const pe=document.getElementById('pdp');if(pe&&st.gid===id)pe.innerHTML=TR(pdpH())}}
addEventListener('resize',()=>{clearTimeout(cDrawAll.t);cDrawAll.t=setTimeout(cDrawAll,150)});
