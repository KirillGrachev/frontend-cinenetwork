
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocale } from '../context/LocaleContext';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    type?: 'website' | 'article' | 'video.movie' | 'video.tv_show' | 'video.episode' | 'profile';
    structuredData?: Record<string, any> | Record<string, any>[];
}

const SEO: React.FC<SEOProps> = ({ title, description, image, type = 'website', structuredData }) => {
    const { t } = useLocale();
    const siteName = t('common.appName');
    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const defaultDesc = t('layout.footer.slogan'); // Using slogan as fallback description
    const metaDescription = description ? description.substring(0, 160) : defaultDesc; // Truncate for SEO best practices

    // Ensure absolute URL for OG images
    const siteUrl = window.location.origin;
    const currentUrl = window.location.href;
    const metaImage = image 
        ? (image.startsWith('http') ? image : `${siteUrl}${image}`) 
        : `${siteUrl}/assets/logo/white-cinenetwork.png`; // Fallback image

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:image" content={metaImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />

            {/* Structured Data (JSON-LD) */}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
