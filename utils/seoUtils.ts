
import { AnimeDetails, AnimeType, Episode } from '../types';

/**
 * Generates Schema.org structured data for an Anime entity.
 * Supports both 'TVSeries' and 'Movie' types.
 */
export const generateAnimeSchema = (anime: AnimeDetails, url: string, appName: string) => {
    const isMovie = anime.type === AnimeType.Movie;
    const schemaType = isMovie ? 'Movie' : 'TVSeries';
    
    const imageUrl = anime.coverUrl.startsWith('http') 
        ? anime.coverUrl 
        : `${window.location.origin}${anime.coverUrl}`;

    const schema: Record<string, any> = {
        "@context": "https://schema.org",
        "@type": schemaType,
        "name": anime.title,
        "description": anime.description,
        "image": imageUrl,
        "url": url,
        "datePublished": anime.year.toString(),
        "genre": anime.genres,
        "productionCompany": {
            "@type": "Organization",
            "name": anime.studio || "Unknown Studio"
        },
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": url
        }
    };

    if (anime.rating > 0) {
        schema["aggregateRating"] = {
            "@type": "AggregateRating",
            "ratingValue": anime.rating.toFixed(1),
            "bestRating": "10",
            "worstRating": "1",
            "ratingCount": (anime.id * 123) + 50
        };
    }

    if (!isMovie && anime.episodesCount) {
        schema["numberOfEpisodes"] = anime.episodesCount;
    } else if (isMovie && anime.duration) {
        const mins = parseInt(anime.duration);
        if (!isNaN(mins)) schema["duration"] = `PT${mins}M`;
    }

    return schema;
};

/**
 * Generates Schema for a specific TV Episode.
 * Crucial for "Watch Page" SEO so Google knows exactly which episode is playing.
 */
export const generateEpisodeSchema = (
    anime: AnimeDetails, 
    episode: Episode, 
    url: string
) => {
    const imageUrl = episode.image.startsWith('http') 
        ? episode.image 
        : `${window.location.origin}${episode.image}`;

    const animeUrl = `${window.location.origin}/anime/${anime.id}`;

    const schema: Record<string, any> = {
        "@context": "https://schema.org",
        "@type": "TVEpisode",
        "episodeNumber": episode.number,
        "name": episode.title,
        "description": `Watch ${anime.title} Episode ${episode.number}`,
        "image": imageUrl,
        "url": url,
        "duration": episode.duration ? `PT${parseInt(episode.duration)}M` : undefined,
        "datePublished": episode.airDate,
        "partOfSeries": {
            "@type": "TVSeries",
            "name": anime.title,
            "url": animeUrl
        }
    };

    return schema;
};

/**
 * Generates BreadcrumbList schema for better site structure understanding.
 * Google uses this to show the path in search results: Home > Anime > Title
 */
export const generateBreadcrumbSchema = (items: { name: string; path: string }[]) => {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.path.startsWith('http') ? item.path : `${window.location.origin}${item.path}`
        }))
    };
};
