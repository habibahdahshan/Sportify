(function () {
  function getIds() {
    try {
      var raw = localStorage.getItem('sportify_favorites');
      var a = raw ? JSON.parse(raw) : [];
      return Array.isArray(a) ? a : [];
    } catch (e) {
      return [];
    }
  }

  function setIds(ids) {
    localStorage.setItem('sportify_favorites', JSON.stringify(ids));
  }

  function render() {
    var root = document.getElementById('favList');
    if (!root) return;

    var ids = getIds();
    if (ids.length === 0) {
      root.innerHTML = '<p style="padding:2rem;text-align:center;color:#888">No favorites yet.</p>';
      return;
    }

    root.innerHTML = '';
    ids.forEach(function (id) {
      var p = window.sportifyGetProductById ? window.sportifyGetProductById(id) : null;
      if (!p) return;
      var row = document.createElement('div');
      row.className = 'fav-row';
      var url = window.sportifyProductUrl ? window.sportifyProductUrl(p) : 'product.html?id=' + encodeURIComponent(id);
      var img = window.sportifyResolveProductImage ? window.sportifyResolveProductImage(p, p.image) : p.image;
      row.innerHTML =
        '<img src="' +
        img.replace(/"/g, '&quot;') +
        '" alt="" onerror="this.onerror=null;this.src=\'https://placehold.co/700x860/111111/FF4D1C?font=montserrat&text=Sportify\'">' +
        '<a href="' +
        url +
        '">' +
        p.name.replace(/</g, '&lt;') +
        '</a>' +
        '<button type="button" aria-label="Remove" data-fav-remove="' +
        id.replace(/"/g, '') +
        '">✕</button>';
      root.appendChild(row);
    });

    root.querySelectorAll('[data-fav-remove]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-fav-remove');
        setIds(getIds().filter(function (x) {
          return x !== id;
        }));
        render();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', render);
})();
