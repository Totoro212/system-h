// ========== QUESTS CONFIG ==========
const DEFAULT_MAIN_QUESTS = [
    { id: 'activity', name: '🏃 Физическая активность', desc: 'Тренировка, прогулка или растяжка', stat: 'str' },
    { id: 'code', name: '💻 Код', desc: '1–3 часа практики программирования', stat: 'int' },
    { id: 'selfdev', name: '🧠 Саморазвитие', desc: 'Учёба, курсы, новый навык', stat: 'wis' },
    { id: 'read', name: '📖 Чтение', desc: '30 минут книги', stat: 'wis' }
];

const ALL_BONUS_QUESTS = [
    { id: 'meditate', name: '🧘 Медитация', desc: '10 мин тишины', stat: 'wis' },
    { id: 'english', name: '🇬🇧 Английский', desc: '15 мин практики', stat: 'int' },
    { id: 'cook', name: '🍳 Готовить самому', desc: 'Нормальная еда', stat: 'end' },
    { id: 'uni', name: '🎓 Универ', desc: 'Задания, диплом, пары', stat: 'int' },
    { id: 'reflect', name: '📝 Рефлексия', desc: 'Что сделал и понял', stat: 'dsc' },
    { id: 'stretch', name: '🤸 Растяжка', desc: '15 минут йоги', stat: 'str' },
    { id: 'clean', name: '🧹 Уборка', desc: 'Навести порядок вокруг', stat: 'dsc' },
    { id: 'water', name: '💧 Водный баланс', desc: 'Выпить 2л воды за день', stat: 'end' },
    { id: 'journal', name: '📓 Дневник', desc: 'Записать мысли и планы', stat: 'wis' },
    { id: 'walk', name: '🚶 Прогулка', desc: '30 минут на свежем воздухе', stat: 'end' },
    { id: 'finance', name: '💰 Финансы', desc: 'Записать расходы за день', stat: 'dsc' },
    { id: 'family', name: '📞 Близкие', desc: 'Позвонить/написать родным', stat: 'wis' }
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

const WEEKLY_CHALLENGES = [
    'Неделя без сахара',
    'Каждый день готовить самому',
    '30 мин без телефона после пробуждения',
    'Читать 40 страниц в день (вместо 20)',
    'Никакого фастфуда и снеков всю неделю',
    'Ложиться спать до 23:00',
    'Отказаться от кофеина после 14:00',
    '15 минут медитации каждый день'
];

// ========== TRAINING PLAN ==========
const TRAINING = {
    push: {
        title: 'PUSH — грудь, плечи, трицепс',
        time: '~45 мин',
        warmup: {
            items: ['Jumping jacks — 45 сек', 'Бег на месте — 45 сек'],
            mobility: ['Вращения плечами вперёд + назад — по 10 раз', 'Круговые вращения руками (большие круги) — 10 раз', 'Вращения в локтях — 10 раз'],
            specific: '8–10 лёгких отжиманий от пола (медленно, с полной амплитудой)'
        },
        exercises: [
            {
                name: 'Отжимания на брусьях', sets: '4×13', rest: '90 сек',
                muscles: 'грудь, трицепс, передняя дельта',
                technique: ['Наклон корпуса вперёд ~30° = больше грудь', 'Корпус вертикально = больше трицепс', 'Не разгибай локти полностью в верхней точке (береги суставы)', 'Опускайся до угла 90° в локтях'],
                progression: 'Когда делаешь 4×12 легко → добавь рюкзак с весом (2–5 кг)'
            },
            {
                name: 'Отжимания — широкий хват', sets: '3×14', rest: '60 сек',
                muscles: 'грудь (акцент), передняя дельта',
                technique: ['Руки шире плеч на 1.5 ладони', 'Тело — прямая линия (не прогибай поясницу!)', 'Касайся грудью пола'],
                progression: 'Ноги на возвышении (стул/скамья) → увеличивает нагрузку на верх груди'
            },
            {
                name: 'Алмазные отжимания (узкий хват)', sets: '3×12', rest: '60 сек',
                muscles: 'трицепс (акцент), грудь',
                technique: ['Руки вместе, большие и указательные пальцы образуют «алмаз»', 'Локти вдоль тела', 'Полная амплитуда'],
                progression: 'Ноги на возвышении / замедленное опускание (3 сек вниз)'
            },
            {
                name: 'Пайк-отжимания (Pike Push-Ups)', sets: '3×10', rest: '90 сек',
                muscles: 'передняя дельта, трицепс',
                technique: ['Встань в перевёрнутую «V» — руки и ноги на полу, таз вверх', 'Опускай голову к полу между руками', 'Чем ближе ноги к рукам — тем сложнее'],
                progression: 'Ноги на возвышении → со временем → стойка на руках у стены'
            },
            {
                name: 'Разводки гантелей в стороны', sets: '3×14', rest: '45 сек',
                muscles: 'средний пучок дельт (создаёт ширину плеч)',
                weight: '7 кг — подходит, это изоляция',
                technique: ['Стоя, руки с гантелями по бокам', 'Поднимай руки в стороны до уровня плеч (не выше!)', 'Локти слегка согнуты, мизинец чуть выше большого пальца', 'Опускай медленно (2 сек вниз)'],
                progression: 'Увеличивай вес / замедляй негативную фазу'
            },
            {
                name: '⭐ Жим гантелей стоя', sets: '3×10–12', rest: '60 сек',
                muscles: 'дельты, трицепс', optional: true,
                weight: '7 кг — подходит',
                technique: ['Стоя, гантели на уровне плеч', 'Жми вверх до полного выпрямления рук', 'Контролируй спуск'],
                progression: 'Увеличивай вес гантелей'
            }
        ],
        cooldown: ['Растяжка груди — руку на дверной косяк, повернись от неё — 30 сек', 'Растяжка трицепса — руку за голову, потяни за локоть — 30 сек', 'Растяжка плеч — руку перед собой, прижми к груди — 30 сек', 'Дыхание: вдох 4 сек → выдох 6 сек × 5 раз']
    },
    pull: {
        title: 'PULL — спина, бицепс',
        time: '~45 мин',
        warmup: {
            items: ['Jumping jacks — 45 сек', 'Бег на месте — 45 сек'],
            mobility: ['Вращения плечами вперёд + назад — по 10 раз', 'Круговые вращения руками (большие круги) — 10 раз', 'Вращения запястий — 10 раз в каждую сторону'],
            specific: '3–5 лёгких подтягиваний (или повиси на турнике 15 сек)'
        },
        exercises: [
            {
                name: 'Подтягивания — широкий хват', sets: '4×9', rest: '120 сек',
                muscles: 'широчайшие («крылья»), большая круглая, бицепс',
                technique: ['Хват шире плеч, ладони от себя', 'Тяни ЛОКТИ вниз и назад, а не руки', 'Подбородок выше перекладины', 'Опускайся ПЛАВНО (2–3 сек негативная фаза = больше рост!)'],
                alt: 'Если не можешь 6 раз: негативные подтягивания (запрыгни наверх, опускайся медленно 5 сек × 5–8 раз) или резиновая лента',
                progression: 'Когда делаешь 4×10 → добавь вес (рюкзак)'
            },
            {
                name: 'Подтягивания — обратный хват', sets: '3×10', rest: '90 сек',
                muscles: 'бицепс (акцент), нижняя часть широчайших',
                technique: ['Хват на ширине плеч, ладони к себе', 'Сведи лопатки в верхней точке', 'Контролируй спуск'],
                progression: 'Добавь вес или замедли негативную фазу до 4 сек'
            },
            {
                name: 'Австралийские подтягивания', sets: '3×13', rest: '60 сек',
                muscles: 'средняя часть спины, задние дельты, бицепс',
                technique: ['Используй низкий турник или полотенце на обычном турнике', 'Тело прямое, пятки на полу', 'Тяни грудь к перекладине'],
                alt: 'Если нет низкого турника: замени на тягу гантели в наклоне',
                progression: 'Поднимай ноги на возвышение → увеличивает нагрузку'
            },
            {
                name: 'Тяга гантели в наклоне (одной рукой)', sets: '3×12 /руку', rest: '60 сек',
                muscles: 'широчайшие, ромбовидные, бицепс',
                weight: '10–15 кг. Задержка 2 сек в верхней точке + медленный спуск 3 сек',
                technique: ['Одно колено и рука на скамье/стуле', 'Спина параллельна полу', 'Тяни гантель к бедру, не к груди', 'Сведи лопатку в верхней точке, задержись на 2 сек'],
                progression: 'Увеличивай вес гантели'
            },
            {
                name: 'Обратные разводки в наклоне', sets: '3×14', rest: '45 сек',
                muscles: 'задний пучок дельт, ромбовидные',
                weight: '7 кг — подходит, это изоляция',
                technique: ['Наклонись вперёд ~45°, спина прямая', 'Руки с гантелями внизу, локти слегка согнуты', 'Разводи руки в стороны, сводя лопатки', 'Медленно опускай (2 сек вниз)'],
                progression: 'Увеличивай вес / добавь паузу в верхней точке'
            },
            {
                name: '⭐ Молотковые сгибания', sets: '3×12', rest: '60 сек',
                muscles: 'бицепс (длинная головка), брахиалис, предплечье', optional: true,
                weight: '7 кг — подходит',
                technique: ['Гантели нейтральным хватом (ладони друг к другу)', 'Не раскачивай тело', 'Контролируемый подъём и спуск'],
                progression: 'Увеличивай вес'
            },
            {
                name: 'Вис на турнике (мёртвый вис)', sets: '3×30 сек', rest: '—',
                muscles: 'хват, предплечья',
                technique: ['Просто виси с расслабленными плечами'],
                progression: 'Увеличивай время. Бонус: декомпрессия позвоночника'
            }
        ],
        cooldown: ['Растяжка бицепса — вытяни руку ладонью вверх, другой рукой потяни пальцы вниз — 30 сек', 'Дыхание: вдох 4 сек → выдох 6 сек × 5 раз']
    },
    legs: {
        title: 'LEGS + CORE — ноги, ягодицы, пресс',
        time: '~45 мин',
        note: '⚠️ Многие пропускают день ног. НЕ ПРОПУСКАЙ. Ноги = 60% мышечной массы тела. Максимальный выброс тестостерона и гормона роста.',
        warmup: {
            items: ['Jumping jacks — 45 сек', 'Бег на месте с высоким подниманием колен — 45 сек'],
            mobility: ['Круговые вращения тазом — 10 раз', 'Вращения коленей (руки на коленях) — 10 раз', 'Вращения голеностопа — 10 раз на каждую ногу'],
            specific: '10 приседаний без веса (медленно, с полной амплитудой)'
        },
        exercises: [
            {
                name: 'Приседания (гоблет)', sets: '4×13', rest: '90 сек',
                muscles: 'квадрицепсы, ягодицы, задняя поверхность бедра',
                weight: '10–15 кг (гоблет у груди). Темп: 3 сек вниз, пауза 2 сек внизу, 1 сек вверх',
                technique: ['Стопы на ширине плеч, носки слегка наружу', 'Садись так, будто садишься на стул за спиной', 'Колени движутся по направлению носков (не внутрь!)', 'Спина прямая, взгляд вперёд', 'Опускайся до параллели бёдер с полом (или ниже)'],
                progression: 'Болгарские сплит-приседания → добавляй вес гантелей'
            },
            {
                name: 'Выпады', sets: '3×14 /ногу', rest: '60 сек',
                muscles: 'ягодицы (акцент), квадрицепсы, стабилизаторы',
                weight: '10+ кг в каждой руке, или без веса с медленным темпом (3 сек вниз)',
                technique: ['Широкий шаг вперёд', 'Заднее колено почти касается пола', 'Переднее колено не выходит далеко за носок', 'Корпус вертикально'],
                progression: 'С гантелями в руках (когда будут тяжелее)'
            },
            {
                name: 'Румынская тяга (Romanian Deadlift)', sets: '3×12', rest: '90 сек',
                muscles: 'задняя поверхность бедра (хамстринги), ягодицы, разгибатели спины',
                weight: '10–15 кг в каждой руке',
                technique: ['Стоя, гантели перед бёдрами', 'Наклоняйся вперёд, отводя таз назад (как будто закрываешь дверь ягодицами)', 'Спина АБСОЛЮТНО ПРЯМАЯ — никогда не округляй!', 'Гантели скользят вдоль ног (близко к телу)', 'Опускайся до середины голени → почувствуй растяжение хамстрингов', 'Колени слегка согнуты (не блокируй их!)'],
                progression: 'Увеличивай вес гантелей'
            },
            {
                name: 'Ягодичный мостик', sets: '3×18', rest: '60 сек',
                muscles: 'ягодицы, задняя поверхность бедра, мышцы тазового дна',
                weight: 'Одноногий вариант без веса, или 15+ кг на таз. Пауза 3 сек вверху',
                technique: ['Лёжа на спине, ноги согнуты, стопы на полу', 'Поднимай таз, сжимая ягодицы в верхней точке (задержись на 3 сек)', 'Не прогибай поясницу чрезмерно'],
                alt: 'Это упражнение напрямую улучшает кровообращение в тазовой области (Dorey et al., 2005)',
                progression: 'Одноногий вариант → с тяжёлой гантелью на тазу'
            },
            {
                name: 'Подъём ног в висе на турнике', sets: '3×13', rest: '60 сек',
                muscles: 'прямая мышца живота, косые, сгибатели бедра',
                technique: ['Виси на турнике, ноги вместе', 'Поднимай прямые ноги до параллели с полом (или выше)', 'Если слишком сложно — поднимай согнутые колени к груди', 'НЕ раскачивайся!'],
                alt: 'Лучшее упражнение на пресс: ЭМГ-исследования показывают максимальную активацию',
                progression: 'Прямые ноги → ноги к перекладине → с утяжелителями'
            },
            {
                name: 'Планка', sets: '3×45 сек', rest: '45 сек',
                muscles: 'весь кор (стабилизация)',
                technique: ['На предплечьях и носках', 'Тело — абсолютно прямая линия', 'Не поднимай таз вверх и не прогибай спину вниз', 'Дыши ровно'],
                progression: 'Увеличивай время → переходи на боковую планку'
            },
            {
                name: '⭐ Подъёмы на носки', sets: '3×23', rest: '—',
                muscles: 'икроножные, камбаловидные', optional: true,
                technique: ['Стоя на краю ступеньки, опускай и поднимай пятки на полную амплитуду'],
                progression: 'Одноногий вариант → с гантелей'
            }
        ],
        cooldown: ['Растяжка квадрицепса — стоя, подтяни пятку к ягодице — 30 сек', 'Растяжка задней поверхности бедра — наклон вперёд с прямыми ногами — 30 сек', 'Растяжка сгибателей бедра — выпад с коленом на полу, подай таз вперёд — 30 сек', 'Дыхание: вдох 4 сек → выдох 6 сек × 5 раз']
    }
};

// ========== INFO CONTENT ==========
const TRAINING_INFO = {
    progression: {
        title: '📈 Прогрессия',
        sections: [
            { heading: '🔄 Еженедельная перегрузка', content: 'Каждую неделю делай ОДНО из:', list: ['+повторения (3×10 → 3×11)', '+подход (3×10 → 4×10)', '+вес (рюкзак 3 кг → 5 кг)', 'Усложнить упражнение (отжимания → ноги на стуле)', 'Замедлить темп (3 сек вниз, 1 сек вверх ↑TUT)'] },
            { heading: '📋 Правило двойной прогрессии', content: 'Используй диапазон 8–12:', list: ['Начни с нижней границы (8 повторений)', 'Каждую неделю +1–2 повторения', 'Дошёл до 12 во всех подходах → УВЕЛИЧЬ ВЕС', 'Снова начни с 8 повторений'] },
            { heading: '🛑 Разгрузочная неделя (deload)', content: 'Каждые 12 недель: те же упражнения, но 50% подходов и повторений. Восстановление суставов, сухожилий, нервной системы.' },
            { heading: '🔀 Переход на 4 дня (через 4–8 недель)', content: 'Если 3 дня — мало: Пн PUSH → Вт PULL → Ср отдых → Чт LEGS → Пт UPPER → Сб-Вс отдых' },
            { heading: '⚠️ Сигналы проблем', list: ['Прогресс стоит 2+ недели → увеличь объём', 'Постоянная усталость → проверь сон (7–9 ч)', 'Боль в суставах (не мышцах!) → замени упражнение', 'Набираешь жир → −200 калорий, ↑ белок'] }
        ]
    },
    recovery: {
        title: '🧠 Восстановление',
        sections: [
            { heading: '😴 Сон — 7–9 часов', list: ['Ложись и вставай в одно время (±30 мин)', 'Без экранов за 30–60 мин до сна', 'Темнота + прохлада (18–20°C)', 'Не ешь тяжёлую пищу за 2 ч до сна', 'Кофеин — не позже 14:00'], content: 'Недосып (<6 ч) = −10–15% тестостерона за неделю' },
            { heading: '🧘 Управление стрессом', content: 'Дыхание 4-7-8: вдох 4 сек → задержка 7 сек → выдох 8 сек → 3–4 цикла', list: ['Прогулка 15–20 мин после ужина', 'Холодный душ 30–60 сек (+200–300% норэпинефрин)', 'Ограничь новости и соцсети'] },
            { heading: '🔥 Тестостерон', list: ['⬆️ Силовые тренировки (база)', '⬆️ Сон 7–9 часов', '⬆️ Цинк, магний (орехи, семечки, шпинат)', '⬆️ Витамин D (солнце 15–20 мин)', '⬇️ Недосып (<6 ч)', '⬇️ Хронический стресс', '⬇️ Алкоголь (−6–10%)', '⬇️ Ожирение'] },
            { heading: '💊 Добавки (научный минимум)', list: ['Креатин 5 г/день — +5–10% силы ⭐⭐⭐⭐⭐', 'Витамин D3 1000–2000 МЕ/день (зимой) ⭐⭐⭐⭐', 'Магний 200–400 мг перед сном ⭐⭐⭐⭐', 'Омега-3 1000–2000 мг EPA+DHA/день ⭐⭐⭐⭐'] }
        ]
    },
    tracking: {
        title: '📓 Дневник',
        sections: [
            { heading: '🔄 Гибкость расписания', list: ['Push-Pull-Legs — это последовательность, не привязка к дням', 'Не попал в день → просто сдвинь', 'Минимум 1 день отдыха между тренировками', 'Нет времени → экспресс: 2 упражнения × 3 подхода (15 мин)', 'Не пропускай 2 дня подряд (если не плановый отдых)'] },
            { heading: '📊 Еженедельный чекпоинт (воскресенье)', content: 'Записывай: вес, количество тренировок, общее самочувствие' },
            { heading: '📸 Ежемесячный чекпоинт (1-е число)', content: 'Замеры: талия, грудь, бицепс, бедро. Максимумы: подтягивания, брусья. ФОТО!', list: ['Фото важнее весов!', 'Зеркало и весы обманывают', 'Сравнение фото через 2–3 месяца — мощнейшая мотивация'] }
        ]
    }
};

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
        if (!d.bonusQuests) d.bonusQuests = ALL_BONUS_QUESTS.slice(0, 5);
        if (!d.stats) d.stats = { str: 0, end: 0, int: 0, wis: 0, dsc: 0 };
        if (!d.days) d.days = {};
        if (!d.startDate) d.startDate = getToday();
        if (!d.unlockedKeys) d.unlockedKeys = [];
        if (d.totalPoints === undefined) d.totalPoints = 0;
        if (d.bestStreak === undefined) d.bestStreak = 0;
        if (!d.customTraining) d.customTraining = {};
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
        bonusQuests: ALL_BONUS_QUESTS.slice(0, 5),
        unlockedKeys: [],
        days: {},
        penalty: false,
        customTraining: {},
        lastBonusRotation: ''
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
    
    if (todayData && (todayData.isRestDay || (todayData.main && todayData.main.length === mainCount))) {
        streak = 1;
    }
    
    let checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - 1);
    while (true) {
        const ds = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
        const dd = data.days[ds];
        if (dd && (dd.isRestDay || (dd.main && dd.main.length >= mainCount))) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else break;
    }
    return streak;
}

function calcDaysInSystem() {
    const today = getToday();
    const start = data.startDate || today;
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

function getMultiplier(streak) {
    if (streak >= 30) return 1.5;
    if (streak >= 7) return 1.2;
    return 1.0;
}

function genId() {
    return 'q' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

function checkPenalty() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    const yData = data.days[yStr];
    
    if (yData && (yData.done || yData.isRestDay)) return data.penalty || false;
    
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
    if (page === 'codex') { renderHabits(); renderCodexReference(); }
    if (page === 'training') renderTraining(currentTrainDay || 'push');
    if (page === 'stats') { updateStats(); renderKeys(); updateCalendar(); }
}

// ========== DASHBOARD ==========
function updateDashboard() {
    const rank = getRank(data.totalPoints);
    const rankIdx = getRankIndex(data.totalPoints);

    document.getElementById('rank-name').textContent = rank.name;
    document.getElementById('rank-title').textContent = rank.title;

    const progress = rank.max === Infinity ? 100 : ((data.totalPoints - rank.min) / (rank.max - rank.min)) * 100;
    document.getElementById('rank-progress').style.width = `${Math.min(100, progress)}%`;
    document.getElementById('progress-label').textContent = rank.max === Infinity ? `${Math.floor(data.totalPoints)} ∞` : `${Math.floor(data.totalPoints)} / ${rank.max}`;
    document.getElementById('total-points').textContent = Math.floor(data.totalPoints);

    // Apply Visual Era
    document.body.className = `era-${Math.min(rankIdx, 5)}`;

    const streak = calcStreak();
    document.getElementById('streak-count').textContent = streak;
    
    // Multiplier display
    const mult = getMultiplier(streak);
    const multSpan = document.getElementById('streak-mult');
    if (multSpan) {
        multSpan.style.display = 'inline-block';
        multSpan.textContent = `x${mult}`;
        if (mult > 1) {
            multSpan.style.background = 'var(--amber)';
            multSpan.style.color = '#fff';
        } else {
            multSpan.style.background = 'rgba(160, 120, 255, 0.1)';
            multSpan.style.color = 'var(--text-dim)';
        }
    }
    
    if (streak > data.bestStreak) { data.bestStreak = streak; saveData(); }

    const today = getToday();
    const todayData = getDayData(today);
    document.getElementById('today-done').textContent = `${todayData.main.length}/${data.mainQuests.length}`;

    const keysUnlocked = data.unlockedKeys.length;
    document.getElementById('keys-unlocked').textContent = `${keysUnlocked}/${AUTO_KEYS.length}`;

    document.getElementById('day-counter').textContent = `ДЕНЬ ${calcDaysInSystem()}`;
    document.getElementById('penalty-banner').classList.toggle('hidden', !checkPenalty());

    const weekNum = getWeekNumber();
    document.getElementById('weekly-rule').textContent = WEEKLY_CHALLENGES[weekNum % WEEKLY_CHALLENGES.length];

    // Calculate weekly progress
    const todayDate = new Date();
    const dayOfWeek = todayDate.getDay() === 0 ? 6 : todayDate.getDay() - 1;
    const weekStart = new Date(todayDate);
    weekStart.setDate(todayDate.getDate() - dayOfWeek);
    
    let weeklyDaysDone = 0;
    for (let i = 0; i < 7; i++) {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + i);
        const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        if (data.days[ds] && data.days[ds].weeklyDone) weeklyDaysDone++;
    }
    document.getElementById('weekly-progress').textContent = `${weeklyDaysDone}/7`;

    const weeklyCheck = document.getElementById('weekly-rule-check');
    if (todayData.weeklyDone) {
        weeklyCheck.style.background = 'var(--purple)';
        weeklyCheck.innerHTML = '✓';
        weeklyCheck.style.color = 'white';
        weeklyCheck.style.display = 'flex';
        weeklyCheck.style.alignItems = 'center';
        weeklyCheck.style.justifyContent = 'center';
        weeklyCheck.style.fontSize = '12px';
        weeklyCheck.style.fontWeight = 'bold';
    } else {
        weeklyCheck.style.background = 'transparent';
        weeklyCheck.innerHTML = '';
    }



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
    
    const todayData = getDayData(getToday());
    
    if (todayData.isRestDay) {
        mc.innerHTML = '<div style="text-align: center; color: var(--text-dim); padding: 20px; font-style: italic;">Сегодня день восстановления. Набирайся сил! 😴</div>';
    } else {
        data.mainQuests.forEach(q => mc.appendChild(renderQuestItem(q, false)));
    }
    
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
    
    const currentMult = getMultiplier(calcStreak());
    const pointsGained = 2 * currentMult;

    if (list.includes(questId)) {
        list.splice(list.indexOf(questId), 1);
        if (item) item.classList.remove('completed');
        data.totalPoints = Math.max(0, data.totalPoints - pointsGained);
        todayData.points = Math.max(0, todayData.points - pointsGained);
        if (quest.stat) data.stats[quest.stat] = Math.max(0, (data.stats[quest.stat] || 0) - 1);
    } else {
        list.push(questId);
        if (item) {
            item.classList.add('completed', 'just-completed');
            setTimeout(() => item.classList.remove('just-completed'), 300);
        }
        data.totalPoints += pointsGained;
        todayData.points += pointsGained;
        if (quest.stat) data.stats[quest.stat] = (data.stats[quest.stat] || 0) + 1;
        showPointsPopup(`+${pointsGained > 2 ? pointsGained.toFixed(1) : pointsGained}`);

        if (!isBonus && todayData.main.length === data.mainQuests.length) {
            if (!todayData.chestOpened) {
                document.getElementById('chest-modal-overlay').classList.remove('hidden');
                document.getElementById('chest-closed').style.display = 'inline-block';
                document.getElementById('chest-opened').style.display = 'none';
                document.getElementById('chest-close-btn').style.display = 'none';
                document.getElementById('chest-hint').style.display = 'block';
                document.getElementById('chest-modal').classList.add('chest-pop');
                setTimeout(() => document.getElementById('chest-modal').classList.remove('chest-pop'), 200);
            } else {
                showModal('КВЕСТЫ ВЫПОЛНЕНЫ!', `Все ежедневные квесты на сегодня!\n+${data.mainQuests.length * 2} очков\n\nОтличная работа, Охотник.`);
            }
            
            const prev = getRankIndex(data.totalPoints - 2);
            const cur = getRankIndex(data.totalPoints);
            if (cur > prev) {
                setTimeout(() => showModal('RANK UP!', `${RANKS[cur].name}\n"${RANKS[cur].title}"\nЭра ${cur} достигнута!`), 2500);
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

// ========== REST DAY ==========
document.getElementById('btn-rest-day').addEventListener('click', () => {
    const todayData = getDayData(getToday());
    
    // Check if max 2 rest days per week exceeded
    const todayDate = new Date();
    const dayOfWeek = todayDate.getDay() === 0 ? 6 : todayDate.getDay() - 1;
    const weekStart = new Date(todayDate);
    weekStart.setDate(todayDate.getDate() - dayOfWeek);
    let restDaysThisWeek = 0;
    for (let i = 0; i < 7; i++) {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + i);
        const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        if (data.days[ds] && data.days[ds].isRestDay) restDaysThisWeek++;
    }

    if (!todayData.isRestDay && restDaysThisWeek >= 2) {
        alert('Ты уже брал 2 дня отдыха на этой неделе. Пора браться за работу! ⚔️');
        return;
    }

    todayData.isRestDay = !todayData.isRestDay;
    if (todayData.isRestDay) {
        todayData.main = []; // Clear main quests for rest day
    }
    saveData();
    renderQuests();
    updateQuestStates();
    updateDashboard();
    updateCalendar(); // Update calendar to show rest day status
});

// ========== WEEKLY RULE TRACKER ==========
document.getElementById('weekly-rule-card').addEventListener('click', () => {
    const todayData = getDayData(getToday());
    todayData.weeklyDone = !todayData.weeklyDone;
    
    const currentMult = getMultiplier(calcStreak());
    const pointsGained = 2 * currentMult;
    
    if (todayData.weeklyDone) {
        data.totalPoints += pointsGained;
        showPointsPopup(`+${pointsGained > 2 ? pointsGained.toFixed(1) : pointsGained} (вызов недели)`);
    } else {
        data.totalPoints -= pointsGained;
    }
    
    saveData();
    updateDashboard();
});

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
        if (dd && dd.isRestDay) {
            cell.classList.add('purple'); // Purple dot for rest day
        } else if (dd && dd.main) {
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

// ========== CODEX ==========
const DEFAULT_HABITS = [
    { id: 'bed', name: '🛏️ Заправить кровать' },
    { id: 'hygiene', name: '🧼 Гигиена (душ, зубы, лицо)' },
    { id: 'read', name: '📖 20 мин чтения' },
    { id: 'readaloud', name: '🗣️ 10 мин чтения вслух' },
    { id: 'noscreen', name: '📵 Без экрана за 30 мин до сна' },
    { id: 'meal', name: '🍳 Нормальный приём пищи' },
    { id: 'tidy', name: '🧹 Порядок в комнате' }
];

const CODEX_REFERENCE = [
    {
        icon: '👔', title: 'Внешний вид',
        rules: [
            'Одежда по размеру — не мешком, не в обтяжку',
            'Без принтов и кричащих логотипов — однотон = взрослый вид',
            'Базовые цвета: чёрный, белый, серый, тёмно-синий, хаки',
            'Обувь чистая ВСЕГДА — люди смотрят на обувь',
            'Гладь рубашки. Стирай кроссовки. Следи за состоянием вещей',
            'Аксессуары: меньше = лучше. Часы > браслеты и цепочки'
        ]
    },
    {
        icon: '🗣️', title: 'Речь',
        rules: [
            'Говори медленнее — быстрая речь = нервозность',
            'Убери слова-паразиты: «ну», «типа», «короче», «как бы»',
            'Не оправдывайся: «Я считаю, что...» вместо «Ну, я просто подумал...»',
            'Не извиняйся без причины: «У меня вопрос» вместо «Извини, можно спросить?»',
            'Читай вслух 10 мин/день — тренировка дикции и словарного запаса',
            'Задавай вопросы, а не заполняй тишину',
            'Не перебивай. Не жалуйся. Не матерись через слово'
        ]
    },
    {
        icon: '🏋️', title: 'Тело и здоровье',
        rules: [
            'Душ каждый день, дезодорант — обязательно',
            'Чистые ногти, зубы 2 раза в день, уход за кожей',
            'Стрижка каждые 3–4 недели',
            'Осанка: плечи назад, грудь вперёд, подбородок параллельно полу',
            'Стой у стены 2 мин/день (затылок, лопатки, ягодицы, пятки)',
            'Белок каждый приём пищи. Вода 2+ литра. Минимум сахара',
            'Сон 7–9 часов. Ложись и вставай в одно время'
        ]
    },
    {
        icon: '🧠', title: 'Интеллект',
        rules: [
            'Читай минимум 20 мин/день — нон-фикшн + художественная',
            'Формируй СВОЁ мнение, не повторяй чужие из тиктока',
            'Каждый день 30 мин осознанной практики кода',
            'Критическое мышление: «Где доказательства? Кому выгодно?»',
            'Соцсети не больше 30 мин/день',
            'Скажи «Я не знаю» когда не знаешь — это зрелость'
        ]
    },
    {
        icon: '💰', title: 'Финансы',
        rules: [
            'Трать меньше, чем зарабатываешь. Всегда',
            'Не покупай вещи, чтобы впечатлить людей',
            'Инвестируй в навыки, не в вещи',
            'Откладывай 10% от любого дохода',
            'Программирование — твоё оружие для заработка. Прокачивай'
        ]
    },
    {
        icon: '🤝', title: 'Социалка',
        rules: [
            'Смотри в глаза при разговоре — мягко и уверенно',
            'Запоминай имена. Повтори при знакомстве: «Приятно, Максим»',
            'Будь пунктуальным — приходи на 5 мин раньше',
            'Помогай без ожидания ответа',
            'Не сплетничай — если обсуждаешь за спиной, все это знают',
            'Благодари конкретно: «Спасибо, что помог с этим»',
            'Слово = закон. Сказал — сделай'
        ]
    },
    {
        icon: '🏠', title: 'Быт',
        rules: [
            'Заправляй кровать каждое утро (30 сек → тон дня)',
            'Не копи грязную посуду. Убирай раз в неделю',
            'Выброси хлам: не используешь 6 мес → не нужно',
            'Проветривай комнату. Приятный запах',
            'Умей готовить 5 блюд: яичница, паста, рис+мясо, салат, суп'
        ]
    },
    {
        icon: '⚔️', title: 'Дисциплина',
        rules: [
            'Делай то, что нужно, даже когда не хочется',
            'Признавай ошибки быстро и без оправданий',
            'Не жалуйся — решай проблему или прими её',
            'Контролируй реакции — ты не контролируешь мир, но контролируешь себя',
            'Будь спокоен под давлением — это отличает лидера от толпы',
            'Каждый день на 1% лучше, чем вчера'
        ]
    }
];

// Habits storage (separate from main data)
function loadHabits() {
    const saved = localStorage.getItem('ariseHabits');
    if (saved) {
        const h = JSON.parse(saved);
        if (!h.list) h.list = DEFAULT_HABITS;
        if (!h.completed) h.completed = {};
        return h;
    }
    return { list: DEFAULT_HABITS, completed: {} };
}

function saveHabits() {
    localStorage.setItem('ariseHabits', JSON.stringify(habits));
}

let habits = loadHabits();
let habitEditMode = false;

function getHabitsToday() {
    const today = getToday();
    if (!habits.completed[today]) habits.completed[today] = [];
    return habits.completed[today];
}

function renderHabits() {
    const container = document.getElementById('habit-list');
    const today = getToday();
    const completedToday = getHabitsToday();
    const total = habits.list.length;
    const done = completedToday.length;

    document.getElementById('habit-counter').textContent = `${done}/${total}`;

    let html = '';
    habits.list.forEach(h => {
        const isDone = completedToday.includes(h.id);
        html += `
        <div class="habit-item${isDone ? ' completed' : ''}${habitEditMode ? ' editing' : ''}" data-id="${h.id}">
            <div class="habit-check${isDone ? ' checked' : ''}" onclick="toggleHabit('${h.id}')"></div>
            <span class="habit-name${isDone ? ' done' : ''}">${h.name}</span>
            ${habitEditMode ? `<button class="btn-habit-delete" onclick="deleteHabit('${h.id}')">✕</button>` : ''}
        </div>`;
    });
    container.innerHTML = html;

    // WIS bonus check
    if (done === total && total > 0) {
        const bonusKey = `habitBonus_${today}`;
        if (!localStorage.getItem(bonusKey)) {
            data.stats.wis = (data.stats.wis || 0) + 1;
            data.totalPoints += 1;
            saveData();
            localStorage.setItem(bonusKey, '1');
            showPointsPopup('+1 WIS (привычки)');
        }
    }

    // Show/hide add button
    document.getElementById('btn-add-habit').classList.toggle('hidden', !habitEditMode);
}

function toggleHabit(id) {
    if (habitEditMode) return;
    const today = getToday();
    const completed = getHabitsToday();
    const idx = completed.indexOf(id);
    if (idx >= 0) { completed.splice(idx, 1); }
    else { completed.push(id); }
    habits.completed[today] = completed;
    saveHabits();
    renderHabits();
}

function deleteHabit(id) {
    habits.list = habits.list.filter(h => h.id !== id);
    saveHabits();
    renderHabits();
}

// Edit mode toggle
document.getElementById('btn-edit-habits').addEventListener('click', () => {
    habitEditMode = !habitEditMode;
    document.getElementById('btn-edit-habits').classList.toggle('active', habitEditMode);
    renderHabits();
});

// Add habit
document.getElementById('btn-add-habit').addEventListener('click', () => {
    const name = prompt('Название новой привычки (с эмодзи):');
    if (!name || !name.trim()) return;
    habits.list.push({ id: 'h' + Date.now().toString(36), name: name.trim() });
    saveHabits();
    renderHabits();
});

// Reference rendering
function renderCodexReference() {
    const container = document.getElementById('codex-reference');
    let html = '';
    CODEX_REFERENCE.forEach(cat => {
        html += `
        <div class="codex-card" onclick="this.classList.toggle('expanded')">
            <div class="codex-card-header">
                <span class="codex-card-icon">${cat.icon}</span>
                <span class="codex-card-title">${cat.title}</span>
                <span class="codex-card-expand">▼</span>
            </div>
            <div class="codex-card-body">
                ${cat.rules.map(r => `<div class="codex-rule">• ${r}</div>`).join('')}
            </div>
        </div>`;
    });
    container.innerHTML = html;
}

// ========== TRAINING ==========
let currentTrainDay = 'push';

function renderTraining(day) {
    currentTrainDay = day;
    const container = document.getElementById('train-content');

    document.querySelectorAll('.train-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.day === day);
    });

    // INFO tab
    if (day === 'info') {
        document.getElementById('train-day-label').textContent = 'Справка';
        let html = '';
        Object.values(TRAINING_INFO).forEach(section => {
            html += `<div class="train-section"><div class="train-section-title">${section.title}</div>`;
            section.sections.forEach(s => {
                html += `<div class="info-block">
                    <div class="info-heading">${s.heading}</div>`;
                if (s.content) html += `<div class="info-text">${s.content}</div>`;
                if (s.list) html += `<div class="info-list">${s.list.map(l => `<div class="info-item">• ${l}</div>`).join('')}</div>`;
                html += '</div>';
            });
            html += '</div>';
        });
        container.innerHTML = html;
        return;
    }

    const plan = TRAINING[day];
    document.getElementById('train-day-label').textContent = plan.time;

    // Note (legs day)
    let html = '';
    if (plan.note) {
        html += `<div class="train-note">${plan.note}</div>`;
    }

    // Warmup
    html += `<div class="train-section">
        <div class="train-section-title">🔥 РАЗМИНКА</div>
        <div class="train-warmup">
            <div class="warmup-group-label">Общий разогрев</div>
            ${plan.warmup.items.map(w => `<div class="warmup-item">${w}</div>`).join('')}
            <div class="warmup-group-label">Суставная мобильность</div>
            ${plan.warmup.mobility.map(w => `<div class="warmup-item">${w}</div>`).join('')}
            <div class="warmup-group-label">Специфическая разминка</div>
            <div class="warmup-item">${plan.warmup.specific}</div>
        </div>
    </div>`;

    // Exercises
    html += `<div class="train-section">
        <div class="train-section-title">💪 УПРАЖНЕНИЯ <span class="tap-hint">(нажми для деталей)</span></div>`;

    plan.exercises.forEach((ex, i) => {
        const detailParts = [];
        if (ex.weight) detailParts.push(`<div class="ex-detail-row"><span class="ex-detail-label">⚖️ Вес:</span> ${ex.weight}</div>`);
        if (ex.technique) detailParts.push(`<div class="ex-detail-row"><span class="ex-detail-label">📐 Техника:</span></div><div class="ex-technique">${ex.technique.map(t => `<div class="tech-item">• ${t}</div>`).join('')}</div>`);
        if (ex.alt) detailParts.push(`<div class="ex-detail-row ex-alt">💬 ${ex.alt}</div>`);
        if (ex.progression) detailParts.push(`<div class="ex-detail-row"><span class="ex-detail-label">📈 Прогрессия:</span> ${ex.progression}</div>`);

        html += `
        <div class="exercise-card${ex.optional ? ' optional' : ''}" onclick="this.classList.toggle('expanded')">
            <div class="ex-header">
                <span class="ex-num">${i + 1}</span>
                <div class="ex-header-text">
                    <span class="ex-name">${ex.name}</span>
                    <span class="ex-muscles">${ex.muscles}</span>
                </div>
                <span class="ex-expand">▼</span>
            </div>
            <div class="ex-details">
                <div class="ex-tag">${ex.sets}</div>
                <div class="ex-tag rest">⏱ ${ex.rest}</div>
            </div>
            <div class="ex-expanded">${detailParts.join('')}</div>
        </div>`;
    });
    html += '</div>';

    // Cooldown
    html += `<div class="train-section">
        <div class="train-section-title">🧊 ЗАМИНКА</div>
        <div class="train-warmup">
            ${plan.cooldown.map(c => `<div class="warmup-item">${c}</div>`).join('')}
        </div>
    </div>`;

    container.innerHTML = html;
}

document.querySelectorAll('.train-tab').forEach(tab => {
    tab.addEventListener('click', () => renderTraining(tab.dataset.day));
});

// ========== THEME TOGGLE ==========
const themeToggle = document.getElementById('theme-toggle');
let currentTheme = localStorage.getItem('ariseTheme') || 'dark';

function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ariseTheme', theme);
    themeToggle.textContent = theme === 'light' ? '☀️' : '🌙';
}

setTheme(currentTheme);

themeToggle.addEventListener('click', () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

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

document.getElementById('btn-import').addEventListener('click', () => {
    document.getElementById('import-file').click();
});

document.getElementById('import-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const importedData = JSON.parse(event.target.result);
            if (importedData && importedData.stats && importedData.days) {
                localStorage.setItem('hunterSystem', JSON.stringify(importedData));
                showModal('📂 ДАННЫЕ ЗАГРУЖЕНЫ', 'Игра будет перезапущена для применения сохранения.', () => {
                    location.reload();
                });
                // Fallback if modal is closed too fast
                setTimeout(() => location.reload(), 2500);
            } else {
                alert('Ошибка: Неверный формат файла сохранения.');
            }
        } catch (err) {
            alert('Ошибка при чтении файла!');
        }
    };
    reader.readAsText(file);
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

// ========== CHEST ==========
document.getElementById('chest-closed').addEventListener('click', () => {
    document.getElementById('chest-closed').style.display = 'none';
    const opened = document.getElementById('chest-opened');
    opened.style.display = 'flex';
    document.getElementById('chest-hint').style.display = 'none';
    
    const rand = Math.random();
    let rewardText = '';
    
    const currentMult = getMultiplier(calcStreak());
    
    if (rand < 0.5) {
        const reward = 5 * currentMult;
        data.totalPoints += reward;
        rewardText = `+${reward > 5 ? reward.toFixed(1) : reward} Опыта ✨`;
    } else if (rand < 0.8) {
        const reward = 10 * currentMult;
        data.totalPoints += reward;
        rewardText = `+${reward > 10 ? reward.toFixed(1) : reward} Опыта ✨`;
    } else {
        const statsKeys = Object.keys(STAT_NAMES);
        const randStat = statsKeys[Math.floor(Math.random() * statsKeys.length)];
        data.stats[randStat] = (data.stats[randStat] || 0) + 1;
        rewardText = `+1 ${STAT_NAMES[randStat].split('—')[0].trim()} 🔋`;
    }
    
    const todayData = getDayData(getToday());
    todayData.chestOpened = true;
    
    document.getElementById('chest-reward-text').innerText = rewardText;
    document.getElementById('chest-close-btn').style.display = 'block';
    
    saveData();
    updateDashboard();
});

document.getElementById('chest-close-btn').addEventListener('click', () => {
    document.getElementById('chest-modal-overlay').classList.add('hidden');
});

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
    
    // Rotate bonus quests daily
    if (data.lastBonusRotation !== today) {
        // Keep custom quests (IDs starting with 'q')
        const customQuests = (data.bonusQuests || []).filter(q => q.id.startsWith('q'));
        
        // Pick 4 random quests using today's date as a seed
        const seed = new Date(today).getTime();
        const rand = (s) => {
            let t = s += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
        
        const pool = [...ALL_BONUS_QUESTS];
        pool.sort((a, b) => rand(seed + a.id.charCodeAt(0)) - rand(seed + b.id.charCodeAt(0)));
        
        data.bonusQuests = [...pool.slice(0, 4), ...customQuests];
        data.lastBonusRotation = today;
        saveData();
    }

    updateDashboard();
    renderQuests();
    updateQuestStates();
    renderKeys();
    updateStats();
    updateCalendar();

    // Check monthly checkpoint
    const daysIn = calcDaysInSystem();
    if (daysIn > 0 && daysIn % 30 === 0) {
        const cpKey = `checkpoint_${daysIn}`;
        if (!localStorage.getItem(cpKey)) {
            localStorage.setItem(cpKey, '1');
            setTimeout(() => {
                showModal('📈 ЕЖЕМЕСЯЧНЫЙ ЧЕКПОИНТ', `Прошло ${daysIn} дней!\n\nЗапиши замеры: талия, грудь, бицепс, бедро.\nСделай ФОТО — это лучшая метрика прогресса!\n\nТвой общий счёт: ${data.totalPoints}\n\nТак держать, охотник! ⚔️`);
            }, 1000);
        }
    }
}

init();
