import { lazy } from 'react';

const Home = lazy(() => import('./components/Home'));
const Catalog = lazy(() => import('./components/Catalog'));
const Collections = lazy(() => import('./components/Collections'));
const CollectionDetail = lazy(() => import('./components/CollectionDetail'));
const CollectionCurators = lazy(() => import('./components/collections/CollectionCurators'));
const Schedule = lazy(() => import('./components/Schedule'));
const News = lazy(() => import('./components/News'));
const BlogPost = lazy(() => import('./components/BlogPost'));
const Registration = lazy(() => import('./components/Registration'));
const Login = lazy(() => import('./components/Login'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const VerifyEmail = lazy(() => import('./components/VerifyEmail'));
const StatusPage = lazy(() => import('./components/StatusPage'));
const Support = lazy(() => import('./components/Support'));
const Documentation = lazy(() => import('./components/Documentation'));
const Settings = lazy(() => import('./components/Settings'));
const SearchView = lazy(() => import('./components/SearchView'));
const Favorites = lazy(() => import('./components/Favorites'));
const History = lazy(() => import('./components/History'));
const AdminStats = lazy(() => import('./components/admin/Stats'));
const AdminModeration = lazy(() => import('./components/admin/Moderation'));
const AdminActivityLog = lazy(() => import('./components/admin/ActivityLog'));
const AdminUsers = lazy(() => import('./components/admin/Users'));
const TopCharts = lazy(() => import('./components/TopCharts'));
const AnimePage = lazy(() => import('./components/AnimePage'));
const CharacterPage = lazy(() => import('./components/CharacterPage'));
const WatchPage = lazy(() => import('./components/WatchPage'));
const StudioPage = lazy(() => import('./components/StudioPage'));
const Profile = lazy(() => import('./components/Profile'));
const Notifications = lazy(() => import('./components/Notifications'));
const NotFound = lazy(() => import('./components/NotFound'));

export {
    Home,
    Catalog,
    Collections,
    CollectionDetail,
    CollectionCurators,
    Schedule,
    News,
    BlogPost,
    Registration,
    Login,
    ForgotPassword,
    VerifyEmail,
    StatusPage,
    Support,
    Documentation,
    Settings,
    SearchView,
    Favorites,
    History,
    AdminStats,
    AdminModeration,
    AdminActivityLog,
    AdminUsers,
    TopCharts,
    AnimePage,
    CharacterPage,
    WatchPage,
    StudioPage,
    Profile,
    Notifications,
    NotFound,
};
