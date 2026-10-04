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

Pre-commit хук (simple-git-hooks + lint-staged) прогоняет ESLint и Prettier
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

## Переменные окружения

См. [`.env.example`](./.env.example). По умолчанию приложение работает на
mock-провайдерах; `VITE_API_ENABLED=true` + `VITE_API_BASE_URL` включают
реальный REST-слой (`services/providers/apiProvider.ts`).

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
