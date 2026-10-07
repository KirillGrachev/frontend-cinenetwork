
export const media = {
    catalog: {
        title: 'Каталог',
        description: 'Вся коллекция аниме на одной странице.',
        year: 'Год',
        season: 'Сезон',
        seasonLabel: 'Сезон {number}',
        genres: 'Жанры',
        studio: 'Студия',
        selections: 'Подборки',
        filters: {
            selections: {
                trending: 'Популярное',
                new: 'Новинки',
                best: 'Лучшее',
                movies: 'Фильмы',
            }
        },
        showAll: 'Показать все',
        showLess: 'Скрыть',
        resetFilters: 'Сбросить фильтры',
        loadMore: 'Показать еще',
        loadingError: 'Не удалось загрузить каталог.',
    },
    schedule: {
        title: 'Расписание',
        description: 'График выхода новых эпизодов.',
        episodesToday: 'Эпизодов сегодня:',
        timeSort: 'Время:',
        sortNewest: 'Сначала новые',
        sortOldest: 'Сначала старые',
        noReleases: 'На этот день релизов не запланировано',
        loadingError: 'Не удалось загрузить расписание.',
        episodeShort: 'ЭП',
    },
    collections: {
        title: 'Коллекции',
        description: 'Тематические подборки от редакции сервиса и сообщества.',
        createOwn: 'Создать свою',
        updatedYesterday: 'Обновлено вчера',
        titlesCount: {
            one: '{count} тайтл',
            few: '{count} тайтла',
            many: '{count} тайтлов'
        },
        animeCount: {
            one: '{count} аниме',
            few: '{count} аниме',
            many: '{count} аниме'
        },
        curators: 'Кураторы',
        becomeCurator: 'Станьте куратором',
        curatorDescription: 'Создавайте свои уникальные подборки, делитесь ими с друзьями и попадайте на главную страницу сервиса.',
        start: 'Начать',
        cancel: 'Отмена',
        loadingError: 'Не удалось загрузить коллекции.',
        viewCollection: 'Просмотреть коллекцию',
        viewDetails: 'Просмотреть коллекцию {title}',
        backToAll: 'Все коллекции',
        notFound: 'Коллекция не найдена',
        collection: 'Коллекция',
        curatedBy: 'Собрано',
        curatedByTeam: 'Собрано командой {teamName}',
        emptyCollection: 'В этой коллекции пока нет аниме.',
        viewCuratorsList: 'Посмотреть список кураторов',
        collectionPreview: 'Превью коллекции',
        curatorsList: {
            title: 'Кураторы',
            description: 'Участники, работавшие над коллекцией',
            edits: {
                one: '{count} правка',
                few: '{count} правки',
                many: '{count} правок'
            },
            joined: 'Присоединился',
            roles: {
                admin: 'Администратор',
                moderator: 'Модератор',
                contributor: 'Участник'
            }
        },
        filters: {
            all: 'Все коллекции',
            editorial: 'От редакции',
            community: 'Сообщество',
        },
        form: {
            title: 'Заявка на куратора',
            name: 'Ваше имя',
            namePlaceholder: 'Как к вам обращаться',
            email: 'Email',
            emailPlaceholder: 'Для связи с вами',
            motivation: 'О себе',
            motivationPlaceholder: 'Почему вы хотите создавать подборки?',
            submit: 'Отправить',
            successToast: 'Анкета отправлена! Мы свяжемся с вами.',
        }
    },
    anime: {
        viewDetails: 'Просмотреть детали {title}',
        details: {
            overview: 'Обзор',
            episodes: 'Эпизоды',
            characters: 'Персонажи',
            photos: 'Кадры',
            related: 'Связанное и похожие',
            franchise: 'Хронология',
            similar: 'Рекомендации',
            creators: 'Создатели',
            trailer: 'Трейлер',
            watch: 'Смотреть',
            watchTrailer: 'Трейлер',
            status: 'Статус',
            type: 'Тип',
            episodesCount: 'Эпизодов',
            duration: 'Длительность',
            durationMin: '{count} мин.',
            source: 'Первоисточник',
            studio: 'Студия',
            rating: 'Рейтинг MPAA',
            synopsis: 'Описание',
            readMore: 'Читать полностью',
            readLess: 'Свернуть',
            cast: 'В главных ролях',
            allEpisodes: 'Все серии',
            characterRoles: {
                main: 'Главный',
                supporting: 'Второстепенный'
            },
            statuses: {
                ongoing: 'Выходит',
                released: 'Вышел',
                announced: 'Анонс'
            },
            sources: {
                manga: 'Манга',
                original: 'Оригинал',
                light_novel: 'Ранобэ',
                game: 'Игра',
                visual_novel: 'Визуальная новелла'
            }
        },
        comments: {
            title: 'Комментарии',
            sort: {
                newest: 'Сначала новые',
                oldest: 'Сначала старые',
                popular: 'Популярные'
            },
            emptyTitle: 'Тишина в зале...',
            emptyDescription: 'Комментариев пока нет. Станьте первым, кто поделится своим мнением!'
        },
        reviews: {
            title: 'Оценки и комментарии',
            write: 'Оставить отзыв',
            loginRequired: 'Войдите, чтобы оставить отзыв',
            ratingRequired: 'Необходимо выставить оценку произведения',
            textRequired: 'Поле отзыва не может быть пустым',
            success: 'Отзыв опубликован!',
            yourRating: 'Ваша оценка',
            placeholder: 'Поделитесь впечатлениями об этом аниме...',
            submit: 'Отправить',
            loginToWrite: 'Войдите, чтобы оценить',
            authDescription: 'Только авторизованные пользователи могут оставлять оценки и писать рецензии к аниме.',
            emptyTitle: 'Отзывов пока нет',
            emptyDescription: 'Это аниме еще никто не оценил. Будьте первым!',
            containsSpoiler: 'Содержит спойлер',
            spoilerHidden: 'Отзыв скрыт (спойлер)',
            showSpoiler: 'Показать спойлер',
            hideSpoiler: 'Скрыть',
            sort: {
                newest: 'Сначала новые',
                oldest: 'Сначала старые',
                highest: 'Высокая оценка',
                lowest: 'Низкая оценка'
            }
        }
    },
    favorites: {
        title: 'Избранное',
        description: 'Ваш личный список к просмотру.',
        emptyTitle: 'Список пуст',
        emptyDescription: 'Добавляйте аниме в избранное, чтобы не потерять их.',
        exploreCatalog: 'Перейти в каталог',
        tabs: {
            all: 'Все',
            watching: 'Смотрю',
            planned: 'В планах',
            completed: 'Просмотрено',
            dropped: 'Брошено',
            paused: 'На паузе'
        }
    },
    history: {
        title: 'История просмотра',
        description: 'Продолжите просмотр с того места, где остановились.',
        clearHistory: 'Очистить историю',
        emptyTitle: 'История пуста',
        emptyDescription: 'Здесь будут отображаться просмотренные вами аниме.',
        exploreCatalog: 'Перейти в каталог',
        loadingError: 'Не удалось загрузить историю.',
        today: 'Сегодня',
        yesterday: 'Вчера',
        earlier: 'Ранее',
        episode: 'Эпизод',
        timeLeft: {
            one: 'Осталась {mins} мин',
            few: 'Осталось {mins} мин', // 2-4 минуты
            many: 'Осталось {mins} мин' // 5 минут
        },
        confirmClear: 'Вы уверены, что хотите очистить всю историю?',
        clearOptions: {
            lastHour: 'Последний час',
            today: 'За 24 часа',
            all: 'Всю историю'
        },
        removeModal: {
            title: 'Удалить из истории?',
            description: 'Вы действительно хотите удалить этот эпизод из истории? Прогресс просмотра этого эпизода будет безвозвратно потерян.',
            confirm: 'Удалить',
            ariaLabelRemove: 'Удалить из истории'
        },
        showMoreFor: 'Показать еще для {group}',
        continueWatching: 'Продолжить просмотр {title}',
    },
    topCharts: {
        title: 'Топ чарты',
        titleViews: 'Топ просмотров',
        titleRating: 'Высокий рейтинг',
        description: 'Самые популярные аниме на нашем сервисе.',
        periods: {
            week: 'За неделю',
            month: 'За месяц',
            year: 'За год',
            all: 'За все время'
        },
        metrics: {
            views: 'По просмотрам',
            rating: 'По рейтингу'
        },
        views: 'просмотров',
        rating: 'Рейтинг',
        ratingLabel: 'Рейтинг'
    },
    character: {
        notFound: 'Персонаж не найден',
        voiceActor: 'Актер озвучки',
        voiceActors: 'Актеры озвучки',
        about: 'О персонаже',
        appearsIn: 'Появления',
    }
};
