import { useState, useMemo, useEffect, useRef, useCallback, Fragment } from "react";
import { Zap, CreditCard, BarChart3, Settings, Plus, MoreHorizontal, Check, ChevronUp, ChevronDown, ExternalLink, Clock, Sparkles, TrendingUp, Search, Trash2, Moon, Sun, Bell, Fuel, MapPin, Shield, Info, Star, Award, RefreshCw, X, AlertTriangle, DollarSign, Layers, ChevronRight, PieChart } from "lucide-react";

/* ══════════ INJECT KEYFRAMES ══════════ */
const STYLE_ID = 'co-polish-styles';
function useInjectStyles() {
  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = `
      @keyframes co-shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      @keyframes co-pulse { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.05)} }
      @keyframes co-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes co-fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      @keyframes co-fadeIn { from{opacity:0} to{opacity:1} }
      @keyframes co-breathe { 0%,100%{box-shadow:0 0 20px rgba(52,211,153,0.15)} 50%{box-shadow:0 0 35px rgba(52,211,153,0.3)} }
      @keyframes co-fabPulse { 0%,100%{box-shadow:0 6px 24px rgba(167,139,250,0.5)} 50%{box-shadow:0 6px 32px rgba(167,139,250,0.7)} }
      @keyframes co-confetti { 0%{opacity:1;transform:translateY(0) rotate(0deg) scale(1)} 100%{opacity:0;transform:translateY(-120px) rotate(720deg) scale(0.3)} }
      @keyframes co-slideIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
      @keyframes co-countUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      @keyframes co-checkPop { 0%{transform:scale(0)} 50%{transform:scale(1.3)} 100%{transform:scale(1)} }
      @keyframes co-glow { 0%,100%{opacity:0.5} 50%{opacity:1} }
      @keyframes co-ripple { 0%{transform:scale(0);opacity:0.5} 100%{transform:scale(2.5);opacity:0} }
      @keyframes co-gradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
      .co-hover-lift { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1) !important; }
      .co-hover-lift:hover { transform: translateY(-2px) !important; }
      .co-hover-lift:active { transform: scale(0.97) !important; }
      .co-press { transition: transform 0.15s !important; }
      .co-press:active { transform: scale(0.95) !important; }
      input[type=number]::-webkit-inner-spin-button,
      input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; margin:0; }
      input[type=number] { -moz-appearance:textfield; }
      * { -webkit-tap-highlight-color: transparent; }
    `;
    document.head.appendChild(s);
  }, []);
}

/* ══════════ ANIMATED COUNTER ══════════ */
function useAnimatedValue(target, duration = 600) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const start = val;
    const diff = target - start;
    if (diff === 0) return;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min((t - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setVal(Math.round(start + diff * ease));
      if (p < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => ref.current && cancelAnimationFrame(ref.current);
  }, [target]);
  return val;
}

/* ══════════ CONFETTI ══════════ */
function Confetti({ show }) {
  if (!show) return null;
  const colors = ['#34d399','#a78bfa','#fbbf24','#818cf8','#f87171','#22d3ee'];
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 200 - 100,
    y: Math.random() * -80 - 40,
    r: Math.random() * 360,
    s: 4 + Math.random() * 6,
    c: colors[i % colors.length],
    d: 0.3 + Math.random() * 0.7,
    shape: i % 3,
  }));
  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', pointerEvents: 'none', zIndex: 10 }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          width: p.shape === 2 ? 0 : p.s,
          height: p.shape === 2 ? 0 : (p.shape === 1 ? p.s * 2 : p.s),
          borderRadius: p.shape === 0 ? '50%' : p.shape === 1 ? 2 : 0,
          borderLeft: p.shape === 2 ? `${p.s/2}px solid transparent` : 'none',
          borderRight: p.shape === 2 ? `${p.s/2}px solid transparent` : 'none',
          borderBottom: p.shape === 2 ? `${p.s}px solid ${p.c}` : 'none',
          background: p.shape !== 2 ? p.c : 'none',
          left: p.x, top: p.y,
          animation: `co-confetti ${p.d}s ease-out forwards`,
          animationDelay: `${p.id * 0.03}s`,
        }} />
      ))}
    </div>
  );
}

/* ══════════ DATA ══════════ */
const SC=[
{id:'groceries',nm:'Groceries',ic:'🥬',pf:['bigbasket','swiggy-instamart','blinkit','zepto','jiomart','amazon-fresh','dmart','flipkart-supermart','bb-now','natures-basket'],am:[500,1000,2000,5000]},
{id:'food',nm:'Food',ic:'🍔',pf:['swiggy','zomato','eatsure','dominos','box8','pizza-hut','mcdonalds','kfc','oven-story','faasos'],am:[300,500,800,1500]},
{id:'flights',nm:'Flights',ic:'✈️',pf:['makemytrip','goibibo','cleartrip','ixigo','easemytrip','yatra','smartbuy-flights','irctc','paytm-travel','indigo'],am:[3000,6000,15000,30000]},
{id:'hotels',nm:'Hotels',ic:'🏨',pf:['makemytrip','goibibo','cleartrip','oyo','booking-com','agoda','yatra','smartbuy-hotels','easemytrip','airbnb'],am:[3000,8000,15000,30000]},
{id:'shopping',nm:'Shopping',ic:'🛍️',pf:['amazon','flipkart','myntra','ajio','meesho','tatacliq','nykaa','snapdeal','smartbuy','shopsy'],am:[500,1000,3000,5000]},
{id:'electronics',nm:'Electronics',ic:'📱',pf:['amazon','flipkart','croma','reliance-digital','vijay-sales','smartbuy','samsung-store','tatacliq-tech','paytm-mall','bajaj-finserv'],am:[5000,10000,25000,50000]},
{id:'entertainment',nm:'Movies',ic:'🎬',pf:['bookmyshow','pvr-inox','paytm-movies','netflix','hotstar','amazon-prime','spotify','youtube-premium','jiocinema','sonyliv'],am:[200,500,1000,2000]},
{id:'fuel',nm:'Fuel',ic:'⛽',pf:['indian-oil','bpcl','hp-petrol','nayara','jio-bp','reliance-petrol','shell'],am:[500,1000,2000,5000],isFuel:true},
{id:'bills',nm:'Bills',ic:'🧾',pf:['google-pay','phonepe','paytm','cred','freecharge','mobikwik','amazon-pay-bills','bbps','airtel-thanks','myjio'],am:[500,1000,2000,5000]},
{id:'pharmacy',nm:'Pharmacy',ic:'💊',pf:['tata-1mg','pharmeasy','netmeds','apollo-247','medbuddy','amazon-pharmacy','flipkart-health','truemeds','cultfit','practo'],am:[200,500,1000,3000]}
];
const PL={
'bigbasket':{n:'BigBasket',i:'🥬'},'swiggy-instamart':{n:'Swiggy Instamart',i:'🛒'},'blinkit':{n:'Blinkit',i:'⚡'},'zepto':{n:'Zepto',i:'🚀'},'jiomart':{n:'JioMart',i:'🏪'},'amazon-fresh':{n:'Amazon Fresh',i:'📦'},'dmart':{n:'DMart Ready',i:'🏬'},'flipkart-supermart':{n:'Flipkart Supermart',i:'🛍️'},'bb-now':{n:'BB Now',i:'⏱️'},'natures-basket':{n:"Nature's Basket",i:'🧺'},
'swiggy':{n:'Swiggy',i:'🍔'},'zomato':{n:'Zomato',i:'🍽️'},'eatsure':{n:'EatSure',i:'🍱'},'dominos':{n:"Domino's",i:'🍕'},'box8':{n:'Box8',i:'📦'},'pizza-hut':{n:'Pizza Hut',i:'🍕'},'mcdonalds':{n:"McDonald's",i:'🍟'},'kfc':{n:'KFC',i:'🍗'},'oven-story':{n:'Oven Story',i:'🔥'},'faasos':{n:'Faasos',i:'🌯'},
'makemytrip':{n:'MakeMyTrip',i:'✈️'},'goibibo':{n:'Goibibo',i:'🎫'},'cleartrip':{n:'Cleartrip',i:'🧭'},'ixigo':{n:'Ixigo',i:'🗺️'},'easemytrip':{n:'EaseMyTrip',i:'💰'},'yatra':{n:'Yatra',i:'🌏'},'smartbuy-flights':{n:'SmartBuy Flights',i:'🎁'},'irctc':{n:'IRCTC',i:'🚂'},'paytm-travel':{n:'Paytm Travel',i:'📱'},'indigo':{n:'IndiGo',i:'🛫'},
'oyo':{n:'OYO',i:'🏠'},'booking-com':{n:'Booking.com',i:'🌐'},'agoda':{n:'Agoda',i:'🏝️'},'smartbuy-hotels':{n:'SmartBuy Hotels',i:'🎁'},'airbnb':{n:'Airbnb',i:'🏡'},
'amazon':{n:'Amazon',i:'📦'},'flipkart':{n:'Flipkart',i:'🛍️'},'myntra':{n:'Myntra',i:'👔'},'ajio':{n:'AJIO',i:'👕'},'meesho':{n:'Meesho',i:'🛒'},'tatacliq':{n:'Tata CLiQ',i:'🏷️'},'nykaa':{n:'Nykaa',i:'💄'},'snapdeal':{n:'Snapdeal',i:'💲'},'smartbuy':{n:'SmartBuy',i:'🎁'},'shopsy':{n:'Shopsy',i:'🎪'},
'croma':{n:'Croma',i:'🔌'},'reliance-digital':{n:'Reliance Digital',i:'📱'},'vijay-sales':{n:'Vijay Sales',i:'🏪'},'samsung-store':{n:'Samsung Store',i:'📲'},'tatacliq-tech':{n:'Tata CLiQ Tech',i:'💻'},'paytm-mall':{n:'Paytm Mall',i:'📱'},'bajaj-finserv':{n:'Bajaj EMI Store',i:'🏦'},
'bookmyshow':{n:'BookMyShow',i:'🎬'},'pvr-inox':{n:'PVR INOX',i:'🎥'},'paytm-movies':{n:'Paytm Movies',i:'🎞️'},'netflix':{n:'Netflix',i:'🎬'},'hotstar':{n:'Disney+ Hotstar',i:'⭐'},'amazon-prime':{n:'Prime Video',i:'▶️'},'spotify':{n:'Spotify',i:'🎵'},'youtube-premium':{n:'YouTube Premium',i:'📺'},'jiocinema':{n:'JioCinema',i:'🎞️'},'sonyliv':{n:'SonyLIV',i:'📡'},
'hp-petrol':{n:'HPCL',i:'⛽'},'indian-oil':{n:'IndianOil (IOCL)',i:'⛽'},'bpcl':{n:'BPCL',i:'⛽'},'nayara':{n:'Nayara Energy',i:'⛽'},'jio-bp':{n:'Jio-bp',i:'⛽'},'shell':{n:'Shell',i:'⛽'},'reliance-petrol':{n:'Reliance Petroleum',i:'⛽'},
'google-pay':{n:'Google Pay',i:'📱'},'phonepe':{n:'PhonePe',i:'💜'},'paytm':{n:'Paytm',i:'🔵'},'cred':{n:'CRED',i:'💳'},'freecharge':{n:'Freecharge',i:'⚡'},'mobikwik':{n:'MobiKwik',i:'📲'},'amazon-pay-bills':{n:'Amazon Pay Bills',i:'📦'},'bbps':{n:'BBPS Direct',i:'🏛️'},'airtel-thanks':{n:'Airtel Thanks',i:'📡'},'myjio':{n:'MyJio',i:'🔴'},
'tata-1mg':{n:'Tata 1mg',i:'💊'},'pharmeasy':{n:'PharmEasy',i:'💉'},'netmeds':{n:'Netmeds',i:'🩺'},'apollo-247':{n:'Apollo 247',i:'🏥'},'medbuddy':{n:'MediBuddy',i:'🩻'},'amazon-pharmacy':{n:'Amazon Pharmacy',i:'📦'},'flipkart-health':{n:'Flipkart Health+',i:'🛍️'},'truemeds':{n:'Truemeds',i:'💊'},'cultfit':{n:'Cult.fit',i:'🏋️'},'practo':{n:'Practo',i:'👨‍⚕️'}
};
const AC=[
{id:'onecard',nm:'OneCard',bk:'Federal Bank',fe:0,ic:'💳',nw:'visa',gr:['#667eea','#764ba2'],r:{'default':0.05},u:'https://www.getonecard.app/'},
{id:'axis-neo',nm:'Neo',bk:'Axis Bank',fe:0,ic:'🆕',nw:'visa',gr:['#f093fb','#f5576c'],r:{'default':0.01},u:'https://www.axisbank.com/retail/cards/credit-card/axis-bank-neo-credit-card'},
{id:'icici-amazon',nm:'Amazon Pay',bk:'ICICI Bank',fe:0,ic:'📦',nw:'visa',gr:['#4facfe','#00f2fe'],r:{'amazon':0.05,'amazon-fresh':0.05,'amazon-prime':0.05,'amazon-pharmacy':0.05,'amazon-pay-bills':0.02,'swiggy':0.02,'zomato':0.02,'swiggy-instamart':0.02,'bookmyshow':0.02,'blinkit':0.02,'default':0.01},u:'https://www.icicibank.com/card/credit-cards/amazon-pay-credit-card'},
{id:'hdfc-swiggy',nm:'Swiggy',bk:'HDFC Bank',fe:500,ic:'🍔',nw:'visa',gr:['#fa709a','#fee140'],r:{'swiggy':0.10,'swiggy-instamart':0.10,'zomato':0.05,'eatsure':0.05,'faasos':0.05,'default':0.01},wv:'₹2L spend',u:'https://www.hdfcbank.com/personal/pay/cards/credit-cards/swiggy-hdfc-bank-credit-card'},
{id:'hdfc-tata',nm:'Tata Neu+',bk:'HDFC Bank',fe:0,ic:'🛒',nw:'rupay',gr:['#30cfd0','#330867'],r:{'bigbasket':0.05,'bb-now':0.05,'croma':0.05,'tatacliq':0.05,'tatacliq-tech':0.05,'natures-basket':0.05,'tata-1mg':0.05,'default':0.015},u:'https://www.hdfcbank.com/personal/pay/cards/credit-cards/tata-neu-plus-hdfc-bank-credit-card'},
{id:'hdfc-millennia',nm:'Millennia',bk:'HDFC Bank',fe:0,ic:'💎',nw:'visa',gr:['#a8edea','#fed6e3'],r:{'smartbuy':0.05,'smartbuy-flights':0.05,'smartbuy-hotels':0.05,'amazon':0.025,'flipkart':0.025,'myntra':0.025,'swiggy':0.025,'zomato':0.025,'bookmyshow':0.025,'tatacliq':0.025,'default':0.01},u:'https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia-credit-card'},
{id:'hdfc-infinia',nm:'Infinia',bk:'HDFC Bank',fe:12500,ic:'👑',nw:'visa',gr:['#ffd89b','#19547b'],r:{'smartbuy':0.165,'smartbuy-flights':0.165,'smartbuy-hotels':0.165,'default':0.033},wv:'₹10L spend',u:'https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card'},
{id:'axis-magnus',nm:'Magnus',bk:'Axis Bank',fe:12500,ic:'🔥',nw:'visa',gr:['#ff6b6b','#4ecdc4'],r:{'makemytrip':0.12,'goibibo':0.12,'cleartrip':0.04,'yatra':0.04,'default':0.024},u:'https://www.axisbank.com/retail/cards/credit-card/axis-bank-magnus-credit-card'},
{id:'sbi-cashback',nm:'Cashback',bk:'SBI Card',fe:999,ic:'💰',nw:'visa',gr:['#f7971e','#ffd200'],r:{'default':0.05},wv:'₹2L spend',caps:[{platforms:['default'],cap:'₹5000/quarter',note:'5% cashback capped at ₹5,000 per quarter (₹1,667/month)'}],u:'https://www.sbicard.com/en/personal/credit-cards/cashback/sbi-card-cashback.page'},
{id:'axis-flipkart',nm:'Flipkart',bk:'Axis Bank',fe:0,ic:'🛍️',nw:'visa',gr:['#2193b0','#6dd5ed'],r:{'flipkart':0.05,'flipkart-supermart':0.05,'myntra':0.04,'shopsy':0.04,'cleartrip':0.04,'swiggy':0.04,'zomato':0.04,'default':0.015},u:'https://www.axisbank.com/retail/cards/credit-card/flipkart-axis-bank-credit-card'},
{id:'icici-sapphiro',nm:'Sapphiro',bk:'ICICI Bank',fe:3500,ic:'💎',nw:'visa',gr:['#ee0979','#ff6a00'],r:{'cleartrip':0.04,'makemytrip':0.03,'default':0.02},wv:'₹5L spend',u:'https://www.icicibank.com/card/credit-cards/icici-bank-sapphiro-credit-card'},
{id:'au-lit',nm:'LIT',bk:'AU Bank',fe:0,ic:'🎨',nw:'visa',gr:['#a18cd1','#fbc2eb'],r:{'swiggy':0.05,'zomato':0.05,'amazon':0.05,'flipkart':0.05,'blinkit':0.05,'zepto':0.03,'default':0.015},u:'https://www.aubank.in/credit-card/lit-credit-card'},
{id:'bpcl-sbi',nm:'BPCL Octane',bk:'SBI Card',fe:1499,ic:'⛽',nw:'visa',gr:['#e65100','#ffd600'],r:{'bpcl':0.0725,'swiggy':0.02,'zomato':0.02,'default':0.005},wv:'₹2L spend',fl:{pump:'bpcl',sw:1,swCap:100,swMin:400,swMax:4000,pts:'13X pts/₹100',tip:'Swipe only at BPCL pumps. Reward points redeemable at 1200+ BPCL outlets.'},u:'https://www.sbicard.com/en/personal/credit-cards/travel/bpcl-sbi-card.page'},
{id:'iocl-axis',nm:'IndianOil',bk:'Axis Bank',fe:500,ic:'⛽',nw:'visa',gr:['#1565c0','#42a5f5'],r:{'indian-oil':0.04,'default':0.005},wv:'₹50K spend',fl:{pump:'indian-oil',sw:1,swCap:200,swMin:400,swMax:4000,pts:'4% as EDGE rewards',tip:'Use at IOCL stations only. Rewards redeemable for fuel via IndianOil XTRAREWARDS.'},u:'https://www.axisbank.com/retail/cards/credit-card/indian-oil-axis-bank-credit-card'},
{id:'icici-hpcl',nm:'HPCL Coral',bk:'ICICI Bank',fe:199,ic:'⛽',nw:'visa',gr:['#2e7d32','#81c784'],r:{'hp-petrol':0.04,'default':0.005},wv:'₹1.5L spend',fl:{pump:'hp-petrol',sw:1,swCap:200,swMin:400,swMax:4000,pts:'4% cashback on HPCL',tip:'Use at HPCL pumps. Also get 25% off BookMyShow (2x/month).'},u:'https://www.icicibank.com/card/credit-cards/hpcl-icici-bank-coral-credit-card'},
{id:'iocl-rbl',nm:'IOCL Xtra',bk:'RBL Bank',fe:500,ic:'⛽',nw:'mc',gr:['#d84315','#ff8a65'],r:{'indian-oil':0.075,'default':0.005},wv:'₹50K spend',fl:{pump:'indian-oil',sw:1,swCap:150,swMin:500,swMax:4000,pts:'7.5% as Fuel Points',tip:'Best IOCL card. Must swipe on IOCL-branded machines only (Touch terminals with IOCL logo).'},u:'https://www.rblbank.com/credit-cards/iocl-rbl-bank-xtra-credit-card'},
{id:'jiobp-indusind',nm:'Jio-bp Mobility+',bk:'IndusInd Bank',fe:0,ic:'⛽',nw:'visa',gr:['#00695c','#26a69a'],r:{'jio-bp':0.04,'nayara':0.01,'shell':0.01,'default':0.005},fl:{pump:'jio-bp',sw:1,swCap:100,swMin:400,swMax:4000,pts:'12 Smiles/₹100 (4%)',tip:'Zero annual fee. Earn Smiles redeemable at Jio-bp pumps. Also earn 200 bonus Smiles on ₹4K+/month Jio-bp spends.'},u:'https://www.indusind.com/in/en/personal/cards/credit-card/jio-bp-mobility-plus-credit-card.html'},
// ═══════════ ENTRY-LEVEL / BASIC CARDS (millions hold these) ═══════════
{id:'hdfc-moneyback',nm:'MoneyBack+',bk:'HDFC Bank',fe:500,ic:'💵',nw:'visa',gr:['#56ab2f','#a8e063'],r:{'amazon':0.033,'flipkart':0.033,'swiggy':0.033,'bigbasket':0.033,'bb-now':0.033,'default':0.0033},wv:'₹50K spend',caps:[{platforms:['amazon','flipkart','swiggy','bigbasket'],cap:'₹1000/month',note:'10X CashPoints on partners capped at 1000 CashPoints/month'}],u:'https://www.hdfcbank.com/personal/pay/cards/credit-cards/moneyback-plus-credit-card'},
{id:'hdfc-freedom',nm:'Freedom',bk:'HDFC Bank',fe:500,ic:'🆓',nw:'visa',gr:['#36d1dc','#5b86e5'],r:{'swiggy':0.025,'zomato':0.025,'bigbasket':0.025,'default':0.0027},wv:'₹50K spend',u:'https://www.hdfcbank.com/personal/pay/cards/credit-cards/freedom-credit-card'},
{id:'sbi-simplysave',nm:'SimplySAVE',bk:'SBI Card',fe:499,ic:'🏪',nw:'visa',gr:['#c94b4b','#4b134f'],r:{'swiggy':0.025,'zomato':0.025,'bookmyshow':0.025,'bigbasket':0.025,'default':0.0025},wv:'₹1L spend',u:'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-simplysave.page'},
{id:'sbi-simplyclick',nm:'SimplyCLICK',bk:'SBI Card',fe:499,ic:'🖱️',nw:'visa',gr:['#f857a6','#ff5858'],r:{'amazon':0.025,'bookmyshow':0.025,'cleartrip':0.025,'lenskart':0.025,'netmeds':0.025,'amazon-pharmacy':0.0125,'default':0.0125},wv:'₹1L spend',u:'https://www.sbicard.com/en/personal/credit-cards/shopping/sbi-card-simplyclick.page'},
{id:'icici-platinum',nm:'Platinum',bk:'ICICI Bank',fe:0,ic:'🔘',nw:'visa',gr:['#bdc3c7','#2c3e50'],r:{'bookmyshow':0.015,'swiggy':0.005,'zomato':0.005,'default':0.005},u:'https://www.icicibank.com/card/credit-cards/icici-bank-platinum-chip-credit-card'},
{id:'icici-coral',nm:'Coral',bk:'ICICI Bank',fe:500,ic:'🪸',nw:'visa',gr:['#ff6b6b','#ee5a24'],r:{'bookmyshow':0.025,'swiggy':0.01,'zomato':0.01,'cleartrip':0.01,'default':0.005},wv:'₹1.5L spend',u:'https://www.icicibank.com/card/credit-cards/icici-bank-coral-credit-card'},
{id:'axis-myzone',nm:'MyZone',bk:'Axis Bank',fe:500,ic:'🎬',nw:'visa',gr:['#ED4264','#FFEDBC'],r:{'bookmyshow':0.05,'pvr-inox':0.05,'swiggy':0.02,'zomato':0.02,'default':0.005},wv:'₹50K spend',u:'https://www.axisbank.com/retail/cards/credit-card/my-zone-credit-card'},
{id:'axis-ace',nm:'Ace',bk:'Axis Bank',fe:499,ic:'🃏',nw:'visa',gr:['#11998e','#38ef7d'],r:{'google-pay':0.05,'phonepe':0.02,'paytm':0.02,'cred':0.02,'bbps':0.02,'freecharge':0.02,'mobikwik':0.02,'amazon-pay-bills':0.02,'swiggy':0.04,'zomato':0.04,'default':0.015},wv:'₹2L spend',caps:[{platforms:['google-pay'],cap:'₹500/month',note:'5% on utility bills via Google Pay capped at ₹500 cashback/month'},{platforms:['swiggy','zomato'],cap:'₹500/month',note:'4% on Swiggy/Zomato capped at ₹500/month'}],u:'https://www.axisbank.com/retail/cards/credit-card/ace-credit-card'},
{id:'kotak-811',nm:'811',bk:'Kotak Mahindra',fe:0,ic:'📱',nw:'visa',gr:['#e52d27','#b31217'],r:{'amazon':0.02,'flipkart':0.02,'myntra':0.02,'default':0.01},u:'https://www.kotak.com/en/personal-banking/cards/credit-cards/811-credit-card.html'},
{id:'idfc-classic',nm:'FIRST Classic',bk:'IDFC First',fe:0,ic:'🎯',nw:'visa',gr:['#0052D4','#4364F7'],r:{'amazon':0.0075,'flipkart':0.0075,'swiggy':0.0075,'zomato':0.0075,'default':0.0025},u:'https://www.idfcfirstbank.com/credit-card/first-classic'},
// ═══════════ MID-TIER / PREMIUM CARDS ═══════════
{id:'hdfc-regalia',nm:'Regalia',bk:'HDFC Bank',fe:2500,ic:'✨',nw:'visa',gr:['#8E2DE2','#4A00E0'],r:{'smartbuy':0.10,'smartbuy-flights':0.10,'smartbuy-hotels':0.10,'makemytrip':0.013,'cleartrip':0.013,'default':0.013},wv:'₹3L spend',u:'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-credit-card'},
{id:'hdfc-regalia-gold',nm:'Regalia Gold',bk:'HDFC Bank',fe:2999,ic:'🌟',nw:'visa',gr:['#F09819','#EDDE5D'],r:{'smartbuy':0.10,'smartbuy-flights':0.10,'smartbuy-hotels':0.10,'myntra':0.033,'nykaa':0.033,'reliance-digital':0.033,'croma':0.033,'default':0.013},wv:'₹4L spend',u:'https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card'},
{id:'hdfc-diners-black',nm:'Diners Black',bk:'HDFC Bank',fe:10000,ic:'♠️',nw:'diners',gr:['#232526','#414345'],r:{'smartbuy':0.165,'smartbuy-flights':0.165,'smartbuy-hotels':0.165,'default':0.0167},wv:'₹5L spend',u:'https://www.hdfcbank.com/personal/pay/cards/credit-cards/diners-club-black'},
{id:'sbi-prime',nm:'Prime',bk:'SBI Card',fe:2999,ic:'💼',nw:'visa',gr:['#1a2980','#26d0ce'],r:{'swiggy':0.0375,'zomato':0.0375,'bigbasket':0.0375,'default':0.0125},wv:'₹3L spend',u:'https://www.sbicard.com/en/personal/credit-cards/rewards/sbi-card-prime.page'},
{id:'sbi-elite',nm:'Elite',bk:'SBI Card',fe:4999,ic:'🏆',nw:'visa',gr:['#141E30','#243B55'],r:{'swiggy':0.025,'zomato':0.025,'bigbasket':0.025,'bookmyshow':0.025,'cleartrip':0.025,'default':0.005},wv:'₹5L spend',u:'https://www.sbicard.com/en/personal/credit-cards/travel-and-shopping/sbi-card-elite.page'},
{id:'sbi-flipkart',nm:'Flipkart SBI',bk:'SBI Card',fe:500,ic:'🛒',nw:'visa',gr:['#2196F3','#F44336'],r:{'flipkart':0.05,'myntra':0.075,'swiggy':0.04,'zomato':0.04,'cultfit':0.04,'flipkart-health':0.05,'default':0.01},wv:'₹3.5L spend',u:'https://www.sbicard.com/en/personal/credit-cards/shopping/flipkart-sbi-card.page'},
{id:'icici-rubyx',nm:'Rubyx',bk:'ICICI Bank',fe:3000,ic:'💠',nw:'visa',gr:['#c0392b','#e74c3c'],r:{'bookmyshow':0.025,'cleartrip':0.015,'makemytrip':0.015,'default':0.0075},wv:'₹3L spend',u:'https://www.icicibank.com/card/credit-cards/icici-bank-rubyx-credit-card'},
{id:'axis-atlas',nm:'Atlas',bk:'Axis Bank',fe:5000,ic:'🗺️',nw:'visa',gr:['#1B1464','#6a3093'],r:{'makemytrip':0.05,'cleartrip':0.05,'goibibo':0.05,'yatra':0.05,'default':0.02},wv:'₹4L spend',u:'https://www.axisbank.com/retail/cards/credit-card/atlas-credit-card'},
{id:'kotak-league',nm:'League Platinum',bk:'Kotak Mahindra',fe:500,ic:'🏅',nw:'visa',gr:['#d31027','#ea384d'],r:{'pvr-inox':0.04,'bookmyshow':0.04,'swiggy':0.015,'default':0.013},wv:'₹1L spend',u:'https://www.kotak.com/en/personal-banking/cards/credit-cards/league-platinum-credit-card.html'},
{id:'idfc-select',nm:'FIRST Select',bk:'IDFC First',fe:999,ic:'⭐',nw:'visa',gr:['#00B4DB','#0083B0'],r:{'cleartrip':0.025,'makemytrip':0.025,'swiggy':0.025,'zomato':0.025,'default':0.0075},wv:'₹2L spend',u:'https://www.idfcfirstbank.com/credit-card/first-select'},
{id:'amex-mrcc',nm:'MRCC',bk:'Amex',fe:4500,ic:'🅰️',nw:'amex',gr:['#003087','#00175a'],r:{'amazon':0.02,'flipkart':0.02,'swiggy':0.02,'default':0.02},wv:'₹1.5L spend',u:'https://www.americanexpress.com/in/credit-cards/membership-rewards-credit-card/'},
{id:'hsbc-cashback',nm:'Cashback',bk:'HSBC',fe:750,ic:'🏦',nw:'visa',gr:['#DB0011','#3d0000'],r:{'default':0.015},wv:'₹1L spend',u:'https://www.hsbc.co.in/credit-cards/products/cashback/'},
{id:'sc-smart',nm:'Smart',bk:'Standard Chartered',fe:0,ic:'🔷',nw:'visa',gr:['#0072AA','#004E7C'],r:{'swiggy':0.05,'zomato':0.05,'bigbasket':0.05,'tata-1mg':0.05,'pharmeasy':0.03,'default':0.01},u:'https://www.sc.com/in/credit-cards/smart/'},
];
// ═══════════ LIVE OFFERS CONFIG ═══════════
// Replace with your Supabase credentials after setup
const SUPABASE_URL = 'https://hgerzyjbyrzorbxxdhbj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnZXJ6eWpieXJ6b3JieHhkaGJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5OTY1NjMsImV4cCI6MjA4NjU3MjU2M30.oVqohB35KIsTpbTBmolu_eyE2kSyKx_sINM7i8JZuIs';
const OFFER_REFRESH_MS = 6 * 60 * 60 * 1000; // 6 hours

// No hardcoded offers — only verified live offers from Supabase
// Card rewards (permanent rates built into each card) always work without offers
let OF=[];
const HARDCODED_OF = [];
const DEF=['onecard','axis-neo','icici-amazon','hdfc-swiggy','hdfc-tata','hdfc-millennia'];

/* ══════════ RESPONSIVE ══════════ */
function useL(){const[w,sW]=useState(typeof window!=='undefined'?window.innerWidth:400);useEffect(()=>{const f=()=>sW(window.innerWidth);window.addEventListener('resize',f);return()=>window.removeEventListener('resize',f);},[]);const ph=w<480,tb=w>=480&&w<860,dk=w>=860;return{w,ph,tb,dk,cat:dk?5:tb?4:w<360?2:3,px:dk?36:tb?28:w<360?14:20,mx:dk?780:tb?580:480,fs:{xs:dk?12:w<360?9:10,sm:dk?14:w<360?11:12,md:dk?16:w<360?13:14,lg:dk?20:w<360?16:18,h:dk?48:w<360?32:40,sv:dk?52:w<360?36:44},g:dk?12:w<360?6:10,r:dk?20:16,sb:w>=1060};}

/* ══════════ THEMES ══════════ */
const D={bg:'linear-gradient(160deg,#1a0e3e 0%,#2d1b69 40%,#3b1f8e 70%,#1a0e3e 100%)',s:'rgba(255,255,255,0.07)',sh:'rgba(255,255,255,0.11)',ss:'rgba(255,255,255,0.14)',b:'rgba(255,255,255,0.09)',bh:'rgba(255,255,255,0.18)',t1:'#fff',t2:'rgba(255,255,255,0.6)',t3:'rgba(255,255,255,0.35)',g:'#34d399',gg:'rgba(52,211,153,0.15)',gb:'rgba(52,211,153,0.35)',a:'#fbbf24',ag:'rgba(251,191,36,0.12)',ab:'rgba(251,191,36,0.3)',lv:'#f87171',ac:'#a78bfa',acg:'rgba(167,139,250,0.15)',acb:'rgba(167,139,250,0.5)',cb:'rgba(255,215,0,0.12)',cbd:'rgba(255,215,0,0.25)',ct:'rgba(255,215,0,0.9)',tb:'rgba(26,14,62,0.95)',cg:'linear-gradient(145deg,#1a0e3e,#2d1b69)'};
const LT={bg:'linear-gradient(160deg,#f8f6ff 0%,#fff 40%,#f0ecff 70%,#f8f6ff 100%)',s:'rgba(100,70,180,0.06)',sh:'rgba(100,70,180,0.1)',ss:'rgba(100,70,180,0.14)',b:'rgba(100,70,180,0.1)',bh:'rgba(100,70,180,0.2)',t1:'#1a0e3e',t2:'rgba(26,14,62,0.6)',t3:'rgba(26,14,62,0.35)',g:'#059669',gg:'rgba(5,150,105,0.1)',gb:'rgba(5,150,105,0.3)',a:'#d97706',ag:'rgba(217,119,6,0.08)',ab:'rgba(217,119,6,0.25)',lv:'#ef4444',ac:'#7c3aed',acg:'rgba(124,58,237,0.1)',acb:'rgba(124,58,237,0.3)',cb:'rgba(124,58,237,0.08)',cbd:'rgba(124,58,237,0.2)',ct:'#7c3aed',tb:'rgba(255,255,255,0.95)',cg:'linear-gradient(145deg,#f0ecff,#fff)'};

/* ══════════ ENGINE ══════════ */
const gR=(c,p)=>c.r[p]||c.r['default']||0;
const gO=(p,c,a)=>{const n=new Date();let b=null,bv=0;OF.forEach(o=>{if(o.p!==p||o.b!==c.bk||a<o.mn||new Date(o.tl)<n)return;const v=o.t==='₹'?Math.min(o.v,o.mx):Math.min(a*o.v/100,o.mx);if(v>bv){bv=v;b=o;}});return b?{...b,dc:Math.round(bv)}:null;};
const cCC=(c,p,a)=>{const rt=gR(c,p),rw=Math.round(a*rt),of=gO(p,c,a),oa=of?of.dc:0;return{card:c,pid:p,pf:PL[p],rt,rw,of,oa,tot:rw+oa,eff:a-(rw+oa),owned:c.owned};};
const cAll=(cid,a,cards)=>{const c=SC.find(x=>x.id===cid);if(!c)return[];const r=[];c.pf.forEach(p=>cards.forEach(cd=>r.push(cCC(cd,p,a))));r.sort((a,b)=>b.tot-a.tot);return r;};
const bP=cs=>{const s=new Set(),r=[];cs.forEach(c=>{if(!s.has(c.pid)){s.add(c.pid);r.push(c);}});return r;};
const fm=n=>n>=100000?'₹'+(n/100000)+'L':n>=1000?'₹'+(n/1000)+'k':'₹'+n;
const daysLeft=(tl)=>{const d=Math.ceil((new Date(tl)-new Date())/(864e5));return d;};

const TABS=[
  {id:'optimize', nm:'Optimize', Icon: Zap},
  {id:'cards',    nm:'Cards',    Icon: CreditCard},
  {id:'history',  nm:'History',  Icon: BarChart3},
  {id:'settings', nm:'Settings', Icon: Settings},
];

/* ═══════════════════════════════
   CREDIT CARD VISUAL
   ═══════════════════════════════ */
function CardVisual({card, size='md', c}) {
  const sizes = {
    sm: {w:56,h:36,bk:6,nm:5.5,nw:5,chip:8,chipH:6,r:5,cless:7},
    md: {w:86,h:54,bk:7.5,nm:7,nw:7,chip:12,chipH:9,r:7,cless:9},
    lg: {w:160,h:100,bk:10,nm:9.5,nw:9,chip:18,chipH:13,r:10,cless:12},
    xl: {w:240,h:150,bk:13,nm:12,nw:12,chip:24,chipH:17,r:14,cless:16},
  };
  const s = sizes[size] || sizes.md;
  const isDark = (card.gr[0]||'').includes('a8edea') || (card.gr[0]||'').includes('ffd89b') || (card.gr[0]||'').includes('fee140') || (card.gr[0]||'').includes('fbc2eb');
  const txtColor = isDark ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.9)';
  const txtSub = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.6)';
  const chipGold = isDark ? 'linear-gradient(135deg,#c9a94a,#e8d48b,#c9a94a)' : 'linear-gradient(135deg,#d4a947,#f0d78c,#d4a947)';

  // Network logos as SVG paths
  const nwLogo = (nw, sz) => {
    if (nw === 'visa') return (
      <svg width={sz*2.8} height={sz} viewBox="0 0 28 10" style={{opacity:0.9}}>
        <text x="0" y="9" fill={txtColor} fontSize="11" fontWeight="800" fontStyle="italic" fontFamily="sans-serif" letterSpacing="-0.5">VISA</text>
      </svg>
    );
    if (nw === 'mc') return (
      <svg width={sz*2} height={sz} viewBox="0 0 20 12">
        <circle cx="6" cy="6" r="5.5" fill="#EB001B" opacity="0.85"/>
        <circle cx="14" cy="6" r="5.5" fill="#F79E1B" opacity="0.85"/>
        <rect x="7" y="2" width="6" height="8" rx="0" fill="#FF5F00" opacity="0.7"/>
      </svg>
    );
    if (nw === 'rupay') return (
      <svg width={sz*3} height={sz} viewBox="0 0 30 10" style={{opacity:0.9}}>
        <text x="0" y="9" fill={txtColor} fontSize="8" fontWeight="700" fontFamily="sans-serif">RuPay</text>
      </svg>
    );
    return null;
  };

  // Contactless symbol
  const clessIcon = (sz) => (
    <svg width={sz} height={sz} viewBox="0 0 16 16" style={{opacity:0.6,transform:'rotate(-30deg)'}}>
      <path d="M6 4c2.2 0 4 1.8 4 4" stroke={txtColor} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M6 6.5c.83 0 1.5.67 1.5 1.5" stroke={txtColor} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M6 1.5c3.6 0 6.5 2.9 6.5 6.5" stroke={txtColor} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    </svg>
  );

  return (
    <div style={{
      width: s.w, height: s.h, borderRadius: s.r, flexShrink:0,
      background: `linear-gradient(135deg, ${card.gr[0]}, ${card.gr[1]})`,
      boxShadow: '0 4px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
      position: 'relative', overflow: 'hidden',
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      {/* Subtle pattern overlay */}
      <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,
        background:'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(0,0,0,0.06) 0%, transparent 50%)',
        pointerEvents:'none'
      }}/>

      {/* Bank name - top left */}
      <div style={{position:'absolute',top:s.h*0.08,left:s.w*0.08,
        fontSize:s.bk,fontWeight:700,color:txtColor,letterSpacing:0.2,
        textTransform:'uppercase',lineHeight:1,
        textShadow:isDark?'none':'0 1px 2px rgba(0,0,0,0.2)',
      }}>{card.bk.split(' ')[0]}</div>

      {/* EMV Chip */}
      <div style={{
        position:'absolute',top:s.h*0.38,left:s.w*0.1,
        width:s.chip,height:s.chipH,borderRadius:s.chipH*0.2,
        background:chipGold,
        boxShadow:'0 1px 3px rgba(0,0,0,0.25), inset 0 0 1px rgba(255,255,255,0.5)',
      }}>
        {/* Chip lines */}
        <div style={{position:'absolute',top:'35%',left:'15%',right:'15%',height:1,background:'rgba(0,0,0,0.15)'}}/>
        <div style={{position:'absolute',top:'15%',bottom:'15%',left:'50%',width:1,background:'rgba(0,0,0,0.12)'}}/>
      </div>

      {/* Contactless */}
      <div style={{position:'absolute',top:s.h*0.35,left:s.w*0.1+s.chip+s.w*0.04}}>
        {clessIcon(s.cless)}
      </div>

      {/* Card name - bottom left */}
      <div style={{position:'absolute',bottom:s.h*0.1,left:s.w*0.08,
        fontSize:s.nm,fontWeight:600,color:txtColor,letterSpacing:0.3,
        maxWidth:s.w*0.6,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',
        textShadow:isDark?'none':'0 1px 2px rgba(0,0,0,0.2)',
      }}>{card.nm}</div>

      {/* Network logo - bottom right */}
      <div style={{position:'absolute',bottom:s.h*0.08,right:s.w*0.06}}>
        {nwLogo(card.nw, s.nw)}
      </div>
    </div>
  );
}

/* ═══════════════════════════════
   FAB with periphery popup
   ═══════════════════════════════ */
function FabNav({tab, setTab, c, L}) {
  const [open, setOpen] = useState(false);
  const items = [
    { ...TABS[0], x: -130, y: 130 },
    { ...TABS[1], x: -10,  y: 130 },
    { ...TABS[2], x: -130, y: 20  },
    { ...TABS[3], x: -10,  y: 20  },
  ];
  const fabBottom = L.ph ? 20 : 24;
  const fabRight = L.ph ? 14 : 20;

  return (<>
    {open && <div onClick={()=>setOpen(false)} style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',backdropFilter:'blur(10px)',WebkitBackdropFilter:'blur(10px)',zIndex:900,animation:'co-fadeIn 0.2s ease'}}/>}
    {items.map((item, i) => {
      const isOn = tab === item.id;
      return (
        <button key={item.id} className="co-press"
          onClick={() => { setTab(item.id); setOpen(false); }}
          style={{
            position:'fixed',
            bottom: fabBottom + (open ? item.y : 0),
            right: fabRight - (open ? item.x : 0),
            zIndex:901, width:110, padding:'12px 8px', borderRadius:16,
            border: isOn ? '2px solid #a78bfa' : '1px solid '+c.bh,
            background: isOn ? 'linear-gradient(135deg, rgba(167,139,250,0.3), rgba(129,140,248,0.2))'
              : c.mode==='dark' ? 'rgba(26,14,62,0.93)' : 'rgba(255,255,255,0.93)',
            backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',
            boxShadow: isOn ? '0 4px 24px rgba(167,139,250,0.4)' : '0 4px 20px rgba(0,0,0,0.3)',
            display:'flex',flexDirection:'column',alignItems:'center',gap:6,cursor:'pointer',
            opacity:open?1:0, transform:open?'scale(1)':'scale(0.3)',
            transition:'all 0.35s cubic-bezier(0.34,1.56,0.64,1) '+(open?i*0.05:0)+'s',
            pointerEvents:open?'auto':'none',
          }}>
          <item.Icon size={22} color={isOn?'#a78bfa':(c.mode==='dark'?'rgba(255,255,255,0.7)':'rgba(26,14,62,0.6)')} strokeWidth={isOn?2.5:2}/>
          <span style={{fontSize:12,fontWeight:isOn?700:600,color:isOn?'#a78bfa':(c.mode==='dark'?'rgba(255,255,255,0.8)':'rgba(26,14,62,0.7)'),letterSpacing:0.3}}>{item.nm}</span>
          {isOn && <div style={{position:'absolute',top:6,right:6,width:6,height:6,borderRadius:3,background:'#a78bfa',boxShadow:'0 0 8px rgba(167,139,250,0.6)',animation:'co-glow 2s ease-in-out infinite'}}/>}
        </button>
      );
    })}
    <button onClick={()=>setOpen(!open)} style={{
      position:'fixed',bottom:fabBottom,right:fabRight,zIndex:902,
      width:56,height:56,borderRadius:28,
      background:open?(c.mode==='dark'?'rgba(45,27,105,0.95)':'rgba(240,236,255,0.95)'):'linear-gradient(135deg, #a78bfa, #818cf8)',
      border:open?'2px solid '+c.bh:'none',
      animation:open?'none':'co-fabPulse 3s ease-in-out infinite',
      display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:1,
      cursor:'pointer',transition:'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',padding:0,
    }}>
      {open ? <Plus size={24} color={c.mode==='dark'?'#fff':'#1a0e3e'} strokeWidth={2} style={{transform:'rotate(45deg)',transition:'transform 0.3s'}}/>
      : <><MoreHorizontal size={20} color="#fff" strokeWidth={2.5}/><span style={{fontSize:7,fontWeight:800,color:'rgba(255,255,255,0.9)',letterSpacing:0.8,textTransform:'uppercase',marginTop:-1}}>More</span></>}
    </button>
  </>);
}

/* ══════════ SIDEBAR ══════════ */
function Sidebar({tab,setTab,c}){return(
  <div style={{width:210,flexShrink:0,background:c.tb,borderRight:'1px solid '+c.b,display:'flex',flexDirection:'column',padding:'28px 0',backdropFilter:'blur(20px)'}}>
    <div style={{padding:'0 20px 28px',display:'flex',alignItems:'center',gap:8}}><div style={{width:32,height:32,borderRadius:10,background:'linear-gradient(135deg,#a78bfa,#818cf8)',display:'flex',alignItems:'center',justifyContent:'center'}}><CreditCard size={16} color="#fff"/></div><span style={{fontSize:15,fontWeight:700}}><span style={{color:c.ac}}>Card</span><span style={{opacity:0.4,fontWeight:400}}>Optimizer</span></span></div>
    {TABS.map(t=>(<button key={t.id} className="co-hover-lift" onClick={()=>setTab(t.id)} style={{display:'flex',alignItems:'center',gap:10,padding:'11px 20px',background:tab===t.id?c.acg:'transparent',borderLeft:tab===t.id?'3px solid '+c.ac:'3px solid transparent',border:'none',borderRight:'none',borderTop:'none',borderBottom:'none',cursor:'pointer',width:'100%',boxSizing:'border-box',transition:'all 0.2s'}}><t.Icon size={16} color={tab===t.id?c.ac:c.t2}/><span style={{fontSize:13,fontWeight:tab===t.id?700:500,color:tab===t.id?c.t1:c.t2}}>{t.nm}</span></button>))}
  </div>
);}

/* ══════════ APP ══════════ */
// ═══════════ LIVE OFFERS HOOK ═══════════
function useLiveOffers() {
  const [liveStatus, setStatus] = useState({src:'hardcoded',ts:null,count:OF.length,loading:false,err:null});

  useEffect(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setStatus(s=>({...s,src:'hardcoded',count:OF.length}));
      return;
    }

    let mounted = true;
    const fetchOffers = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const url = `${SUPABASE_URL}/rest/v1/offers?is_active=eq.true&valid_till=gte.${today}&order=platform.asc,offer_value.desc&limit=500`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const res = await fetch(url, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const rows = await res.json();

        // Transform to OF format
        const transformed = rows.map(r => ({
          p: r.platform,
          b: r.bank,
          t: r.offer_type || '%',
          v: Number(r.offer_value) || 0,
          mn: Number(r.min_spend) || 0,
          mx: Number(r.max_discount) || 0,
          tl: r.valid_till,
          d: r.description || `${r.bank} ${r.offer_value}${r.offer_type} off`,
          code: r.promo_code || undefined,
        })).filter(o => o.v > 0);

        if (transformed.length > 0 && mounted) {
          // Merge: live offers take priority, hardcoded fill gaps
          const liveKeys = new Set(transformed.map(o => o.p + '|' + o.b));
          const hardcodedFill = HARDCODED_OF.filter(o => !liveKeys.has(o.p + '|' + o.b));
          OF = [...transformed, ...hardcodedFill];
          setStatus({src:'live',ts:new Date(),count:OF.length,loading:false,err:null});
        } else if (mounted) {
          OF = [...HARDCODED_OF];
          setStatus(s=>({...s,src:'hardcoded',count:OF.length,loading:false}));
        }
      } catch (err) {
        if (mounted) setStatus(s=>({...s,src:'hardcoded',count:OF.length,loading:false,err:err.message}));
      }
    };

    fetchOffers();
    const interval = setInterval(fetchOffers, OFFER_REFRESH_MS);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  return liveStatus;
}

export default function App(){
  useInjectStyles();
  const[mode,setMode]=useState('dark');
  const[tab,setTab]=useState('optimize');
  const[cards,setCards]=useState(AC.map(c=>({...c,owned:DEF.includes(c.id)})));
  const[hist,setHist]=useState([]);
  const[notif,setNotif]=useState(false);
  const[ready,setReady]=useState(false);
  const liveStatus = useLiveOffers();
  const c={...(mode==='dark'?D:LT),mode};
  const L=useL();
  const tog=id=>setCards(p=>p.map(x=>x.id===id?{...x,owned:!x.owned}:x));
  const addH=(cb,a,cid)=>setHist(p=>[{id:Date.now(),dt:new Date().toISOString(),cid,a,pn:cb.pf.n,pi:cb.pf.i,cn:cb.card.nm,ci:cb.card.ic,rw:cb.rw,oa:cb.oa,tot:cb.tot,eff:cb.eff,od:cb.of?.d},...p].slice(0,50));

  useEffect(()=>{const t=setTimeout(()=>setReady(true),800);return()=>clearTimeout(t);},[]);

  if(!ready)return(
    <div style={{width:'100%',height:'100vh',background:mode==='dark'?'#0f0a2a':'#f8f7ff',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:"'Inter',-apple-system,sans-serif",gap:16}}>
      <div style={{width:56,height:56,borderRadius:16,background:'linear-gradient(135deg,#a78bfa,#818cf8)',display:'flex',alignItems:'center',justifyContent:'center',animation:'co-pulse 1.5s ease-in-out infinite',boxShadow:'0 8px 32px rgba(167,139,250,0.3)'}}>
        <CreditCard size={28} color="#fff"/>
      </div>
      <div style={{fontSize:20,fontWeight:800,letterSpacing:-0.5,color:mode==='dark'?'#fff':'#1a0e3e'}}><span style={{color:'#a78bfa'}}>Card</span><span style={{opacity:0.5}}>Optimizer</span></div>
      <div style={{fontSize:13,color:mode==='dark'?'rgba(255,255,255,0.4)':'rgba(0,0,0,0.4)'}}>Finding the best deals for you…</div>
    </div>
  );

  const content=(<div style={{maxWidth:L.sb?undefined:L.mx,margin:L.sb?0:'0 auto',padding:L.sb?'28px '+L.px+'px 40px':'0 '+L.px+'px 20px'}}>
    <div key={tab} style={{animation:'co-fadeUp 0.3s ease-out'}}>
      {tab==='optimize'&&<Opt c={c} cards={cards} addH={addH} L={L} liveStatus={liveStatus} setTab={setTab}/>}
      {tab==='cards'&&<Cards c={c} cards={cards} tog={tog} L={L}/>}
      {tab==='history'&&<Hist c={c} hist={hist} setHist={setHist} L={L}/>}
      {tab==='settings'&&<Sett c={c} mode={mode} setMode={setMode} notif={notif} setNotif={setNotif} L={L} liveStatus={liveStatus}/>}
    </div>
  </div>);

  if(L.sb)return(<div style={{width:'100%',height:'100vh',display:'flex',background:c.bg,fontFamily:"'Inter',-apple-system,sans-serif",color:c.t1,overflow:'hidden'}}><Sidebar tab={tab} setTab={setTab} c={c}/><div style={{flex:1,overflow:'auto'}}>{content}</div></div>);

  return(
    <div style={{width:'100%',minHeight:'100vh',background:c.bg,fontFamily:"'Inter',-apple-system,sans-serif",color:c.t1,paddingBottom:90}}>
      <div style={{height:L.ph?20:12}}/>
      {content}
      <FabNav tab={tab} setTab={setTab} c={c} L={L}/>
    </div>
  );
}

/* ══════════ OPTIMIZE TAB ══════════ */
function Opt({c,cards,addH,L,liveStatus,setTab}){
  const[optMode,setOptMode]=useState('single');
  const[catId,sC]=useState(null);
  const[amt,sA]=useState('');
  const[pill,sP]=useState(null);
  const[rtab,sR]=useState('owned');
  const[exp,sE]=useState(null);
  const[saved,sS]=useState(null);
  const[focused,sF]=useState(false);
  const resRef=useRef(null);
  const cat=SC.find(x=>x.id===catId);
  const ams=cat?cat.am:[1000,5000,10000,50000];
  const v=parseInt(amt)||0;
  const combos=useMemo(()=>v>0&&catId?cAll(catId,v,cards):[],[catId,v,cards]);
  const ow=combos.filter(x=>x.owned),bO=ow[0]||null,bA=combos[0]||null;
  const gap=bO&&bA&&!bA.owned?bA.tot-bO.tot:0;
  const owP=bP(ow),allP=bP(combos);
  const hasRes=combos.length>0&&v>0;
  const pCat=id=>{sC(id);sA('');sP(null);sR('owned');sE(null);sS(null);};
  const doSv=cb=>{addH(cb,v,catId);sS(cb.pid);setTimeout(()=>sS(null),2500);};

  // Scroll to results when they appear
  const prevHasRes = useRef(false);
  useEffect(()=>{
    if(hasRes && !prevHasRes.current && resRef.current){
      setTimeout(()=>resRef.current?.scrollIntoView({behavior:'smooth',block:'start'}),100);
    }
    prevHasRes.current = hasRes;
  },[hasRes]);

  return(<div>
    {/* Hero header with animated gradient */}
    <div style={{textAlign:'center',padding:L.dk?'16px 0 32px':'20px 0 24px'}}>
      <div style={{display:'inline-flex',alignItems:'center',gap:6,background:c.cb,border:'1px solid '+c.cbd,padding:'6px 14px',borderRadius:20,fontSize:L.fs.sm,color:c.ct,fontWeight:600,marginBottom:L.dk?20:16}}>
        <Sparkles size={14} style={{animation:'co-pulse 2s ease-in-out infinite'}}/> Smart Savings
      </div>
      {/* Live data indicator */}
      <div style={{display:'flex',justifyContent:'center',marginBottom:8}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:5,padding:'3px 10px',borderRadius:12,fontSize:L.fs.xs,fontWeight:600,
          background:liveStatus?.src==='live'?'rgba(52,211,153,0.12)':liveStatus?.src==='hardcoded'?'rgba(251,191,36,0.12)':'rgba(167,139,250,0.12)',
          color:liveStatus?.src==='live'?c.g:liveStatus?.src==='hardcoded'?c.a:c.ac,
        }}>
          <div style={{width:6,height:6,borderRadius:3,
            background:liveStatus?.src==='live'?c.g:liveStatus?.src==='hardcoded'?c.a:c.ac,
            animation:liveStatus?.loading?'co-pulse 1s infinite':'none',
          }}/>
          {liveStatus?.src==='live'?`${liveStatus.count} live offers`:OF.length>0?`${OF.length} offers`:'Card rewards only'}
        </div>
      </div>
      <div style={{fontSize:L.fs.h,fontWeight:800,letterSpacing:-2,lineHeight:1.05,marginBottom:8}}>maximize<br/>
        <span style={{background:'linear-gradient(135deg,#a78bfa,#818cf8,#34d399,#a78bfa)',backgroundSize:'300% 300%',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',animation:'co-gradShift 6s ease infinite'}}>every rupee</span>
      </div>
      <div style={{fontSize:L.fs.md,color:c.t2,lineHeight:1.5}}>Best card + platform combo for any purchase</div>
    </div>

    {/* Mode Toggle: Single vs Batch */}
    <div style={{display:'flex',gap:0,marginBottom:20,background:c.s,borderRadius:12,padding:3,border:'1px solid '+c.b}}>
      {[{id:'single',nm:'Single',Icon:Zap,desc:'One purchase'},{id:'batch',nm:'Batch',Icon:Layers,desc:'Multiple purchases'}].map(m=>(
        <button key={m.id} className="co-press" onClick={()=>setOptMode(m.id)} style={{
          flex:1,padding:'10px 8px',borderRadius:10,border:'none',
          background:optMode===m.id?c.acg:'transparent',
          color:optMode===m.id?c.ac:c.t3,
          fontSize:L.fs.sm,fontWeight:optMode===m.id?700:500,cursor:'pointer',fontFamily:'inherit',
          transition:'all 0.25s',display:'flex',alignItems:'center',justifyContent:'center',gap:6,
          boxShadow:optMode===m.id?'0 2px 8px rgba(167,139,250,0.15)':'none',
        }}>
          <m.Icon size={14}/>{m.nm}
          {!L.ph&&<span style={{fontSize:L.fs.xs-1,opacity:0.6}}>({m.desc})</span>}
        </button>
      ))}
    </div>

    {optMode==='batch'?(
      <BatchOpt c={c} cards={cards} addH={addH} L={L} setTab={setTab}/>
    ):(
    <>
        <CatG catId={catId} pCat={pCat} c={c} L={L}/>
        <div style={{height:20}}/>
        {catId&&<AmtI amt={amt} sA={sA} pill={pill} sP={sP} ams={ams} c={c} L={L} ok focused={focused} sF={sF}/>}
        {catId&&!hasRes&&amt===''&&<div style={{textAlign:'center',padding:'30px 0',animation:'co-fadeUp 0.3s ease'}}>
          <div style={{fontSize:40,marginBottom:8}}>☝️</div>
          <div style={{fontSize:L.fs.md,color:c.t3,lineHeight:1.5}}>Enter an amount to see the best card + platform combo</div>
        </div>}
        {hasRes&&<div ref={resRef}>
          {cat?.isFuel?<FuelAdvisor combos={combos} v={v} cards={cards} c={c} L={L} addH={addH} catId={catId}/>
          :<Res rtab={rtab} sR={sR} exp={exp} sE={sE} saved={saved} doSv={doSv} bO={bO} owP={owP} allP={allP} gap={gap} v={v} c={c} L={L} goCards={()=>setTab("cards")}/>}
        </div>}
    </>)}
  </div>);
}

/* ══════════ CATEGORY GRID ══════════ */
function CatG({catId,pCat,c,L}){
  return(<div>
    <div style={{fontSize:L.fs.xs+1,fontWeight:600,color:c.t3,letterSpacing:0.8,marginBottom:12,display:'flex',alignItems:'center',gap:6}}>
      WHAT ARE YOU BUYING?
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat('+L.cat+',1fr)',gap:L.g}}>
      {SC.map((x,idx)=>{
        const on=catId===x.id;
        return(
          <button key={x.id} className="co-hover-lift" onClick={()=>pCat(x.id)} style={{
            background:on?c.acg:c.s,
            border:'1.5px solid '+(on?c.acb:c.b),
            borderRadius:L.r,
            padding:L.dk?'12px 4px':L.ph&&L.w<360?'10px 4px':'14px 6px',
            cursor:'pointer',textAlign:'center',
            transition:'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            boxShadow:on?'0 0 24px rgba(167,139,250,0.15),inset 0 0 20px rgba(167,139,250,0.05)':'none',
            animation: on ? 'none' : undefined,
          }}>
            <div style={{fontSize:L.dk?20:L.ph&&L.w<360?18:24,marginBottom:L.dk?3:5,transition:'transform 0.3s',transform:on?'scale(1.15)':'scale(1)'}}>{x.ic}</div>
            <div style={{fontSize:L.fs.xs+1,fontWeight:on?700:600,color:on?c.ac:c.t2,transition:'all 0.2s'}}>{x.nm}</div>
            <div style={{fontSize:L.fs.xs-1,color:c.t3,marginTop:2}}>{x.pf.length} platforms</div>
          </button>
        );
      })}
    </div>
  </div>);
}

/* ══════════ AMOUNT INPUT ══════════ */
function AmtI({amt,sA,pill,sP,ams,c,L,ok,focused,sF}){
  if(!ok)return null;
  return(
    <div style={{marginBottom:24,animation:'co-fadeUp 0.3s ease-out'}}>
      <div style={{fontSize:L.fs.xs+1,fontWeight:600,color:c.t3,letterSpacing:0.8,marginBottom:12}}>HOW MUCH?</div>
      <div style={{
        background:c.s,
        border:'1.5px solid '+(focused?c.ac:c.b),
        borderRadius:L.r,padding:'6px 16px',
        height:L.dk?50:54,display:'flex',alignItems:'center',gap:8,marginBottom:12,
        transition:'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        boxShadow:focused?'0 0 0 4px '+c.acg:'none',
      }}>
        <span style={{fontSize:L.dk?20:22,fontWeight:700,color:focused?c.ac:c.t3,transition:'color 0.3s'}}>₹</span>
        <input type="text" inputMode="numeric" pattern="[0-9]*" value={amt}
          onChange={e=>{const v=e.target.value.replace(/[^0-9]/g,'');sA(v);sP(null);}}
          onFocus={()=>sF(true)} onBlur={()=>sF(false)}
          placeholder="Enter amount"
          style={{flex:1,background:'none',border:'none',outline:'none',color:c.t1,fontSize:L.dk?22:L.ph&&L.w<360?20:26,fontWeight:700,fontFamily:'inherit',letterSpacing:-0.5,width:'100%',minWidth:0}}
        />
      </div>
      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
        {ams.map(a=>
          <button key={a} className="co-press" onClick={()=>{sA(String(a));sP(a);}} style={{
            flex:L.dk?'none':'1',minWidth:L.dk?60:0,
            padding:(L.ph?8:10)+'px '+(L.dk?14:0)+'px',
            borderRadius:10,
            background:pill===a?c.acg:c.s,
            border:'1.5px solid '+(pill===a?c.acb:c.b),
            color:pill===a?c.ac:c.t2,
            fontSize:L.fs.md,fontWeight:600,cursor:'pointer',fontFamily:'inherit',
            transition:'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
            boxShadow:pill===a?'0 0 16px rgba(167,139,250,0.15)':'none',
          }}>{fm(a)}</button>
        )}
      </div>
    </div>
  );
}

/* ══════════ FUEL ADVISOR ══════════ */
function FuelAdvisor({combos,v,cards,c,L,addH,catId}){
  const pumps=['indian-oil','bpcl','hp-petrol','nayara','jio-bp','reliance-petrol','shell'];
  const pumpColors={'indian-oil':['#1565c0','#42a5f5'],'bpcl':['#e65100','#ffa000'],'hp-petrol':['#2e7d32','#66bb6a'],'nayara':['#6a1b9a','#ab47bc'],'jio-bp':['#00695c','#26a69a'],'reliance-petrol':['#1a237e','#5c6bc0'],'shell':['#c62828','#ef5350']};
  const pumpBrands={'indian-oil':'IndianOil (IOCL)','bpcl':'Bharat Petroleum (BPCL)','hp-petrol':'Hindustan Petroleum (HPCL)','nayara':'Nayara Energy','jio-bp':'Jio-bp (Reliance+BP)','reliance-petrol':'Reliance Petroleum','shell':'Shell India'};
  const pumpInfo={'indian-oil':{stations:'37,500+',share:'43%',note:'Largest network. XtraPremium 95 RON available.'},'bpcl':{stations:'21,800+',share:'25%',note:'Speed 97 premium fuel. FuelKart doorstep diesel.'},'hp-petrol':{stations:'15,000+',share:'18%',note:'Power 99 (highest octane in India). poWer 99 available at select pumps.'},'nayara':{stations:'6,600+',share:'8%',note:'Largest private network. Formerly Essar Oil. No co-branded card — use generic cashback cards.'},'jio-bp':{stations:'1,500+',share:'2%',note:'Modern stations. ACTIVE Technology fuel for better mileage. Has co-branded IndusInd card.'},'reliance-petrol':{stations:'1,459',share:'2%',note:'Legacy Reliance stations (pre Jio-bp). Highway-focused. High-speed dispensers. Use Reliance SBI card for 10X points at Reliance Retail.'},'shell':{stations:'350+',share:'<1%',note:'Premium pricing (~5-10% higher). V-Power 95/97 RON. South/West India mainly.'}};
  const pumpType={'indian-oil':'PSU','bpcl':'PSU','hp-petrol':'PSU','nayara':'Private','jio-bp':'Private','reliance-petrol':'Private','shell':'Private'};

  const pumpData=pumps.map(pid=>{
    const pc=combos.filter(x=>x.pid===pid);
    const ownedBest=pc.filter(x=>x.owned).sort((a,b)=>b.tot-a.tot)[0];
    const overallBest=pc.sort((a,b)=>b.tot-a.tot)[0];
    const fuelCard=overallBest?.card?.fl;
    const ownedFuelCard=ownedBest?.card?.fl;
    // Standard surcharge waiver for non-fuel cards
    const swSave=v>=400&&v<=4000?Math.min(v*0.01,100):0;
    return {pid,ownedBest,overallBest,fuelCard,ownedFuelCard,swSave,pc};
  }).sort((a,b)=>(b.ownedBest?.tot||0)-(a.ownedBest?.tot||0));

  const best=pumpData[0];
  const bestTot=best?.ownedBest?.tot||0;
  const bestSwSave=best?.ownedFuelCard?Math.min(v*0.01,best.ownedFuelCard.swCap):best?.swSave||0;
  const totalWithSw=bestTot+bestSwSave;

  const [expPump,setExpPump]=useState(null);
  const [savedId,setSaved]=useState(null);
  const doSv=(cb)=>{addH(cb,v,catId);setSaved(cb.pid);setTimeout(()=>setSaved(null),2500);};

  return(<div style={{animation:'co-fadeUp 0.4s ease-out'}}>
    {/* Hero recommendation */}
    {best?.ownedBest&&(<div style={{
      background:`linear-gradient(135deg,${pumpColors[best.pid][0]},${pumpColors[best.pid][1]})`,
      borderRadius:L.r+4,padding:L.dk?'24px 28px':'20px 18px',marginBottom:20,position:'relative',overflow:'hidden',
      animation:'co-breathe 4s ease-in-out infinite',
    }}>
      <div style={{position:'absolute',top:0,right:0,bottom:0,width:'40%',opacity:0.08,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <Fuel size={120} strokeWidth={1}/>
      </div>
      <div style={{position:'relative',zIndex:1}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
          <div style={{background:'rgba(255,255,255,0.2)',borderRadius:8,padding:'4px 10px',fontSize:L.fs.xs,fontWeight:700,color:'#fff',display:'flex',alignItems:'center',gap:4}}>
            <Award size={12}/> BEST FUEL STRATEGY
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
          <MapPin size={18} color="rgba(255,255,255,0.9)"/>
          <span style={{fontSize:L.fs.lg,fontWeight:800,color:'#fff'}}>Visit {pumpBrands[best.pid]}</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
          <CardVisual card={best.ownedBest.card} size="lg" c={c}/>
          <div>
            <div style={{fontSize:L.fs.xs,color:'rgba(255,255,255,0.7)'}}>Pay with</div>
            <div style={{fontSize:L.fs.md+1,fontWeight:700,color:'#fff'}}>{best.ownedBest.card.nm}</div>
            <div style={{fontSize:L.fs.sm,color:'rgba(255,255,255,0.85)'}}>{best.ownedBest.card.bk}</div>
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
          <div style={{background:'rgba(255,255,255,0.15)',borderRadius:10,padding:'10px 12px',textAlign:'center',backdropFilter:'blur(10px)'}}>
            <div style={{fontSize:L.fs.xs,color:'rgba(255,255,255,0.7)',marginBottom:2}}>Card Rewards</div>
            <div style={{fontSize:L.fs.lg,fontWeight:800,color:'#fff'}}>₹{Math.round(best.ownedBest.rw)}</div>
            <div style={{fontSize:L.fs.xs-1,color:'rgba(255,255,255,0.6)'}}>{(gR(best.ownedBest.card,best.pid)*100).toFixed(1)}% back</div>
          </div>
          <div style={{background:'rgba(255,255,255,0.15)',borderRadius:10,padding:'10px 12px',textAlign:'center',backdropFilter:'blur(10px)'}}>
            <div style={{fontSize:L.fs.xs,color:'rgba(255,255,255,0.7)',marginBottom:2}}>Surcharge Saved</div>
            <div style={{fontSize:L.fs.lg,fontWeight:800,color:'#fff'}}>₹{Math.round(bestSwSave)}</div>
            <div style={{fontSize:L.fs.xs-1,color:'rgba(255,255,255,0.6)'}}>1% waiver</div>
          </div>
          <div style={{background:'rgba(255,255,255,0.25)',borderRadius:10,padding:'10px 12px',textAlign:'center',backdropFilter:'blur(10px)'}}>
            <div style={{fontSize:L.fs.xs,color:'rgba(255,255,255,0.7)',marginBottom:2}}>Total Saved</div>
            <div style={{fontSize:L.fs.lg+2,fontWeight:800,color:'#fff'}}>₹{Math.round(totalWithSw)}</div>
            <div style={{fontSize:L.fs.xs-1,color:'rgba(255,255,255,0.6)'}}>on ₹{fm(v)}</div>
          </div>
        </div>

        {best.ownedFuelCard?.tip&&(
          <div style={{marginTop:14,display:'flex',alignItems:'flex-start',gap:8,background:'rgba(255,255,255,0.12)',borderRadius:10,padding:'10px 14px'}}>
            <Info size={14} color="rgba(255,255,255,0.8)" style={{marginTop:2,flexShrink:0}}/>
            <div style={{fontSize:L.fs.xs+1,color:'rgba(255,255,255,0.9)',lineHeight:1.5}}>{best.ownedFuelCard.tip}</div>
          </div>
        )}
      </div>
    </div>)}

    {/* Surcharge waiver explainer */}
    <div style={{background:c.s,border:'1px solid '+c.b,borderRadius:L.r,padding:'14px 16px',marginBottom:20,display:'flex',alignItems:'flex-start',gap:10}}>
      <Shield size={18} color={c.ac} style={{marginTop:2,flexShrink:0}}/>
      <div>
        <div style={{fontSize:L.fs.md,fontWeight:700,color:c.t1,marginBottom:4}}>Fuel Surcharge Waiver</div>
        <div style={{fontSize:L.fs.xs+1,color:c.t2,lineHeight:1.6}}>
          Credit cards charge ~1% surcharge on fuel at all pumps (IOCL, BPCL, HPCL, Nayara, Jio-bp, Shell). Most cards waive this for ₹400–₹4,000 transactions. Co-branded cards (BPCL SBI, IndianOil Axis, Jio-bp IndusInd) offer higher rewards at their specific pumps. For private pumps without co-branded cards, use flat cashback cards.
        </div>
      </div>
    </div>

    {/* All 3 pump options */}
    <div style={{fontSize:L.fs.xs+1,fontWeight:600,color:c.t3,letterSpacing:0.8,marginBottom:12,display:'flex',alignItems:'center',gap:6}}>
      <Fuel size={14} color={c.ac}/> ALL PUMP OPTIONS — RANKED BY YOUR SAVINGS
    </div>

    {pumpData.map((pd,idx)=>{
      const isExp=expPump===pd.pid;
      const ob=pd.ownedBest;
      const ub=pd.overallBest;
      const isBest=idx===0;
      const sw=pd.ownedFuelCard?Math.min(v*0.01,pd.ownedFuelCard.swCap):pd.swSave;
      const cols=pumpColors[pd.pid];
      const hasUpgrade=ub&&ob&&ub.card.id!==ob.card.id&&ub.tot>ob.tot;

      return(<div key={pd.pid} style={{
        background:c.s,border:'1.5px solid '+(isBest?cols[1]+'66':c.b),borderRadius:L.r,
        marginBottom:12,overflow:'hidden',transition:'all 0.3s',
        animation:`co-fadeUp ${0.3+idx*0.08}s ease-out both`,
        boxShadow:isBest?`0 0 20px ${cols[0]}22`:'none',
      }}>
        {/* Pump header */}
        <button onClick={()=>setExpPump(isExp?null:pd.pid)} style={{
          width:'100%',padding:'14px 16px',cursor:'pointer',background:'none',border:'none',
          display:'flex',alignItems:'center',gap:12,textAlign:'left',fontFamily:'inherit',
        }}>
          <div style={{width:42,height:42,borderRadius:12,background:`linear-gradient(135deg,${cols[0]},${cols[1]})`,
            display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <Fuel size={20} color="#fff"/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span style={{fontSize:L.fs.md+1,fontWeight:700,color:c.t1}}>{PL[pd.pid].n}</span>
              {isBest&&<span style={{fontSize:L.fs.xs-1,fontWeight:700,background:`linear-gradient(135deg,${cols[0]},${cols[1]})`,color:'#fff',padding:'2px 8px',borderRadius:6}}>BEST</span>}
              <span style={{fontSize:L.fs.xs-1,fontWeight:600,background:pumpType[pd.pid]==='PSU'?'rgba(33,150,243,0.12)':'rgba(255,152,0,0.12)',color:pumpType[pd.pid]==='PSU'?'#1976d2':'#e65100',padding:'2px 6px',borderRadius:4}}>{pumpType[pd.pid]}</span>
            </div>
            {ob&&<div style={{fontSize:L.fs.xs+1,color:c.t2,marginTop:2}}>
              {ob.card.ic} {ob.card.nm} · <span style={{color:cols[1],fontWeight:700}}>{(gR(ob.card,pd.pid)*100).toFixed(1)}% rewards</span>
              {sw>0&&<span style={{color:c.g}}> + ₹{Math.round(sw)} surcharge saved</span>}
            </div>}
            <div style={{fontSize:L.fs.xs-1,color:c.t3,marginTop:1}}>{pumpInfo[pd.pid]?.stations} stations</div>
          </div>
          <div style={{textAlign:'right',flexShrink:0}}>
            {ob&&<div style={{fontSize:L.fs.md+2,fontWeight:800,color:cols[1]}}>₹{Math.round(ob.tot+sw)}</div>}
            <div style={{fontSize:L.fs.xs,color:c.t3}}>saved</div>
          </div>
          <div style={{transition:'transform 0.3s',transform:isExp?'rotate(180deg)':'rotate(0deg)'}}>
            <ChevronDown size={18} color={c.t3}/>
          </div>
        </button>

        {/* Expanded details */}
        {isExp&&(<div style={{padding:'0 16px 16px',borderTop:'1px solid '+c.b,paddingTop:14,animation:'co-fadeUp 0.25s ease-out'}}>
          {ob&&(<>
            {/* Breakdown */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:14}}>
              <div style={{background:c.acg,borderRadius:8,padding:'8px 10px',textAlign:'center'}}>
                <div style={{fontSize:L.fs.xs,color:c.t3}}>Rewards</div>
                <div style={{fontSize:L.fs.md,fontWeight:700,color:c.ac}}>₹{Math.round(ob.rw)}</div>
              </div>
              {ob.oa>0&&<div style={{background:c.gg,borderRadius:8,padding:'8px 10px',textAlign:'center'}}>
                <div style={{fontSize:L.fs.xs,color:c.t3}}>Offer</div>
                <div style={{fontSize:L.fs.md,fontWeight:700,color:c.g}}>₹{Math.round(ob.oa)}</div>
              </div>}
              <div style={{background:'rgba(59,130,246,0.1)',borderRadius:8,padding:'8px 10px',textAlign:'center'}}>
                <div style={{fontSize:L.fs.xs,color:c.t3}}>Surcharge</div>
                <div style={{fontSize:L.fs.md,fontWeight:700,color:'#3b82f6'}}>₹{Math.round(sw)}</div>
              </div>
            </div>

            {/* Card details */}
            <div style={{background:c.mode==='dark'?'rgba(255,255,255,0.03)':'rgba(0,0,0,0.02)',borderRadius:10,padding:'10px 14px',marginBottom:10}}>
              <div style={{fontSize:L.fs.xs,fontWeight:600,color:c.t3,marginBottom:8}}>CARD TO USE</div>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <CardVisual card={ob.card} size="lg" c={c}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:L.fs.md,fontWeight:700,color:c.t1}}>{ob.card.nm}</div>
                  <div style={{fontSize:L.fs.sm,color:c.t2,marginTop:2}}>{ob.card.bk}</div>
                  <div style={{fontSize:L.fs.xs+1,color:c.t2,marginTop:4}}>
                    {pd.ownedFuelCard?pd.ownedFuelCard.pts:`${(gR(ob.card,pd.pid)*100).toFixed(1)}% cashback/rewards`}
                  </div>
                  <div style={{fontSize:L.fs.xs,color:c.t3,marginTop:2}}>
                    Surcharge waiver up to ₹{pd.ownedFuelCard?pd.ownedFuelCard.swCap:'100'}/month
                  </div>
                </div>
              </div>
            </div>

            {/* Fuel tip */}
            {pd.ownedFuelCard?.tip&&(
              <div style={{display:'flex',alignItems:'flex-start',gap:8,background:c.acg,borderRadius:8,padding:'8px 12px',marginBottom:10}}>
                <Star size={12} color={c.ac} style={{marginTop:3,flexShrink:0}}/>
                <div style={{fontSize:L.fs.xs+1,color:c.ac,lineHeight:1.5,fontWeight:500}}>{pd.ownedFuelCard.tip}</div>
              </div>
            )}

            {/* Pump network info */}
            {pumpInfo[pd.pid]&&(
              <div style={{background:c.mode==='dark'?'rgba(255,255,255,0.03)':'rgba(0,0,0,0.02)',borderRadius:10,padding:'10px 14px',marginBottom:10}}>
                <div style={{fontSize:L.fs.xs,fontWeight:600,color:c.t3,marginBottom:6}}>ABOUT THIS PUMP NETWORK</div>
                <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:6}}>
                  <div style={{fontSize:L.fs.xs+1,color:c.t2}}><span style={{fontWeight:700,color:c.t1}}>{pumpInfo[pd.pid].stations}</span> stations</div>
                  <div style={{fontSize:L.fs.xs+1,color:c.t2}}><span style={{fontWeight:700,color:c.t1}}>{pumpInfo[pd.pid].share}</span> market share</div>
                  <div style={{fontSize:L.fs.xs+1,fontWeight:600,color:pumpType[pd.pid]==='PSU'?'#1976d2':'#e65100'}}>{pumpType[pd.pid]==='PSU'?'🏛️ Government (PSU)':'🏢 Private'}</div>
                </div>
                <div style={{fontSize:L.fs.xs+1,color:c.t2,lineHeight:1.5}}>{pumpInfo[pd.pid].note}</div>
              </div>
            )}

            {/* Surcharge waiver range note */}
            <div style={{fontSize:L.fs.xs,color:c.t3,lineHeight:1.5,display:'flex',alignItems:'flex-start',gap:6}}>
              <Info size={12} style={{marginTop:2,flexShrink:0}}/>
              Surcharge waiver valid for transactions ₹{pd.ownedFuelCard?.swMin||400} – ₹{pd.ownedFuelCard?.swMax||4000}. Split large fills into multiple transactions to maximize waiver.
            </div>
          </>)}

          {/* Upgrade suggestion */}
          {hasUpgrade&&(<div style={{marginTop:14,background:`linear-gradient(135deg,${cols[0]}11,${cols[1]}11)`,border:'1px dashed '+cols[1]+'44',borderRadius:10,padding:'12px 14px'}}>
            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:6}}>
              <TrendingUp size={14} color={cols[1]}/>
              <span style={{fontSize:L.fs.xs+1,fontWeight:700,color:cols[1]}}>GET MORE WITH {ub.card.nm.toUpperCase()}</span>
            </div>
            <div style={{fontSize:L.fs.xs+1,color:c.t2,lineHeight:1.5}}>
              {ub.card.ic} {ub.card.nm} ({ub.card.bk}) gives <span style={{fontWeight:700,color:cols[1]}}>{(gR(ub.card,pd.pid)*100).toFixed(1)}% rewards</span> at {PL[pd.pid].n} — 
              save <span style={{fontWeight:700,color:c.g}}>₹{Math.round(ub.tot-ob.tot)} more</span> per transaction.
              {ub.card.fe>0&&<span style={{color:c.t3}}> Annual fee: ₹{ub.card.fe}{ub.card.wv?' (waived on '+ub.card.wv+')':''}</span>}
            </div>
            <a href={ub.card.u} target="_blank" rel="noopener noreferrer" className="co-hover-lift" style={{
              display:'inline-flex',alignItems:'center',gap:4,marginTop:8,padding:'6px 14px',
              borderRadius:8,background:`linear-gradient(135deg,${cols[0]},${cols[1]})`,color:'#fff',
              fontSize:L.fs.xs+1,fontWeight:600,textDecoration:'none',
            }}>Apply Now <ExternalLink size={12}/></a>
          </div>)}

          {/* Save button */}
          {ob&&(<button className="co-hover-lift" onClick={()=>doSv(ob)} style={{
            width:'100%',marginTop:12,padding:'10px',borderRadius:10,border:'1.5px solid '+c.b,
            background:savedId===pd.pid?c.gg:c.s,cursor:'pointer',fontFamily:'inherit',
            fontSize:L.fs.md,fontWeight:600,color:savedId===pd.pid?c.g:c.t2,
            display:'flex',alignItems:'center',justifyContent:'center',gap:6,transition:'all 0.3s',
          }}>{savedId===pd.pid?<><Check size={16}/>Saved!</>:<>Save to History</>}</button>)}
        </div>)}
      </div>);
    })}

    {/* Fuel tips section */}
    <div style={{background:c.s,border:'1px solid '+c.b,borderRadius:L.r,padding:'16px',marginTop:8}}>
      <div style={{fontSize:L.fs.md,fontWeight:700,color:c.t1,marginBottom:10,display:'flex',alignItems:'center',gap:6}}>
        <Sparkles size={16} color={c.ac}/> Pro Fuel Tips
      </div>
      {[
        'Always swipe your card — UPI/Google Pay won\'t earn card rewards or surcharge waiver.',
        'Split ₹5,000+ fills into 2 transactions to stay within surcharge waiver limits (₹400–₹4,000).',
        'Co-branded fuel cards (BPCL SBI, IndianOil Axis, Jio-bp IndusInd) earn 4–7.5% vs ~1% on regular cards.',
        'For private pumps (Nayara, Shell), use flat cashback cards like SBI Cashback (5%) or OneCard (5%) — co-branded PSU cards won\'t give bonus rates there.',
        'Fuel surcharge ~1% is charged at ALL pumps (PSU + Private). Most cards waive this for ₹400–₹4,000 transactions.',
        'Jio-bp is the only private pump with a co-branded card (IndusInd, 4% Smiles). Nayara & Shell have none.',
        'Check if your pump has the right branded terminal — IOCL RBL rewards only work on IOCL machines.',
      ].map((tip,i)=>(
        <div key={i} style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:i<6?8:0}}>
          <div style={{width:18,height:18,borderRadius:5,background:c.acg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}>
            <span style={{fontSize:10,fontWeight:800,color:c.ac}}>{i+1}</span>
          </div>
          <div style={{fontSize:L.fs.xs+1,color:c.t2,lineHeight:1.5}}>{tip}</div>
        </div>
      ))}
    </div>
  </div>);
}

/* ══════════ BATCH OPTIMIZER ══════════ */
function BatchOpt({c,cards,addH,L,setTab}){
  const[rows,setRows]=useState([{id:1,catId:'',amt:''}]);
  const[results,setResults]=useState(null);
  const nxt=useRef(2);
  const addRow=()=>{setRows(p=>[...p,{id:nxt.current++,catId:'',amt:''}]);setResults(null);};
  const delRow=id=>{setRows(p=>p.filter(r=>r.id!==id));setResults(null);};
  const updRow=(id,k,v)=>{setRows(p=>p.map(r=>r.id===id?{...r,[k]:v}:r));setResults(null);};
  const ownedCards=cards.filter(x=>x.owned);

  const calculate=()=>{
    const res=rows.filter(r=>r.catId&&parseInt(r.amt)>0).map(r=>{
      const cat=SC.find(x=>x.id===r.catId);
      const v=parseInt(r.amt);
      const combos=v>0&&r.catId?cAll(r.catId,v,cards):[];
      const ow=combos.filter(x=>x.owned);
      const best=ow[0]||null;
      return{...r,cat,v,best,allBest:combos[0]||null};
    });
    setResults(res);
  };

  const totalSaved=results?results.reduce((s,r)=>s+(r.best?.tot||0),0):0;
  const totalSpent=results?results.reduce((s,r)=>s+r.v,0):0;
  const valid=rows.some(r=>r.catId&&parseInt(r.amt)>0);

  return(<div style={{animation:'co-fadeUp 0.4s ease-out'}}>
    <div style={{fontSize:L.fs.xs+1,fontWeight:600,color:c.t3,letterSpacing:0.8,marginBottom:12,display:'flex',alignItems:'center',gap:6}}>
      <Layers size={13}/> ADD YOUR PURCHASES
    </div>

    {rows.map((row,ri)=>(
      <div key={row.id} style={{display:'flex',gap:8,marginBottom:10,animation:'co-fadeUp 0.25s ease '+(ri*0.05)+'s both'}}>
        <select value={row.catId} onChange={e=>updRow(row.id,'catId',e.target.value)}
          style={{flex:1,padding:'10px 12px',borderRadius:10,background:c.s,border:'1.5px solid '+c.b,color:c.t1,fontSize:L.fs.sm,fontFamily:'inherit',appearance:'none',cursor:'pointer',outline:'none'}}>
          <option value="">Category…</option>
          {SC.filter(x=>!x.isFuel).map(x=><option key={x.id} value={x.id}>{x.ic} {x.nm}</option>)}
        </select>
        <div style={{position:'relative',flex:0.6}}>
          <span style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',fontSize:L.fs.sm,fontWeight:700,color:c.t3}}>₹</span>
          <input type="text" inputMode="numeric" pattern="[0-9]*" value={row.amt}
            onChange={e=>updRow(row.id,'amt',e.target.value.replace(/[^0-9]/g,''))}
            placeholder="Amount"
            style={{width:'100%',padding:'10px 10px 10px 24px',borderRadius:10,background:c.s,border:'1.5px solid '+c.b,color:c.t1,fontSize:L.fs.sm,fontWeight:600,fontFamily:'inherit',outline:'none',boxSizing:'border-box'}}
          />
        </div>
        {rows.length>1&&(
          <button className="co-press" onClick={()=>delRow(row.id)} style={{width:36,height:40,borderRadius:10,border:'1px solid '+c.b,background:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <X size={14} color={c.lv}/>
          </button>
        )}
      </div>
    ))}

    <div style={{display:'flex',gap:10,marginBottom:24}}>
      <button className="co-hover-lift" onClick={addRow} style={{flex:1,padding:'10px',borderRadius:10,border:'1.5px dashed '+c.b,background:'none',color:c.t3,fontSize:L.fs.sm,fontWeight:600,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
        <Plus size={14}/> Add Purchase
      </button>
      <button className="co-hover-lift" onClick={calculate} disabled={!valid} style={{flex:1,padding:'10px',borderRadius:10,border:'none',background:valid?'linear-gradient(135deg,'+c.ac+',#818cf8)':'rgba(128,128,128,0.2)',color:valid?'#fff':c.t3,fontSize:L.fs.sm,fontWeight:700,cursor:valid?'pointer':'not-allowed',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:6,boxShadow:valid?'0 4px 16px rgba(167,139,250,0.3)':'none'}}>
        <Zap size={14}/> Calculate All
      </button>
    </div>

    {results&&(
      <div style={{animation:'co-fadeUp 0.35s ease'}}>
        {/* Total summary */}
        <div style={{background:c.cg,border:'1.5px solid '+c.gb,borderRadius:16,padding:L.ph?16:22,marginBottom:20,position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:-40,right:-40,width:140,height:140,borderRadius:'50%',background:'radial-gradient(circle,rgba(52,211,153,0.12),transparent 65%)'}}/>
          <div style={{fontSize:L.fs.xs,fontWeight:700,letterSpacing:1.2,color:c.g,marginBottom:10,display:'flex',alignItems:'center',gap:6}}>
            🧾 BATCH SUMMARY
          </div>
          <div style={{display:'flex',gap:16,position:'relative',zIndex:1}}>
            <div>
              <div style={{fontSize:L.dk?32:26,fontWeight:800,color:c.g,letterSpacing:-1}}>₹{totalSaved.toLocaleString()}</div>
              <div style={{fontSize:L.fs.xs,color:c.t3}}>total saved</div>
            </div>
            <div style={{borderLeft:'1px solid '+c.b,paddingLeft:16}}>
              <div style={{fontSize:L.dk?32:26,fontWeight:800,color:c.t1,letterSpacing:-1}}>₹{(totalSpent-totalSaved).toLocaleString()}</div>
              <div style={{fontSize:L.fs.xs,color:c.t3}}>you pay</div>
            </div>
            <div style={{borderLeft:'1px solid '+c.b,paddingLeft:16}}>
              <div style={{fontSize:L.dk?32:26,fontWeight:800,color:c.ac,letterSpacing:-1}}>{totalSpent>0?((totalSaved/totalSpent)*100).toFixed(1):'0'}%</div>
              <div style={{fontSize:L.fs.xs,color:c.t3}}>saved</div>
            </div>
          </div>
        </div>

        {/* Per-category results */}
        {results.map((r,i)=>(
          <div key={r.id} style={{background:c.s,border:'1px solid '+c.b,borderRadius:14,padding:L.ph?12:16,marginBottom:10,animation:'co-fadeUp 0.3s ease '+(i*0.06)+'s both'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <span style={{fontSize:20}}>{r.cat?.ic}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:L.fs.md,fontWeight:700,color:c.t1}}>{r.cat?.nm} · ₹{r.v.toLocaleString()}</div>
                {r.best?(
                  <div style={{fontSize:L.fs.xs+1,color:c.t2,marginTop:2}}>
                    Buy on <span style={{fontWeight:700,color:c.ac}}>{r.best.pf.n}</span> with <span style={{fontWeight:700}}>{r.best.card.nm}</span>
                  </div>
                ):(
                  <div style={{fontSize:L.fs.xs+1,color:c.t3,marginTop:2}}>No owned cards match — <button onClick={()=>setTab('cards')} style={{background:'none',border:'none',color:c.ac,cursor:'pointer',fontFamily:'inherit',fontSize:'inherit',fontWeight:700,padding:0}}>add cards</button></div>
                )}
              </div>
              <div style={{textAlign:'right',flexShrink:0}}>
                <div style={{fontSize:L.fs.lg,fontWeight:800,color:c.g}}>₹{r.best?.tot||0}</div>
                <div style={{fontSize:L.fs.xs,color:c.t3}}>saved</div>
              </div>
            </div>
            {r.best&&r.best.of&&(
              <div style={{marginTop:8,display:'flex',alignItems:'center',gap:6,padding:'4px 8px',borderRadius:6,background:c.ag,fontSize:L.fs.xs,fontWeight:600,color:c.a}}>
                🔥 {r.best.of.d} · saves ₹{r.best.oa} extra
              </div>
            )}
          </div>
        ))}
      </div>
    )}

    {ownedCards.length===0&&(
      <div style={{textAlign:'center',padding:'30px 0'}}>
        <div style={{fontSize:L.fs.md,color:c.t3,marginBottom:12}}>Add cards first to see batch results</div>
        <button className="co-hover-lift" onClick={()=>setTab('cards')} style={{padding:'10px 24px',borderRadius:12,background:c.acg,border:'1.5px solid '+c.acb,color:c.ac,fontSize:L.fs.sm,fontWeight:700,cursor:'pointer',fontFamily:'inherit',display:'inline-flex',alignItems:'center',gap:6}}>
          <CreditCard size={14}/> Go to My Cards
        </button>
      </div>
    )}
  </div>);
}

/* ══════════ RESULTS ══════════ */
function Res({rtab,sR,exp,sE,saved,doSv,bO,owP,allP,gap,v,c,L,goCards}){
  return(<div style={{animation:'co-fadeUp 0.4s ease-out'}}>
    <div style={{display:'flex',gap:10,marginBottom:20}}>
      {[{id:'owned',Icon:Check,nm:'Your Cards',desc:'Best combos with cards you own',cl:c.g,cg:c.gg,cb:c.gb},
        {id:'all',Icon:TrendingUp,nm:'Upgrades',desc:'Cards worth getting for extra savings',cl:c.a,cg:c.ag,cb:c.ab}
      ].map(tb=>(
        <button key={tb.id} className="co-press" onClick={()=>{sR(tb.id);sE(null);}} style={{
          flex:1,padding:'14px 12px',borderRadius:L.r,
          border:rtab===tb.id?'2px solid '+tb.cb:'1px solid '+c.b,
          background:rtab===tb.id?tb.cg:c.s,
          cursor:'pointer',textAlign:'left',transition:'all 0.25s',
        }}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
            <div style={{width:28,height:28,borderRadius:8,background:rtab===tb.id?tb.cl:'transparent',border:'2px solid '+(rtab===tb.id?tb.cl:c.t3),display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.3s'}}>
              <tb.Icon size={14} color={rtab===tb.id?(c.mode==='dark'?'#1a0e3e':'#fff'):c.t3} strokeWidth={3}/>
            </div>
            <span style={{fontSize:L.fs.md,fontWeight:700,color:rtab===tb.id?tb.cl:c.t3}}>{tb.nm}</span>
          </div>
          <div style={{fontSize:L.fs.xs,color:c.t3,lineHeight:1.4}}>{tb.desc}</div>
          {tb.id==='all'&&gap>0&&<div style={{marginTop:6,fontSize:L.fs.xs,fontWeight:700,color:c.a,background:c.ag,display:'inline-block',padding:'2px 8px',borderRadius:6,animation:'co-pulse 2.5s ease-in-out infinite'}}>+₹{gap} more possible</div>}
        </button>
      ))}
    </div>

    {rtab==='owned'?(
      bO?(<>
        <HeroCard bO={bO} v={v} saved={saved} doSv={doSv} c={c} L={L}/>
        {owP.length>1&&(<>
          <div style={{fontSize:L.fs.xs+1,fontWeight:600,color:c.t3,letterSpacing:0.8,marginBottom:12,marginTop:6}}>OTHER OPTIONS WITH YOUR CARDS</div>
          {owP.slice(1).map((x,i)=><ComboCard key={x.pid+x.card.id} x={x} rk={i+2} v={v} up={false} c={c} L={L} exp={exp} sE={sE} bO={bO} idx={i}/>)}
        </>)}
      </>):(<div style={{textAlign:'center',padding:'44px 0',animation:'co-fadeUp 0.4s ease'}}>
        <CreditCard size={48} color={c.t3} strokeWidth={1}/>
        <div style={{fontSize:L.fs.md,color:c.t3,lineHeight:1.6,marginTop:16}}>Add cards in the Cards tab to see results</div>
        <button className="co-hover-lift" onClick={goCards} style={{marginTop:16,padding:'10px 24px',borderRadius:12,background:c.acg,border:'1.5px solid '+c.acb,color:c.ac,fontSize:L.fs.sm,fontWeight:700,cursor:'pointer',fontFamily:'inherit',display:'inline-flex',alignItems:'center',gap:6}}>
          <CreditCard size={14}/> Go to My Cards
        </button>
      </div>)
    ):(
      <>{allP.filter(x=>!x.owned).length>0?(
        <><div style={{fontSize:L.fs.xs+1,fontWeight:600,color:c.t3,letterSpacing:0.8,marginBottom:12,display:'flex',alignItems:'center',gap:6}}>
          <TrendingUp size={14} color={c.a}/> BEST COMBOS IF YOU GET THESE CARDS
        </div>
        {allP.filter(x=>!x.owned&&(!bO||x.tot>bO.tot)).slice(0,8).map((x,i)=><ComboCard key={x.pid+x.card.id} x={x} rk={i+1} v={v} up={true} c={c} L={L} exp={exp} sE={sE} bO={bO} idx={i}/>)}</>
      ):(<div style={{textAlign:'center',padding:'30px 0',color:c.t3,fontSize:L.fs.md,animation:'co-fadeUp 0.3s ease'}}>You already own the best cards 🎉</div>)}</>
    )}
    <div style={{textAlign:'center',fontSize:L.fs.xs,color:c.t3,padding:'20px 0',lineHeight:1.6,opacity:0.6}}>Estimates only · Verify offers with your bank</div>
  </div>);
}

/* ══════════ HERO CARD ══════════ */
function HeroCard({bO,v,saved,doSv,c,L}){
  const animTot = useAnimatedValue(bO.tot);
  const animEff = useAnimatedValue(bO.eff);
  const pct=((bO.tot/v)*100).toFixed(1);
  const isSaved = saved===bO.pid;

  return(
    <div style={{
      background:c.cg,border:'1.5px solid '+c.gb,borderRadius:L.r+4,
      padding:L.ph&&L.w<360?16:L.dk?26:22,marginBottom:18,
      position:'relative',overflow:'hidden',
      animation:'co-breathe 4s ease-in-out infinite',
    }}>
      {/* Decorative elements */}
      <div style={{position:'absolute',top:-60,right:-60,width:180,height:180,borderRadius:'50%',background:'radial-gradient(circle,rgba(52,211,153,0.12),transparent 65%)'}}/>
      <div style={{position:'absolute',bottom:-40,left:-40,width:120,height:120,borderRadius:'50%',background:'radial-gradient(circle,rgba(167,139,250,0.08),transparent 65%)'}}/>

      <div style={{fontSize:L.fs.xs,fontWeight:700,letterSpacing:1.2,color:c.g,marginBottom:14,position:'relative',zIndex:1,display:'flex',alignItems:'center',gap:6}}>
        🏆 YOUR BEST COMBO
      </div>

      <div style={{display:'flex',alignItems:'center',gap:L.ph?8:10,marginBottom:16,position:'relative',zIndex:1}}>
        <div style={{fontSize:L.dk?32:L.ph?24:28,animation:'co-fadeUp 0.5s ease'}}>{bO.pf.i}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:L.fs.lg,fontWeight:700}}>Buy on {bO.pf.n}</div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginTop:6}}>
            <CardVisual card={bO.card} size="md" c={c}/>
            <div>
              <div style={{fontSize:L.fs.sm,fontWeight:600,color:c.t1}}>{bO.card.nm}</div>
              <div style={{fontSize:L.fs.xs+1,color:c.t2}}>{bO.card.bk}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated savings counter */}
      <div style={{display:'flex',alignItems:'baseline',gap:8,position:'relative',zIndex:1}}>
        <div style={{fontSize:L.fs.sv,fontWeight:800,color:c.g,letterSpacing:-2,lineHeight:1}}>
          ₹{animTot.toLocaleString()}
        </div>
        <div style={{fontSize:L.fs.sm,fontWeight:600,color:c.g,opacity:0.7}}>saved ({pct}%)</div>
      </div>
      <div style={{fontSize:L.fs.sm,color:c.t3,marginTop:6,position:'relative',zIndex:1}}>
        You pay <span style={{color:c.t1,fontWeight:700}}>₹{animEff.toLocaleString()}</span> instead of ₹{v.toLocaleString()}
      </div>

      <MathBreak x={bO} v={v} c={c} L={L}/>

      {/* Save button with confetti */}
      <div style={{position:'relative',marginTop:14}}>
        <Confetti show={isSaved}/>
        <button className="co-press" onClick={()=>doSv(bO)} style={{
          width:'100%',padding:(L.ph?10:12)+'px 0',borderRadius:12,
          background:isSaved?c.g:c.gg,
          border:'1.5px solid '+c.gb,
          color:isSaved?'#1a0e3e':c.g,
          fontSize:L.fs.sm,fontWeight:700,cursor:'pointer',fontFamily:'inherit',
          transition:'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          transform:isSaved?'scale(1.02)':'scale(1)',
          boxShadow:isSaved?'0 4px 20px rgba(52,211,153,0.3)':'none',
        }}>
          {isSaved ? <><Check size={14} style={{display:'inline',verticalAlign:'-2px',marginRight:4}}/> Saved!</> : 'Save to History'}
        </button>
      </div>
    </div>
  );
}

/* ══════════ MATH BREAK ══════════ */
function MathBreak({x,v,c,L}){
  const rows=[
    {label:'Purchase amount',val:'₹'+v.toLocaleString(),color:c.t1,bold:false},
    {label:'Card reward ('+(x.rt*100).toFixed(1)+'% on '+x.pf.n+')',val:'− ₹'+x.rw,color:c.g,bold:false},
  ];
  if(x.of){
    const d=x.of.t==='%'?x.of.v+'% off, max ₹'+x.of.mx:'Flat ₹'+x.of.v+' off';
    const dl = daysLeft(x.of.tl);
    const expLabel = dl <= 7 ? ` · ${dl}d left` : '';
    rows.push({label:x.of.d+' ('+d+')'+expLabel,val:'− ₹'+x.oa,color:c.a,bold:false,expiring:dl<=7});
  }
  rows.push({label:'You pay',val:'₹'+x.eff.toLocaleString(),color:c.t1,bold:true});

  return(
    <div style={{marginTop:14,position:'relative',zIndex:1}}>
      <div style={{background:c.s,borderRadius:12,border:'1px solid '+c.b,overflow:'hidden'}}>
        <div style={{padding:'10px 14px',borderBottom:'1px solid '+c.b,display:'flex',alignItems:'center',gap:6}}>
          <span style={{fontSize:12}}>🧮</span>
          <span style={{fontSize:L.fs.xs+1,fontWeight:700,color:c.t2,letterSpacing:0.3}}>How we calculated this</span>
        </div>
        <div style={{padding:'4px 0'}}>
          {rows.map((r,i)=>{
            const isLast=i===rows.length-1;
            return(
              <div key={i} style={{
                display:'flex',justifyContent:'space-between',alignItems:'center',
                padding:(isLast?10:7)+'px 14px',
                borderTop:isLast?'1px dashed '+c.b:'none',
                background:isLast?c.sh:'transparent',
                animation:'co-slideIn 0.3s ease '+(i*0.08)+'s both',
              }}>
                <span style={{fontSize:L.fs.sm,color:r.bold?c.t1:c.t3,fontWeight:r.bold?700:400,flex:1,marginRight:10,lineHeight:1.3}}>
                  {r.label}
                  {r.expiring&&<span style={{display:'inline-flex',alignItems:'center',gap:3,marginLeft:6,padding:'1px 6px',borderRadius:4,background:'rgba(248,113,113,0.15)',border:'1px solid rgba(248,113,113,0.3)',fontSize:L.fs.xs-1,color:c.lv,fontWeight:700,verticalAlign:'middle'}}>
                    <Clock size={9}/> Expiring
                  </span>}
                </span>
                <span style={{fontSize:L.fs.sm,color:r.color,fontWeight:r.bold?800:600,whiteSpace:'nowrap',fontVariantNumeric:'tabular-nums'}}>{r.val}</span>
              </div>
            );
          })}
        </div>
        {x.card.fe>0&&<div style={{padding:'8px 14px',borderTop:'1px solid '+c.b,fontSize:L.fs.xs,color:c.t3,lineHeight:1.4}}>ℹ️ Card has ₹{x.card.fe.toLocaleString()} annual fee{x.card.wv?' (waived at '+x.card.wv+')':''}</div>}
        {x.card.caps&&x.card.caps.some(cap=>cap.platforms.includes(x.pid)||cap.platforms.includes('default'))&&(
          <div style={{padding:'8px 14px',borderTop:'1px solid '+c.b,fontSize:L.fs.xs,color:c.a,lineHeight:1.4,display:'flex',alignItems:'flex-start',gap:6}}>
            <AlertTriangle size={11} style={{marginTop:1,flexShrink:0}}/>
            <span>{(x.card.caps.find(cap=>cap.platforms.includes(x.pid))||x.card.caps.find(cap=>cap.platforms.includes('default'))).note}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════ COMBO CARD ══════════ */
function ComboCard({x,rk,v,up,c,L,exp,sE,bO,idx}){
  const k=x.pid+'-'+x.card.id, isE=exp===k;
  const pct=((x.tot/v)*100).toFixed(1);
  const extra=bO&&x.tot>bO.tot?x.tot-bO.tot:0;

  return(
    <div style={{marginBottom:10,animation:'co-fadeUp 0.35s ease '+(idx*0.06)+'s both'}}>
      <button className="co-hover-lift" onClick={()=>sE(isE?null:k)} style={{
        width:'100%',textAlign:'left',cursor:'pointer',
        background:c.s,
        border:'1.5px solid '+(isE?c.bh:c.b),
        borderRadius:isE?'14px 14px 0 0':'14px',
        padding:L.ph?12:16,
        transition:'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        boxSizing:'border-box',
        borderLeft:up?'3px solid '+c.a:'none',
      }}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
          <div style={{width:26,height:26,borderRadius:8,background:rk===1?(up?c.ag:c.gg):c.s,border:'1px solid '+(rk===1?(up?c.ab:c.gb):c.b),display:'flex',alignItems:'center',justifyContent:'center',fontSize:L.fs.xs,fontWeight:800,color:rk===1?(up?c.a:c.g):c.t3,flexShrink:0}}>{rk}</div>
          <span style={{fontSize:L.ph?20:24,flexShrink:0}}>{x.pf.i}</span>
          <div style={{flex:1,minWidth:0}}><div style={{fontSize:L.fs.md,fontWeight:700,color:c.t1}}>{x.pf.n}</div></div>
          <div style={{textAlign:'right',flexShrink:0}}>
            <div style={{fontSize:L.ph?17:20,fontWeight:800,color:up?c.a:c.g,letterSpacing:-0.5}}>₹{x.tot}</div>
            <div style={{fontSize:L.fs.xs,color:c.t3}}>{pct}% back</div>
          </div>
        </div>

        {/* Card chip */}
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:c.sh,borderRadius:10}}>
          <CardVisual card={x.card} size="sm" c={c}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:L.fs.sm,fontWeight:600,color:c.t1}}>{x.card.nm} <span style={{fontWeight:400,color:c.t3}}>· {x.card.bk}</span></div>
            <div style={{fontSize:L.fs.xs,color:c.t3,marginTop:2}}>
              Reward ₹{x.rw}
              {x.oa>0&&<span style={{color:c.a}}> + Offer ₹{x.oa}</span>}
              {x.card.fe>0&&<span> · Fee ₹{x.card.fe.toLocaleString()}</span>}
            </div>
            {(x.card.nw==='amex'||x.card.nw==='diners')&&<div style={{display:'inline-flex',alignItems:'center',gap:3,marginTop:4,padding:'2px 6px',borderRadius:4,background:'rgba(248,113,113,0.12)',border:'1px solid rgba(248,113,113,0.25)',fontSize:L.fs.xs-1,color:c.lv,fontWeight:600}}><AlertTriangle size={9}/> Limited acceptance</div>}
          </div>
          {up&&<div style={{padding:'3px 8px',borderRadius:6,background:c.ag,border:'1px solid '+c.ab,fontSize:L.fs.xs-1,fontWeight:700,color:c.a,whiteSpace:'nowrap',flexShrink:0}}>NEW CARD</div>}
        </div>

        {up&&extra>0&&<div style={{marginTop:8,fontSize:L.fs.xs,color:c.a,fontWeight:600,display:'flex',alignItems:'center',gap:4}}><TrendingUp size={12}/> ₹{extra} more than your current best</div>}

        {/* Apply button for upgrades */}
        {up&&x.card.u&&(
          <a href={x.card.u} target="_blank" rel="noopener noreferrer"
            onClick={e=>e.stopPropagation()}
            className="co-press"
            style={{
              display:'flex',alignItems:'center',justifyContent:'center',gap:6,
              marginTop:10,padding:'10px 16px',borderRadius:10,
              background:'linear-gradient(135deg,'+c.a+',#f59e0b)',
              color:'#1a0e3e',fontSize:L.fs.sm,fontWeight:700,textDecoration:'none',
              boxShadow:'0 2px 12px rgba(251,191,36,0.3)',
              transition:'all 0.2s',
            }}>
            Get {x.card.nm} Card <ExternalLink size={13}/>
          </a>
        )}

        <div style={{textAlign:'center',marginTop:8,fontSize:L.fs.xs,color:c.t3,opacity:0.5,display:'flex',alignItems:'center',justifyContent:'center',gap:4}}>
          {isE?<><ChevronUp size={12}/>hide math</>:<><ChevronDown size={12}/>see full math</>}
        </div>
      </button>

      {isE&&(
        <div style={{border:'1.5px solid '+c.bh,borderTop:'none',borderRadius:'0 0 14px 14px',overflow:'hidden',animation:'co-fadeUp 0.25s ease'}}>
          <MathBreak x={x} v={v} c={c} L={L}/>
        </div>
      )}
    </div>
  );
}

/* ══════════ CARDS TAB ══════════ */
function Cards({c,cards,tog,L}){
  const[q,sQ]=useState('');
  const[focused,sF]=useState(false);
  const fl=cards.filter(x=>x.nm.toLowerCase().includes(q.toLowerCase())||x.bk.toLowerCase().includes(q.toLowerCase()));
  const on=fl.filter(x=>x.owned),off=fl.filter(x=>!x.owned);
  const ba=b=>b.split(' ').map(w=>w[0]).join('').slice(0,4);
  const cols=L.dk?2:1;

  return(<div>
    <div style={{fontSize:L.dk?30:26,fontWeight:800,letterSpacing:-0.5,marginBottom:4}}>My Cards</div>
    <div style={{fontSize:L.fs.md,color:c.t2,marginBottom:20}}>
      <span style={{color:c.g,fontWeight:700}}>{cards.filter(x=>x.owned).length}</span> owned · {cards.filter(x=>!x.owned).length} available
    </div>

    {/* Featured card showcase - horizontal scroll */}
    {on.length>0&&!q&&(
      <div style={{marginBottom:24}}>
        <div style={{fontSize:L.fs.xs+1,fontWeight:600,color:c.t3,letterSpacing:0.8,marginBottom:10}}>YOUR WALLET</div>
        <div style={{display:'flex',gap:14,overflowX:'auto',paddingBottom:8,scrollSnapType:'x mandatory',WebkitOverflowScrolling:'touch'}}>
          {on.map((card,i)=>(
            <div key={card.id} style={{scrollSnapAlign:'start',flexShrink:0,animation:'co-fadeUp 0.4s ease '+(i*0.05)+'s both'}}>
              <CardVisual card={card} size="xl" c={c}/>
              <div style={{textAlign:'center',marginTop:6}}>
                <div style={{fontSize:L.fs.sm,fontWeight:600,color:c.t1}}>{card.nm}</div>
                <div style={{fontSize:L.fs.xs,color:c.t3}}>{card.bk}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Fee ROI Calculator */}
    {on.filter(x=>x.fe>0).length>0&&!q&&(
      <div style={{marginBottom:24}}>
        <div style={{fontSize:L.fs.xs+1,fontWeight:600,color:c.t3,letterSpacing:0.8,marginBottom:10,display:'flex',alignItems:'center',gap:6}}>
          <DollarSign size={12}/> ANNUAL FEE ROI
        </div>
        <div style={{background:c.s,border:'1px solid '+c.b,borderRadius:14,overflow:'hidden'}}>
          {on.filter(x=>x.fe>0).map((card,i)=>{
            const defRate=card.r['default']||0.01;
            const breakeven=Math.round(card.fe/(defRate*12));
            const monthlyNeeded=Math.round(card.fe/defRate/12);
            const isWorth=monthlyNeeded<50000;
            return(
              <div key={card.id} style={{padding:'12px 16px',borderTop:i>0?'1px solid '+c.b:'none',display:'flex',alignItems:'center',gap:12}}>
                <CardVisual card={card} size="sm" c={c}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:L.fs.sm,fontWeight:600,color:c.t1}}>{card.nm}</div>
                  <div style={{fontSize:L.fs.xs,color:c.t3,marginTop:2}}>
                    Fee ₹{card.fe.toLocaleString()}{card.wv?' · Waived at '+card.wv:''}
                  </div>
                </div>
                <div style={{textAlign:'right',flexShrink:0}}>
                  <div style={{fontSize:L.fs.sm,fontWeight:700,color:isWorth?c.g:c.a}}>₹{(monthlyNeeded/1000).toFixed(0)}k/mo</div>
                  <div style={{fontSize:L.fs.xs-1,color:c.t3}}>to break even</div>
                </div>
              </div>
            );
          })}
          <div style={{padding:'8px 16px',borderTop:'1px solid '+c.b,fontSize:L.fs.xs,color:c.t3,lineHeight:1.5}}>
            ℹ️ Spend above this monthly amount to earn back the annual fee through default rewards. Partner/platform rewards break even faster.
          </div>
        </div>
      </div>
    )}

    {/* Search with icon */}
    <div style={{
      display:'flex',alignItems:'center',gap:8,
      padding:'0 14px',borderRadius:12,
      background:c.s,border:'1.5px solid '+(focused?c.ac:c.b),
      marginBottom:20,transition:'all 0.3s',
      boxShadow:focused?'0 0 0 4px '+c.acg:'none',
    }}>
      <Search size={16} color={focused?c.ac:c.t3}/>
      <input value={q} onChange={e=>sQ(e.target.value)}
        onFocus={()=>sF(true)} onBlur={()=>sF(false)}
        placeholder="Search cards…"
        style={{flex:1,padding:'12px 0',background:'none',border:'none',outline:'none',color:c.t1,fontSize:L.fs.md,fontFamily:'inherit'}}
      />
    </div>

    <div style={{fontSize:L.fs.xs+1,fontWeight:600,color:c.t3,letterSpacing:0.8,marginBottom:10}}>OWNED ({on.length})</div>
    <div style={{display:'grid',gridTemplateColumns:'repeat('+cols+',1fr)',gap:6,marginBottom:20}}>
      {on.length?on.map((x,i)=><CdR key={x.id} x={x} c={c} ba={ba} tog={tog} L={L} idx={i}/>)
      :<div style={{gridColumn:'1/-1',textAlign:'center',padding:'20px 0',color:c.t3,fontSize:L.fs.sm}}>No cards owned yet</div>}
    </div>

    <div style={{fontSize:L.fs.xs+1,fontWeight:600,color:c.t3,letterSpacing:0.8,marginBottom:10}}>AVAILABLE ({off.length})</div>
    <div style={{display:'grid',gridTemplateColumns:'repeat('+cols+',1fr)',gap:6,marginBottom:80}}>
      {off.map((x,i)=><CdR key={x.id} x={x} c={c} ba={ba} tog={tog} L={L} idx={i}/>)}
    </div>
  </div>);
}

function CdR({x,c,ba,tog,L,idx}){
  return(
    <button className="co-hover-lift" onClick={()=>tog(x.id)} style={{
      width:'100%',display:'flex',alignItems:'center',gap:10,
      padding:L.ph?10:12,borderRadius:12,
      border:'1.5px solid '+(x.owned?c.gb:'transparent'),
      background:x.owned?c.gg:'transparent',
      cursor:'pointer',textAlign:'left',
      transition:'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
      boxSizing:'border-box',
      animation:'co-fadeUp 0.3s ease '+(idx*0.03)+'s both',
    }}>
      <CardVisual card={x} size={L.ph?'md':'md'} c={c}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:L.fs.md,fontWeight:600,color:c.t1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{x.nm}</div>
        <div style={{fontSize:L.fs.xs+1,color:c.t3,marginTop:1}}>{x.bk} · {x.fe===0?'Free':'₹'+x.fe.toLocaleString()}{(x.nw==='amex'||x.nw==='diners')?' · ⚠️ Limited acceptance':''}</div>
      </div>
      <div style={{
        width:20,height:20,borderRadius:6,
        border:'2px solid '+(x.owned?c.g:c.t3),
        background:x.owned?c.g:'transparent',
        display:'flex',alignItems:'center',justifyContent:'center',
        flexShrink:0,
        transition:'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {x.owned&&<Check size={12} color="#fff" strokeWidth={3} style={{animation:'co-checkPop 0.3s ease'}}/>}
      </div>
    </button>
  );
}

/* ══════════ HISTORY TAB ══════════ */
function Hist({c,hist,setHist,L}){
  const tS=hist.reduce((s,h)=>s+h.tot,0);
  const tSp=hist.reduce((s,h)=>s+h.a,0);
  const animS = useAnimatedValue(tS);
  const animSp = useAnimatedValue(tSp);

  const grp=useMemo(()=>{
    const g={};
    hist.forEach(h=>{const d=new Date(h.dt),k=d.toLocaleDateString('en-IN',{month:'long',year:'numeric'});if(!g[k])g[k]={l:k,items:[],sv:0};g[k].items.push(h);g[k].sv+=h.tot;});
    return Object.values(g);
  },[hist]);

  return(<div>
    <div style={{fontSize:L.dk?30:26,fontWeight:800,letterSpacing:-0.5,marginBottom:18}}>History</div>

    {/* Stats bar */}
    <div style={{display:'flex',background:c.s,border:'1px solid '+c.b,borderRadius:L.r,padding:L.ph?14:18,marginBottom:24,alignItems:'center'}}>
      {[{v:'₹'+animS.toLocaleString(),l:'Saved',cl:c.g,Icon:TrendingUp},{v:'₹'+animSp.toLocaleString(),l:'Spent',cl:c.t1,Icon:CreditCard},{v:String(hist.length),l:'Txns',cl:c.ac,Icon:BarChart3}].map((s,i)=>(
        <Fragment key={s.l}>
          {i>0&&<div style={{width:1,height:32,background:c.b}}/>}
          <div style={{flex:1,textAlign:'center'}}>
            <div style={{fontSize:L.ph?15:18,fontWeight:800,color:s.cl,fontVariantNumeric:'tabular-nums'}}>{s.v}</div>
            <div style={{fontSize:L.fs.xs,fontWeight:600,color:c.t3,marginTop:3,display:'flex',alignItems:'center',justifyContent:'center',gap:3}}>
              <s.Icon size={10}/>{s.l}
            </div>
          </div>
        </Fragment>
      ))}
    </div>

    {hist.length===0?(
      <div style={{textAlign:'center',padding:'44px 0',animation:'co-fadeUp 0.4s ease'}}>
        <BarChart3 size={48} color={c.t3} strokeWidth={1}/>
        <div style={{fontSize:L.fs.md,color:c.t3,lineHeight:1.6,maxWidth:260,margin:'16px auto 0'}}>No transactions yet. Save combos from the Optimize tab.</div>
      </div>
    ):(
      <>
        {/* Monthly Savings Chart */}
        {grp.length>0&&(
          <div style={{background:c.s,border:'1px solid '+c.b,borderRadius:14,padding:'16px',marginBottom:24,animation:'co-fadeUp 0.3s ease'}}>
            <div style={{fontSize:L.fs.xs+1,fontWeight:700,color:c.t2,marginBottom:14,display:'flex',alignItems:'center',gap:6}}>
              <PieChart size={13} color={c.ac}/> MONTHLY SAVINGS TREND
            </div>
            {(()=>{
              const maxSv=Math.max(...grp.map(g=>g.sv),1);
              return(
                <div style={{display:'flex',alignItems:'flex-end',gap:L.ph?4:8,height:100}}>
                  {grp.slice(-6).map((g,i)=>{
                    const h=Math.max(8,Math.round((g.sv/maxSv)*90));
                    const mo=g.l.split(' ')[0].slice(0,3);
                    return(
                      <div key={g.l} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4,animation:'co-fadeUp 0.3s ease '+(i*0.08)+'s both'}}>
                        <div style={{fontSize:L.fs.xs-1,fontWeight:700,color:c.g}}>₹{g.sv>999?(g.sv/1000).toFixed(1)+'k':g.sv}</div>
                        <div style={{width:'100%',maxWidth:40,height:h,borderRadius:6,background:'linear-gradient(180deg,'+c.g+','+c.ac+')',opacity:0.8,transition:'height 0.5s ease'}}/>
                        <div style={{fontSize:L.fs.xs-1,color:c.t3,fontWeight:600}}>{mo}</div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
            {grp.length>1&&(
              <div style={{marginTop:12,textAlign:'center',fontSize:L.fs.xs,color:c.t3}}>
                Avg savings: ₹{Math.round(grp.reduce((s,g)=>s+g.sv,0)/grp.length).toLocaleString()}/month across {hist.length} transactions
              </div>
            )}
          </div>
        )}
        {grp.map(g=>(
          <div key={g.l} style={{marginBottom:22}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
              <span style={{fontSize:L.fs.md,fontWeight:700,color:c.t2}}>{g.l}</span>
              <span style={{fontSize:L.fs.sm,fontWeight:600,color:c.g,display:'flex',alignItems:'center',gap:4}}>
                <TrendingUp size={12}/> ₹{g.sv.toLocaleString()}
              </span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:L.dk?'1fr 1fr':'1fr',gap:8}}>
              {g.items.map((h,hi)=>(
                <div key={h.id} style={{
                  background:c.s,border:'1px solid '+c.b,borderRadius:12,padding:L.ph?11:14,
                  animation:'co-fadeUp 0.3s ease '+(hi*0.05)+'s both',
                  transition:'all 0.2s',
                }}>
                  <div style={{display:'flex',alignItems:'center',gap:L.ph?8:10}}>
                    <span style={{fontSize:L.ph?18:22}}>{h.pi}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:L.fs.md,fontWeight:600,color:c.t1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{h.pn}</div>
                      <div style={{fontSize:L.fs.xs+1,color:c.t3,marginTop:1}}>{h.ci} {h.cn} · {new Date(h.dt).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</div>
                    </div>
                    <div style={{textAlign:'right',flexShrink:0}}>
                      <div style={{fontSize:L.fs.md,fontWeight:700,color:c.t1}}>₹{h.a.toLocaleString()}</div>
                      <div style={{fontSize:L.fs.sm,fontWeight:600,color:c.g,marginTop:1}}>−₹{h.tot}</div>
                    </div>
                    <button className="co-press" onClick={(e)=>{e.stopPropagation();setHist(p=>p.filter(x=>x.id!==h.id));}} style={{width:24,height:24,borderRadius:6,border:'1px solid '+c.b,background:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,opacity:0.5,transition:'all 0.2s'}} onMouseEnter={e=>e.currentTarget.style.opacity='1'} onMouseLeave={e=>e.currentTarget.style.opacity='0.5'}>
                      <X size={12} color={c.lv}/>
                    </button>
                  </div>
                  {h.od&&<div style={{fontSize:L.fs.xs+1,fontWeight:600,color:c.a,marginTop:7,display:'flex',alignItems:'center',gap:4}}>🔥 {h.od}</div>}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button className="co-press" onClick={()=>setHist([])} style={{
          width:'100%',maxWidth:300,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'center',gap:6,
          padding:'11px 0',borderRadius:10,border:'1px solid '+c.lv,
          background:'none',color:c.lv,fontSize:L.fs.sm+1,fontWeight:600,
          cursor:'pointer',fontFamily:'inherit',marginBottom:80,
        }}>
          <Trash2 size={14}/> Clear All History
        </button>
      </>
    )}
  </div>);
}

/* ══════════ SETTINGS TAB ══════════ */
function Sett({c,mode,setMode,notif,setNotif,L,liveStatus}){
  const ec=(()=>{const n=new Date(),cu=new Date(n.getTime()+7*864e5);return OF.filter(o=>{const e=new Date(o.tl);return e>n&&e<=cu;}).length;})();

  const rs={background:c.s,border:'1.5px solid '+c.b,borderRadius:14,padding:L.ph?13:16,display:'flex',alignItems:'center',justifyContent:'space-between',transition:'all 0.2s'};

  const srcLabel = liveStatus?.src==='live'?'Live (Supabase)':liveStatus?.src==='hardcoded'?'Local (hardcoded)':'Fallback';
  const srcColor = liveStatus?.src==='live'?c.g:liveStatus?.src==='hardcoded'?c.a:c.ac;

  return(<div style={{maxWidth:520}}>
    <div style={{fontSize:L.dk?30:26,fontWeight:800,letterSpacing:-0.5,marginBottom:24}}>Settings</div>

    <div style={{fontSize:L.fs.xs+1,fontWeight:600,color:c.t3,letterSpacing:0.8,marginBottom:10}}>APPEARANCE</div>
    <div style={rs}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:36,height:36,borderRadius:10,background:mode==='dark'?'rgba(167,139,250,0.15)':'rgba(251,191,36,0.15)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          {mode==='dark'?<Moon size={18} color={c.ac}/>:<Sun size={18} color={c.a}/>}
        </div>
        <div>
          <div style={{fontSize:L.fs.md+1,fontWeight:600,color:c.t1}}>Dark Mode</div>
          <div style={{fontSize:L.fs.sm,color:c.t3,marginTop:1}}>{mode==='dark'?'Purple Luxe':'Light theme'}</div>
        </div>
      </div>
      <Tg on={mode==='dark'} fn={()=>setMode(mode==='dark'?'light':'dark')} cl={c.ac} c={c}/>
    </div>

    <div style={{fontSize:L.fs.xs+1,fontWeight:600,color:c.t3,letterSpacing:0.8,marginBottom:10,marginTop:28}}>NOTIFICATIONS</div>
    <div style={rs}>
      <div style={{display:'flex',alignItems:'center',gap:12,flex:1}}>
        <div style={{width:36,height:36,borderRadius:10,background:'rgba(52,211,153,0.15)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <Bell size={18} color={c.g}/>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:L.fs.md+1,fontWeight:600,color:c.t1}}>Expiring Soon</div>
          <div style={{fontSize:L.fs.sm,color:c.t3,marginTop:1}}>View offers expiring within 7 days</div>
        </div>
      </div>
      <Tg on={notif} fn={()=>setNotif(!notif)} cl={c.g} c={c}/>
    </div>
    {notif&&(
      <div style={{background:c.s,border:'1px solid '+c.b,borderRadius:14,padding:L.ph?13:16,marginTop:8,animation:'co-fadeUp 0.25s ease',display:'flex',alignItems:'center',gap:8}}>
        <Clock size={16} color={ec>0?c.a:c.g}/>
        <div style={{fontSize:L.fs.sm+1,color:c.t2}}>{ec} offer{ec!==1?'s':''} expiring within 7 days</div>
      </div>
    )}

    {/* ═══════════ DATA PIPELINE STATUS ═══════════ */}
    <div style={{fontSize:L.fs.xs+1,fontWeight:600,color:c.t3,letterSpacing:0.8,marginBottom:10,marginTop:28}}>DATA PIPELINE</div>
    <div style={{background:c.s,border:'1.5px solid '+c.b,borderRadius:14,padding:L.ph?13:16}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
        <div style={{width:36,height:36,borderRadius:10,background:liveStatus?.src==='live'?'rgba(52,211,153,0.15)':'rgba(251,191,36,0.15)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <RefreshCw size={18} color={srcColor} style={{animation:liveStatus?.loading?'co-spin 1s linear infinite':'none'}}/>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:L.fs.md+1,fontWeight:600,color:c.t1}}>Offer Source</div>
          <div style={{display:'flex',alignItems:'center',gap:6,marginTop:2}}>
            <div style={{width:6,height:6,borderRadius:3,background:srcColor}}/>
            <span style={{fontSize:L.fs.sm,color:srcColor,fontWeight:600}}>{srcLabel}</span>
          </div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
        <div style={{background:c.sh,borderRadius:10,padding:'8px 10px',textAlign:'center'}}>
          <div style={{fontSize:L.fs.lg,fontWeight:800,color:c.t1}}>{OF.filter(o=>new Date(o.tl)>=new Date()).length}</div>
          <div style={{fontSize:L.fs.xs,color:c.t3}}>Active Offers</div>
        </div>
        <div style={{background:c.sh,borderRadius:10,padding:'8px 10px',textAlign:'center'}}>
          <div style={{fontSize:L.fs.lg,fontWeight:800,color:c.t1}}>{AC.length}</div>
          <div style={{fontSize:L.fs.xs,color:c.t3}}>Cards</div>
        </div>
        <div style={{background:c.sh,borderRadius:10,padding:'8px 10px',textAlign:'center'}}>
          <div style={{fontSize:L.fs.lg,fontWeight:800,color:c.t1}}>{SC.length}</div>
          <div style={{fontSize:L.fs.xs,color:c.t3}}>Categories</div>
        </div>
      </div>

      {liveStatus?.ts&&(
        <div style={{fontSize:L.fs.xs+1,color:c.t3,marginTop:10,textAlign:'center'}}>
          Last synced: {new Date(liveStatus.ts).toLocaleString('en-IN',{hour:'2-digit',minute:'2-digit',day:'numeric',month:'short'})}
        </div>
      )}
      {liveStatus?.err&&(
        <div style={{fontSize:L.fs.xs+1,color:c.lv,marginTop:6,textAlign:'center'}}>
          Sync error: {liveStatus.err}
        </div>
      )}
      {!SUPABASE_URL&&(
        <div style={{fontSize:L.fs.xs+1,color:c.a,marginTop:10,textAlign:'center',lineHeight:1.5}}>
          Configure SUPABASE_URL and SUPABASE_ANON_KEY to enable live offer updates via the scraping pipeline
        </div>
      )}
    </div>

    <div style={{fontSize:L.fs.xs+1,fontWeight:600,color:c.t3,letterSpacing:0.8,marginBottom:10,marginTop:28}}>ABOUT</div>
    <div style={rs}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#a78bfa,#818cf8)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <CreditCard size={16} color="#fff"/>
        </div>
        <div>
          <div style={{fontSize:L.fs.md+1,fontWeight:600,color:c.t1}}>Card Optimizer</div>
          <div style={{fontSize:L.fs.sm,color:c.t3,marginTop:1}}>v3.0.0 · {OF.length} offers · {AC.length} cards · {SC.length} categories</div>
        </div>
      </div>
    </div>
    <div style={{height:80}}/>
  </div>);
}

function Tg({on,fn,cl,c}){
  return(
    <button onClick={fn} style={{
      width:48,height:28,borderRadius:14,
      background:on?cl:c.b,
      border:'none',cursor:'pointer',position:'relative',
      transition:'background 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      flexShrink:0,padding:0,
      boxShadow:on?'0 0 12px '+(cl+'40'):'none',
    }}>
      <div style={{
        width:22,height:22,borderRadius:11,
        background:'#fff',position:'absolute',top:3,
        left:on?23:3,
        transition:'left 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        boxShadow:'0 1px 4px rgba(0,0,0,0.3)',
      }}/>
    </button>
  );
}
