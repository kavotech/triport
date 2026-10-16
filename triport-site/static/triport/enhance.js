/* Triport additions: scroll animations, clickable team cards, quote wizard, and form delivery via /api/quote. */
(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var TEAM = {
    "Micah Bamutura": "micah",
    "Ronald Kaboyo Hamfrey": "kaboyo",
    "Matthew Atuhairwe": "matthew",
    "Norah Amanya": "norah",
    "Oliver Alinaitwe": "oliver"
  };

  /* ---------------- reCAPTCHA + delivery ---------------- */
  var isLocal = ["localhost", "127.0.0.1", "::1"].indexOf(location.hostname) !== -1;
  var SITE_KEY = isLocal ? "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" : "6LclMvEtAAAAAHokwqLt_lHvN-brCb522WsuRopD";
  var captchaPromise = null;
  function loadCaptcha() {
    if (captchaPromise) return captchaPromise;
    captchaPromise = new Promise(function (resolve, reject) {
      if (window.grecaptcha && window.grecaptcha.execute) return resolve(window.grecaptcha);
      var s = document.createElement("script");
      s.src = "https://www.google.com/recaptcha/api.js?render=" + encodeURIComponent(SITE_KEY);
      s.async = true;
      s.onload = function () { resolve(window.grecaptcha); };
      s.onerror = function () { captchaPromise = null; reject(new Error("Could not load reCAPTCHA. Please refresh and try again.")); };
      document.head.appendChild(s);
    });
    return captchaPromise;
  }
  function token() {
    return loadCaptcha().then(function (g) {
      return new Promise(function (resolve, reject) {
        g.ready(function () { g.execute(SITE_KEY, { action: "quote_submit" }).then(resolve, reject); });
      });
    });
  }
  function deliver(fields) {
    return token().then(function (t) {
      return fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: fields, recaptchaToken: t, source: location.href })
      });
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok) throw new Error(data.message || "We could not send your enquiry. Please try again.");
        return data;
      });
    });
  }
  function toast(msg) {
    var t = document.createElement("div");
    t.setAttribute("role", "status");
    t.textContent = msg;
    t.style.cssText = "position:fixed;left:50%;bottom:28px;transform:translate(-50%,20px);opacity:0;z-index:20000;max-width:min(92vw,520px);padding:16px 22px;border-radius:14px;background:#07371a;color:#fff;font:600 15px/1.5 Manrope,sans-serif;box-shadow:0 20px 40px -16px rgba(0,0,0,.45);transition:all .5s cubic-bezier(.2,.75,.24,1)";
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.style.opacity = "1"; t.style.transform = "translate(-50%,0)"; });
    setTimeout(function () { t.style.opacity = "0"; setTimeout(function () { t.remove(); }, 600); }, 6000);
  }
  function splitName(full) {
    var parts = String(full || "").trim().split(/\s+/);
    return { firstName: parts.shift() || "", lastName: parts.join(" ") };
  }

  /* The site's own popup forms (Buy / Supply / Media / Other etc.) send here instead of the original backend. */
  window.__tpSubmit = function (data, opts) {
    opts = opts || {};
    var d = {};
    try { d = typeof data.data === "function" ? data.data() : (data.data || data); } catch (e) { d = data; }
    var fields = {};
    Object.keys(d || {}).forEach(function (k) {
      var v = d[k];
      if (v === null || v === undefined || v === "" || typeof v === "function") return;
      fields[k] = typeof v === "object" ? JSON.stringify(v) : String(v);
    });
    var name = splitName(fields.name || fields.fullName || "");
    fields.firstName = fields.firstName || name.firstName;
    fields.lastName = fields.lastName || name.lastName;
    fields.enquiryForm = document.title;
    if (opts.onStart) try { opts.onStart(); } catch (e) {}
    deliver(fields).then(function () {
      if (opts.onSuccess) opts.onSuccess();
      toast("Thank you – your message has been sent. We'll reply within one business day.");
    }).catch(function (err) {
      window.alert(err.message || "We could not send your message. Please email triportagro@gmail.com.");
      if (opts.onError) try { opts.onError({}); } catch (e) {}
    }).then(function () { if (opts.onFinish) try { opts.onFinish(); } catch (e) {} });
  };

  /* ---------------- animations ---------------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) reveal(e.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }) : null;

  // Elements waiting to animate in. Checked on scroll as well as by the observer, so nothing can stay hidden.
  var pendingEls = [];
  function reveal(el) {
    if (el.classList.contains("tp-in")) return;
    el.classList.add("tp-in");
    if (io) io.unobserve(el);
    if (el.classList.contains("tp-countable")) countUp(el);
  }
  function checkPending() {
    var h = innerHeight * 0.92;
    document.querySelectorAll('.tp-r:not(.tp-in), .tp-title:not(.tp-in), .tp-countable:not(.tp-in), .tp-zoom:not(.tp-in), .tp-zoom-img:not(.tp-in), .tp-tagwait:not(.tp-in)').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if ((r.top < h && r.bottom > 0) || (r.width === 0 && r.height === 0 && !el.offsetParent)) reveal(el);
    });
  }
  setInterval(checkPending, 700);
  var checkTimer = null;
  function scheduleCheck() { if (!checkTimer) checkTimer = setTimeout(function () { checkTimer = null; checkPending(); }, 60); }
  addEventListener("scroll", scheduleCheck, { passive: true });
  addEventListener("resize", scheduleCheck);

  var bootAt = Date.now();
  function onScreenNow(el) { var r = el.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; }
  function watch(el, cls, delay) {
    if (!io || reduce || el.__tp) return;
    el.__tp = true;
    // Content that is already on screen when the page loads is shown straight away, never hidden.
    if (Date.now() - bootAt < 2500 && onScreenNow(el)) return;
    if (cls) cls.split(" ").forEach(function (c) { el.classList.add(c); });
    if (delay) el.style.setProperty("--tp-delay", delay + "ms");
    pendingEls.push(el);
    io.observe(el);
    scheduleCheck();
  }

  function countUp(el) {
    var raw = el.__tpRaw || el.textContent;
    var m = raw.match(/^(\D*)(\d[\d,]*)(.*)$/);
    if (!m) return;
    var target = parseInt(m[2].replace(/,/g, ""), 10);
    var t0 = performance.now();
    var dur = 1400;
    function tick(now) {
      var p = Math.min(1, (now - t0) / dur);
      var v = Math.round(target * (1 - Math.pow(1 - p, 3)));
      el.textContent = m[1] + v.toLocaleString() + m[3];
      if (p < 1) requestAnimationFrame(tick);
      else { el.textContent = raw; el.classList.add("tp-done"); }
    }
    requestAnimationFrame(tick);
  }

  function scan(root) {
    if (reduce) return;
    var app = document.getElementById("app") || document.body;
    root = root || app;

    // Section blocks fade up as they enter.
    root.querySelectorAll('[class*="2xl:container"]').forEach(function (sec) {
      if (sec.closest(".fixed")) return;
      Array.prototype.forEach.call(sec.children, function (child, i) { watch(child, "tp-r", Math.min(i, 3) * 90); });
    });

    // Grid items stagger in.
    root.querySelectorAll(".grid").forEach(function (grid) {
      if (grid.closest(".fixed") || grid.closest(".tp-quote")) return;
      Array.prototype.forEach.call(grid.children, function (child, i) {
        if (child.__tp) return;
        watch(child, i % 2 ? "tp-r tp-scale" : "tp-r", (i % 4) * 110);
      });
    });

    // Big headings wipe up.
    root.querySelectorAll("div, p, h1, h2").forEach(function (el) {
      if (el.__tpT || el.children.length > 2 || el.closest(".fixed") || el.closest(".tp-quote")) return;
      var fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs >= 30 && el.textContent.trim().length > 3 && el.textContent.trim().length < 140) {
        el.__tpT = true;
        if (!io) return;
        el.__tp = false;
        watch(el, "tp-title", 0);
      }
    });

    // Photos ease in from a slight zoom; cards lift on hover; buttons shine.
    root.querySelectorAll("img").forEach(function (img) {
      if (img.__tpI || img.closest(".fixed") || img.closest(".tp-quote")) return;
      img.__tpI = true;
      var src = img.getAttribute("src") || "";
      if (/static\/img\/(header|discover-avocados)\//.test(src)) { img.classList.add(src.indexOf("outoffocus") > -1 ? "tp-bob2" : "tp-bob"); return; }
      if (/triport-logo|\.svg$/.test(src) || img.width < 120) return;
      if (/-r\.webp$/.test(src)) { img.classList.add("tp-bob"); return; }
      var box = img.parentElement;
      if (box && /rounded/.test(box.className + "") && box.children.length === 1) { box.classList.add("tp-zoom"); watch(box, "tp-wipe", 0); }
      else watch(img, "tp-zoom-img", 0);
    });
    root.querySelectorAll('[class*="rounded-xl"], [class*="rounded-lg"]').forEach(function (card) {
      if (card.__tpC || card.closest(".fixed") || card.closest(".tp-quote")) return;
      if (card.querySelector("a, button") || card.closest("a") || /cursor-pointer/.test(card.className)) { card.__tpC = true; card.classList.add("tp-card"); }
    });
    root.querySelectorAll("button, a").forEach(function (b) {
      if (b.__tpS) return;
      if ((/rounded-full/.test(b.className + "") || (b.firstElementChild && /rounded-full/.test(b.firstElementChild.className + ""))) && getComputedStyle(b).display !== "inline" && !b.closest(".fixed")) { b.__tpS = true; b.classList.add("tp-shine"); }
    });

    // Section tags pop in.
    root.querySelectorAll(".tag-div").forEach(function (t) { if (!t.closest(".fixed")) watch(t, "tp-tagwait", 0); });

    // Statistic numbers count up.
    root.querySelectorAll("div, p, span").forEach(function (el) {
      if (el.__tpN || el.children.length) return;
      var t = el.textContent.trim();
      if (!/^\d[\d,]*\+?$/.test(t) || t.length > 7) return;
      var fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs < 40) return;
      el.__tpN = true;
      el.__tpRaw = t;
      el.classList.add("tp-count", "tp-countable");
      if (io && !reduce) { pendingEls.push(el); io.observe(el); scheduleCheck(); }
    });

    teamCards(root);
    extraMotion(root);
    contrastGuard();
  }

  /* ---------------- contrast guard: no text may blend into its background ---------------- */
  function parseColor(c) {
    if (!c) return null;
    var m = c.match(/color\(display-p3 ([\d.]+) ([\d.]+) ([\d.]+)(?: \/ ([\d.]+))?\)/), r, g, b, a = 1;
    if (m) { r = +m[1]; g = +m[2]; b = +m[3]; if (m[4] !== undefined) a = +m[4]; }
    else {
      m = c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
      if (!m) return null;
      r = m[1] / 255; g = m[2] / 255; b = m[3] / 255; if (m[4] !== undefined) a = +m[4];
    }
    var f = function (v) { return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return { r: r, g: g, b: b, a: a, L: 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b) };
  }
  function brightGreen(c) { return c && c.g > 0.62 && c.r < 0.25 && c.b < 0.3 && c.a > 0.6; }
  function overImage(el) {
    var r = el.getBoundingClientRect();
    var imgs = document.querySelectorAll("img, video, [style*='background-image']");
    for (var i = 0; i < imgs.length; i++) {
      var im = imgs[i];
      if (im.contains(el)) return true;
      var q = im.getBoundingClientRect();
      if (q.width > 60 && q.height > 60 && r.left < q.right && r.right > q.left && r.top < q.bottom && r.bottom > q.top) return true;
    }
    return false;
  }
  var guardTimer = null;
  function contrastGuard() {
    if (guardTimer) return;
    guardTimer = setTimeout(function () {
      guardTimer = null;
      var app = document.getElementById("app");
      if (!app) return;
      // 1. Bright-green filled buttons with white text get the deeper brand green.
      app.querySelectorAll("button, a, div, span").forEach(function (el) {
        if (el.__tpBtn || el.closest(".fixed .tp-dropdown")) return;
        var cs = getComputedStyle(el);
        if (brightGreen(parseColor(cs.backgroundColor)) && el.textContent.trim()) { el.__tpBtn = true; el.classList.add("tp-btn-deep"); }
      });
      // 2. Text checks.
      app.querySelectorAll("*").forEach(function (el) {
        if (el.__tpC2 || el.closest(".fixed, .tp-cookie-root, svg")) return;
        var own = false;
        for (var i = 0; i < el.childNodes.length; i++) if (el.childNodes[i].nodeType === 3 && el.childNodes[i].textContent.trim().length > 1) { own = true; break; }
        if (!own) return;
        var cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") return;
        var fg = parseColor(cs.color);
        if (!fg) return;
        var bg = null, img = false, n = el;
        while (n && n.nodeType === 1) {
          var ns = getComputedStyle(n);
          if (ns.backgroundImage && ns.backgroundImage !== "none" && !/gradient/.test(ns.backgroundImage)) { img = true; break; }
          var b = parseColor(ns.backgroundColor);
          if (b && b.a > 0.6) { bg = b; break; }
          n = n.parentElement;
        }
        if (brightGreen(fg) && !img && (!bg || bg.L > 0.5)) { el.__tpC2 = true; (el.closest("a") || el).classList.add("tp-green-text"); return; }
        if (img) return;
        if (!bg) { if (overImage(el)) return; bg = { L: 1, g: 1, r: 1, b: 1 }; }
        el.__tpC2 = true;
        var ratio = (Math.max(fg.L, bg.L) + 0.05) / (Math.min(fg.L, bg.L) + 0.05);
        if (brightGreen(fg) && bg.L > 0.5) { (el.closest("a") || el).classList.add("tp-green-text"); return; }
        if (brightGreen(bg)) return; // handled by the button rule
        if (ratio < 3) el.classList.add(bg.L < 0.4 ? "tp-force-light" : "tp-force-dark");
      });
    }, 300);
  }

  /* ---------------- extra motion: parallax, tilt, glow, magnetic buttons, link sweeps ---------------- */
  var parallaxEls = [];
  var finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  function extraMotion(root) {
    if (reduce) return;
    // Large photos drift with the scroll; very large ones also slowly zoom (Ken Burns).
    root.querySelectorAll("img").forEach(function (img) {
      if (img.__tpP || img.closest(".fixed") || img.closest(".tp-quote") || img.closest(".tp-team-card")) return;
      var src = img.getAttribute("src") || "";
      if (!/static\/img\/triport\/.*\.jpg$/.test(src)) return;
      var r = img.getBoundingClientRect();
      if (r.width < 280 || r.height < 260) return;
      // Only inside a cropping box, so the slight zoom never widens the page.
      var box = img.parentElement, clipped = false;
      for (var k = 0; k < 3 && box; k++, box = box.parentElement) {
        var ov = getComputedStyle(box).overflow;
        if (/hidden|clip/.test(ov)) { clipped = true; break; }
      }
      if (!clipped) return;
      img.__tpP = true;
      img.classList.add("tp-parallax");
      if (r.width > 700) img.classList.add("tp-kb");
      parallaxEls.push(img);
    });
    if (finePointer) {
      root.querySelectorAll(".tp-card").forEach(function (card) {
        if (card.__tpTilt) return;
        card.__tpTilt = true;
        card.addEventListener("pointermove", function (e) {
          var r = card.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
          card.style.setProperty("--tp-mx", x * 100 + "%");
          card.style.setProperty("--tp-my", y * 100 + "%");
          card.style.setProperty("--tp-ry", ((x - 0.5) * 6).toFixed(2) + "deg");
          card.style.setProperty("--tp-rx", ((0.5 - y) * 6).toFixed(2) + "deg");
        });
        card.addEventListener("pointerleave", function () { card.style.setProperty("--tp-rx", "0deg"); card.style.setProperty("--tp-ry", "0deg"); });
      });
      root.querySelectorAll(".tp-shine").forEach(function (b) {
        if (b.__tpMag || b.closest(".fixed")) return;
        b.__tpMag = true;
        b.classList.add("tp-magnet");
        b.addEventListener("pointermove", function (e) {
          var r = b.getBoundingClientRect();
          b.style.translate = ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) + "px " + ((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1) + "px";
        });
        b.addEventListener("pointerleave", function () { b.style.translate = "0 0"; });
      });
    }
    // Text links get an underline sweep; footer link lists stagger in.
    root.querySelectorAll("footer a, [class*='bg-avocado-green-50'] a, .body-bold-sm-desktop a").forEach(function (a) {
      if (a.__tpU || /rounded-full/.test(a.className + "") || a.querySelector("img, svg")) return;
      a.__tpU = true;
      a.classList.add("tp-ulink");
    });
    root.querySelectorAll("[class*='bg-avocado-green-50'] .body-bold-lg-desktop > div").forEach(function (list) {
      if (list.__tpF) return;
      list.__tpF = true;
      Array.prototype.forEach.call(list.children, function (c, i) { c.style.setProperty("--tp-delay", i * 70 + "ms"); });
      var r = list.getBoundingClientRect();
      var go = function () { list.classList.add("tp-footer-in"); };
      if (r.top < innerHeight) go(); else if (io) { var o = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { go(); o.disconnect(); } }); o.observe(list); }
    });
    // Primary call-to-action buttons pulse gently to draw the eye.
    root.querySelectorAll("a[href$='contact-us'] button, a[href$='/contact-us'] > *").forEach(function (b) {
      if (b.__tpPulse || b.closest(".fixed")) return;
      b.__tpPulse = true;
      if (/rounded-full/.test(b.className + "")) b.classList.add("tp-pulse");
    });
  }
  var parallaxTick = false;
  function runParallax() {
    parallaxTick = false;
    var vh = innerHeight;
    parallaxEls = parallaxEls.filter(function (img) { return img.isConnected; });
    parallaxEls.forEach(function (img) {
      var r = img.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var offset = (r.top + r.height / 2 - vh / 2) / vh;
      img.style.translate = "0 " + (offset * -38).toFixed(1) + "px";
    });
  }
  addEventListener("scroll", function () { if (!parallaxTick && !reduce) { parallaxTick = true; setTimeout(runParallax, 16); } }, { passive: true });

  /* ---------------- team cards ---------------- */
  function teamCards(root) {
    var names = root.querySelectorAll("div");
    var grids = [];
    names.forEach(function (el) {
      if (el.children.length) return;
      var slug = TEAM[el.textContent.trim()];
      if (!slug) return;
      var card = el.closest('[class*="col-span-4"]');
      if (!card || card.__tpTeam) return;
      card.__tpTeam = true;
      card.classList.add("tp-team-card");
      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", el.textContent.trim() + " – view profile");
      var go = function () { location.href = "/team-" + slug; };
      card.addEventListener("click", go);
      card.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
      var img = card.querySelector("img");
      if (img && img.parentElement && !img.parentElement.classList.contains("tp-team-photo")) img.parentElement.classList.add("tp-team-photo");
      var more = document.createElement("span");
      more.className = "tp-team-more";
      more.innerHTML = 'View profile <span aria-hidden="true">→</span>';
      (el.parentElement || card).appendChild(more);
      if (card.parentElement && grids.indexOf(card.parentElement) < 0) grids.push(card.parentElement);
    });
    grids.forEach(function (g) {
      g.classList.add("tp-team-grid");
      g.style.setProperty("--tp-team-cols", Math.min(5, g.children.length));
    });
  }

  /* ---------------- scroll progress ---------------- */
  function progress() {
    var bar = document.createElement("div");
    bar.className = "tp-progress";
    document.body.appendChild(bar);
    var update = function () {
      var max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, scrollY / max) : 0) + ")";
    };
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    update();
  }

  /* ---------------- quote wizard (contact page) ---------------- */
  var PRODUCTS = [
    ["Arabica coffee", "Bugisu, Sipi, Rwenzori"], ["Robusta coffee", "Screen 18, Screen 15, FAQ"], ["Specialty lots", "Washed, natural, honey"],
    ["Avocados", "Hass and Fuerte"], ["Pineapples", "Smooth Cayenne"], ["Mangoes", "Apple and Kent"],
    ["Bananas", "Fresh and green"], ["Hot peppers", "Fresh and dried"], ["French beans & okra", "Trimmed and graded"],
    ["Sesame & oilseeds", "White and mixed"], ["Beans & pulses", "Red kidney, sugar beans"], ["Maize & sorghum", "Cleaned and sorted"]
  ];
  var ENQUIRY = ["Buy products", "Supply produce", "Partnership", "Media", "Something else"];
  var ROLES = ["Importer", "Wholesaler / distributor", "Retailer / food service", "Roaster / manufacturer", "Trader / broker", "Farmer / cooperative", "Other"];
  var PACKAGING = ["60 kg jute bags", "GrainPro-lined bags", "Ventilated cartons", "25 / 50 kg bags", "Private label", "Not sure yet"];
  var TERMS = [["FOB", "We load at the port in East Africa; you arrange the sea freight."], ["CIF", "We arrange freight and insurance to your destination port."], ["CFR", "We arrange freight to your port; you insure the cargo."], ["EXW", "You collect from our facility in Uganda."], ["Not sure yet", "We'll talk you through the options."]];
  var TIMES = ["As soon as possible", "Within 1 month", "1–3 months", "3–6 months", "Ongoing supply"];
  var COUNTRIES = ["Uganda", "Kenya", "Tanzania", "Rwanda", "South Sudan", "DR Congo", "Ethiopia", "Egypt", "Morocco", "Nigeria", "Ghana", "South Africa", "United Arab Emirates", "Saudi Arabia", "Qatar", "Kuwait", "Oman", "Bahrain", "Jordan", "Lebanon", "Turkey", "Israel", "United Kingdom", "Ireland", "Netherlands", "Belgium", "Germany", "France", "Italy", "Spain", "Portugal", "Switzerland", "Austria", "Sweden", "Norway", "Denmark", "Finland", "Poland", "Czech Republic", "Greece", "Russia", "India", "Pakistan", "Bangladesh", "China", "Hong Kong", "Japan", "South Korea", "Singapore", "Malaysia", "Indonesia", "Thailand", "Vietnam", "Philippines", "Australia", "New Zealand", "United States", "Canada", "Mexico", "Brazil", "Argentina", "Chile"];
  var STEPS = ["About you", "What you need", "Delivery", "Review & send"];
  var TITLES = ["Who are we speaking with?", "What can we supply?", "Where is it going?", "Check it over, then send."];

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (html !== undefined) n.innerHTML = html;
    return n;
  }
  function esc(s) { return String(s || "").replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function wizard() {
    if (!/^\/contact-us(\.html)?\/?$/.test(location.pathname) || document.getElementById("tp-quote")) return;
    var anchor = null;
    document.querySelectorAll('[class*="2xl:container"]').forEach(function (sec) {
      if (!anchor && /Where to find us/.test(sec.textContent)) anchor = sec;
    });
    if (!anchor) return false;

    var v = { fullName: "", company: "", email: "", phone: "+", role: "", enquiry: "Buy products", products: [], quantity: "", unit: "tonnes", packaging: "", country: "", port: "", terms: "", timeline: "", message: "", consent: false, website: "" };
    var step = 0, errors = {}, status = "idle", alertMsg = "";

    var wrap = el("section", { id: "tp-quote", class: "tp-quote", "aria-label": "Request a quote" });
    wrap.innerHTML =
      '<div class="tp-quote-inner">' +
      '<div><span class="tp-eyebrow">Request a quote</span><h2>Tell us what you need, we\'ll handle the rest.</h2>' +
      '<p class="tp-lead">Four quick steps. Our team replies within one business day with availability, pricing and shipping options.</p>' +
      '<ul class="tp-contact-list">' +
      '<li><span class="tp-ic">✉</span><span><small>Email</small><a href="mailto:triportagro@gmail.com">triportagro@gmail.com</a></span></li>' +
      '<li><span class="tp-ic">☎</span><span><small>Phone / WhatsApp</small><a href="tel:+256780391916">+256 (0) 780 391916</a></span></li>' +
      '<li><span class="tp-ic">☎</span><span><small>Office line</small><a href="tel:+256700683670">+256 (0) 700 683670</a></span></li>' +
      '<li><span class="tp-ic">⌂</span><span><small>Address</small><span class="tp-v">P.O. Box 114415, Kampala, Uganda</span></span></li>' +
      '<li><span class="tp-ic">◷</span><span><small>Hours</small><span class="tp-v">Monday – Friday, 9:00 – 17:30 EAT</span></span></li>' +
      "</ul>" +
      '<div class="tp-side-note"><strong>Supplying produce?</strong><br>Farmers and cooperatives can use the same form – choose “Supply produce” in step 2.</div></div>' +
      '<div class="tp-card-form"><form novalidate aria-label="Quotation request"></form></div></div>';
    anchor.parentNode.insertBefore(wrap, anchor);
    var form = wrap.querySelector("form");

    function chip(label, active, attrs) {
      return '<button type="button" class="tp-chip" aria-pressed="' + (active ? "true" : "false") + '" ' + (attrs || "") + ">" + esc(label) + "</button>";
    }
    function field(name, label, input, hint) {
      return '<div class="tp-field' + (name === "message" ? " tp-span2" : "") + '"><label for="tp-' + name + '">' + label + "</label>" + input +
        (errors[name] ? '<p class="tp-err" role="alert">' + esc(errors[name]) + "</p>" : hint ? '<p class="tp-hint">' + hint + "</p>" : "") + "</div>";
    }
    function input(name, type, extra) {
      return '<input class="tp-input" id="tp-' + name + '" name="' + name + '" type="' + type + '" value="' + esc(v[name]) + '" aria-invalid="' + (errors[name] ? "true" : "false") + '" ' + (extra || "") + ">";
    }

    function validate(i) {
      var e = {};
      if (i === 0) {
        if (v.fullName.trim().length < 2) e.fullName = "Please tell us your name.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Please enter a valid email address.";
        if (v.phone.replace(/\D/g, "").length < 7) e.phone = "Please include a phone number with country code.";
      }
      if (i === 1) {
        if (!v.enquiry) e.enquiry = "Choose what this is about.";
        if ((v.enquiry === "Buy products" || v.enquiry === "Supply produce") && !v.products.length) e.products = "Pick at least one product.";
      }
      if (i === 2 && v.enquiry === "Buy products" && !v.country) e.country = "Choose the destination country.";
      if (i === 3 && !v.consent) e.consent = "Please confirm we may use these details to reply.";
      return e;
    }

    function render(focus) {
      var bar = (step / (STEPS.length - 1)) * 100;
      var html = "";
      if (status === "success") {
        form.innerHTML = '<div class="tp-success" role="status"><div class="tp-tick">✓</div><h3>Thank you. Your request has been sent.</h3><p>Our team will reply to ' + esc(v.email) + ' within one business day. A confirmation email is on its way.</p><button type="button" class="tp-btn" data-act="again">Send another request</button></div>';
        return;
      }
      html += '<div class="tp-hp" aria-hidden="true"><label>Leave empty<input tabindex="-1" autocomplete="off" name="website" value=""></label></div>';
      if (alertMsg) html += '<div class="tp-alert tp-bad" role="alert">' + esc(alertMsg) + "</div>";
      html += '<ol class="tp-steps" aria-label="Progress"><span class="tp-bar" style="width:' + bar + '%"></span>';
      STEPS.forEach(function (s, i) {
        html += '<li class="' + (i < step ? "tp-done" : i === step ? "tp-cur" : "") + '"><button type="button" data-step="' + i + '" ' + (i > step ? "disabled" : "") + ' aria-current="' + (i === step ? "step" : "false") + '"><span class="tp-num">' + (i < step ? "✓" : i + 1) + '</span><span class="tp-lbl">' + s + "</span></button></li>";
      });
      html += "</ol><div class=\"tp-step\"><h3 tabindex=\"-1\">" + TITLES[step] + "</h3>";

      if (step === 0) {
        html += '<div class="tp-grid2">' +
          field("fullName", "Full name", input("fullName", "text", 'autocomplete="name"')) +
          field("company", "Company <em>optional</em>", input("company", "text", 'autocomplete="organization"')) +
          field("email", "Business email", input("email", "email", 'autocomplete="email" inputmode="email"')) +
          field("phone", "Phone / WhatsApp", input("phone", "tel", 'autocomplete="tel" inputmode="tel"'), "Include your country code, e.g. +44 20 7946 0000") +
          "</div>" +
          '<div class="tp-group"><p class="tp-label">What best describes you? <em>optional</em></p><div class="tp-chips">' +
          ROLES.map(function (r) { return chip(r, v.role === r, 'data-set="role" data-val="' + esc(r) + '"'); }).join("") + "</div></div>";
      }
      if (step === 1) {
        html += '<p class="tp-label">This is about</p><div class="tp-chips">' + ENQUIRY.map(function (r) { return chip(r, v.enquiry === r, 'data-set="enquiry" data-val="' + esc(r) + '"'); }).join("") + "</div>" + (errors.enquiry ? '<p class="tp-err">' + errors.enquiry + "</p>" : "");
        if (v.enquiry === "Buy products" || v.enquiry === "Supply produce") {
          html += '<div class="tp-group"><p class="tp-label">Products <em>choose any</em></p><div class="tp-tiles">' +
            PRODUCTS.map(function (p) { return '<button type="button" class="tp-tile" data-product="' + esc(p[0]) + '" aria-pressed="' + (v.products.indexOf(p[0]) > -1) + '"><strong>' + esc(p[0]) + "</strong><span>" + esc(p[1]) + "</span></button>"; }).join("") +
            "</div>" + (errors.products ? '<p class="tp-err" role="alert">' + errors.products + "</p>" : "") + "</div>";
          var q = parseFloat(v.quantity);
          var kg = q > 0 ? (v.unit === "kg" ? q : q * 1000) : 0;
          html += '<div class="tp-group"><label class="tp-label" for="tp-quantity">' + (v.enquiry === "Supply produce" ? "Volume you can supply" : "Quantity needed") + ' <em>optional</em></label><div class="tp-unit">' +
            '<input class="tp-input" id="tp-quantity" name="quantity" inputmode="decimal" placeholder="e.g. 20" value="' + esc(v.quantity) + '">' +
            '<div class="tp-toggle" role="group" aria-label="Unit">' + ["tonnes", "kg"].map(function (u) { return '<button type="button" data-unit="' + u + '" aria-pressed="' + (v.unit === u) + '">' + u + "</button>"; }).join("") + "</div></div>" +
            (kg > 0 ? '<span class="tp-calc">≈ ' + Math.max(1, Math.round(kg / 60)).toLocaleString() + " bags of 60 kg" + (kg >= 1000 ? " · about " + (kg / 18000).toFixed(1) + " × 20 ft container" : "") + "</span>" : "") + "</div>";
          html += '<div class="tp-group"><p class="tp-label">Packaging <em>optional</em></p><div class="tp-chips">' + PACKAGING.map(function (p) { return chip(p, v.packaging === p, 'data-set="packaging" data-val="' + esc(p) + '"'); }).join("") + "</div></div>";
        }
      }
      if (step === 2) {
        html += '<div class="tp-combo"><label class="tp-label" for="tp-country">' + (v.enquiry === "Supply produce" ? "Where are you based?" : "Destination country") + "</label>" +
          '<input class="tp-input" id="tp-country" role="combobox" aria-expanded="false" aria-autocomplete="list" autocomplete="off" placeholder="Start typing a country…" value="' + esc(v.country) + '" aria-invalid="' + (errors.country ? "true" : "false") + '"><ul hidden role="listbox"></ul>' +
          (errors.country ? '<p class="tp-err" role="alert">' + errors.country + "</p>" : "") + "</div>";
        html += '<div class="tp-group">' + field("port", "Port or delivery town <em>optional</em>", input("port", "text"), "e.g. Rotterdam, Jebel Ali, Mombasa") + "</div>";
        if (v.enquiry !== "Supply produce") {
          var hint = (TERMS.filter(function (t) { return t[0] === v.terms; })[0] || [0, "Pick the terms you normally buy on. We can talk it through."])[1];
          html += '<div class="tp-group"><p class="tp-label">Shipping terms <em>optional</em></p><div class="tp-chips">' + TERMS.map(function (t) { return chip(t[0], v.terms === t[0], 'data-set="terms" data-val="' + t[0] + '"'); }).join("") + '</div><p class="tp-terms-hint" aria-live="polite">⚓ ' + esc(hint) + "</p></div>";
        }
        html += '<div class="tp-group"><p class="tp-label">Timeline <em>optional</em></p><div class="tp-chips">' + TIMES.map(function (t) { return chip(t, v.timeline === t, 'data-set="timeline" data-val="' + esc(t) + '"'); }).join("") + "</div></div>";
      }
      if (step === 3) {
        var rows = [
          ["You", v.fullName + (v.company ? ", " + v.company : ""), 0],
          ["Contact", v.email + " · " + v.phone, 0],
          ["Enquiry", v.enquiry + (v.role ? " · " + v.role : ""), 1],
          ["Products", v.products.join(", ") || "–", 1],
          ["Quantity", v.quantity ? v.quantity + " " + v.unit : "–", 1],
          ["Delivery", [v.port, v.country].filter(Boolean).join(", ") + (v.terms ? " · " + v.terms : "") + (v.timeline ? " · " + v.timeline : "") || "–", 2]
        ];
        html += '<dl class="tp-review">' + rows.map(function (r) { return "<div><dt>" + r[0] + "</dt><dd>" + esc(r[1]) + '</dd><button type="button" data-step="' + r[2] + '">Edit</button></div>'; }).join("") + "</dl>";
        html += '<div class="tp-group">' + field("message", "Anything else we should know? <em>optional</em>", '<textarea class="tp-input" id="tp-message" name="message" rows="4" placeholder="Grades, certifications, sample requests, delivery window…">' + esc(v.message) + "</textarea>") + "</div>";
        html += '<label class="tp-consent"><input type="checkbox" name="consent" ' + (v.consent ? "checked" : "") + '><span>I agree that Triport Agro International Limited may use these details to respond to my enquiry, as described in the <a href="/privacy-policy-and-terms-of-use" target="_blank">Privacy Policy</a>.</span></label>' + (errors.consent ? '<p class="tp-err" role="alert">' + errors.consent + "</p>" : "");
      }
      html += "</div>";
      html += '<div class="tp-nav">' + (step > 0 ? '<button type="button" class="tp-back" data-act="back">← Back</button>' : "<span></span>") +
        (step < STEPS.length - 1 ? '<button type="button" class="tp-btn" data-act="next">Continue →</button>' : '<button type="submit" class="tp-btn"' + (status === "sending" ? " disabled" : "") + ">" + (status === "sending" ? "Sending…" : "Send request →") + "</button>") + "</div>";
      html += '<p class="tp-small">Requesting a quote does not guarantee availability. Prices and shipment details are confirmed by our team in writing.</p>';
      form.innerHTML = html;
      if (focus) { var h = form.querySelector("h3"); if (h) { h.focus({ preventScroll: true }); wrap.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); } }
      if (step === 2) bindCountry();
    }

    function bindCountry() {
      var inp = form.querySelector("#tp-country");
      var list = form.querySelector(".tp-combo ul");
      var active = 0, items = [];
      function show() {
        var q = inp.value.trim().toLowerCase();
        items = COUNTRIES.filter(function (c) { return !q || c.toLowerCase().indexOf(q) > -1; }).slice(0, 40);
        if (q && items.indexOf(inp.value.trim()) < 0) items.push("Other: " + inp.value.trim());
        list.innerHTML = items.map(function (c, i) { return '<li role="option" data-i="' + i + '" aria-selected="' + (i === active) + '">' + esc(c) + "</li>"; }).join("");
        list.hidden = !items.length;
        inp.setAttribute("aria-expanded", String(!list.hidden));
      }
      function pick(c) { v.country = c.replace(/^Other: /, ""); inp.value = v.country; list.hidden = true; errors.country = ""; }
      inp.addEventListener("focus", show);
      inp.addEventListener("input", function () { v.country = ""; active = 0; show(); });
      inp.addEventListener("keydown", function (e) {
        if (e.key === "ArrowDown") { e.preventDefault(); active = Math.min(items.length - 1, active + 1); show(); }
        else if (e.key === "ArrowUp") { e.preventDefault(); active = Math.max(0, active - 1); show(); }
        else if (e.key === "Enter" && !list.hidden && items[active]) { e.preventDefault(); pick(items[active]); }
        else if (e.key === "Escape") list.hidden = true;
      });
      list.addEventListener("pointerdown", function (e) { var li = e.target.closest("li"); if (li) { e.preventDefault(); pick(items[+li.dataset.i]); } });
      inp.addEventListener("blur", function () { setTimeout(function () { list.hidden = true; if (!v.country && inp.value.trim()) v.country = inp.value.trim(); }, 150); });
    }

    form.addEventListener("input", function (e) {
      var n = e.target.name;
      if (n && n in v && n !== "consent") { v[n] = e.target.value; if (errors[n]) { errors[n] = ""; e.target.setAttribute("aria-invalid", "false"); } }
      if (n === "quantity") { v.quantity = e.target.value.replace(/[^\d.]/g, ""); var pos = e.target.selectionStart; render(); var q = form.querySelector("#tp-quantity"); q.focus(); try { q.setSelectionRange(pos, pos); } catch (x) {} }
    });
    form.addEventListener("change", function (e) { if (e.target.name === "consent") { v.consent = e.target.checked; errors.consent = ""; } });
    form.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.set) { var k = b.dataset.set; v[k] = v[k] === b.dataset.val && k !== "enquiry" ? "" : b.dataset.val; errors[k] = ""; render(); }
      else if (b.dataset.product) { var p = b.dataset.product, i = v.products.indexOf(p); if (i > -1) v.products.splice(i, 1); else v.products.push(p); errors.products = ""; render(); }
      else if (b.dataset.unit) { v.unit = b.dataset.unit; render(); }
      else if (b.dataset.step) { step = +b.dataset.step; alertMsg = ""; render(true); }
      else if (b.dataset.act === "next") next();
      else if (b.dataset.act === "back") { step = Math.max(0, step - 1); alertMsg = ""; render(true); }
      else if (b.dataset.act === "again") { status = "idle"; step = 0; v.message = ""; v.consent = false; render(true); }
    });
    function next() {
      errors = validate(step);
      if (Object.keys(errors).length) { alertMsg = "A few details need your attention before we continue."; render(); var bad = form.querySelector('[aria-invalid="true"]'); if (bad) bad.focus(); return; }
      alertMsg = ""; step = Math.min(STEPS.length - 1, step + 1); render(true);
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (step < STEPS.length - 1) return next();
      for (var i = 0; i < STEPS.length; i++) {
        var errs = validate(i);
        if (Object.keys(errs).length) { errors = errs; step = i; alertMsg = "Please complete the highlighted fields."; render(true); return; }
      }
      if (form.querySelector('[name="website"]').value) return;
      status = "sending"; alertMsg = ""; render();
      var name = splitName(v.fullName);
      var fields = {
        firstName: name.firstName, lastName: name.lastName, email: v.email.trim(), phone: v.phone.trim(), company: v.company,
        businessType: v.role, enquiryType: v.enquiry, products: v.products.join(", "), quantity: v.quantity ? v.quantity + " " + v.unit : "",
        packaging: v.packaging, country: v.country, port: v.port, shippingTerms: v.terms, timeline: v.timeline, message: v.message
      };
      Object.keys(fields).forEach(function (k) { if (!fields[k]) delete fields[k]; });
      deliver(fields).then(function () { status = "success"; render(true); })
        .catch(function (err) { status = "idle"; alertMsg = err.message || "We could not send your request. Please email triportagro@gmail.com."; render(); });
    });

    // The original Buy / Supply / Media / Other buttons preselect the enquiry type and jump to the wizard.
    var map = { Buy: "Buy products", Supply: "Supply produce", Media: "Media", Other: "Something else" };
    document.addEventListener("click", function (e) {
      if (e.target.closest("#tp-quote")) return;
      var hit = e.target.closest("button, a, [class*='cursor-pointer'], [class*='rounded']");
      if (!hit) return;
      var label = Object.keys(map).filter(function (k) { return hit.textContent.trim().indexOf(k) === 0 && /Contact us to/.test(hit.textContent); })[0];
      if (!label) return;
      e.preventDefault();
      e.stopPropagation();
      v.enquiry = map[label];
      step = v.fullName ? 1 : 0;
      render(true);
    }, true);

    loadCaptcha().catch(function () {});
    render();
    if (location.hash === "#quote") setTimeout(function () { wrap.scrollIntoView({ block: "start" }); }, 300);
    return true;
  }

  /* ---------------- cookie consent ---------------- */
  var CONSENT_KEY = "tp_cookie_consent_v1";
  var COOKIE_GROUPS = [
    { id: "necessary", title: "Strictly necessary", locked: true, text: "Needed for the site to work: page navigation, security (reCAPTCHA spam protection) and remembering your cookie choices. These cannot be switched off.", examples: "tp_cookie_consent_v1, _GRECAPTCHA" },
    { id: "functional", title: "Functional", text: "Remember choices you make, such as form details you have started, so the site works the way you expect.", examples: "Saved form progress, language and region" },
    { id: "analytics", title: "Analytics", text: "Help us understand how visitors use the site, which pages are popular and where people get stuck, so we can improve it. Data is aggregated.", examples: "Page views, visit length, device type" },
    { id: "performance", title: "Performance", text: "Measure loading speed and errors so we can keep the site fast on every connection.", examples: "Load times, error reports" },
    { id: "marketing", title: "Marketing", text: "Used to show you relevant Triport Agro adverts on other websites and measure how well campaigns work.", examples: "Advertising IDs, campaign attribution" },
    { id: "personalisation", title: "Personalisation", text: "Tailor content, such as the products we highlight, to your interests and region.", examples: "Recently viewed products, region" },
    { id: "social", title: "Social media", text: "Allow content and sharing features from social networks such as LinkedIn, Facebook, Instagram and X.", examples: "Share buttons, embedded posts" }
  ];

  function readConsent() {
    try { return JSON.parse(localStorage.getItem(CONSENT_KEY) || "null"); } catch (e) { return null; }
  }
  function saveConsent(choices) {
    var record = { choices: choices, date: new Date().toISOString(), version: 1 };
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify(record)); } catch (e) {}
    window.tpConsent = choices;
    try { window.dispatchEvent(new CustomEvent("tp:consent", { detail: choices })); } catch (e) {}
  }

  function cookies() {
    var saved = readConsent();
    window.tpConsent = saved ? saved.choices : null;

    var fab = el("button", { class: "tp-cookie-fab", type: "button", "aria-label": "Cookie settings" }, '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5Zm-4.5 9A1.5 1.5 0 1 1 9 9.5 1.5 1.5 0 0 1 7.5 11Zm1 5A1.5 1.5 0 1 1 10 14.5 1.5 1.5 0 0 1 8.5 16Zm7 1a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5Z"/></svg>');
    document.body.appendChild(fab);

    var root = el("div", { class: "tp-cookie-root", role: "dialog", "aria-modal": "false", "aria-labelledby": "tp-cookie-title" });
    document.body.appendChild(root);
    var state = {};

    function current() {
      var c = {};
      COOKIE_GROUPS.forEach(function (g) { c[g.id] = g.locked ? true : !!state[g.id]; });
      return c;
    }
    function close(choices) {
      saveConsent(choices);
      root.classList.remove("tp-open");
      root.classList.add("tp-closing");
      setTimeout(function () { root.className = "tp-cookie-root"; root.innerHTML = ""; fab.classList.add("tp-show"); }, 450);
    }
    function all(v) { var c = {}; COOKIE_GROUPS.forEach(function (g) { c[g.id] = g.locked ? true : v; }); return c; }

    function banner() {
      root.className = "tp-cookie-root tp-banner";
      root.setAttribute("aria-modal", "false");
      root.innerHTML =
        '<div class="tp-cookie-card">' +
        '<div class="tp-cookie-head"><span class="tp-cookie-icon" aria-hidden="true">🍪</span><div><h2 id="tp-cookie-title">We value your privacy</h2>' +
        '<p>We use cookies to keep this site secure and working, and – with your permission – to understand how it is used, improve it and show relevant content. You can change your choice at any time. Read our <a href="/privacy-policy-and-terms-of-use">privacy policy</a>.</p></div></div>' +
        '<div class="tp-cookie-actions"><button type="button" class="tp-cbtn tp-cbtn-ghost" data-c="prefs">Manage preferences</button><button type="button" class="tp-cbtn tp-cbtn-outline" data-c="reject">Reject optional</button><button type="button" class="tp-cbtn tp-cbtn-solid" data-c="accept">Accept all</button></div>' +
        "</div>";
      requestAnimationFrame(function () { root.classList.add("tp-open"); });
      fab.classList.remove("tp-show");
    }

    function prefs() {
      var s = readConsent();
      COOKIE_GROUPS.forEach(function (g) { state[g.id] = g.locked ? true : !!(s && s.choices && s.choices[g.id]); });
      root.className = "tp-cookie-root tp-modal";
      root.setAttribute("aria-modal", "true");
      root.innerHTML =
        '<div class="tp-cookie-backdrop" data-c="dismiss"></div><div class="tp-cookie-panel">' +
        '<div class="tp-cookie-panel-head"><div><span class="tp-eyebrow">Privacy centre</span><h2 id="tp-cookie-title">Cookie preferences</h2>' +
        "<p>Choose which cookies Triport Agro International Limited may use. Strictly necessary cookies are always on. Tap a category to see what it covers.</p></div>" +
        '<button type="button" class="tp-cookie-x" data-c="dismiss" aria-label="Close">×</button></div>' +
        '<div class="tp-cookie-quick"><button type="button" class="tp-cbtn tp-cbtn-outline tp-sm" data-c="allon">Turn all on</button><button type="button" class="tp-cbtn tp-cbtn-outline tp-sm" data-c="alloff">Turn all off</button></div>' +
        '<ul class="tp-cookie-list">' +
        COOKIE_GROUPS.map(function (g) {
          return '<li class="tp-cookie-item"><div class="tp-cookie-row"><button type="button" class="tp-cookie-more" aria-expanded="false" data-more="' + g.id + '"><span class="tp-chev" aria-hidden="true">›</span>' + g.title + (g.locked ? ' <em>Always on</em>' : "") + "</button>" +
            '<label class="tp-switch"><input type="checkbox" data-g="' + g.id + '"' + (state[g.id] ? " checked" : "") + (g.locked ? " disabled" : "") + ' aria-label="' + g.title + ' cookies"><span></span></label></div>' +
            '<div class="tp-cookie-detail" hidden><p>' + g.text + '</p><p class="tp-cookie-ex"><strong>Examples:</strong> ' + g.examples + "</p></div></li>";
        }).join("") +
        "</ul>" +
        '<div class="tp-cookie-foot"><button type="button" class="tp-cbtn tp-cbtn-outline" data-c="reject">Reject optional</button><button type="button" class="tp-cbtn tp-cbtn-ghost2" data-c="save">Save my choices</button><button type="button" class="tp-cbtn tp-cbtn-solid" data-c="accept">Accept all</button></div>' +
        "</div>";
      requestAnimationFrame(function () { root.classList.add("tp-open"); var f = root.querySelector(".tp-cookie-x"); if (f) f.focus(); });
      fab.classList.remove("tp-show");
    }

    root.addEventListener("change", function (e) { var g = e.target.dataset.g; if (g) state[g] = e.target.checked; });
    root.addEventListener("click", function (e) {
      var b = e.target.closest("[data-c], [data-more]");
      if (!b) return;
      if (b.dataset.more) {
        var item = b.closest(".tp-cookie-item"), d = item.querySelector(".tp-cookie-detail"), open = d.hidden;
        d.hidden = !open; b.setAttribute("aria-expanded", String(open)); item.classList.toggle("tp-expanded", open);
        return;
      }
      var c = b.dataset.c;
      if (c === "accept") close(all(true));
      else if (c === "reject") close(all(false));
      else if (c === "save") close(current());
      else if (c === "prefs") prefs();
      else if (c === "allon" || c === "alloff") { root.querySelectorAll("input[data-g]:not([disabled])").forEach(function (i) { i.checked = c === "allon"; state[i.dataset.g] = i.checked; }); }
      else if (c === "dismiss") { if (readConsent()) close(readConsent().choices); else banner(); }
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && root.classList.contains("tp-modal")) { if (readConsent()) close(readConsent().choices); else banner(); } });
    fab.addEventListener("click", prefs);
    window.tpOpenCookieSettings = prefs;

    if (saved) fab.classList.add("tp-show");
    else setTimeout(banner, 900);
  }

  /* ---------------- boot ---------------- */
  /* ---------------- mobile menu as a half-screen drawer ---------------- */
  function menuDrawer() {
    var ov = document.querySelector(".bg-avocado-green-900.h-screen.w-screen");
    var scrim = document.querySelector(".tp-menu-scrim");
    if (ov && innerWidth < 960) {
      if (!ov.classList.contains("tp-drawer")) {
        ov.classList.add("tp-drawer");
        var top = ov.firstElementChild;
        var brand = el("div", { class: "tp-drawer-brand" }, '<img src="/static/img/menu/triport-logo.png" alt="">Triport Agro International Limited');
        if (top && top.nextSibling) ov.insertBefore(brand, top.nextSibling);
        var foot = el("div", { class: "tp-drawer-foot" },
          '<a class="tp-df-quote" href="/contact-us#quote">Request a quote →</a><a class="tp-df-wa" href="https://wa.me/256780391916" target="_blank" rel="noopener">WhatsApp us</a>');
        ov.appendChild(foot);
      }
      if (!scrim) {
        scrim = el("div", { class: "tp-menu-scrim", role: "button", "aria-label": "Close menu" }, "<span>Tap to close ›</span>");
        ov.parentElement.insertBefore(scrim, ov);
        scrim.addEventListener("click", function () {
          var x = ov.querySelector(".mb-12 svg, .mb-12 button");
          if (x) x.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
      }
      document.body.classList.add("tp-menu-open");
    } else {
      if (scrim) scrim.remove();
      document.body.classList.remove("tp-menu-open");
    }
  }

  /* ---------------- page transition curtain ---------------- */
  function curtain() {
    if (reduce) return;
    var c = el("div", { class: "tp-curtain", "aria-hidden": "true" }, '<img src="/static/img/menu/triport-logo.png" alt="">');
    document.body.appendChild(c);
    var arrived = false;
    try { arrived = sessionStorage.getItem("tp-curtain") === "1"; sessionStorage.removeItem("tp-curtain"); } catch (e) {}
    if (arrived) {
      c.style.transition = "none";
      c.classList.add("tp-cover");
      setTimeout(function () { c.style.transition = ""; c.classList.remove("tp-cover"); c.classList.add("tp-leave"); setTimeout(function () { c.className = "tp-curtain"; }, 800); }, 250);
    }
    document.addEventListener("click", function (e) {
      if (e.defaultPrevented && !e.target.closest("a[href]")) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      var url;
      try { url = new URL(a.getAttribute("href"), location.href); } catch (x) { return; }
      if (url.origin !== location.origin || /^\/api\//.test(url.pathname) || /\.(pdf|png|jpe?g|webp|mp4)$/i.test(url.pathname)) return;
      if (url.pathname === location.pathname && url.search === location.search) return; // same page / anchor
      try { sessionStorage.setItem("tp-curtain", "1"); } catch (x) {}
      c.classList.remove("tp-leave");
      c.classList.add("tp-cover");
      setTimeout(function () { c.classList.remove("tp-cover"); }, 2600); // never leave the page covered
    }, true);
    addEventListener("pageshow", function (e) { if (e.persisted) { c.className = "tp-curtain"; } });
  }

  /* ---------------- hero produce follows the pointer (desktop) ---------------- */
  function heroFollow() {
    if (reduce || !finePointer) return;
    var layers = [];
    document.querySelectorAll('img[src*="static/img/header/"], img[src*="discover-avocados/"]').forEach(function (img) {
      var p = img.parentElement;
      if (p && layers.indexOf(p) < 0) { p.classList.add("tp-follow"); p.__depth = /outoffocus/.test(img.src) ? 10 : 22; layers.push(p); }
    });
    if (!layers.length) return;
    addEventListener("pointermove", function (e) {
      var x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
      layers.forEach(function (p) { p.style.translate = (x * p.__depth).toFixed(1) + "px " + (y * p.__depth).toFixed(1) + "px"; });
    }, { passive: true });
  }

  function whatsapp() {
    var a = el("a", { class: "tp-wa", href: "https://wa.me/256780391916?text=" + encodeURIComponent("Hello Triport Agro, I'd like to ask about your products."), target: "_blank", rel: "noopener", "aria-label": "Chat with Triport Agro on WhatsApp" },
      '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M12.04 2a9.93 9.93 0 0 0-8.6 14.9L2 22l5.25-1.38A9.94 9.94 0 1 0 12.04 2Zm0 18.1a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.11.82.83-3.04-.2-.31a8.13 8.13 0 1 1 6.91 3.84Zm4.46-6.08c-.24-.12-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.12-.16.25-.63.8-.77.96-.14.17-.28.19-.53.07a6.66 6.66 0 0 1-3.31-2.9c-.25-.43.25-.4.72-1.33.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.74 2.74 0 0 0-.85 2.04 4.77 4.77 0 0 0 1 2.53 10.9 10.9 0 0 0 4.17 3.69c1.56.67 2.17.73 2.95.61a2.52 2.52 0 0 0 1.65-1.17 2.05 2.05 0 0 0 .14-1.17c-.06-.1-.22-.16-.47-.28Z"/></svg><span>WhatsApp us</span>');
    document.body.appendChild(a);
    setTimeout(function () { a.classList.add("tp-show"); }, 1600);
  }

  function boot() {
    progress();
    cookies();
    whatsapp();
    curtain();
    setTimeout(heroFollow, 1500);
    // reCAPTCHA v3 protects every form; its badge shows bottom-right on every page.
    loadCaptcha().catch(function () {});
    if (!document.getElementById("app")) return; // the Experience page has its own animations
    var tries = 0;
    var tick = function () {
      scan();
      var w = wizard();
      if (w === false && tries++ < 40) setTimeout(tick, 250);
    };
    setTimeout(tick, 400);
    var pending = false;
    new MutationObserver(menuDrawer).observe(document.getElementById("app"), { childList: true, subtree: true });
    new MutationObserver(function () {
      if (pending) return;
      pending = true;
      setTimeout(function () { pending = false; scan(); if (!document.getElementById("tp-quote")) wizard(); }, 250);
    }).observe(document.getElementById("app") || document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
