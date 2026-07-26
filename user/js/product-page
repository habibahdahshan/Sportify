
(function () {
  function getQuery() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    var shop = params.get('shop');
    var p = null;
    if (id && window.sportifyGetProductById) p = window.sportifyGetProductById(id);
    else if (shop != null && window.sportifyGetShopProductByIndex) p = window.sportifyGetShopProductByIndex(shop);
    return p;
  }

  function render() {
    var p = getQuery();
    var root = document.getElementById('productRoot');
    var nf = document.getElementById('productNotFound');
    if (!p) {
      if (root) root.style.display = 'none';
      if (nf) nf.style.display = 'block';
      return;
    }
    if (nf) nf.style.display = 'none';

    var img = document.getElementById('pdImg');
    var title = document.getElementById('pdTitle');
    var lead = document.getElementById('pdLead');
    var priceEl = document.getElementById('pdPrice');
    var select = document.getElementById('pdSize');
    if (img) {
      img.src = window.sportifyResolveProductImage ? window.sportifyResolveProductImage(p, p.image) : p.image;
      img.alt = p.name;
      img.onerror = function () {
        this.onerror = null;
        this.src = 'https://placehold.co/700x860/111111/FF4D1C?font=montserrat&text=Sportify';
      };
    }
    if (title) title.textContent = p.name;
    if (lead) lead.textContent = p.description || '';

    // Render product details (material / fit / care)
    var detailsWrap = document.getElementById('pdDetails');
    var detailsRows = document.getElementById('pdDetailRows');
    var details = (window.sportifyProductDetails && window.sportifyProductDetails[p.id]) || p.specDetails;
    if (details && detailsWrap && detailsRows) {
      detailsWrap.style.display = 'block';
      var layers = [
        { label: 'Material', key: 'material', icon: '🧵' },
        { label: 'Fit', key: 'fit', icon: '👕' },
        { label: 'Care', key: 'care', icon: '🧺' },
      ];
      detailsRows.innerHTML = layers.map(function(layer) {
        var pills = (details[layer.key] || []).map(function(n) {
          return '<span class="product-detail-pill">' + n + '</span>';
        }).join('');
        return '<div class="product-detail-row"><span class="product-detail-row__label">' + layer.icon + ' ' + layer.label + '</span><div class="product-detail-pills">' + pills + '</div></div>';
      }).join('');
    }

    var opts = window.sportifyGetSizeOptions ? window.sportifyGetSizeOptions(p) : [];
    var preferred = opts.find(function (x) {
      return x.size === p.baseSize && x.inStock !== false;
    });
    var firstInStock = opts.find(function (x) {
      return x.inStock !== false;
    });
    var selectedSize = (preferred && preferred.size) || (firstInStock && firstInStock.size) || (opts[0] && opts[0].size);

    // Replace <select> with button group
    if (select) {
      var sizeWrap = select.parentNode;
      select.style.display = 'none';
      var btnGroup = document.createElement('div');
      btnGroup.className = 'size-btn-group';
      opts.forEach(function (o) {
        var btn = document.createElement('button');
        var out = o.inStock === false;
        btn.type = 'button';
        btn.className = 'size-btn' + (o.size === selectedSize ? ' size-btn--active' : '') + (out ? ' size-btn--out' : '');
        btn.setAttribute('data-size', String(o.size));
        btn.setAttribute('data-price', String(o.price));
        if (out) {
          btn.setAttribute('aria-label', 'Size ' + o.size + ' out of stock');
        }
        btn.textContent = o.size;
        btn.addEventListener('click', function () {
          btnGroup.querySelectorAll('.size-btn').forEach(function (b) { b.classList.remove('size-btn--active'); });
          btn.classList.add('size-btn--active');
          selectedSize = o.size;
          updatePrice();
          refreshActionState();
        });
        btnGroup.appendChild(btn);
      });
      sizeWrap.appendChild(btnGroup);
    }

    function getActiveOpt() {
      var btnGroup = document.querySelector('.size-btn-group');
      if (!btnGroup) return opts[0];
      var active = btnGroup.querySelector('.size-btn--active');
      if (!active) return opts[0];
      return { size: active.getAttribute('data-size'), price: parseFloat(active.getAttribute('data-price')) };
    }

    function updatePrice() {
      if (!priceEl) return;
      var o = getActiveOpt();
      if (!o) {
        priceEl.textContent = '';
        return;
      }
      priceEl.textContent = window.sportifyFormatMoney ? window.sportifyFormatMoney(o.price, p.currency) : o.price;
    }
    updatePrice();

    // Quantity stepper wiring
    var pdQtyEl = document.getElementById('pdQty');
    var pdQtyVal = 1;
    if (pdQtyEl) pdQtyEl.textContent = '1';

    var decBtn = document.getElementById('pdQtyDec');
    var incBtn = document.getElementById('pdQtyInc');
    if (decBtn) {
      decBtn.addEventListener('click', function () {
        if (pdQtyVal > 1) { pdQtyVal--; if (pdQtyEl) pdQtyEl.textContent = pdQtyVal; }
      });
    }
    if (incBtn) {
      incBtn.addEventListener('click', function () {
        if (pdQtyVal < 99) { pdQtyVal++; if (pdQtyEl) pdQtyEl.textContent = pdQtyVal; }
      });
    }

    function readQty() {
      return pdQtyVal;
    }

    // Fix 11: render related items
    var relatedGrid = document.getElementById('relatedGrid');
    if (relatedGrid && window.sportifyCatalogIds) {
      var allIds = window.sportifyCatalogIds.filter(function(rid) { return rid !== p.id; });
      // prefer same category
      var samecat = allIds.filter(function(rid) {
        var rp = window.sportifyGetProductById(rid);
        return rp && rp.category === p.category;
      });
      var pool = samecat.length >= 4 ? samecat : allIds;
      // pick 4 random
      var picks = pool.slice().sort(function() { return Math.random() - 0.5; }).slice(0, 4);
      relatedGrid.innerHTML = picks.map(function(rid) {
        var rp = window.sportifyGetProductById(rid);
        if (!rp) return '';
        var url = window.sportifyProductUrl ? window.sportifyProductUrl(rp) : 'product.html?id=' + encodeURIComponent(rid);
        var opts = window.sportifyGetSizeOptions ? window.sportifyGetSizeOptions(rp) : [];
        var baseOpt = opts.find(function(x){ return x.size === rp.baseSize; }) || opts[0];
        var price = baseOpt && window.sportifyFormatMoney ? window.sportifyFormatMoney(baseOpt.price, rp.currency) : '';
        var imgSrc = window.sportifyResolveProductImage ? window.sportifyResolveProductImage(rp, rp.image) : rp.image;
        return '<article class="related-card"><a href="' + url + '" class="related-card__img-link"><img src="' + imgSrc + '" alt="' + rp.name + '" onerror="this.onerror=null;this.src=\'https://placehold.co/700x860/111111/FF4D1C?font=montserrat&text=Sportify\'"></a><div class="related-card__body"><a href="' + url + '" class="related-card__name">' + rp.name + '</a><span class="related-card__price">' + price + '</span></div></article>';
      }).join('');
    }

    var favBtn = document.getElementById('pdFav');
    if (favBtn && p.id) {
      var onF = window.sportifyIsFavoriteId && window.sportifyIsFavoriteId(p.id);
      favBtn.classList.toggle('product-detail__fav--active', onF);
      favBtn.setAttribute('aria-pressed', onF ? 'true' : 'false');
      favBtn.addEventListener('click', function () {
        if (!window.sportifyToggleFavoriteId) return;
        var next = window.sportifyToggleFavoriteId(p.id);
        favBtn.classList.toggle('product-detail__fav--active', next);
        favBtn.setAttribute('aria-pressed', next ? 'true' : 'false');
      });
    }

    function selectedOption() {
      return getActiveOpt();
    }

    var cur = p.currency || 'LE';
    var hasInStockSize = opts.some(function (x) {
      return x.inStock !== false;
    });
    var isOutOfStock = p.inStock === false || !hasInStockSize;
    function selectedSizeOutOfStock() {
      var o = selectedOption();
      if (!o) return true;
      return window.sportifyIsSizeInStock ? !window.sportifyIsSizeInStock(p, o.size) : false;
    }

    function refreshActionState() {
      var blocked = isOutOfStock || selectedSizeOutOfStock();
      if (addCartBtn) {
        addCartBtn.disabled = false;
        addCartBtn.textContent = blocked ? 'Out of Stock' : 'Add to cart';
        addCartBtn.classList.toggle('btn-add-cart--out', blocked);
      }
      if (decBtn) decBtn.disabled = false;
      if (incBtn) incBtn.disabled = false;
    }

    var addCartBtn = document.getElementById('pdAddCart');
    var buyBtn = document.getElementById('pdBuyNow');
    if (addCartBtn) refreshActionState();
    if (buyBtn) {
      buyBtn.disabled = isOutOfStock;
      buyBtn.style.display = isOutOfStock ? 'none' : '';
    }

    if (addCartBtn) {
      addCartBtn.addEventListener('click', function () {
        if (isOutOfStock || selectedSizeOutOfStock()) return;
        var o = selectedOption();
        if (!o || (window.sportifyIsSizeInStock && !window.sportifyIsSizeInStock(p, o.size))) return;
        var qty = readQty();
        if (window.addToCart) {
          var added = window.addToCart(p.name, o.price, p.image, String(o.size), p.id, { currency: cur, qty: qty });
          if (added && window.toggleCart) window.toggleCart();
        }
      });
    }

    if (buyBtn) {
      buyBtn.addEventListener('click', function () {
        if (isOutOfStock) return;
        var o = selectedOption();
        if (!o || (window.sportifyIsSizeInStock && !window.sportifyIsSizeInStock(p, o.size))) return;
        var qty = readQty();
        if (window.addToCart) {
          var added = window.addToCart(p.name, o.price, p.image, String(o.size), p.id, { currency: cur, qty: qty });
          if (added) window.location.href = window.sportifyHtmlPage ? window.sportifyHtmlPage('checkout.html') : 'checkout.html';
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', render);
})();
