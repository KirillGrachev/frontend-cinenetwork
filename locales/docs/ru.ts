import { Agreement } from './ru/Agreement';
import { Privacy } from './ru/Privacy';
import { Rights } from './ru/Rights';
import { DMCA } from './ru/DMCA';
import { FAQ } from './ru/FAQ';

export const ruDocs = {
    agreement: {
        title: Agreement.title,
        content: Agreement.content,
    },
    privacy: {
        title: Privacy.title,
        content: Privacy.content,
    },
    rights: {
        title: Rights.title,
        content: Rights.content,
    },
    dmca: {
        title: DMCA.title,
        content: DMCA.content,
    },
    faq: {
        title: FAQ.title,
        content: FAQ.content,
    },
};
