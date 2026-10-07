
import { ruDocs } from '../docs/ru';

export const info = {
    hero: {
        watch: 'Смотреть',
        watchLater: 'Буду смотреть',
    },
    home: {
        trendingNow: 'Популярное сейчас',
        newReleases: 'Новинки',
        best: 'Лучшее',
        movies: 'Фильмы',
        loadingError: 'Не удалось загрузить главную страницу.',
        showMore: 'Показать больше',
    },
    news: {
        loadingError: 'Не удалось загрузить новости.',
        readMore: 'Читать новость',
    },
    banner: {
        goToSlide: 'Перейти к слайду {slide}',
        confirmTitle: 'Переход по ссылке',
        confirmDescription: 'Вы действительно хотите перейти по внешней ссылке?',
        confirmAction: 'Перейти',
        cancelAction: 'Отмена'
    },
    blogPost: {
        backToNews: 'Назад к новостям',
        tableOfContents: 'Оглавление',
        thankYou: 'Спасибо за чтение!',
        share: 'Поделиться:',
        copyLink: 'Скопировать ссылку',
        copied: 'Скопировано!',
        notFound: 'Новость не найдена',
    },
    support: {
        backToHome: 'Назад на главную',
        title: 'Техническая поддержка',
        description: 'Опишите проблему, и наша команда поможет вам в кратчайшие сроки.',
        yourName: 'Ваше имя',
        namePlaceholder: 'Как к вам обращаться',
        contactEmail: 'Email для связи',
        emailPlaceholder: 'name@example.com',
        problemCategory: 'Категория проблемы',
        subject: 'Тема обращения',
        subjectPlaceholder: 'Кратко суть проблемы',
        detailedDescription: 'Подробное описание',
        descriptionPlaceholder: 'Опишите шаги для воспроизведения проблемы или детали вашего вопроса...',
        attachFiles: 'Прикрепить материалы',
        files: 'Файлы',
        videoLink: 'Ссылка на видео',
        dropFiles: 'Перетащите файлы',
        fileSizeLimit: 'до 10MB',
        linkPlaceholder: 'https://youtube.com/watch?v=...',
        sendTicket: 'Отправить тикет',
        faq: 'Частые вопросы',
        faqDescription: 'Решение вашей проблемы может быть описано в документации.',
        goToFaq: 'Перейти в FAQ',
        serviceStatus: 'Статус Сервисов',
        statusDescription: 'Проверьте доступность систем, если испытываете проблемы с подключением.',
        goToStatus: 'Перейти к статусу',
        contacts: 'Контакты',
        formErrors: {
            required: 'Обязательно',
            validationError: 'Пожалуйста, заполните все обязательные поля.',
            invalidLink: 'Некорректная ссылка (должна начинаться с http)'
        },
        ticketSuccess: 'Тикет создан! Мы свяжемся с вами в ближайшее время.',
    },
    status: {
        backToHome: 'Назад на главную',
        title: 'Мониторинг сервисов',
        description: 'Актуальная информация о доступности систем сервиса',
        allSystemsOperational: 'Все системы функционируют нормально',
        someSystemsDown: 'Наблюдаются проблемы в работе некоторых систем',
        latency: 'Задержка',
        uptime: 'Uptime (24h)',
        performance24h: 'Производительность за 24 часа',
        now: 'Сейчас',
        h24ago: '24ч назад',
        h12ago: '12ч назад',
        h0ago: '0ч',
    },
    settings: {
        title: "Настройки",
        description: "Управление профилем, интерфейсом и параметрами воспроизведения.",
        inDevelopment: {
            title: "Раздел в разработке",
            description: "Мы работаем над тем, чтобы сделать этот раздел максимально полезным для вас. Пожалуйста, загляните сюда позже.",
            backToHome: "На главную"
        },
        tabs: {
            profile: "Профиль",
            preferences: "Интерфейс",
            player: "Плеер",
        },
        profile: {
            username: "Имя пользователя",
            email: "Email адрес",
            bio: "О себе",
            bioPlaceholder: "Расскажите о своих любимых жанрах или аниме...",
            changeAvatar: "Изменить фото",
            saveChanges: "Сохранить изменения",
            linkedAccounts: "Привязанные аккаунты",
            avatarAlt: 'Аватар',
            socials: {
                google: "Google",
                telegram: "Telegram",
                discord: "Discord",
                yandex: "Yandex"
            },
            connectSocial: 'Подключить {provider}',
            disconnectSocial: 'Отключить {provider}',
        },
        preferences: {
            interfaceLanguage: "Язык интерфейса",
            showSpoilers: "Показывать спойлеры",
            showSpoilersDesc: "Автоматически раскрывать отзывы и комментарии, содержащие спойлеры.",
            notifications: "Уведомления",
            notifyReleases: "Новые серии",
            notifyNews: "Новости платформы",
            notifyMentions: "Ответы и упоминания",
        },
        player: {
            defaultQuality: "Качество видео по умолчанию",
            defaultAudio: "Язык озвучки по умолчанию",
            autoSkipIntro: "Пропускать опенинги",
            autoNext: "Автопереключение серий",
            titles: {
                general: "Воспроизведение",
                audio: "Аудио и Субтитры"
            }
        }
    },
    profile: {
        tabs: {
            overview: 'Обзор',
            activity: 'Активность',
            dynamics: 'Динамика',
            friends: 'Друзья',
            collections: 'Коллекции',
            reviews: 'Оценки и комментарии'
        },
        reviewsTab: {
            filterAll: 'Все',
            filterRatings: 'Только оценки',
            filterComments: 'Только комментарии'
        },
        level: 'Уровень',
        xp: 'XP',
        stats: {
            episodes: 'Эпизоды',
            titles: 'Тайтлов',
            days: 'Дней',
            comments: 'Комментариев',
            reviews: 'Рецензий',
            avgScore: 'Ср. балл'
        },
        activity: {
            title: 'Лента активности',
            empty: 'Нет недавней активности',
            types: {
                watched: 'Просмотр',
                rated: 'Оценка',
                commented: 'Комментарий',
                added_list: 'В список',
                achievement: 'Достижение'
            }
        },
        dynamics: {
            title: 'График просмотров',
            subtitle: 'Статистика эпизодов',
            periods: {
                d14: '14 дней',
                d30: '30 дней',
                d90: '90 дней'
            }
        },
        achievements: {
            title: 'Достижения',
            viewAll: 'Все'
        },
        friends: {
            title: 'Список друзей',
            all: 'Все',
            empty: 'Список друзей пуст',
            find: 'Найти друзей',
            findPlaceholder: 'Имя пользователя...',
            add: 'Добавить',
            requestSent: 'Запрос отправлен',
            searchEmpty: 'Никого не найдено'
        },
        collections: {
            title: 'Коллекции пользователя',
            empty: 'Коллекций пока нет'
        },
        commentsHistory: {
            title: 'Лента отзывов',
            to: 'к'
        },
        joined: 'С нами с {date}',
        edit: 'Редактировать',
        publicTitle: 'Профиль пользователя',
        actions: {
            follow: 'Подписаться',
            following: 'Вы подписаны',
            message: 'Сообщение',
            followed: 'Вы подписались на пользователя',
            unfollowed: 'Вы отписались от пользователя',
            report: 'Пожаловаться',
            reportProfile: 'Пожаловаться на профиль',
            copyLink: 'Скопировать ссылку',
            block: 'Заблокировать'
        }
    },
    team: {
        name: "CineNetwork"
    },
    docs: {
        backToHome: 'Назад на главную',
        title: 'Документация',
        description: 'Правовая информация и правила использования сервиса.',
        lastUpdated: 'Последнее обновление: 01.02.2026',
        downloadPdf: 'Скачать PDF',
        print: 'Печать',
        prevDoc: 'Предыдущий документ',
        nextDoc: 'Следующий документ',
        selectDoc: 'Выберите документ',
        sections: ruDocs
    },
};
