<p align="center">
  <img src="https://github.com/user-attachments/assets/74c1e9a4-d070-4f82-9171-8a1daff13d09"
       alt="Banner"
       width="100%">
</p>

# CineNetwork Frontend (cinenetwork-frontend)

SPA-интерфейс стримингового сервиса аниме/кино: каталог, расписание, новости,
коллекции, профили, админ-панель. Работает полностью на моках (без бэкенда),
переключается на реальный REST API одной переменной окружения.

## Стек

React 18 · TypeScript (strict) · Vite · React Router · TanStack Query ·
Zustand (persist) · React Hook Form + Zod · Tailwind CSS · Headless UI ·
Virtuoso · DOMPurify · Vitest + happy-dom · ESLint (flat config)

## Команды

```bash
npm install
npm run dev        # дев-сервер
npm run build      # прод-сборка
npm run preview    # предпросмотр сборки
npm run typecheck  # tsc --noEmit (strict)
npm run lint       # eslint
npm run format     # prettier --write
npm run test       # vitest (однократно); test:watch — режим наблюдения
npm run verify     # typecheck + lint + test + build (CI-гейт)
```

Pre-commit хук (husky + lint-staged) прогоняет ESLint и Prettier
по изменённым файлам; CI (`.github/workflows/ci.yml`) выполняет `verify`
целиком на каждый push/PR.

## Deployment

Приложение использует **BrowserRouter** (чистые URL без `#`). Статический
хостинг обязан отдавать `index.html` для всех путей (SPA fallback):

```
# nginx
location / { try_files $uri $uri/ /index.html; }
```

```
# Netlify (public/_redirects)
/*  /index.html  200
```

Шрифты (Inter) и иконки (Font Awesome) self-hosted через npm — внешних CDN
в рантайме нет, работает строгий CSP.

## Demo assets

Реальные постеры/обложки/логотип — бинарные ассеты, которых нет в git
(лицензионный контент). Для локальной разработки сгенерируйте
градиентные плейсхолдеры по всем путям, которые используют фикстуры:

```bash
node scripts/generate-placeholder-assets.mjs
```

Каталог `public/assets/` добавлен в `.gitignore` — плейсхолдеры никогда не
коммитятся. Компоненты при этом деградируют gracefully: `AnimeImage` и
`NavbarLogo` показывают стилизованные fallback'и, если файл отсутствует.

## Переменные окружения

См. [`.env.example`](./.env.example) — это шаблон конфигурации: скопируйте
его в `.env` и заполните при необходимости.

```bash
cp .env.example .env
```

По умолчанию приложение работает на mock-провайдерах; `VITE_API_ENABLED=true`

- `VITE_API_BASE_URL` включают реальный REST-слой
  (`services/providers/apiProvider.ts`). Значения валидируются при старте
  (`utils/env.ts`): некорректный `.env` падает с читаемой ошибкой, а не
  молча misbehaves позже.

## Архитектура

```
types/            доменные модели, DTO, enum'ы (единственный источник правды)
mappers/          DTO -> домен (единственное место, знающее про схему API)
services/
  providers/      контракты данных + Mock* и Api* реализации
  httpClient.ts   типизированный fetch-клиент (таймауты, ошибки)
  *Service.ts     тонкие обёртки над провайдерами (DI через конструктор)
store/            Zustand-сторы клиентского состояния (persist, лимиты)
context/          Auth / Locale / Toast
hooks/            логика страниц (TanStack Query + UI-состояние)
components/       презентация (страницы, UI-кит, скелетоны)
utils/            i18n, детерминированный random, валидация, SEO
locales/          словари ru/en
```

Правила слоёв:

- `services` и `store` **не импортируют** из `hooks`/`components`
  (раньше типы админки жили в UI-хуках — перенесены в `types/admin.ts`);
- кеширование/сталость данных — только TanStack Query, клиентское
  состояние — только Zustand;
- mock-данные детерминированы (`utils/random.ts`), чтобы списки не
  «прыгали» между рефетчами.

Подробный разбор исправленных проблем — в [`AUDIT.md`](./AUDIT.md).
