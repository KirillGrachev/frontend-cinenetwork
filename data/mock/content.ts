/**
 * Realistic demo-content pools for the mock providers.
 *
 * Everything here is deterministic (selected via seededRandom by entity id),
 * stable between refetches, and written in the product's domain language —
 * an anime streaming service. The previous fixtures leaked test scaffolding
 * into the UI ("Это тестовый комментарий #41 для проверки системы
 * модерации", "User_481", "Anime Title #7", placehold.co frames), which
 * broke the product concept on every admin/moderation screen.
 */

import { hashString, seededRandom } from '../../utils/random';

/** Community-style nicknames (deterministically assigned across mocks). */
export const NICKNAMES = [
    'AniWatcher',
    'Sakura_99',
    'KawaiiDesu',
    'GojoSaturn',
    'MakimaWoof',
    'ZeroTwo_Best',
    'Naruto_Kun',
    'TokyoGhoul_X',
    'RemBestGirl',
    'LeviAckerman',
    'KiraYoshikage',
    'SenpaiNoticed',
    'Dattebayo',
    'ErenYeager',
    'AsukaLangley',
    'L_Lawliet',
    'ItachiSan',
    'MikasaT',
    'OnePunchFan',
    'GintamaLOL',
    'StudioMAPPA',
    'AniLibria watcher',
    'SubsOverDubs',
    'NanamiKento',
    'PowerChan',
] as const;

/** Episode-comment pool shown in the moderation queue. */
export const COMMENT_POOL = [
    'Серия топ! Озвучка как всегда на высоте, спасибо за релиз 🔥',
    'Когда следующая серия? Не могу ждать продолжения после такого клиффхэнгера.',
    'Анимация в этом сезоне заметно лучше, студия явно постаралась.',
    'Кто-нибудь ещё заметил отсылку к первому сезону в опенинге?',
    'Пожалуйста, добавьте субтитры — озвучка не успевает за оригиналом.',
    'Спойлеры в комментариях достали, модераторы, обратите внимание!',
    'Смотрю через приложение — работает без лагов, спасибо разрабам.',
    'Этот эпизод лучше экранизации 2019 года, имхо.',
    'Не работает плеер на втором сервере, на остальных всё ок.',
    'Финал, конечно, спорный, но смотреть всё равно буду — привык к персонажам.',
    'Годнота! Уже третий раз пересматриваю эту арку.',
    'А манга лучше, как всегда. Но серия сделана с уважением к оригиналу.',
] as const;

/** Review pool (with ratings) for the "reviews" moderation section. */
export const REVIEW_POOL = [
    { text: 'Шедевр сезона. Сюжет держит до последней серии, персонажи живые. 10/10', rating: 10 },
    { text: 'Хороший сёнен, но второй сезон слабее первого. Рисовка всё тащит. 7/10', rating: 7 },
    {
        text: 'Визуал великолепный, сюжет на троечку. Смотрится легко, но забылся через неделю. 6/10',
        rating: 6,
    },
    {
        text: 'Лучшая экранизация манги за последние годы. Саундтрек отдельный вид искусства. 9/10',
        rating: 9,
    },
    {
        text: 'Первые три серии скучные, дальше раскачивается. Если дотерпите — не пожалеете. 8/10',
        rating: 8,
    },
] as const;

/** Support-ticket pool for the "tickets" moderation section. */
export const TICKET_POOL = [
    'Не воспроизводится видео после 10 минуты просмотра, ошибка плеера. Пробовал разные серверы.',
    'Прошу добавить субтитры к 5 серии — озвучка вышла без перевода эндинга.',
    'Не приходит письмо для сброса пароля, пробовал три раза с разной почтой.',
    'Оформил Premium, но качество 4K недоступно. Прошу проверить аккаунт.',
    'Как удалить аккаунт и все данные? Не нашёл кнопку в настройках профиля.',
    'Уведомления о новых сериях приходят с задержкой на день. Раньше работало мгновенно.',
] as const;

/** Character pool for anime detail pages and character pages. */
export const CHARACTER_POOL = [
    {
        name: 'Юдзи Итадори',
        originalName: '虎杖 悠仁',
        description:
            'Первокурсник школы магов, ставший сосудом Короля Проклятий. Добрый и невероятно выносливый.',
    },
    {
        name: 'Мэгуми Фусигуро',
        originalName: '伏黒 恵',
        description: 'Наследник техники Десяти Теней, сдержанный тактик и верный друг Итадори.',
    },
    {
        name: 'Тандзиро Камадо',
        originalName: '竈門 炭治郎',
        description:
            'Охотник на демонов, идущий по пути Дыхания Воды, чтобы вернуть сестру в человеческий облик.',
    },
    {
        name: 'Нэдзуко Камадо',
        originalName: '竈門 禰豆子',
        description:
            'Демон, сохранившая человеческие чувства. Сражается рядом с братом и защищает людей.',
    },
    {
        name: 'Эдвард Элрик',
        originalName: 'エドワード・エルリック',
        description:
            'Стальной алхимик, ищущий философский камень, чтобы вернуть тела себе и брату.',
    },
    {
        name: 'Альфонс Элрик',
        originalName: 'アルフォンス・エルリック',
        description: 'Душа в доспехах. Младший брат Эдварда, чья цена истины оказалась выше.',
    },
    {
        name: 'Эрен Йегер',
        originalName: 'エレン・イェーガー',
        description: 'Разведчик, чья жажда свободы изменила судьбу всех стен.',
    },
    {
        name: 'Микаса Аккерман',
        originalName: 'ミカサ・アッカーマン',
        description: 'Непревзойдённый боец корпуса разведки. Защищает Эрена любой ценой.',
    },
    {
        name: 'Сатору Годзё',
        originalName: '五条 悟',
        description: 'Сильнейший маг современности, преподаватель токийской школы дзюдзюцу.',
    },
    {
        name: 'Нобара Кугисаки',
        originalName: '釘崎 野薔薇',
        description: 'Бесстрашная маг-первокурсница с молотком, гвоздями и соломенной куклой.',
    },
    {
        name: 'Дендзи',
        originalName: 'デンジ',
        description: 'Парень с пилой вместо головы, мечтающий о простой жизни — и тостах с джемом.',
    },
    {
        name: 'Макия',
        originalName: 'マキマ',
        description:
            'Загадочная руководительница отдела общественной безопасности. Её мотивы до конца не ясны.',
    },
    {
        name: 'Аня Форджер',
        originalName: 'アーニャ・フォージャー',
        description: 'Телепат, обожающая арахис и шпионские приключения приёмного отца.',
    },
    {
        name: 'Лойд Форджер',
        originalName: 'ロイド・フォージャー',
        description:
            'Шпион под кодовым именем «Сумрак», вынужденный играть роль примерного семьянина.',
    },
    {
        name: 'Киллуа Золдик',
        originalName: 'キルア・ゾルディック',
        description: 'Наследник клана наёмников и лучший друг Гона. Мастер трансмутации ауры.',
    },
    {
        name: 'Гон Фрикс',
        originalName: 'ゴン＝フリークス',
        description: 'Юный охотник, ищущий отца. Прямой, упрямый и пугающе талантливый.',
    },
] as const;

/** Voice-actor pool (JA original + EN dub) for character pages. */
export const VOICE_ACTOR_POOL = [
    { name: 'Такэхиро Хасэгава', language: 'Japanese' },
    { name: 'Юити Накамура', language: 'Japanese' },
    { name: 'Кана Ханадзава', language: 'Japanese' },
    { name: 'Мамору Мияно', language: 'Japanese' },
    { name: 'Zach Aguilar', language: 'English' },
    { name: 'Erica Mendez', language: 'English' },
    { name: 'Bryce Papenbrook', language: 'English' },
] as const;

/** Staff members shown on the activity log. */
export const MODERATORS = ['L_Lawliet', 'MikasaMod', 'SenpaiAdmin'] as const;

export function pickNickname(seed: string): string {
    return NICKNAMES[hashString(seed) % NICKNAMES.length];
}

export function pickFrom<T>(pool: readonly T[], seed: string): T {
    return pool[hashString(seed) % pool.length];
}

/** Deterministic public-looking IPv4 for demo logs. */
export function mockIp(seed: string): string {
    const random = seededRandom(hashString(`ip_${seed}`));
    const octet = () => Math.floor(random() * 223) + 1;
    return `${octet()}.${octet()}.${octet()}.${octet()}`;
}
