/* ============================================================
   学校図書館×ICT研修ポータル 共通スクリプト
   ------------------------------------------------------------
   このファイル1つで、全ページの以下の機能を提供します。
     1. スプラッシュ演出(トップページのみ・sessionStorageで1回だけ)
     2. ハンバーガーメニュー(ドロワー)の開閉
     3. 現在地のナビゲーションをハイライト
     4. ダークモードの切替と保存(localStorage)
     5. ページ上部へ戻るボタン
     6. プロンプトのコピー機能 + コピー完了トースト
     7. アコーディオン(FAQ・改善の一言・事例詳細など)
     8. お気に入り機能(プロンプト集・localStorage)
     9. 検索・カテゴリ・対象校種によるカードの絞り込み
     10. ボタンのタップ演出
   要素が存在しないページでは、該当処理を自動的にスキップします。
   ============================================================ */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FAVORITES_KEY = "sl-ict-portal-favorite-prompts";
  var THEME_KEY = "sl-ict-portal-theme";

  /* ------------------------------------------------------------
     ユーティリティ
     ------------------------------------------------------------ */
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function getFavorites() {
    try {
      var raw = localStorage.getItem(FAVORITES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
  function saveFavorites(list) {
    try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(list)); } catch (e) { /* 保存できない環境は無視 */ }
  }

  /* ------------------------------------------------------------
     1. スプラッシュ演出
     ------------------------------------------------------------
     トップページ(#splash に data-repeat 属性なし)は、
     sessionStorageを使ってセッション中1回だけ表示する。
     各講座ページ(#splash に data-repeat="true")は、
     ページを開くたびに毎回表示する(「各講座に入った時」の演出)。
     ------------------------------------------------------------ */
  function initSplash() {
    var splash = qs("#splash");
    if (!splash) return;

    var repeat = splash.getAttribute("data-repeat") === "true";
    var alreadyShown = false;
    if (!repeat) {
      try { alreadyShown = sessionStorage.getItem("sl-ict-portal-splash-shown") === "1"; } catch (e) { /* 無視 */ }
    }

    if (prefersReducedMotion || alreadyShown) {
      splash.remove();
      return;
    }

    if (!repeat) {
      try { sessionStorage.setItem("sl-ict-portal-splash-shown", "1"); } catch (e) { /* 無視 */ }
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(function () { splash.classList.add("show"); });
    });
    setTimeout(function () { splash.classList.add("hide"); }, 1300);
    setTimeout(function () { if (splash.parentNode) splash.remove(); }, 2000);
  }

  /* ------------------------------------------------------------
     2. ハンバーガーメニュー(ドロワー)
     ------------------------------------------------------------ */
  function initDrawer() {
    var menuBtn = qs("#menuBtn");
    var closeBtn = qs("#drawerClose");
    var drawer = qs("#drawer");
    var overlay = qs("#overlay");
    if (!menuBtn || !drawer || !overlay) return;

    function openDrawer() {
      drawer.classList.add("open");
      overlay.classList.add("open");
      menuBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
    function closeDrawer() {
      drawer.classList.remove("open");
      overlay.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    menuBtn.addEventListener("click", function () {
      var isOpen = drawer.classList.contains("open");
      if (isOpen) { closeDrawer(); } else { openDrawer(); }
    });
    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
    overlay.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeDrawer();
    });
    qsa("a", drawer).forEach(function (a) { a.addEventListener("click", closeDrawer); });
  }

  /* ------------------------------------------------------------
     3. 現在地のナビゲーションをハイライト
     ------------------------------------------------------------ */
  function highlightCurrentNav() {
    var currentFile = (location.pathname.split("/").pop() || "index.html");
    qsa("[data-nav-link]").forEach(function (link) {
      var hrefFile = link.getAttribute("href").split("#")[0].split("/").pop() || "index.html";
      if (hrefFile === currentFile) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* ------------------------------------------------------------
     4. ダークモード
     ------------------------------------------------------------ */
  function initTheme() {
    var root = document.documentElement;
    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) { /* 無視 */ }
    if (saved === "dark") root.setAttribute("data-theme", "dark");

    qsa("[data-theme-toggle]").forEach(function (btn) {
      updateThemeIcon(btn);
      btn.addEventListener("click", function () {
        var isDark = root.getAttribute("data-theme") === "dark";
        if (isDark) {
          root.removeAttribute("data-theme");
          try { localStorage.setItem(THEME_KEY, "light"); } catch (e) { /* 無視 */ }
        } else {
          root.setAttribute("data-theme", "dark");
          try { localStorage.setItem(THEME_KEY, "dark"); } catch (e) { /* 無視 */ }
        }
        qsa("[data-theme-toggle]").forEach(updateThemeIcon);
      });
    });
  }
  function updateThemeIcon(btn) {
    var isDark = document.documentElement.getAttribute("data-theme") === "dark";
    btn.textContent = isDark ? "☀️" : "🌙";
    btn.setAttribute("aria-label", isDark ? "ライトモードに切り替え" : "ダークモードに切り替え");
  }

  /* ------------------------------------------------------------
     5. ページ上部へ戻るボタン
     ------------------------------------------------------------ */
  function initBackToTop() {
    var btn = qs("#backToTop");
    if (!btn) return;
    window.addEventListener("scroll", function () {
      if (window.scrollY > 480) { btn.classList.add("show"); } else { btn.classList.remove("show"); }
    }, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  /* ------------------------------------------------------------
     6. コピー機能 + トースト
     ------------------------------------------------------------ */
  function showToast(message) {
    var toast = qs("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { toast.classList.remove("show"); }, 2200);
  }

  function initCopyButtons() {
    qsa(".copy-btn").forEach(function (btn) {
      var targetSel = btn.getAttribute("data-copy-target");
      var source = targetSel ? qs(targetSel) : null;
      if (!source) return;
      var label = btn.querySelector(".copy-label");

      btn.addEventListener("click", function () {
        var text = source.innerText || source.textContent || "";
        var onSuccess = function () {
          btn.classList.add("copied");
          if (label) {
            var original = label.getAttribute("data-original") || label.textContent;
            label.setAttribute("data-original", original);
            label.textContent = "コピーしました";
          }
          showToast("プロンプトをコピーしました");
          setTimeout(function () {
            btn.classList.remove("copied");
            if (label) label.textContent = label.getAttribute("data-original");
          }, 2000);
        };
        var fallbackCopy = function () {
          try {
            var textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.setAttribute("readonly", "");
            textarea.style.position = "absolute";
            textarea.style.left = "-9999px";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            onSuccess();
          } catch (e) {
            showToast("コピーに失敗しました。文章を選択してコピーしてください");
          }
        };
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(onSuccess).catch(fallbackCopy);
        } else {
          fallbackCopy();
        }
      });
    });
  }

  /* ------------------------------------------------------------
     7. アコーディオン(FAQ・改善の一言・事例詳細など共通)
     ------------------------------------------------------------ */
  function initAccordions() {
    qsa(".accordion-trigger").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var panelId = trigger.getAttribute("aria-controls");
        var panel = panelId ? qs("#" + panelId) : null;
        var expanded = trigger.getAttribute("aria-expanded") === "true";
        trigger.setAttribute("aria-expanded", String(!expanded));
        if (panel) panel.classList.toggle("open", !expanded);
      });
    });
  }

  /* 折りたたみプロンプト(講座ページ:表示/非表示切り替え) */
  function initToggleButtons() {
    qsa("[data-toggle-target]").forEach(function (btn) {
      var target = qs(btn.getAttribute("data-toggle-target"));
      if (!target) return;
      btn.addEventListener("click", function () {
        var isHidden = target.classList.toggle("hidden");
        btn.textContent = isHidden ? (btn.getAttribute("data-show-label") || "表示する") : (btn.getAttribute("data-hide-label") || "折りたたむ");
      });
    });
  }

  /* ------------------------------------------------------------
     8. お気に入り機能(プロンプト集)
     ------------------------------------------------------------ */
  function initFavorites() {
    var favButtons = qsa("[data-fav-id]");
    if (favButtons.length === 0) return;
    var favorites = getFavorites();

    function isFav(id) { return favorites.indexOf(id) !== -1; }
    function render(btn) {
      var id = btn.getAttribute("data-fav-id");
      var active = isFav(id);
      btn.setAttribute("aria-pressed", String(active));
      btn.textContent = active ? "★" : "☆";
    }
    favButtons.forEach(function (btn) {
      render(btn);
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-fav-id");
        if (isFav(id)) {
          favorites = favorites.filter(function (x) { return x !== id; });
        } else {
          favorites.push(id);
        }
        saveFavorites(favorites);
        render(btn);
        applyFilters();
      });
    });
  }

  /* ------------------------------------------------------------
     9. 検索・カテゴリ・対象校種による絞り込み
        (プロンプト集 / DX事例集 で共通利用)
     ------------------------------------------------------------ */
  var activeCategory = "all";
  var activeSchool = "all";
  var favOnly = false;

  function applyFilters() {
    var list = qs("#itemList");
    if (!list) return;
    var searchInput = qs("#itemSearch");
    var keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
    var favorites = getFavorites();
    var items = qsa("[data-item]", list);
    var visibleCount = 0;

    items.forEach(function (item) {
      var category = item.getAttribute("data-category") || "";
      var school = item.getAttribute("data-school") || "";
      var text = (item.getAttribute("data-search") || item.textContent || "").toLowerCase();
      var id = item.getAttribute("data-item");

      var matchCategory = activeCategory === "all" || category.indexOf(activeCategory) !== -1;
      var matchSchool = activeSchool === "all" || school.indexOf(activeSchool) !== -1;
      var matchKeyword = keyword === "" || text.indexOf(keyword) !== -1;
      var matchFav = !favOnly || favorites.indexOf(id) !== -1;

      var show = matchCategory && matchSchool && matchKeyword && matchFav;
      item.classList.toggle("hidden", !show);
      if (show) visibleCount++;
    });

    var countEl = qs("#resultCount");
    if (countEl) countEl.textContent = visibleCount + "件見つかりました";

    var emptyEl = qs("#emptyState");
    if (emptyEl) emptyEl.classList.toggle("hidden", visibleCount !== 0);
  }

  function initFilters() {
    var list = qs("#itemList");
    if (!list) return;

    var searchInput = qs("#itemSearch");
    if (searchInput) searchInput.addEventListener("input", applyFilters);

    qsa("[data-filter-category]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        activeCategory = chip.getAttribute("data-filter-category");
        qsa("[data-filter-category]").forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
        applyFilters();
      });
    });

    qsa("[data-filter-school]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        activeSchool = chip.getAttribute("data-filter-school");
        qsa("[data-filter-school]").forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
        applyFilters();
      });
    });

    var favToggle = qs("#favOnlyToggle");
    if (favToggle) {
      favToggle.addEventListener("click", function () {
        favOnly = !favOnly;
        favToggle.setAttribute("aria-pressed", String(favOnly));
        applyFilters();
      });
    }

    applyFilters();
  }

  /* 事例カードの「詳しく見る」個別トグル(アコーディオンと同構造) */
  function initCaseDetailToggles() {
    qsa("[data-case-toggle]").forEach(function (btn) {
      var target = qs(btn.getAttribute("data-case-toggle"));
      if (!target) return;
      btn.addEventListener("click", function () {
        var open = target.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(open));
        btn.textContent = open ? "閉じる" : "詳しく見る";
      });
    });
  }

  /* ------------------------------------------------------------
     10. ボタンのタップ演出
     ------------------------------------------------------------ */
  function initButtonLift() {
    qsa(".btn, .copy-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        btn.classList.add("lift");
        setTimeout(function () { btn.classList.remove("lift"); }, 260);
      });
    });
  }

  /* ------------------------------------------------------------
     初期化
     ------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    initSplash();
    initTheme();
    initDrawer();
    highlightCurrentNav();
    initBackToTop();
    initCopyButtons();
    initAccordions();
    initToggleButtons();
    initFavorites();
    initFilters();
    initCaseDetailToggles();
    initButtonLift();
  });
})();
