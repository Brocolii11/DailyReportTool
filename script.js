// ==========================================
// 1. THEME TOGGLE LOGIC
// ==========================================
const themeToggleBtn = document.getElementById('theme-toggle-btn');

let currentTheme = localStorage.getItem('dprTheme') || 'light';

function otherTheme(theme) {
    return theme === 'light' ? 'dark' : 'light';
}

function updateThemeButton(theme) {
    if (!themeToggleBtn) return;
    const title = otherTheme(theme) === 'dark'
        ? 'Cambiar a tema oscuro'
        : 'Cambiar a tema claro';
    themeToggleBtn.title = title;
    themeToggleBtn.setAttribute('aria-label', title);
}

function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dprTheme', theme);
    updateThemeButton(theme);
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        applyTheme(otherTheme(currentTheme));
    });
}

applyTheme(currentTheme);


// ==========================================
// 2. SIDEBAR & CRYSTAL ICON TOGGLE LOGIC
// ==========================================
const sidebar = document.getElementById('sidebar');
const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
const crystalContainer = document.querySelector('.crystal-container');

if (sidebarToggleBtn && sidebar) {
    sidebarToggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        
        if (sidebar.classList.contains('collapsed')) {
            // Closing the menu
            crystalContainer.classList.remove('menu-open');
            triggerGleam();
        } else {
            // Opening the menu (Shatter to X)
            crystalContainer.classList.add('menu-open');
        }
    });
}

function triggerGleam() {
    if (!crystalContainer) return;
    crystalContainer.classList.remove('play-gleam');
    void crystalContainer.offsetWidth; // Trigger reflow to restart animation
    crystalContainer.classList.add('play-gleam');
}


// ==========================================
// 3. NAVIGATION LOGIC
// ==========================================
const views = {
    'nav-dashboard': document.getElementById('view-dashboard'),
    'nav-daily-report': document.getElementById('view-daily-report'),
    'nav-dealers-report': document.getElementById('view-dealers-report')
};
const navBtns = document.querySelectorAll('.nav-btn');

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active nav state
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Hide all views, show selected
        Object.values(views).forEach(view => {
            if (view) view.classList.add('hidden');
        });
        if (views[btn.id]) {
            views[btn.id].classList.remove('hidden');
        }

        // Auto-close sidebar on selection & trigger crystal closure
        if (sidebar && !sidebar.classList.contains('collapsed')) {
            sidebar.classList.add('collapsed');
            if (crystalContainer) crystalContainer.classList.remove('menu-open');
            triggerGleam();
        }
    });
});


// ==========================================
// 4. LIVE DATES (refresh at midnight)
// ==========================================
const APP_LOCALE = 'es-PR';
const shortDateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
const longDateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

let today = new Date();
let dateRolloverTimer = null;

function formatAppDate(date, options) {
    return date.toLocaleDateString(APP_LOCALE, options);
}

function msUntilNextMidnight() {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 2);
    return Math.max(1000, next - now);
}

function syncAppDates() {
    today = new Date();

    const dateS3 = new Date(today); dateS3.setDate(today.getDate() + 2);
    const dateS2 = new Date(today); dateS2.setDate(today.getDate() + 15);
    const dateS1 = new Date(today); dateS1.setDate(today.getDate() + 30);

    const dateTodayElem = document.getElementById('date-today');
    if (dateTodayElem) dateTodayElem.textContent = formatAppDate(today, shortDateOptions);

    const dateS3Elem = document.getElementById('date-s3');
    if (dateS3Elem) dateS3Elem.textContent = formatAppDate(dateS3, shortDateOptions);
    const dateS2Elem = document.getElementById('date-s2');
    if (dateS2Elem) dateS2Elem.textContent = formatAppDate(dateS2, shortDateOptions);
    const dateS1Elem = document.getElementById('date-s1');
    if (dateS1Elem) dateS1Elem.textContent = formatAppDate(dateS1, shortDateOptions);

    const longDate = formatAppDate(today, longDateOptions);
    setTextAll('.js-dash-summary-date', longDate);
    setTextAll('.js-report-date', longDate);
    setTextAll('.js-dealers-date', longDate);
}

function scheduleDateRollover() {
    if (dateRolloverTimer) clearTimeout(dateRolloverTimer);
    dateRolloverTimer = setTimeout(() => {
        syncAppDates();
        scheduleDateRollover();
    }, msUntilNextMidnight());
}

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') syncAppDates();
});


// ==========================================
// 5. SPANISH UI COPY
// ==========================================
const translations = {
    dashTitle: "Metas de seguimiento diario",
    dashReportTitle: "Informe diario de renovaciones",
    cardToday: "Hoy",
    cardS3: "S3",
    cardS2: "S2",
    cardS1: "S1",
    reportMainTitle: "Informe diario de renovaciones",
    manualSubtitle: "Registro de pólizas",
    manualDesc: "Escriba la póliza y pulse el botón de la categoría en la que se registrará en el informe.",
    lblPolicy: "Póliza",
    phPolicy: "ej., POL-10928 - Juan Pérez",
    catGroupDaily: "Diario",
    catGroupGeneral: "General",
    catRenewedToday: "Renovadas",
    catExpiredToday: "Expiradas",
    catNotRenewing: "No renovarán",
    catGeneral: "Renovadas",
    catGeneralNotRenewing: "No renovarán",
    catTitleGeneral: "General — Renovadas después de hoy",
    catTitleGeneralNotRenewing: "General — No renovarán después de hoy",
    brandTag: "DAILY REPORT TOOL",
    summaryTitlePrefix: "Resumen diario de renovaciones — ",
    bubbleLblRenewedToday: "Renovadas",
    bubbleSubRenewedToday: "Diario",
    bubbleLblExpiredToday: "Expiradas",
    bubbleSubExpiredToday: "Diario",
    bubbleLblNotRenewing: "No renovarán",
    bubbleSubNotRenewing: "Diario",
    bubbleLblGeneral: "Renovadas",
    bubbleSubGeneral: "Después de hoy",
    bubbleLblGeneralNotRenewing: "No renovarán",
    bubbleSubGeneralNotRenewing: "Después de hoy",
    bubbleLblTotal: "Total registrado",
    bubbleSubTotal: "Conteo total de actividad",
    badgeActions: "acciones registradas",
    copyBtnText: "Copiar resumen",
    clearBtnText: "Limpiar entradas",
    confirmClear: "¿Está seguro de que desea borrar todas las entradas manuales del informe de hoy?",
    noneLogged: "Ninguna registrada",
    copyAlert: "Informe copiado al portapapeles.",
    copyFailed: "No se pudo copiar al portapapeles. Copie el texto manualmente.",
    copied: "¡Copiado!",
    emptySummary: "Aún no hay acciones — añada una póliza arriba.",
    dailySectionHeader: "SECCIÓN DIARIA",
    generalSectionHeader: "SECCIÓN GENERAL",
    hdrRenewedToday: "1. RENOVADAS HOY:",
    hdrExpiredToday: "2. EXPIRADAS HOY:",
    hdrNotRenewing: "3. NO RENOVARÁN:",
    hdrGeneral: "1. RENOVADAS DESPUÉS DE HOY:",
    hdrGeneralNotRenewing: "2. NO RENOVARÁN DESPUÉS DE HOY:",
    reportTitleLine: "INFORME DIARIO DE RENOVACIÓN DE PÓLIZAS — DAILY REPORT TOOL",
    dateLabel: "Fecha",
    totalsHeader: "RESUMEN DE TOTALES:",
    totalRenewedTodayLbl: "Renovadas hoy",
    totalExpiredTodayLbl: "Expiradas hoy",
    totalNotRenewingLbl: "No renovarán",
    totalGeneralLbl: "Renovadas después de hoy",
    totalGeneralNotRenewingLbl: "No renovarán después de hoy",
    totalRegisteredLbl: "Total registrado",
    dealersTitle: "Informe de dealers",
    dealersSubtitle: "Pólizas vendidas en dealers",
    dealersDesc: "Registre las pólizas vendidas en concesionarios hoy.",
    lblDealerSold: "Vendidas hoy",
    helpDealerSold: "Elija el dealer, luego añada número de póliza y asegurado.",
    phDealerSold: "ej., POL-10928 - Jane Doe",
    dealersSelectPlaceholder: "Seleccionar dealer",
    dealersBrandTag: "DAILY REPORT TOOL",
    dealersSummaryPrefix: "Resumen diario de dealers — ",
    dealersBadgeSold: "vendidas",
    dealersCopyBtn: "Copiar resumen",
    dealersClearBtn: "Limpiar entradas",
    dealersConfirmClear: "¿Está seguro de que desea borrar todas las ventas de dealers de hoy?",
    dealersEmpty: "Aún no hay ventas de dealers.",
    dealersReportTitleLine: "INFORME DIARIO DE VENTAS EN DEALERS — DAILY REPORT TOOL",
    dealersSectionHeader: "PÓLIZAS VENDIDAS POR DEALER:",
    dealersTotalLbl: "Pólizas vendidas",
    dealersNeedDealer: "Seleccione un dealer primero.",
    addBtn: "+ Añadir",
    deleteEntry: "Eliminar entrada"
};

function setTextAll(selector, text) {
    document.querySelectorAll(selector).forEach(el => { el.textContent = text; });
}

function updateUILanguage() {
    const t = translations;

    // Buttons
    const copyReportBtn = document.getElementById('copy-report-btn'); if (copyReportBtn) copyReportBtn.textContent = t.copyBtnText;
    const clearReportBtn = document.getElementById('clear-report-btn'); if (clearReportBtn) clearReportBtn.textContent = t.clearBtnText;

    // Dashboard
    const txtDashTitle = document.getElementById('txt-dash-title'); if (txtDashTitle) txtDashTitle.textContent = t.dashTitle;
    setTextAll('.js-dash-report-title', t.dashReportTitle);
    setTextAll('.js-dash-dealers-title', t.dealersTitle);
    const txtCardToday = document.getElementById('txt-card-today'); if (txtCardToday) txtCardToday.textContent = t.cardToday;
    const txtCardS3 = document.getElementById('txt-card-s3'); if (txtCardS3) txtCardS3.textContent = t.cardS3;
    const txtCardS2 = document.getElementById('txt-card-s2'); if (txtCardS2) txtCardS2.textContent = t.cardS2;
    const txtCardS1 = document.getElementById('txt-card-s1'); if (txtCardS1) txtCardS1.textContent = t.cardS1;

    // Titles & Labels
    const txtReportMainTitle = document.getElementById('txt-report-main-title'); if (txtReportMainTitle) txtReportMainTitle.textContent = t.reportMainTitle;
    const txtManualSubtitle = document.getElementById('txt-manual-subtitle'); if (txtManualSubtitle) txtManualSubtitle.textContent = t.manualSubtitle;
    const txtManualDesc = document.getElementById('txt-manual-desc'); if (txtManualDesc) txtManualDesc.textContent = t.manualDesc;

    const lblPolicy = document.getElementById('lbl-policy'); if (lblPolicy) lblPolicy.textContent = t.lblPolicy;
    const inputPolicyEl = document.getElementById('input-policy'); if (inputPolicyEl) inputPolicyEl.placeholder = t.phPolicy;

    // Category buttons & entry group titles
    setTextAll('.js-cat-group-daily', t.catGroupDaily);
    setTextAll('.js-cat-group-general', t.catGroupGeneral);
    setTextAll('.js-cat-btn-renewed-today', t.catRenewedToday);
    setTextAll('.js-cat-btn-expired-today', t.catExpiredToday);
    setTextAll('.js-cat-btn-not-renewing', t.catNotRenewing);
    setTextAll('.js-cat-btn-general', t.catGeneral);
    setTextAll('.js-cat-btn-general-not-renewing', t.catGeneralNotRenewing);
    setTextAll('.js-cat-title-renewed-today', t.catRenewedToday);
    setTextAll('.js-cat-title-expired-today', t.catExpiredToday);
    setTextAll('.js-cat-title-not-renewing', t.catNotRenewing);
    setTextAll('.js-cat-title-general', t.catTitleGeneral);
    setTextAll('.js-cat-title-general-not-renewing', t.catTitleGeneralNotRenewing);

    // Summary Card Branding & Titles (dashboard + daily report)
    setTextAll('.js-brand-tag', t.brandTag);
    setTextAll('.js-summary-title-prefix', t.summaryTitlePrefix);
    setTextAll('.js-lbl-renewed-today', t.bubbleLblRenewedToday);
    setTextAll('.js-sub-renewed-today', t.bubbleSubRenewedToday);
    setTextAll('.js-lbl-expired-today', t.bubbleLblExpiredToday);
    setTextAll('.js-sub-expired-today', t.bubbleSubExpiredToday);
    setTextAll('.js-lbl-not-renewing', t.bubbleLblNotRenewing);
    setTextAll('.js-sub-not-renewing', t.bubbleSubNotRenewing);
    setTextAll('.js-lbl-general', t.bubbleLblGeneral);
    setTextAll('.js-sub-general', t.bubbleSubGeneral);
    setTextAll('.js-lbl-general-not-renewing', t.bubbleLblGeneralNotRenewing);
    setTextAll('.js-sub-general-not-renewing', t.bubbleSubGeneralNotRenewing);
    setTextAll('.js-lbl-total', t.bubbleLblTotal);
    setTextAll('.js-sub-total', t.bubbleSubTotal);

    const txtDealersTitle = document.getElementById('txt-dealers-title'); if (txtDealersTitle) txtDealersTitle.textContent = t.dealersTitle;
    const txtDealersSubtitle = document.getElementById('txt-dealers-subtitle'); if (txtDealersSubtitle) txtDealersSubtitle.textContent = t.dealersSubtitle;
    const txtDealersDesc = document.getElementById('txt-dealers-desc'); if (txtDealersDesc) txtDealersDesc.textContent = t.dealersDesc;
    const lblDealerSold = document.getElementById('lbl-dealer-sold'); if (lblDealerSold) lblDealerSold.textContent = t.lblDealerSold;
    const helpDealerSold = document.getElementById('help-dealer-sold'); if (helpDealerSold) helpDealerSold.textContent = t.helpDealerSold;
    const inputDealerSold = document.getElementById('input-dealer-sold'); if (inputDealerSold) inputDealerSold.placeholder = t.phDealerSold;
    if (typeof populateDealerSelect === 'function') populateDealerSelect();
    const copyDealersBtnLang = document.getElementById('copy-dealers-btn'); if (copyDealersBtnLang) copyDealersBtnLang.textContent = t.dealersCopyBtn;
    const clearDealersBtnLang = document.getElementById('clear-dealers-btn'); if (clearDealersBtnLang) clearDealersBtnLang.textContent = t.dealersClearBtn;
    setTextAll('.js-dealers-brand-tag', t.dealersBrandTag);
    setTextAll('.js-dealers-summary-prefix', t.dealersSummaryPrefix);

    document.querySelectorAll('.mini-btn').forEach(el => { el.textContent = t.addBtn; });

    renderReportEntries();
    if (typeof renderDealersReport === 'function') renderDealersReport();
    syncAppDates();
}


// ==========================================
// 6. DAILY REPORT MANUAL INPUTS & GENERATOR
// ==========================================
function parseStoredJson(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        const parsed = JSON.parse(raw);
        return parsed ?? fallback;
    } catch {
        return fallback;
    }
}

// Categories: three daily buckets + two general buckets (activity after today)
const REPORT_CATEGORIES = [
    { key: 'renewedToday', btnId: 'add-renewed-today-btn', listId: 'list-renewed-today', countClass: '.js-count-renewed-today' },
    { key: 'expiredToday', btnId: 'add-expired-today-btn', listId: 'list-expired-today', countClass: '.js-count-expired-today' },
    { key: 'notRenewing', btnId: 'add-not-renewing-btn', listId: 'list-not-renewing', countClass: '.js-count-not-renewing' },
    { key: 'general', btnId: 'add-general-btn', listId: 'list-general', countClass: '.js-count-general' },
    { key: 'generalNotRenewing', btnId: 'add-general-not-renewing-btn', listId: 'list-general-not-renewing', countClass: '.js-count-general-not-renewing' }
];

// Accepts both the new schema and the previous one (renewed/otherDateRenewed/expired)
function normalizeReportData(raw) {
    const data = raw && typeof raw === 'object' ? raw : {};
    return {
        renewedToday: data.renewedToday || data.renewed || [],
        expiredToday: data.expiredToday || data.expired || [],
        notRenewing: data.notRenewing || [],
        general: data.general || data.otherDateRenewed || [],
        generalNotRenewing: data.generalNotRenewing || []
    };
}

let dailyReportData = normalizeReportData(parseStoredJson('dprDailyReportData', null));

function saveReportData() {
    localStorage.setItem('dprDailyReportData', JSON.stringify(dailyReportData));
}

// DOM Elements
const inputPolicy = document.getElementById('input-policy');
const reportSummaryBox = document.getElementById('report-summary-box');
const copyReportBtn = document.getElementById('copy-report-btn');
const clearReportBtn = document.getElementById('clear-report-btn');

// Add Item Handlers
let lastCategoryKey = null;

function addReportEntry(categoryKey) {
    if (!inputPolicy) return;
    const value = inputPolicy.value.trim();
    if (!value) {
        inputPolicy.focus();
        return;
    }

    dailyReportData[categoryKey].push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        text: value
    });

    lastCategoryKey = categoryKey;
    inputPolicy.value = '';
    saveReportData();
    renderReportEntries();
    inputPolicy.focus();
}

REPORT_CATEGORIES.forEach(cat => {
    const btn = document.getElementById(cat.btnId);
    if (btn) btn.addEventListener('click', () => addReportEntry(cat.key));
});

// Enter repeats the last category used
if (inputPolicy) inputPolicy.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && lastCategoryKey) addReportEntry(lastCategoryKey);
});

function removeReportEntry(category, id) {
    dailyReportData[category] = dailyReportData[category].filter(item => item.id !== id);
    saveReportData();
    renderReportEntries();
}

// Clear Report
if (clearReportBtn) {
    clearReportBtn.addEventListener('click', () => {
        const t = translations;
        if (confirm(t.confirmClear)) {
            dailyReportData = normalizeReportData(null);
            saveReportData();
            renderReportEntries();
        }
    });
}

// Copy Summary
if (copyReportBtn) {
    copyReportBtn.addEventListener('click', () => {
        const t = translations;
        const textContent = reportSummaryBox.innerText;
        navigator.clipboard.writeText(textContent).then(() => {
            copyReportBtn.textContent = t.copied;
            const summaryPanel = document.getElementById('screenshot-target');
            if (summaryPanel) {
                summaryPanel.classList.remove('copy-pulse');
                void summaryPanel.offsetWidth;
                summaryPanel.classList.add('copy-pulse');
                setTimeout(() => summaryPanel.classList.remove('copy-pulse'), 900);
            }
            setTimeout(() => { copyReportBtn.textContent = t.copyBtnText; }, 2000);
        }).catch(() => {
            alert(t.copyFailed);
        });
    });
}

// Render Report Lists & Generated Text Summary
function sectionBlock(header, items) {
    const t = translations;
    let block = `${header}\n`;
    if (items.length === 0) {
        block += `   • ${t.noneLogged}\n`;
    } else {
        items.forEach((item, idx) => {
            block += `   ${idx + 1}. ${item.text}\n`;
        });
    }
    return block;
}

function renderReportEntries() {
    const t = translations;

    // Render tag lists and per-category counts (report view + dashboard bubbles)
    REPORT_CATEGORIES.forEach(cat => {
        const listElem = document.getElementById(cat.listId);
        if (listElem) renderList(listElem, dailyReportData[cat.key], cat.key);
        setTextAll(cat.countClass, String(dailyReportData[cat.key].length));
    });

    const renewedTodayCount = dailyReportData.renewedToday.length;
    const expiredTodayCount = dailyReportData.expiredToday.length;
    const notRenewingCount = dailyReportData.notRenewing.length;
    const generalCount = dailyReportData.general.length;
    const generalNotRenewingCount = dailyReportData.generalNotRenewing.length;
    const totalCount = renewedTodayCount + expiredTodayCount + notRenewingCount + generalCount + generalNotRenewingCount;

    setTextAll('.js-count-total', String(totalCount));
    setTextAll('.js-report-badge', `${totalCount} ${t.badgeActions}`);

    if (totalCount === 0) {
        setTextAll('.js-report-summary', t.emptySummary);
        return;
    }

    const formattedDate = today.toLocaleDateString(APP_LOCALE, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

    let summaryText = `${t.reportTitleLine}
${t.dateLabel}: ${formattedDate}
==================================================

${t.dailySectionHeader}

`;
    summaryText += sectionBlock(t.hdrRenewedToday, dailyReportData.renewedToday) + '\n';
    summaryText += sectionBlock(t.hdrExpiredToday, dailyReportData.expiredToday) + '\n';
    summaryText += sectionBlock(t.hdrNotRenewing, dailyReportData.notRenewing) + '\n';

    summaryText += `${t.generalSectionHeader}

`;
    summaryText += sectionBlock(t.hdrGeneral, dailyReportData.general) + '\n';
    summaryText += sectionBlock(t.hdrGeneralNotRenewing, dailyReportData.generalNotRenewing);

    summaryText += `
==================================================
${t.totalsHeader}
• ${t.totalRenewedTodayLbl}: ${renewedTodayCount}
• ${t.totalExpiredTodayLbl}: ${expiredTodayCount}
• ${t.totalNotRenewingLbl}: ${notRenewingCount}
• ${t.totalGeneralLbl}: ${generalCount}
• ${t.totalGeneralNotRenewingLbl}: ${generalNotRenewingCount}
• ${t.totalRegisteredLbl}: ${totalCount}
`;

    setTextAll('.js-report-summary', summaryText);
}

function renderList(listElem, itemsArray, category) {
    listElem.replaceChildren();
    itemsArray.forEach(item => {
        const li = document.createElement('li');
        li.className = 'entry-item';

        const textSpan = document.createElement('span');
        textSpan.textContent = item.text;

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-entry-btn';
        removeBtn.title = translations.deleteEntry;
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', () => removeReportEntry(category, item.id));

        li.append(textSpan, removeBtn);
        listElem.appendChild(li);
    });
}

// ==========================================
// 7. DEALERS REPORT
// ==========================================
const DEALERS = [
    'Ford',
    'GMC',
    'Audi',
    'Hyundai',
    'Land Rover',
    'Porsche',
    'Lamborghini',
    'Other',
    'External'
];

let dealersReportData = parseStoredJson('dprDealersReportData', { sold: [] });
dealersReportData.sold = dealersReportData.sold || [];

function saveDealersReportData() {
    localStorage.setItem('dprDealersReportData', JSON.stringify(dealersReportData));
}

const selectDealerEl = document.getElementById('select-dealer');
const inputDealerSoldEl = document.getElementById('input-dealer-sold');
const addDealerSoldBtn = document.getElementById('add-dealer-sold-btn');
const listDealerSold = document.getElementById('list-dealer-sold');
const dealersSummaryBox = document.getElementById('dealers-summary-box');
const dealersTotalBadge = document.getElementById('dealers-total-badge');
const copyDealersBtn = document.getElementById('copy-dealers-btn');
const clearDealersBtn = document.getElementById('clear-dealers-btn');

function populateDealerSelect() {
    if (!selectDealerEl) return;
    const t = translations;
    const current = selectDealerEl.value;
    selectDealerEl.innerHTML = `<option value="">${t.dealersSelectPlaceholder}</option>` +
        DEALERS.map(name => `<option value="${name}">${name}</option>`).join('');
    if (DEALERS.includes(current)) selectDealerEl.value = current;
}

function countByDealer() {
    const counts = Object.fromEntries(DEALERS.map(name => [name, 0]));
    dealersReportData.sold.forEach(item => {
        const dealer = DEALERS.includes(item.dealer) ? item.dealer : 'External';
        counts[dealer] += 1;
    });
    return counts;
}

function addDealerSoldEntry() {
    if (!inputDealerSoldEl || !selectDealerEl) return;
    const t = translations;
    const dealer = selectDealerEl.value;
    const value = inputDealerSoldEl.value.trim();
    if (!dealer) {
        selectDealerEl.focus();
        alert(t.dealersNeedDealer);
        return;
    }
    if (!value) return;
    dealersReportData.sold.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, dealer, text: value });
    inputDealerSoldEl.value = '';
    saveDealersReportData();
    renderDealersReport();
    inputDealerSoldEl.focus();
}

if (addDealerSoldBtn) addDealerSoldBtn.addEventListener('click', addDealerSoldEntry);
if (inputDealerSoldEl) inputDealerSoldEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') addDealerSoldEntry(); });

function removeDealerEntry(id) {
    dealersReportData.sold = dealersReportData.sold.filter(item => item.id !== id);
    saveDealersReportData();
    renderDealersReport();
}

if (clearDealersBtn) {
    clearDealersBtn.addEventListener('click', () => {
        const t = translations;
        if (confirm(t.dealersConfirmClear)) {
            dealersReportData = { sold: [] };
            saveDealersReportData();
            renderDealersReport();
        }
    });
}

if (copyDealersBtn) {
    copyDealersBtn.addEventListener('click', () => {
        const t = translations;
        if (!dealersSummaryBox) return;
        navigator.clipboard.writeText(dealersSummaryBox.innerText).then(() => {
            copyDealersBtn.textContent = t.copied;
            const panel = document.getElementById('dealers-screenshot-target');
            if (panel) {
                panel.classList.remove('copy-pulse');
                void panel.offsetWidth;
                panel.classList.add('copy-pulse');
                setTimeout(() => panel.classList.remove('copy-pulse'), 900);
            }
            setTimeout(() => { copyDealersBtn.textContent = t.dealersCopyBtn; }, 2000);
        }).catch(() => {
            alert(t.copyFailed);
        });
    });
}

function renderDealersReport() {
    const t = translations;
    const sold = dealersReportData.sold;
    const soldCount = sold.length;
    const counts = countByDealer();

    const tallyHtml = DEALERS.map(name => {
        const n = counts[name];
        const active = n > 0 ? ' has-sales' : '';
        return `<div class="dealer-chip${active}">
                <span class="dealer-chip-count">${n}</span>
                <span class="dealer-chip-name">${name}</span>
            </div>`;
    }).join('');
    document.querySelectorAll('.js-dealers-tally').forEach(el => { el.innerHTML = tallyHtml; });

    if (listDealerSold) {
        listDealerSold.replaceChildren();
        DEALERS.forEach(name => {
            const items = sold.filter(item => (DEALERS.includes(item.dealer) ? item.dealer : 'External') === name);
            if (!items.length) return;
            items.forEach(item => {
                const li = document.createElement('li');
                li.className = 'entry-item';

                const textSpan = document.createElement('span');
                const dealerTag = document.createElement('span');
                dealerTag.className = 'entry-dealer-tag';
                dealerTag.textContent = item.dealer || 'External';
                textSpan.appendChild(dealerTag);
                textSpan.append(` ${item.text}`);

                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.className = 'remove-entry-btn';
                removeBtn.title = translations.deleteEntry;
                removeBtn.textContent = '×';
                removeBtn.addEventListener('click', () => removeDealerEntry(item.id));

                li.append(textSpan, removeBtn);
                listDealerSold.appendChild(li);
            });
        });
    }

    setTextAll('.js-dealers-badge', `${soldCount} ${t.dealersBadgeSold}`);

    if (soldCount === 0) {
        setTextAll('.js-dealers-summary', t.dealersEmpty);
        return;
    }

    const locale = APP_LOCALE;
    const formattedDate = today.toLocaleDateString(locale, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    let summaryText = `${t.dealersReportTitleLine}
${t.dateLabel}: ${formattedDate}
==================================================

${t.dealersSectionHeader}
`;
    DEALERS.forEach(name => {
        const items = sold.filter(item => (DEALERS.includes(item.dealer) ? item.dealer : 'External') === name);
        if (!items.length) return;
        summaryText += `\n${name} (${counts[name]})\n`;
        items.forEach((item, idx) => {
            summaryText += `   ${idx + 1}. ${item.text}\n`;
        });
    });
    summaryText += `
==================================================
${t.totalsHeader}
`;
    DEALERS.forEach(name => {
        summaryText += `• ${name}: ${counts[name]}\n`;
    });
    summaryText += `• ${t.dealersTotalLbl}: ${soldCount}
`;
    setTextAll('.js-dealers-summary', summaryText);
}

// Initial UI & Language Initialization
updateUILanguage();
scheduleDateRollover();

