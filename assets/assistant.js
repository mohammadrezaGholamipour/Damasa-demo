/* دستیار هوشمند انتخاب چیلر – دمآسا انرژی (نسخه دمو)
   مستقل از بیلد Vue؛ فقط با دو تگ در index.html لود می‌شود. */
(function () {
  'use strict';

  /* ============ تنظیمات (فقط همین بخش را ویرایش کن) ============ */

var CONFIG = {
  provider: 'openai',
  apiKey: 'aa-s9KJfQNjKtVn2uc36yGSCBEed5aoKkBtD9CIyxRYMIvVrLZ4',
  model: 'gpt-6-luna',
  baseUrl: 'https://api.avalai.ir/v1/chat/completions',
  timeoutMs: 30000,
  imgExt: 'png'
};

  /* نمونه‌ی OpenRouter رایگان:
     provider:'openai', baseUrl:'https://openrouter.ai/api/v1/chat/completions',
     model:'meta-llama/llama-3.3-70b-instruct:free', apiKey:'sk-or-...'
     نمونه‌ی بدون کلید (در دسترس بودنش را خودت تست کن):
     provider:'openai', baseUrl:'https://text.pollinations.ai/openai', model:'openai', apiKey:'' */

  /* ============ کاتالوگ (کپی از برنامه) ============ */
  // v: [مبرد، ظرفیت نامی TR، ظرفیت واقعی TR، ظرفیت واقعی kW، توان kW]
  var CAT = [
    { id: 'CCT-40', s: 'c', v: [['R407c', 40, 33, 115.6, 34], ['R134a', 40, 22, 77.6, 24.8], ['R410a', 40, 33, 115.6, 35]] },
    { id: 'CCT-50', s: 'c', v: [['R407c', 48, 37.7, 132.4, 39.3], ['R134a', 48, 25.7, 90.4, 38.3], ['R410a', 48, 39.5, 138.8, 41.6]] },
    { id: 'CCT-60', s: 'c', v: [['R407c', 60, 48, 168.8, 51], ['R134a', 60, 33, 116, 38], ['R410a', 60, 48.3, 170, 51]] },
    { id: 'CMS-20', s: 'c', v: [['R407c', 20, 16.9, 57.8, 18], ['R134a', 20, 11, 38.8, 13.4], ['R410a', 20, 16.9, 57.8, 18]] },
    { id: 'CMS-24', s: 'c', v: [['R407c', 24, 18.8, 66.2, 20], ['R134a', 24, 12.85, 45.2, 15], ['R410a', 24, 19.7, 69.4, 21.2]] },
    { id: 'CMS-30', s: 'c', v: [['R407c', 30, 24, 84.4, 25.8], ['R134a', 30, 16.5, 58, 19], ['R410a', 30, 24.15, 85, 26]] },
    { id: 'CMS-4', s: 'm', v: [['R22', 4, 3, 10.8, 3.8], ['R410a', 4.5, 3.5, 12.5, 4.25]] },
    { id: 'CMS-5', s: 'm', v: [['R22', 5, 4, 13.9, 4.5], ['R410a', 5, 4.15, 14.6, 4.8]] },
    { id: 'CMS-6', s: 'm', v: [['R22', 6, 4.5, 15.8, 5.04], ['R410a', 6, 4.7, 16.65, 5.45]] }
  ];
  var TYPES = {
    res: { t: 'مسکونی', w: 90 }, office: { t: 'اداری', w: 120 }, hotel: { t: 'هتل', w: 110 },
    hosp: { t: 'درمانی', w: 140 }, shop: { t: 'تجاری', w: 160 }, hall: { t: 'رستوران و سالن', w: 220 }
  };
  var FRESH = { low: 10, mid: 20, high: 30 };
  var FRESH_T = { low: 'کم', mid: 'متوسط', high: 'زیاد' };
  var TR = 3.517, SAFETY = 10, DEF_AMBIENT = 40;
  var ALL_KW = [];
  CAT.forEach(function (m) { m.v.forEach(function (x) { ALL_KW.push(x[3]); }); });
  var MAX_KW = Math.max.apply(null, ALL_KW), MIN_KW = Math.min.apply(null, ALL_KW);

  /* ============ ابزارها ============ */
  var fa = function (n, d) { return Number(n).toLocaleString('fa-IR', { maximumFractionDigits: d || 0 }); };
  var toLatin = function (s) {
    return String(s).replace(/[۰-۹]/g, function (c) { return c.charCodeAt(0) - 1776; })
      .replace(/[٠-٩]/g, function (c) { return c.charCodeAt(0) - 1632; });
  };
  function h(tag, props) {
    var el = document.createElement(tag);
    props = props || {};
    Object.keys(props).forEach(function (k) {
      if (k === 'class') el.className = props[k];
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), props[k]);
      else el.setAttribute(k, props[k]);
    });
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c == null || c === false) continue;
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return el;
  }
  var imgUrl = function (m) {
    return encodeURI('./assets/' + (m.s === 'm' ? 'مینی چیلر هواخنک مدل بغل زن' : 'چیلر هواخنک اسکرال') + '.' + CONFIG.imgExt);
  };

  /* ============ وضعیت ============ */
  var history = [];      // [{role:'user'|'assistant', text}]
  var params = {};       // پارامترهای جمع‌شده
  var busy = false, typeAsked = false, lastSent = 0, lastUserText = null;

  /* ============ پرامپت ============ */
  function systemPrompt() {
    var cat = CAT.map(function (m) {
      var kws = m.v.map(function (x) { return x[3]; });
      return m.id + (m.s === 'm' ? ' (mini)' : '') + ': ' + Math.min.apply(null, kws) + '-' + Math.max.apply(null, kws) + ' kW';
    }).join('; ');
    return [
      'You are the smart assistant of "DamaSa Energy" (دمآسا انرژی), helping users pick an air-cooled scroll chiller or mini-chiller.',
      'Always reply in Persian (Farsi), friendly and short. You only EXTRACT parameters and talk to the user; the app itself computes load and picks models from the real catalog. Never invent models or numbers.',
      'Catalog (real capacity at 35C): ' + cat + '. Refrigerants: R407c, R134a, R410a, R22 (mini only).',
      'Reply with ONLY one JSON object, no markdown:',
      '{"action":"ask|recommend|info|unsupported|off_topic","message":"Persian text, 1-3 sentences","params":{"type":"res|office|hotel|hosp|shop|hall|null","total_area":number|null,"floors":number|null,"area_per_floor":number|null,"load_kw":number|null,"ambient":number|null,"fresh":"low|mid|high|null","refrigerant":"R407c|R134a|R410a|R22|null"}}',
      'Rules:',
      '- Users phrase things freely ("برای ساختمون ۳ طبقه چیلر می‌خوام", "یه هتل ۲۰۰۰ متری"). Understand the meaning, not exact words. Convert Persian digits.',
      '- type: مسکونی/آپارتمان/ویلا=res, اداری/شرکت=office, هتل=hotel, بیمارستان/درمانگاه/درمانی=hosp, مغازه/مرکز خرید/تجاری=shop, رستوران/سالن/تالار=hall.',
      '- load_kw only if the user states a cooling load; convert tons of refrigeration x3.517, BTU/h x0.00029307.',
      '- Put in params ONLY what the user actually said (now or earlier). Never guess area. Use null for unknown.',
      '- If area (total, or floors together with area per floor) or building type is missing and no load_kw is given: action="ask" and ask ONE short natural question (you may ask area and type together).',
      '- If enough info: action="recommend" and message = one short friendly sentence (do not list models).',
      '- Questions about the catalog, capacities or differences: action="info", answer from the catalog above only.',
      '- Heating, pool, pumps, fan coil, air handler, cooling tower, etc: action="unsupported" and say the demo currently covers only chillers and mini-chillers.',
      '- Anything unrelated: action="off_topic" and politely steer back to chiller selection.',
      'Parameters known so far: ' + JSON.stringify(params)
    ].join('\n');
  }

  /* ============ تماس با مدل ============ */
  function fail(code) { var e = new Error(code); e.code = code; return e; }

  async function callLLM(userText) {
    if (!CONFIG.apiKey && !(CONFIG.provider === 'openai' && CONFIG.baseUrl)) throw fail('nokey');
    if (!navigator.onLine) throw fail('offline');
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, CONFIG.timeoutMs);
    var msgs = history.slice(-12).concat([{ role: 'user', text: userText }]);
    var url, headers = { 'Content-Type': 'application/json' }, body;
    if (CONFIG.provider === 'gemini') {
      url = 'https://generativelanguage.googleapis.com/v1beta/models/' + CONFIG.model + ':generateContent?key=' + encodeURIComponent(CONFIG.apiKey);
      body = {
        systemInstruction: { parts: [{ text: systemPrompt() }] },
        contents: msgs.map(function (m) { return { role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }; }),
        generationConfig: { temperature: 0.2, responseMimeType: 'application/json' }
      };
    } else {
      url = CONFIG.baseUrl;
      if (CONFIG.apiKey) headers.Authorization = 'Bearer ' + CONFIG.apiKey;
      body = {
        model: CONFIG.model, temperature: 0.2,
        messages: [{ role: 'system', content: systemPrompt() }].concat(
          msgs.map(function (m) { return { role: m.role, content: m.text }; }))
      };
    }
    var res;
    try {
      res = await fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(body), signal: ctrl.signal });
    } catch (e) {
      throw fail(e && e.name === 'AbortError' ? 'timeout' : 'network');
    } finally { clearTimeout(timer); }
    if (res.status === 429) throw fail('rate');
    if (res.status === 401 || res.status === 403) throw fail('auth');
    if (res.status === 400 && CONFIG.provider === 'gemini') throw fail('auth');
    if (!res.ok) throw fail('http');
    var data;
    try { data = await res.json(); } catch (e) { throw fail('parse'); }
    var raw = CONFIG.provider === 'gemini'
      ? (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts || []).map(function (p) { return p.text || ''; }).join('')
      : (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
    if (!raw) throw fail('empty');
    var obj = parseJSON(raw);
    if (!obj) throw fail('parse');
    return { raw: raw, obj: obj };
  }

  function parseJSON(s) {
    s = String(s).replace(/```json|```/g, '').trim();
    try { return JSON.parse(s); } catch (e) { /* ادامه */ }
    var m = s.match(/\{[\s\S]*\}/);
    if (m) { try { return JSON.parse(m[0]); } catch (e) { /* هیچ */ } }
    return null;
  }

  var ERR = {
    nokey: 'دستیار هنوز تنظیم نشده است. کلید API را در بالای فایل assistant.js وارد کنید. تا آن موقع می‌توانید از «شروع محاسبه» استفاده کنید.',
    offline: 'اینترنت شما قطع است. اتصال را بررسی کنید و دوباره تلاش کنید.',
    network: 'ارتباط با سرویس هوشمند برقرار نشد. اینترنت یا فیلترشکن خود را بررسی کنید و دوباره تلاش کنید.',
    timeout: 'پاسخ دیر رسید. دوباره تلاش کنید.',
    rate: 'تعداد درخواست‌ها از سقف نسخه رایگان بیشتر شد. چند ثانیه صبر کنید و دوباره تلاش کنید.',
    auth: 'کلید API یا نام مدل معتبر نیست. تنظیمات assistant.js را بررسی کنید.',
    http: 'سرویس هوشمند موقتاً مشکل دارد. کمی بعد دوباره تلاش کنید.',
    parse: 'پاسخ سرویس قابل فهم نبود. دوباره تلاش کنید یا سؤال را کمی ساده‌تر بنویسید.',
    empty: 'سرویس پاسخی نداد. دوباره تلاش کنید.'
  };

  /* ============ محاسبه و انتخاب (همان منطق برنامه) ============ */
  var num = function (v, min, max) { v = Number(v); return isFinite(v) && v >= min && v <= max ? v : null; };

  function mergeParams(p) {
    if (!p || typeof p !== 'object') return;
    if (p.type && TYPES[p.type]) params.type = p.type;
    var a = num(p.total_area, 1, 1e6); if (a) params.total_area = a;
    var f = num(p.floors, 1, 200); if (f) params.floors = Math.round(f);
    var apf = num(p.area_per_floor, 1, 1e5); if (apf) params.area_per_floor = apf;
    var l = num(p.load_kw, 1, 1e5); if (l) params.load_kw = l;
    var t = num(p.ambient, 20, 60); if (t) params.ambient = t;
    if (p.fresh && FRESH[p.fresh]) params.fresh = p.fresh;
    if (['R407c', 'R134a', 'R410a', 'R22'].indexOf(p.refrigerant) > -1) params.refrigerant = p.refrigerant;
  }

  function analyze() {
    var p = params, missing = [], assumptions = [], req, desc;
    if (p.load_kw) {
      req = p.load_kw; desc = 'بار سرمایی اعلام‌شده';
    } else {
      var area = p.total_area || (p.floors && p.area_per_floor ? p.floors * p.area_per_floor : null);
      if (!area) missing.push(p.floors ? 'area_per_floor' : 'area');
      var type = p.type;
      if (!type) {
        if (typeAsked) { type = 'office'; assumptions.push('کاربری مشخص نشد؛ «اداری» فرض شد'); }
        else missing.push('type');
      }
      if (missing.length) return { missing: missing };
      var fr = p.fresh || 'mid';
      if (!p.fresh) assumptions.push('هوای تازه «متوسط» (۲۰٪) فرض شد');
      req = area * TYPES[type].w / 1000 * (1 + FRESH[fr] / 100);
      desc = TYPES[type].t + '، حدود ' + fa(area) + ' متر مربع' + (p.floors ? ' (' + fa(p.floors) + ' طبقه)' : '');
    }
    assumptions.push('ضریب اطمینان ' + fa(SAFETY) + '٪ در نظر گرفته شد');
    if (!p.ambient) assumptions.push('دمای هوای طراحی ' + fa(DEF_AMBIENT) + '°C فرض شد');
    req = req * (1 + SAFETY / 100);
    return { missing: [], req: req, desc: desc, assumptions: assumptions, ambient: p.ambient || DEF_AMBIENT };
  }

  function pick(req, ref) {
    var out = [];
    CAT.forEach(function (m) {
      for (var n = 1; n <= 3; n++) {
        var ok = m.v.filter(function (x) { return (!ref || x[0] === ref) && n * x[3] >= req; });
        if (ok.length) {
          var v = ok.reduce(function (a, b) { return a[3] <= b[3] ? a : b; });
          var total = n * v[3], over = (total / req - 1) * 100;
          if (over <= 60) out.push({ m: m, v: v, n: n, total: total, over: over });
          break;
        }
      }
    });
    out.sort(function (a, b) { return a.n - b.n || a.over - b.over; });
    return out.slice(0, 4);
  }

  function noMatchText(req, ref) {
    var pool = [];
    CAT.forEach(function (m) { m.v.forEach(function (x) { if (!ref || x[0] === ref) pool.push(x[3]); }); });
    if (!pool.length) return 'برای مبرد ' + ref + ' مدلی در کاتالوگ نیست. مبرد دیگری را امتحان کنید.';
    if (req > Math.max.apply(null, pool) * 3) return 'نیاز شما حدود ' + fa(req) + ' کیلووات است و از بزرگ‌ترین ترکیب کاتالوگ (۳ دستگاه هم‌مدل) بیشتر است. برای این پروژه لطفاً با کارشناس شرکت مشورت کنید.';
    if (req * 1.6 < Math.min.apply(null, pool)) return 'نیاز شما حدود ' + fa(req) + ' کیلووات است و از کوچک‌ترین مدل کاتالوگ خیلی کمتر است.';
    return 'برای نیاز ' + fa(req) + ' کیلووات' + (ref ? ' با مبرد ' + ref : '') + ' مدلی با مازاد معقول پیدا نشد. مبرد دیگری را امتحان کنید یا مقادیر را تغییر دهید.';
  }

  function fallbackQuestion(missing) {
    if (missing.indexOf('area_per_floor') > -1) return 'زیربنای هر طبقه حدوداً چند متر مربع است؟ ساختمان چه کاربری‌ای دارد (مسکونی، اداری، هتل، ...)؟';
    if (missing.indexOf('area') > -1 && missing.indexOf('type') > -1) return 'برای محاسبه دقیق‌تر، زیربنای ساختمان (کل یا هر طبقه) چقدر است و کاربری آن چیست (مسکونی، اداری، هتل، تجاری، ...)؟';
    if (missing.indexOf('area') > -1) return 'زیربنای ساختمان (کل یا هر طبقه) حدوداً چند متر مربع است؟';
    return 'کاربری ساختمان چیست؟ مسکونی، اداری، هتل، درمانی، تجاری یا رستوران و سالن؟';
  }

  /* ============ رابط ============ */
  var fab, panel, body, input, sendBtn, chips;

  function scrollDown() { body.scrollTop = body.scrollHeight; }
  function bubble(kind, content) {
    var b = h('div', { class: 'dmx-msg ' + kind });
    if (typeof content === 'string') b.textContent = content; else if (content) b.appendChild(content);
    body.appendChild(b); scrollDown(); return b;
  }

  function resultNode(a, list) {
    var wrap = h('div', { class: 'dmx-res' });
    wrap.appendChild(h('div', { class: 'dmx-head' },
      'برای ' + a.desc + '، ظرفیت موردنیاز حدود ',
      h('b', {}, fa(a.req) + ' کیلووات'), ' (' + fa(a.req / TR, 1) + ' تن تبرید) است.'));
    if (a.ambient > 35) wrap.appendChild(h('div', { class: 'dmx-warn' },
      'ظرفیت‌های کاتالوگ برای هوای ۳۵°C است و در ' + fa(a.ambient) + '°C کمتر می‌شود. با کارشناس شرکت هم چک کنید.'));
    if (!list.length) {
      wrap.appendChild(h('div', { class: 'dmx-empty' }, noMatchText(a.req, params.refrigerant)));
    } else {
      list.forEach(function (r, i) {
        var tag = r.over <= 15 ? ['مناسب‌ترین', 'ok'] : r.over <= 30 ? ['مناسب', 'mid'] : ['مازاد زیاد', 'hi'];
        var img = h('img', { src: imgUrl(r.m), alt: r.m.id, loading: 'lazy' });
        img.addEventListener('error', function () { img.parentNode.style.display = 'none'; });
        wrap.appendChild(h('div', { class: 'dmx-card' + (i === 0 ? ' first' : '') },
          h('div', { class: 'dmx-img' }, img),
          h('div', { class: 'dmx-info' },
            h('div', { class: 'dmx-t' }, h('b', {}, (r.n > 1 ? fa(r.n) + '× ' : '') + r.m.id),
              h('span', { class: 'dmx-pill' }, r.m.s === 'm' ? 'مینی‌چیلر' : 'چیلر'),
              h('span', { class: 'dmx-pill ref' }, r.v[0]),
              h('span', { class: 'dmx-tag ' + tag[1] }, tag[0])),
            h('div', { class: 'dmx-m' }, 'ظرفیت کل ' + fa(r.total) + ' kW · مازاد ' + fa(r.over) + '٪'),
            h('div', { class: 'dmx-m' }, 'هر دستگاه ' + fa(r.v[3], 1) + ' kW · توان مصرفی ' + fa(r.v[4], 1) + ' kW'))));
      });
    }
    wrap.appendChild(h('div', { class: 'dmx-note' }, 'فرض‌ها: ' + a.assumptions.join('؛ ') + '.'));
    wrap.appendChild(h('div', { class: 'dmx-act' },
      h('button', { type: 'button', onclick: function () { location.hash = '/calc'; panel.hidden = true; fab.hidden = false; } }, 'محاسبه دقیق‌تر در ماشین‌حساب'),
      h('button', { type: 'button', onclick: function () { location.hash = '/products'; panel.hidden = true; fab.hidden = false; } }, 'مشاهده کاتالوگ')));
    wrap.appendChild(h('div', { class: 'dmx-note' }, 'ضرایب بار ساختمان برآورد اولیه‌اند و جایگزین محاسبه دقیق نیستند.'));
    return wrap;
  }

  function setBusy(v) {
    busy = v; sendBtn.disabled = v; input.disabled = v;
    panel.setAttribute('aria-busy', v ? 'true' : 'false');
    if (!v) input.focus();
  }

  function typing() {
    var t = h('div', { class: 'dmx-msg bot dmx-typing' }, h('span', { class: 'dmx-dots' }, h('i'), h('i'), h('i')), h('span', { class: 'dmx-tt' }, 'در حال بررسی درخواست شما…'));
    body.appendChild(t); scrollDown();
    var slow = setTimeout(function () { var s = t.querySelector('.dmx-tt'); if (s) s.textContent = 'کمی طول کشید، هنوز در حال پردازش هستم…'; }, 8000);
    return function () { clearTimeout(slow); t.remove(); };
  }

  function errorBubble(code) {
    var box = h('div', {}, ERR[code] || ERR.http);
    if (code !== 'nokey' && code !== 'auth') {
      box.appendChild(h('div', { class: 'dmx-retry' }, h('button', { type: 'button', onclick: function () { b.remove(); send(lastUserText, true); } }, 'تلاش دوباره')));
    }
    var b = bubble('bot err', box);
  }

  async function send(text, isRetry) {
    text = toLatin(String(text || '')).trim();
    if (busy) return;
    if (!text) { input.focus(); return; }
    if (text.length > 500) text = text.slice(0, 500);
    if (Date.now() - lastSent < 800) return;
    lastSent = Date.now();
    if (chips) { chips.remove(); chips = null; }
    if (!isRetry) bubble('user', text);
    lastUserText = text;
    input.value = ''; autoGrow();
    setBusy(true);
    var stop = typing(), r;
    try { r = await callLLM(text); }
    catch (e) { stop(); setBusy(false); errorBubble(e.code || 'http'); return; }
    stop();
    history.push({ role: 'user', text: text }, { role: 'assistant', text: r.raw });
    var o = r.obj, act = String(o.action || '');
    var msg = typeof o.message === 'string' ? o.message.trim() : '';
    mergeParams(o.params);
    if (act === 'off_topic' || act === 'unsupported' || act === 'info') {
      bubble('bot', msg || 'من فقط در انتخاب چیلر و مینی‌چیلر کمک می‌کنم. ساختمان شما چه مشخصاتی دارد؟');
    } else {
      var a = analyze();
      if (a.missing.length) {
        if (a.missing.indexOf('type') > -1) typeAsked = true;
        bubble('bot', act === 'ask' && msg ? msg : fallbackQuestion(a.missing));
      } else {
        if (msg && act === 'recommend') bubble('bot', msg);
        bubble('bot wide', resultNode(a, pick(a.req, params.refrigerant)));
      }
    }
    setBusy(false);
  }

  function reset() {
    history = []; params = {}; typeAsked = false; busy = false; lastUserText = null;
    body.textContent = ''; setBusy(false); welcome();
  }

  function welcome() {
    bubble('bot', 'سلام! من دستیار هوشمند دمآسا انرژی هستم. بگویید برای چه ساختمانی چیلر می‌خواهید تا مدل‌های مناسب کاتالوگ را نشان بدهم. اگر اطلاعاتی کم باشد، خودم می‌پرسم.');
    chips = h('div', { class: 'dmx-chips' });
    ['چیلر برای ساختمان ۳ طبقه', 'هتل ۲۰۰۰ متری در هوای ۴۵ درجه', 'بار سرمایی ما ۱۵۰ کیلووات است', 'مینی‌چیلر برای آپارتمان ۱۲۰ متری'].forEach(function (s) {
      chips.appendChild(h('button', { type: 'button', onclick: function () { send(s); } }, s));
    });
    body.appendChild(chips);
  }

  function autoGrow() { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 110) + 'px'; }

  function build() {
    fab = h('button', { class: 'dmx-fab', type: 'button', 'aria-label': 'باز کردن دستیار هوشمند', onclick: function () { panel.hidden = false; fab.hidden = true; input.focus(); } },
      h('span', { 'aria-hidden': 'true' }, '✦'), h('span', { class: 'dmx-fab-t' }, 'دستیار هوشمند'));
    input = h('textarea', { rows: '1', maxlength: '500', placeholder: 'مثلاً: چیلر برای ساختمان ۳ طبقه…', 'aria-label': 'پیام شما' });
    input.addEventListener('input', autoGrow);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); send(input.value); }
    });
    sendBtn = h('button', { class: 'dmx-send', type: 'button', 'aria-label': 'ارسال', onclick: function () { send(input.value); } }, '➤');
    body = h('div', { class: 'dmx-body', 'aria-live': 'polite' });
    panel = h('section', { class: 'dmx-panel', dir: 'rtl', hidden: '', role: 'dialog', 'aria-label': 'دستیار هوشمند انتخاب چیلر' },
      h('header', {}, h('b', {}, '✦ دستیار هوشمند'),
        h('span', { class: 'dmx-hb' },
          h('button', { type: 'button', onclick: reset, title: 'گفتگوی جدید' }, '↻'),
          h('button', { type: 'button', onclick: function () { panel.hidden = true; fab.hidden = false; }, 'aria-label': 'بستن' }, '✕'))),
      body,
      h('footer', {}, input, sendBtn),
      h('div', { class: 'dmx-foot' }, 'نسخه نمایشی؛ پاسخ‌ها راهنمای اولیه‌اند.'));
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { panel.hidden = true; fab.hidden = false; } });
    document.body.appendChild(fab); document.body.appendChild(panel);
    welcome();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
