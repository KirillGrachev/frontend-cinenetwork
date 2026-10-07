
import { CatalogConfig, FooterConfig, ScheduleDay, AuthConfig, NewsPageConfig, ServiceGroup, Incident, SupportTopic, DocSection, AppView, ServiceStatus, CatalogSelection, SortOptionValue } from './types';
import { TFunction } from './context/LocaleContext';

/** ===================================================================== */
/** APP CONFIGURATION (Backend-ready structures) */
/** ===================================================================== */

export const getCatalogConfig = (t: TFunction): CatalogConfig => ({
  seasons: t('constants.seasons'),
  genres: t('constants.genres'),
  studios: t('constants.studios'),
  yearRange: {
    min: 1958,
    max: 2026
  },
  selections: [
      { label: t('catalog.filters.selections.trending'), value: CatalogSelection.Trending },
      { label: t('catalog.filters.selections.new'), value: CatalogSelection.New },
      { label: t('catalog.filters.selections.best'), value: CatalogSelection.Best },
      { label: t('catalog.filters.selections.movies'), value: CatalogSelection.Movies },
  ],
  sortOptions: [
    { label: t('constants.sortOptions.popularity'), value: SortOptionValue.Popularity, icon: 'fa-solid fa-fire' },
    { label: t('constants.sortOptions.rating'), value: SortOptionValue.Rating, icon: 'fa-solid fa-star' },
    { label: t('constants.sortOptions.newest'), value: SortOptionValue.Newest, icon: 'fa-solid fa-calendar' },
    { label: t('constants.sortOptions.alphabet'), value: SortOptionValue.Alphabet, icon: 'fa-solid fa-arrow-down-a-z' },
  ]
});

export const getSupportTopics = (t: TFunction): SupportTopic[] => ([
    { id: 'tech', label: t('constants.supportTopics.tech') },
    { id: 'account', label: t('constants.supportTopics.account') },
    { id: 'billing', label: t('constants.supportTopics.billing') },
    { id: 'content', label: t('constants.supportTopics.content') },
    { id: 'collab', label: t('constants.supportTopics.collab') },
    { id: 'other', label: t('constants.supportTopics.other') }
]);

export const getNewsPageConfig = (t: TFunction): NewsPageConfig => ({
  title: t('constants.newsPage.title'),
  description: t('constants.newsPage.description')
});

export const getFooterConfig = (t: TFunction): Omit<FooterConfig, 'languages'> => ({
  navLinks: [
    { label: t('footer.navLinks.home'), view: AppView.Home },
    { label: t('footer.navLinks.catalog'), view: AppView.Catalog },
    { label: t('footer.navLinks.schedule'), view: AppView.Schedule },
    { label: t('footer.navLinks.news'), view: AppView.News },
    { label: t('footer.navLinks.docs'), view: AppView.Docs }
  ],
  userLinks: [
    { label: t('footer.userLinks.login'), view: AppView.Login },
    { label: t('footer.userLinks.register'), view: AppView.Register },
    { label: t('footer.userLinks.settings'), view: AppView.Settings },
    { label: t('footer.userLinks.status'), view: AppView.Status },
    { label: t('footer.userLinks.support'), view: AppView.Support }
  ],
  socialLinks: [
    { label: t('footer.socials.vk'), icon: "fa-brands fa-vk", href: "#" },
    { label: t('footer.socials.telegram'), icon: "fa-brands fa-telegram", href: "https://t.me/CineNetwork_Off" },
    { label: t('footer.socials.discord'), icon: "fa-brands fa-discord", href: "#" },
    { label: t('footer.socials.youtube'), icon: "fa-brands fa-youtube", href: "#" },
  ],
  emails: {
    copyright: "copyrights@cinenetwork.space",
    contact: "contact@cinenetwork.space"
  },
  legalText: t('footer.legal'),
  copyrightText: t('footer.copyrightText')
});

export const getScheduleDays = (t: TFunction): ScheduleDay[] => ([
  { id: 'mon', label: t('constants.scheduleDays.mon.label'), short: t('constants.scheduleDays.mon.short') },
  { id: 'tue', label: t('constants.scheduleDays.tue.label'), short: t('constants.scheduleDays.tue.short') },
  { id: 'wed', label: t('constants.scheduleDays.wed.label'), short: t('constants.scheduleDays.wed.short') },
  { id: 'thu', label: t('constants.scheduleDays.thu.label'), short: t('constants.scheduleDays.thu.short') },
  { id: 'fri', label: t('constants.scheduleDays.fri.label'), short: t('constants.scheduleDays.fri.short') },
  { id: 'sat', label: t('constants.scheduleDays.sat.label'), short: t('constants.scheduleDays.sat.short') },
  { id: 'sun', label: t('constants.scheduleDays.sun.label'), short: t('constants.scheduleDays.sun.short') },
]);

export const AUTH_CONFIG: AuthConfig = {
  socialProviders: [
    'fa-brands fa-telegram', 
    'fa-brands fa-discord', 
    'fa-brands fa-google', 
    'fa-brands fa-yandex'
  ]
};

/** ===================================================================== */
/** DOCUMENTATION CONTENT */
/** ===================================================================== */

export const getDocsContent = (t: TFunction): DocSection[] => ([
    {
        id: 'agreement',
        title: t('docs.sections.agreement.title'),
        content: t('docs.sections.agreement.content')
    },
    {
        id: 'privacy',
        title: t('docs.sections.privacy.title'),
        content: t('docs.sections.privacy.content')
    },
    {
        id: 'rights',
        title: t('docs.sections.rights.title'),
        content: t('docs.sections.rights.content')
    },
    {
        id: 'dmca',
        title: t('docs.sections.dmca.title'),
        content: t('docs.sections.dmca.content')
    },
    {
        id: 'faq',
        title: t('docs.sections.faq.title'),
        content: t('docs.sections.faq.content')
    },
]);

/** ===================================================================== */
/** STATUS PAGE DATA */
/** ===================================================================== */

/** Helper to generate random healthy history */
const generateHistory = (min: number, max: number) => 
    Array.from({ length: 24 }, () => Math.floor(Math.random() * (max - min + 1) + min));

export const getStatusGroups = (t: TFunction): ServiceGroup[] => ([
  {
    name: t('constants.status.groups.platform'),
    services: [
      { id: "web", name: t('constants.status.services.web'), status: ServiceStatus.Operational, uptime: 99.99, history: generateHistory(90, 100) },
      { id: "api", name: t('constants.status.services.api'), status: ServiceStatus.Operational, uptime: 99.95, latency: 45, history: generateHistory(85, 98) },
      { id: "auth", name: t('constants.status.services.auth'), status: ServiceStatus.Operational, uptime: 100, history: generateHistory(98, 100) },
    ]
  },
  {
    name: t('constants.status.groups.media'),
    services: [
      { id: "encoding", name: t('constants.status.services.encoding'), status: ServiceStatus.Operational, uptime: 100, history: generateHistory(95, 100) },
      { id: "storage", name: t('constants.status.services.storage'), status: ServiceStatus.Degraded, uptime: 99.8, history: [...generateHistory(80, 95), 45, 60] },
    ]
  },
   {
    name: t('constants.status.groups.databases'),
    services: [
      { id: "mainDb", name: t('constants.status.services.mainDb'), status: ServiceStatus.Operational, uptime: 100, latency: 12, history: generateHistory(98, 100) },
      { id: "search", name: t('constants.status.services.search'), status: ServiceStatus.Operational, uptime: 99.99, latency: 25, history: generateHistory(90, 100) },
    ]
  }
]);

export const getRecentIncidents = (t: TFunction): Incident[] => ([
  // ...
]);
