
export const admin = {
    title: 'Admin Dashboard',
    description: 'Overview of key performance indicators and system monitoring.',
    goToComments: 'Moderation',
    tabs: {
        overview: 'Overview',
        content: 'Content',
        finance: 'Finance',
        system: 'System',
    },
    periods: {
        d24: '24 hours',
        d7: '7 days',
        d30: '30 days'
    },
    metrics: {
        totalUsers: 'Total Users',
        activeNow: 'Active Now',
        revenue: 'Revenue (Net)',
        totalViews: 'Views',
    },
    charts: {
        revenueTraffic: 'Traffic & Revenue Dynamics',
        contentDist: 'Content Distribution',
        serverLoad: 'Server Load',
        storage: 'Content Storage',
    },
    transactions: {
        title: 'Recent Transactions',
        user: 'User',
        plan: 'Plan',
        amount: 'Amount',
        status: 'Status',
        statusCompleted: 'Success',
        statusPending: 'Pending',
        plans: {
            yearly: 'Premium (Yearly)',
            monthly: 'Premium (Monthly)'
        }
    },
    topContent: {
        title: 'Top Viewed',
        views: 'views',
        rating: 'Rating'
    },
    resources: {
        cpu: 'CPU Core',
        ram: 'RAM Usage',
        net: 'Network In/Out',
        storage: 'Storage',
        mbps: 'Mbps'
    },
    overview: {
      trafficTitle: 'Traffic Dynamics',
      trafficSubtitle: 'Daily viewing statistics',
      total: 'Total'
    },
    content: {
      filterAll: 'All Types',
      filterTv: 'TV Series',
      filterMovie: 'Movies',
      types: {
          tv: 'TV',
          movie: 'Movie'
      }
    },
    activityLog: {
        title: 'Event Log',
        details: 'Details',
        exportStarted: 'Report generating. Download will start automatically.',
        fullLogTitle: 'Full Event Log',
        fullLogDescription: 'Detailed history of all user and system actions.',
        searchPlaceholder: 'Search by user...',
        allEvents: 'All Events',
        empty: 'No events found matching criteria.',
        types: {
            success: 'Success',
            info: 'Info',
            warning: 'Warning',
        },
        actions: {
            register: 'New Registration',
            subscription: 'Subscription Purchased',
            report: 'Content Report',
            error: 'System Error',
            ban: 'User Banned',
        },
        descriptions: {
            userCreatedAccount: 'User created an account',
            purchasedMonthly: 'Purchased Premium (Monthly)',
            flaggedComment: 'Flagged comment ID #{id}',
            encodingError: 'Failed to encode video #{id}',
            bannedUserForSpam: 'Banned user for spam'
        }
    },
    comments: {
        title: 'Moderation Center',
        description: 'Manage user content and handle reports.',
        sections: {
            comments: 'Comments',
            reviews: 'Reviews',
            tickets: 'Tickets',
            panel: 'Moderator Panel'
        },
        filters: {
            all: 'All',
            pending: 'Pending',
            flagged: 'Reports',
            approved: 'Approved',
            rejected: 'Rejected'
        },
        actions: {
            approve: 'Approve',
            reject: 'Delete',
            ban: 'Ban'
        },
        reasons: {
            user_report: 'User Report',
            spam: 'Spam / Ads',
            offensive: 'Offensive',
            spoiler: 'Spoiler'
        },
        empty: 'No items to review.',
        avatarAlt: 'Avatar for user {username}',
        modal: {
            approveTitle: 'Confirm Approval',
            rejectTitle: 'Reject Content',
            sureApprove: 'Are you sure you want to publish this content?',
            reasonLabel: 'Rejection Reason',
            reasonPlaceholder: 'Specify the reason for deletion...',
            banLabel: 'Action Ban',
            selectDuration: 'Select duration',
            confirmReject: 'Delete & Apply',
            confirmApprove: 'Approve',
            cancel: 'Cancel',
            bans: {
                none: 'Delete Only',
                '1h': '1 Hour Ban',
                '24h': '24 Hour Ban',
                '7d': '7 Day Ban',
                'perm': 'Permanent Ban'
            }
        }
    },
    users: {
        title: 'Users',
        description: 'Manage accounts, roles, and access.',
        searchPlaceholder: 'Search by name or email...',
        table: {
            user: 'User',
            role: 'Role',
            status: 'Status',
            joined: 'Joined',
            actions: 'Actions'
        },
        filters: {
            all: 'All Users',
            admin: 'Admins',
            moderator: 'Moderators',
            user: 'Users',
            banned: 'Banned'
        },
        roles: {
            admin: 'Administrator',
            moderator: 'Moderator',
            user: 'User'
        },
        status: {
            active: 'Active',
            banned: 'Banned'
        },
        actions: {
            edit: 'Edit Role',
            ban: 'Ban',
            unban: 'Unban',
            delete: 'Delete'
        },
        modal: {
            editTitle: 'Edit User',
            banTitle: 'Ban User',
            deleteTitle: 'Delete User',
            roleLabel: 'Role',
            banDurationLabel: 'Ban Duration',
            reasonLabel: 'Reason',
            banReasonLabel: 'Ban Reason',
            confirmUnbanDescription: 'Are you sure you want to unban {user}? Access will be restored.',
            confirmDeleteDescription: 'Are you sure you want to delete {user}? This action cannot be undone.',
            confirmSave: 'Save',
            confirmBan: 'Ban',
            confirmDelete: 'Delete',
            cancel: 'Cancel'
        },
        toasts: {
            roleUpdated: 'User role updated',
            userBanned: 'User banned',
            userUnbanned: 'User unbanned',
            userDeleted: 'User deleted'
        }
    }
};
