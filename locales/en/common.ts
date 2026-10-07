
export const common = {
    appName: 'CineNetwork',
    toasts: {
        socialsUnavailable: 'Our social networks are temporarily unavailable. We are working on it!',
        dismiss: 'Dismiss notification',
        addedToFavorites: 'Added to favorites',
        removedFromFavorites: 'Removed from favorites',
        statusUpdated: 'Status updated: {status}',
        copyFailed: 'Failed to copy',
        copyError: 'Copy error',
        copiedName: 'Name copied: {name}',
        success: 'Success',
        reportSent: 'Report sent. Thank you for your help!',
    },
    errors: {
        notFound: {
            title: '404',
            subtitle: 'Scene Not Found',
            description: 'It seems this frame was cut during editing or never existed.',
            backToHome: 'Back to Theater',
        },
        general: {
            title: 'Error',
            subtitle: 'Projection Room Issue',
            description: 'Something went wrong. Our mechanics are already working on fixing it.',
            reload: 'Reload Page',
            backToHome: 'Back to Home',
        }
    },
    search: {
        placeholder: "Search documentation...",
        resultsFor: "Search results for",
        noResults: "No results found",
        tryDifferentQuery: "Try a different query or change the search category.",
        searching: "Searching...",
        searchError: "Search error. Please try again later.",
        possibleResults: "You might be looking for",
    },
    pagination: {
        previous: 'Previous page',
        next: 'Next page',
    },
    ui: {
        back: 'Back',
        scrollLeft: 'Scroll left',
        scrollRight: 'Scroll right',
        category: 'Category',
        any: 'Any',
        anyMasculine: 'Any',
        filters: 'Filters',
        filtersUnavailable: 'Filters unavailable',
        applyFilters: 'Apply Filters',
        applyAndSearch: 'Apply & Search',
        find: 'Find',
        more: 'More',
        showMore: 'Show more',
        connected: 'Connected',
        connect: 'Connect',
        delete: 'Delete',
        added: 'Added',
        active: 'ACTIVE',
        viewAllCurators: 'View all curators',
        select: 'Select...',
        ok: 'OK',
        systemOutput: 'System Output',
        titles: 'Titles',
        csv: 'CSV',
        backToTop: 'Back to top',
        loading: 'Loading...',
        langBadge: 'EN',
        ellipsis: '...',
        copyName: 'Copy name',
    },
    time: {
        minutesAgo: '{count}m ago',
        hoursAgo: '{count}h ago',
        justNow: 'Just now'
    },
    report: {
        title: 'Report Content',
        reason: 'Reason for reporting',
        description: 'Additional details',
        descriptionPlaceholder: 'Describe the issue...',
        submit: 'Submit Report',
        cancel: 'Cancel',
        reasons: {
            spam: 'Spam or advertising',
            spoiler: 'Spoiler without tag',
            offensive: 'Insults or toxicity',
            other: 'Other'
        }
    }
};
