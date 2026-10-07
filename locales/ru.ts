import { admin } from './ru/admin';
import { auth } from './ru/auth';
import { layout } from './ru/layout';
import { common } from './ru/common';
import { media } from './ru/media';
import { info } from './ru/info';
import { data } from './ru/data';

export const ru = {
  langName: 'Русский',
  languages: {
    ru: 'Русский',
    en: 'Английский',
  },
  admin,
  auth,
  ...layout,
  layout,
  ...common,
  common,
  ...media,
  media,
  ...info,
  info,
  ...data,
  data,
};