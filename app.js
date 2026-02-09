const categories = [
  "Productos",
  "Notebooks",
  "Electrodomesticos",
  "Perifericos",
  "Impresoras e Insumos",
  "Monitores",
  "Memorias",
];

const products = [
  {
    id: "1",
    title: "Verde Leather Lounge Chair",
    price: 499,
    description:
      "The Verde Lounge Chair is a bold blend of sculptural form and deep comfort.",
    image: "media/products/chair.jpg",
    badge: "Best Seller",
  },
  { id: "2", title: "Arc Floor Lamp", price: 340, image: "media/products/lamp.jpg" },
  { id: "3", title: "Walnut Side Table", price: 250, image: "media/products/table.jpg" },
  { id: "4", title: "Linen Sofa", price: 2200, image: "media/products/sofa.jpg" },
  { id: "5", title: "Ceramic Vase Set", price: 120, image: "media/products/vase.jpg" },
];

let cartCount = 0;

function money(n) {
  return `$${n}`;
}

function fillCategoryList(el) {
  if (!el) return;
  el.innerHTML = categories.map((c) => `<li><a href="#">${c}</a></li>`).join("");
}

/* 1) Sidebar categories */
fillCategoryList(document.getElementById("categoryList"));

/* 1b) Footer categories */
fillCategoryList(document.getElementById("footerCategoryList"));

/* Footer year */
const footerYear = document.getElementById("footerYear");
if (footerYear) footerYear.textContent = String(new Date().getFullYear());

/* 2) Featured */
const [featured, ...rest] = products;

const featuredImg = document.getElementById("featuredImg");
if (featuredImg) {
  featuredImg.src = featured.image;
  featuredImg.alt = featured.title;
}

const featuredTitle = document.getElementById("featuredTitle");
if (featuredTitle) featuredTitle.textContent = featured.title;

const featuredDesc = document.getElementById("featuredDesc");
if (featuredDesc) featuredDesc.textContent = featured.description || "";

const featuredPrice = document.getElementById("featuredPrice");
if (featuredPrice) featuredPrice.textContent = money(featured.price);

const featuredPill = document.getElementById("featuredPill");
if (featuredPill) featuredPill.textContent = featured.badge || "Featured";

const featuredAdd = document.getElementById("featuredAdd");
if (featuredAdd) {
  featuredAdd.addEventListener("click", () => addToCart(featured));
}

/* 3) Grid */
const grid = document.getElementById("productGrid");
if (grid) {
  grid.innerHTML = rest
    .map(
      (p) => `
        <article class="card">
          <img src="${p.image}" alt="${p.title}" />
          <div class="card__label">
            <div>
              <p class="card__name">${p.title}</p>
              <p class="card__price">${money(p.price)}</p>
            </div>
            <button class="card__add" data-id="${p.id}" aria-label="Add ${p.title}">+</button>
          </div>
        </article>
      `
    )
    .join("");

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".card__add");
    if (!btn) return;
    const id = btn.dataset.id;
    const product = products.find((x) => x.id === id);
    if (product) addToCart(product);
  });
}

/* 4) Cart counter */
function addToCart(product) {
  cartCount += 1;
  const cartCountEl = document.getElementById("cartCount");
  if (cartCountEl) cartCountEl.textContent = String(cartCount);
}
