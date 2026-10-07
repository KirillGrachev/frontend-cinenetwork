import { admin } from './en/admin';
import { auth } from './en/auth';
import { layout } from './en/layout';
import { common } from './en/common';
import { media } from './en/media';
import { info } from './en/info';
import { data } from './en/data';

export const en = {
  langName: 'English',
  languages: {
    ru: 'Russian',
    en: 'English',
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