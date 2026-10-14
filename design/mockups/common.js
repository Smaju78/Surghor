/* Surghor mockups — shared radio engine.
   Same data logic as the live /index.html (moods, time/season cut-offs, learning, queue building,
   YouTube IFrame player); only the rendering is left to each concept page via callbacks.
   Test overrides on the query string: ?h=19 (hour) ?season=Hemanta ?theme=dark|light */
(function () {
  "use strict";

  /* ---------- Shared moods: each maps to the moods each site already uses ---------- */
  const MOODS = {
    calm:    { bn: "শান্ত",   en: "Calm",     hint: "ধীর, স্থির, স্নিগ্ধ",        tagore: ["shanti"],                    raag: ["shanta"],   piano: ["Calm", "Contemplative"] },
    bhakti:  { bn: "ভক্তি",   en: "Devotion", hint: "প্রার্থনা, সমর্পণ",         tagore: ["bhakti"],                    raag: ["bhakti"],   piano: ["Contemplative"] },
    prem:    { bn: "প্রেম",   en: "Love",     hint: "মিলন, কোমলতা",             tagore: ["prem"],                      raag: ["shringar"], piano: ["Tender", "Passionate"] },
    viraha:  { bn: "বিরহ",   en: "Longing",  hint: "প্রতীক্ষা, দূরের জন",       tagore: ["viraha", "bishad", "smriti"], raag: ["karuna"],   piano: ["Melancholy"] },
    ananda:  { bn: "আনন্দ",  en: "Joy",      hint: "উল্লাস, উৎসব",             tagore: ["ananda", "utsav", "kautuk"], raag: ["ullas"],    piano: ["Joyful", "Playful", "Dancing"] },
    prakriti:{ bn: "প্রকৃতি", en: "Nature",   hint: "আকাশ, বৃষ্টি, ঋতু",         tagore: ["prakriti-bhava"],            raag: ["shanta"],   piano: ["Dreamy"] },
    sahas:   { bn: "সাহস",   en: "Courage",  hint: "জাগরণ, দৃঢ়তা",             tagore: ["sahas", "deshprem"],         raag: ["gambhir"],  piano: ["Heroic", "Stormy"] },
  };
  const SRC = {
    tagore: { bn: "রবীন্দ্রসঙ্গীত", short: "রবি", en: "Anandadhara", c: "var(--tagore)", url: "/Anandadhara/", data: "/Anandadhara/songs.json" },
    raag:   { bn: "রাগ",           short: "রাগ", en: "Raagmala",    c: "var(--raag)",   url: "/Raagmala/",    data: "/Raagmala/raagmala.json" },
    piano:  { bn: "পিয়ানো",         short: "পিয়ানো", en: "Piano",    c: "var(--piano)",  url: "/Piano/",       data: "/Piano/works.json" },
  };

  /* ---------- Time and season (same cut-offs as the live page / Anandadhara) ---------- */
  const Q = new URLSearchParams(location.search);
  const SEASONS = { Grishma: "গ্রীষ্ম", Barsha: "বর্ষা", Sharat: "শরৎ", Hemanta: "হেমন্ত", Sheet: "শীত", Basanta: "বসন্ত" };
  const SEASON_EN = { Grishma: "Grishma · summer", Barsha: "Barsha · monsoon", Sharat: "Sharat · autumn", Hemanta: "Hemanta · late autumn", Sheet: "Sheet · winter", Basanta: "Basanta · spring" };
  function now() { const d = new Date(); if (Q.get("h") !== null) d.setHours(+Q.get("h"), 0, 0, 0); return d; }
  function currentSeason(d = now()) {
    if (Q.get("season") && SEASONS[Q.get("season")]) return Q.get("season");
    const md = (d.getMonth() + 1) * 100 + d.getDate();
    if (md >= 414 && md < 615) return "Grishma";
    if (md >= 615 && md < 817) return "Barsha";
    if (md >= 817 && md < 1018) return "Sharat";
    if (md >= 1018 && md < 1216) return "Hemanta";
    if (md >= 1216 || md < 213) return "Sheet";
    return "Basanta";
  }
  // Raagmala's 8 prahars: 1 = 6–9 am … 7 = 0–3, 8 = 3–6.
  const prahar = (h) => h >= 6 ? Math.floor((h - 6) / 3) + 1 : (h < 3 ? 7 : 8);
  const PART = [[5, 9, "ভোর", "early morning", ["bhakti", "calm"]], [9, 12, "সকাল", "morning", ["ananda", "prakriti"]],
    [12, 16, "দুপুর", "afternoon", ["prakriti", "calm"]], [16, 19, "বিকেল", "late afternoon", ["viraha", "prem"]],
    [19, 22, "সন্ধ্যা", "evening", ["prem", "bhakti"]], [22, 29, "রাত", "night", ["calm", "viraha"]]];
  function dayPart(h) { const x = h < 5 ? h + 24 : h; return PART.find(([a, b]) => x >= a && x < b); }
  const PART_KEY = { "ভোর": "dawn", "সকাল": "morning", "দুপুর": "noon", "বিকেল": "afternoon", "সন্ধ্যা": "evening", "রাত": "night" };
  function context() {
    const d = now(), part = dayPart(d.getHours()), season = currentSeason(d);
    return { d, part, partBn: part[2], partEn: part[3], partKey: PART_KEY[part[2]], season, seasonBn: SEASONS[season], seasonEn: SEASON_EN[season], prahar: prahar(d.getHours()) };
  }

  /* ---------- Small helpers ---------- */
  const bn = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const BN_MONTHS = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
  const dateBn = (d = now()) => `${bn(d.getDate())} ${BN_MONTHS[d.getMonth()]}`;
  const dateEn = (d = now()) => d.toLocaleDateString("en-IN", { day: "numeric", month: "long" });
  // Theme override for screenshots and a toggle: ?theme=dark|light sets data-theme on <html>.
  if (Q.get("theme")) document.documentElement.dataset.theme = Q.get("theme");

  /* ---------- What the radio has learned (this browser only) ---------- */
  const KEY = "surghor.v1";
  function loadMem() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } }
  let mem = Object.assign({ mood: {}, src: {}, liked: [], skipped: [], played: [] }, loadMem());
  function saveMem() { try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch {} }
  const bump = (obj, k, d) => { obj[k] = Math.max(-5, Math.min(10, (obj[k] || 0) + d)); };
  const keepLast = (arr, n) => arr.splice(0, Math.max(0, arr.length - n));

  function guessMood() {
    const d = now(), part = dayPart(d.getHours());
    const score = {};
    Object.keys(MOODS).forEach((m) => { score[m] = (mem.mood[part[3] + ":" + m] || 0) * 0.6; });
    score[part[4][0]] += 3; score[part[4][1]] += 2;
    const s = currentSeason(d);
    if (s === "Barsha" || s === "Basanta") score.prakriti += 1.5;
    return Object.entries(score).sort((a, b) => b[1] - a[1])[0][0];
  }

  /* ---------- Data: loaded only when the radio starts ---------- */
  let data = null;
  async function loadData(status) {
    if (data) return data;
    status("গান আনা হচ্ছে…");
    const get = (u) => fetch(u).then((r) => { if (!r.ok) throw new Error(u); return r.json(); }).catch(() => null);
    const [a, r, p] = await Promise.all([get(SRC.tagore.data), get(SRC.raag.data), get(SRC.piano.data)]);
    data = { tagore: a, raag: r, piano: p };
    const missing = Object.keys(data).filter((k) => !data[k]).map((k) => SRC[k].bn);
    status(missing.length ? `আনা গেল না: ${missing.join(", ")}` : "");
    return data;
  }

  const pickVideo = (vs) => vs && vs.length ? vs[Math.floor(Math.random() * Math.min(vs.length, 3))] : null;
  function candidates(src, m) {
    const want = new Set(MOODS[m][src]), d = data[src], ph = prahar(now().getHours()), season = currentSeason();
    const out = [];
    if (src === "tagore" && d) {
      for (const s of d.songs) {
        if (!s.videos || !s.videos.length || !(s.moods || []).some((x) => want.has(x))) continue;
        const v = pickVideo(s.videos);
        let w = 1 + Math.log10((v.views || 1) + 1) / 3;
        if (m === "prakriti" && s.season === season) w += 3;
        out.push({ src, key: "t:" + s.id, vid: v.id, title: s.bn, sub: [s.en, (v.singers || []).join(", ")].filter(Boolean).join(" · "), sec: v.sec, link: SRC.tagore.url + "#/song/" + encodeURIComponent(s.id), w });
      }
    }
    if (src === "raag" && d) {
      const vids = d.videos || {};
      for (const r of d.raags) {
        const byForm = Object.values(r.videos || {}).flat(); if (!byForm.length) continue;
        const moodHit = (r.moods || []).some((x) => want.has(x)), timeHit = (r.prahar || []).includes(ph);
        const seasonRaag = (season === "Barsha" && /malhar|megh|desh/.test(r.id)) || (season === "Basanta" && /basant|bahar|hindol/.test(r.id));
        if (!timeHit && !(m === "prakriti" && seasonRaag)) continue;
        let w = (moodHit ? 3 : 0.4) + (seasonRaag ? 2 : 0);
        const id = byForm[Math.floor(Math.random() * Math.min(byForm.length, 4))], v = vids[id] || {};
        const artist = (v.artists || []).map((a) => (d.artists.find((x) => x.id === a) || {}).bn || (d.artists.find((x) => x.id === a) || {}).en || a).join(", ");
        out.push({ src, key: "r:" + r.id, vid: id, title: `রাগ ${r.bn}`, sub: [r.en, artist, v.form].filter(Boolean).join(" · "), sec: v.sec, link: SRC.raag.url + "#/raag/" + encodeURIComponent(r.id), w });
      }
    }
    if (src === "piano" && d) {
      const comp = d.meta.composers || [];
      for (const wk of d.works) {
        if (!wk.v || !wk.v.length || !(wk.moods || []).some((x) => want.has(x))) continue;
        const v = pickVideo(wk.v), c = comp[wk.c] || {};
        out.push({ src, key: "p:" + wk.id, vid: v.id, title: wk.t, sub: [c.n, wk.cat, (v.p || []).join(", ")].filter(Boolean).join(" · "), sec: v.sec, link: SRC.piano.url + "#/work/" + encodeURIComponent(wk.id), w: 1 + (wk.pop || 0) / 40 });
      }
    }
    const liked = new Set(mem.liked), skipped = new Set(mem.skipped), played = new Set(mem.played.slice(-60));
    for (const c of out) {
      if (liked.has(c.key)) c.w *= 2.5;
      if (skipped.has(c.key)) c.w *= 0.1;
      if (played.has(c.key)) c.w *= 0.3;
    }
    return out;
  }
  function weightedTake(list, n) {
    const res = [], pool = list.slice();
    while (res.length < n && pool.length) {
      const tot = pool.reduce((s, c) => s + c.w, 0); let r = Math.random() * tot, i = 0;
      while (i < pool.length - 1 && (r -= pool[i].w) > 0) i++;
      res.push(pool.splice(i, 1)[0]);
    }
    return res;
  }

  /* ---------- The radio object a page drives ----------
     opts: { ytId, sources(): string[], onStatus(text), onMood(mood, guessed), onQueue(queue, pos), onPlaying(bool), onStart() } */
  function createRadio(opts) {
    const o = Object.assign({ ytId: "yt", sources: () => Object.keys(SRC), onStatus() {}, onMood() {}, onQueue() {}, onPlaying() {}, onStart() {} }, opts);
    let mood = guessMood(), guessed = mood, queue = [], pos = 0, yt = null, ytReady = null, started = 0, on = false;

    function build() {
      const srcs = o.sources().filter((s) => data && data[s]);
      if (!srcs.length) { o.onStatus("অন্তত একটা উৎস বেছে নিন।"); return false; }
      const share = Object.fromEntries(srcs.map((s) => [s, Math.max(0.3, 1 + (mem.src[s] || 0) * 0.15)]));
      const lists = Object.fromEntries(srcs.map((s) => [s, weightedTake(candidates(s, mood), 20)]));
      if (lists.raag) share.raag *= 0.6;   // raags run long, so they come less often
      queue = [];
      for (let i = 0; i < 24; i++) {
        const avail = srcs.filter((s) => lists[s].length); if (!avail.length) break;
        const last = queue[queue.length - 1]?.src;
        const opts2 = avail.length > 1 ? avail.filter((s) => s !== last) : avail;
        const tot = opts2.reduce((t, s) => t + share[s], 0); let r = Math.random() * tot;
        const s = opts2.find((x) => (r -= share[x]) <= 0) || opts2[opts2.length - 1];
        queue.push(lists[s].shift());
      }
      pos = 0;
      if (!queue.length) { o.onStatus("এই ভাবের কিছু পাওয়া গেল না।"); return false; }
      o.onStatus("");
      return true;
    }
    function learn(q, how) {
      if (!q) return;
      const part = dayPart(now().getHours())[3];
      if (how === "skip") { bump(mem.mood, part + ":" + mood, -0.5); bump(mem.src, q.src, -0.5); mem.skipped.push(q.key); keepLast(mem.skipped, 300); }
      if (how === "done") { bump(mem.mood, part + ":" + mood, 1); bump(mem.src, q.src, 1); }
      if (how === "like") { bump(mem.mood, part + ":" + mood, 2); bump(mem.src, q.src, 1); }
      saveMem();
    }
    function ensureYT() {
      if (ytReady) return ytReady;
      ytReady = new Promise((res) => {
        window.onYouTubeIframeAPIReady = () => {
          yt = new YT.Player(o.ytId, { width: "100%", height: "100%", playerVars: { autoplay: 1, rel: 0, modestbranding: 1, playsinline: 1 },
            events: {
              onReady: () => { res(yt); if (queue[pos]) yt.loadVideoById(queue[pos].vid); },
              onStateChange: (e) => { o.onPlaying(e.data === 1); if (e.data === 0) { learn(queue[pos], "done"); go(pos + 1); } },
              onError: () => go(pos + 1) } });
        };
        const s = document.createElement("script"); s.src = "https://www.youtube.com/iframe_api";
        s.onerror = () => o.onStatus("ইউটিউব প্লেয়ার আনা গেল না (অফলাইন?)");
        document.head.appendChild(s);
      });
      return ytReady;
    }
    function go(i, why) {
      if (why === "skip" && queue[pos] && Date.now() - started < 60000) learn(queue[pos], "skip");
      if (i >= queue.length) { if (!build()) return; i = 0; }
      if (i < 0) i = 0;
      pos = i; const q = queue[pos];
      mem.played.push(q.key); keepLast(mem.played, 200); saveMem();
      started = Date.now();
      if (yt) yt.loadVideoById(q.vid);
      o.onQueue(queue, pos);
    }
    const R = {
      get mood() { return mood; }, get guessed() { return guessed; }, get queue() { return queue; }, get pos() { return pos; },
      get current() { return queue[pos]; }, get started() { return on; },
      setMood(m) { if (!MOODS[m]) return; mood = m; o.onMood(mood, guessed); if (on && build()) go(0); },
      async play() {
        await loadData(o.onStatus);
        if (!build()) return false;
        on = true; o.onStart();
        go(0);                       // render at once; the embed loads the track when the API is ready
        ensureYT();                  // not awaited: offline, the queue still works
        return true;
      },
      rebuild() { if (build()) go(0); },
      next() { go(pos + 1, "skip"); }, prev() { go(pos - 1); }, jump(i) { go(i, "jump"); },
      toggle() { if (!yt) return; yt.getPlayerState() === 1 ? yt.pauseVideo() : yt.playVideo(); },
      isLiked(q = queue[pos]) { return !!q && mem.liked.includes(q.key); },
      like() {
        const q = queue[pos]; if (!q) return;
        const i = mem.liked.indexOf(q.key);
        if (i >= 0) mem.liked.splice(i, 1); else { mem.liked.push(q.key); learn(q, "like"); }
        saveMem(); o.onQueue(queue, pos);
      },
      sourcesChanged() { if (on && build()) go(0); },
      forget() {
        mem = { mood: {}, src: {}, liked: [], skipped: [], played: [] }; saveMem();
        mood = guessed = guessMood(); o.onMood(mood, guessed);
      },
      guessLine() {   // "এখন সন্ধ্যা, ঋতু হেমন্ত — আজ মনে হচ্ছে প্রেম"
        const c = context();
        return { partBn: c.partBn, seasonBn: c.seasonBn, moodBn: MOODS[guessed].bn, moodEn: MOODS[guessed].en, mood: guessed };
      },
    };
    o.onMood(mood, guessed);
    return R;
  }

  window.Surghor = { MOODS, SRC, SEASONS, context, currentSeason, dayPart, prahar, bn, esc, dateBn, dateEn, createRadio, mem: () => mem,
    fmt(sec) { if (!sec) return ""; const m = Math.floor(sec / 60); return m >= 60 ? `${bn(Math.floor(m / 60))} ঘ ${bn(m % 60)} মি` : `${bn(m)} মি`; } };
})();
