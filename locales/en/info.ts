
import { enDocs } from '../docs/en';

export const info = {
    hero: {
        watch: 'Watch',
        watchLater: 'Add to List',
    },
    home: {
        trendingNow: 'Trending Now',
        newReleases: 'New Releases',
        best: 'The Best',
        movies: 'Movies',
        loadingError: 'Failed to load the main page.',
        showMore: 'Show more',
    },
    news: {
        loadingError: 'Failed to load news.',
        readMore: 'Read news post',
    },
    banner: {
        goToSlide: 'Go to slide {slide}',
        confirmTitle: 'External Link Navigation',
        confirmDescription: 'Are you sure you want to navigate to the external link?',
        confirmAction: 'Proceed',
        cancelAction: 'Cancel'
    },
    blogPost: {
        backToNews: 'Back to News',
        tableOfContents: 'Table of Contents',
        thankYou: 'Thanks for reading!',
        share: 'Share:',
        copyLink: 'Copy Link',
        copied: 'Copied!',
        notFound: 'News post not found',
    },
    support: {
        backToHome: 'Back to Home',
        title: 'Support Center',
        description: 'Describe your issue, and our team will assist you as soon as possible.',
        yourName: 'Your Name',
        namePlaceholder: 'How should we call you?',
        contactEmail: 'Contact Email',
        emailPlaceholder: 'name@example.com',
        problemCategory: 'Problem Category',
        subject: 'Subject',
        subjectPlaceholder: 'Briefly describe the issue',
        detailedDescription: 'Detailed Description',
        descriptionPlaceholder: 'Describe the steps to reproduce the problem or the details of your question...',
        attachFiles: 'Attach Materials',
        files: 'Files',
        videoLink: 'Video Link',
        dropFiles: 'Drop files here',
        fileSizeLimit: 'up to 10MB',
        linkPlaceholder: 'https://youtube.com/watch?v=...',
        sendTicket: 'Submit Ticket',
        faq: 'FAQ',
        faqDescription: 'The solution to your problem might be in our documentation.',
        goToFaq: 'Go to FAQ',
        serviceStatus: 'Service Status',
        statusDescription: 'Check system availability if you are experiencing connection issues.',
        goToStatus: 'Go to Status',
        contacts: 'Contacts',
        formErrors: {
            required: 'Required',
            validationError: 'Please fill in all required fields.',
            invalidLink: 'Invalid link (must start with http)'
        },
        ticketSuccess: 'Ticket created! We will contact you shortly.',
    },
    status: {
        backToHome: 'Back to Home',
        title: 'Service Status',
        description: 'Current information about the availability of our services.',
        allSystemsOperational: 'All Systems Operational',
        someSystemsDown: 'Some systems are experiencing issues',
        latency: 'Latency',
        uptime: 'Uptime (24h)',
        performance24h: 'Performance over 24 hours',
        now: 'Now',
        h24ago: '24h ago',
        h12ago: '12h ago',
        h0ago: '0h',
    },
    settings: {
        title: "Settings",
        description: "Manage your profile and application preferences.",
        inDevelopment: {
            title: "Under Development",
            description: "We are working on making this section as useful as possible for you. Please check back later.",
            backToHome: "Back to Home"
        },
        tabs: {
            profile: "Profile",
            preferences: "Preferences",
            subscription: "Subscription",
        },
        profile: {
            username: "Username",
            email: "Email Address",
            changeAvatar: "Change Avatar",
            saveChanges: "Save Changes",
            linkedAccounts: "Linked Accounts",
            avatarAlt: 'Avatar',
            socials: {
                google: "Google",
                telegram: "Telegram",
                discord: "Discord",
                yandex: "Yandex"
            },
            connectSocial: 'Connect {provider}',
            disconnectSocial: 'Disconnect {provider}',
        },
        preferences: {
            autoplay: "Autoplay",
            quality: "Default Video Quality",
            notifications: "New Release Notifications",
            interfaceLanguage: "Interface Language",
        },
        subscription: {
            currentPlan: "Current Plan",
            premium: "Premium (4K + HDR)",
            activeUntil: "Active until {date}",
            manage: "Manage Subscription",
            benefits: "You have access to 4K streaming, no ads, and early access releases.",
        }
    },
    profile: {
        tabs: {
            overview: 'Overview',
            lists: 'Lists',
            collections: 'Collections',
            comments: 'Comments',
            reviews: 'Ratings & Comments'
        },
        reviewsTab: {
            filterAll: 'All',
            filterRatings: 'Ratings Only',
            filterComments: 'Comments Only'
        },
        level: 'Level',
        xp: 'XP',
        stats: {
            episodes: 'Episodes',
            titles: 'Titles',
            days: 'Days',
            comments: 'Comments',
            reviews: 'Reviews',
            avgScore: 'Avg Score'
        },
        activity: {
            title: 'Recent Activity',
            empty: 'No recent activity',
            types: {
                watched: 'Watched',
                rated: 'Rated',
                commented: 'Commented',
                added_list: 'Listed',
                achievement: 'Achievement'
            }
        },
        dynamics: {
            title: 'Viewing Dynamics',
            subtitle: 'Last 14 days'
        },
        achievements: {
            title: 'Achievements',
            viewAll: 'All'
        },
        friends: {
            title: 'Friends',
            all: 'All',
            empty: 'No friends yet'
        },
        collections: {
            title: 'User Collections',
            empty: 'No collections yet'
        },
        commentsHistory: {
            title: 'Reviews Feed',
            to: 'to'
        },
        joined: 'Joined {date}',
        edit: 'Edit',
        publicTitle: 'User Profile',
        actions: {
            follow: 'Follow',
            following: 'Following',
            message: 'Message',
            followed: 'You are now following this user',
            unfollowed: 'Unfollowed',
            report: 'Report',
            reportProfile: 'Report Profile',
            copyLink: 'Copy Link',
            block: 'Block'
        }
    },
    team: {
        name: "CineNetwork"
    },
    docs: {
        backToHome: 'Back to Home',
        title: 'Documentation',
        description: 'Legal information and terms of service.',
        lastUpdated: 'Last updated: 01.02.2026',
        downloadPdf: 'Download PDF',
        print: 'Print',
        prevDoc: 'Previous document',
        nextDoc: 'Next document',
        selectDoc: 'Select document',
        sections: enDocs
    },
};
