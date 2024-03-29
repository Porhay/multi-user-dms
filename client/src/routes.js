import { ROUTES } from './constants';
import AuthenticationPage from './pages/Authentication';
import DictionariesPage from './pages/Dictionaries';
import EntriesPage from './pages/Entries';
import AccountPage from './pages/Account';
import SettingsPage from './pages/Settings';

export const authRoutes = [
  {
    path: ROUTES.DICTIONARIES,
    Component: DictionariesPage,
  },
  {
    path: ROUTES.ENTRIES + '/:id',
    Component: EntriesPage,
  },
  {
    path: ROUTES.ACCOUNT,
    Component: AccountPage,
  },
  {
    path: ROUTES.SETTINGS,
    Component: SettingsPage,
  },
];

export const publicRoutes = [
  {
    path: ROUTES.LOGIN,
    Component: AuthenticationPage,
  },
  {
    path: ROUTES.REGISTRATION,
    Component: AuthenticationPage,
  },
];
