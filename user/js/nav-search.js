(function () {
  function openPanel(panel) {
    if (!panel) return;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    var input = document.getElementById('globalSearchInput');
    if (input) {
      setTimeout(function () {
        input.focus();
      }, 50);
      if (window.sportifySearchProducts) renderSearchResults(input.value);
    }
  }

  function closePanel(panel) {
    if (!panel) return;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
  }

  function renderSearchResults(term) {
    var list = document.getElementById('globalSearchResults');
    if (!list || !window.sportifySearchProducts || !window.sportifyProductUrl) return;
    var t = (term || '').trim();
    list.innerHTML = '';
    if (!t) return;
    var matches = window.sportifySearchProducts(t, 14);
    if (matches.length === 0) {
      list.innerHTML =
        '<li class="global-search__empty">No matches. <a href="' + (window.sportifyProductUrl ? window.sportifyProductUrl(null) : 'Shopall.html') + '">Browse the shop</a></li>';
      return;
    }
    matches.forEach(function (p) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = window.sportifyProductUrl(p);
      var row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = '10px';
      var resolvedImage = window.sportifyResolveProductImage ? window.sportifyResolveProductImage(p, p.image) : p.image;
      if (resolvedImage) {
        var im = document.createElement('img');
        im.src = resolvedImage;
        im.alt = '';
        im.onerror = function () {
          this.onerror = null;
          this.src = 'https://placehold.co/700x860/111111/FF4D1C?font=montserrat&text=Sportify';
        };
        im.width = 40;
        im.height = 40;
        im.style.objectFit = 'cover';
        im.style.borderRadius = '8px';
        row.appendChild(im);
      }
      var span = document.createElement('span');
      span.textContent = p.name;
      row.appendChild(span);
      a.appendChild(row);
      li.appendChild(a);
      list.appendChild(li);
    });
  }

  function bindGlobalSearch() {
    var panel = document.getElementById('globalSearchPanel');
    if (!panel) return;

    var input = document.getElementById('globalSearchInput');
    if (input) {
      input.addEventListener('input', function () {
        renderSearchResults(input.value);
      });
    }

    var closeBtn = document.getElementById('globalSearchClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        closePanel(panel);
      });
    }

    panel.addEventListener('click', function (e) {
      if (e.target === panel) closePanel(panel);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('open')) closePanel(panel);
    });

    var icons = document.querySelectorAll('.navbar .icons .fa-magnifying-glass');
    icons.forEach(function (icon) {
      icon.setAttribute('role', 'button');
      icon.setAttribute('tabindex', '0');
      icon.setAttribute('aria-label', 'Open search');
      function open() {
        openPanel(panel);
      }
      icon.addEventListener('click', function (e) {
        e.preventDefault();
        open();
      });
      icon.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      });
    });

    var obs = new MutationObserver(function () {
      if (panel.classList.contains('open') && input) renderSearchResults(input.value);
    });
    obs.observe(panel, { attributes: true, attributeFilter: ['class'] });
  }

  function normalizePath(path) {
    var p = (path || '').toLowerCase();
    if (!p || p === '/') return '/home.html';
    return p;
  }

  function bindNavActiveState() {
    var navLinks = document.querySelectorAll('.navbar ul li a[href]');
    if (!navLinks.length) return;

    var currentPath = normalizePath(window.location.pathname);
    var currentHash = (window.location.hash || '').toLowerCase();

    navLinks.forEach(function (link) {
      var href = link.getAttribute('href') || '';
      if (!href || href.startsWith('javascript:')) return;

      if (link.hasAttribute('aria-current')) return;

      if (href.startsWith('#')) {
        if (currentHash && href.toLowerCase() === currentHash) {
          link.classList.add('active');
        }
        return;
      }

      try {
        var u = new URL(link.href, window.location.href);
        var linkPath = normalizePath(u.pathname);
        if (linkPath === currentPath) {
          link.classList.add('active');
        }
      } catch (_) {
        // ignore malformed URLs
      }
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.forEach(function (l) {
          l.classList.remove('active');
        });
        link.classList.add('active');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    bindGlobalSearch();
    bindNavActiveState();
  });
})();
