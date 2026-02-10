/* =========================
   DATA (preparado para sistema)
   ========================= */
const categories = [
  "Productos",
  "Notebooks",
  "Electrodomésticos",
  "Periféricos",
  "Impresoras e Insumos",
  "Monitores",
  "Memorias",
  "Redes",
];

const products = [
  {
    id: "1",
    title: "Notebook Lenovo IdeaPad 15”",
    price: 899,
    badge: "Notebooks",
    image: "media/products/notebook_lenovo.png",
    description: "Notebook liviana para estudio y trabajo diario.",
    deal: true,
    discountPct: 18,
  },
  {
    id: "2",
    title: "Monitor Samsung 24” Full HD",
    price: 220,
    badge: "Monitores",
    image: "media/products/monitor_samsung.png",
    description: "Pantalla ideal para oficina y home office.",
    deal: false,
  },
  {
    id: "3",
    title: "Kit Teclado + Mouse Logitech",
    price: 59,
    badge: "Periféricos",
    image: "media/products/teclado_mouse.png",
    description: "Combo inalámbrico cómodo y confiable.",
    deal: true,
    discountPct: 35,
  },
  {
    id: "4",
    title: "Impresora HP DeskJet",
    price: 140,
    badge: "Impresoras e Insumos",
    image: "media/products/impresora_hp.png",
    description: "Impresión y escaneo para el hogar.",
    deal: false,
  },
  {
    id: "5",
    title: "Monitor LG 27” IPS",
    price: 310,
    badge: "Monitores",
    image: "media/products/monitor_lg.png",
    description: "Colores vivos y gran ángulo de visión.",
    deal: true,
    discountPct: 22,
  },
  {
    id: "6",
    title: "Memoria RAM 16GB DDR4",
    price: 45,
    badge: "Memorias",
    image: "media/products/ram_16gb.png",
    description: "Mejora el rendimiento de tu PC.",
    deal: false,
  },
  {
    id: "7",
    title: "Router Wi-Fi 6 Dual Band",
    price: 95,
    badge: "Redes",
    image: "media/products/router_wifi6.png",
    description: "Más velocidad y mejor cobertura.",
    deal: true,
    discountPct: 28,
  },
  {
    id: "8",
    title: "Aspiradora Compacta",
    price: 79,
    badge: "Electrodomésticos",
    image: "media/products/aspiradora.png",
    description: "Potente y liviana para el hogar.",
    deal: false,
  },
];

const STORAGE_KEY = "bestprice_cart_v1";
const $ = (id) => document.getElementById(id);

/* =========================
   HELPERS
   ========================= */
function money(n) {
  return `$${Number(n).toLocaleString("en-US")}`;
}

function normalizeText(s) {
  return (s || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function calcWasPrice(price, discountPct) {
  const d = Math.max(0, Math.min(90, Number(discountPct || 0)));
  if (!d) return null;
  const was = price / (1 - d / 100);
  return Math.round(was);
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function setCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  syncCartUI();
}

function syncCartUI() {
  const count = getCart().reduce((acc, item) => acc + (item.qty || 1), 0);
  const el = $("cartCount");
  if (el) el.textContent = String(count);
}

function fillFooterCategories() {
  const listEl = $("footerCategoryList");
  if (!listEl) return;
  listEl.innerHTML = categories
    .map((c) => `<li><a href="productos.html#${encodeURIComponent(c)}">${c}</a></li>`)
    .join("");
}

function addToCart(product) {
  const cart = getCart();
  const found = cart.find((x) => x.id === product.id);
  if (found) found.qty = (found.qty || 1) + 1;
  else cart.push({ id: product.id, qty: 1 });
  setCart(cart);
}

/* =========================
   SEARCH “INTELIGENTE”
   ========================= */
const SYNONYMS = [
  ["notebook", "laptop", "portatil", "portátil"],
  ["mouse", "raton", "ratón"],
  ["teclado", "keyboard"],
  ["router", "wifi", "wi-fi", "red", "internet"],
  ["monitor", "pantalla", "display"],
  ["impresora", "printer"],
  ["memoria", "ram"],
];

function expandQuery(q) {
  const base = normalizeText(q);
  if (!base) return [];
  const tokens = base.split(" ").filter(Boolean);

  const expanded = new Set(tokens);
  for (const t of tokens) {
    for (const group of SYNONYMS) {
      const normGroup = group.map(normalizeText);
      if (normGroup.includes(t)) normGroup.forEach((x) => expanded.add(x));
    }
  }
  return Array.from(expanded);
}

function scoreProduct(p, rawQuery) {
  const qTokens = expandQuery(rawQuery);
  if (!qTokens.length) return 0;

  const hay = normalizeText(`${p.title} ${p.badge || ""} ${p.description || ""}`);
  let score = 0;

  for (const t of qTokens) {
    if (!t) continue;
    if (hay.split(" ").some((w) => w.startsWith(t))) score += 8;
    if (hay.includes(t)) score += 4;

    const title = normalizeText(p.title);
    if (title.includes(t)) score += 6;
    if (title.split(" ").some((w) => w.startsWith(t))) score += 8;
  }

  if (p.deal) score += 6;
  return score;
}

function highlightMatch(text, query) {
  const token = normalizeText(query).split(" ")[0];
  if (!token) return text;

  const plain = text.toString();
  const idx = plain.toLowerCase().indexOf(token);
  if (idx === -1) return plain;

  const a = plain.slice(0, idx);
  const b = plain.slice(idx, idx + token.length);
  const c = plain.slice(idx + token.length);

  return `${a}<span class="sugMark">${b}</span>${c}`;
}

function setupSearch() {
  const input = $("searchInput");
  const dd = $("searchDropdown");
  const iconBtn = document.querySelector(".topsearch__icon");
  if (!input || !dd) return;

  function openDD() {
    dd.hidden = false;
  }
  function closeDD() {
    dd.hidden = true;
    dd.innerHTML = "";
  }

  function goToProducts(query) {
    const q = (query || "").trim();
    if (!q) return;
    window.location.href = `productos.html?q=${encodeURIComponent(q)}`;
  }

  function renderSuggestions(query) {
    const q = (query || "").trim();
    if (!q) {
      closeDD();
      return;
    }

    const ranked = products
      .map((p) => ({ p, s: scoreProduct(p, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 6);

    if (!ranked.length) {
      dd.innerHTML = `<div class="sug"><div class="sug__left"><div class="sug__name">Sin resultados</div><div class="sug__meta">Probá con “notebook”, “monitor”, “router”…</div></div></div>`;
      openDD();
      return;
    }

    dd.innerHTML = ranked
      .map(({ p }) => {
        let meta = `${p.badge || "Productos"}`;
        let right = `${money(p.price)}`;

        if (p.deal) {
          const was = p.wasPrice ?? calcWasPrice(p.price, p.discountPct);
          const pct = p.discountPct ? ` • -${p.discountPct}%` : "";
          meta = `${p.badge || "Productos"}${pct}`;
          if (was) {
            right += ` <span style="opacity:.55;text-decoration:line-through;font-weight:800;margin-left:6px;">${money(
              was
            )}</span>`;
          }
        }

        return `
          <div class="sug" data-id="${p.id}">
            <div class="sug__left">
              <div class="sug__name">${highlightMatch(p.title, q)}</div>
              <div class="sug__meta">${meta}</div>
            </div>
            <div class="sug__price">${right}</div>
          </div>
        `;
      })
      .join("");

    openDD();
  }

  iconBtn?.addEventListener("click", () => {
    input.focus();
    renderSuggestions(input.value);
  });

  input.addEventListener("input", () => renderSuggestions(input.value));

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goToProducts(input.value);
      closeDD();
    }
    if (e.key === "Escape") closeDD();
  });

  dd.addEventListener("click", (e) => {
    const item = e.target.closest(".sug[data-id]");
    if (!item) return;
    const p = products.find((x) => x.id === item.dataset.id);
    if (!p) return;
    window.location.href = `productos.html?q=${encodeURIComponent(p.title)}`;
  });

  document.addEventListener("click", (e) => {
    if (e.target.closest(".topsearch")) return;
    closeDD();
  });
}

/* =========================
   HERO CAROUSEL - fondos generados
   ========================= */
function makeTechBanner(seed = 1, w = 1920, h = 900) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");

  let s = seed * 99991;
  const rnd = () => {
    s = (s * 48271) % 0x7fffffff;
    return s / 0x7fffffff;
  };

  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, `hsl(${190 + Math.floor(rnd() * 25)}, 35%, 92%)`);
  g.addColorStop(0.55, `hsl(${200 + Math.floor(rnd() * 25)}, 28%, 88%)`);
  g.addColorStop(1, `hsl(${210 + Math.floor(rnd() * 25)}, 22%, 84%)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 5; i++) {
    const x = rnd() * w;
    const y = rnd() * h;
    const r = 180 + rnd() * 320;
    const gg = ctx.createRadialGradient(x, y, 0, x, y, r);
    gg.addColorStop(0, `rgba(255,255,255,${0.25 + rnd() * 0.22})`);
    gg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gg;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 0.14;
  for (let i = 0; i < 16; i++) {
    ctx.fillStyle = i % 2 ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.25)";
    const x = rnd() * w - w * 0.2;
    const y = rnd() * h;
    const ww = 220 + rnd() * 520;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.35);
    ctx.fillRect(0, 0, ww, 18);
    ctx.restore();
  }
  ctx.globalAlpha = 1;

  ctx.globalAlpha = 0.08;
  ctx.strokeStyle = "rgba(0,0,0,1)";
  ctx.lineWidth = 1;
  const step = 70;
  for (let x = 0; x <= w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y <= h; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  return c.toDataURL("image/jpeg", 0.9);
}

/* =========================
   EXTENDER IMAGEN (JS EN VEZ DE PYTHON)
   ========================= */
/**
 * Crea un banner extendido:
 * - la imagen se dibuja con contain en el centro (sin recorte)
 * - los huecos se rellenan estirando los bordes (tipo “edge extend”)
 * - devuelve un dataURL listo para usar como background
 */
function createExtendedBannerDataURL(img, targetW, targetH) {
  const canvas = document.createElement("canvas");
  const w = targetW;
  const h = targetH;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");

  const iw = img.width;
  const ih = img.height;

  if (!iw || !ih) {
    // fallback tonto por si falla
    ctx.fillStyle = "#f3f3f3";
    ctx.fillRect(0, 0, w, h);
    return canvas.toDataURL("image/png");
  }

  // Escala tipo contain
  const scale = Math.min(w / iw, h / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (w - dw) / 2;
  const dy = (h - dh) / 2;

  // Fondo neutro base
  ctx.fillStyle = "#f3f3f3";
  ctx.fillRect(0, 0, w, h);

  const gapX = dx;
  const gapY = dy;

  // Extiende bordes horizontalmente (izquierda / derecha)
  if (gapX > 0) {
    // izquierda
    ctx.drawImage(img, 0, 0, 1, ih, 0, 0, gapX, h);
    // derecha
    ctx.drawImage(img, iw - 1, 0, 1, ih, dx + dw, 0, w - (dx + dw), h);
  }

  // Extiende bordes verticalmente (arriba / abajo)
  if (gapY > 0) {
    // arriba
    ctx.drawImage(img, 0, 0, iw, 1, 0, 0, w, gapY);
    // abajo
    ctx.drawImage(img, 0, ih - 1, iw, 1, 0, dy + dh, w, h - (dy + dh));
  }

  // Dibuja la imagen principal por encima, sin recorte
  ctx.drawImage(img, 0, 0, iw, ih, dx, dy, dw, dh);

  return canvas.toDataURL("image/jpeg", 0.9);
}

/**
 * Carga una imagen, la extiende al tamaño del carrusel, y
 * setea el background del slide con ese dataURL.
 */
function extendImageForSlide(slide, src, targetW, targetH) {
  const img = new Image();
  img.src = src;
  img.onload = () => {
    const dataUrl = createExtendedBannerDataURL(img, targetW, targetH);
    slide.style.backgroundImage = `url("${dataUrl}")`;
    slide.style.backgroundPosition = "center";
    slide.style.backgroundRepeat = "no-repeat";
    slide.style.backgroundSize = "cover"; // ahora el banner ya tiene el ratio correcto
  };
  img.onerror = () => {
    // si falla, al menos mostramos la imagen normal con contain
    slide.style.backgroundImage = `url("${src}")`;
    slide.style.backgroundPosition = "center";
    slide.style.backgroundRepeat = "no-repeat";
    slide.style.backgroundSize = "contain";
    slide.style.backgroundColor = "#f3f3f3";
  };
}

/* =========================
   HERO CAROUSEL (usa extensión automática)
   ========================= */
function renderHeroCarousel() {
  const carousel = $("heroCarousel");
  const dotsWrap = $("heroDots");
  const prevBtn = $("heroPrev");
  const nextBtn = $("heroNext");
  if (!carousel || !dotsWrap || !prevBtn || !nextBtn) return;

  const targetW = carousel.clientWidth || 1320;
  const targetH = carousel.clientHeight || 520;

  // Slides del carrusel
  const slidesData = [
    { type: "image", src: "media/promocion1.png" },  // tu promo
    { type: "image", src: "media/promocion2.png" },  // otra promo si querés
    { type: "gen", seed: 2 },
    { type: "gen", seed: 3 },
  ];

  const slides = slidesData.map((item, idx) => {
    const slide = document.createElement("div");
    slide.className = "heroCarousel__slide" + (idx === 0 ? " is-active" : "");

    if (item.type === "image") {
      // ✅ extensión automática en el navegador, sin Python
      extendImageForSlide(slide, item.src, targetW, targetH);
    } else {
      // fondos generados
      const dataUrl = makeTechBanner(item.seed, targetW * 2, targetH * 2);
      slide.style.backgroundImage = `url("${dataUrl}")`;
      slide.style.backgroundPosition = "center";
      slide.style.backgroundRepeat = "no-repeat";
      slide.style.backgroundSize = "cover";
    }

    carousel.appendChild(slide);
    return slide;
  });

  const dots = slidesData.map((_, idx) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "heroCarousel__dot" + (idx === 0 ? " is-active" : "");
    dot.setAttribute("aria-label", `Ir al slide ${idx + 1}`);
    dotsWrap.appendChild(dot);
    return dot;
  });

  let current = 0;
  let timer = null;

  function setActive(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, idx) => s.classList.toggle("is-active", idx === current));
    dots.forEach((d, idx) => d.classList.toggle("is-active", idx === current));
  }

  function next() {
    setActive(current + 1);
  }
  function prev() {
    setActive(current - 1);
  }

  function start() {
    stop();
    timer = window.setInterval(next, 4500);
  }
  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  nextBtn.addEventListener("click", () => {
    next();
    start();
  });
  prevBtn.addEventListener("click", () => {
    prev();
    start();
  });
  dots.forEach((dot, idx) =>
    dot.addEventListener("click", () => {
      setActive(idx);
      start();
    })
  );

  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", start);

  start();
}

/* =========================
   CARD TEMPLATE
   ========================= */
function productCardHTML(p) {
  const isDeal = !!p.deal;
  const pct = isDeal && p.discountPct ? `-${p.discountPct}%` : "";
  const was = isDeal ? p.wasPrice ?? calcWasPrice(p.price, p.discountPct) : null;

  return `
    <article class="pcard ${isDeal ? "is-deal" : ""}">
      ${isDeal && pct ? `<div class="pcard__deal">${pct}</div>` : ""}
      <img class="pcard__img" src="${p.image}" alt="${p.title}" loading="lazy" />
      <div class="pcard__body">
        <h3 class="pcard__name">${p.title}</h3>

        <div class="pcard__priceRow">
          <div class="pcard__priceNow">${money(p.price)}</div>
          ${isDeal && was ? `<div class="pcard__priceWas">${money(was)}</div>` : ""}
        </div>

        <div class="pcard__metaRow">
          <div class="pcard__tag">${p.badge || "Productos"}</div>
          <button class="pcard__btn" data-id="${p.id}" type="button">Add</button>
        </div>
      </div>
    </article>
  `;
}

/* =========================
   HOME GRID
   ========================= */
function renderHomeGrid() {
  const grid = $("productGrid");
  if (!grid) return;

  const items = products.slice(0, 8);
  grid.innerHTML = items.map(productCardHTML).join("");

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-id]");
    if (!btn) return;
    const product = products.find((x) => x.id === btn.dataset.id);
    if (product) addToCart(product);
  });
}

/* =========================
   SHOP PAGE
   ========================= */
function renderShopPage() {
  const shopGrid = $("shopGrid");
  if (!shopGrid) return;

  const catList = $("shopCategoryList");
  const resultsCount = $("resultsCount");
  const activeCategoryLabel = $("activeCategoryLabel");
  const activeQueryLabel = $("activeQueryLabel");
  const clearBtn = $("clearFilters");

  const priceMin = $("priceMin");
  const priceMax = $("priceMax");
  const onlyDeals = $("onlyDeals");
  const sortSelect = $("sortSelect");

  let activeCat = "Productos";

  const params = new URLSearchParams(location.search);
  let activeQuery = (params.get("q") || "").trim();

  function setQueryLabel() {
    if (!activeQueryLabel) return;
    activeQueryLabel.textContent = activeQuery ? ` • "${activeQuery}"` : "";
  }

  function renderCats() {
    if (!catList) return;
    catList.innerHTML = categories
      .map((c) => {
        const active = c === activeCat ? "is-active" : "";
        return `<li><button class="${active}" type="button" data-cat="${c}">${c}</button></li>`;
      })
      .join("");
  }

  function applyFilters(list) {
    let out = [...list];

    if (activeCat !== "Productos") {
      out = out.filter((p) => (p.badge || "Productos") === activeCat);
    }

    if (activeQuery) {
      out = out
        .map((p) => ({ p, s: scoreProduct(p, activeQuery) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .map((x) => x.p);
    }

    const minV = Number(priceMin?.value || 0);
    const maxV = Number(priceMax?.value || 0);
    if (!Number.isNaN(minV) && minV > 0) out = out.filter((p) => p.price >= minV);
    if (!Number.isNaN(maxV) && maxV > 0) out = out.filter((p) => p.price <= maxV);

    if (onlyDeals?.checked) out = out.filter((p) => !!p.deal);

    const sort = sortSelect?.value || "relevancia";
    if (sort === "precio_asc") out.sort((a, b) => a.price - b.price);
    if (sort === "precio_desc") out.sort((a, b) => b.price - a.price);
    if (sort === "descuento_desc") out.sort((a, b) => (b.discountPct || 0) - (a.discountPct || 0));

    return out;
  }

  function renderResults() {
    const filtered = applyFilters(products);

    if (resultsCount) resultsCount.textContent = String(filtered.length);
    if (activeCategoryLabel) activeCategoryLabel.textContent = activeCat;
    setQueryLabel();

    shopGrid.innerHTML = filtered.map(productCardHTML).join("");

    shopGrid.onclick = (e) => {
      const btn = e.target.closest("button[data-id]");
      if (!btn) return;
      const product = products.find((x) => x.id === btn.dataset.id);
      if (product) addToCart(product);
    };
  }

  function setFromHash() {
    const hash = decodeURIComponent(location.hash || "").replace("#", "");
    if (hash && categories.includes(hash)) activeCat = hash;
  }

  setFromHash();
  renderCats();
  renderResults();

  window.addEventListener("hashchange", () => {
    setFromHash();
    renderCats();
    renderResults();
  });

  catList?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-cat]");
    if (!btn) return;
    activeCat = btn.dataset.cat;
    renderCats();
    renderResults();
  });

  clearBtn?.addEventListener("click", () => {
    activeCat = "Productos";
    activeQuery = "";
    if (priceMin) priceMin.value = "";
    if (priceMax) priceMax.value = "";
    if (onlyDeals) onlyDeals.checked = false;
    if (sortSelect) sortSelect.value = "relevancia";
    history.replaceState({}, "", "productos.html");
    location.hash = "";
    renderCats();
    renderResults();
  });

  [priceMin, priceMax, onlyDeals, sortSelect].forEach((el) => {
    el?.addEventListener("input", renderResults);
    el?.addEventListener("change", renderResults);
  });

  const headerInput = $("searchInput");
  if (headerInput && activeQuery) headerInput.value = activeQuery;
}

/* =========================
   BOOT
   ========================= */
function boot() {
  syncCartUI();

  const si = $("searchInput");
  if (si) si.placeholder = "Buscar productos";

  setupSearch();

  if ($("heroCarousel")) {
    renderHeroCarousel();
    renderHomeGrid();
  }

  if ($("shopGrid")) {
    renderShopPage();
  }

  const footerYear = $("footerYear");
  if (footerYear) footerYear.textContent = String(new Date().getFullYear());
  fillFooterCategories();

  const cartBtn = $("cartBtn");
  if (cartBtn) cartBtn.addEventListener("click", () => alert("Carrito (demo)."));
}

document.addEventListener("DOMContentLoaded", boot);
