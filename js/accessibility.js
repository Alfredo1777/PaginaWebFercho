// === FUNCIONES PARA CADA CARACTERÍSTICA ===

function applyFontSize(level) {
    document.body.classList.remove(...Array.from({ length: 5 }, (_, i) => `font-size-${i + 1}`));
    document.body.classList.add(`font-size-${level}`);
    localStorage.setItem("fontSizeLevel", level);
}

function toggleClassPref(className, storageKey) {
    document.body.classList.toggle(className);
    localStorage.setItem(storageKey, document.body.classList.contains(className));
}

function loadAccessibilityPreferences() {
    const fontSizeLevel = localStorage.getItem("fontSizeLevel") || 1;
    applyFontSize(fontSizeLevel);

    const toggleOptions = [
        ["dark-mode", "darkMode"],
        ["high-contrast", "highContrast"],
        ["large-cursor", "largeCursor"],
        ["hide-images", "hideImages"],
        ["highlight-links", "highlightLinks"],
        ["body-readable", "readableFont"]
    ];

    toggleOptions.forEach(([className, key]) => {
        const enabled = localStorage.getItem(key) === "true";
        if (enabled) document.body.classList.add(className);
    });
}

// === FUNCIONES DE BOTONES ===

function setupAccessibilityButtons() {
    let fontSizeLevel = parseInt(localStorage.getItem("fontSizeLevel")) || 1;

    const btn = (id, handler) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("click", handler);
    };

    btn("fontIncrease", () => {
        if (fontSizeLevel < 5) {
            fontSizeLevel++;
            applyFontSize(fontSizeLevel);
        }
    });

    btn("fontDecrease", () => {
        if (fontSizeLevel > 1) {
            fontSizeLevel--;
            applyFontSize(fontSizeLevel);
        }
    });

    btn("darkMode", () => toggleClassPref("dark-mode", "darkMode"));
    btn("highContrast", () => toggleClassPref("high-contrast", "highContrast"));
    btn("cursorChange", () => toggleClassPref("large-cursor", "largeCursor"));
    btn("hideImages", () => toggleClassPref("hide-images", "hideImages"));
    btn("highlightLinks", () => toggleClassPref("highlight-links", "highlightLinks"));
    btn("changeFont", () => toggleClassPref("body-readable", "readableFont"));
}

// === INICIALIZACIÓN ===

document.addEventListener("DOMContentLoaded", () => {
    loadAccessibilityPreferences();
    setupAccessibilityButtons();
});
