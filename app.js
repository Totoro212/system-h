// ========== QUESTS CONFIG ==========
const DEFAULT_MAIN_QUESTS = [
    { id: 'workout', name: '🏋️ Тренировка', desc: '60 мин — силовая или кардио', stat: 'str' },
    { id: 'code', name: '💻 Код', desc: '3 часа практики программирования', stat: 'int' },
    { id: 'study', name: '🎓 Универ', desc: '2 часа — задания, диплом, предметы', stat: 'int' },
    { id: 'read', name: '📖 Чтение', desc: '30 минут книги', stat: 'wis' },
    { id: 'report', name: '📝 Отчёт дня', desc: 'Что сделал, что понял, план на завтра', stat: 'dsc' }
];

const DEFAULT_BONUS_QUESTS = [
    { id: 'meditate', name: '🧘 Медитация', desc: '10 мин тишины', stat: 'wis' },
    { id: 'english', name: '🇬🇧 Английский', desc: '15 мин практики', stat: 'int' },
    { id: 'cook', name: '🍳 Готовить самому', desc: 'Приготовить нормальную еду', stat: 'end' },
    { id: 'walk', name: '🚶 Прогулка', desc: '30 мин на свежем воздухе', stat: 'end' },
    { id: 'clean', name: '🧹 Порядок', desc: 'Убрать / навести порядок', stat: 'dsc' }
];

// ========== AUTO-UNLOCK KEYS ==========
// Keys unlock automatically when condition is met
const AUTO_KEYS = [
    {
        name: '🔥 Первая неделя',
        desc: '7 дней подряд без пропуска',
        check: (d) => calcStreak() >= 7 || d.bestStreak >= 7,
        reward: 50
    },
    {
        name: '💪 Стальное тело',
        desc: 'Выполни 30 тренировок',
        check: (d) => (d.stats.str || 0) >= 30,
        progress: (d) => `${Math.min(d.stats.str || 0, 30)} / 30`,
        reward: 50
    },
    {
        name: '🧠 Острый ум',
        desc: 'Выполни 50 сессий кода или учёбы',
        check: (d) => (d.stats.int || 0) >= 50,
        progress: (d) => `${Math.min(d.stats.int || 0, 50)} / 50`,
        reward: 50
    },
    {
        name: '📚 Мудрец',
        desc: 'Выполни 20 сессий чтения',
        check: (d) => (d.stats.wis || 0) >= 20,
        progress: (d) => `${Math.min(d.stats.wis || 0, 20)} / 20`,
        reward: 50
    },
    {
        name: '⚡ Несокрушимый',
        desc: '30 дней подряд без пропуска',
        check: (d) => calcStreak() >= 30 || d.bestStreak >= 30,
        reward: 100
    },
    {
        name: '🏆 Полтысячи',
        desc: 'Набери 500 очков',
        check: (d) => d.totalPoints >= 500,
        progress: (d) => `${Math.min(d.totalPoints, 500)} / 500`,
        reward: 50
    },
    {
        name: '🎖️ Дисциплина мастера',
        desc: 'DSC стат достигнет 30',
        check: (d) => (d.stats.dsc || 0) >= 30,
        progress: (d) => `${Math.min(d.stats.dsc || 0, 30)} / 30`,
        reward: 50
    },
    {
        name: '⭐ Выносливость',
        desc: 'END стат достигнет 25',
        check: (d) => (d.stats.end || 0) >= 25,
        progress: (d) => `${Math.min(d.stats.end || 0, 25)} / 25`,
        reward: 50
    },
    {
        name: '👑 Монарх',
        desc: 'Набери 2000 очков и достигни S-ранга',
        check: (d) => d.totalPoints >= 2000,
        progress: (d) => `${Math.min(d.totalPoints, 2000)} / 2000`,
        reward: 200
    }
];

// ========== RANKS ==========
const RANKS = [
    { name: 'E-РАНГ', title: 'Новичок', min: 0, max: 100 },
    { name: 'D-РАНГ', title: 'Охотник', min: 100, max: 300 },
    { name: 'C-РАНГ', title: 'Воин', min: 300, max: 600 },
    { name: 'B-РАНГ', title: 'Элита', min: 600, max: 1000 },
    { name: 'A-РАНГ', title: 'Мастер', min: 1000, max: 2000 },
    { name: 'S-РАНГ', title: 'Монарх', min: 2000, max: Infinity }
];

const WEEKLY_RULES = [
    'Приходи вовремя. Всегда.',
    'Хвали одного человека в день вслух.',
    'Не давай советов, если не просят.',
    'Когда хочешь залипнуть в телефон — сделай 20 отжиманий.',
    'Говори "нет" без оправданий.',
    'Признавай ошибки сразу.',
    'Слушай, не перебивая.',
    'Сравнивай себя только с собой вчерашним.'
];

const STAT_NAMES = {
    str: 'STR — Сила',
    end: 'END — Выносливость',
    int: 'INT — Интеллект',
    wis: 'WIS — Мудрость',
    dsc: 'DSC — Дисциплина'
};

// ========== STORAGE ==========
function getToday() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadData() {
    const saved = localStorage.getItem('hunterSystem');
    if (saved) {
        const d = JSON.parse(saved);
        if (!d.mainQuests) d.mainQuests = DEFAULT_MAIN_QUESTS;
        if (!d.bonusQuests) d.bonusQuests = DEFAULT_BONUS_QUESTS;
        if (!d.stats) d.stats = { str: 0, end: 0, int: 0, wis: 0, dsc: 0 };
        if (!d.days) d.days = {};
        if (!d.startDate) d.startDate = getToday();
        if (!d.unlockedKeys) d.unlockedKeys = [];
        if (d.totalPoints === undefined) d.totalPoints = 0;
        if (d.bestStreak === undefined) d.bestStreak = 0;
        // Remove old fields
        delete d.milestones;
        delete d.keys;
        return d;
    }
    return {
        totalPoints: 0,
        bestStreak: 0,
        startDate: getToday(),
        stats: { str: 0, end: 0, int: 0, wis: 0, dsc: 0 },
        mainQuests: DEFAULT_MAIN_QUESTS,
        bonusQuests: DEFAULT_BONUS_QUESTS,
        unlockedKeys: [],
        days: {},
        penalty: false
    };
}

function saveData() {
    localStorage.setItem('hunterSystem', JSON.stringify(data));
}

let data = loadData();

// ========== UTILITIES ==========
function getDayData(date) {
    if (!data.days[date]) {
        data.days[date] = { main: [], bonus: [], points: 0, done: false };
    }
    return data.days[date];
}

function getRank(points) {
    for (let i = RANKS.length - 1; i >= 0; i--) {
        if (points >= RANKS[i].min) return RANKS[i];
    }
    return RANKS[0];
}

function getRankIndex(points) {
    for (let i = RANKS.length - 1; i >= 0; i--) {
        if (points >= RANKS[i].min) return i;
    }
    return 0;
}

function calcStreak() {
    let streak = 0;
    const today = new Date();
    const todayStr = getToday();
    const todayData = data.days[todayStr];
    const mainCount = data.mainQuests.length;
    if (todayData && todayData.main && todayData.main.length === mainCount) {
        streak = 1;
    }
    let checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - 1);
    while (true) {
        const ds = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
        const dd = data.days[ds];
        if (dd && dd.main && dd.main.length >= mainCount) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else break;
    }
    return streak;
}

function calcDaysInSystem() {
    const today = getToday();
    const start = data.startDate || today;
    // Parse as local dates to avoid timezone issues
    const [sy, sm, sd] = start.split('-').map(Number);
    const [ty, tm, td] = today.split('-').map(Number);
    const startDate = new Date(sy, sm - 1, sd);
    const todayDate = new Date(ty, tm - 1, td);
    return Math.max(1, Math.round((todayDate - startDate) / 86400000) + 1);
}

function getWeekNumber() {
    const start = new Date(data.startDate || getToday());
    return Math.floor((new Date() - start) / 604800000);
}

function genId() {
    return 'q' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

function checkPenalty() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    const yData = data.days[yStr];
    if (yData && yData.done) return data.penalty || false;
    if (yData && yData.main && yData.main.length < Math.ceil(data.mainQuests.length / 2)) {
        if (yData.main.length > 0 || yData.bonus.length > 0) return true;
    }
    if (!yData && data.startDate && yStr >= data.startDate) return true;
    return data.penalty || false;
}

// ========== NAVIGATION ==========
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(`page-${page}`).classList.add('active');
        editModeMain = false; editModeBonus = false;
        updateEditButtons();
        refreshPage(page);
    });
});

function refreshPage(page) {
    if (page === 'dashboard') updateDashboard();
    if (page === 'quests') { renderQuests(); updateQuestStates(); }
    if (page === 'keys') renderKeys();
    if (page === 'stats') updateStats();
    if (page === 'history') updateCalendar();
}

// ========== DASHBOARD ==========
function updateDashboard() {
    const rank = getRank(data.totalPoints);
    const rankIdx = getRankIndex(data.totalPoints);

    document.getElementById('rank-name').textContent = rank.name;
    document.getElementById('rank-title').textContent = rank.title;

    const progress = rank.max === Infinity ? 100 : ((data.totalPoints - rank.min) / (rank.max - rank.min)) * 100;
    document.getElementById('rank-progress').style.width = `${Math.min(100, progress)}%`;
    document.getElementById('progress-label').textContent = rank.max === Infinity ? `${data.totalPoints} ∞` : `${data.totalPoints} / ${rank.max}`;
    document.getElementById('total-points').textContent = data.totalPoints;

    const streak = calcStreak();
    document.getElementById('streak-count').textContent = streak;
    if (streak > data.bestStreak) { data.bestStreak = streak; saveData(); }

    const today = getToday();
    const todayData = getDayData(today);
    document.getElementById('today-done').textContent = `${todayData.main.length}/${data.mainQuests.length}`;

    const keysUnlocked = data.unlockedKeys.length;
    document.getElementById('keys-unlocked').textContent = `${keysUnlocked}/${AUTO_KEYS.length}`;

    document.getElementById('day-counter').textContent = `ДЕНЬ ${calcDaysInSystem()}`;
    document.getElementById('penalty-banner').classList.toggle('hidden', !checkPenalty());

    const weekNum = getWeekNumber();
    document.getElementById('weekly-rule').textContent = WEEKLY_RULES[weekNum % WEEKLY_RULES.length];

    // Check auto-unlock keys
    checkAutoKeys();
}

document.getElementById('btn-clear-penalty').addEventListener('click', () => {
    data.penalty = false;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    if (!data.days[yStr]) data.days[yStr] = { main: [], bonus: [], points: 0, done: true };
    else data.days[yStr].done = true;
    saveData();
    showModal('ШТРАФ ОТРАБОТАН', '100 отжиманий ✅\n100 приседаний ✅\n2 км ✅\n\nТы сильнее, чем вчера.');
    updateDashboard();
});

// ========== AUTO KEYS CHECK ==========
function checkAutoKeys() {
    AUTO_KEYS.forEach((key, idx) => {
        if (data.unlockedKeys.includes(idx)) return;
        if (key.check(data)) {
            data.unlockedKeys.push(idx);
            data.totalPoints += key.reward;
            saveData();
            setTimeout(() => {
                showModal('🗝️ КЛЮЧ РАЗБЛОКИРОВАН!', `"${key.name}"\n\n${key.desc}\n\n+${key.reward} очков!`);
            }, 500);
        }
    });
}

// ========== QUEST RENDERING ==========
let editModeMain = false;
let editModeBonus = false;

function renderQuestItem(quest, isBonus) {
    const div = document.createElement('div');
    div.className = `quest-item${isBonus ? ' bonus' : ''}`;
    div.dataset.quest = quest.id;
    div.innerHTML = `
        <div class="quest-check"></div>
        <div class="quest-info">
            <div class="quest-name">${quest.name}</div>
            <div class="quest-desc">${quest.desc}</div>
        </div>
        <div class="quest-stat">${quest.stat.toUpperCase()}</div>
        <div class="quest-edit-btns">
            <button class="btn-quest-edit">✏️</button>
            <button class="btn-quest-delete">🗑️</button>
        </div>
    `;
    div.addEventListener('click', (e) => {
        if (e.target.closest('.quest-edit-btns')) return;
        if (editModeMain || editModeBonus) return;
        toggleQuest(quest.id, isBonus);
    });
    div.querySelector('.btn-quest-edit').addEventListener('click', (e) => {
        e.stopPropagation();
        openEditModal(isBonus ? 'bonus' : 'main', quest);
    });
    div.querySelector('.btn-quest-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`Удалить "${quest.name}"?`)) {
            deleteQuest(quest.id, isBonus);
        }
    });
    return div;
}

function renderQuests() {
    const mc = document.getElementById('main-quests');
    const bc = document.getElementById('bonus-quests');
    mc.innerHTML = '';
    bc.innerHTML = '';
    data.mainQuests.forEach(q => mc.appendChild(renderQuestItem(q, false)));
    data.bonusQuests.forEach(q => bc.appendChild(renderQuestItem(q, true)));
    mc.classList.toggle('editing', editModeMain);
    bc.classList.toggle('editing', editModeBonus);
}

function updateQuestStates() {
    const today = getToday();
    const todayData = getDayData(today);
    const d = new Date();
    const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    document.getElementById('quest-date').textContent = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    document.querySelectorAll('.quest-item').forEach(item => {
        const qid = item.dataset.quest;
        item.classList.toggle('completed', todayData.main.includes(qid) || todayData.bonus.includes(qid));
    });
}

function toggleQuest(questId, isBonus) {
    const today = getToday();
    const todayData = getDayData(today);
    const list = isBonus ? todayData.bonus : todayData.main;
    const quest = (isBonus ? data.bonusQuests : data.mainQuests).find(q => q.id === questId);
    if (!quest) return;

    const item = document.querySelector(`.quest-item[data-quest="${questId}"]`);

    if (list.includes(questId)) {
        list.splice(list.indexOf(questId), 1);
        if (item) item.classList.remove('completed');
        data.totalPoints = Math.max(0, data.totalPoints - 2);
        todayData.points = Math.max(0, todayData.points - 2);
        if (quest.stat) data.stats[quest.stat] = Math.max(0, (data.stats[quest.stat] || 0) - 1);
    } else {
        list.push(questId);
        if (item) {
            item.classList.add('completed', 'just-completed');
            setTimeout(() => item.classList.remove('just-completed'), 300);
        }
        data.totalPoints += 2;
        todayData.points += 2;
        if (quest.stat) data.stats[quest.stat] = (data.stats[quest.stat] || 0) + 1;
        showPointsPopup('+2');

        if (!isBonus && todayData.main.length === data.mainQuests.length) {
            showModal('КВЕСТЫ ВЫПОЛНЕНЫ!', `Все ежедневные квесты на сегодня!\n+${data.mainQuests.length * 2} очков\n\nОтличная работа, Охотник.`);
            const prev = getRankIndex(data.totalPoints - 2);
            const cur = getRankIndex(data.totalPoints);
            if (cur > prev) {
                setTimeout(() => showModal('RANK UP!', `${RANKS[cur].name}\n"${RANKS[cur].title}"\n\nПродолжай!`), 1500);
            }
        }
    }
    todayData.done = todayData.main.length >= Math.ceil(data.mainQuests.length / 2);
    saveData();
    updateDashboard();
}

function deleteQuest(questId, isBonus) {
    const list = isBonus ? data.bonusQuests : data.mainQuests;
    const idx = list.findIndex(q => q.id === questId);
    if (idx !== -1) list.splice(idx, 1);
    saveData();
    renderQuests();
    updateQuestStates();
    updateDashboard();
}

// ========== EDIT TOGGLES ==========
function updateEditButtons() {
    document.getElementById('btn-edit-main').classList.toggle('active', editModeMain);
    document.getElementById('btn-edit-bonus').classList.toggle('active', editModeBonus);
    document.getElementById('btn-add-main').classList.toggle('hidden', !editModeMain);
    document.getElementById('btn-add-bonus').classList.toggle('hidden', !editModeBonus);
    document.getElementById('main-quests').classList.toggle('editing', editModeMain);
    document.getElementById('bonus-quests').classList.toggle('editing', editModeBonus);
}

document.getElementById('btn-edit-main').addEventListener('click', () => {
    editModeMain = !editModeMain; editModeBonus = false; updateEditButtons();
});
document.getElementById('btn-edit-bonus').addEventListener('click', () => {
    editModeBonus = !editModeBonus; editModeMain = false; updateEditButtons();
});
document.getElementById('btn-add-main').addEventListener('click', () => openEditModal('main', null));
document.getElementById('btn-add-bonus').addEventListener('click', () => openEditModal('bonus', null));

// ========== EDIT MODAL ==========
let editContext = { type: null, item: null };

function openEditModal(type, item) {
    editContext = { type, item };
    document.getElementById('edit-modal-title').textContent = item ? 'Редактировать квест' : 'Новый квест';
    document.getElementById('edit-name').value = item ? item.name : '';
    document.getElementById('edit-desc').value = item ? item.desc : '';
    document.getElementById('edit-stat').value = item ? item.stat : 'str';
    document.getElementById('edit-stat-label').style.display = '';
    document.getElementById('edit-modal-overlay').classList.remove('hidden');
    setTimeout(() => document.getElementById('edit-name').focus(), 100);
}

document.getElementById('edit-cancel').addEventListener('click', () => {
    document.getElementById('edit-modal-overlay').classList.add('hidden');
});
document.getElementById('edit-modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'edit-modal-overlay') document.getElementById('edit-modal-overlay').classList.add('hidden');
});

document.getElementById('edit-save').addEventListener('click', () => {
    const name = document.getElementById('edit-name').value.trim();
    const desc = document.getElementById('edit-desc').value.trim();
    const stat = document.getElementById('edit-stat').value;
    if (!name) return;

    const { type, item } = editContext;
    const list = type === 'main' ? data.mainQuests : data.bonusQuests;

    if (item) {
        const q = list.find(q => q.id === item.id);
        if (q) { q.name = name; q.desc = desc; q.stat = stat; }
    } else {
        list.push({ id: genId(), name, desc, stat });
    }
    saveData();
    renderQuests();
    updateQuestStates();
    updateDashboard();
    document.getElementById('edit-modal-overlay').classList.add('hidden');
});

// ========== KEYS (auto-unlock) ==========
function renderKeys() {
    const container = document.getElementById('keys-list');
    container.innerHTML = '';

    AUTO_KEYS.forEach((key, idx) => {
        const unlocked = data.unlockedKeys.includes(idx);
        const div = document.createElement('div');
        div.className = `key-item${unlocked ? ' unlocked' : ''}`;

        let progressHtml = '';
        if (!unlocked && key.progress) {
            progressHtml = `<div class="key-progress">${key.progress(data)}</div>`;
        }

        div.innerHTML = `
            <div class="key-icon ${unlocked ? '' : 'locked'}">${unlocked ? '🗝️' : '🔒'}</div>
            <div class="key-info">
                <div class="key-name">${key.name}</div>
                <div class="key-desc">${key.desc}</div>
                ${progressHtml}
            </div>
            <div class="key-reward">${unlocked ? '✅' : `+${key.reward}`}</div>
        `;
        container.appendChild(div);
    });

    // Hide edit button for keys since they're auto
    document.getElementById('btn-edit-keys').style.display = 'none';
    document.getElementById('btn-add-key').style.display = 'none';
}

// ========== STATS ==========
function updateStats() {
    const container = document.getElementById('stats-bars');
    container.innerHTML = '';
    const stats = data.stats;
    const maxStat = Math.max(10, ...Object.values(stats));

    Object.entries(STAT_NAMES).forEach(([key, label]) => {
        const val = stats[key] || 0;
        const pct = (val / maxStat) * 100;
        const div = document.createElement('div');
        div.className = 'stat-bar-item';
        div.innerHTML = `
            <div class="stat-bar-label"><span>${label}</span><span class="stat-bar-value">${val}</span></div>
            <div class="stat-bar-track"><div class="stat-bar-fill ${key}" style="width:${Math.min(100, pct)}%"></div></div>
        `;
        container.appendChild(div);
    });

    document.getElementById('stats-total-points').textContent = data.totalPoints;
    document.getElementById('stats-best-streak').textContent = data.bestStreak;
    document.getElementById('stats-total-days').textContent = calcDaysInSystem();
}

// ========== CALENDAR ==========
let calMonth = new Date().getMonth();
let calYear = new Date().getFullYear();

function updateCalendar() {
    const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    document.getElementById('month-label').textContent = `${months[calMonth]} ${calYear}`;

    const container = document.getElementById('calendar-days');
    container.innerHTML = '';

    let startDow = new Date(calYear, calMonth, 1).getDay();
    startDow = startDow === 0 ? 6 : startDow - 1;
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const todayStr = getToday();
    const mc = data.mainQuests.length;

    for (let i = 0; i < startDow; i++) {
        const e = document.createElement('div');
        e.className = 'cal-day';
        container.appendChild(e);
    }
    for (let d = 1; d <= daysInMonth; d++) {
        const ds = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const cell = document.createElement('div');
        cell.className = 'cal-day';
        cell.textContent = d;
        if (ds === todayStr) cell.classList.add('today');
        const dd = data.days[ds];
        if (dd && dd.main) {
            if (dd.main.length >= mc) cell.classList.add('green');
            else if (dd.main.length > 0) cell.classList.add('yellow');
            else if (ds < todayStr && ds >= data.startDate) cell.classList.add('red');
        } else if (ds < todayStr && ds >= (data.startDate || todayStr)) {
            cell.classList.add('red');
        }
        container.appendChild(cell);
    }
}

document.getElementById('prev-month').addEventListener('click', () => {
    calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } updateCalendar();
});
document.getElementById('next-month').addEventListener('click', () => {
    calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } updateCalendar();
});

// ========== MODALS ==========
function showModal(title, content) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-content').textContent = content;
    document.getElementById('modal-overlay').classList.remove('hidden');
}
document.getElementById('modal-close').addEventListener('click', () => document.getElementById('modal-overlay').classList.add('hidden'));
document.getElementById('modal-overlay').addEventListener('click', (e) => { if (e.target.id === 'modal-overlay') document.getElementById('modal-overlay').classList.add('hidden'); });

function showPointsPopup(text) {
    const p = document.createElement('div');
    p.className = 'points-popup';
    p.textContent = text;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1000);
}

// ========== EXPORT & RESET ==========
document.getElementById('btn-export').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hunter-backup-${getToday()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showModal('💾 ДАННЫЕ СОХРАНЕНЫ', 'Файл скачан.\nИспользуй его для восстановления прогресса если что-то случится.');
});

document.getElementById('btn-reset').addEventListener('click', () => {
    if (!confirm('⚠️ Ты уверен? ВСЕ данные будут удалены: очки, статы, streak, история.')) return;
    if (!confirm('☠️ ТОЧНО? Это действие НЕЛЬЗЯ отменить. Сначала сохрани данные если нужно.')) return;
    localStorage.removeItem('hunterSystem');
    location.reload();
});

// ========== PWA ==========
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
}

// ========== INIT ==========
// Clear old data format if needed
(function migrate() {
    const raw = localStorage.getItem('hunterSystem');
    if (raw) {
        try {
            const old = JSON.parse(raw);
            if (old.milestones || old.keys) {
                // Old format → reset keys
                delete old.milestones;
                delete old.keys;
                old.unlockedKeys = [];
                localStorage.setItem('hunterSystem', JSON.stringify(old));
            }
        } catch(e) {}
    }
})();

data = loadData();

function init() {
    const today = getToday();
    // Fix: if startDate is missing or in the future, reset it
    if (!data.startDate || data.startDate > today) {
        data.startDate = today;
        saveData();
    }
    updateDashboard();
    renderQuests();
    updateQuestStates();
    renderKeys();
    updateStats();
    updateCalendar();
}

init();
