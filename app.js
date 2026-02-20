// =============================
// 0) PRODUCTOS (NUEVOS + VIEJOS)
// =============================

// 🟧 Productos viejos (los que me pasaste)
const LEGACY_PRODUCTS = [
  {
    id: "1",
    title: "Notebook Lenovo IdeaPad 15”",
    price: 511000,
    badge: "Notebooks",
    image: "media/products/notebook_lenovo.png",
    description: "Notebook liviana para estudio y trabajo diario.",
    deal: true,
    discountPct: 18,
    stockDisponible: 12
  },
  {
    id: "2",
    title: "Monitor Samsung 24” Full HD",
    price: 123400,
    badge: "Monitores",
    image: "media/products/monitor_samsung.png",
    description: "Pantalla ideal para oficina y home office.",
    deal: false,
    stockDisponible: 20
  },
  {
    id: "3",
    title: "Kit Teclado + Mouse Logitech",
    price: 59000,
    badge: "Periféricos",
    image: "media/products/teclado_mouse.png",
    description: "Combo inalámbrico cómodo y confiable.",
    deal: true,
    discountPct: 35,
    stockDisponible: 15
  },
  {
    id: "4",
    title: "Impresora HP DeskJet",
    price: 250790,
    badge: "Impresoras e Insumos",
    image: "media/products/impresora_hp.png",
    description: "Impresión y escaneo para el hogar.",
    deal: false,
    stockDisponible: 8
  },
  {
    id: "5",
    title: "Monitor LG 27” IPS",
    price: 240977,
    badge: "Monitores",
    image: "media/products/monitor_lg.png",
    description: "Colores vivos y gran ángulo de visión.",
    deal: true,
    discountPct: 22,
    stockDisponible: 9
  },
  {
    id: "6",
    title: "Memoria RAM 16GB DDR4",
    price: 260000,
    badge: "Memorias",
    image: "media/products/ram_16gb.png",
    description: "Mejora el rendimiento de tu PC.",
    deal: false,
    stockDisponible: 25
  },
  {
    id: "7",
    title: "Router Wi-Fi 6 Dual Band",
    price: 133175,
    badge: "Redes",
    image: "media/products/router_wifi6.png",
    description: "Más velocidad y mejor cobertura.",
    deal: true,
    discountPct: 28,
    stockDisponible: 14
  },
  {
    id: "8",
    title: "Aspiradora Compacta",
    price: 56749,
    badge: "Electrodomésticos",
    image: "media/products/aspiradora.png",
    description: "Potente y liviana para el hogar.",
    deal: false,
    stockDisponible: 10
  },
];

// 🟩 Productos nuevos
const NEW_PRODUCTS = [
  {
    id: "notebook-asus-gaming",
    nombre: 'Notebook ASUS Gaming 15.6" RTX 4060',
    categoria: "Notebooks",
    marca: "ASUS",
    precio: 8193050,
    precioAntes: 8799000,
    oferta: true,
    tag: "RTX 4060",
    imagen: "media/products/notebook_asus_gaming.png",
    descripcion: "Notebook gaming de alto rendimiento para 1080p/1440p.",
    stockDisponible: 3
  },
  {
    id: "teclado-corsair-k65",
    nombre: "Teclado Mecánico Corsair K65 PLUS 75%",
    categoria: "Periféricos",
    marca: "Corsair",
    precio: 221750,
    precioAntes: null,
    oferta: false,
    tag: "Wireless",
    imagen: "media/products/teclado_corsair_k65.png",
    descripcion: "Teclado compacto, ideal para setup gamer.",
    stockDisponible: 12
  },
  {
    id: "auriculares-corsair-hs80",
    nombre: "Auriculares Corsair HS80 Wireless Dolby Atmos",
    categoria: "Periféricos",
    marca: "Corsair",
    precio: 272300,
    precioAntes: 299999,
    oferta: true,
    tag: "7.1 Surround",
    imagen: "media/products/auriculares_corsair_hs80.png",
    descripcion: "Sonido envolvente para juegos y streaming.",
    stockDisponible: 2
  },
  {
    id: "silla-razer-iskur-negra",
    nombre: "Silla Gamer Razer Iskur V2 Negra",
    categoria: "Sillas Gamers",
    marca: "Razer",
    precio: 494950,
    precioAntes: null,
    oferta: false,
    tag: "Peso máx. 136Kg",
    imagen: "media/products/silla_razer_iskur_negra.png",
    descripcion: "Ergonomía y soporte lumbar premium.",
    stockDisponible: 5
  },
  {
    id: "silla-razer-iskur-gris",
    nombre: "Silla Gamer Razer Iskur V2 Gris",
    categoria: "Sillas Gamers",
    marca: "Razer",
    precio: 494950,
    precioAntes: null,
    oferta: false,
    tag: "Peso máx. 136Kg",
    imagen: "media/products/silla_razer_iskur_gris.png",
    descripcion: "Ergonomía premium para largas sesiones.",
    stockDisponible: 4
  },
  {
    id: "auriculares-corsair-void",
    nombre: "Auriculares Corsair Void V2 Elite Wireless",
    categoria: "Periféricos",
    marca: "Corsair",
    precio: 236200,
    precioAntes: null,
    oferta: false,
    tag: "Wireless 2.4Ghz",
    imagen: "media/products/auriculares_corsair_void.png",
    descripcion: "Wireless estable con buena batería.",
    stockDisponible: 6
  },
];

// Normalizo legacy al formato nuevo
function normalizeLegacy(p) {
  const before =
    p.deal && p.discountPct
      ? Math.round(p.price / (1 - p.discountPct / 100))
      : null;

  return {
    id: `legacy-${p.id}`,
    nombre: p.title,
    categoria: p.badge,
    marca: "Generic",
    precio: p.price,
    precioAntes: before,
    oferta: !!p.deal,
    tag: p.badge,
    imagen: p.image,
    descripcion: p.description || "Producto destacado (demo).",
  };
}

const BP_PRODUCTS = [...NEW_PRODUCTS, ...LEGACY_PRODUCTS.map(normalizeLegacy)];
window.BP_PRODUCTS = BP_PRODUCTS;

// =============================
// 1) HELPERS
// =============================
function formatPrice(n) {
  if (typeof n !== "number") return "";
  return "$" + n.toLocaleString("es-AR");
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("bp_cart") || "[]");
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("bp_cart", JSON.stringify(cart));
  updateCartCount();

  // ✅ Notifica cambios del carrito (misma pestaña + carrito.html)
  // Nota: el evento 'storage' NO se dispara en la misma pestaña.
  try {
    window.dispatchEvent(new CustomEvent("bp_cart_updated", { detail: { cart } }));
  } catch {
    window.dispatchEvent(new Event("bp_cart_updated"));
  }
}

function addToCart(productId, qty) {
  const cart = getCart();

  // Normaliza carritos viejos: qty -> cantidad y ids numéricos -> legacy-*
  cart.forEach((it) => {
    if (it && it.qty != null && it.cantidad == null) it.cantidad = it.qty;
    if (it && typeof it.id === "number") it.id = String(it.id);
  });

  const existing = cart.find((c) => c.id === productId);

  // ✅ Tope de cantidad por producto:
  // - mínimo: 1
  // - máximo: 10
  // - y nunca puede superar el stock disponible (si está definido)
  const prod = BP_PRODUCTS.find((p) => p.id === productId);
  const available = getProductAvailableStock(prod);
  const maxAllowed = Math.max(
    1,
    Math.min(10, available != null ? Number(available) : 10)
  );

  const addN = Math.max(1, Number(qty) || 1);

  if (existing) {
    existing.cantidad = Math.min(maxAllowed, (Number(existing.cantidad) || 0) + addN);
  } else {
    cart.push({ id: productId, cantidad: Math.min(maxAllowed, addN) });
  }

  saveCart(cart);
}

function updateCartCount() {
  const el = document.getElementById("cartCount");
  if (!el) return;
  const cart = getCart();
  const total = cart.reduce((acc, it) => acc + (it.cantidad || 0), 0);
  el.textContent = String(total);
}

// =============================
// 1.x) STOCK (catálogo)
// =============================
// Usamos el stock REAL por producto (propiedad `stockDisponible`).
// Si no existe, devolvemos null y la UI mostrará "Disponible".
function getProductAvailableStock(prod) {
  if (!prod) return null;
  if (typeof prod.stockDisponible === "number") return prod.stockDisponible;
  return null;
}


// =============================
// 1.1) SEARCH (normalización + fuzzy)
// =============================
function _norm(str) {
  return String(str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // acentos fuera
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function _levenshtein(a, b) {
  a = _norm(a);
  b = _norm(b);
  if (a === b) return 0;
  if (!a) return b.length;
  if (!b) return a.length;

  const m = a.length;
  const n = b.length;
  const dp = new Array(n + 1);
  for (let j = 0; j <= n; j++) dp[j] = j;

  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + cost);
      prev = tmp;
    }
  }
  return dp[n];
}

function _tokenThreshold(token) {
  const l = token.length;
  if (l <= 3) return 0;
  if (l <= 5) return 1;
  if (l <= 8) return 2;
  return 3;
}

function _fuzzyTokenInText(token, words) {
  if (!token) return true;
  const thr = _tokenThreshold(token);

  for (const w of words) {
    if (!w) continue;
    if (w.includes(token) || w.startsWith(token)) return true;

    if (thr > 0 && Math.abs(w.length - token.length) <= thr) {
      if (_levenshtein(w, token) <= thr) return true;
    }
  }
  return false;
}

function productMatchesQuery(prod, queryRaw) {
  const q = _norm(queryRaw);
  if (!q) return true;

  const hay = _norm(
    `${prod.nombre} ${prod.marca} ${prod.categoria} ${prod.tag || ""}`
  );

  // match directo
  if (hay.includes(q)) return true;

  // match palabra por palabra con fuzzy
  const tokens = q.split(" ").filter(Boolean);
  const words = hay.split(" ").filter(Boolean);
  for (const t of tokens) {
    if (!_fuzzyTokenInText(t, words)) return false;
  }
  return true;
}

function filterByQuery(list, queryRaw) {
  const q = _norm(queryRaw);
  if (!q) return list.slice();
  return list.filter((p) => productMatchesQuery(p, q));
}

function scoreProductForQuery(prod, queryRaw) {
  const q = _norm(queryRaw);
  if (!q) return 9999;

  const hay = _norm(`${prod.nombre} ${prod.marca} ${prod.categoria}`);
  if (hay.includes(q)) return 0;

  const tokens = q.split(" ").filter(Boolean);
  const words = hay.split(" ").filter(Boolean);

  let score = 0;
  for (const t of tokens) {
    let best = 9;
    const thr = _tokenThreshold(t);

    for (const w of words) {
      if (w.includes(t) || w.startsWith(t)) {
        best = 0;
        break;
      }
      if (thr > 0) best = Math.min(best, _levenshtein(w, t));
    }
    score += best;
  }
  return score;
}

function debounce(fn, wait = 130) {
  let t = null;
  return (...args) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

function isProductosPage() {
  return window.location.pathname.toLowerCase().includes("productos.html");
}

// =============================
// 2) HEADER: nav activo + botón carrito
// =============================
function initHeader() {
  const path = window.location.pathname.toLowerCase();

  // nav activo por página
  const navLinks = document.querySelectorAll(".topnav__link");
  // ✅ En carrito.html NO se marca ningún link (ni Home, ni Productos, ni Ayuda)
  let activeKey = null;

  if (path.includes("carrito.html")) {
    activeKey = null;
  } else if (path.includes("productos.html") || path.includes("producto.html")) {
    activeKey = "productos.html";
  } else {
    activeKey = "index.html";
  }

  navLinks.forEach((a) => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    // Si estamos en carrito.html, limpiamos cualquier activo (incluyendo links con href="#")
    if (!activeKey) {
      a.classList.remove("is-active");
      return;
    }
    if (!href || href === "#") {
      a.classList.remove("is-active");
      return;
    }
    a.classList.toggle("is-active", href === activeKey);
  });

  const cartBtn = document.getElementById("cartBtn");
  if (cartBtn)
    cartBtn.addEventListener("click", () => (window.location.href = "carrito.html"));

  updateCartCount();
}

// =============================
// 3) CARDS (grid)
// =============================
function createProductCard(prod) {
  const card = document.createElement("article");
  card.className = "pcard" + (prod.oferta ? " is-deal" : "");

  const link = document.createElement("a");
  link.href = `producto.html?id=${encodeURIComponent(prod.id)}`;
  link.style.textDecoration = "none";
  link.style.color = "inherit";

  const img = document.createElement("img");
  img.className = "pcard__img";
  img.src = prod.imagen;
  img.alt = prod.nombre;

  const deal = document.createElement("div");
  deal.className = "pcard__deal";
  deal.textContent = "OFERTA";

  const body = document.createElement("div");
  body.className = "pcard__body";

  const name = document.createElement("h3");
  name.className = "pcard__name";
  name.textContent = prod.nombre;

  const priceRow = document.createElement("div");
  priceRow.className = "pcard__priceRow";

  const priceNow = document.createElement("span");
  priceNow.className = "pcard__priceNow";
  priceNow.textContent = formatPrice(prod.precio);

  // ✅ SIEMPRE existe (para alinear altura), NO duplicar nunca
  const priceWas = document.createElement("span");
  priceWas.className = "pcard__priceWas";
  priceWas.textContent = prod.precioAntes ? formatPrice(prod.precioAntes) : " ";

  priceRow.appendChild(priceNow);
  priceRow.appendChild(priceWas);

  const metaRow = document.createElement("div");
  metaRow.className = "pcard__metaRow";

  const tag = document.createElement("span");
  tag.className = "pcard__tag";
  tag.textContent = prod.tag || prod.categoria;

  // ✅ botón compatible con tu CSS actual (negro + ícono)
  const btn = document.createElement("button");
  btn.className = "pcard__btn pcard__btn--img";
  btn.type = "button";
  btn.setAttribute("aria-label", "Sumar al carrito");

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(prod.id, 1);
  });

  metaRow.appendChild(tag);
  metaRow.appendChild(btn);

  body.appendChild(name);
  body.appendChild(priceRow);
  body.appendChild(metaRow);

  link.appendChild(img);
  link.appendChild(deal);
  link.appendChild(body);

  card.appendChild(link);
  return card;
}

function renderProductGrid(list, containerId) {
  const grid = document.getElementById(containerId);
  if (!grid) return;

  grid.innerHTML = "";
  list.forEach((p) => grid.appendChild(createProductCard(p)));

  const resultsCount = document.getElementById("resultsCount");
  if (resultsCount) resultsCount.textContent = String(list.length);
}

// =============================
// 4) HOME: carrusel + destacados
// =============================
function initHome() {
  const heroCarousel = document.getElementById("heroCarousel");
  const heroDots = document.getElementById("heroDots");
  if (!heroCarousel || !heroDots) return;

  const slidesData = [
    { img: "media/promocion1_final.png" },
    { img: "media/promocion2_final.png" },
    { img: "media/promocion3_final.png" },
    { img: "media/promocion4_final.png" },
  ];

  let current = 0;
  const slides = [];
  heroCarousel.querySelectorAll(".heroCarousel__slide").forEach((n) => n.remove());
  heroDots.querySelectorAll(".heroCarousel__dot").forEach((n) => n.remove());

  slidesData.forEach((s, idx) => {
    const slide = document.createElement("div");
    slide.className = "heroCarousel__slide" + (idx === 0 ? " is-active" : "");
    slide.style.setProperty("--slide-img", `url("${s.img}")`);

    const img = document.createElement("img");
    img.className = "heroCarousel__img";
    img.src = s.img;
    img.alt = `Promoción ${idx + 1}`;

    slide.appendChild(img);
    heroCarousel.appendChild(slide);
    slides.push(slide);

    const dot = document.createElement("button");
    dot.className = "heroCarousel__dot" + (idx === 0 ? " is-active" : "");
    dot.type = "button";
    dot.addEventListener("click", () => goToSlide(idx));
    heroDots.appendChild(dot);
  });

  const dots = Array.from(heroDots.querySelectorAll(".heroCarousel__dot"));

  function goToSlide(i) {
    slides[current].classList.remove("is-active");
    dots[current].classList.remove("is-active");
    current = (i + slides.length) % slides.length;
    slides[current].classList.add("is-active");
    dots[current].classList.add("is-active");
  }

  const prevBtn = document.getElementById("heroPrev");
  const nextBtn = document.getElementById("heroNext");
  if (prevBtn) prevBtn.onclick = () => goToSlide(current - 1);
  if (nextBtn) nextBtn.onclick = () => goToSlide(current + 1);

  setInterval(() => goToSlide(current + 1), 7000);

  renderProductGrid(BP_PRODUCTS.slice(0, 8), "productGrid");
}

// =============================
// 5) PRODUCTOS: filtros + búsqueda
// =============================
const filterState = {
  categoria: null,
  marca: null,
  min: null,
  max: null,
  ofertas: false,
  sort: "featured",
  query: "",
};

function initProductsPage() {
  const shopLayout = document.querySelector(".shopLayout");
  if (!shopLayout) return;

  // ✅ toma q de URL
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");
  if (q) filterState.query = q.trim();

  // ✅ si venís del footer
  const storedCat = sessionStorage.getItem("bp_categoryFilter");
  if (storedCat) {
    filterState.categoria = storedCat;
    sessionStorage.removeItem("bp_categoryFilter");
  }

  // ✅ refleja query en input si existe
  const searchInput = document.getElementById("searchInput");
  if (searchInput && filterState.query) searchInput.value = filterState.query;

  populateFilterLists();
  bindFilters();
  applyFiltersAndRender();
}

function populateFilterLists() {
  // ✅ opcional: si hay query, armar listas SOLO con los que matchean query
  let base = BP_PRODUCTS.slice();
  if (filterState.query && filterState.query.trim()) {
    base = filterByQuery(base, filterState.query);
  }

  const catSet = new Set();
  const brandSet = new Set();
  base.forEach((p) => {
    catSet.add(p.categoria);
    brandSet.add(p.marca);
  });

  const catList = document.getElementById("filterCategoryList");
  const brandList = document.getElementById("filterBrandList");

  if (catList) {
    catList.innerHTML = "";
    Array.from(catSet)
      .sort()
      .forEach((cat) => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = cat;
        btn.dataset.value = cat;
        btn.classList.toggle("is-active", filterState.categoria === cat);
        li.appendChild(btn);
        catList.appendChild(li);
      });
  }

  if (brandList) {
    brandList.innerHTML = "";
    Array.from(brandSet)
      .sort()
      .forEach((brand) => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = brand;
        btn.dataset.value = brand;
        btn.classList.toggle("is-active", filterState.marca === brand);
        li.appendChild(btn);
        brandList.appendChild(li);
      });
  }
}

function bindFilters() {
  const catList = document.getElementById("filterCategoryList");
  const brandList = document.getElementById("filterBrandList");
  const minInput = document.getElementById("filterMin");
  const maxInput = document.getElementById("filterMax");
  const dealsCheck = document.getElementById("filterDeals");
  const clearBtn = document.getElementById("filtersClearBtn");
  const sortSelect = document.getElementById("resultsSort");

  if (catList) {
    catList.onclick = (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const value = btn.dataset.value;
      filterState.categoria = filterState.categoria === value ? null : value;
      populateFilterLists();
      applyFiltersAndRender();
    };
  }

  if (brandList) {
    brandList.onclick = (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const value = btn.dataset.value;
      filterState.marca = filterState.marca === value ? null : value;
      populateFilterLists();
      applyFiltersAndRender();
    };
  }

  if (minInput) {
    minInput.oninput = () => {
      const v = parseInt(minInput.value, 10);
      filterState.min = Number.isFinite(v) ? v : null;
      applyFiltersAndRender();
    };
  }

  if (maxInput) {
    maxInput.oninput = () => {
      const v = parseInt(maxInput.value, 10);
      filterState.max = Number.isFinite(v) ? v : null;
      applyFiltersAndRender();
    };
  }

  if (dealsCheck) {
    dealsCheck.onchange = () => {
      filterState.ofertas = dealsCheck.checked;
      applyFiltersAndRender();
    };
  }

  if (sortSelect) {
    sortSelect.onchange = () => {
      filterState.sort = sortSelect.value;
      applyFiltersAndRender();
    };
  }

  if (clearBtn) {
    clearBtn.onclick = () => {
      filterState.categoria = null;
      filterState.marca = null;
      filterState.min = null;
      filterState.max = null;
      filterState.ofertas = false;
      filterState.sort = "featured";
      filterState.query = "";

      if (minInput) minInput.value = "";
      if (maxInput) maxInput.value = "";
      if (dealsCheck) dealsCheck.checked = false;
      if (sortSelect) sortSelect.value = "featured";

      const searchInput = document.getElementById("searchInput");
      if (searchInput) searchInput.value = "";

      // ✅ limpia el ?q= de la URL
      const u = new URL(window.location.href);
      u.searchParams.delete("q");
      window.history.replaceState({}, "", u.toString());

      populateFilterLists();
      applyFiltersAndRender();
    };
  }
}

function applyFiltersAndRender() {
  let list = BP_PRODUCTS.slice();

  // ✅ búsqueda primero (fuzzy)
  if (filterState.query && filterState.query.trim()) {
    list = filterByQuery(list, filterState.query);
  }

  if (filterState.categoria) list = list.filter((p) => p.categoria === filterState.categoria);
  if (filterState.marca) list = list.filter((p) => p.marca === filterState.marca);
  if (filterState.min != null) list = list.filter((p) => p.precio >= filterState.min);
  if (filterState.max != null) list = list.filter((p) => p.precio <= filterState.max);
  if (filterState.ofertas) list = list.filter((p) => p.oferta);

  switch (filterState.sort) {
    case "price-asc":
      list.sort((a, b) => a.precio - b.precio);
      break;
    case "price-desc":
      list.sort((a, b) => b.precio - a.precio);
      break;
    case "name-asc":
      list.sort((a, b) => a.nombre.localeCompare(b.nombre));
      break;
    default:
      break;
  }

  renderProductGrid(list, "productGrid");
}

// =============================
// 6) FOOTER: categorías -> productos.html
// =============================
function initFooterCategories() {
  const listEl = document.getElementById("footerCategoryList");
  if (!listEl) return;

  const cats = Array.from(new Set(BP_PRODUCTS.map((p) => p.categoria))).sort();
  listEl.innerHTML = "";

  cats.forEach((cat) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "productos.html";
    a.textContent = cat;
    a.onclick = (e) => {
      e.preventDefault();
      sessionStorage.setItem("bp_categoryFilter", cat);
      window.location.href = "productos.html";
    };
    li.appendChild(a);
    listEl.appendChild(li);
  });

  const year = document.getElementById("footerYear");
  if (year) year.textContent = String(new Date().getFullYear());
}

// =============================
// 7) BUSCADOR (tiempo real + fuzzy) + ✅ BOTÓN CLEAR (X)
// =============================

function injectSearchClearStylesOnce() {
  if (document.getElementById("bp-search-clear-style")) return;
  const style = document.createElement("style");
  style.id = "bp-search-clear-style";
  style.textContent = `
    .topsearch__clear{
      border: 0;
      background: transparent;
      cursor: pointer;
      display: none;           /* se activa con JS */
      place-items: center;
      opacity: 0.85;
      flex: 0 0 auto;
    }
    .topsearch__clear svg{
      width: 18px;
      height: 18px;
      fill: currentColor;
    }

    /* Header search (altura 44px) */
    .topsearch:not(.topsearch--results) .topsearch__clear{
      width: 46px;
      height: 44px;
      color: rgba(255,255,255,0.85);
    }

    /* Productos search (altura 52px) */
    .topsearch--results .topsearch__clear{
      width: 52px;
      height: 52px;
      color: rgba(0,0,0,0.55);
    }

    /* Hover sutil */
    .topsearch__clear:hover{ opacity: 1; }
  `;
  document.head.appendChild(style);
}

function initSearch() {
  const input = document.getElementById("searchInput");
  const dropdown = document.getElementById("searchDropdown");
  if (!input || !dropdown) return;

  injectSearchClearStylesOnce();
  input.placeholder = "Buscar productos…";

  const wrapper = input.closest(".topsearch");
  let clearBtn = wrapper ? wrapper.querySelector(".topsearch__clear") : null;

  // ✅ crea la X si no existe (no tenés que tocar HTML)
  if (wrapper && !clearBtn) {
    clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "topsearch__clear";
    clearBtn.setAttribute("aria-label", "Borrar búsqueda");
    clearBtn.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7A1 1 0 0 0 5.7 7.1L10.6 12l-4.9 4.9a1 1 0 1 0 1.4 1.4L12 13.4l4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4Z"/>
      </svg>
    `;
    // la insertamos antes del dropdown (así queda a la derecha del input)
    wrapper.insertBefore(clearBtn, dropdown);
  }

  function close() {
    dropdown.hidden = true;
    dropdown.innerHTML = "";
  }

  function setURLQuery(q) {
    if (!isProductosPage()) return;
    const u = new URL(window.location.href);
    if (q && q.trim()) u.searchParams.set("q", q.trim());
    else u.searchParams.delete("q");
    window.history.replaceState({}, "", u.toString());
  }

  function goSearch(term) {
    const q = (term || "").trim();
    if (!q) return;

    if (isProductosPage()) {
      filterState.query = q;
      populateFilterLists();
      applyFiltersAndRender();
      setURLQuery(q);
      close();
      return;
    }

    window.location.href = `productos.html?q=${encodeURIComponent(q)}`;
  }

  function syncClearVisibility() {
    if (!clearBtn) return;
    const has = (input.value || "").trim().length > 0;
    clearBtn.style.display = has ? "grid" : "none";
  }

  function clearSearchEverywhere() {
    input.value = "";
    syncClearVisibility();
    close();
    input.focus();

    // ✅ si estás en productos.html: también limpia el filtro y re-renderiza
    if (isProductosPage()) {
      filterState.query = "";
      setURLQuery("");
      populateFilterLists();
      applyFiltersAndRender();
    }
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", (e) => {
      e.preventDefault();
      clearSearchEverywhere();
    });
  }

  // ✅ tiempo real solo en productos.html (debounce para que sea fluido)
  const liveApply = debounce((term) => {
    if (!isProductosPage()) return;
    filterState.query = (term || "").trim();
    populateFilterLists();
    applyFiltersAndRender();
    setURLQuery(filterState.query);
  }, 120);

  // estado inicial del botón X
  syncClearVisibility();

  input.addEventListener("input", () => {
    const raw = input.value || "";
    const term = raw.trim();

    syncClearVisibility();

    // ✅ productos.html: filtra mientras tipeás
    liveApply(term);

    const q = _norm(term);
    if (!q) return close();

    // ✅ sugerencias fuzzy
    const matches = BP_PRODUCTS
      .filter((p) => productMatchesQuery(p, q))
      .map((p) => ({ p, s: scoreProductForQuery(p, q) }))
      .sort((a, b) => a.s - b.s)
      .slice(0, 7)
      .map((x) => x.p);

    if (!matches.length) return close();

    dropdown.hidden = false;
    dropdown.innerHTML = "";

    matches.forEach((p) => {
      const row = document.createElement("div");
      row.className = "sug";

      const left = document.createElement("div");
      left.className = "sug__left";

      const name = document.createElement("div");
      name.className = "sug__name";
      name.textContent = p.nombre;

      const meta = document.createElement("div");
      meta.className = "sug__meta";
      meta.textContent = `${p.marca} · ${p.categoria}`;

      left.appendChild(name);
      left.appendChild(meta);

      const price = document.createElement("div");
      price.className = "sug__price";
      price.textContent = formatPrice(p.precio);

      row.appendChild(left);
      row.appendChild(price);

      // ✅ al clickear una sugerencia, busca con lo que haya en el input
      row.onclick = () => goSearch(input.value);

      dropdown.appendChild(row);
    });
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && e.target !== input) close();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goSearch(input.value);
    }
    // ✅ ESC limpia rápido (opcional, pero útil)
    if (e.key === "Escape") {
      e.preventDefault();
      clearSearchEverywhere();
    }
  });

  const iconBtn = document.querySelector(".topsearch__icon");
  if (iconBtn) {
    iconBtn.addEventListener("click", () => goSearch(input.value));
  }
}

// =============================
// 8) PRODUCTO (página seria)
// =============================
function initProductDetail() {
  const container = document.getElementById("productDetail");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const prod = BP_PRODUCTS.find((p) => p.id === id) || BP_PRODUCTS[0];
  if (!prod) return;

  container.innerHTML = "";

  const media = document.createElement("div");
  media.className = "cartItem__media";

  const img = document.createElement("img");
  img.className = "productDetail__img";
  img.src = prod.imagen;
  img.alt = prod.nombre;

  media.appendChild(img);

  const info = document.createElement("div");

  const title = document.createElement("h1");
  title.className = "productDetail__infoTitle";
  title.textContent = prod.nombre;

  const priceRow = document.createElement("div");
  priceRow.className = "productDetail__priceRow";

  const priceNow = document.createElement("div");
  priceNow.className = "productDetail__priceNow";
  priceNow.textContent = formatPrice(prod.precio);

  priceRow.appendChild(priceNow);

  if (prod.precioAntes) {
    const was = document.createElement("div");
    was.className = "productDetail__priceWas";
    was.textContent = formatPrice(prod.precioAntes);
    priceRow.appendChild(was);
  }

  const tag = document.createElement("div");
  tag.className = "productDetail__tag";
  tag.textContent = `${prod.marca} · ${prod.categoria}`;

  const btnRow = document.createElement("div");
  btnRow.className = "productDetail__btnRow";

  const addBtn = document.createElement("button");
  addBtn.className = "btnPrimary";
  addBtn.type = "button";
  addBtn.textContent = "Agregar al carrito";
  addBtn.onclick = () => addToCart(prod.id, 1);

  const goCartBtn = document.createElement("button");
  goCartBtn.className = "btnSecondary";
  goCartBtn.type = "button";
  goCartBtn.textContent = "Ir al carrito";
  goCartBtn.onclick = () => (window.location.href = "carrito.html");

  btnRow.appendChild(addBtn);
  btnRow.appendChild(goCartBtn);

  // Buy box + tabs (usa tu CSS actual)
  const buyBox = document.createElement("div");
  buyBox.className = "productDetail__buyBox";
  buyBox.innerHTML = `
    <div class="kvRow"><span class="kvKey">Marca</span><span class="kvVal">${prod.marca}</span></div>
    <div class="kvRow"><span class="kvKey">Categoría</span><span class="kvVal">${prod.categoria}</span></div>
    <div class="kvRow"><span class="kvKey">Stock</span><span class="kvVal">Disponible</span></div>
    <div class="kvRow"><span class="kvKey">Envío</span><span class="kvVal">24/48 hs (demo)</span></div>
  `;

  const tabs = document.createElement("div");
  tabs.className = "productTabs";
  tabs.innerHTML = `
    <div class="productTabs__head">
      <button class="tabBtn is-active" data-tab="desc" type="button">Descripción</button>
      <button class="tabBtn" data-tab="specs" type="button">Especificaciones</button>
      <button class="tabBtn" data-tab="warranty" type="button">Garantía</button>
    </div>
    <div class="productTabs__body" id="tabBody">${prod.descripcion || "Producto demo."}</div>
  `;

  tabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".tabBtn");
    if (!btn) return;

    tabs.querySelectorAll(".tabBtn").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    const body = tabs.querySelector("#tabBody");
    const tab = btn.dataset.tab;

    if (tab === "desc") body.textContent = prod.descripcion || "Producto demo.";
    if (tab === "specs")
      body.textContent = "Specs demo: CPU / RAM / Almacenamiento / Conectividad / etc.";
    if (tab === "warranty")
      body.textContent = "Garantía demo: 12 meses con fabricante / tienda.";
  });

  info.appendChild(title);
  info.appendChild(priceRow);
  info.appendChild(tag);
  info.appendChild(btnRow);
  info.appendChild(buyBox);
  info.appendChild(tabs);

  container.appendChild(media);
  container.appendChild(info);
}

// =============================
// 9) CARRITO (Amazon-like + recomendaciones similares)
// =============================
function initCartPage() {
  const listEl = document.getElementById("cartItems");
  const summaryEl = document.getElementById("cartSummary");
  if (!listEl || !summaryEl) return;

  const recsEl = document.getElementById("cartRecs");
  const sideTrackEl = document.getElementById("cartSideRecsTrack");

  // (demo) link tipo Amazon: desmarca todos
  const unselect = document.getElementById("cartUnselectAll");
  if (unselect) {
    unselect.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll('#cartItems input[type="checkbox"]').forEach((cb) => {
        cb.checked = false;
      });
    });
  }

  // ✅ Controles de carrusel (botones ‹ ›)
  document.querySelectorAll('[data-carousel]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const trackId = btn.getAttribute('data-carousel');
      const dir = Number(btn.getAttribute('data-dir') || '1');
      const track = document.getElementById(trackId);
      if (!track) return;
      track.scrollBy({ left: dir * 320, behavior: 'smooth' });
    });
  });


  // ✅ Recomendaciones: prioriza misma categoría/marca que lo del carrito
  function buildSimilarRecs(cartProds, limit = 8) {
    const cartIds = new Set(cartProds.map((p) => p.id));
    const catCount = new Map();
    const brandCount = new Map();

    cartProds.forEach((p) => {
      catCount.set(p.categoria, (catCount.get(p.categoria) || 0) + 1);
      brandCount.set(p.marca, (brandCount.get(p.marca) || 0) + 1);
    });

    function score(p) {
      let s = 0;
      s += (catCount.get(p.categoria) || 0) * 3;
      s += (brandCount.get(p.marca) || 0) * 2;
      if (p.oferta) s += 1;
      return s;
    }

    const pool = BP_PRODUCTS.filter((p) => !cartIds.has(p.id));
    pool.sort((a, b) => score(b) - score(a));
    return pool.slice(0, limit);
  }

  function renderRecs(cartProds) {
    if (!recsEl) return;
    const recs = buildSimilarRecs(cartProds, 8);
    recsEl.innerHTML = "";
    recs.forEach((p) => recsEl.appendChild(createProductCard(p)));
  }

  function renderSideRecs(cartProds) {
    if (!sideTrackEl) return;
    const recs = buildSimilarRecs(cartProds, 6);
    sideTrackEl.innerHTML = "";
    recs.forEach((p) => sideTrackEl.appendChild(createProductCard(p)));
  }

  function reload() {
    const cart = getCart();
    listEl.innerHTML = "";
    summaryEl.innerHTML = "";

    const cartProds = [];

    if (!cart.length) {
      const empty = document.createElement("p");
      empty.className = "cartSummary__empty";
      empty.textContent = "Tu carrito está vacío.";
      listEl.appendChild(empty);
      summaryEl.appendChild(empty.cloneNode(true));
      renderSideRecs([]);
      renderRecs([]);
      return;
    }

    let subtotal = 0;

    cart.forEach((item) => {
  let prod = BP_PRODUCTS.find((p) => p.id === item.id);

  // ✅ compatibilidad con carritos viejos: "1" -> "legacy-1"
  if (!prod && typeof item.id === "string" && /^\d+$/.test(item.id)) {
    const legacyId = `legacy-${item.id}`;
    prod = BP_PRODUCTS.find((p) => p.id === legacyId);
    if (prod) item.id = legacyId;
  }

        if (!prod) return;

      // ✅ normalizar cantidad (compatibilidad)
      if (item.cantidad == null) item.cantidad = item.qty ?? item.quantity ?? 1;
      item.cantidad = Number(item.cantidad) || 1;
      if (item.cantidad < 1) item.cantidad = 1;

      cartProds.push(prod);

  const row = document.createElement("div");
  row.className = "cartItem";

  // Checkbox + imagen (alineado al grid del CSS)
      const check = document.createElement("input");
      check.type = "checkbox";
      check.checked = true;
      check.setAttribute("aria-label", "Seleccionar producto");
      check.className = "cartItem__check";

      const img = document.createElement("img");
      img.className = "cartItem__img";
      img.src = prod.imagen;
      img.alt = prod.nombre;


      const info = document.createElement("div");

      const name = document.createElement("h3");
      name.className = "cartItem__name";
      name.textContent = prod.nombre;

      // ✅ NO mostrar etiquetas/tags del producto en el carrito
      // (dejamos solo el estado de stock)
      const stock = document.createElement("div");
      stock.className = "cartItem__stock";

      const available = getProductAvailableStock(prod);
      const lowStockThreshold = 5;

      if (available != null && available > 0 && available <= lowStockThreshold) {
        stock.classList.add("cartItem__stock--low");
        stock.textContent = `Solo queda(n) ${available} en stock (hay más unidades en camino).`;
      } else {
        stock.classList.add("cartItem__stock--ok");
        stock.textContent = "Disponible";
      }

      const shipLine = document.createElement("div");
      shipLine.style.marginTop = "4px";
      shipLine.style.fontSize = "13px";
      shipLine.style.opacity = "0.85";
      shipLine.textContent = "Envío GRATIS (demo) · Llega en 24/48 hs (demo)";

      // Controles + acciones
      const actions = document.createElement("div");
      actions.className = "cartItem__actions";

      const qtyRow = document.createElement("div");
      qtyRow.className = "cartQtyPill";

      const removeIcon = document.createElement("button");
      removeIcon.className = "cartQtyBtn";
      removeIcon.type = "button";
      removeIcon.setAttribute("aria-label", "Eliminar");
      removeIcon.textContent = "🗑";

      const minus = document.createElement("button");
      minus.className = "cartQtyBtn";
      minus.type = "button";
      minus.textContent = "-";

      const qty = document.createElement("span");
      qty.className = "cartQtyPill__qty";
      qty.textContent = String(item.cantidad);

      const plus = document.createElement("button");
      plus.className = "cartQtyBtn";
      plus.type = "button";
      plus.textContent = "+";

      function removeItem() {
        const idx = cart.indexOf(item);
        if (idx >= 0) cart.splice(idx, 1);
        saveCart(cart);
      }

      removeIcon.onclick = removeItem;

      // ✅ Clamp por reglas: min 1, max 10, y max stock (si existe)
      const availableForQty = getProductAvailableStock(prod);
      const maxAllowedQty = Math.max(
        1,
        Math.min(10, availableForQty != null ? Number(availableForQty) : 10)
      );

      if (item.cantidad > maxAllowedQty) item.cantidad = maxAllowedQty;

      // ✅ Estados iniciales
      minus.disabled = item.cantidad <= 1;
      plus.disabled = item.cantidad >= maxAllowedQty;

      // ✅ Flechas: no bajar de 1 (para eliminar se usa el tacho)
      minus.onclick = () => {
        if (item.cantidad <= 1) return;
        item.cantidad -= 1;
        saveCart(cart);
      };

      // ✅ Flecha +: no superar max(10, stock)
      plus.onclick = () => {
        if (item.cantidad >= maxAllowedQty) return;
        item.cantidad += 1;
        saveCart(cart);
      };

      qtyRow.appendChild(removeIcon);
      qtyRow.appendChild(minus);
      qtyRow.appendChild(qty);
      qtyRow.appendChild(plus);

      const removeBtn = document.createElement("button");
      removeBtn.className = "cartItem__remove";
      removeBtn.type = "button";
      removeBtn.textContent = "Eliminar";
      removeBtn.onclick = removeItem;

      // ✅ Eliminar del carrito: "Guardar para más tarde" y "Compartir"
      actions.appendChild(qtyRow);
      actions.appendChild(removeBtn);

      info.appendChild(name);
      info.appendChild(stock);
      info.appendChild(shipLine);
      info.appendChild(actions);

      const price = document.createElement("div");
      price.className = "cartItem__price";
      const totalItem = prod.precio * item.cantidad;
      price.textContent = formatPrice(totalItem);

      subtotal += totalItem;

      row.appendChild(check);
      row.appendChild(img);
      row.appendChild(info);
      row.appendChild(price);

      listEl.appendChild(row);
    });

    const shipCost = Math.round(subtotal * 0.02); // demo envío
    const grandTotal = subtotal + shipCost;

    const subRow = document.createElement("div");
    subRow.className = "cartSummary__row";
    subRow.innerHTML = `<span>Subtotal (${cart.reduce((a, it) => a + (it.cantidad || 0), 0)} productos)</span><span>${formatPrice(subtotal)}</span>`;

    const shipRow = document.createElement("div");
    shipRow.className = "cartSummary__row";
    shipRow.innerHTML = `<span>Envío (demo)</span><span>${formatPrice(shipCost)}</span>`;

    const grand = document.createElement("div");
    grand.className = "cartSummary__total";
    grand.textContent = `Total final: ${formatPrice(grandTotal)}`;

    const box = document.createElement("div");
    box.className = "cartSummary__box";

    const gift = document.createElement("label");
    gift.style.display = "flex";
    gift.style.alignItems = "center";
    gift.style.gap = "10px";
    gift.style.margin = "10px 0 12px";
    

    const payBtn = document.createElement("button");
    payBtn.className = "btnPrimary";
    payBtn.type = "button";
    payBtn.style.width = "100%";
    payBtn.textContent = "Proceder al pago (demo)";

    summaryEl.appendChild(subRow);
    summaryEl.appendChild(shipRow);
    summaryEl.appendChild(grand);
    box.appendChild(gift);
    box.appendChild(payBtn);
    summaryEl.appendChild(box);

    renderSideRecs(cartProds);
    renderRecs(cartProds);
  }

  // ✅ Tiempo real: si agregás desde los recomendados o cambia en otra pestaña,
  // la lista del carrito se vuelve a dibujar automáticamente.
  window.addEventListener("bp_cart_updated", () => reload());
  window.addEventListener("storage", (e) => {
    if (e && e.key === "bp_cart") reload();
  });

  reload();
}

// =============================
// 10) BOOT
// =============================
document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initSearch();
  initFooterCategories();

  if (document.getElementById("heroCarousel")) initHome();
  if (document.querySelector(".shopLayout")) initProductsPage();

  initProductDetail();
  initCartPage();
});