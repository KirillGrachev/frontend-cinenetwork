import type React from 'react';
import { useMemo } from 'react';
import { useLocale } from '../context/LocaleContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { getSiteOrigin, getSiteUrl, toAbsoluteUrl } from '../utils/siteUrl';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    type?: 'website' | 'article' | 'video.movie' | 'video.tv_show' | 'video.episode' | 'profile';
    structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

const DEFAULT_OG_IMAGE = '/assets/logo/white-cinenetwork.png';

/**
 * Per-page metadata. Renders nothing; all work happens in useDocumentMeta
 * (previously react-helmet-async — dropped as unmaintained and incompatible
 * with React 19 peer ranges).
 */
const SEO: React.FC<SEOProps> = ({
    title,
    description,
    image,
    type = 'website',
    structuredData,
}) => {
    const { t } = useLocale();
    const siteName = t('common.appName');
    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    // Truncate for SEO best practices; slogan as fallback description.
    const metaDescription = description ? description.substring(0, 160) : t('layout.footer.slogan');

    const meta = useMemo(
        () => ({
            title: fullTitle,
            description: metaDescription,
            ogType: type,
            url: getSiteUrl(),
            siteName,
            image: image ? toAbsoluteUrl(image) : `${getSiteOrigin()}${DEFAULT_OG_IMAGE}`,
            structuredData,
        }),
        [fullTitle, metaDescription, type, siteName, image, structuredData],
    );

    useDocumentMeta(meta);

    return null;
};

export default SEO;
