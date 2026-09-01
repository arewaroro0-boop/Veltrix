/* ============================================================
   VELTRIX — BUSINESS MANAGEMENT PLATFORM
   ============================================================
   Main Application Controller
   Version: 1.0.0
   ------------------------------------------------------------
   Features:
   - Responsive sidebar
   - Mobile navigation
   - Dark / Light mode
   - 21-language system
   - Google Translate integration
   - Persistent language/theme preferences
   - Global search
   - Quick Create
   - Notifications
   - Upgrade modal
   - Confirmation modal
   - Toast notifications
   - KPI counters
   - Revenue chart
   - Customer activity chart
   - Progress systems
   - Orders filtering
   - Workspace selector
   - User menu
   - Keyboard shortcuts
   - Offline detection
   - Dynamic date/time
   - Local storage state
   - Accessibility helpers
   - Responsive interactions
   - Auto initialization
   ============================================================ */

(function () {
    "use strict";

    /* ============================================================
       CONFIGURATION
       ============================================================ */

    const CONFIG = {
        appName: "Veltrix",

        storage: {
            theme: "veltrix-theme",
            language: "veltrix-language",
            sidebar: "veltrix-sidebar",
            workspace: "veltrix-workspace",
            notifications: "veltrix-notifications",
            recentSearches: "veltrix-recent-searches",
            onboarding: "veltrix-onboarding",
            user: "veltrix-user"
        },

        animationDuration: 350,

        breakpoints: {
            mobile: 767,
            tablet: 1024,
            desktop: 1280
        },

        defaultTheme: "dark",
        defaultLanguage: "en",

        languages: [
            {
                code: "en",
                name: "English",
                native: "English"
            },
            {
                code: "fr",
                name: "French",
                native: "Français"
            },
            {
                code: "es",
                name: "Spanish",
                native: "Español"
            },
            {
                code: "it",
                name: "Italian",
                native: "Italiano"
            },
            {
                code: "de",
                name: "German",
                native: "Deutsch"
            },
            {
                code: "pt",
                name: "Portuguese",
                native: "Português"
            },
            {
                code: "nl",
                name: "Dutch",
                native: "Nederlands"
            },
            {
                code: "ru",
                name: "Russian",
                native: "Русский"
            },
            {
                code: "tr",
                name: "Turkish",
                native: "Türkçe"
            },
            {
                code: "ar",
                name: "Arabic",
                native: "العربية"
            },
            {
                code: "zh",
                name: "Chinese",
                native: "中文"
            },
            {
                code: "ja",
                name: "Japanese",
                native: "日本語"
            },
            {
                code: "ko",
                name: "Korean",
                native: "한국어"
            },
            {
                code: "hi",
                name: "Hindi",
                native: "हिन्दी"
            },
            {
                code: "id",
                name: "Indonesian",
                native: "Bahasa Indonesia"
            },
            {
                code: "vi",
                name: "Vietnamese",
                native: "Tiếng Việt"
            },
            {
                code: "pl",
                name: "Polish",
                native: "Polski"
            },
            {
                code: "sv",
                name: "Swedish",
                native: "Svenska"
            },
            {
                code: "el",
                name: "Greek",
                native: "Ελληνικά"
            },
            {
                code: "cs",
                name: "Czech",
                native: "Čeština"
            },
            {
                code: "da",
                name: "Danish",
                native: "Dansk"
            }
        ],

        notificationDefaults: [
            {
                id: 1,
                icon: "fa-solid fa-bag-shopping",
                title: "New order received",
                text: "Order #VX-1048 has just been created.",
                time: "2 min ago",
                unread: true
            },
            {
                id: 2,
                icon: "fa-solid fa-chart-line",
                title: "Revenue target updated",
                text: "Your monthly target is now 82% complete.",
                time: "18 min ago",
                unread: true
            },
            {
                id: 3,
                icon: "fa-solid fa-user-plus",
                title: "New customer",
                text: "Sophia Martin joined your workspace.",
                time: "1 hour ago",
                unread: false
            }
        ]
    };

    /* ============================================================
       GLOBAL STATE
       ============================================================ */

    const state = {
        theme: getStorage(CONFIG.storage.theme) || CONFIG.defaultTheme,

        language: getStorage(CONFIG.storage.language) || CONFIG.defaultLanguage,

        sidebarCollapsed:
            getStorage(CONFIG.storage.sidebar) === "true",

        workspace:
            getStorage(CONFIG.storage.workspace) || "Main Workspace",

        searchOpen: false,

        quickCreateOpen: false,

        upgradeOpen: false,

        confirmationOpen: false,

        activeDropdown: null,

        isOnline: navigator.onLine,

        notificationCount: 0,

        notifications: loadNotifications(),

        searchHistory: loadSearchHistory(),

        currentPage:
            document.body?.dataset?.page ||
            "home",

        googleTranslateReady: false,

        initialized: false
    };

    /* ============================================================
       DOM CACHE
       ============================================================ */

    const DOM = {};

    function cacheDOM() {
        DOM.html = document.documentElement;
        DOM.body = document.body;

        DOM.loader =
            document.getElementById("page-loader");

        DOM.sidebar =
            document.querySelector(".sidebar") ||
            document.getElementById("sidebar");

        DOM.sidebarOverlay =
            document.querySelector(".sidebar-overlay") ||
            document.getElementById("sidebar-overlay");

        DOM.mobileMenuButton =
            document.querySelector(
                '[data-action="mobile-menu"]'
            ) ||
            document.getElementById("mobile-menu");

        DOM.sidebarCollapseButton =
            document.querySelector(
                '[data-action="collapse-sidebar"]'
            ) ||
            document.getElementById("collapse-sidebar");

        DOM.themeToggle =
            document.querySelector(
                '[data-action="toggle-theme"]'
            ) ||
            document.getElementById("theme-toggle");

        DOM.languageButton =
            document.querySelector(
                '[data-action="language"]'
            ) ||
            document.getElementById("language-button");

        DOM.languageMenu =
            document.querySelector(".language-menu") ||
            document.getElementById("language-menu");

        DOM.notificationButton =
            document.querySelector(
                '[data-action="notifications"]'
            ) ||
            document.getElementById("notification-button");

        DOM.notificationMenu =
            document.querySelector(".notification-menu") ||
            document.getElementById("notification-menu");

        DOM.userButton =
            document.querySelector(
                '[data-action="user-menu"]'
            ) ||
            document.getElementById("user-menu-button");

        DOM.userMenu =
            document.querySelector(".user-menu") ||
            document.getElementById("user-menu");

        DOM.searchButton =
            document.querySelector(
                '[data-action="search"]'
            ) ||
            document.getElementById("global-search-button");

        DOM.quickCreateButton =
            document.querySelector(
                '[data-action="quick-create"]'
            ) ||
            document.getElementById("quick-create-button");

        DOM.searchModal =
            document.getElementById("global-search-modal");

        DOM.quickCreateModal =
            document.getElementById("quick-create-modal");

        DOM.upgradeModal =
            document.getElementById("upgrade-modal");

        DOM.confirmationModal =
            document.getElementById("confirmation-modal");

        DOM.toastContainer =
            document.getElementById("toast-container");

        DOM.offlineIndicator =
            document.getElementById("offline-indicator");

        DOM.searchInput =
            document.getElementById("global-search-input") ||
            document.querySelector(
                '[data-role="global-search"]'
            );

        DOM.searchResults =
            document.getElementById("search-results");

        DOM.breadcrumb =
            document.querySelector(".breadcrumb");

        DOM.liveRegion =
            document.getElementById("sr-live-region");

        DOM.workspaceSelector =
            document.querySelector(".workspace-selector");

        DOM.pageContent =
            document.querySelector("main") ||
            document.querySelector(".main-content") ||
            document.querySelector(".content");

        DOM.kpiCards =
            document.querySelectorAll(
                ".kpi-card, .stat-card, [data-kpi]"
            );

        DOM.progressBars =
            document.querySelectorAll(
                ".progress-fill, [data-progress]"
            );

        DOM.counterElements =
            document.querySelectorAll(
                "[data-count], [data-counter]"
            );
    }

    /* ============================================================
       STORAGE HELPERS
       ============================================================ */

    function getStorage(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function setStorage(key, value) {
        try {
            localStorage.setItem(key, String(value));
        } catch (error) {
            /* Storage may be disabled. */
        }
    }

    function removeStorage(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            /* Ignore storage errors. */
        }
    }

    function parseStorage(key, fallback) {
        const value = getStorage(key);

        if (!value) {
            return fallback;
        }

        try {
            return JSON.parse(value);
        } catch (error) {
            return fallback;
        }
    }

    function setJSONStorage(key, value) {
        try {
            localStorage.setItem(
                key,
                JSON.stringify(value)
            );
        } catch (error) {
            /* Ignore storage errors. */
        }
    }

    /* ============================================================
       NOTIFICATIONS STORAGE
       ============================================================ */

    function loadNotifications() {
        const saved = parseStorage(
            CONFIG.storage.notifications,
            null
        );

        if (Array.isArray(saved)) {
            return saved;
        }

        return CONFIG.notificationDefaults.map(
            notification => ({ ...notification })
        );
    }

    function saveNotifications() {
        setJSONStorage(
            CONFIG.storage.notifications,
            state.notifications
        );
    }

    function updateNotificationCount() {
        state.notificationCount =
            state.notifications.filter(
                item => item.unread
            ).length;

        const badges = document.querySelectorAll(
            ".notification-count, .notification-badge, [data-notification-count]"
        );

        badges.forEach(badge => {
            badge.textContent =
                state.notificationCount > 99
                    ? "99+"
                    : String(state.notificationCount);

            badge.classList.toggle(
                "is-hidden",
                state.notificationCount === 0
            );
        });

        document.body.classList.toggle(
            "has-unread-notifications",
            state.notificationCount > 0
        );
    }

    /* ============================================================
       SEARCH HISTORY
       ============================================================ */

    function loadSearchHistory() {
        const saved = parseStorage(
            CONFIG.storage.recentSearches,
            []
        );

        return Array.isArray(saved)
            ? saved
            : [];
    }

    function saveSearchHistory() {
        setJSONStorage(
            CONFIG.storage.recentSearches,
            state.searchHistory.slice(0, 10)
        );
    }

    function addSearchHistory(term) {
        const normalized = String(term || "")
            .trim();

        if (!normalized) {
            return;
        }

        state.searchHistory =
            state.searchHistory.filter(
                item =>
                    item.toLowerCase() !==
                    normalized.toLowerCase()
            );

        state.searchHistory.unshift(normalized);

        state.searchHistory =
            state.searchHistory.slice(0, 10);

        saveSearchHistory();
    }

    /* ============================================================
       THEME SYSTEM
       ============================================================ */

    function applyTheme(theme, announce = true) {
        const normalized =
            theme === "light"
                ? "light"
                : "dark";

        state.theme = normalized;

        DOM.html.dataset.theme = normalized;

        if (DOM.body) {
            DOM.body.dataset.theme = normalized;
            DOM.body.classList.toggle(
                "theme-light",
                normalized === "light"
            );
            DOM.body.classList.toggle(
                "theme-dark",
                normalized === "dark"
            );
        }

        setStorage(
            CONFIG.storage.theme,
            normalized
        );

        updateThemeControls();

        if (announce) {
            announceToScreenReader(
                normalized === "dark"
                    ? "Dark mode enabled"
                    : "Light mode enabled"
            );
        }
    }

    function toggleTheme() {
        applyTheme(
            state.theme === "dark"
                ? "light"
                : "dark"
        );

        showToast(
            state.theme === "dark"
                ? "Dark mode enabled"
                : "Light mode enabled",
            "success"
        );
    }

    function updateThemeControls() {
        const toggles = document.querySelectorAll(
            '[data-action="toggle-theme"], [data-theme-toggle]'
        );

        toggles.forEach(toggle => {
            toggle.setAttribute(
                "aria-pressed",
                state.theme === "dark"
                    ? "true"
                    : "false"
            );

            toggle.dataset.theme =
                state.theme;

            const icon =
                toggle.querySelector("i");

            if (icon) {
                icon.className =
                    state.theme === "dark"
                        ? "fa-solid fa-sun"
                        : "fa-solid fa-moon";
            }

            const label =
                toggle.querySelector(
                    "[data-theme-label]"
                );

            if (label) {
                label.textContent =
                    state.theme === "dark"
                        ? "Light mode"
                        : "Dark mode";
            }
        });
    }

    /* ============================================================
       SIDEBAR SYSTEM
       ============================================================ */

    function isMobile() {
        return window.innerWidth <=
            CONFIG.breakpoints.mobile;
    }

    function isTablet() {
        return window.innerWidth <=
            CONFIG.breakpoints.tablet;
    }

    function applySidebarState() {
        if (!DOM.body) {
            return;
        }

        DOM.body.classList.toggle(
            "sidebar-collapsed",
            state.sidebarCollapsed &&
            !isMobile()
        );

        DOM.body.classList.toggle(
            "sidebar-open",
            isMobile() &&
            DOM.body.classList.contains(
                "mobile-sidebar-open"
            )
        );

        if (DOM.sidebar) {
            DOM.sidebar.classList.toggle(
                "is-collapsed",
                state.sidebarCollapsed &&
                !isMobile()
            );

            DOM.sidebar.classList.toggle(
                "is-open",
                isMobile() &&
                DOM.body.classList.contains(
                    "mobile-sidebar-open"
                )
            );
        }
    }

    function toggleSidebarCollapse() {
        if (isMobile()) {
            toggleMobileSidebar();
            return;
        }

        state.sidebarCollapsed =
            !state.sidebarCollapsed;

        setStorage(
            CONFIG.storage.sidebar,
            state.sidebarCollapsed
        );

        applySidebarState();
    }

    function toggleMobileSidebar(force) {
        if (!isMobile()) {
            return;
        }

        const currentlyOpen =
            DOM.body.classList.contains(
                "mobile-sidebar-open"
            );

        const shouldOpen =
            typeof force === "boolean"
                ? force
                : !currentlyOpen;

        DOM.body.classList.toggle(
            "mobile-sidebar-open",
            shouldOpen
        );

        DOM.body.classList.toggle(
            "sidebar-open",
            shouldOpen
        );

        if (DOM.sidebarOverlay) {
            DOM.sidebarOverlay.classList.toggle(
                "is-visible",
                shouldOpen
            );
        }

        if (DOM.sidebar) {
            DOM.sidebar.classList.toggle(
                "is-open",
                shouldOpen
            );
        }

        if (shouldOpen) {
            document.body.classList.add(
                "no-scroll-mobile"
            );
        } else {
            document.body.classList.remove(
                "no-scroll-mobile"
            );
        }
    }

    function closeMobileSidebar() {
        toggleMobileSidebar(false);
    }

    /* ============================================================
       DROPDOWN SYSTEM
       ============================================================ */

    function closeAllDropdowns(except = null) {
        const dropdowns = [
            {
                key: "language",
                menu: DOM.languageMenu,
                button: DOM.languageButton
            },
            {
                key: "notifications",
                menu: DOM.notificationMenu,
                button: DOM.notificationButton
            },
            {
                key: "user",
                menu: DOM.userMenu,
                button: DOM.userButton
            }
        ];

        dropdowns.forEach(item => {
            if (item.key === except) {
                return;
            }

            if (item.menu) {
                item.menu.classList.remove(
                    "is-open",
                    "show",
                    "active"
                );
            }

            if (item.button) {
                item.button.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }
        });

        if (!except) {
            state.activeDropdown = null;
        }
    }

    function toggleDropdown(
        menu,
        button,
        key
    ) {
        if (!menu) {
            return;
        }

        const isOpen =
            menu.classList.contains("is-open") ||
            menu.classList.contains("show") ||
            menu.classList.contains("active");

        closeAllDropdowns(key);

        if (!isOpen) {
            menu.classList.add("is-open");
            menu.classList.add("show");
            menu.classList.add("active");

            if (button) {
                button.setAttribute(
                    "aria-expanded",
                    "true"
                );
            }

            state.activeDropdown = key;
        } else {
            state.activeDropdown = null;
        }
    }

    /* ============================================================
       LANGUAGE SYSTEM
       ============================================================ */

    function getLanguage(code) {
        return CONFIG.languages.find(
            language =>
                language.code === code
        );
    }

    function applyLanguageDirection(code) {
        const rtlLanguages = ["ar"];

        const rtl =
            rtlLanguages.includes(code);

        DOM.html.setAttribute(
            "dir",
            rtl ? "rtl" : "ltr"
        );

        DOM.html.classList.toggle(
            "rtl",
            rtl
        );

        if (DOM.body) {
            DOM.body.classList.toggle(
                "rtl-layout",
                rtl
            );
        }
    }

    function updateLanguageUI() {
        const language =
            getLanguage(state.language) ||
            CONFIG.languages[0];

        const buttons =
            document.querySelectorAll(
                "[data-language], [data-lang]"
            );

        buttons.forEach(button => {
            const code =
                button.dataset.language ||
                button.dataset.lang;

            const selected =
                code === state.language;

            button.classList.toggle(
                "active",
                selected
            );

            button.classList.toggle(
                "selected",
                selected
            );

            button.setAttribute(
                "aria-selected",
                selected
                    ? "true"
                    : "false"
            );

            const check =
                button.querySelector(
                    ".language-check, [data-language-check]"
                );

            if (check) {
                check.hidden = !selected;
            }
        });

        const labels =
            document.querySelectorAll(
                "[data-current-language]"
            );

        labels.forEach(label => {
            label.textContent =
                language.native;
        });

        if (DOM.languageButton) {
            DOM.languageButton.setAttribute(
                "aria-label",
                `Language: ${language.native}`
            );
        }
    }

    function setLanguage(code) {
        const language =
            getLanguage(code);

        if (!language) {
            return;
        }

        state.language = language.code;

        setStorage(
            CONFIG.storage.language,
            language.code
        );

        applyLanguageDirection(
            language.code
        );

        updateLanguageUI();

        closeAllDropdowns();

        setGoogleTranslateLanguage(
            language.code
        );

        showToast(
            `${language.native}`,
            "success",
            2200
        );

        announceToScreenReader(
            `Language changed to ${language.native}`
        );

        /*
         * Re-run translation after a short delay because
         * Google Translate may need time to update its
         * internal selector and DOM.
         */
        window.setTimeout(
            () => {
                setGoogleTranslateLanguage(
                    language.code
                );
            },
            350
        );

        window.setTimeout(
            () => {
                setGoogleTranslateLanguage(
                    language.code
                );
            },
            1200
        );
    }

    function initializeLanguageSystem() {
        /*
         * Make sure the configured 21 languages are represented
         * consistently anywhere the HTML contains language controls.
         */
        updateLanguageUI();

        applyLanguageDirection(
            state.language
        );

        injectGoogleTranslate();
    }

    /* ============================================================
       GOOGLE TRANSLATE INTEGRATION
       ============================================================ */

    function injectGoogleTranslate() {
        /*
         * Do not inject twice.
         */
        if (
            document.getElementById(
                "google_translate_element"
            )
        ) {
            return;
        }

        const container =
            document.createElement("div");

        container.id =
            "google_translate_element";

        container.setAttribute(
            "aria-hidden",
            "true"
        );

        container.style.position = "fixed";
        container.style.width = "1px";
        container.style.height = "1px";
        container.style.overflow = "hidden";
        container.style.opacity = "0";
        container.style.pointerEvents = "none";
        container.style.left = "-9999px";
        container.style.top = "0";

        document.body.appendChild(
            container
        );

        if (
            document.getElementById(
                "veltrix-google-translate-script"
            )
        ) {
            return;
        }

        window.googleTranslateElementInit =
            function () {
                try {
                    if (
                        !window.google ||
                        !window.google.translate
                    ) {
                        return;
                    }

                    new window.google.translate.TranslateElement(
                        {
                            pageLanguage: "en",
                            autoDisplay: false,
                            includedLanguages:
                                CONFIG.languages
                                    .map(item => item.code)
                                    .join(","),
                            layout:
                                window.google.translate
                                    .TranslateElement
                                    .InlineLayout
                                    .SIMPLE
                        },
                        "google_translate_element"
                    );

                    state.googleTranslateReady =
                        true;

                    window.setTimeout(
                        () => {
                            setGoogleTranslateLanguage(
                                state.language
                            );
                        },
                        500
                    );
                } catch (error) {
                    console.warn(
                        "Veltrix: Google Translate initialization failed.",
                        error
                    );
                }
            };

        const script =
            document.createElement("script");

        script.id =
            "veltrix-google-translate-script";

        script.src =
            "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

        script.async = true;

        document.head.appendChild(
            script
        );
    }

    function setGoogleTranslateLanguage(code) {
        if (code === "en") {
            clearGoogleTranslateCookie();
            return;
        }

        const select =
            document.querySelector(
                ".goog-te-combo"
            );

        if (!select) {
            return;
        }

        try {
            select.value = code;

            select.dispatchEvent(
                new Event(
                    "change",
                    {
                        bubbles: true
                    }
                )
            );

            state.googleTranslateReady =
                true;
        } catch (error) {
            console.warn(
                "Veltrix: Unable to change Google Translate language.",
                error
            );
        }
    }

    function clearGoogleTranslateCookie() {
        /*
         * Returning to English means the source language.
         * Google Translate uses a cookie called googtrans.
         */
        try {
            document.cookie =
                "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            document.cookie =
                "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" +
                window.location.hostname +
                ";";

            const select =
                document.querySelector(
                    ".goog-te-combo"
                );

            if (select) {
                select.value = "en";

                select.dispatchEvent(
                    new Event(
                        "change",
                        {
                            bubbles: true
                        }
                    )
                );
            }
        } catch (error) {
            /* Ignore. */
        }
    }

    /* ============================================================
       MODAL SYSTEM
       ============================================================ */

    function getModalByName(name) {
        const map = {
            search: DOM.searchModal,
            quickCreate: DOM.quickCreateModal,
            upgrade: DOM.upgradeModal,
            confirmation: DOM.confirmationModal
        };

        return map[name] || null;
    }

    function openModal(name) {
        const modal =
            getModalByName(name);

        if (!modal) {
            return;
        }

        closeAllDropdowns();

        modal.classList.add("is-open");
        modal.classList.add("active");
        modal.classList.add("show");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );

        if (name === "search") {
            state.searchOpen = true;

            window.setTimeout(
                () => {
                    if (DOM.searchInput) {
                        DOM.searchInput.focus();
                    }
                },
                80
            );

            renderSearchResults("");
        }

        if (name === "quickCreate") {
            state.quickCreateOpen = true;
        }

        if (name === "upgrade") {
            state.upgradeOpen = true;
        }

        if (name === "confirmation") {
            state.confirmationOpen = true;
        }
    }

    function closeModal(name) {
        const modal =
            getModalByName(name);

        if (!modal) {
            return;
        }

        modal.classList.remove(
            "is-open",
            "active",
            "show"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        if (name === "search") {
            state.searchOpen = false;
        }

        if (name === "quickCreate") {
            state.quickCreateOpen = false;
        }

        if (name === "upgrade") {
            state.upgradeOpen = false;
        }

        if (name === "confirmation") {
            state.confirmationOpen = false;
        }

        if (
            !document.querySelector(
                ".modal.is-open, .modal.active, .modal.show"
            )
        ) {
            document.body.classList.remove(
                "modal-open"
            );
        }
    }

    function closeAllModals() {
        [
            "search",
            "quickCreate",
            "upgrade",
            "confirmation"
        ].forEach(closeModal);
    }

    /* ============================================================
       TOAST SYSTEM
       ============================================================ */

    function showToast(
        message,
        type = "info",
        duration = 3500
    ) {
        if (!DOM.toastContainer) {
            return;
        }

        const toast =
            document.createElement("div");

        toast.className =
            `toast toast-${type}`;

        toast.setAttribute(
            "role",
            "status"
        );

        const iconMap = {
            success: "fa-circle-check",
            error: "fa-circle-xmark",
            warning: "fa-triangle-exclamation",
            info: "fa-circle-info"
        };

        const icon =
            iconMap[type] ||
            iconMap.info;

        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fa-solid ${icon}"></i>
            </div>

            <div class="toast-content">
                <div class="toast-message">
                    ${escapeHTML(message)}
                </div>
            </div>

            <button
                class="toast-close"
                type="button"
                aria-label="Close notification"
                data-toast-close
            >
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;

        DOM.toastContainer.appendChild(
            toast
        );

        requestAnimationFrame(() => {
            toast.classList.add(
                "is-visible"
            );
        });

        const removeToast =
            () => {
                toast.classList.remove(
                    "is-visible"
                );

                window.setTimeout(
                    () => {
                        toast.remove();
                    },
                    300
                );
            };

        toast
            .querySelector(
                "[data-toast-close]"
            )
            ?.addEventListener(
                "click",
                removeToast
            );

        window.setTimeout(
            removeToast,
            duration
        );
    }

    /* ============================================================
       ACCESSIBILITY
       ============================================================ */

    function announceToScreenReader(
        message
    ) {
        if (!DOM.liveRegion) {
            return;
        }

        DOM.liveRegion.textContent = "";

        window.setTimeout(
            () => {
                DOM.liveRegion.textContent =
                    message;
            },
            20
        );
    }

    function manageFocus() {
        document.addEventListener(
            "keydown",
            event => {
                if (
                    event.key !== "Tab"
                ) {
                    return;
                }

                const modal =
                    document.querySelector(
                        ".modal.is-open, .modal.active, .modal.show"
                    );

                if (!modal) {
                    return;
                }

                const focusable =
                    modal.querySelectorAll(
                        'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
                    );

                if (!focusable.length) {
                    return;
                }

                const first =
                    focusable[0];

                const last =
                    focusable[
                        focusable.length - 1
                    ];

                if (
                    event.shiftKey &&
                    document.activeElement === first
                ) {
                    event.preventDefault();
                    last.focus();
                } else if (
                    !event.shiftKey &&
                    document.activeElement === last
                ) {
                    event.preventDefault();
                    first.focus();
                }
            }
        );
    }

    /* ============================================================
       GLOBAL SEARCH
       ============================================================ */

    const SEARCH_ITEMS = [
        {
            title: "Dashboard",
            description: "Overview and business statistics",
            icon: "fa-chart-pie",
            keywords: [
                "dashboard",
                "home",
                "overview",
                "statistics",
                "analytics"
            ],
            url: "index.html"
        },
        {
            title: "Analytics",
            description: "Business performance and analytics",
            icon: "fa-chart-line",
            keywords: [
                "analytics",
                "reports",
                "performance",
                "charts"
            ],
            url: "analytics.html"
        },
        {
            title: "Orders",
            description: "Manage customer orders",
            icon: "fa-bag-shopping",
            keywords: [
                "orders",
                "sales",
                "purchases"
            ],
            url: "orders.html"
        },
        {
            title: "Customers",
            description: "Manage your customers",
            icon: "fa-users",
            keywords: [
                "customers",
                "clients",
                "users"
            ],
            url: "customers.html"
        },
        {
            title: "Products",
            description: "Manage products and inventory",
            icon: "fa-box",
            keywords: [
                "products",
                "inventory",
                "stock"
            ],
            url: "products.html"
        },
        {
            title: "Invoices",
            description: "Create and manage invoices",
            icon: "fa-file-invoice",
            keywords: [
                "invoices",
                "billing",
                "payments"
            ],
            url: "invoices.html"
        },
        {
            title: "Messages",
            description: "Communicate with customers and team members",
            icon: "fa-comments",
            keywords: [
                "messages",
                "chat",
                "conversation",
                "inbox"
            ],
            url: "messages.html"
        },
        {
            title: "Notifications",
            description: "View recent notifications",
            icon: "fa-bell",
            keywords: [
                "notifications",
                "alerts",
                "updates"
            ],
            url: "notifications.html"
        },
        {
            title: "Calculator",
            description: "Business calculator and calculations",
            icon: "fa-calculator",
            keywords: [
                "calculator",
                "calculate",
                "percentage",
                "math"
            ],
            url: "calculator.html"
        },
        {
            title: "AI Workspace",
            description: "AI-powered workspace tools",
            icon: "fa-wand-magic-sparkles",
            keywords: [
                "ai",
                "artificial intelligence",
                "workspace",
                "assistant"
            ],
            url: "ai.html"
        },
        {
            title: "Settings",
            description: "Customize your Veltrix workspace",
            icon: "fa-gear",
            keywords: [
                "settings",
                "preferences",
                "configuration"
            ],
            url: "settings.html"
        },
        {
            title: "Profile",
            description: "Manage your account and security",
            icon: "fa-user",
            keywords: [
                "profile",
                "account",
                "security",
                "password"
            ],
            url: "profile.html"
        }
    ];

    function normalizeSearchText(text) {
        return String(text || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .trim();
    }

    function searchItems(query) {
        const normalized =
            normalizeSearchText(query);

        if (!normalized) {
            return SEARCH_ITEMS.slice(0, 8);
        }

        return SEARCH_ITEMS
            .map(item => {
                const haystack =
                    normalizeSearchText(
                        [
                            item.title,
                            item.description,
                            ...(item.keywords || [])
                        ].join(" ")
                    );

                let score = 0;

                if (
                    haystack === normalized
                ) {
                    score += 100;
                }

                if (
                    item.title
                        .toLowerCase()
                        .startsWith(
                            normalized
                        )
                ) {
                    score += 60;
                }

                if (
                    haystack.includes(
                        normalized
                    )
                ) {
                    score += 30;
                }

                (item.keywords || [])
                    .forEach(keyword => {
                        if (
                            normalizeSearchText(
                                keyword
                            ).includes(
                                normalized
                            )
                        ) {
                            score += 15;
                        }
                    });

                return {
                    item,
                    score
                };
            })
            .filter(
                result =>
                    result.score > 0
            )
            .sort(
                (a, b) =>
                    b.score - a.score
            )
            .map(result => result.item);
    }

    function renderSearchResults(
        query
    ) {
        if (!DOM.searchResults) {
            return;
        }

        const results =
            searchItems(query);

        if (!results.length) {
            DOM.searchResults.innerHTML = `
                <div class="search-empty">
                    <div class="search-empty-icon">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>

                    <h3>No results found</h3>

                    <p>
                        Try searching for another page,
                        feature or keyword.
                    </p>
                </div>
            `;

            return;
        }

        DOM.searchResults.innerHTML =
            results
                .map(
                    item => `
                    <button
                        type="button"
                        class="search-result-item"
                        data-search-url="${escapeAttribute(item.url)}"
                        data-search-title="${escapeAttribute(item.title)}"
                    >
                        <span class="search-result-icon">
                            <i class="fa-solid ${escapeAttribute(item.icon)}"></i>
                        </span>

                        <span class="search-result-copy">
                            <strong>
                                ${escapeHTML(item.title)}
                            </strong>

                            <small>
                                ${escapeHTML(item.description)}
                            </small>
                        </span>

                        <i class="fa-solid fa-arrow-up-right-from-square search-result-arrow"></i>
                    </button>
                `
                )
                .join("");
    }

    function executeSearch(query) {
        const normalized =
            String(query || "").trim();

        if (!normalized) {
            return;
        }

        addSearchHistory(normalized);

        const results =
            searchItems(normalized);

        if (!results.length) {
            showToast(
                "No matching result found.",
                "warning"
            );

            return;
        }

        const first =
            results[0];

        navigateTo(
            first.url,
            first.title
        );
    }

    /* ============================================================
       NAVIGATION
       ============================================================ */

    function navigateTo(
        url,
        title = ""
    ) {
        if (!url) {
            return;
        }

        closeAllModals();
        closeAllDropdowns();
        closeMobileSidebar();

        const current =
            window.location.pathname
                .split("/")
                .pop();

        const cleanURL =
            url.split("#")[0]
                .split("?")[0]
                .split("/")
                .pop();

        if (
            cleanURL &&
            current === cleanURL
        ) {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            if (title) {
                updateBreadcrumb(title);
            }

            return;
        }

        /*
         * Persist language before leaving the page.
         * This allows the next page to immediately read
         * the same language preference.
         */
        setStorage(
            CONFIG.storage.language,
            state.language
        );

        setStorage(
            CONFIG.storage.theme,
            state.theme
        );

        if (title) {
            setStorage(
                "veltrix-last-page",
                title
            );
        }

        window.location.href = url;
    }

    function updateBreadcrumb(title) {
        if (!DOM.breadcrumb) {
            return;
        }

        const current =
            DOM.breadcrumb.querySelector(
                "[data-breadcrumb-current]"
            );

        if (current) {
            current.textContent =
                title;
            return;
        }

        const items =
            DOM.breadcrumb.querySelectorAll(
                "li, .breadcrumb-item"
            );

        if (items.length) {
            items[
                items.length - 1
            ].textContent = title;
        }
    }

    function initializeNavigation() {
        const links =
            document.querySelectorAll(
                "[data-nav], [data-page-link], .nav-link"
            );

        links.forEach(link => {
            link.addEventListener(
                "click",
                event => {
                    const href =
                        link.getAttribute(
                            "href"
                        );

                    const target =
                        link.dataset.pageLink ||
                        link.dataset.nav ||
                        href;

                    if (
                        !target ||
                        target === "#" ||
                        target.startsWith(
                            "javascript:"
                        )
                    ) {
                        return;
                    }

                    /*
                     * Let normal external links work.
                     */
                    if (
                        /^https?:\/\//i.test(
                            target
                        ) &&
                        !target.includes(
                            window.location.hostname
                        )
                    ) {
                        return;
                    }

                    if (
                        target.endsWith(".html") ||
                        target.includes(".html")
                    ) {
                        event.preventDefault();

                        const title =
                            link
                                .querySelector(
                                    "[data-nav-label]"
                                )
                                ?.textContent ||
                            link.textContent.trim();

                        navigateTo(
                            target,
                            title
                        );
                    }
                }
            );
        });
    }

    /* ============================================================
       WORKSPACE SYSTEM
       ============================================================ */

    function initializeWorkspace() {
        if (!DOM.workspaceSelector) {
            return;
        }

        const workspaceButtons =
            DOM.workspaceSelector.querySelectorAll(
                "[data-workspace]"
            );

        workspaceButtons.forEach(
            button => {
                const name =
                    button.dataset.workspace;

                if (
                    name === state.workspace
                ) {
                    button.classList.add(
                        "active",
                        "selected"
                    );
                }

                button.addEventListener(
                    "click",
                    event => {
                        event.preventDefault();

                        if (!name) {
                            return;
                        }

                        state.workspace =
                            name;

                        setStorage(
                            CONFIG.storage.workspace,
                            name
                        );

                        workspaceButtons.forEach(
                            item => {
                                item.classList.toggle(
                                    "active",
                                    item.dataset.workspace ===
                                        name
                                );

                                item.classList.toggle(
                                    "selected",
                                    item.dataset.workspace ===
                                        name
                                );
                            }
                        );

                        updateWorkspaceLabels(
                            name
                        );

                        showToast(
                            `Workspace switched to ${name}`,
                            "success"
                        );
                    }
                );
            }
        );

        updateWorkspaceLabels(
            state.workspace
        );
    }

    function updateWorkspaceLabels(
        workspace
    ) {
        document
            .querySelectorAll(
                "[data-current-workspace]"
            )
            .forEach(element => {
                element.textContent =
                    workspace;
            });
    }

    /* ============================================================
       KPI COUNTERS
       ============================================================ */

    function parseNumber(value) {
        if (
            typeof value ===
            "number"
        ) {
            return value;
        }

        const cleaned =
            String(value || "")
                .replace(
                    /[^0-9.-]/g,
                    ""
                );

        const parsed =
            Number(cleaned);

        return Number.isFinite(parsed)
            ? parsed
            : 0;
    }

    function formatNumber(
        number,
        decimals = 0
    ) {
        return new Intl.NumberFormat(
            undefined,
            {
                minimumFractionDigits:
                    decimals,
                maximumFractionDigits:
                    decimals
            }
        ).format(number);
    }

    function animateCounter(
        element
    ) {
        const raw =
            element.dataset.count ||
            element.dataset.counter ||
            element.textContent;

        const target =
            parseNumber(raw);

        const duration =
            Number(
                element.dataset.duration
            ) || 1200;

        const decimals =
            Number(
                element.dataset.decimals
            ) || 0;

        const prefix =
            element.dataset.prefix ||
            "";

        const suffix =
            element.dataset.suffix ||
            "";

        const start =
            performance.now();

        function tick(now) {
            const progress =
                Math.min(
                    (now - start) /
                        duration,
                    1
                );

            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );

            const value =
                target * eased;

            element.textContent =
                prefix +
                formatNumber(
                    value,
                    decimals
                ) +
                suffix;

            if (progress < 1) {
                requestAnimationFrame(
                    tick
                );
            }
        }

        requestAnimationFrame(
            tick
        );
    }

    function initializeCounters() {
        if (
            !DOM.counterElements ||
            !DOM.counterElements.length
        ) {
            return;
        }

        const observer =
            new IntersectionObserver(
                entries => {
                    entries.forEach(
                        entry => {
                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }

                            const element =
                                entry.target;

                            if (
                                element.dataset.animated ===
                                "true"
                            ) {
                                return;
                            }

                            element.dataset.animated =
                                "true";

                            animateCounter(
                                element
                            );

                            observer.unobserve(
                                element
                            );
                        }
                    );
                },
                {
                    threshold: 0.2
                }
            );

        DOM.counterElements.forEach(
            element =>
                observer.observe(
                    element
                )
        );
    }

    /* ============================================================
       PROGRESS BARS
       ============================================================ */

    function initializeProgressBars() {
        if (
            !DOM.progressBars ||
            !DOM.progressBars.length
        ) {
            return;
        }

        const observer =
            new IntersectionObserver(
                entries => {
                    entries.forEach(
                        entry => {
                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }

                            const element =
                                entry.target;

                            const value =
                                element.dataset.progress ||
                                element.dataset.value ||
                                element.getAttribute(
                                    "aria-valuenow"
                                ) ||
                                "0";

                            const percentage =
                                Math.max(
                                    0,
                                    Math.min(
                                        100,
                                        parseFloat(
                                            value
                                        ) || 0
                                    )
                                );

                            element.style.setProperty(
                                "--progress",
                                `${percentage}%`
                            );

                            if (
                                element.style.width ===
                                ""
                            ) {
                                element.style.width =
                                    `${percentage}%`;
                            }

                            element.classList.add(
                                "animated"
                            );

                            observer.unobserve(
                                element
                            );
                        }
                    );
                },
                {
                    threshold: 0.25
                }
            );

        DOM.progressBars.forEach(
            bar =>
                observer.observe(
                    bar
                )
        );
    }

    /* ============================================================
       CHART ENGINE
       ============================================================ */

    function createRevenueChart() {
        const container =
            document.querySelector(
                "[data-revenue-chart]"
            ) ||
            document.getElementById(
                "revenue-chart"
            );

        if (!container) {
            return;
        }

        if (
            typeof window.Chart ===
            "function"
        ) {
            createChartJSRevenueChart(
                container
            );

            return;
        }

        createCSSRevenueChart(
            container
        );
    }

    function createChartJSRevenueChart(
        container
    ) {
        if (
            container.dataset.chartInitialized ===
            "true"
        ) {
            return;
        }

        container.dataset.chartInitialized =
            "true";

        const canvas =
            container.querySelector(
                "canvas"
            ) ||
            document.createElement(
                "canvas"
            );

        if (!canvas.parentNode) {
            container.appendChild(
                canvas
            );
        }

        const context =
            canvas.getContext("2d");

        const styles =
            getComputedStyle(
                document.documentElement
            );

        const accent =
            styles.getPropertyValue(
                "--accent"
            )?.trim() ||
            "#6c5ce7";

        const accentSoft =
            styles.getPropertyValue(
                "--accent-soft"
            )?.trim() ||
            "rgba(108,92,231,.18)";

        new window.Chart(
            context,
            {
                type: "line",

                data: {
                    labels: [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec"
                    ],

                    datasets: [
                        {
                            label: "Revenue",
                            data: [
                                4200,
                                5800,
                                5100,
                                7200,
                                6900,
                                8300,
                                7900,
                                9400,
                                10100,
                                11200,
                                12500,
                                13800
                            ],
                            tension: 0.42,
                            fill: true,
                            borderWidth: 3,
                            borderColor:
                                accent,
                            backgroundColor:
                                accentSoft,
                            pointRadius: 0,
                            pointHoverRadius: 5
                        }
                    ]
                },

                options: {
                    responsive: true,
                    maintainAspectRatio: false,

                    interaction: {
                        intersect: false,
                        mode: "index"
                    },

                    plugins: {
                        legend: {
                            display: false
                        },

                        tooltip: {
                            displayColors: false,
                            padding: 12
                        }
                    },

                    scales: {
                        x: {
                            grid: {
                                display: false
                            }
                        },

                        y: {
                            beginAtZero: true,
                            border: {
                                display: false
                            },

                            grid: {
                                color:
                                    "rgba(128,128,128,.12)"
                            }
                        }
                    }
                }
            }
        );
    }

    function createCSSRevenueChart(
        container
    ) {
        if (
            container.dataset.chartInitialized ===
            "true"
        ) {
            return;
        }

        container.dataset.chartInitialized =
            "true";

        const values = [
            44,
            58,
            51,
            72,
            68,
            84,
            77,
            92,
            86,
            95,
            88,
            100
        ];

        const wrapper =
            document.createElement(
                "div"
            );

        wrapper.className =
            "veltrix-fallback-chart";

        values.forEach(
            (value, index) => {
                const column =
                    document.createElement(
                        "div"
                    );

                column.className =
                    "fallback-chart-column";

                const bar =
                    document.createElement(
                        "div"
                    );

                bar.className =
                    "fallback-chart-bar";

                bar.style.height =
                    `${value}%`;

                bar.title =
                    `Month ${index + 1}: ${value}%`;

                column.appendChild(
                    bar
                );

                wrapper.appendChild(
                    column
                );
            }
        );

        container.appendChild(
            wrapper
        );
    }

    function createActivityChart() {
        const container =
            document.querySelector(
                "[data-activity-chart]"
            ) ||
            document.getElementById(
                "activity-chart"
            );

        if (!container) {
            return;
        }

        if (
            typeof window.Chart ===
            "function"
        ) {
            createChartJSActivityChart(
                container
            );

            return;
        }

        createCSSActivityChart(
            container
        );
    }

    function createChartJSActivityChart(
        container
    ) {
        if (
            container.dataset.chartInitialized ===
            "true"
        ) {
            return;
        }

        container.dataset.chartInitialized =
            "true";

        const canvas =
            container.querySelector(
                "canvas"
            ) ||
            document.createElement(
                "canvas"
            );

        if (!canvas.parentNode) {
            container.appendChild(
                canvas
            );
        }

        const context =
            canvas.getContext("2d");

        new window.Chart(
            context,
            {
                type: "bar",

                data: {
                    labels: [
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat",
                        "Sun"
                    ],

                    datasets: [
                        {
                            label: "Customers",
                            data: [
                                120,
                                168,
                                145,
                                190,
                                218,
                                174,
                                240
                            ],

                            borderRadius: 8,
                            borderSkipped: false
                        }
                    ]
                },

                options: {
                    responsive: true,
                    maintainAspectRatio: false,

                    plugins: {
                        legend: {
                            display: false
                        }
                    },

                    scales: {
                        x: {
                            grid: {
                                display: false
                            }
                        },

                        y: {
                            beginAtZero: true,
                            border: {
                                display: false
                            },

                            grid: {
                                color:
                                    "rgba(128,128,128,.12)"
                            }
                        }
                    }
                }
            }
        );
    }

    function createCSSActivityChart(
        container
    ) {
        if (
            container.dataset.chartInitialized ===
            "true"
        ) {
            return;
        }

        container.dataset.chartInitialized =
            "true";

        const values = [
            42,
            65,
            54,
            76,
            88,
            62,
            94
        ];

        const wrapper =
            document.createElement(
                "div"
            );

        wrapper.className =
            "veltrix-activity-bars";

        values.forEach(
            value => {
                const bar =
                    document.createElement(
                        "span"
                    );

                bar.style.height =
                    `${value}%`;

                wrapper.appendChild(
                    bar
                );
            }
        );

        container.appendChild(
            wrapper
        );
    }

    /* ============================================================
       ORDER TABLE SYSTEM
       ============================================================ */

    function initializeOrderInteractions() {
        const rows =
            document.querySelectorAll(
                "[data-order-row]"
            );

        rows.forEach(row => {
            row.addEventListener(
                "click",
                () => {
                    const order =
                        row.dataset.orderId ||
                        row
                            .querySelector(
                                "[data-order-id]"
                            )
                            ?.textContent
                            ?.trim() ||
                        "Order";

                    showToast(
                        `${order} selected`,
                        "info"
                    );

                    row.classList.add(
                        "row-selected"
                    );

                    window.setTimeout(
                        () => {
                            row.classList.remove(
                                "row-selected"
                            );
                        },
                        900
                    );
                }
            );
        });
    }

    /* ============================================================
       NOTIFICATIONS UI
       ============================================================ */

    function renderNotifications() {
        if (!DOM.notificationMenu) {
            return;
        }

        const container =
            DOM.notificationMenu.querySelector(
                "[data-notification-list]"
            ) ||
            DOM.notificationMenu.querySelector(
                ".notification-list"
            );

        if (!container) {
            return;
        }

        if (!state.notifications.length) {
            container.innerHTML = `
                <div class="notifications-empty">
                    <i class="fa-regular fa-bell-slash"></i>
                    <p>No notifications</p>
                </div>
            `;

            return;
        }

        container.innerHTML =
            state.notifications
                .map(
                    item => `
                    <button
                        type="button"
                        class="notification-item ${
                            item.unread
                                ? "is-unread"
                                : ""
                        }"
                        data-notification-id="${item.id}"
                    >
                        <span class="notification-item-icon">
                            <i class="${escapeAttribute(item.icon)}"></i>
                        </span>

                        <span class="notification-item-content">
                            <strong>
                                ${escapeHTML(item.title)}
                            </strong>

                            <span>
                                ${escapeHTML(item.text)}
                            </span>

                            <small>
                                ${escapeHTML(item.time)}
                            </small>
                        </span>

                        ${
                            item.unread
                                ? `<span class="notification-dot"></span>`
                                : ""
                        }
                    </button>
                `
                )
                .join("");

        updateNotificationCount();
    }

    function markNotificationRead(
        id
    ) {
        const item =
            state.notifications.find(
                notification =>
                    String(
                        notification.id
                    ) === String(id)
            );

        if (!item) {
            return;
        }

        item.unread = false;

        saveNotifications();
        renderNotifications();

        showToast(
            "Notification marked as read.",
            "success"
        );
    }

    function markAllNotificationsRead() {
        state.notifications.forEach(
            item => {
                item.unread = false;
            }
        );

        saveNotifications();
        renderNotifications();

        showToast(
            "All notifications marked as read.",
            "success"
        );
    }

    /* ============================================================
       QUICK CREATE
       ============================================================ */

    function handleQuickCreate(type) {
        const actions = {
            order: {
                title: "Create Order",
                url: "orders.html"
            },

            customer: {
                title: "Add Customer",
                url: "customers.html"
            },

            product: {
                title: "Add Product",
                url: "products.html"
            },

            invoice: {
                title: "Create Invoice",
                url: "invoices.html"
            },

            message: {
                title: "New Message",
                url: "messages.html"
            },

            report: {
                title: "Create Report",
                url: "analytics.html"
            }
        };

        const action =
            actions[type];

        if (!action) {
            showToast(
                "This action is not available yet.",
                "warning"
            );

            return;
        }

        closeModal("quickCreate");

        showToast(
            `${action.title} opened`,
            "success"
        );

        window.setTimeout(
            () => {
                navigateTo(
                    action.url,
                    action.title
                );
            },
            180
        );
    }

    /* ============================================================
       UPGRADE SYSTEM
       ============================================================ */

    function handleUpgradePlan(
        plan = "Pro"
    ) {
        closeModal("upgrade");

        showToast(
            `${plan} plan selected`,
            "success"
        );

        announceToScreenReader(
            `${plan} plan selected`
        );
    }

    /* ============================================================
       CONFIRMATION SYSTEM
       ============================================================ */

    let confirmationCallback =
        null;

    function openConfirmation(
        options = {}
    ) {
        const modal =
            DOM.confirmationModal;

        if (!modal) {
            return;
        }

        const title =
            options.title ||
            "Are you sure?";

        const message =
            options.message ||
            "This action cannot be undone.";

        const titleElement =
            modal.querySelector(
                "[data-confirm-title]"
            );

        const messageElement =
            modal.querySelector(
                "[data-confirm-message]"
            );

        if (titleElement) {
            titleElement.textContent =
                title;
        }

        if (messageElement) {
            messageElement.textContent =
                message;
        }

        confirmationCallback =
            typeof options.onConfirm ===
            "function"
                ? options.onConfirm
                : null;

        openModal("confirmation");
    }

    function confirmCurrentAction() {
        if (
            typeof confirmationCallback ===
            "function"
        ) {
            confirmationCallback();
        }

        confirmationCallback =
            null;

        closeModal(
            "confirmation"
        );
    }

    /* ============================================================
       EVENT DELEGATION
       ============================================================ */

    function initializeEventDelegation() {
        document.addEventListener(
            "click",
            event => {
                const target =
                    event.target;

                /*
                 * Toast close
                 */
                const toastClose =
                    target.closest(
                        "[data-toast-close]"
                    );

                if (toastClose) {
                    const toast =
                        toastClose.closest(
                            ".toast"
                        );

                    toast?.remove();

                    return;
                }

                /*
                 * Theme
                 */
                const themeAction =
                    target.closest(
                        '[data-action="toggle-theme"], [data-theme-toggle]'
                    );

                if (themeAction) {
                    event.preventDefault();

                    toggleTheme();

                    return;
                }

                /*
                 * Mobile menu
                 */
                const mobileMenu =
                    target.closest(
                        '[data-action="mobile-menu"]'
                    );

                if (mobileMenu) {
                    event.preventDefault();

                    toggleMobileSidebar();

                    return;
                }

                /*
                 * Sidebar collapse
                 */
                const collapse =
                    target.closest(
                        '[data-action="collapse-sidebar"]'
                    );

                if (collapse) {
                    event.preventDefault();

                    toggleSidebarCollapse();

                    return;
                }

                /*
                 * Sidebar overlay
                 */
                if (
                    target ===
                    DOM.sidebarOverlay
                ) {
                    closeMobileSidebar();

                    return;
                }

                /*
                 * Search button
                 */
                const search =
                    target.closest(
                        '[data-action="search"]'
                    );

                if (search) {
                    event.preventDefault();

                    openModal(
                        "search"
                    );

                    return;
                }

                /*
                 * Quick create
                 */
                const quickCreate =
                    target.closest(
                        '[data-action="quick-create"]'
                    );

                if (quickCreate) {
                    event.preventDefault();

                    openModal(
                        "quickCreate"
                    );

                    return;
                }

                /*
                 * Upgrade
                 */
                const upgrade =
                    target.closest(
                        '[data-action="upgrade"], [data-open-upgrade]'
                    );

                if (upgrade) {
                    event.preventDefault();

                    openModal(
                        "upgrade"
                    );

                    return;
                }

                /*
                 * Close modal
                 */
                const closeModalButton =
                    target.closest(
                        "[data-close-modal]"
                    );

                if (closeModalButton) {
                    event.preventDefault();

                    const modalName =
                        closeModalButton.dataset
                            .closeModal;

                    if (modalName) {
                        closeModal(
                            modalName
                        );
                    } else {
                        closeAllModals();
                    }

                    return;
                }

                /*
                 * Clicking modal backdrop
                 */
                const modal =
                    target.closest(
                        ".modal"
                    );

                if (
                    modal &&
                    target === modal
                ) {
                    const name =
                        modal.dataset
                            .modalName;

                    if (name) {
                        closeModal(
                            name
                        );
                    } else {
                        modal.classList.remove(
                            "is-open",
                            "active",
                            "show"
                        );
                    }

                    return;
                }

                /*
                 * Language item
                 */
                const language =
                    target.closest(
                        "[data-language], [data-lang]"
                    );

                if (language) {
                    event.preventDefault();

                    const code =
                        language.dataset.language ||
                        language.dataset.lang;

                    setLanguage(
                        code
                    );

                    return;
                }

                /*
                 * Notification
                 */
                const notification =
                    target.closest(
                        "[data-notification-id]"
                    );

                if (notification) {
                    event.preventDefault();

                    markNotificationRead(
                        notification.dataset
                            .notificationId
                    );

                    return;
                }

                /*
                 * Mark all notifications
                 */
                const markAll =
                    target.closest(
                        "[data-mark-all-notifications]"
                    );

                if (markAll) {
                    event.preventDefault();

                    markAllNotificationsRead();

                    return;
                }

                /*
                 * Search result
                 */
                const searchResult =
                    target.closest(
                        "[data-search-url]"
                    );

                if (searchResult) {
                    event.preventDefault();

                    const url =
                        searchResult.dataset
                            .searchUrl;

                    const title =
                        searchResult.dataset
                            .searchTitle;

                    if (
                        DOM.searchInput
                    ) {
                        addSearchHistory(
                            DOM.searchInput.value
                        );
                    }

                    navigateTo(
                        url,
                        title
                    );

                    return;
                }

                /*
                 * Quick create item
                 */
                const quickItem =
                    target.closest(
                        "[data-create]"
                    );

                if (quickItem) {
                    event.preventDefault();

                    handleQuickCreate(
                        quickItem.dataset
                            .create
                    );

                    return;
                }

                /*
                 * Plan button
                 */
                const plan =
                    target.closest(
                        "[data-plan]"
                    );

                if (plan) {
                    event.preventDefault();

                    handleUpgradePlan(
                        plan.dataset.plan
                    );

                    return;
                }

                /*
                 * Confirmation button
                 */
                const confirmButton =
                    target.closest(
                        "[data-confirm-action]"
                    );

                if (confirmButton) {
                    event.preventDefault();

                    confirmCurrentAction();

                    return;
                }

                /*
                 * Copy buttons
                 */
                const copyButton =
                    target.closest(
                        "[data-copy]"
                    );

                if (copyButton) {
                    event.preventDefault();

                    copyToClipboard(
                        copyButton.dataset
                            .copy
                    );

                    return;
                }

                /*
                 * Scroll to top
                 */
                const scrollTop =
                    target.closest(
                        "[data-scroll-top]"
                    );

                if (scrollTop) {
                    event.preventDefault();

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                    return;
                }
            }
        );
    }

    /* ============================================================
       KEYBOARD SHORTCUTS
       ============================================================ */

    function initializeKeyboardShortcuts() {
        document.addEventListener(
            "keydown",
            event => {
                const modifier =
                    event.ctrlKey ||
                    event.metaKey;

                /*
                 * Ctrl/Cmd + K
                 * Global search
                 */
                if (
                    modifier &&
                    event.key.toLowerCase() ===
                        "k"
                ) {
                    event.preventDefault();

                    if (
                        state.searchOpen
                    ) {
                        closeModal(
                            "search"
                        );
                    } else {
                        openModal(
                            "search"
                        );
                    }

                    return;
                }

                /*
                 * Escape
                 */
                if (
                    event.key ===
                    "Escape"
                ) {
                    closeAllModals();
                    closeAllDropdowns();

                    if (isMobile()) {
                        closeMobileSidebar();
                    }

                    return;
                }

                /*
                 * Ctrl/Cmd + Shift + L
                 * Theme
                 */
                if (
                    modifier &&
                    event.shiftKey &&
                    event.key.toLowerCase() ===
                        "l"
                ) {
                    event.preventDefault();

                    toggleTheme();

                    return;
                }
            }
        );
    }

    /* ============================================================
       SEARCH INPUT EVENTS
       ============================================================ */

    function initializeSearch() {
        if (!DOM.searchInput) {
            return;
        }

        let debounceTimer =
            null;

        DOM.searchInput.addEventListener(
            "input",
            event => {
                const value =
                    event.target.value;

                clearTimeout(
                    debounceTimer
                );

                debounceTimer =
                    window.setTimeout(
                        () => {
                            renderSearchResults(
                                value
                            );
                        },
                        100
                    );
            }
        );

        DOM.searchInput.addEventListener(
            "keydown",
            event => {
                if (
                    event.key ===
                    "Enter"
                ) {
                    event.preventDefault();

                    executeSearch(
                        DOM.searchInput.value
                    );
                }
            }
        );
    }

    /* ============================================================
       DROPDOWN EVENTS
       ============================================================ */

    function initializeDropdowns() {
        if (DOM.languageButton) {
            DOM.languageButton.addEventListener(
                "click",
                event => {
                    event.preventDefault();
                    event.stopPropagation();

                    toggleDropdown(
                        DOM.languageMenu,
                        DOM.languageButton,
                        "language"
                    );
                }
            );
        }

        if (DOM.notificationButton) {
            DOM.notificationButton.addEventListener(
                "click",
                event => {
                    event.preventDefault();
                    event.stopPropagation();

                    renderNotifications();

                    toggleDropdown(
                        DOM.notificationMenu,
                        DOM.notificationButton,
                        "notifications"
                    );
                }
            );
        }

        if (DOM.userButton) {
            DOM.userButton.addEventListener(
                "click",
                event => {
                    event.preventDefault();
                    event.stopPropagation();

                    toggleDropdown(
                        DOM.userMenu,
                        DOM.userButton,
                        "user"
                    );
                }
            );

            DOM.userButton.addEventListener(
                "keydown",
                event => {
                    if (
                        event.key ===
                            "Enter" ||
                        event.key ===
                            " "
                    ) {
                        event.preventDefault();

                        toggleDropdown(
                            DOM.userMenu,
                            DOM.userButton,
                            "user"
                        );
                    }
                }
            );
        }

        document.addEventListener(
            "click",
            event => {
                const clickedDropdown =
                    event.target.closest(
                        ".dropdown, .language-dropdown, .notification-dropdown, .user-dropdown"
                    );

                if (
                    !clickedDropdown
                ) {
                    closeAllDropdowns();
                }
            }
        );
    }

    /* ============================================================
       CLICK OUTSIDE SEARCH / MODALS
       ============================================================ */

    function initializeModalBehavior() {
        document.addEventListener(
            "click",
            event => {
                if (
                    state.searchOpen &&
                    DOM.searchModal &&
                    event.target ===
                        DOM.searchModal
                ) {
                    closeModal(
                        "search"
                    );
                }
            }
        );
    }

    /* ============================================================
       OFFLINE / ONLINE
       ============================================================ */

    function updateConnectionState() {
        state.isOnline =
            navigator.onLine;

        if (DOM.offlineIndicator) {
            DOM.offlineIndicator.classList.toggle(
                "is-visible",
                !state.isOnline
            );

            DOM.offlineIndicator.classList.toggle(
                "offline",
                !state.isOnline
            );

            DOM.offlineIndicator.classList.toggle(
                "online",
                state.isOnline
            );
        }

        DOM.body?.classList.toggle(
            "is-offline",
            !state.isOnline
        );

        if (state.isOnline) {
            showToast(
                "Connection restored.",
                "success",
                2400
            );
        } else {
            showToast(
                "You are currently offline.",
                "warning",
                5000
            );
        }
    }

    function initializeNetworkEvents() {
        window.addEventListener(
            "online",
            updateConnectionState
        );

        window.addEventListener(
            "offline",
            updateConnectionState
        );

        if (
            DOM.offlineIndicator &&
            !navigator.onLine
        ) {
            DOM.offlineIndicator.classList.add(
                "is-visible"
            );
        }
    }

    /* ============================================================
       RIPPLE / INTERACTION EFFECT
       ============================================================ */

    function initializeRippleEffect() {
        document.addEventListener(
            "pointerdown",
            event => {
                const button =
                    event.target.closest(
                        "button, .btn, [data-ripple]"
                    );

                if (!button) {
                    return;
                }

                if (
                    button.dataset.ripple ===
                    "false"
                ) {
                    return;
                }

                const rect =
                    button.getBoundingClientRect();

                const ripple =
                    document.createElement(
                        "span"
                    );

                ripple.className =
                    "veltrix-ripple";

                const size =
                    Math.max(
                        rect.width,
                        rect.height
                    );

                ripple.style.width =
                    `${size}px`;

                ripple.style.height =
                    `${size}px`;

                ripple.style.left =
                    `${
                        event.clientX -
                        rect.left -
                        size / 2
                    }px`;

                ripple.style.top =
                    `${
                        event.clientY -
                        rect.top -
                        size / 2
                    }px`;

                button
                    .querySelectorAll(
                        ".veltrix-ripple"
                    )
                    .forEach(
                        oldRipple =>
                            oldRipple.remove()
                    );

                button.appendChild(
                    ripple
                );

                window.setTimeout(
                    () =>
                        ripple.remove(),
                    650
                );
            }
        );
    }

    /* ============================================================
       CARD HOVER GLOW
       ============================================================ */

    function initializeCardGlow() {
        const cards =
            document.querySelectorAll(
                ".card, .kpi-card, .stat-card, .dashboard-card, .panel, .glass-card"
            );

        cards.forEach(card => {
            card.addEventListener(
                "pointermove",
                event => {
                    const rect =
                        card.getBoundingClientRect();

                    const x =
                        event.clientX -
                        rect.left;

                    const y =
                        event.clientY -
                        rect.top;

                    card.style.setProperty(
                        "--mouse-x",
                        `${x}px`
                    );

                    card.style.setProperty(
                        "--mouse-y",
                        `${y}px`
                    );
                }
            );

            card.addEventListener(
                "pointerleave",
                () => {
                    card.style.removeProperty(
                        "--mouse-x"
                    );

                    card.style.removeProperty(
                        "--mouse-y"
                    );
                }
            );
        });
    }

    /* ============================================================
       SCROLL EFFECTS
       ============================================================ */

    function initializeScrollEffects() {
        let ticking = false;

        const update = () => {
            const scrollY =
                window.scrollY;

            DOM.body?.classList.toggle(
                "scrolled",
                scrollY > 20
            );

            const topButton =
                document.querySelector(
                    "[data-scroll-top]"
                );

            if (topButton) {
                topButton.classList.toggle(
                    "is-visible",
                    scrollY > 500
                );
            }

            ticking = false;
        };

        window.addEventListener(
            "scroll",
            () => {
                if (!ticking) {
                    requestAnimationFrame(
                        update
                    );

                    ticking = true;
                }
            },
            {
                passive: true
            }
        );

        update();
    }

    /* ============================================================
       RESIZE MANAGEMENT
       ============================================================ */

    function initializeResize() {
        let timer = null;

        window.addEventListener(
            "resize",
            () => {
                clearTimeout(timer);

                timer =
                    window.setTimeout(
                        () => {
                            if (
                                !isMobile()
                            ) {
                                DOM.body?.classList.remove(
                                    "mobile-sidebar-open",
                                    "sidebar-open",
                                    "no-scroll-mobile"
                                );

                                if (
                                    DOM.sidebarOverlay
                                ) {
                                    DOM.sidebarOverlay.classList.remove(
                                        "is-visible"
                                    );
                                }
                            }

                            applySidebarState();
                        },
                        100
                    );
            }
        );
    }

    /* ============================================================
       DATE / TIME
       ============================================================ */

    function updateDateTime() {
        const now =
            new Date();

        document
            .querySelectorAll(
                "[data-current-time]"
            )
            .forEach(
                element => {
                    element.textContent =
                        now.toLocaleTimeString(
                            undefined,
                            {
                                hour: "2-digit",
                                minute: "2-digit"
                            }
                        );
                }
            );

        document
            .querySelectorAll(
                "[data-current-date]"
            )
            .forEach(
                element => {
                    element.textContent =
                        now.toLocaleDateString(
                            undefined,
                            {
                                weekday:
                                    "short",
                                month:
                                    "short",
                                day:
                                    "numeric"
                            }
                        );
                }
            );

        document
            .querySelectorAll(
                "[data-current-year]"
            )
            .forEach(
                element => {
                    element.textContent =
                        String(
                            now.getFullYear()
                        );
                }
            );
    }

    function initializeClock() {
        updateDateTime();

        window.setInterval(
            updateDateTime,
            30000
        );
    }

    /* ============================================================
       PASSWORD / SECURITY UI
       ============================================================ */

    function initializePasswordToggles() {
        document.addEventListener(
            "click",
            event => {
                const toggle =
                    event.target.closest(
                        "[data-toggle-password]"
                    );

                if (!toggle) {
                    return;
                }

                event.preventDefault();

                const selector =
                    toggle.dataset
                        .togglePassword;

                let input = null;

                if (selector) {
                    try {
                        input =
                            document.querySelector(
                                selector
                            );
                    } catch (error) {
                        input = null;
                    }
                }

                if (!input) {
                    input =
                        toggle
                            .closest(
                                ".password-field, .form-field, .input-group"
                            )
                            ?.querySelector(
                                'input[type="password"], input[type="text"]'
                            );
                }

                if (!input) {
                    return;
                }

                const hidden =
                    input.type ===
                    "password";

                input.type =
                    hidden
                        ? "text"
                        : "password";

                const icon =
                    toggle.querySelector(
                        "i"
                    );

                if (icon) {
                    icon.className =
                        hidden
                            ? "fa-solid fa-eye-slash"
                            : "fa-solid fa-eye";
                }

                toggle.setAttribute(
                    "aria-label",
                    hidden
                        ? "Hide password"
                        : "Show password"
                );
            }
        );
    }

    /* ============================================================
       FORM VALIDATION
       ============================================================ */

    function initializeForms() {
        const forms =
            document.querySelectorAll(
                "form[data-veltrix-form], .veltrix-form"
            );

        forms.forEach(form => {
            form.addEventListener(
                "submit",
                event => {
                    const required =
                        form.querySelectorAll(
                            "[required]"
                        );

                    let valid = true;

                    required.forEach(
                        input => {
                            const value =
                                input.value.trim();

                            const fieldValid =
                                Boolean(
                                    value
                                );

                            input.classList.toggle(
                                "is-invalid",
                                !fieldValid
                            );

                            if (
                                !fieldValid
                            ) {
                                valid =
                                    false;
                            }
                        }
                    );

                    if (!valid) {
                        event.preventDefault();

                        showToast(
                            "Please complete all required fields.",
                            "warning"
                        );

                        const firstInvalid =
                            form.querySelector(
                                ".is-invalid"
                            );

                        firstInvalid?.focus();

                        return;
                    }

                    /*
                     * For demo/template forms we prevent the
                     * browser from navigating away unless the
                     * form explicitly provides a real action.
                     */
                    if (
                        form.dataset.demo ===
                        "true"
                    ) {
                        event.preventDefault();

                        showToast(
                            "Your information has been saved.",
                            "success"
                        );
                    }
                }
            );
        });
    }

    /* ============================================================
       COPY TO CLIPBOARD
       ============================================================ */

    async function copyToClipboard(
        text
    ) {
        if (!text) {
            return;
        }

        try {
            if (
                navigator.clipboard &&
                window.isSecureContext
            ) {
                await navigator.clipboard.writeText(
                    text
                );
            } else {
                const textarea =
                    document.createElement(
                        "textarea"
                    );

                textarea.value =
                    text;

                textarea.style.position =
                    "fixed";

                textarea.style.opacity =
                    "0";

                document.body.appendChild(
                    textarea
                );

                textarea.select();

                document.execCommand(
                    "copy"
                );

                textarea.remove();
            }

            showToast(
                "Copied to clipboard.",
                "success"
            );
        } catch (error) {
            showToast(
                "Could not copy the text.",
                "error"
            );
        }
    }

    /* ============================================================
       HTML SECURITY HELPERS
       ============================================================ */

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );
    }

    function escapeAttribute(
        value
    ) {
        return escapeHTML(value);
    }

    /* ============================================================
       TOOLTIP SYSTEM
       ============================================================ */

    function initializeTooltips() {
        const elements =
            document.querySelectorAll(
                "[data-tooltip]"
            );

        elements.forEach(
            element => {
                element.setAttribute(
                    "aria-label",
                    element.dataset.tooltip
                );

                element.addEventListener(
                    "mouseenter",
                    () => {
                        createTooltip(
                            element
                        );
                    }
                );

                element.addEventListener(
                    "mouseleave",
                    () => {
                        removeTooltip();
                    }
                );

                element.addEventListener(
                    "focus",
                    () => {
                        createTooltip(
                            element
                        );
                    }
                );

                element.addEventListener(
                    "blur",
                    () => {
                        removeTooltip();
                    }
                );
            }
        );
    }

    function createTooltip(
        element
    ) {
        removeTooltip();

        const text =
            element.dataset.tooltip;

        if (!text) {
            return;
        }

        const tooltip =
            document.createElement(
                "div"
            );

        tooltip.id =
            "veltrix-tooltip";

        tooltip.className =
            "veltrix-tooltip";

        tooltip.textContent =
            text;

        document.body.appendChild(
            tooltip
        );

        const rect =
            element.getBoundingClientRect();

        const tooltipRect =
            tooltip.getBoundingClientRect();

        let left =
            rect.left +
            rect.width / 2 -
            tooltipRect.width / 2;

        let top =
            rect.top -
            tooltipRect.height -
            10;

        const margin = 10;

        left =
            Math.max(
                margin,
                Math.min(
                    left,
                    window.innerWidth -
                        tooltipRect.width -
                        margin
                )
            );

        if (top < margin) {
            top =
                rect.bottom +
                10;
        }

        tooltip.style.left =
            `${left}px`;

        tooltip.style.top =
            `${top}px`;

        requestAnimationFrame(
            () => {
                tooltip.classList.add(
                    "is-visible"
                );
            }
        );
    }

    function removeTooltip() {
        const tooltip =
            document.getElementById(
                "veltrix-tooltip"
            );

        if (tooltip) {
            tooltip.remove();
        }
    }

    /* ============================================================
       ACTIVE NAVIGATION
       ============================================================ */

    function initializeActiveNavigation() {
        const currentPage =
            document.body?.dataset?.page ||
            state.currentPage;

        const links =
            document.querySelectorAll(
                "[data-nav-page], [data-page]"
            );

        links.forEach(link => {
            const page =
                link.dataset.navPage ||
                link.dataset.page;

            if (
                page &&
                page === currentPage
            ) {
                link.classList.add(
                    "active"
                );

                link.setAttribute(
                    "aria-current",
                    "page"
                );
            }
        });
    }

    /* ============================================================
       LOADER
       ============================================================ */

    function hideLoader() {
        if (!DOM.loader) {
            return;
        }

        DOM.loader.classList.add(
            "loaded",
            "hidden"
        );

        window.setTimeout(
            () => {
                DOM.loader.style.display =
                    "none";
            },
            650
        );
    }

    function showLoader() {
        if (!DOM.loader) {
            return;
        }

        DOM.loader.style.display =
            "";

        DOM.loader.classList.remove(
            "loaded",
            "hidden"
        );
    }

    /* ============================================================
       INITIAL PAGE REVEAL
       ============================================================ */

    function initializeRevealAnimations() {
        const elements =
            document.querySelectorAll(
                "[data-reveal], .reveal-on-scroll"
            );

        if (!elements.length) {
            return;
        }

        const observer =
            new IntersectionObserver(
                entries => {
                    entries.forEach(
                        entry => {
                            if (
                                entry.isIntersecting
                            ) {
                                entry.target.classList.add(
                                    "revealed"
                                );

                                observer.unobserve(
                                    entry.target
                                );
                            }
                        }
                    );
                },
                {
                    threshold: 0.1
                }
            );

        elements.forEach(
            element =>
                observer.observe(
                    element
                )
        );
    }

    /* ============================================================
       PREFERS REDUCED MOTION
       ============================================================ */

    function initializeReducedMotion() {
        const media =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            );

        const update = () => {
            DOM.body?.classList.toggle(
                "reduced-motion",
                media.matches
            );
        };

        update();

        if (
            typeof media.addEventListener ===
            "function"
        ) {
            media.addEventListener(
                "change",
                update
            );
        }
    }

    /* ============================================================
       BACK TO TOP
       ============================================================ */

    function initializeBackToTop() {
        const button =
            document.querySelector(
                "[data-scroll-top]"
            );

        if (!button) {
            return;
        }

        button.addEventListener(
            "click",
            event => {
                event.preventDefault();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        );
    }

    /* ============================================================
       DYNAMIC PERCENTAGE CALCULATOR
       ============================================================ */

    function initializePercentageCalculators() {
        const calculators =
            document.querySelectorAll(
                "[data-percentage-calculator]"
            );

        calculators.forEach(
            calculator => {
                const baseInput =
                    calculator.querySelector(
                        "[data-base]"
                    );

                const percentageInput =
                    calculator.querySelector(
                        "[data-percentage]"
                    );

                const result =
                    calculator.querySelector(
                        "[data-result]"
                    );

                const output =
                    calculator.querySelector(
                        "[data-calculated-value]"
                    );

                const calculate = () => {
                    const base =
                        parseFloat(
                            baseInput?.value
                        ) || 0;

                    const percentage =
                        parseFloat(
                            percentageInput?.value
                        ) || 0;

                    const calculated =
                        base *
                        (percentage /
                            100);

                    if (result) {
                        result.textContent =
                            formatNumber(
                                calculated,
                                2
                            );
                    }

                    if (output) {
                        output.value =
                            calculated.toFixed(
                                2
                            );
                    }
                };

                baseInput?.addEventListener(
                    "input",
                    calculate
                );

                percentageInput?.addEventListener(
                    "input",
                    calculate
                );

                calculate();
            }
        );
    }

    /* ============================================================
       ORDER / QUANTITY AUTOMATION
       ============================================================ */

    function initializeOrderCalculator() {
        const calculators =
            document.querySelectorAll(
                "[data-order-calculator]"
            );

        calculators.forEach(
            calculator => {
                const orders =
                    calculator.querySelector(
                        "[data-orders]"
                    );

                const price =
                    calculator.querySelector(
                        "[data-price]"
                    );

                const tax =
                    calculator.querySelector(
                        "[data-tax]"
                    );

                const total =
                    calculator.querySelector(
                        "[data-total]"
                    );

                const calculate = () => {
                    const orderCount =
                        parseFloat(
                            orders?.value
                        ) || 0;

                    const unitPrice =
                        parseFloat(
                            price?.value
                        ) || 0;

                    const taxRate =
                        parseFloat(
                            tax?.value
                        ) || 0;

                    const subtotal =
                        orderCount *
                        unitPrice;

                    const taxAmount =
                        subtotal *
                        (taxRate /
                            100);

                    const finalTotal =
                        subtotal +
                        taxAmount;

                    if (total) {
                        total.textContent =
                            formatNumber(
                                finalTotal,
                                2
                            );
                    }

                    calculator
                        .querySelectorAll(
                            "[data-subtotal]"
                        )
                        .forEach(
                            element => {
                                element.textContent =
                                    formatNumber(
                                        subtotal,
                                        2
                                    );
                            }
                        );

                    calculator
                        .querySelectorAll(
                            "[data-tax-value]"
                        )
                        .forEach(
                            element => {
                                element.textContent =
                                    formatNumber(
                                        taxAmount,
                                        2
                                    );
                            }
                        );
                };

                [
                    orders,
                    price,
                    tax
                ].forEach(input => {
                    input?.addEventListener(
                        "input",
                        calculate
                    );
                });

                calculate();
            }
        );
    }

    /* ============================================================
       DATA ATTRIBUTE ACTIONS
       ============================================================ */

    function initializeGenericActions() {
        document.addEventListener(
            "click",
            event => {
                const action =
                    event.target.closest(
                        "[data-action-name]"
                    );

                if (!action) {
                    return;
                }

                const name =
                    action.dataset
                        .actionName;

                switch (name) {
                    case "refresh":
                        window.location.reload();
                        break;

                    case "save":
                        showToast(
                            "Changes saved successfully.",
                            "success"
                        );
                        break;

                    case "export":
                        showToast(
                            "Export process started.",
                            "success"
                        );
                        break;

                    case "share":
                        shareCurrentPage();
                        break;

                    case "logout":
                        handleLogout();
                        break;

                    default:
                        showToast(
                            `${name || "Action"} activated.`,
                            "info"
                        );
                }
            }
        );
    }

    async function shareCurrentPage() {
        const data = {
            title:
                document.title ||
                CONFIG.appName,

            text:
                "Check out this Veltrix workspace.",

            url:
                window.location.href
        };

        try {
            if (
                navigator.share
            ) {
                await navigator.share(
                    data
                );

                return;
            }

            await copyToClipboard(
                window.location.href
            );
        } catch (error) {
            /*
             * User may have cancelled native sharing.
             */
        }
    }

    function handleLogout() {
        openConfirmation({
            title: "Sign out?",
            message:
                "Are you sure you want to sign out of this workspace?",

            onConfirm: () => {
                showToast(
                    "Signed out successfully.",
                    "success"
                );

                /*
                 * Template-safe logout behavior.
                 * A real production backend should invalidate
                 * the authenticated server session here.
                 */
                window.setTimeout(
                    () => {
                        window.location.href =
                            "index.html";
                    },
                    700
                );
            }
        });
    }

    /* ============================================================
       TABLE SORTING
       ============================================================ */

    function initializeSortableTables() {
        const tables =
            document.querySelectorAll(
                "table[data-sortable]"
            );

        tables.forEach(table => {
            const headers =
                table.querySelectorAll(
                    "thead th[data-sort]"
                );

            headers.forEach(
                header => {
                    header.style.cursor =
                        "pointer";

                    header.addEventListener(
                        "click",
                        () => {
                            sortTable(
                                table,
                                header
                                    .dataset
                                    .sort
                            );
                        }
                    );
                }
            );
        });
    }

    function sortTable(
        table,
        columnName
    ) {
        const header =
            table.querySelector(
                `thead th[data-sort="${CSS.escape(
                    columnName
                )}"]`
            );

        if (!header) {
            return;
        }

        const headers =
            Array.from(
                table.querySelectorAll(
                    "thead th[data-sort]"
                )
            );

        const columnIndex =
            headers.indexOf(header);

        if (
            columnIndex < 0
        ) {
            return;
        }

        const tbody =
            table.querySelector(
                "tbody"
            );

        if (!tbody) {
            return;
        }

        const rows =
            Array.from(
                tbody.querySelectorAll(
                    "tr"
                )
            );

        const ascending =
            header.dataset.direction !==
            "asc";

        headers.forEach(
            item => {
                delete item.dataset
                    .direction;
            }
        );

        header.dataset.direction =
            ascending
                ? "asc"
                : "desc";

        rows.sort(
            (a, b) => {
                const aCell =
                    a.children[
                        columnIndex
                    ];

                const bCell =
                    b.children[
                        columnIndex
                    ];

                const aText =
                    aCell?.textContent
                        ?.trim() ||
                    "";

                const bText =
                    bCell?.textContent
                        ?.trim() ||
                    "";

                const aNumber =
                    parseFloat(
                        aText.replace(
                            /[^0-9.-]/g,
                            ""
                        )
                    );

                const bNumber =
                    parseFloat(
                        bText.replace(
                            /[^0-9.-]/g,
                            ""
                        )
                    );

                if (
                    Number.isFinite(
                        aNumber
                    ) &&
                    Number.isFinite(
                        bNumber
                    )
                ) {
                    return ascending
                        ? aNumber -
                              bNumber
                        : bNumber -
                              aNumber;
                }

                return ascending
                    ? aText.localeCompare(
                          bText
                      )
                    : bText.localeCompare(
                          aText
                      );
            }
        );

        rows.forEach(
            row =>
                tbody.appendChild(
                    row
                )
        );
    }

    /* ============================================================
       FILTER SYSTEM
       ============================================================ */

    function initializeFilters() {
        document.addEventListener(
            "input",
            event => {
                const input =
                    event.target.closest(
                        "[data-filter-input]"
                    );

                if (!input) {
                    return;
                }

                const selector =
                    input.dataset
                        .filterTarget;

                const query =
                    normalizeSearchText(
                        input.value
                    );

                const target =
                    selector
                        ? document.querySelector(
                              selector
                          )
                        : input
                              .closest(
                                  "[data-filter-container]"
                              )
                              ?.querySelector(
                                  "[data-filter-items]"
                              );

                if (!target) {
                    return;
                }

                const items =
                    target.querySelectorAll(
                        "[data-filter-item]"
                    );

                items.forEach(
                    item => {
                        const text =
                            normalizeSearchText(
                                item.textContent
                            );

                        const visible =
                            !query ||
                            text.includes(
                                query
                            );

                        item.hidden =
                            !visible;
                    }
                );
            }
        );
    }

    /* ============================================================
       SELECT / CUSTOM SELECT
       ============================================================ */

    function initializeCustomSelects() {
        const selects =
            document.querySelectorAll(
                "[data-custom-select]"
            );

        selects.forEach(
            select => {
                const trigger =
                    select.querySelector(
                        "[data-select-trigger]"
                    );

                const menu =
                    select.querySelector(
                        "[data-select-menu]"
                    );

                if (
                    !trigger ||
                    !menu
                ) {
                    return;
                }

                trigger.addEventListener(
                    "click",
                    event => {
                        event.preventDefault();
                        event.stopPropagation();

                        const open =
                            menu.classList.contains(
                                "is-open"
                            );

                        document
                            .querySelectorAll(
                                "[data-select-menu].is-open"
                            )
                            .forEach(
                                item =>
                                    item.classList.remove(
                                        "is-open"
                                    )
                            );

                        menu.classList.toggle(
                            "is-open",
                            !open
                        );
                    }
                );

                menu.addEventListener(
                    "click",
                    event => {
                        const option =
                            event.target.closest(
                                "[data-select-value]"
                            );

                        if (!option) {
                            return;
                        }

                        const value =
                            option.dataset
                                .selectValue;

                        const label =
                            option.textContent
                                .trim();

                        trigger.textContent =
                            label;

                        select.dataset
                            .value =
                            value;

                        menu.classList.remove(
                            "is-open"
                        );
                    }
                );
            }
        );
    }

    /* ============================================================
       FAVOURITE / STAR BUTTONS
       ============================================================ */

    function initializeFavorites() {
        document.addEventListener(
            "click",
            event => {
                const button =
                    event.target.closest(
                        "[data-favorite]"
                    );

                if (!button) {
                    return;
                }

                event.preventDefault();

                const active =
                    button.classList.toggle(
                        "is-favorite"
                    );

                button.setAttribute(
                    "aria-pressed",
                    active
                        ? "true"
                        : "false"
                );

                const icon =
                    button.querySelector(
                        "i"
                    );

                if (icon) {
                    icon.className =
                        active
                            ? "fa-solid fa-star"
                            : "fa-regular fa-star";
                }

                showToast(
                    active
                        ? "Added to favorites."
                        : "Removed from favorites.",
                    "success",
                    1800
                );
            }
        );
    }

    /* ============================================================
       COPY CURRENT URL
       ============================================================ */

    function initializeCopyURL() {
        document.addEventListener(
            "click",
            event => {
                const button =
                    event.target.closest(
                        "[data-copy-url]"
                    );

                if (!button) {
                    return;
                }

                event.preventDefault();

                copyToClipboard(
                    window.location.href
                );
            }
        );
    }

    /* ============================================================
       INITIALIZATION
       ============================================================ */

    function initializeApp() {
        if (state.initialized) {
            return;
        }

        cacheDOM();

        if (!DOM.body) {
            return;
        }

        /*
         * Theme must be applied immediately to prevent
         * a visual flash.
         */
        applyTheme(
            state.theme,
            false
        );

        /*
         * Sidebar
         */
        applySidebarState();

        /*
         * Language
         */
        initializeLanguageSystem();

        /*
         * Navigation
         */
        initializeNavigation();

        initializeActiveNavigation();

        /*
         * Workspace
         */
        initializeWorkspace();

        /*
         * Dropdowns
         */
        initializeDropdowns();

        /*
         * Event delegation
         */
        initializeEventDelegation();

        /*
         * Search
         */
        initializeSearch();

        /*
         * Keyboard
         */
        initializeKeyboardShortcuts();

        manageFocus();

        /*
         * Network
         */
        initializeNetworkEvents();

        /*
         * Visual interactions
         */
        initializeRippleEffect();

        initializeCardGlow();

        initializeScrollEffects();

        initializeResize();

        initializeReducedMotion();

        initializeTooltips();

        initializeBackToTop();

        /*
         * Data systems
         */
        initializeCounters();

        initializeProgressBars();

        initializeOrderInteractions();

        initializePercentageCalculators();

        initializeOrderCalculator();

        initializeForms();

        initializePasswordToggles();

        initializeGenericActions();

        initializeSortableTables();

        initializeFilters();

        initializeCustomSelects();

        initializeFavorites();

        initializeCopyURL();

        /*
         * Charts
         */
        createRevenueChart();

        createActivityChart();

        /*
         * Clock
         */
        initializeClock();

        /*
         * Reveal animations
         */
        initializeRevealAnimations();

        /*
         * Notifications
         */
        renderNotifications();

        updateNotificationCount();

        /*
         * Final UI sync
         */
        updateThemeControls();

        updateLanguageUI();

        updateWorkspaceLabels(
            state.workspace
        );

        /*
         * Loader
         */
        window.setTimeout(
            hideLoader,
            180
        );

        state.initialized =
            true;

        announceToScreenReader(
            "Veltrix application loaded"
        );
    }

    /* ============================================================
       DOM READY
       ============================================================ */

    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            initializeApp,
            {
                once: true
            }
        );
    } else {
        initializeApp();
    }

    /* ============================================================
       PAGE SHOW
       ============================================================ */

    window.addEventListener(
        "pageshow",
        event => {
            if (
                event.persisted
            ) {
                applyTheme(
                    state.theme,
                    false
                );

                updateLanguageUI();

                applyLanguageDirection(
                    state.language
                );
            }
        }
    );

    /* ============================================================
       PUBLIC VELTRIX API
       ============================================================ */

    /*
     * Expose a small, controlled API so additional pages/files
     * can communicate with the core without duplicating logic.
     */
    window.Veltrix = {
        version: "1.0.0",

        config: CONFIG,

        state,

        theme: {
            get: () =>
                state.theme,

            set: theme =>
                applyTheme(theme),

            toggle: () =>
                toggleTheme()
        },

        language: {
            get: () =>
                state.language,

            set: code =>
                setLanguage(code),

            list: () =>
                CONFIG.languages.map(
                    language => ({
                        ...language
                    })
                )
        },

        sidebar: {
            toggle: () =>
                toggleSidebarCollapse(),

            mobile: force =>
                toggleMobileSidebar(
                    force
                )
        },

        modal: {
            open: name =>
                openModal(name),

            close: name =>
                closeModal(name),

            closeAll: () =>
                closeAllModals()
        },

        toast: (
            message,
            type,
            duration
        ) =>
            showToast(
                message,
                type,
                duration
            ),

        search: query =>
            searchItems(query),

        navigate: (
            url,
            title
        ) =>
            navigateTo(
                url,
                title
            ),

        notify: notification => {
            const item = {
                id:
                    Date.now(),
                icon:
                    notification.icon ||
                    "fa-solid fa-bell",
                title:
                    notification.title ||
                    "New notification",
                text:
                    notification.text ||
                    "",
                time:
                    notification.time ||
                    "Just now",
                unread:
                    notification.unread !==
                    false
            };

            state.notifications.unshift(
                item
            );

            saveNotifications();
            renderNotifications();

            showToast(
                item.title,
                "info"
            );

            return item;
        },

        confirm: options =>
            openConfirmation(
                options
            ),

        copy: text =>
            copyToClipboard(text),

        refreshCharts: () => {
            createRevenueChart();
            createActivityChart();
        },

        refreshUI: () => {
            cacheDOM();

            applyTheme(
                state.theme,
                false
            );

            applySidebarState();

            applyLanguageDirection(
                state.language
            );

            updateLanguageUI();

            updateThemeControls();

            renderNotifications();

            updateNotificationCount();
        }
    };

})();

/* ================================================================
   END OF VELTRIX JS
   ================================================================ */
