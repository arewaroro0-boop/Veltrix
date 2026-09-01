/* ============================================================
   VELTRIX
   Business Management Platform
   ------------------------------------------------------------
   Main Application Controller
   Version: 2.0.0
   ------------------------------------------------------------
   Architecture:
   - Central configuration
   - Central language system
   - Google Translate manager
   - Persistent application state
   - Navigation
   - Sidebar
   - Topbar
   - Modals
   - Notifications
   - Search
   - Charts
   - Calculators
   - Responsive behavior
   - Accessibility
   - Dynamic DOM observation
   ============================================================ */

"use strict";

/* ============================================================
   01. GLOBAL CONFIGURATION
   ============================================================ */

const CONFIG = {

    appName: "Veltrix",

    version: "2.0.0",

    storage: {
        theme: "veltrix-theme",
        language: "veltrix-language",
        sidebar: "veltrix-sidebar",
        workspace: "veltrix-workspace",
        notifications: "veltrix-notifications",
        searchHistory: "veltrix-search-history",
        favorites: "veltrix-favorites",
        settings: "veltrix-settings"
    },

    cookie: {
        googleTranslate: "googtrans",
        maxAge: 31536000
    },

    breakpoints: {
        mobile: 767,
        tablet: 1024,
        desktop: 1200
    },

    defaults: {
        theme: "dark",
        language: "en",
        workspace: "main",
        sidebarCollapsed: false
    },

    /* --------------------------------------------------------
       IMPORTANT:
       This is the ONLY authoritative language list.
       Settings, Topbar and Translation Manager all use it.
       -------------------------------------------------------- */

    languages: [
        {
            code: "en",
            googleCode: "en",
            name: "English",
            native: "English",
            rtl: false
        },
        {
            code: "fr",
            googleCode: "fr",
            name: "French",
            native: "Français",
            rtl: false
        },
        {
            code: "es",
            googleCode: "es",
            name: "Spanish",
            native: "Español",
            rtl: false
        },
        {
            code: "it",
            googleCode: "it",
            name: "Italian",
            native: "Italiano",
            rtl: false
        },
        {
            code: "de",
            googleCode: "de",
            name: "German",
            native: "Deutsch",
            rtl: false
        },
        {
            code: "pt",
            googleCode: "pt",
            name: "Portuguese",
            native: "Português",
            rtl: false
        },
        {
            code: "nl",
            googleCode: "nl",
            name: "Dutch",
            native: "Nederlands",
            rtl: false
        },
        {
            code: "ru",
            googleCode: "ru",
            name: "Russian",
            native: "Русский",
            rtl: false
        },
        {
            code: "tr",
            googleCode: "tr",
            name: "Turkish",
            native: "Türkçe",
            rtl: false
        },
        {
            code: "ar",
            googleCode: "ar",
            name: "Arabic",
            native: "العربية",
            rtl: true
        },
        {
            code: "zh",
            googleCode: "zh-CN",
            name: "Chinese",
            native: "中文",
            rtl: false
        },
        {
            code: "ja",
            googleCode: "ja",
            name: "Japanese",
            native: "日本語",
            rtl: false
        },
        {
            code: "ko",
            googleCode: "ko",
            name: "Korean",
            native: "한국어",
            rtl: false
        },
        {
            code: "hi",
            googleCode: "hi",
            name: "Hindi",
            native: "हिन्दी",
            rtl: false
        },
        {
            code: "id",
            googleCode: "id",
            name: "Indonesian",
            native: "Bahasa Indonesia",
            rtl: false
        },
        {
            code: "vi",
            googleCode: "vi",
            name: "Vietnamese",
            native: "Tiếng Việt",
            rtl: false
        },
        {
            code: "pl",
            googleCode: "pl",
            name: "Polish",
            native: "Polski",
            rtl: false
        },
        {
            code: "sv",
            googleCode: "sv",
            name: "Swedish",
            native: "Svenska",
            rtl: false
        },
        {
            code: "el",
            googleCode: "el",
            name: "Greek",
            native: "Ελληνικά",
            rtl: false
        },
        {
            code: "cs",
            googleCode: "cs",
            name: "Czech",
            native: "Čeština",
            rtl: false
        },
        {
            code: "da",
            googleCode: "da",
            name: "Danish",
            native: "Dansk",
            rtl: false
        }
    ],

    animation: {
        duration: 350,
        toastDuration: 3200,
        loaderDuration: 500
    },

    search: {
        minimumCharacters: 1,
        maximumResults: 10
    },

    charts: {
        defaultHeight: 320
    }
};


/* ============================================================
   02. APPLICATION STATE
   ============================================================ */

const state = {

    initialized: false,

    theme: CONFIG.defaults.theme,

    language: CONFIG.defaults.language,

    workspace: CONFIG.defaults.workspace,

    sidebarCollapsed: CONFIG.defaults.sidebarCollapsed,

    mobileSidebarOpen: false,

    activeDropdown: null,

    activeModal: null,

    searchOpen: false,

    quickCreateOpen: false,

    googleTranslateReady: false,

    googleTranslateLoading: false,

    googleTranslateAttempts: 0,

    googleTranslateApplying: false,

    googleTranslateRetryTimer: null,

    translationObserver: null,

    translationDebounceTimer: null,

    lastTranslatedLanguage: null,

    isOnline: navigator.onLine,

    reducedMotion: false,

    notifications: [],

    searchHistory: [],

    favorites: [],

    charts: {},

    resizeTimer: null,

    lastNavigation: null
};


/* ============================================================
   03. DOM CACHE
   ============================================================ */

const DOM = {

    body: null,

    html: null,

    app: null,

    loader: null,

    sidebar: null,

    sidebarOverlay: null,

    sidebarToggle: null,

    mobileMenuButton: null,

    topbar: null,

    main: null,

    toastContainer: null,

    modalContainer: null,

    globalSearchModal: null,

    quickCreateModal: null,

    upgradeModal: null,

    confirmationModal: null,

    notificationButton: null,

    notificationDropdown: null,

    languageButton: null,

    languageDropdown: null,

    themeButton: null,

    searchInput: null,

    workspaceButton: null,

    workspaceDropdown: null,

    backToTop: null,

    offlineIndicator: null,

    liveRegion: null
};


/* ============================================================
   04. SMALL HELPERS
   ============================================================ */

function $(selector, parent = document) {
    return parent.querySelector(selector);
}

function $$(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
}

function exists(selector, parent = document) {
    return Boolean($(selector, parent));
}

function isElement(element) {
    return element instanceof Element;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function debounce(callback, delay = 250) {

    let timer = null;

    return function (...args) {

        clearTimeout(timer);

        timer = window.setTimeout(() => {
            callback.apply(this, args);
        }, delay);
    };
}

function throttle(callback, delay = 100) {

    let lastTime = 0;

    return function (...args) {

        const now = Date.now();

        if (now - lastTime < delay) {
            return;
        }

        lastTime = now;

        callback.apply(this, args);
    };
}

function safeJSONParse(value, fallback = null) {

    if (!value) {
        return fallback;
    }

    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}


/* ============================================================
   05. STORAGE MANAGER
   ============================================================ */

const StorageManager = {

    get(key, fallback = null) {

        try {

            const value = localStorage.getItem(key);

            return value === null ? fallback : value;

        } catch {
            return fallback;
        }
    },

    set(key, value) {

        try {

            localStorage.setItem(key, String(value));

            return true;

        } catch {
            return false;
        }
    },

    remove(key) {

        try {

            localStorage.removeItem(key);

            return true;

        } catch {
            return false;
        }
    },

    getJSON(key, fallback = null) {

        const value = this.get(key);

        return safeJSONParse(value, fallback);
    },

    setJSON(key, value) {

        try {

            return this.set(key, JSON.stringify(value));

        } catch {
            return false;
        }
    }
};


/* ============================================================
   06. COOKIE MANAGER
   ============================================================ */

const CookieManager = {

    set(name, value, options = {}) {

        try {

            let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

            cookie += `; path=${options.path || "/"}`;

            if (options.maxAge !== undefined) {
                cookie += `; max-age=${options.maxAge}`;
            }

            if (options.sameSite) {
                cookie += `; samesite=${options.sameSite}`;
            } else {
                cookie += "; samesite=lax";
            }

            document.cookie = cookie;

            return true;

        } catch {
            return false;
        }
    },

    get(name) {

        try {

            const encodedName = `${encodeURIComponent(name)}=`;

            const cookies = document.cookie.split(";");

            for (const cookie of cookies) {

                const trimmed = cookie.trim();

                if (trimmed.indexOf(encodedName) === 0) {

                    return decodeURIComponent(
                        trimmed.substring(encodedName.length)
                    );
                }
            }

            return null;

        } catch {
            return null;
        }
    },

    remove(name) {

        try {

            document.cookie =
                `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;

            return true;

        } catch {
            return false;
        }
    }
};


/* ============================================================
   07. LANGUAGE HELPERS
   ============================================================ */

function getLanguage(code) {

    return CONFIG.languages.find(
        language => language.code === code
    ) || null;
}

function isSupportedLanguage(code) {

    return Boolean(getLanguage(code));
}

function getLanguageFromStorage() {

    const saved = StorageManager.get(
        CONFIG.storage.language,
        null
    );

    if (saved && isSupportedLanguage(saved)) {
        return saved;
    }

    return null;
}

function getLanguageFromGoogleCookie() {

    const cookie = CookieManager.get(
        CONFIG.cookie.googleTranslate
    );

    if (!cookie) {
        return null;
    }

    /*
       Google Translate normally stores:

       /en/fr
       /en/ar
       /en/zh-CN

       We only need the destination language.
    */

    const parts = cookie.split("/");

    if (parts.length < 3) {
        return null;
    }

    let googleCode = parts[2];

    const found = CONFIG.languages.find(
        language => language.googleCode === googleCode
    );

    return found ? found.code : null;
}

function resolveInitialLanguage() {

    const storedLanguage = getLanguageFromStorage();

    if (storedLanguage) {
        return storedLanguage;
    }

    const googleLanguage = getLanguageFromGoogleCookie();

    if (googleLanguage) {
        return googleLanguage;
    }

    return CONFIG.defaults.language;
}


/* ============================================================
   08. RTL / DOCUMENT LANGUAGE
   ============================================================ */

function applyLanguageDirection(code) {

    const language = getLanguage(code);

    if (!language) {
        return;
    }

    document.documentElement.lang = language.code;

    document.documentElement.dir =
        language.rtl ? "rtl" : "ltr";

    if (DOM.body) {

        DOM.body.classList.toggle(
            "rtl-layout",
            language.rtl
        );

        DOM.body.classList.toggle(
            "ltr-layout",
            !language.rtl
        );
    }

    document.documentElement.classList.toggle(
        "is-rtl",
        language.rtl
    );

    document.documentElement.classList.toggle(
        "is-ltr",
        !language.rtl
    );
}


/* ============================================================
   09. CENTRAL TRANSLATION MANAGER
   ============================================================ */

const TranslationManager = {

    initialized: false,

    observer: null,

    applying: false,

    lastRequestedLanguage: null,

    initialize() {

        if (this.initialized) {
            return;
        }

        this.initialized = true;

        state.language = resolveInitialLanguage();

        StorageManager.set(
            CONFIG.storage.language,
            state.language
        );

        applyLanguageDirection(state.language);

        this.injectGoogleContainer();

        this.injectGoogleStyles();

        this.installObserver();

        this.loadGoogleTranslate();

        this.populateLanguageControls();

        this.updateLanguageControls();

        /*
           Put Google Translate cookie in place immediately.
           This is especially important when navigating to
           another HTML page.
        */

        this.persistGoogleLanguageCookie(
            state.language
        );
    },


    getCurrentLanguage() {

        return getLanguage(state.language);
    },


    setLanguage(code, options = {}) {

        if (!isSupportedLanguage(code)) {
            console.warn(
                `Veltrix: Unsupported language "${code}".`
            );
            return false;
        }

        const language = getLanguage(code);

        if (!language) {
            return false;
        }

        const changed =
            state.language !== language.code;

        state.language = language.code;

        this.lastRequestedLanguage = language.code;

        StorageManager.set(
            CONFIG.storage.language,
            language.code
        );

        applyLanguageDirection(language.code);

        this.persistGoogleLanguageCookie(
            language.code
        );

        this.updateLanguageControls();

        /*
           If the user selected English,
           remove Google Translate state.
        */

        if (language.code === "en") {

            this.resetGoogleTranslate();

        } else {

            this.applyGoogleLanguage(
                language.code
            );
        }

        if (!options.silent && changed) {

            showToast(
                language.native,
                "success",
                1800
            );

            announceToScreenReader(
                `Language changed to ${language.native}`
            );
        }

        /*
           Re-apply after a small delay because Google Translate
           may not have created its select element yet.
        */

        this.scheduleGoogleApply(
            language.code,
            150
        );

        this.scheduleGoogleApply(
            language.code,
            700
        );

        this.scheduleGoogleApply(
            language.code,
            1600
        );

        return true;
    },


    persistGoogleLanguageCookie(code) {

        const language = getLanguage(code);

        if (!language) {
            return;
        }

        if (code === "en") {

            this.clearGoogleLanguageCookie();

            return;
        }

        const value =
            `/en/${language.googleCode}`;

        CookieManager.set(
            CONFIG.cookie.googleTranslate,
            value,
            {
                path: "/",
                maxAge: CONFIG.cookie.maxAge,
                sameSite: "lax"
            }
        );
    },


    clearGoogleLanguageCookie() {

        CookieManager.remove(
            CONFIG.cookie.googleTranslate
        );

        /*
           Extra deletion attempt for browsers that
           retain an older cookie representation.
        */

        try {

            document.cookie =
                "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";

            document.cookie =
                `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${location.hostname};`;

        } catch {
            /* ignored */
        }
    },


    injectGoogleContainer() {

        if (document.getElementById(
            "google_translate_element"
        )) {
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
        container.style.left = "-10000px";
        container.style.top = "0";
        container.style.width = "1px";
        container.style.height = "1px";
        container.style.overflow = "hidden";
        container.style.opacity = "0";
        container.style.pointerEvents = "none";
        container.style.zIndex = "-1";

        document.body.appendChild(
            container
        );
    },


    injectGoogleStyles() {

        if (document.getElementById(
            "veltrix-google-translate-styles"
        )) {
            return;
        }

        const style =
            document.createElement("style");

        style.id =
            "veltrix-google-translate-styles";

        style.textContent = `
            .goog-te-banner-frame.skiptranslate {
                display: none !important;
            }

            body {
                top: 0 !important;
            }

            .goog-te-gadget {
                font-size: 0 !important;
                height: 0 !important;
                overflow: hidden !important;
            }

            .goog-te-gadget-icon {
                display: none !important;
            }

            .goog-tooltip {
                display: none !important;
            }

            .goog-text-highlight {
                background: transparent !important;
                box-shadow: none !important;
            }

            #google_translate_element,
            .goog-te-spinner-pos {
                display: none !important;
                visibility: hidden !important;
                width: 1px !important;
                height: 1px !important;
            }

            iframe.goog-te-menu-frame {
                z-index: 2147483647 !important;
            }
        `;

        document.head.appendChild(style);
    },


    loadGoogleTranslate() {

        if (
            window.google &&
            window.google.translate
        ) {

            this.initializeGoogleWidget();

            return;
        }

        if (state.googleTranslateLoading) {
            return;
        }

        state.googleTranslateLoading = true;

        window.googleTranslateElementInit = () => {

            state.googleTranslateLoading = false;

            this.initializeGoogleWidget();
        };

        const existingScript =
            document.getElementById(
                "veltrix-google-translate-script"
            );

        if (existingScript) {
            return;
        }

        const script =
            document.createElement("script");

        script.id =
            "veltrix-google-translate-script";

        script.src =
            "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

        script.async = true;

        script.onerror = () => {

            state.googleTranslateLoading = false;

            this.retryGoogleTranslate();
        };

        document.head.appendChild(script);
    },


    initializeGoogleWidget() {

        if (
            !window.google ||
            !window.google.translate
        ) {

            this.retryGoogleTranslate();

            return;
        }

        const container =
            document.getElementById(
                "google_translate_element"
            );

        if (!container) {
            return;
        }

        /*
           Prevent duplicate widget creation.
        */

        if (
            container.querySelector(
                ".goog-te-combo"
            )
        ) {

            state.googleTranslateReady = true;

            this.applyGoogleLanguage(
                state.language
            );

            return;
        }

        try {

            const languages =
                CONFIG.languages
                    .map(language => language.googleCode)
                    .filter(Boolean)
                    .join(",");

            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "en",

                    includedLanguages: languages,

                    autoDisplay: false,

                    multilanguagePage: true,

                    layout:
                        window.google.translate.TranslateElement
                            .InlineLayout
                            .SIMPLE
                },
                "google_translate_element"
            );

            state.googleTranslateReady = true;

            state.googleTranslateAttempts = 0;

            this.waitForGoogleSelect();

        } catch (error) {

            console.warn(
                "Veltrix: Google Translate initialization failed.",
                error
            );

            this.retryGoogleTranslate();
        }
    },


    waitForGoogleSelect() {

        let attempts = 0;

        const maxAttempts = 30;

        const check = () => {

            const select =
                document.querySelector(
                    ".goog-te-combo"
                );

            if (select) {

                state.googleTranslateReady = true;

                this.applyGoogleLanguage(
                    state.language
                );

                return;
            }

            attempts++;

            if (attempts >= maxAttempts) {

                this.retryGoogleTranslate();

                return;
            }

            window.setTimeout(
                check,
                200
            );
        };

        check();
    },


    applyGoogleLanguage(code) {

        if (code === "en") {
            this.resetGoogleTranslate();
            return;
        }

        const language =
            getLanguage(code);

        if (!language) {
            return;
        }

        const select =
            document.querySelector(
                ".goog-te-combo"
            );

        if (!select) {

            this.retryGoogleTranslate();

            return;
        }

        if (this.applying) {
            return;
        }

        this.applying = true;

        try {

            const target =
                language.googleCode;

            /*
               Only dispatch if needed.
            */

            if (select.value !== target) {

                select.value = target;

                select.dispatchEvent(
                    new Event(
                        "change",
                        {
                            bubbles: true
                        }
                    )
                );
            }

            state.googleTranslateReady = true;

            state.lastTranslatedLanguage =
                code;

        } catch (error) {

            console.warn(
                "Veltrix: Unable to apply Google Translate language.",
                error
            );

        } finally {

            window.setTimeout(() => {
                this.applying = false;
            }, 250);
        }
    },


    resetGoogleTranslate() {

        this.clearGoogleLanguageCookie();

        const select =
            document.querySelector(
                ".goog-te-combo"
            );

        if (!select) {
            return;
        }

        try {

            if (select.value !== "en") {

                this.applying = true;

                select.value = "en";

                select.dispatchEvent(
                    new Event(
                        "change",
                        {
                            bubbles: true
                        }
                    )
                );

                window.setTimeout(() => {
                    this.applying = false;
                }, 400);
            }

        } catch {
            this.applying = false;
        }
    },


    scheduleGoogleApply(
        code = state.language,
        delay = 300
    ) {

        window.setTimeout(() => {

            if (
                code !== state.language
            ) {
                return;
            }

            this.applyGoogleLanguage(code);

        }, delay);
    },


    retryGoogleTranslate() {

        clearTimeout(
            state.googleTranslateRetryTimer
        );

        state.googleTranslateAttempts++;

        const attempt =
            state.googleTranslateAttempts;

        if (attempt > 8) {

            console.warn(
                "Veltrix: Google Translate retry limit reached."
            );

            return;
        }

        const delay =
            Math.min(
                1000 * Math.pow(1.5, attempt - 1),
                10000
            );

        state.googleTranslateRetryTimer =
            window.setTimeout(() => {

                if (
                    !window.google ||
                    !window.google.translate
                ) {

                    state.googleTranslateLoading =
                        false;

                    this.loadGoogleTranslate();

                    return;
                }

                this.initializeGoogleWidget();

            }, delay);
    },


    installObserver() {

        if (this.observer) {
            return;
        }

        /*
           Watch for dynamically created content.

           This is intentionally debounced so that chart
           rendering, tables and modals don't cause dozens
           of translation calls.
        */

        this.observer =
            new MutationObserver(
                mutations => {

                    let relevant = false;

                    for (const mutation of mutations) {

                        if (
                            mutation.type === "childList" &&
                            mutation.addedNodes.length
                        ) {

                            relevant = true;

                            break;
                        }
                    }

                    if (!relevant) {
                        return;
                    }

                    clearTimeout(
                        state.translationDebounceTimer
                    );

                    state.translationDebounceTimer =
                        window.setTimeout(() => {

                            if (
                                state.language !== "en"
                            ) {

                                this.applyGoogleLanguage(
                                    state.language
                                );
                            }

                        }, 500);
                }
            );

        this.observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );

        state.translationObserver =
            this.observer;
    },


    populateLanguageControls() {

        /*
           Topbar language menu
        */

        const menus = $$(
            "[data-language-menu]"
        );

        menus.forEach(menu => {

            /*
               We don't overwrite a developer's custom
               wrapper. We only rebuild actual language
               options.
            */

            const existing =
                menu.querySelectorAll(
                    "[data-language]"
                );

            if (existing.length === 21) {
                return;
            }

            existing.forEach(item => {
                item.remove();
            });

            const fragment =
                document.createDocumentFragment();

            CONFIG.languages.forEach(
                language => {

                    const button =
                        document.createElement("button");

                    button.type = "button";

                    button.className =
                        "language-option";

                    button.dataset.language =
                        language.code;

                    button.setAttribute(
                        "role",
                        "option"
                    );

                    button.setAttribute(
                        "data-google-language",
                        language.googleCode
                    );

                    button.innerHTML = `
                        <span class="language-option-native">
                            ${escapeHTML(language.native)}
                        </span>
                        <span class="language-option-name">
                            ${escapeHTML(language.name)}
                        </span>
                    `;

                    fragment.appendChild(
                        button
                    );
                }
            );

            menu.appendChild(fragment);
        });


        /*
           Settings page language selectors.

           Supports:
           [data-settings-language]
           [data-language-select]
           select[data-language]
        */

        const selectors = $$(
            "[data-settings-language], [data-language-select]"
        );

        selectors.forEach(control => {

            if (
                control.tagName === "SELECT"
            ) {

                this.populateSelect(control);

            } else {

                this.populateSettingsContainer(
                    control
                );
            }
        });
    },


    populateSelect(select) {

        const current =
            select.value || state.language;

        select.innerHTML = "";

        CONFIG.languages.forEach(
            language => {

                const option =
                    document.createElement("option");

                option.value =
                    language.code;

                option.textContent =
                    language.native;

                select.appendChild(option);
            }
        );

        select.value =
            isSupportedLanguage(current)
                ? current
                : state.language;
    },


    populateSettingsContainer(container) {

        const options =
            container.querySelectorAll(
                "[data-language]"
            );

        if (options.length >= 21) {
            return;
        }

        CONFIG.languages.forEach(
            language => {

                if (
                    container.querySelector(
                        `[data-language="${language.code}"]`
                    )
                ) {
                    return;
                }

                const button =
                    document.createElement("button");

                button.type = "button";

                button.dataset.language =
                    language.code;

                button.className =
                    "settings-language-option";

                button.innerHTML = `
                    <span>${escapeHTML(language.native)}</span>
                    <small>${escapeHTML(language.name)}</small>
                `;

                container.appendChild(
                    button
                );
            }
        );
    },


    updateLanguageControls() {

        const current =
            getLanguage(state.language);

        if (!current) {
            return;
        }

        /*
           Update buttons
        */

        $$(
            "[data-language]"
        ).forEach(element => {

            const active =
                element.dataset.language ===
                current.code;

            element.classList.toggle(
                "active",
                active
            );

            element.setAttribute(
                "aria-selected",
                String(active)
            );
        });


        /*
           Update visible labels
        */

        $$(
            "[data-current-language]"
        ).forEach(element => {

            element.textContent =
                current.native;
        });


        /*
           Update SELECT controls
        */

        $$(
            "[data-settings-language], [data-language-select]"
        ).forEach(control => {

            if (
                control.tagName === "SELECT"
            ) {

                control.value =
                    current.code;
            }
        });
    }
};


/* ============================================================
   10. HTML ESCAPING
   ============================================================ */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* ============================================================
   11. THEME MANAGER
   ============================================================ */

const ThemeManager = {

    initialize() {

        const saved =
            StorageManager.get(
                CONFIG.storage.theme,
                CONFIG.defaults.theme
            );

        this.set(
            saved === "light"
                ? "light"
                : "dark",
            true
        );
    },


    set(theme, silent = false) {

        if (
            theme !== "dark" &&
            theme !== "light"
        ) {
            theme = "dark";
        }

        state.theme = theme;

        document.documentElement.dataset.theme =
            theme;

        if (DOM.body) {

            DOM.body.dataset.theme =
                theme;

            DOM.body.classList.toggle(
                "theme-dark",
                theme === "dark"
            );

            DOM.body.classList.toggle(
                "theme-light",
                theme === "light"
            );
        }

        StorageManager.set(
            CONFIG.storage.theme,
            theme
        );

        updateThemeButton();

        if (!silent) {

            showToast(
                theme === "dark"
                    ? "Dark mode"
                    : "Light mode",
                "success"
            );
        }

        window.dispatchEvent(
            new CustomEvent(
                "veltrix:themechange",
                {
                    detail: {
                        theme
                    }
                }
            )
        );
    },


    toggle() {

        this.set(
            state.theme === "dark"
                ? "light"
                : "dark"
        );
    }
};


function updateThemeButton() {

    if (!DOM.themeButton) {
        return;
    }

    const icon =
        DOM.themeButton.querySelector(
           ("i")
        );

    if (icon) {

        icon.className =
            state.theme === "dark"
                ? "fa-solid fa-sun"
                : "fa-solid fa-moon";
    }

    DOM.themeButton.setAttribute(
        "aria-label",
        state.theme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode"
    );
}


/* ============================================================
   12. DOM CACHE INITIALIZATION
   ============================================================ */

function cacheDOM() {

    DOM.html =
        document.documentElement;

    DOM.body =
        document.body;

    DOM.app =
        $("#veltrix-app");

    DOM.loader =
        $("#page-loader, .page-loader");

    DOM.sidebar =
        $("#sidebar, .app-sidebar, .sidebar");

    DOM.sidebarOverlay =
        $("#sidebar-overlay, .sidebar-overlay, .mobile-overlay");

    DOM.sidebarToggle =
        $(
            "[data-sidebar-toggle], #sidebarToggle, .sidebar-toggle"
        );

    DOM.mobileMenuButton =
        $(
            "[data-mobile-menu], #mobileMenuButton, .mobile-menu-button"
        );

    DOM.topbar =
        $(".topbar, .app-topbar");

    DOM.main =
        $(".main-content, .app-main, main");

    DOM.toastContainer =
        $("#toast-container, .toast-container");

    DOM.modalContainer =
        $("#modal-container, .modal-container");

    DOM.globalSearchModal =
        $("#global-search-modal, #globalSearchModal");

    DOM.quickCreateModal =
        $("#quick-create-modal, #quickCreateModal");

    DOM.upgradeModal =
        $("#upgrade-modal, #upgradeModal");

    DOM.confirmationModal =
        $("#confirmation-modal, #confirmationModal");

    DOM.notificationButton =
        $(
            "[data-notifications], #notificationButton, .notification-button"
        );

    DOM.notificationDropdown =
        $(
            "[data-notification-dropdown], #notificationDropdown"
        );

    DOM.languageButton =
        $(
            "[data-language-button], #languageButton, .language-button"
        );

    DOM.languageDropdown =
        $(
            "[data-language-dropdown], #languageDropdown"
        );

    DOM.themeButton =
        $(
            "[data-theme-toggle], #themeToggle, .theme-toggle"
        );

    DOM.searchInput =
        $(
            "[data-global-search], #globalSearch, .global-search-input"
        );

    DOM.workspaceButton =
        $(
            "[data-workspace-button], #workspaceButton"
        );

    DOM.workspaceDropdown =
        $(
            "[data-workspace-dropdown], #workspaceDropdown"
        );

    DOM.backToTop =
        $(
            "[data-back-to-top], #backToTop"
        );

    DOM.offlineIndicator =
        $(
            "[data-offline-indicator], #offlineIndicator"
        );

    DOM.liveRegion =
        $(
            "[aria-live='polite'], #liveRegion"
        );
}


/* ============================================================
   13. SIDEBAR MANAGER
   ============================================================ */

const SidebarManager = {

    initialize() {

        const saved =
            StorageManager.get(
                CONFIG.storage.sidebar,
                "false"
            );

        state.sidebarCollapsed =
            saved === "true";

        this.applyDesktopState();

        this.bind();
    },


    bind() {

        document.addEventListener(
            "click",
            event => {

                const toggle =
                    event.target.closest(
                        "[data-sidebar-toggle], #sidebarToggle, .sidebar-toggle"
                    );

                if (toggle) {

                    event.preventDefault();

                    this.toggle();

                    return;
                }

                const mobile =
                    event.target.closest(
                        "[data-mobile-menu], #mobileMenuButton, .mobile-menu-button"
                    );

                if (mobile) {

                    event.preventDefault();

                    this.toggleMobile();

                    return;
                }

                if (
                    DOM.sidebarOverlay &&
                    event.target === DOM.sidebarOverlay
                ) {

                    this.closeMobile();
                }
            }
        );
    },


    toggle() {

        if (
            window.innerWidth <=
            CONFIG.breakpoints.mobile
        ) {

            this.toggleMobile();

            return;
        }

        state.sidebarCollapsed =
            !state.sidebarCollapsed;

        StorageManager.set(
            CONFIG.storage.sidebar,
            state.sidebarCollapsed
        );

        this.applyDesktopState();
    },


    applyDesktopState() {

        if (!DOM.body) {
            return;
        }

        DOM.body.classList.toggle(
            "sidebar-collapsed",
            state.sidebarCollapsed
        );

        if (DOM.sidebar) {

            DOM.sidebar.classList.toggle(
                "is-collapsed",
                state.sidebarCollapsed
            );
        }
    },


    toggleMobile() {

        if (state.mobileSidebarOpen) {

            this.closeMobile();

        } else {

            this.openMobile();
        }
    },


    openMobile() {

        state.mobileSidebarOpen = true;

        DOM.body.classList.add(
            "sidebar-mobile-open"
        );

        DOM.sidebar?.classList.add(
            "is-open"
        );

        DOM.sidebarOverlay?.classList.add(
            "is-visible"
        );

        document.body.style.overflow =
            "hidden";
    },


    closeMobile() {

        state.mobileSidebarOpen = false;

        DOM.body.classList.remove(
            "sidebar-mobile-open"
        );

        DOM.sidebar?.classList.remove(
            "is-open"
        );

        DOM.sidebarOverlay?.classList.remove(
            "is-visible"
        );

        document.body.style.overflow =
            "";
    }
};


/* ============================================================
   14. DROPDOWN MANAGER
   ============================================================ */

const DropdownManager = {

    open(dropdown, button = null) {

        if (!dropdown) {
            return;
        }

        this.closeAll(dropdown);

        dropdown.classList.add(
            "is-open"
        );

        dropdown.setAttribute(
            "aria-hidden",
            "false"
        );

        if (button) {

            button.classList.add(
                "is-active"
            );

            button.setAttribute(
                "aria-expanded",
                "true"
            );
        }

        state.activeDropdown =
            dropdown;
    },


    close(dropdown) {

        if (!dropdown) {
            return;
        }

        dropdown.classList.remove(
            "is-open"
        );

        dropdown.setAttribute(
            "aria-hidden",
            "true"
        );

        const button =
            document.querySelector(
                `[aria-controls="${dropdown.id}"]`
            );

        if (button) {

            button.classList.remove(
                "is-active"
            );

            button.setAttribute(
                "aria-expanded",
                "false"
            );
        }

        if (
            state.activeDropdown ===
            dropdown
        ) {

            state.activeDropdown = null;
        }
    },


    closeAll(exception = null) {

        $$(
            ".dropdown.is-open, .topbar-dropdown.is-open, .menu-dropdown.is-open, [data-dropdown].is-open"
        ).forEach(dropdown => {

            if (dropdown !== exception) {

                this.close(dropdown);
            }
        });

        if (!exception) {

            state.activeDropdown = null;
        }
    },


    toggle(dropdown, button = null) {

        if (!dropdown) {
            return;
        }

        if (
            dropdown.classList.contains(
                "is-open"
            )
        ) {

            this.close(dropdown);

        } else {

            this.open(
                dropdown,
                button
            );
        }
    }
};


/* ============================================================
   15. MODAL MANAGER
   ============================================================ */

const ModalManager = {

    open(modal) {

        if (!modal) {
            return;
        }

        this.closeAll(modal);

        modal.classList.add(
            "is-open"
        );

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );

        state.activeModal =
            modal;

        const focusable =
            modal.querySelector(
                "button, input, select, textarea, a[href]"
            );

        if (focusable) {

            window.setTimeout(
                () => focusable.focus(),
                50
            );
        }
    },


    close(modal) {

        if (!modal) {
            return;
        }

        modal.classList.remove(
            "is-open"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        if (
            state.activeModal ===
            modal
        ) {

            state.activeModal = null;

            document.body.classList.remove(
                "modal-open"
            );
        }
    },


    closeAll(exception = null) {

        $$(
            ".modal.is-open, .app-modal.is-open"
        ).forEach(modal => {

            if (modal !== exception) {

                this.close(modal);
            }
        });

        if (!exception) {

            document.body.classList.remove(
                "modal-open"
            );

            state.activeModal = null;
        }
    }
};


/* ============================================================
   16. TOAST SYSTEM
   ============================================================ */

function ensureToastContainer() {

    if (DOM.toastContainer) {
        return DOM.toastContainer;
    }

    const container =
        document.createElement("div");

    container.id =
        "toast-container";

    container.className =
        "toast-container";

    container.setAttribute(
        "aria-live",
        "polite"
    );

    document.body.appendChild(
        container
    );

    DOM.toastContainer =
        container;

    return container;
}


function showToast(
    message,
    type = "info",
    duration = CONFIG.animation.toastDuration
) {

    const container =
        ensureToastContainer();

    const toast =
        document.createElement("div");

    toast.className =
        `toast toast-${type}`;

    toast.setAttribute(
        "role",
        "status"
    );

    const icons = {
        success: "fa-circle-check",
        error: "fa-circle-xmark",
        warning: "fa-triangle-exclamation",
        info: "fa-circle-info"
    };

    const icon =
        icons[type] || icons.info;

    toast.innerHTML = `
        <span class="toast-icon">
            <i class="fa-solid ${icon}"></i>
        </span>

        <span class="toast-message">
            ${escapeHTML(message)}
        </span>

        <button
            type="button"
            class="toast-close"
            aria-label="Close notification"
        >
            <i class="fa-solid fa-xmark"></i>
        </button>

        <span class="toast-progress"></span>
    `;

    container.appendChild(
        toast
    );

    requestAnimationFrame(() => {

        toast.classList.add(
            "is-visible"
        );
    });

    const remove = () => {

        toast.classList.remove(
            "is-visible"
        );

        window.setTimeout(
            () => toast.remove(),
            300
        );
    };

    toast.querySelector(
        ".toast-close"
    )?.addEventListener(
        "click",
        remove
    );

    window.setTimeout(
        remove,
        duration
    );
}


/* ============================================================
   17. ACCESSIBILITY
   ============================================================ */

function announceToScreenReader(message) {

    if (!DOM.liveRegion) {

        DOM.liveRegion =
            document.createElement("div");

        DOM.liveRegion.id =
            "veltrix-live-region";

        DOM.liveRegion.className =
            "sr-only";

        DOM.liveRegion.setAttribute(
            "aria-live",
            "polite"
        );

        DOM.liveRegion.setAttribute(
            "aria-atomic",
            "true"
        );

        document.body.appendChild(
            DOM.liveRegion
        );
    }

    DOM.liveRegion.textContent =
        message;

    window.setTimeout(() => {

        if (DOM.liveRegion) {
            DOM.liveRegion.textContent = "";
        }

    }, 1200);
}


/* ============================================================
   18. NAVIGATION
   ============================================================ */

const NavigationManager = {

    initialize() {

        document.addEventListener(
            "click",
            event => {

                const link =
                    event.target.closest(
                        "a[data-page], a[data-nav], [data-navigation]"
                    );

                if (!link) {
                    return;
                }

                const href =
                    link.getAttribute("href");

                /*
                   Let external links work normally.
                */

                if (
                    href &&
                    (
                        href.startsWith("http://") ||
                        href.startsWith("https://") ||
                        href.startsWith("#") ||
                        href.startsWith("mailto:")
                    )
                ) {
                    return;
                }

                const target =
                    link.dataset.page ||
                    link.dataset.nav ||
                    link.dataset.navigation ||
                    href;

                if (!target) {
                    return;
                }

                event.preventDefault();

                this.navigate(
                    target,
                    link
                );
            }
        );

        this.setActiveNavigation();
    },


    navigate(target, source = null) {

        /*
           If the target is a real HTML page,
           preserve language BEFORE navigation.
        */

        const normalized =
            String(target)
                .trim();

        if (!normalized) {
            return;
        }

        state.lastNavigation =
            normalized;

        TranslationManager.persistGoogleLanguageCookie(
            state.language
        );

        StorageManager.set(
            CONFIG.storage.language,
            state.language
        );

        /*
           Internal page navigation.
        */

        if (
            normalized.endsWith(".html") ||
            normalized.includes("/")
        ) {

            this.showNavigationLoading();

            window.location.href =
                normalized;

            return;
        }

        /*
           Hash navigation.
        */

        if (
            normalized.startsWith("#")
        ) {

            const element =
                document.querySelector(
                    normalized
                );

            element?.scrollIntoView({
                behavior:
                    state.reducedMotion
                        ? "auto"
                        : "smooth"
            });

            return;
        }

        /*
           Named sections.
        */

        const element =
            document.getElementById(
                normalized
            );

        if (element) {

            element.scrollIntoView({
                behavior:
                    state.reducedMotion
                        ? "auto"
                        : "smooth"
            });

            return;
        }

        if (source) {

            source.classList.add(
                "navigation-error"
            );

            window.setTimeout(() => {
                source.classList.remove(
                    "navigation-error"
                );
            }, 500);
        }
    },


    showNavigationLoading() {

        DOM.body?.classList.add(
            "navigation-loading"
        );
    },


    setActiveNavigation() {

        const current =
            location.pathname
                .split("/")
                .pop() ||
            "index.html";

        $$(
            "a[data-page], a[data-nav], [data-navigation]"
        ).forEach(link => {

            const href =
                link.getAttribute("href") ||
                link.dataset.page ||
                link.dataset.nav;

            if (!href) {
                return;
            }

            const filename =
                href.split("/")
                    .pop()
                    .split("?")[0];

            const active =
                filename === current ||
                (
                    current === "" &&
                    filename === "index.html"
                );

            link.classList.toggle(
                "active",
                active
            );
        });
    }
};


/* ============================================================
   19. WORKSPACE SYSTEM
   ============================================================ */

const WorkspaceManager = {

    initialize() {

        state.workspace =
            StorageManager.get(
                CONFIG.storage.workspace,
                CONFIG.defaults.workspace
            );

        this.updateUI();
    },


    set(workspace) {

        if (!workspace) {
            return;
        }

        state.workspace =
            workspace;

        StorageManager.set(
            CONFIG.storage.workspace,
            workspace
        );

        this.updateUI();

        showToast(
            "Workspace changed",
            "success"
        );
    },


    updateUI() {

        $$(
            "[data-workspace]"
        ).forEach(item => {

            item.classList.toggle(
                "active",
                item.dataset.workspace ===
                state.workspace
            );
        });

        $$(
            "[data-current-workspace]"
        ).forEach(element => {

            const active =
                document.querySelector(
                    `[data-workspace="${state.workspace}"]`
                );

            if (active) {

                const label =
                    active.querySelector(
                        "[data-workspace-name]"
                    );

                element.textContent =
                    label
                        ? label.textContent
                        : state.workspace;
            }
        });
    }
};


/* ============================================================
   20. NOTIFICATION SYSTEM
   ============================================================ */

const NotificationManager = {

    defaults() {

        return [
            {
                id: 1,
                title: "New order received",
                text: "Order #VL-1048 has been created.",
                type: "order",
                read: false,
                time: "2 min ago"
            },
            {
                id: 2,
                title: "Payment completed",
                text: "A customer completed a payment.",
                type: "payment",
                read: false,
                time: "18 min ago"
            },
            {
                id: 3,
                title: "New customer",
                text: "A new customer joined your workspace.",
                type: "customer",
                read: true,
                time: "1 hour ago"
            }
        ];
    },


    initialize() {

        const saved =
            StorageManager.getJSON(
                CONFIG.storage.notifications,
                null
            );

        state.notifications =
            Array.isArray(saved)
                ? saved
                : this.defaults();

        this.render();

        this.updateCount();
    },


    save() {

        StorageManager.setJSON(
            CONFIG.storage.notifications,
            state.notifications
        );
    },


    unreadCount() {

        return state.notifications.filter(
            item => !item.read
        ).length;
    },


    updateCount() {

        const count =
            this.unreadCount();

        $$(
            "[data-notification-count]"
        ).forEach(element => {

            element.textContent =
                count;

            element.hidden =
                count === 0;
        });
    },


    render() {

        const containers =
            $$(
                "[data-notification-list]"
            );

        containers.forEach(container => {

            container.innerHTML = "";

            if (
                !state.notifications.length
            ) {

                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fa-regular fa-bell-slash"></i>
                        <p>No notifications</p>
                    </div>
                `;

                return;
            }

            state.notifications
                .slice(0, 10)
                .forEach(notification => {

                    const item =
                        document.createElement("button");

                    item.type = "button";

                    item.className =
                        "notification-item";

                    item.dataset.notificationId =
                        notification.id;

                    item.classList.toggle(
                        "unread",
                        !notification.read
                    );

                    item.innerHTML = `
                        <span class="notification-item-icon">
                            <i class="fa-solid fa-bell"></i>
                        </span>

                        <span class="notification-item-content">
                            <strong>
                                ${escapeHTML(notification.title)}
                            </strong>

                            <small>
                                ${escapeHTML(notification.text)}
                            </small>

                            <em>
                                ${escapeHTML(notification.time)}
                            </em>
                        </span>
                    `;

                    container.appendChild(
                        item
                    );
                });
        });

        TranslationManager.scheduleGoogleApply(
            state.language,
            250
        );
    },


    markRead(id) {

        const notification =
            state.notifications.find(
                item => String(item.id) === String(id)
            );

        if (!notification) {
            return;
        }

        notification.read = true;

        this.save();
        this.render();
        this.updateCount();
    },


    markAllRead() {

        state.notifications.forEach(
            notification => {
                notification.read = true;
            }
        );

        this.save();
        this.render();
        this.updateCount();

        showToast(
            "All notifications marked as read",
            "success"
        );
    }
};


/* ============================================================
   21. GLOBAL SEARCH
   ============================================================ */

const SearchManager = {

    initialized: false,

    searchableSelectors: [
        "[data-searchable]",
        "main h1",
        "main h2",
        "main h3",
        "main h4",
        "main p",
        "main td",
        "main th",
        "main .card-title",
        "main .section-title",
        "main .product-name",
        "main .customer-name"
    ],


    initialize() {

        if (this.initialized) {
            return;
        }

        this.initialized = true;

        state.searchHistory =
            StorageManager.getJSON(
                CONFIG.storage.searchHistory,
                []
            );

        this.bind();
    },


    bind() {

        document.addEventListener(
            "input",
            debounce(event => {

                const input =
                    event.target.closest(
                        "[data-global-search], #globalSearch, .global-search-input"
                    );

                if (!input) {
                    return;
                }

                this.search(
                    input.value
                );

            }, 180)
        );

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "/" &&
                    !isTypingTarget(event.target)
                ) {

                    event.preventDefault();

                    this.open();
                }

                if (
                    (event.ctrlKey || event.metaKey) &&
                    event.key.toLowerCase() === "k"
                ) {

                    event.preventDefault();

                    this.open();
                }
            }
        );
    },


    open() {

        if (DOM.globalSearchModal) {

            ModalManager.open(
                DOM.globalSearchModal
            );

            const input =
                DOM.globalSearchModal.querySelector(
                    "input"
                );

            input?.focus();

        } else {

            DOM.searchInput?.focus();
        }

        state.searchOpen = true;
    },


    close() {

        if (DOM.globalSearchModal) {

            ModalManager.close(
                DOM.globalSearchModal
            );
        }

        state.searchOpen = false;
    },


    search(query) {

        const value =
            String(query || "")
                .trim()
                .toLowerCase();

        const resultContainers =
            $$(
                "[data-search-results]"
            );

        if (!value) {

            resultContainers.forEach(
                container => {

                    container.innerHTML = `
                        <div class="empty-state">
                            <i class="fa-solid fa-magnifying-glass"></i>
                            <p>Type something to search.</p>
                        </div>
                    `;
                }
            );

            return;
        }

        const results = [];

        this.searchableSelectors.forEach(
            selector => {

                $$(selector).forEach(
                    element => {

                        if (
                            results.length >=
                            CONFIG.search.maximumResults
                        ) {
                            return;
                        }

                        const text =
                            element.textContent
                                .trim();

                        if (
                            text &&
                            text
                                .toLowerCase()
                                .includes(value)
                        ) {

                            results.push({
                                text,
                                element
                            });
                        }
                    }
                );
            }
        );

        resultContainers.forEach(
            container => {

                container.innerHTML = "";

                if (!results.length) {

                    container.innerHTML = `
                        <div class="empty-state">
                            <i class="fa-regular fa-face-frown"></i>
                            <p>No results found.</p>
                        </div>
                    `;

                    return;
                }

                results.forEach(result => {

                    const button =
                        document.createElement("button");

                    button.type = "button";

                    button.className =
                        "search-result";

                    button.innerHTML = `
                        <i class="fa-solid fa-arrow-right"></i>
                        <span>
                            ${escapeHTML(result.text.slice(0, 120))}
                        </span>
                    `;

                    button.addEventListener(
                        "click",
                        () => {

                            result.element.scrollIntoView({
                                behavior:
                                    state.reducedMotion
                                        ? "auto"
                                        : "smooth",
                                block: "center"
                            });

                            result.element.classList.add(
                                "search-highlight"
                            );

                            window.setTimeout(
                                () => {
                                    result.element.classList.remove(
                                        "search-highlight"
                                    );
                                },
                                1600
                            );

                            this.close();
                        }
                    );

                    container.appendChild(
                        button
                    );
                });
            }
        );
    }
};


function isTypingTarget(element) {

    if (!element) {
        return false;
    }

    const tag =
        element.tagName?.toLowerCase();

    return (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        element.isContentEditable
    );
}


/* ============================================================
   22. QUICK CREATE
   ============================================================ */

const QuickCreateManager = {

    open() {

        if (DOM.quickCreateModal) {

            ModalManager.open(
                DOM.quickCreateModal
            );

            state.quickCreateOpen = true;

            return;
        }

        showToast(
            "Quick Create",
            "info"
        );
    },


    close() {

        if (DOM.quickCreateModal) {

            ModalManager.close(
                DOM.quickCreateModal
            );
        }

        state.quickCreateOpen = false;
    },


    execute(action) {

        if (!action) {
            return;
        }

        this.close();

        switch (action) {

            case "order":
                showToast(
                    "Create order",
                    "info"
                );
                break;

            case "customer":
                showToast(
                    "Create customer",
                    "info"
                );
                break;

            case "product":
                showToast(
                    "Create product",
                    "info"
                );
                break;

            case "invoice":
                showToast(
                    "Create invoice",
                    "info"
                );
                break;

            case "message":
                showToast(
                    "New message",
                    "info"
                );
                break;

            default:
                showToast(
                    "Action created",
                    "success"
                );
        }
    }
};


/* ============================================================
   23. COUNTER ANIMATIONS
   ============================================================ */

function animateCounter(
    element,
    target,
    duration = 1000
) {

    if (!element) {
        return;
    }

    const numericTarget =
        Number(
            String(target)
                .replace(/[^\d.-]/g, "")
        );

    if (!Number.isFinite(numericTarget)) {
        return;
    }

    if (state.reducedMotion) {

        element.textContent =
            formatNumber(numericTarget);

        return;
    }

    const start =
        performance.now();

    const initial =
        Number(
            element.dataset.counterStart || 0
        );

    const tick = now => {

        const progress =
            clamp(
                (now - start) / duration,
                0,
                1
            );

        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );

        const value =
            initial +
            (numericTarget - initial) *
            eased;

        element.textContent =
            formatNumber(value);

        if (progress < 1) {

            requestAnimationFrame(
                tick
            );

        } else {

            element.textContent =
                formatNumber(
                    numericTarget
                );
        }
    };

    requestAnimationFrame(
        tick
    );
}


function formatNumber(value) {

    if (
        Number.isInteger(
            Number(value)
        )
    ) {

        return Number(value)
            .toLocaleString();
    }

    return Number(value)
        .toLocaleString(
            undefined,
            {
                maximumFractionDigits: 1
            }
        );
}


function initializeCounters() {

    $$(
        "[data-counter]"
    ).forEach(element => {

        const target =
            element.dataset.counter;

        animateCounter(
            element,
            target,
            1000
        );
    });
}


/* ============================================================
   24. PROGRESS BARS
   ============================================================ */

function initializeProgressBars() {

    $$(
        "[data-progress]"
    ).forEach(bar => {

        const value =
            clamp(
                Number(
                    bar.dataset.progress
                ) || 0,
                0,
                100
            );

        const fill =
            bar.querySelector(
                ".progress-fill, .progress-bar-fill"
            ) || bar;

        if (
            fill !== bar ||
            bar.dataset.progressTarget
        ) {

            fill.style.width =
                `${value}%`;

        } else {

            bar.style.setProperty(
                "--progress",
                `${value}%`
            );
        }

        bar.setAttribute(
            "aria-valuenow",
            String(value)
        );
    });
}


/* ============================================================
   25. CHART ENGINE
   ============================================================ */

const ChartManager = {

    initialize() {

        this.initializeRevenueChart();

        this.initializeActivityChart();

        this.initializeGenericCharts();
    },


    initializeRevenueChart() {

        const canvas =
            document.querySelector(
                "#revenueChart, [data-chart='revenue']"
            );

        if (!canvas) {
            return;
        }

        if (
            typeof window.Chart ===
            "undefined"
        ) {

            this.fallback(
                canvas,
                [32, 45, 38, 60, 54, 72, 68]
            );

            return;
        }

        if (
            state.charts.revenue
        ) {

            state.charts.revenue.destroy();
        }

        const context =
            canvas.getContext("2d");

        state.charts.revenue =
            new Chart(
                context,
                {
                    type: "line",

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
                                label: "Revenue",

                                data: [
                                    3200,
                                    4500,
                                    3800,
                                    6100,
                                    5400,
                                    7200,
                                    6800
                                ],

                                borderWidth: 2,

                                fill: true,

                                tension: 0.4
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
                            }
                        },

                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                }
            );
    },


    initializeActivityChart() {

        const canvas =
            document.querySelector(
                "#activityChart, [data-chart='activity']"
            );

        if (!canvas) {
            return;
        }

        if (
            typeof window.Chart ===
            "undefined"
        ) {

            this.fallback(
                canvas,
                [24, 35, 31, 48, 43, 57, 50]
            );

            return;
        }

        if (
            state.charts.activity
        ) {

            state.charts.activity.destroy();
        }

        const context =
            canvas.getContext("2d");

        state.charts.activity =
            new Chart(
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
                                    24,
                                    35,
                                    31,
                                    48,
                                    43,
                                    57,
                                    50
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
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                }
            );
    },


    initializeGenericCharts() {

        $$(
            "canvas[data-chart-type]"
        ).forEach(canvas => {

            if (
                canvas.id === "revenueChart" ||
                canvas.id === "activityChart"
            ) {
                return;
            }

            this.createGeneric(
                canvas
            );
        });
    },


    createGeneric(canvas) {

        if (
            typeof window.Chart ===
            "undefined"
        ) {
            return;
        }

        const type =
            canvas.dataset.chartType ||
            "line";

        const values =
            safeJSONParse(
                canvas.dataset.chartData,
                [10, 20, 15, 30, 24, 40]
            );

        try {

            const context =
                canvas.getContext("2d");

            const chart =
                new Chart(
                    context,
                    {
                        type,

                        data: {
                            labels:
                                values.map(
                                    (_, index) =>
                                        String(
                                            index + 1
                                        )
                                ),

                            datasets: [
                                {
                                    data: values,

                                    borderWidth: 2,

                                    tension: 0.35,

                                    borderRadius: 6
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
                            }
                        }
                    }
                );

            state.charts[
                canvas.id ||
                `chart-${Math.random()}`
            ] = chart;

        } catch (error) {

            console.warn(
                "Veltrix chart error:",
                error
            );
        }
    },


    fallback(canvas, values) {

        const wrapper =
            canvas.parentElement;

        if (!wrapper) {
            return;
        }

        const max =
            Math.max(...values);

        const container =
            document.createElement("div");

        container.className =
            "chart-fallback";

        values.forEach(value => {

            const bar =
                document.createElement("span");

            bar.style.height =
                `${(value / max) * 100}%`;

            container.appendChild(
                bar
            );
        });

        canvas.style.display =
            "none";

        wrapper.appendChild(
            container
        );
    }
};


/* ============================================================
   26. CALCULATOR SYSTEM
   ============================================================ */

const CalculatorManager = {

    initialize() {

        document.addEventListener(
            "input",
            debounce(
                event => {

                    const calculator =
                        event.target.closest(
                            "[data-calculator]"
                        );

                    if (!calculator) {
                        return;
                    }

                    this.calculate(
                        calculator
                    );

                },
                80
            )
        );

        $$(
            "[data-calculator]"
        ).forEach(
            calculator =>
                this.calculate(calculator)
        );
    },


    calculate(container) {

        const type =
            container.dataset.calculator;

        switch (type) {

            case "percentage":
                this.percentage(
                    container
                );
                break;

            case "orders":
                this.orders(
                    container
                );
                break;

            default:
                this.generic(
                    container
                );
        }
    },


    getValue(container, name) {

        const input =
            container.querySelector(
                `[name="${name}"], [data-calculator-input="${name}"]`
            );

        return Number(
            input?.value || 0
        );
    },


    setResult(container, name, value) {

        const target =
            container.querySelector(
                `[data-calculator-result="${name}"]`
            );

        if (!target) {
            return;
        }

        target.textContent =
            formatNumber(value);
    },


    percentage(container) {

        const number =
            this.getValue(
                container,
                "number"
            );

        const percentage =
            this.getValue(
                container,
                "percentage"
            );

        const result =
            number *
            percentage /
            100;

        this.setResult(
            container,
            "result",
            result
        );
    },


    orders(container) {

        const orders =
            this.getValue(
                container,
                "orders"
            );

        const average =
            this.getValue(
                container,
                "average"
            );

        const hours =
            this.getValue(
                container,
                "hours"
            );

        const revenue =
            orders * average;

        const hourly =
            hours > 0
                ? revenue / hours
                : 0;

        this.setResult(
            container,
            "revenue",
            revenue
        );

        this.setResult(
            container,
            "hourly",
            hourly
        );
    },


    generic(container) {

        const inputs =
            $$(
                "[data-calculator-input]",
                container
            );

        let total = 0;

        inputs.forEach(
            input => {

                const value =
                    Number(
                        input.value || 0
                    );

                if (
                    Number.isFinite(value)
                ) {

                    total += value;
                }
            }
        );

        this.setResult(
            container,
            "total",
            total
        );
    }
};


/* ============================================================
   27. FORM VALIDATION
   ============================================================ */

const FormManager = {

    initialize() {

        document.addEventListener(
            "submit",
            event => {

                const form =
                    event.target.closest(
                        "form[data-validate]"
                    );

                if (!form) {
                    return;
                }

                if (
                    !this.validate(form)
                ) {

                    event.preventDefault();

                    showToast(
                        "Please check the highlighted fields.",
                        "warning"
                    );

                    return;
                }

                /*
                   Static template:
                   prevent fake server submission unless
                   explicitly allowed.
                */

                if (
                    form.dataset.allowSubmit !==
                    "true"
                ) {

                    event.preventDefault();

                    showToast(
                        "Form validated successfully.",
                        "success"
                    );
                }
            }
        );
    },


    validate(form) {

        let valid = true;

        $$(
            "[required]",
            form
        ).forEach(input => {

            const value =
                String(
                    input.value || ""
                ).trim();

            const invalid =
                !value;

            input.classList.toggle(
                "is-invalid",
                invalid
            );

            if (invalid) {
                valid = false;
            }
        });

        return valid;
    }
};


/* ============================================================
   28. PASSWORD VISIBILITY
   ============================================================ */

function initializePasswordToggles() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-password-toggle]"
                );

            if (!button) {
                return;
            }

            const selector =
                button.dataset.passwordToggle;

            const input =
                document.querySelector(
                    selector
                ) ||
                button
                    .closest(".password-field, .input-group")
                    ?.querySelector(
                        "input"
                    );

            if (!input) {
                return;
            }

            const visible =
                input.type === "text";

            input.type =
                visible
                    ? "password"
                    : "text";

            button.classList.toggle(
                "active",
                !visible
            );

            const icon =
                button.querySelector("i");

            if (icon) {

                icon.className =
                    visible
                        ? "fa-solid fa-eye"
                        : "fa-solid fa-eye-slash";
            }
        }
    );
}


/* ============================================================
   29. CLIPBOARD
   ============================================================ */

function initializeClipboard() {

    document.addEventListener(
        "click",
        async event => {

            const button =
                event.target.closest(
                    "[data-copy]"
                );

            if (!button) {
                return;
            }

            const value =
                button.dataset.copy;

            if (!value) {
                return;
            }

            try {

                await navigator.clipboard.writeText(
                    value
                );

                showToast(
                    "Copied to clipboard",
                    "success"
                );

            } catch {

                showToast(
                    "Unable to copy",
                    "error"
                );
            }
        }
    );
}


/* ============================================================
   30. FAVORITES
   ============================================================ */

const FavoritesManager = {

    initialize() {

        state.favorites =
            StorageManager.getJSON(
                CONFIG.storage.favorites,
                []
            );

        this.updateUI();
    },


    toggle(id) {

        if (!id) {
            return;
        }

        const index =
            state.favorites.indexOf(
                id
            );

        if (index >= 0) {

            state.favorites.splice(
                index,
                1
            );

            showToast(
                "Removed from favorites",
                "info"
            );

        } else {

            state.favorites.push(id);

            showToast(
                "Added to favorites",
                "success"
            );
        }

        StorageManager.setJSON(
            CONFIG.storage.favorites,
            state.favorites
        );

        this.updateUI();
    },


    updateUI() {

        $$(
            "[data-favorite]"
        ).forEach(button => {

            const id =
                button.dataset.favorite;

            const active =
                state.favorites.includes(
                    id
                );

            button.classList.toggle(
                "active",
                active
            );

            button.setAttribute(
                "aria-pressed",
                String(active)
            );
        });
    }
};


/* ============================================================
   31. RIPPLE EFFECT
   ============================================================ */

function initializeRipple() {

    document.addEventListener(
        "click",
        event => {

            if (state.reducedMotion) {
                return;
            }

            const button =
                event.target.closest(
                    ".btn, .button, button.ripple, [data-ripple]"
                );

            if (!button) {
                return;
            }

            const rect =
                button.getBoundingClientRect();

            const ripple =
                document.createElement("span");

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
                `${event.clientX - rect.left - size / 2}px`;

            ripple.style.top =
                `${event.clientY - rect.top - size / 2}px`;

            button.appendChild(
                ripple
            );

            window.setTimeout(
                () => ripple.remove(),
                650
            );
        }
    );
}


/* ============================================================
   32. CARD GLOW
   ============================================================ */

function initializeCardGlow() {

    if (state.reducedMotion) {
        return;
    }

    document.addEventListener(
        "pointermove",
        throttle(
            event => {

                const card =
                    event.target.closest(
                        ".card, .stat-card, .dashboard-card, .panel, [data-glow]"
                    );

                if (!card) {
                    return;
                }

                const rect =
                    card.getBoundingClientRect();

                const x =
                    ((event.clientX - rect.left) /
                        rect.width) *
                    100;

                const y =
                    ((event.clientY - rect.top) /
                        rect.height) *
                    100;

                card.style.setProperty(
                    "--mouse-x",
                    `${x}%`
                );

                card.style.setProperty(
                    "--mouse-y",
                    `${y}%`
                );
            },
            40
        )
    );
}


/* ============================================================
   33. ONLINE / OFFLINE
   ============================================================ */

function updateOnlineStatus() {

    state.isOnline =
        navigator.onLine;

    DOM.body?.classList.toggle(
        "is-offline",
        !state.isOnline
    );

    if (DOM.offlineIndicator) {

        DOM.offlineIndicator.hidden =
            state.isOnline;
    }

    if (!state.isOnline) {

        showToast(
            "You are offline.",
            "warning"
        );

    } else {

        showToast(
            "Connection restored.",
            "success"
        );

        /*
           Google Translate may have failed while
           offline, so try again.
        */

        TranslationManager.loadGoogleTranslate();
    }
}


/* ============================================================
   34. BACK TO TOP
   ============================================================ */

function initializeBackToTop() {

    if (!DOM.backToTop) {
        return;
    }

    window.addEventListener(
        "scroll",
        throttle(
            () => {

                DOM.backToTop.classList.toggle(
                    "is-visible",
                    window.scrollY > 500
                );
            },
            100
        )
    );

    DOM.backToTop.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior:
                    state.reducedMotion
                        ? "auto"
                        : "smooth"
            });
        }
    );
}


/* ============================================================
   35. REVEAL ANIMATIONS
   ============================================================ */

function initializeRevealAnimations() {

    if (
        state.reducedMotion ||
        !("IntersectionObserver" in window)
    ) {

        $$(".reveal, [data-reveal]").forEach(
            element => {
                element.classList.add(
                    "is-visible"
                );
            }
        );

        return;
    }

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "is-visible"
                        );

                        observer.unobserve(
                            entry.target
                        );
                    }
                });
            },
            {
                threshold: 0.08
            }
        );

    $$(".reveal, [data-reveal]").forEach(
        element => {

            observer.observe(
                element
            );
        }
    );
}


/* ============================================================
   36. DATE / TIME
   ============================================================ */

function initializeDateTime() {

    const update = () => {

        const now =
            new Date();

        $$(
            "[data-current-date]"
        ).forEach(element => {

            element.textContent =
                now.toLocaleDateString(
                    undefined,
                    {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    }
                );
        });

        $$(
            "[data-current-time]"
        ).forEach(element => {

            element.textContent =
                now.toLocaleTimeString(
                    undefined,
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );
        });
    };

    update();

    window.setInterval(
        update,
        30000
    );
}


/* ============================================================
   37. TABLE SORTING
   ============================================================ */

function initializeTableSorting() {

    document.addEventListener(
        "click",
        event => {

            const header =
                event.target.closest(
                    "[data-sort]"
                );

            if (!header) {
                return;
            }

            const table =
                header.closest(
                    "table"
                );

            if (!table) {
                return;
            }

            const tbody =
                table.querySelector(
                    "tbody"
                );

            if (!tbody) {
                return;
            }

            const column =
                Number(
                    header.dataset.sort
                );

            if (!Number.isInteger(column)) {
                return;
            }

            const rows =
                Array.from(
                    tbody.querySelectorAll(
                        "tr"
                    )
                );

            const ascending =
                header.dataset.sortDirection !==
                "asc";

            rows.sort(
                (a, b) => {

                    const aText =
                        a.children[column]
                            ?.textContent
                            .trim() || "";

                    const bText =
                        b.children[column]
                            ?.textContent
                            .trim() || "";

                    const aNumber =
                        Number(
                            aText.replace(
                                /[^\d.-]/g,
                                ""
                            )
                        );

                    const bNumber =
                        Number(
                            bText.replace(
                                /[^\d.-]/g,
                                ""
                            )
                        );

                    if (
                        Number.isFinite(aNumber) &&
                        Number.isFinite(bNumber)
                    ) {

                        return ascending
                            ? aNumber - bNumber
                            : bNumber - aNumber;
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
                row => tbody.appendChild(row)
            );

            $$(
                "[data-sort]",
                table
            ).forEach(
                item =>
                    delete item.dataset.sortDirection
            );

            header.dataset.sortDirection =
                ascending
                    ? "asc"
                    : "desc";
        }
    );
}


/* ============================================================
   38. FILTERS
   ============================================================ */

function initializeFilters() {

    document.addEventListener(
        "input",
        debounce(
            event => {

                const input =
                    event.target.closest(
                        "[data-filter-input]"
                    );

                if (!input) {
                    return;
                }

                const targetSelector =
                    input.dataset.filterInput;

                const target =
                    document.querySelector(
                        targetSelector
                    );

                if (!target) {
                    return;
                }

                const query =
                    input.value
                        .trim()
                        .toLowerCase();

                $$(
                    "[data-filter-item]",
                    target
                ).forEach(item => {

                    const text =
                        item.textContent
                            .toLowerCase();

                    item.hidden =
                        Boolean(
                            query &&
                            !text.includes(
                                query
                            )
                        );
                });

            },
            150
        )
    );
}


/* ============================================================
   39. CUSTOM SELECTS
   ============================================================ */

function initializeCustomSelects() {

    document.addEventListener(
        "click",
        event => {

            const option =
                event.target.closest(
                    "[data-select-option]"
                );

            if (option) {

                const wrapper =
                    option.closest(
                        "[data-custom-select]"
                    );

                if (!wrapper) {
                    return;
                }

                const value =
                    option.dataset.selectOption;

                const label =
                    wrapper.querySelector(
                        "[data-select-label]"
                    );

                const hidden =
                    wrapper.querySelector(
                        "input[type='hidden']"
                    );

                if (label) {
                    label.textContent =
                        option.textContent.trim();
                }

                if (hidden) {
                    hidden.value = value;
                }

                wrapper.dataset.value =
                    value;

                wrapper.classList.remove(
                    "is-open"
                );

                return;
            }

            const button =
                event.target.closest(
                    "[data-custom-select-button]"
                );

            if (button) {

                const wrapper =
                    button.closest(
                        "[data-custom-select]"
                    );

                wrapper?.classList.toggle(
                    "is-open"
                );
            }
        }
    );
}


/* ============================================================
   40. GENERAL ACTIONS
   ============================================================ */

function initializeGeneralActions() {

    document.addEventListener(
        "click",
        event => {

            const action =
                event.target.closest(
                    "[data-action]"
                );

            if (!action) {
                return;
            }

            const value =
                action.dataset.action;

            switch (value) {

                case "toggle-theme":

                    ThemeManager.toggle();

                    break;

                case "open-search":

                    SearchManager.open();

                    break;

                case "open-quick-create":

                    QuickCreateManager.open();

                    break;

                case "close-modal":

                    ModalManager.close(
                        action.closest(
                            ".modal, .app-modal"
                        )
                    );

                    break;

                case "close-dropdown":

                    DropdownManager.close(
                        action.closest(
                            ".dropdown, .topbar-dropdown"
                        )
                    );

                    break;

                case "mark-all-notifications-read":

                    NotificationManager.markAllRead();

                    break;

                case "logout":

                    handleLogout();

                    break;

                case "share":

                    handleShare();

                    break;

                case "copy-url":

                    copyCurrentURL();

                    break;

                default:

                    if (
                        value.startsWith(
                            "create:"
                        )
                    ) {

                        QuickCreateManager.execute(
                            value.replace(
                                "create:",
                                ""
                            )
                        );
                    }
            }
        }
    );
}


/* ============================================================
   41. LANGUAGE EVENTS
   ============================================================ */

function initializeLanguageEvents() {

    document.addEventListener(
        "click",
        event => {

            const languageOption =
                event.target.closest(
                    "[data-language]"
                );

            if (!languageOption) {
                return;
            }

            const code =
                languageOption.dataset.language;

            if (!isSupportedLanguage(code)) {
                return;
            }

            event.preventDefault();

            TranslationManager.setLanguage(
                code
            );
        }
    );


    document.addEventListener(
        "change",
        event => {

            const control =
                event.target.closest(
                    "[data-settings-language], [data-language-select]"
                );

            if (!control) {
                return;
            }

            const code =
                control.value;

            TranslationManager.setLanguage(
                code
            );
        }
    );
}


/* ============================================================
   42. TOPBAR DROPDOWNS
   ============================================================ */

function initializeTopbarDropdowns() {

    document.addEventListener(
        "click",
        event => {

            const languageButton =
                event.target.closest(
                    "[data-language-button], #languageButton, .language-button"
                );

            if (languageButton) {

                event.preventDefault();

                const dropdown =
                    document.querySelector(
                        languageButton.dataset.dropdown ||
                        "#languageDropdown"
                    );

                DropdownManager.toggle(
                    dropdown,
                    languageButton
                );

                return;
            }


            const notificationButton =
                event.target.closest(
                    "[data-notifications], #notificationButton, .notification-button"
                );

            if (notificationButton) {

                event.preventDefault();

                const dropdown =
                    document.querySelector(
                        notificationButton.dataset.dropdown ||
                        "#notificationDropdown"
                    );

                DropdownManager.toggle(
                    dropdown,
                    notificationButton
                );

                return;
            }


            const workspaceButton =
                event.target.closest(
                    "[data-workspace-button], #workspaceButton"
                );

            if (workspaceButton) {

                event.preventDefault();

                const dropdown =
                    document.querySelector(
                        workspaceButton.dataset.dropdown ||
                        "#workspaceDropdown"
                    );

                DropdownManager.toggle(
                    dropdown,
                    workspaceButton
                );

                return;
            }


            /*
               Workspace selection
            */

            const workspace =
                event.target.closest(
                    "[data-workspace]"
                );

            if (
                workspace &&
                workspace.dataset.workspace
            ) {

                WorkspaceManager.set(
                    workspace.dataset.workspace
                );

                DropdownManager.closeAll();

                return;
            }


            /*
               Notification selection
            */

            const notification =
                event.target.closest(
                    "[data-notification-id]"
                );

            if (notification) {

                NotificationManager.markRead(
                    notification.dataset.notificationId
                );
            }


            /*
               Close dropdowns when clicking outside.
            */

            if (
                !event.target.closest(
                    ".dropdown-wrapper, .topbar-menu, .dropdown, .language-menu, .notification-menu, .workspace-menu"
                )
            ) {

                DropdownManager.closeAll();
            }
        }
    );
}


/* ============================================================
   43. KEYBOARD SHORTCUTS
   ============================================================ */

function initializeKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                DropdownManager.closeAll();

                ModalManager.closeAll();

                SidebarManager.closeMobile();

                return;
            }

            if (
                event.altKey &&
                event.key.toLowerCase() === "b"
            ) {

                event.preventDefault();

                SidebarManager.toggle();

                return;
            }

            if (
                event.ctrlKey &&
                event.shiftKey &&
                event.key.toLowerCase() === "l"
            ) {

                event.preventDefault();

                const current =
                    state.language;

                const index =
                    CONFIG.languages.findIndex(
                        language =>
                            language.code ===
                            current
                    );

                const next =
                    CONFIG.languages[
                        (index + 1) %
                        CONFIG.languages.length
                    ];

                TranslationManager.setLanguage(
                    next.code
                );
            }
        }
    );
}


/* ============================================================
   44. CLICK OUTSIDE / ESCAPE
   ============================================================ */

function initializeGlobalDismiss() {

    document.addEventListener(
        "click",
        event => {

            if (
                !event.target.closest(
                    ".dropdown, .dropdown-wrapper, [data-dropdown-wrapper], .topbar-menu"
                )
            ) {

                DropdownManager.closeAll();
            }
        }
    );
}


/* ============================================================
   45. LOGOUT
   ============================================================ */

function handleLogout() {

    const confirmed =
        window.confirm(
            "Are you sure you want to log out?"
        );

    if (!confirmed) {
        return;
    }

    showToast(
        "Logged out successfully.",
        "success"
    );

    /*
       Template/demo behavior only.

       Real authentication must be implemented
       by the backend.
    */

    window.setTimeout(
        () => {

            const login =
                document.querySelector(
                    "[data-logout-redirect]"
                );

            if (login) {

                window.location.href =
                    login.dataset.logoutRedirect;
            }

        },
        700
    );
}


/* ============================================================
   46. SHARE
   ============================================================ */

async function handleShare() {

    const data = {
        title:
            document.title,
        text:
            document.title,
        url:
            window.location.href
    };

    if (
        navigator.share
    ) {

        try {

            await navigator.share(
                data
            );

        } catch {
            /* User cancelled. */
        }

        return;
    }

    copyCurrentURL();
}


async function copyCurrentURL() {

    try {

        await navigator.clipboard.writeText(
            window.location.href
        );

        showToast(
            "Page URL copied",
            "success"
        );

    } catch {

        showToast(
            "Unable to copy URL",
            "error"
        );
    }
}


/* ============================================================
   47. REDUCED MOTION
   ============================================================ */

function initializeMotionPreference() {

    const media =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

    const update = () => {

        state.reducedMotion =
            media.matches;

        document.body.classList.toggle(
            "reduced-motion",
            state.reducedMotion
        );
    };

    update();

    media.addEventListener?.(
        "change",
        update
    );
}


/* ============================================================
   48. RESIZE
   ============================================================ */

function initializeResizeHandling() {

    window.addEventListener(
        "resize",
        debounce(
            () => {

                if (
                    window.innerWidth >
                    CONFIG.breakpoints.mobile
                ) {

                    SidebarManager.closeMobile();
                }

                Object.values(
                    state.charts
                ).forEach(chart => {

                    try {
                        chart.resize();
                    } catch {
                        /* ignored */
                    }
                });

            },
            150
        )
    );
}


/* ============================================================
   49. PAGE LOADER
   ============================================================ */

function initializeLoader() {

    const loader =
        DOM.loader;

    if (!loader) {
        return;
    }

    /*
       Never leave the loader forever if an external
       script takes too long.
    */

    const hide = () => {

        loader.classList.add(
            "is-hidden"
        );

        DOM.body.classList.add(
            "page-ready"
        );

        window.setTimeout(
            () => {

                loader.remove();

            },
            700
        );
    };

    if (
        document.readyState ===
        "complete"
    ) {

        window.setTimeout(
            hide,
            CONFIG.animation.loaderDuration
        );

    } else {

        window.addEventListener(
            "load",
            () => {

                window.setTimeout(
                    hide,
                    CONFIG.animation.loaderDuration
                );

            },
            {
                once: true
            }
        );
    }

    /*
       Absolute safety timeout.
    */

    window.setTimeout(
        hide,
        5000
    );
}


/* ============================================================
   50. ACTIVE PAGE
   ============================================================ */

function initializePageState() {

    const page =
        DOM.app?.dataset.page ||
        document.body.dataset.page ||
        "home";

    document.body.dataset.currentPage =
        page;

    $$(
        "[data-page-section]"
    ).forEach(section => {

        section.classList.toggle(
            "active",
            section.dataset.pageSection ===
            page
        );
    });
}


/* ============================================================
   51. URL LANGUAGE SYNCHRONIZATION
   ============================================================ */

function synchronizeLanguageBeforeUnload() {

    window.addEventListener(
        "beforeunload",
        () => {

            StorageManager.set(
                CONFIG.storage.language,
                state.language
            );

            TranslationManager.persistGoogleLanguageCookie(
                state.language
            );
        }
    );
}


/* ============================================================
   52. PAGE VISIBILITY
   ============================================================ */

function initializeVisibilityHandling() {

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.visibilityState ===
                "visible"
            ) {

                /*
                   Re-sync language after returning
                   to the page.
                */

                const stored =
                    getLanguageFromStorage();

                if (
                    stored &&
                    stored !== state.language
                ) {

                    TranslationManager.setLanguage(
                        stored,
                        {
                            silent: true
                        }
                    );
                }

                if (
                    state.language !== "en"
                ) {

                    TranslationManager.scheduleGoogleApply(
                        state.language,
                        250
                    );
                }
            }
        }
    );
}


/* ============================================================
   53. DYNAMIC LANGUAGE CONTROL RE-SCAN
   ============================================================ */

function initializeLanguageControlObserver() {

    const observer =
        new MutationObserver(
            debounce(
                () => {

                    TranslationManager.populateLanguageControls();

                    TranslationManager.updateLanguageControls();

                },
                400
            )
        );

    observer.observe(
        document.body,
        {
            childList: true,
            subtree: true
        }
    );
}


/* ============================================================
   54. GENERIC BUTTON FEEDBACK
   ============================================================ */

function initializeButtonFeedback() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "button[data-feedback]"
                );

            if (!button) {
                return;
            }

            const message =
                button.dataset.feedback ||
                "Action completed.";

            showToast(
                message,
                "success"
            );
        }
    );
}


/* ============================================================
   55. DELETE / CONFIRMATION
   ============================================================ */

function initializeConfirmationActions() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-confirm]"
                );

            if (!button) {
                return;
            }

            event.preventDefault();

            const message =
                button.dataset.confirm ||
                "Are you sure?";

            const confirmed =
                window.confirm(
                    message
                );

            if (!confirmed) {
                return;
            }

            const targetSelector =
                button.dataset.confirmTarget;

            if (targetSelector) {

                const target =
                    document.querySelector(
                        targetSelector
                    );

                target?.remove();
            }

            const successMessage =
                button.dataset.successMessage ||
                "Action completed.";

            showToast(
                successMessage,
                "success"
            );
        }
    );
}


/* ============================================================
   56. TOOLTIP SYSTEM
   ============================================================ */

function initializeTooltips() {

    let tooltip = null;

    const createTooltip = text => {

        if (!tooltip) {

            tooltip =
                document.createElement("div");

            tooltip.className =
                "veltrix-tooltip";

            document.body.appendChild(
                tooltip
            );
        }

        tooltip.textContent =
            text;

        return tooltip;
    };

    document.addEventListener(
        "pointerover",
        event => {

            const target =
                event.target.closest(
                    "[data-tooltip]"
                );

            if (!target) {
                return;
            }

            const text =
                target.dataset.tooltip;

            if (!text) {
                return;
            }

            const element =
                createTooltip(text);

            const rect =
                target.getBoundingClientRect();

            element.style.left =
                `${rect.left + rect.width / 2}px`;

            element.style.top =
                `${rect.top - 8}px`;

            element.classList.add(
                "is-visible"
            );
        }
    );

    document.addEventListener(
        "pointerout",
        event => {

            if (
                !event.target.closest(
                    "[data-tooltip]"
                )
            ) {
                return;
            }

            tooltip?.classList.remove(
                "is-visible"
            );
        }
    );
}


/* ============================================================
   57. SCROLL EFFECTS
   ============================================================ */

function initializeScrollEffects() {

    const handler =
        throttle(
            () => {

                const scrolled =
                    window.scrollY > 20;

                DOM.topbar?.classList.toggle(
                    "is-scrolled",
                    scrolled
                );

                document.body.classList.toggle(
                    "has-scrolled",
                    scrolled
                );
            },
            80
        );

    window.addEventListener(
        "scroll",
        handler,
        {
            passive: true
        }
    );

    handler();
}


/* ============================================================
   58. MOBILE RESPONSIVE STATE
   ============================================================ */

function initializeResponsiveState() {

    const update = () => {

        const width =
            window.innerWidth;

        document.body.classList.toggle(
            "is-mobile",
            width <= CONFIG.breakpoints.mobile
        );

        document.body.classList.toggle(
            "is-tablet",
            width > CONFIG.breakpoints.mobile &&
            width <= CONFIG.breakpoints.tablet
        );

        document.body.classList.toggle(
            "is-desktop",
            width > CONFIG.breakpoints.tablet
        );
    };

    update();

    window.addEventListener(
        "resize",
        debounce(
            update,
            120
        )
    );
}


/* ============================================================
   59. THEME TRANSITION
   ============================================================ */

function initializeThemeTransition() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-theme-toggle], #themeToggle, .theme-toggle"
                );

            if (!button) {
                return;
            }

            if (
                state.reducedMotion
            ) {
                return;
            }

            document.documentElement.classList.add(
                "theme-transition"
            );

            window.setTimeout(
                () => {

                    document.documentElement.classList.remove(
                        "theme-transition"
                    );

                },
                500
            );
        }
    );
}


/* ============================================================
   60. SETTINGS SYNCHRONIZATION
   ============================================================ */

function initializeSettingsSync() {

    /*
       Generic settings inputs can use:

       data-setting="setting-name"

       This keeps settings centralized without
       writing individual page logic.
    */

    document.addEventListener(
        "change",
        event => {

            const control =
                event.target.closest(
                    "[data-setting]"
                );

            if (!control) {
                return;
            }

            const setting =
                control.dataset.setting;

            let value;

            if (
                control.type ===
                "checkbox"
            ) {

                value =
                    control.checked;

            } else {

                value =
                    control.value;
            }

            const settings =
                StorageManager.getJSON(
                    CONFIG.storage.settings,
                    {}
                );

            settings[setting] =
                value;

            StorageManager.setJSON(
                CONFIG.storage.settings,
                settings
            );

            window.dispatchEvent(
                new CustomEvent(
                    "veltrix:settingchange",
                    {
                        detail: {
                            setting,
                            value
                        }
                    }
                )
            );
        }
    );
}


/* ============================================================
   61. LANGUAGE ON PAGE LOAD
   ============================================================ */

function initializeLanguageFromCurrentState() {

    state.language =
        resolveInitialLanguage();

    StorageManager.set(
        CONFIG.storage.language,
        state.language
    );

    applyLanguageDirection(
        state.language
    );

    TranslationManager.persistGoogleLanguageCookie(
        state.language
    );
}


/* ============================================================
   62. GOOGLE TRANSLATE PAGE RESTORE
   ============================================================ */

function initializeGoogleTranslationRestore() {

    /*
       Google Translate can load asynchronously.

       We therefore keep attempting to apply the stored
       language for a short period after DOM ready.
    */

    const attempts = [
        300,
        800,
        1500,
        2500,
        4000
    ];

    attempts.forEach(
        delay => {

            window.setTimeout(
                () => {

                    if (
                        state.language !== "en"
                    ) {

                        TranslationManager.applyGoogleLanguage(
                            state.language
                        );
                    }

                },
                delay
            );
        }
    );
}


/* ============================================================
   63. EVENT DELEGATION FOR COMMON LINKS
   ============================================================ */

function initializeCommonLinks() {

    document.addEventListener(
        "click",
        event => {

            const link =
                event.target.closest(
                    "[data-href]"
                );

            if (!link) {
                return;
            }

            const href =
                link.dataset.href;

            if (!href) {
                return;
            }

            event.preventDefault();

            NavigationManager.navigate(
                href,
                link
            );
        }
    );
}


/* ============================================================
   64. PROFILE / ACCOUNT ACTIONS
   ============================================================ */

function initializeProfileActions() {

    document.addEventListener(
        "click",
        event => {

            const action =
                event.target.closest(
                    "[data-profile-action]"
                );

            if (!action) {
                return;
            }

            const value =
                action.dataset.profileAction;

            switch (value) {

                case "edit":

                    showToast(
                        "Edit profile",
                        "info"
                    );

                    break;

                case "security":

                    showToast(
                        "Security settings",
                        "info"
                    );

                    break;

                case "password":

                    showToast(
                        "Password settings",
                        "info"
                    );

                    break;

                case "privacy":

                    showToast(
                        "Privacy settings",
                        "info"
                    );

                    break;

                default:

                    showToast(
                        "Profile action",
                        "info"
                    );
            }
        }
    );
}


/* ============================================================
   65. INITIALIZE ALL
   ============================================================ */

function initializeVeltrix() {

    if (state.initialized) {
        return;
    }

    state.initialized = true;

    /*
       DOM first
    */

    cacheDOM();

    /*
       Motion preference
    */

    initializeMotionPreference();

    /*
       Apply language BEFORE external translation
       initialization.
    */

    initializeLanguageFromCurrentState();

    /*
       Theme
    */

    ThemeManager.initialize();

    /*
       Page state
    */

    initializePageState();

    /*
       Main systems
    */

    SidebarManager.initialize();

    WorkspaceManager.initialize();

    NotificationManager.initialize();

    FavoritesManager.initialize();

    NavigationManager.initialize();

    SearchManager.initialize();

    CalculatorManager.initialize();

    FormManager.initialize();

    TranslationManager.initialize();

    /*
       UI systems
    */

    initializeLanguageEvents();

    initializeTopbarDropdowns();

    initializeKeyboardShortcuts();

    initializeGlobalDismiss();

    initializeGeneralActions();

    initializePasswordToggles();

    initializeClipboard();

    initializeRipple();

    initializeCardGlow();

    initializeBackToTop();

    initializeRevealAnimations();

    initializeDateTime();

    initializeTableSorting();

    initializeFilters();

    initializeCustomSelects();

    initializeResizeHandling();

    initializeVisibilityHandling();

    initializeLanguageControlObserver();

    initializeButtonFeedback();

    initializeConfirmationActions();

    initializeTooltips();

    initializeScrollEffects();

    initializeResponsiveState();

    initializeThemeTransition();

    initializeSettingsSync();

    initializeCommonLinks();

    initializeProfileActions();

    synchronizeLanguageBeforeUnload();

    /*
       Data/UI
    */

    initializeCounters();

    initializeProgressBars();

    ChartManager.initialize();

    /*
       Loader last
    */

    initializeLoader();

    /*
       Restore Google Translate after everything exists.
    */

    initializeGoogleTranslationRestore();

    /*
       Initial body state.
    */

    document.body.classList.add(
        "veltrix-initialized"
    );

    /*
       Notify external scripts.
    */

    window.dispatchEvent(
        new CustomEvent(
            "veltrix:ready",
            {
                detail: {
                    version: CONFIG.version,
                    language: state.language,
                    theme: state.theme
                }
            }
        )
    );

    /*
       Small final synchronization.
    */

    window.setTimeout(
        () => {

            TranslationManager.populateLanguageControls();

            TranslationManager.updateLanguageControls();

            applyLanguageDirection(
                state.language
            );

            if (
                state.language !== "en"
            ) {

                TranslationManager.scheduleGoogleApply(
                    state.language,
                    200
                );
            }

        },
        100
    );
}


/* ============================================================
   66. PUBLIC VELTRIX API
   ============================================================ */

window.Veltrix = {

    version:
        CONFIG.version,

    config:
        CONFIG,

    state:
        state,

    storage:
        StorageManager,

    cookies:
        CookieManager,

    theme:
        {
            get() {
                return state.theme;
            },

            set(theme) {
                ThemeManager.set(theme);
            },

            toggle() {
                ThemeManager.toggle();
            }
        },

    language:
        {
            get() {
                return state.language;
            },

            getCurrent() {
                return TranslationManager
                    .getCurrentLanguage();
            },

            getAll() {
                return [
                    ...CONFIG.languages
                ];
            },

            set(code) {
                return TranslationManager
                    .setLanguage(code);
            }
        },

    translation:
        TranslationManager,

    navigation:
        NavigationManager,

    sidebar:
        SidebarManager,

    notifications:
        NotificationManager,

    search:
        SearchManager,

    modal:
        ModalManager,

    toast:
        {
            show:
                showToast
        },

    workspace:
        WorkspaceManager,

    calculator:
        CalculatorManager,

    charts:
        ChartManager,

    favorites:
        FavoritesManager
};


/* ============================================================
   67. EARLY LANGUAGE SETUP
   ============================================================ */

/*
   This runs as soon as possible.

   It is intentionally outside DOMContentLoaded so that
   document language and Google cookie are prepared before
   the rest of the interface starts.
*/

(function earlyLanguageSetup() {

    try {

        const language =
            resolveInitialLanguage();

        state.language =
            language;

        StorageManager.set(
            CONFIG.storage.language,
            language
        );

        const languageObject =
            getLanguage(language);

        if (languageObject) {

            document.documentElement.lang =
                languageObject.code;

            document.documentElement.dir =
                languageObject.rtl
                    ? "rtl"
                    : "ltr";
        }

        TranslationManager.persistGoogleLanguageCookie(
            language
        );

    } catch (error) {

        console.warn(
            "Veltrix: Early language setup failed.",
            error
        );
    }

})();


/* ============================================================
   68. BOOT
   ============================================================ */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeVeltrix,
        {
            once: true
        }
    );

} else {

    initializeVeltrix();
}


/* ============================================================
   69. GLOBAL ERROR PROTECTION
   ============================================================ */

window.addEventListener(
    "error",
    event => {

        /*
           We don't display every JavaScript error to the
           customer because that would make the template
           look broken.

           Developers can still inspect the console.
        */

        console.warn(
            "Veltrix runtime warning:",
            event.error || event.message
        );
    }
);


window.addEventListener(
    "unhandledrejection",
    event => {

        console.warn(
            "Veltrix promise warning:",
            event.reason
        );
    }
);


/* ============================================================
   70. FINAL NOTES FOR TEMPLATE DEVELOPERS
   ============================================================

   Language:
       Veltrix.language.set("ar");
       Veltrix.language.set("fr");
       Veltrix.language.set("en");

   Theme:
       Veltrix.theme.set("dark");
       Veltrix.theme.set("light");

   Search:
       Veltrix.search.open();

   Notifications:
       Veltrix.notifications.markAllRead();

   Translation:
       Veltrix.translation.setLanguage("ar");

   Navigation:
       Veltrix.navigation.navigate("orders.html");

   The 21 supported languages are always available through:

       Veltrix.config.languages

   IMPORTANT:
       Do NOT create another language array inside
       individual pages.

       Settings, Topbar and future pages should all
       use this central configuration.

   ============================================================ */
