
/**
 * Sportify — product catalog (home + shop grid).
 * Paths are relative to the active HTML document.
 */
(function () {
  if (typeof window !== 'undefined' && typeof window.sportifyUserHtmlPrefix !== 'string') {
    var __path = (window.location.pathname || '').replace(/\\/g, '/').toLowerCase();
    window.sportifyUserHtmlPrefix = /(^|\/)home\.html$/.test(__path) ? 'User/Html/' : '';
  }

  function htmlPage(name) {
    return (typeof window !== 'undefined' && window.sportifyUserHtmlPrefix ? window.sportifyUserHtmlPrefix : '') + name;
  }

  /** Placeholder product photography — swap these URLs for real product shots before launch. */
  function placeholderImg(label) {
    var text = encodeURIComponent(String(label || 'Sportify'));
    return 'https://placehold.co/700x860/111111/FF4D1C?font=montserrat&text=' + text;
  }

  function shopImg(path) {
    if (/^https?:\/\//i.test(path)) return path;
    var rel = String(path).replace(/^\.\.\/media\//, '').replace(/^User\/media\//, '').replace(/^\.\.\//, '');
    if (typeof window !== 'undefined' && window.sportifyUserHtmlPrefix) {
      return 'User/media/' + rel;
    }
    return '../media/' + rel;
  }

  /** S / M / L sizing — apparel is priced the same across sizes. */
  function sizeTrio(basePrice) {
    var p = Math.max(300, Math.round(Number(basePrice)));
    return [
      { size: 'S', price: p },
      { size: 'M', price: p },
      { size: 'L', price: p },
    ];
  }

  function pseudoRandomFromKey(key) {
    var s = String(key || '');
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return (h % 1000) / 1000;
  }

  function applyRandomSizeStock(product) {
    if (!product || !Array.isArray(product.sizes)) return product;
    var out = product.inStock === false;
    product.sizes = product.sizes.map(function (s) {
      if (out) return { size: s.size, price: s.price, inStock: false };
      var r = pseudoRandomFromKey(product.id + '|' + s.size);
      return { size: s.size, price: s.price, inStock: r >= 0.35 };
    });
    if (!out && !product.sizes.some(function (s) { return s.inStock !== false; })) {
      var idx = product.sizes.findIndex(function (s) { return s.size === product.baseSize; });
      if (idx < 0) idx = 0;
      if (product.sizes[idx]) product.sizes[idx].inStock = true;
    }
    return product;
  }

  var HOME_PRODUCTS = {};

  if (typeof window !== 'undefined' && window.sportifyUserHtmlPrefix) {
    Object.keys(HOME_PRODUCTS).forEach(function (k) {
      var im = HOME_PRODUCTS[k].image;
      if (typeof im === 'string' && im.indexOf('../Images/') === 0) {
        HOME_PRODUCTS[k].image = im.replace(/^\.\.\/Images\//, 'User/Images/');
      }
    });
  }

  /** Shop grid order — real Sportify product photography (Unisex, then Women, then Men). */
  var SHOP_ROWS = [
    { name: "OFFCORE Straight Pants", img: "unisex/unisex-offcore-straight-pants.jpg", line: "Unisex Straight Pant", p100: 1150 },
    { name: "Cross Bag", img: "unisex/unisex-cross-bag.jpg", line: "Unisex Cross Bag", p100: 890 },
    { name: "Essentials Cotton Wide Leg Pants", img: "unisex/unisex-essentials-cotton-wide-leg.jpg", line: "Unisex Cotton Pant", p100: 980 },
    { name: "STRIVE Cap", img: "unisex/unisex-strive-cap.jpg", line: "Unisex Cap", p100: 380 },
    { name: "STRIVE Gym Bag", img: "unisex/unisex-strive-gym-bag.jpg", line: "Unisex Gym Bag", p100: 1250 },
    { name: "STRIVE All-Week 6-Pack Socks", img: "unisex/unisex-strive-allweek-6pack-socks.jpg", line: "Unisex Socks", p100: 420, inStock: false },
    { name: "Essentials Cotton Short Sleeve Tee", img: "women/women-essentials-cotton-short-sleeve.jpg", line: "Women Cotton Tee", p100: 550 },
    { name: "Essentials Dri-Fit Long Fit Tee", img: "women/women-essentials-drifit-long-fit.jpg", line: "Women Dri-Fit Tee", p100: 620 },
    { name: "Essentials Dri-Fit Long Sleeve", img: "women/women-essentials-drifit-long-sleeve.jpg", line: "Women Dri-Fit Tee", p100: 640, inStock: false },
    { name: "Essentials Dri-Fit Short Sleeve", img: "women/women-essentials-drifit-short-sleeve.jpg", line: "Women Dri-Fit Tee", p100: 590 },
    { name: "Essentials Flexi Wide Leg Pants", img: "women/women-essentials-flexi-wide-leg.png", line: "Women Track Pant", p100: 980 },
    { name: "Prime-R Long Fit T-Shirt", img: "women/women-prime-r-long-fit-tshirt.png", line: "Women Long Fit Tee", p100: 690 },
    { name: "NORDX Compression Long Sleeve Tee", img: "men/men-nordx-compression-long-sleeve-tee.jpg", line: "Men Compression Tee", p100: 780 },
    { name: "Essentials Flexi Short", img: "men/men-essentials-flexi-short.jpg", line: "Men Training Short", p100: 650, inStock: false },
    { name: "NORDX Track Jacket", img: "men/men-nordx-track-jacket.jpg", line: "Men Track Jacket", p100: 1590 },
    { name: "STRIVE Quick-Dry Tank Top", img: "men/men-strive-quick-dry-tank-top.jpg", line: "Men Tank Top", p100: 520 },
    { name: "Essentials Cotton Tank Top", img: "men/men-essentials-cotton-tank-top.jpg", line: "Men Tank Top", p100: 480 },
  ];

  var SHOP_PRODUCTS = {};
  SHOP_ROWS.forEach(function (row, index) {
    var id = 'shop-' + index;
    var sizes = sizeTrio(row.p100);
    SHOP_PRODUCTS[id] = {
      id: id,
      shopIndex: index,
      name: row.name,
      image: shopImg(row.img),
      imgKey: row.img,
      line: row.line,
      category: 'shop',
      currency: 'LE',
      description: row.line + '. Engineered for performance, built for everyday wear — part of the Sportify collection.',
      sizes: sizes,
      baseSize: 'M',
      cartName: row.name,
      inStock: row.inStock !== false,
    };
  });

  Object.keys(HOME_PRODUCTS).forEach(function (k) {
    applyRandomSizeStock(HOME_PRODUCTS[k]);
  });
  Object.keys(SHOP_PRODUCTS).forEach(function (k) {
    applyRandomSizeStock(SHOP_PRODUCTS[k]);
  });

  var ALL = Object.assign({}, HOME_PRODUCTS, SHOP_PRODUCTS);

  var ADMIN_CATALOG_KEY = 'sportify_admin_catalog';

  function loadAdminCatalogState() {
    try {
      var raw = localStorage.getItem(ADMIN_CATALOG_KEY);
      if (!raw) return { removed: [], overrides: {}, custom: {} };
      var o = JSON.parse(raw);
      return {
        removed: Array.isArray(o.removed) ? o.removed : [],
        overrides: o.overrides && typeof o.overrides === 'object' ? o.overrides : {},
        custom: o.custom && typeof o.custom === 'object' ? o.custom : {},
      };
    } catch (e) {
      return { removed: [], overrides: {}, custom: {} };
    }
  }

  function saveAdminCatalogState(state) {
    try {
      localStorage.setItem(ADMIN_CATALOG_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function normalizeShopGenderFields(p) {
    if (!p) return p;
    var g = (p.shopPageGender != null ? p.shopPageGender : p.category);
    if (typeof g === 'string') {
      g = g.toLowerCase().trim();
      if (g === 'men' || g === 'women' || g === 'unisex') {
        p.shopPageGender = g;
        p.category = g;
      }
    }
    return p;
  }

  function deepMergeProduct(base, over) {
    var out = Object.assign({}, base);
    Object.keys(over).forEach(function (k) {
      if (k === 'sizes' && Array.isArray(over.sizes)) {
        out.sizes = over.sizes.map(function (s) {
          return Object.assign({}, s);
        });
      } else if (over[k] !== undefined) {
        out[k] = over[k];
      }
    });
    out.adminManaged = true;
    if (over.shopPageGender || (over.category && over.category !== 'shop')) {
      normalizeShopGenderFields(out);
    }
    return out;
  }

  function applyAdminCatalog(ALL_REF) {
    var st = loadAdminCatalogState();
    Object.keys(st.overrides).forEach(function (id) {
      if (!ALL_REF[id]) return;
      ALL_REF[id] = deepMergeProduct(ALL_REF[id], st.overrides[id]);
    });
    Object.keys(st.custom).forEach(function (id) {
      var p = st.custom[id];
      if (!p || !p.id) return;
      ALL_REF[p.id] = normalizeShopGenderFields(Object.assign({}, p, { adminManaged: true }));
    });
    st.removed.forEach(function (id) {
      delete ALL_REF[id];
    });
  }

  applyAdminCatalog(ALL);

  function inferGenderFromLine(line) {
    var t = (line || '').toLowerCase();
    if (/\bwomen\b|pour femme|for her/.test(t)) return 'women';
    if (/\bmen\b|homme|for him/.test(t)) return 'men';
    if (/\bunisex\b/.test(t)) return 'unisex';
    return 'unisex';
  }

  function inferGenderFromProduct(p) {
    if (!p) return 'unisex';
    var sg = p.shopPageGender;
    if (typeof sg === 'string') {
      sg = sg.toLowerCase().trim();
      if (sg === 'men' || sg === 'women' || sg === 'unisex') return sg;
    }
    if (p.category === 'men' || p.category === 'women' || p.category === 'unisex') return p.category;
    if (p.category === 'shop' && p.shopIndex != null && SHOP_ROWS[p.shopIndex]) {
      return inferGenderFromLine(SHOP_ROWS[p.shopIndex].line);
    }
    if (p.line) return inferGenderFromLine(p.line);
    return 'unisex';
  }

  /** Home hero / flash products stay off shop grids; shop rows + admin custom appear on Shop pages. */
  function shouldListOnShop(p) {
    if (!p) return false;
    if (String(p.id).indexOf('custom-') === 0) return true;
    if (p.shopIndex != null) return true;
    if (p.category === 'shop') return true;
    if (p.shopListing === true) return true;
    return false;
  }

  function sportifyGetProductsForShopPage(kind) {
    var k = (kind || 'shopall').toLowerCase();
    if (k === 'all') k = 'shopall';
    var out = [];
    Object.keys(ALL).forEach(function (id) {
      var p = ALL[id];
      if (!p) return;
      if (!shouldListOnShop(p)) return;
      var g = inferGenderFromProduct(p);
      if (k === 'shopall') {
        out.push(p);
      } else if (g === k) {
        out.push(p);
      }
    });
    out.sort(function (a, b) {
      var ai = a.shopIndex != null ? a.shopIndex : 9999;
      var bi = b.shopIndex != null ? b.shopIndex : 9999;
      if (ai !== bi) return ai - bi;
      return String(a.name || '').localeCompare(String(b.name || ''));
    });
    return out;
  }

  function sportifyGetProductById(id) {
    if (id == null) return null;
    return ALL[String(id)] || null;
  }

  function sportifyGetSizeOptions(product) {
    if (!product || !product.sizes) return [];
    return product.sizes.map(function (s) {
      return { size: s.size, price: s.price, inStock: s.inStock !== false };
    });
  }

  function sportifyIsSizeInStock(product, sizeLabel) {
    if (!product || !Array.isArray(product.sizes)) return false;
    var key = String(sizeLabel).trim().toUpperCase();
    var size = product.sizes.find(function (s) { return String(s.size).trim().toUpperCase() === key; });
    if (!size) return false;
    return size.inStock !== false;
  }

  /** Prefer baseSize when in stock, else any in-stock size — for grid / favorites add-to-cart. */
  function sportifyPickInStockSizeOption(product) {
    if (!product || product.inStock === false) return null;
    if (!Array.isArray(product.sizes) || product.sizes.length === 0) return null;
    var opts = sportifyGetSizeOptions(product);
    var o =
      opts.find(function (x) { return x.size === product.baseSize && x.inStock; }) ||
      opts.find(function (x) { return x.inStock; }) ||
      null;
    return o;
  }

  function sportifyProductHasInStockSize(product) {
    if (!product || product.inStock === false) return false;
    if (!Array.isArray(product.sizes) || product.sizes.length === 0) return true;
    return product.sizes.some(function (s) { return s.inStock !== false; });
  }

  function sportifyFormatMoney(amount, currency) {
    var sym = currency || 'LE';
    var n = Number(amount);
    if (sym === '$') return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (sym === 'LE') return 'LE ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return sym + ' ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function sportifyGetShopProductByIndex(index) {
    var i = parseInt(index, 10);
    if (i < 0 || i >= SHOP_ROWS.length) return null;
    return ALL['shop-' + i] || null;
  }

  var imageToShopIndex = {};
  SHOP_ROWS.forEach(function (row, index) {
    var key = String(row.img).toLowerCase();
    if (imageToShopIndex[key] === undefined) imageToShopIndex[key] = index;
  });

  function sportifyGetShopIndexForImage(filename) {
    if (!filename) return null;
    var key = String(filename).toLowerCase().split('/').pop();
    var i = imageToShopIndex[key];
    return i === undefined ? null : i;
  }

  var nameToShopIndex = {};
  SHOP_ROWS.forEach(function (row, index) {
    var key = String(row.name).toLowerCase().trim();
    if (nameToShopIndex[key] === undefined) nameToShopIndex[key] = index;
  });

  function sportifyGetShopIndexForName(name) {
    if (!name) return null;
    var key = String(name).toLowerCase().trim();
    var i = nameToShopIndex[key];
    return i === undefined ? null : i;
  }

  function sportifyProductUrl(p) {
    if (!p) return htmlPage('Shopall.html');
    if (p.shopIndex != null) return htmlPage('product.html?shop=' + p.shopIndex);
    return htmlPage('product.html?id=' + encodeURIComponent(p.id));
  }

  function normalizeImagePath(pathLike) {
    var v = String(pathLike || '').trim();
    if (!v) return '';
    if (/^https?:\/\//i.test(v)) return v;
    var rel = v.replace(/\\/g, '/').replace(/^\.\.\/media\//, '').replace(/^User\/media\//, '').replace(/^\.\.\//, '');
    if (!rel) return '';
    if (typeof window !== 'undefined' && window.sportifyUserHtmlPrefix) {
      return 'User/media/' + rel;
    }
    return '../media/' + rel;
  }

  function sportifyResolveProductImage(productOrId, rawImage) {
    var p = null;
    if (productOrId && typeof productOrId === 'object') p = productOrId;
    else if (productOrId != null) p = sportifyGetProductById(productOrId);
    if (p && typeof p.image === 'string' && p.image.trim()) return normalizeImagePath(p.image);
    if (typeof rawImage === 'string' && rawImage.trim()) return normalizeImagePath(rawImage);
    return placeholderImg('Sportify');
  }

  function sportifySearchProducts(query, limit) {
    var t = (query || '').trim().toLowerCase();
    if (!t) return [];
    var out = [];
    Object.keys(ALL).forEach(function (k) {
      if (out.length >= (limit || 20)) return;
      var p = ALL[k];
      if (p && p.name && p.name.toLowerCase().indexOf(t) !== -1) out.push(p);
    });
    return out;
  }


  /* ── Product details per item ──────────────────────────────────── */
  var PRODUCT_DETAILS = {
    "shop-0": { material: ["Brushed poly-cotton twill"], fit: ["Straight fit", "Elastic drawstring waist"], care: ["Machine wash cold", "Tumble dry low"] },
    "shop-1": { material: ["Recycled canvas", "Adjustable strap"], fit: ["Cross-body fit"], care: ["Spot clean", "Do not machine wash"] },
    "shop-2": { material: ["100% combed cotton"], fit: ["Wide-leg fit", "Elastic waist"], care: ["Machine wash cold", "Hang dry"] },
    "shop-3": { material: ["Cotton-poly twill", "Curved brim"], fit: ["Adjustable one-size fit"], care: ["Spot clean", "Do not machine wash"] },
    "shop-4": { material: ["Ripstop nylon", "Padded straps"], fit: ["Structured fit"], care: ["Wipe clean", "Do not machine wash"] },
    "shop-5": { material: ["Cotton-poly blend knit"], fit: ["Crew fit", "6-pack set"], care: ["Machine wash cold", "Tumble dry low"] },
    "shop-6": { material: ["100% combed cotton"], fit: ["Regular fit", "Crew neck"], care: ["Machine wash cold", "Hang dry"] },
    "shop-7": { material: ["Dri-fit performance knit"], fit: ["Long fit", "Crew neck"], care: ["Machine wash cold", "Line dry"] },
    "shop-8": { material: ["Dri-fit performance knit"], fit: ["Regular fit", "Long sleeve"], care: ["Machine wash cold", "Line dry"] },
    "shop-9": { material: ["Dri-fit performance knit"], fit: ["Regular fit", "Short sleeve"], care: ["Machine wash cold", "Line dry"] },
    "shop-10": { material: ["Brushed tricot"], fit: ["Wide-leg fit", "Elastic waist"], care: ["Machine wash cold", "Tumble dry low"] },
    "shop-11": { material: ["Soft-touch jersey"], fit: ["Long fit", "Crew neck"], care: ["Machine wash cold", "Hang dry"] },
    "shop-12": { material: ["Compression knit", "4-way stretch"], fit: ["Slim fit", "Long sleeve"], care: ["Machine wash cold", "Do not bleach"] },
    "shop-13": { material: ["Quick-dry woven"], fit: ["Athletic fit", "Elastic waist"], care: ["Machine wash cold", "Line dry"] },
    "shop-14": { material: ["Ripstop shell", "Water-resistant coating"], fit: ["Athletic fit", "Full-zip"], care: ["Wipe clean", "Do not tumble dry"] },
    "shop-15": { material: ["Moisture-wicking mesh"], fit: ["Athletic fit"], care: ["Machine wash cold", "Line dry"] },
    "shop-16": { material: ["100% combed cotton"], fit: ["Regular fit"], care: ["Machine wash cold", "Hang dry"] },
  };

  (function mergeCustomProductDetails() {
    var st = loadAdminCatalogState();
    Object.keys(st.custom).forEach(function (id) {
      var p = st.custom[id];
      if (p && p.specDetails && typeof p.specDetails === 'object') {
        PRODUCT_DETAILS[p.id] = p.specDetails;
      }
    });
  })();

  window.sportifyProductDetails = PRODUCT_DETAILS;

  window.sportifyGetProductById = sportifyGetProductById;
  window.sportifyGetSizeOptions = sportifyGetSizeOptions;
  window.sportifyFormatMoney = sportifyFormatMoney;
  window.sportifyGetShopProductByIndex = sportifyGetShopProductByIndex;
  window.sportifySearchProducts = sportifySearchProducts;
  window.sportifyProductUrl = sportifyProductUrl;
  window.sportifyResolveProductImage = sportifyResolveProductImage;
  window.sportifyHtmlPage = htmlPage;
  window.sportifyGetShopIndexForImage = sportifyGetShopIndexForImage;
  window.sportifyGetShopIndexForName = sportifyGetShopIndexForName;
  window.sportifyIsSizeInStock = sportifyIsSizeInStock;
  window.sportifyPickInStockSizeOption = sportifyPickInStockSizeOption;
  window.sportifyProductHasInStockSize = sportifyProductHasInStockSize;
  window.sportifyCatalogIds = Object.keys(ALL);
  window.sportifyAdminCatalogKey = ADMIN_CATALOG_KEY;
  window.sportifyLoadAdminCatalogState = loadAdminCatalogState;
  window.sportifySaveAdminCatalogState = saveAdminCatalogState;
  window.sportifyGetProductsForShopPage = sportifyGetProductsForShopPage;
  window.sportifyInferGenderFromProduct = inferGenderFromProduct;
  window.sportifySHOP_ROWS = SHOP_ROWS;
})();
