const $=s=>document.querySelector(s);
const E=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const S=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}};
const W=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const G=[
{id:1,n:'MONOMOON',t:['Метроїдванія','Дослідження','Головоломка','Піксельна графіка'],d:'11 лист. 2026',p:275,s:10,c:'#1b3a8a'},
{id:2,n:'Aleef: Desktop Pet Collector',t:['Без зусиль','Настільний компаньйон','Збирання істот'],d:'11 лист. 2026',p:170,s:10,c:'#a8456f'},
{id:3,n:'Euro Truck Simulator 2 – Iceland',t:['Симулятор','Інді','Водіння'],d:'10 лист. 2026',p:240,s:0,c:'#1f5f7a'},
{id:4,n:'Ніколи не сортуй за кольором',t:['Симулятор','Відпочинок','Організація'],d:'10 лист. 2026',p:240,s:20,c:'#7a3b1f'},
{id:5,n:'Warhammer Survivors',t:['Рай із куль','Бойовик','Мандрівна гра'],d:'10 лист. 2026',p:195,s:10,c:'#5b2a86'},
{id:6,n:'Worst Class Ever',t:['Мережевий кооператив','Кооператив'],d:'10 лист. 2026',p:170,s:35,c:'#2a6a4a'},
{id:7,n:'ROB RUN',t:['Вільний доступ'],d:'2026',p:0,s:0,c:'#8a5a2b'},
{id:8,n:'DreamWorks Shrek 2 Remastered',t:['Пригоди','Ремастер'],d:'2026',p:720,s:10,c:'#3e8a2b'},
{id:9,n:'盛夏的我们 (Love in Summer)',t:['Візуальна новела'],d:'2026',p:300,s:17,c:'#c25a7a'},
{id:10,n:'DREADMOOR',t:['Хорор','Рольова гра'],d:'2026',p:430,s:10,c:'#8a1f1f'},
{id:11,n:'GroundInFlames',t:['Стратегія','Воєнна гра','Гравець проти гравця','Симулятор'],d:'10 лист. 2026',p:1050,s:0,c:'#4a5a2a',dev:'VasyliyBritva',rv:'дуже схвальні (66)',
 ds:'Тактика в реальному часі про сучасний загальновійськовий бій. Окопи, придушення й мораль відділень, FPV-дрони та РЕБ, чесне бронепробиття й модулі техніки.',
 rq:['ОС: Windows 10','Процесор: i3-8100','Пам’ять: 6 GB ОП','Відеокарта: GTX 1050 / RX 560','Диск: 4 GB']}
];
const POP=[7,8,9,10];
const HC={};
[['Euro Truck Simulator 2','Симулятор,Водіння,Відкритий світ',400,50],['American Truck Simulator','Симулятор,Водіння',300,0],['Counter-Strike 2','Шутер,Вільний доступ',0,0],['Dota 2','MOBA,Вільний доступ',0,0],['Team Fortress 2','Шутер,Вільний доступ',0,0],['Portal','Головоломка',100,0],['Portal 2','Головоломка,Кооператив',200,50],['Half-Life 2','Шутер,Класика',150,0],['Left 4 Dead 2','Кооператив,Шутер',250,75],['Garry’s Mod','Пісочниця',200,0],['Terraria','Пісочниця,Виживання',200,0],['Stardew Valley','Фермерство,Відпочинок',250,25],['Hollow Knight','Метроїдванія,Платформер',250,0],['Celeste','Платформер,Піксельна графіка',250,60],['Hades','Рогалик,Екшен',380,0],['Slay the Spire','Колодобудування,Рогалик',300,40],['Vampire Survivors','Рай із куль,Рогалик',100,0],['Undertale','Рольова гра,Інді',200,0],['Cuphead','Платформер,Екшен',300,50],['Factorio','Автоматизація,Стратегія',650,0],['RimWorld','Колонії,Симулятор',800,0],['Satisfactory','Автоматизація,Відкритий світ',750,20],['Subnautica','Виживання,Дослідження',500,50],['Valheim','Виживання,Кооператив',350,0],['Raft','Виживання,Кооператив',300,30],['The Forest','Виживання,Жахи',350,0],['Phasmophobia','Жахи,Кооператив',250,0],['Helldivers 2','Кооператив,Шутер',900,0],['Barotrauma','Кооператив,Виживання',350,15],['Papers, Please','Головоломка,Інді',200,0],['Baldur’s Gate 3','Рольова гра,Покрокова',1700,0],['Elden Ring','Рольова гра,Екшен',1800,30],['Sid Meier’s Civilization VI','Стратегія,Покрокова',1100,75],['Stellaris','Стратегія,Космос',700,0],['Hearts of Iron IV','Стратегія,Воєнна гра',800,50],['Cities: Skylines','Містобудування,Симулятор',500,0],['Don’t Starve Together','Виживання,Кооператив',250,0],['Among Us','Соціальна дедукція,Кооператив',70,0],['Apex Legends','Шутер,Вільний доступ',0,0],['PUBG: BATTLEGROUNDS','Батл-рояль,Вільний доступ',0,0],['Rust','Виживання,Мережева гра',700,0],['Trackmania','Перегони,Вільний доступ',0,0],['Dave the Diver','Пригоди,Рибалка',400,20],['Core Keeper','Виживання,Кооператив',250,0],['Slime Rancher','Пригоди,Відпочинок',250,0],['Oxygen Not Included','Колонії,Виживання',350,50],['Project Zomboid','Виживання,Пісочниця',500,0],['Risk of Rain 2','Рогалик,Кооператив',250,60],['Deep Rock Galactic','Кооператив,Шутер',350,0],['It Takes Two','Кооператив,Пригоди',900,50],['Human: Fall Flat','Головоломка,Кооператив',200,0],['Overcooked! 2','Кооператив,Вечірка',300,75],['Kerbal Space Program','Космос,Симулятор',500,0],['Planet Zoo','Симулятор,Менеджмент',700,0],['Ori and the Will of the Wisps','Платформер,Пригоди',450,0],['Inside','Головоломка,Платформер',250,0],['Limbo','Головоломка,Платформер',150,0],['Dead Cells','Рогалик,Метроїдванія',300,50],['Noita','Рогалик,Пісочниця',250,0],['Katana ZERO','Екшен,Піксельна графіка',250,0],['Unturned','Виживання,Вільний доступ',0,0],['Brawlhalla','Файтинг,Вільний доступ',0,0],['Warframe','Екшен,Вільний доступ',0,0],['Path of Exile','Рольова гра,Вільний доступ',0,0]].forEach(([n,t,p,s],i)=>G.push({id:100+i,n,t:t.split(','),d:'—',p,s,c:`hsl(${(i*53+20)%360} 45% 30%)`}));
const dstr=o=>new Date(Date.now()-o*864e5).toISOString().slice(0,10);
const pa=(g,o)=>hist(g)[729-o];
const hs=s=>[...s].reduce((a,c)=>(a*31+c.charCodeAt(0))%2147483646,7)+1;
function art(g,k,h){const r=mk(hs(g.n)+k*17),hue=(hs(g.n)*7+k*40)%360;let s='';
 for(let i=0;i<7;i++)s+=`<circle cx="${r()*400|0}" cy="${40+r()*120|0}" r="${15+r()*60|0}" fill="hsl(${(hue+i*25)%360} 55% ${25+r()*30|0}%)" opacity=".55"/>`;
 s+=`<path d="M0 ${150+r()*30|0}L${100+r()*80|0} ${100+r()*40|0}L${200+r()*60|0} ${140+r()*30|0}L${300+r()*60|0} ${90+r()*40|0}L400 ${130+r()*30|0}V200H0Z" fill="rgba(0,0,0,.45)"/>`;
 return `<svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" style="height:${h}px"><rect width="400" height="200" fill="hsl(${hue} 50% 18%)"/>${s}</svg>`}
const gal=g=>`<div class="gal">${[0,1,2,3,4,5].map(k=>`<div class="sl">${art(g,k,170)}${k?'':'<span class="play">▶</span>'}<small class="cnt">${k?'Скріншот '+k+' з 5':'Трейлер'}</small></div>`).join('')}</div><small>Ілюстрації-заглушки: справжні обкладинки, скриншоти й відео потребують сервера.</small>`;
let LANG=S('se_lang','en');
const D=`Крамниця|Store|Butikk
Видавець|Publisher|Utgiver
Категорії|Categories|Kategorier
Завантаження…|Loading…|Laster…
Не вдалося отримати дані від Steam. Перевірте адресу проксі в налаштуваннях.|Could not get data from Steam. Check the proxy address in Settings.|Kunne ikke hente data fra Steam. Sjekk proxy-adressen i innstillingene.
Ціни та знижки напряму зі Steam для вибраного регіону.|Prices and discounts straight from Steam for the selected region.|Priser og rabatter rett fra Steam for valgt region.
Ціни напряму зі Steam для кожного регіону, без конвертації.|Prices straight from Steam for each region, no conversion.|Priser rett fra Steam for hver region, uten konvertering.
Історію цін Steam не надає, тому тут її немає.|Steam does not provide price history, so there is none here.|Steam tilbyr ikke prishistorikk, så den finnes ikke her.
Адреса Steam-проксі (Cloudflare Worker)|Steam proxy address (Cloudflare Worker)|Steam-proxy-adresse (Cloudflare Worker)
Збережіть адресу, щоб показувати справжні дані Steam. Без неї працюють демо-дані.|Save the address to show real Steam data. Without it, demo data is used.|Lagre adressen for å vise ekte Steam-data. Uten den brukes demodata.
Вбудований проксі працює за замовчуванням. Залиште поле порожнім, щоб повернути його.|The built-in proxy is used by default. Leave the field empty to restore it.|Den innebygde proxyen brukes som standard. La feltet stå tomt for å gjenopprette den.
Онлайн гравців|Players online|Spillere pålogget
Зараз грають|Playing now|Spiller nå
Пік за 24 години|24-hour peak|Topp siste 24 t
Рекорд за весь час|All-time peak|Rekord noensinne
Історія цін у Steam|Steam price history|Prishistorikk i Steam
Історичний мінімум|All-time low|Laveste noensinne
Звичайна ціна|Regular price|Ordinær pris
Найбільша знижка|Biggest discount|Største rabatt
Кількість знижок|Number of sales|Antall salg
Остання знижка|Last sale|Siste salg
Ціна в Steam|Steam price|Steam-pris
Гравці|Players|Spillere
Перетягуйте рамку під графіком, щоб вибрати період. Торкніться графіка, щоб побачити значення.|Drag the frame under the chart to choose a period. Tap the chart to see values.|Dra rammen under grafen for å velge periode. Trykk på grafen for å se verdier.
Дані: SteamCharts і Steam Web API|Data: SteamCharts and Steam Web API|Data: SteamCharts og Steam Web API
Дані: IsThereAnyDeal (ціни Steam для вибраного регіону)|Data: IsThereAnyDeal (Steam prices for the selected region)|Data: IsThereAnyDeal (Steam-priser for valgt region)
Немає даних про онлайн для цієї гри.|No player data for this game.|Ingen spillerdata for dette spillet.
Немає історії цін для цієї гри.|No price history for this game.|Ingen prishistorikk for dette spillet.
Гра безкоштовна, історії цін немає.|The game is free, there is no price history.|Spillet er gratis, det finnes ingen prishistorikk.
Не вдалося завантажити статистику.|Could not load statistics.|Kunne ikke laste statistikk.
Ціна зараз|Current price|Pris nå
Дата придбання|Purchase date|Kjøpsdato
Ціна на цю дату|Price on this date|Pris på denne datoen
Немає даних про ціну до|No price data before|Ingen prisdata før
Ціна недоступна.|Price unavailable.|Pris utilgjengelig.
Гра безкоштовна.|The game is free.|Spillet er gratis.
Минулі ціни перераховано з історії Steam (|Past prices are converted from Steam history (|Tidligere priser er omregnet fra Steam-historikk (
) за поточним співвідношенням регіональних цін, тому вони приблизні.|) using the current regional price ratio, so they are approximate.|) etter dagens forhold mellom regionale priser, så de er omtrentlige.
Відкрийте гру в крамниці, виберіть дату придбання й додайте її в бібліотеку.|Open a game in the store, choose the purchase date and add it to your library.|Åpne et spill i butikken, velg kjøpsdato og legg det til i biblioteket.
Відкрити в крамниці|Open in store|Åpne i butikken
Буде записано ціну Steam на вибрану дату.|The Steam price on the selected date will be recorded.|Steam-prisen på valgt dato blir lagret.
Буде записано поточну ціну Steam.|The current Steam price will be recorded.|Gjeldende Steam-pris blir lagret.
Буде записано ціну на вибрану дату.|The price on the selected date will be recorded.|Prisen på valgt dato blir lagret.
>48г<|>48h<|>48t<
>1т<|>1w<|>1u<
>1м<|>1m<|>1m<
>3м<|>3m<|>3m<
>3р<|>3y<|>3å<
>Усе<|>Max<|>Alt<
Бібліотека|Library|Bibliotek
Акаунт|Account|Konto
Пошук ігор…|Search games…|Søk etter spill…
Знижки та новинки|Deals and new releases|Tilbud og nyheter
Ціни на дату|Prices on date|Priser på dato
Сьогодні|Today|I dag
Дата випуску:|Release date:|Utgivelsesdato:
Демо-дані з вашого макета. Історія цін змодельована.|Demo data from your mockup. Price history is simulated.|Demodata fra mockupen din. Prishistorikken er simulert.
Популярні пошукові запити|Popular searches|Populære søk
Нічого не знайдено|Nothing found|Ingen treff
← Усі ігри|← All games|← Alle spill
Рецензії|Reviews|Anmeldelser
Дата виходу|Release date|Utgivelsesdato
Розробник|Developer|Utvikler
дуже схвальні|Very positive|Veldig positive
Додати в мою бібліотеку, ціна в|Add to my library, price in|Legg til i biblioteket mitt, pris i
У бібліотеку|Add to library|Legg i bibliotek
Системні вимоги|System requirements|Systemkrav
Мінімальні:|Minimum:|Minimum:
Рекомендовані:|Recommended:|Anbefalt:
Ціна покупки|Purchase price|Kjøpspris
Трейлер|Trailer|Trailer
Скріншот |Screenshot |Skjermbilde 
 з 5| of 5| av 5
Ілюстрації-заглушки: справжні обкладинки, скриншоти й відео потребують серверу.|Placeholder artwork: real covers, screenshots and videos require a server.|Plassholdergrafikk: ekte omslag, skjermbilder og videoer krever en server.
Характеристики|Specifications|Spesifikasjoner
Теги|Tags|Tagger
Модель|Model|Modell
Платна|Paid|Betalt
Безкоштовна|Free|Gratis
Безкоштовно|Free|Gratis
Базова ціна|Base price|Grunnpris
Мінімум (2 роки)|Minimum (2 years)|Minimum (2 år)
Розпродажів|Sales|Salg
 за 2 роки| in 2 years| på 2 år
Історія цін (UA)|Price history (UA)|Prishistorikk (UA)
>6м<|>6m<|>6m<
>1р<|>1y<|>1å<
>2р<|>2y<|>2å<
Зелена лінія — ціна, синя пунктирна — мінімум за 2 роки|Green line is the price, dashed blue line is the 2-year minimum|Grønn linje er prisen, stiplet blå linje er minimum siste 2 år
Зараз — історичний мінімум ціни.|Right now is the all-time lowest price.|Akkurat nå er den laveste prisen noensinne.
Зараз|Now|Nå
Максимум|Maximum|Maksimum
Середня за період|Average for period|Gjennomsnitt for perioden
Дата|Date|Dato
Ціна:|Price:|Pris:
 · знижка −| · discount −| · rabatt −
Показати ціни на цю дату|Show prices for this date|Vis priser for denne datoen
Ціна у валютах|Price by currency|Pris i valutaer
Торкніться валюти, щоб обрати її. Курси орієнтовні.|Tap a currency to select it. Rates are approximate.|Trykk på en valuta for å velge den. Kursene er omtrentlige.
Гривня|Hryvnia|Hryvnia
Норвезька крона|Norwegian krone|Norske kroner
Долар США|US dollar|Amerikanske dollar
Колонки: на вибрану дату · мінімум за 2 роки|Columns: on selected date · 2-year minimum|Kolonner: på valgt dato · minimum siste 2 år
Витрачено|Spent|Brukt
Ігор|Games|Spill
Заощаджено|Saved|Spart
+ Додати гру вручну|+ Add game manually|+ Legg til spill manuelt
Назва гри|Game title|Spilltittel
Ціна в магазині без знижки|Store price without discount|Butikkpris uten rabatt
Скільки заплатили (у вибраній валюті)|Amount paid (in selected currency)|Betalt beløp (i valgt valuta)
Зберегти|Save|Lagre
Тут поки порожньо.|Nothing here yet.|Ingenting her ennå.
Відкрийте гру в крамниці й додайте її в бібліотеку або внесіть вручну.|Open a game in the store and add it to your library, or enter it manually.|Åpne et spill i butikken og legg det til i biblioteket, eller legg det inn manuelt.
зі знижкою −|with discount −|med rabatt −
без знижки|no discount|uten rabatt
В магазині|In store|I butikken
Видалити|Delete|Slett
Видно, тут нічого немає|Looks like there is nothing here|Det ser ut til at det ikke er noe her
Увійдіть в акаунт, щоб бачити свою статистику.|Sign in to see your statistics.|Logg inn for å se statistikken din.
Ваш нікнейм|Your nickname|Kallenavnet ditt
Увійти в акаунт|Sign in|Logg inn
Вийти|Sign out|Logg ut
Це локальний вхід лише для цього пристрою. Прив’язати справжній акаунт Steam тут поки неможливо: для цього потрібен сервер (вхід через Steam і Steam Web API).|This is a local sign-in for this device only. Linking a real Steam account is not possible here yet: it needs a server (Steam sign-in and the Steam Web API).|Dette er en lokal pålogging kun for denne enheten. Å koble til en ekte Steam-konto er ikke mulig her ennå: det krever en server (Steam-pålogging og Steam Web API).
Налаштування|Settings|Innstillinger
Мова застосунку|App language|Appspråk
лист.|Nov|nov.
Пам’ять:|Memory:|Minne:
ОС:|OS:|OS:
Процесор:|Processor:|Prosessor:
Відеокарта:|Graphics:|Grafikk:
Диск:|Storage:|Lagring:
 ОП| RAM| RAM
Тактика в реальному часі про сучасний загальновійськовий бій. Окопи, придушення й мораль відділень, FPV-дрони та РЕБ, чесне бронепробиття й модулі техніки.|A real-time tactics game about modern combined-arms combat. Trenches, suppression and squad morale, FPV drones and EW, realistic armor penetration and vehicle modules.
Метроїдванія|Metroidvania
Дослідження|Exploration
Головоломка|Puzzle
Піксельна графіка|Pixel graphics
Без зусиль|Casual
Настільний компаньйон|Desktop companion
Збирання істот|Creature collecting
Симулятор|Simulation
Інді|Indie
Водіння|Driving
Відпочинок|Relaxing
Організація|Organization
Рай із куль|Bullet heaven
Бойовик|Action
Мандрівна гра|Roguelite
Мережевий кооператив|Online co-op
Кооператив|Co-op
Вільний доступ|Free to play
Пригоди|Adventure
Ремастер|Remaster
Візуальна новела|Visual novel
Хорор|Horror
Рольова гра|RPG
Стратегія|Strategy
Воєнна гра|War game
Гравець проти гравця|PvP
Відкритий світ|Open world
Шутер|Shooter
Класика|Classic
Пісочниця|Sandbox
Виживання|Survival
Фермерство|Farming
Платформер|Platformer
Рогалик|Roguelike
Екшен|Action
Колодобудування|Deckbuilding
Автоматизація|Automation
Колонії|Colony sim
Покрокова|Turn-based
Космос|Space
Жахи|Horror
Містобудування|City builder
Соціальна дедукція|Social deduction
Батл-рояль|Battle royale
Мережева гра|Multiplayer
Перегони|Racing
Рибалка|Fishing
Вечірка|Party
Менеджмент|Management
Файтинг|Fighting`.split('\n').map(l=>l.split('|')).sort((a,b)=>b[0].length-a[0].length);
const TR=h=>LANG==='uk'?h:D.reduce((s,[u,e,n])=>s.split(u).join(LANG==='nb'&&n?n:e),h);
