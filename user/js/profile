(function () {
  var AUTH_KEY = 'sportify_user_v2';
  var REGISTRY_KEY = 'sportify_users_registry';

  function getCurrentUser() {
    if (window.sportifyGetCurrentUser) return window.sportifyGetCurrentUser();
    try {
      var raw = sessionStorage.getItem(AUTH_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function profileKey(email) {
    return 'sportify_profile_' + String(email || '').toLowerCase().trim();
  }

  function loadProfileExtras(email) {
    try {
      var raw = localStorage.getItem(profileKey(email));
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveProfileExtras(email, extras) {
    try {
      localStorage.setItem(profileKey(email), JSON.stringify(extras));
    } catch (e) {
      return false;
    }
    return true;
  }

  function updateSessionUserName(name) {
    try {
      var raw = sessionStorage.getItem(AUTH_KEY);
      if (!raw) return;
      var user = JSON.parse(raw);
      user.name = name;
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } catch (e) {}
  }

  function updateRegistryName(email, name) {
    try {
      var raw = localStorage.getItem(REGISTRY_KEY);
      var list = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) return;
      var e = String(email || '').toLowerCase().trim();
      for (var i = 0; i < list.length; i++) {
        if (list[i].email === e) {
          list[i].name = name;
          break;
        }
      }
      localStorage.setItem(REGISTRY_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  function showMsg(text, good) {
    var msg = document.getElementById('profileMsg');
    if (msg) {
      msg.textContent = text;
      msg.style.color = good ? '#2e7d32' : '#c62828';
    }
    if (window.sportifyShowToast) window.sportifyShowToast(text, good ? 'success' : 'error');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var user = getCurrentUser();
    if (!user) {
      if (window.sportifyShowToast) window.sportifyShowToast('You need to sign in first.', 'error');
      window.location.href = 'login.html';
      return;
    }

    var extras = loadProfileExtras(user.email) || {};
    var currentName = extras.name || user.name || '';

    document.getElementById('profileName').value = currentName;
    document.getElementById('profileEmail').value = user.email || '';

    document.getElementById('profileForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('profileName').value.trim();
      if (!name) {
        showMsg('Please enter a username.', false);
        return;
      }
      var payload = { name: name };
      if (typeof extras.avatar !== 'undefined') payload.avatar = extras.avatar;
      var ok = saveProfileExtras(user.email, payload);
      if (!ok) {
        showMsg('Could not save your profile in this browser.', false);
        return;
      }
      updateSessionUserName(name);
      updateRegistryName(user.email, name);
      window.dispatchEvent(new Event('sportify-auth-changed'));
      showMsg('Profile updated successfully.', true);
    });
  });
})();
