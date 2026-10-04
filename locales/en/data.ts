export const data = {
    genres: {
        shonen: 'Shōnen',
        shojo: 'Shōjo',
        seinen: 'Seinen',
        josei: 'Josei',
        kodomo: 'Kodomo',
        action: 'Action',
        adventure: 'Adventure',
        comedy: 'Comedy',
        drama: 'Drama',
        romance: 'Romance',
        school_life: 'School Life',
        sports: 'Sports',
        mystery: 'Mystery',
        thriller: 'Thriller',
        psychological: 'Psychological',
        supernatural: 'Supernatural',
        historical: 'Historical',
        military: 'Military',
        politics: 'Politics',
        harem: 'Harem',
        sci_fi: 'Sci-Fi',
        fantasy: 'Fantasy',
        post_apocalyptic: 'Post-apocalyptic',
        steampunk: 'Steampunk',
        animals: 'Animals',
        nature: 'Nature',
        music: 'Music',
        dance: 'Dance',
        art: 'Art',
        idol: 'Idol',
        game: 'Game',
        card_game: 'Card Game',
        slice_of_life: 'Slice of Life',
        workplace: 'Workplace',
        family: 'Family',
        food: 'Food',
        martial_arts: 'Martial Arts',
        samurai: 'Samurai',
        ninja: 'Ninja',
        gangster: 'Gangster',
        spy: 'Spy',
        heist: 'Heist',
        police: 'Police',
        isekai: 'Isekai',
        virtual_reality: 'Virtual Reality',
        dream_world: 'Dream World',
        mecha: 'Mecha',
        horror: 'Horror',
        ghosts: 'Ghosts',
        vampires: 'Vampires',
        zombies: 'Zombies',
        magic: 'Magic',
        demons: 'Demons',
        gods: 'Gods',
        reincarnation: 'Reincarnation',
        immortality: 'Immortality',
        parody: 'Parody',
        satire: 'Satire',
        absurd: 'Absurd',
        suspense: 'Suspense',
        sumo: 'Sumo',
        judo: 'Judo',
        baseball: 'Baseball',
        soccer: 'Soccer',
        mahjong: 'Mahjong',
        mystic: 'Mystic',
    },
    constants: {
        seasons: ['Winter', 'Spring', 'Summer', 'Fall'],
        genres: [
            'Action',
            'Adventure',
            'Comedy',
            'Drama',
            'Romance',
            'Slice of Life',
            'Fantasy',
            'Sci-Fi',
            'Shōnen',
            'Shōjo',
            'Seinen',
            'Josei',
            'Kodomo',
            'School Life',
            'Historical',
            'Military',
            'Space',
            'Cyberpunk',
            'Steampunk',
            'Post-apocalyptic',
            'Isekai',
            'Virtual Reality',
            'Sports',
            'Music',
            'Game',
            'Mecha',
            'Magic',
            'Vampires',
            'Demons',
            'Martial Arts',
            'Samurai',
            'Ninja',
            'Police',
            'Mystery',
            'Thriller',
            'Psychological',
            'Horror',
            'Mystic',
            'Parody',
            'Dementia',
            'Suspense',
            'Harem',
            'Workplace',
            'Family',
            'Food',
            'Idol',
            'Supernatural',
        ],
        studios: [
            'MAPPA',
            'Madhouse',
            'Ufotable',
            'A-1 Pictures',
            'Studio Pierrot',
            'Kyoto Animation',
            'Sunrise',
            'Bones',
            'Wit Studio',
            'Toei Animation',
            'Studio Bind',
            'David Production',
            'Studio Trigger',
            'Doga Kobo',
            'CloverWorks',
            '8bit',
            'OLM',
            'Science SARU',
            'Production I.G',
        ],
        sortOptions: {
            popularity: 'By Popularity',
            rating: 'By Rating',
            newest: 'By Newest',
            alphabet: 'By Alphabet',
        },
        supportTopics: {
            tech: 'Technical Issue',
            account: 'Account Issue',
            billing: 'Billing & Subscription',
            content: 'Content Report',
            collab: 'Collaboration',
            other: 'Other',
        },
        newsPage: {
            title: 'News',
            description:
                'Season announcements, voiceover releases, viewing stats and everything anime.',
        },
        scheduleDays: {
            mon: { label: 'Monday', short: 'MON' },
            tue: { label: 'Tuesday', short: 'TUE' },
            wed: { label: 'Wednesday', short: 'WED' },
            thu: { label: 'Thursday', short: 'THU' },
            fri: { label: 'Friday', short: 'FRI' },
            sat: { label: 'Saturday', short: 'SAT' },
            sun: { label: 'Sunday', short: 'SUN' },
        },
        status: {
            groups: {
                platform: 'Platform',
                media: 'Media',
                databases: 'Databases',
            },
            services: {
                web: 'Web Application (Frontend)',
                api: 'Backend API',
                auth: 'Authentication Service',
                encoding: 'Video Encoding Server',
                storage: 'Content Storage',
                mainDb: 'Main DB',
                search: 'Search Index',
            },
            statuses: {
                operational: 'Operational',
                degraded: 'Degraded Performance',
                outage: 'Outage',
                maintenance: 'Maintenance',
                unknown: 'Unknown',
            },
        },
    },
    mock: {
        jujutsuKaisen: {
            title: 'Jujutsu Kaisen 2',
            description:
                'The Shibuya Incident. Curses and sorcerers engage in a fierce battle that will forever change the balance of power. Yuji Itadori must face the consequences of his choices while Satoru Gojo is trapped by the enemy.',
        },
        hellsParadise: {
            title: "Hell's Paradise",
            description:
                'Gabimaru the Hollow, the strongest shinobi from Iwagakure, is sentenced to death. To receive a pardon, he must travel to a mysterious island and find the elixir of immortality.',
        },
        demonSlayer: {
            title: 'Demon Slayer',
            description:
                'Tanjiro Kamado becomes a demon slayer to find a way to turn his sister Nezuko, who became a demon, back into a human.',
        },
        jujutsuKaisen1: {
            title: 'Jujutsu Kaisen',
            description:
                'A world where negative human emotions turn into Curses. Yuji Itadori eats the cursed finger of Ryomen Sukuna and becomes part of the world of sorcerers.',
        },
        attackOnTitan: {
            title: 'Attack on Titan',
            description:
                'Humanity lives behind walls to protect itself from man-eating giants. Eren Yeager vows to destroy all titans after one of them destroys his home.',
        },
        mushokuTensei: {
            title: 'Mushoku Tensei: Jobless Reincarnation',
            description:
                'A 34-year-old unemployed hikikomori dies in a truck accident and is reincarnated in a fantasy world as Rudeus Greyrat, determined to live his new life to the fullest.',
        },
        gachiakuta: {
            title: 'Gachiakuta',
            description:
                'Rudo lives in the slums where the rich dump their trash. Falsely accused of a crime, he is cast into the Abyss, where he gains the power to bring objects to life.',
        },
        undeadUnluck: {
            title: 'Undead Unluck',
            description:
                'Fuuko Izumo brings bad luck to anyone who touches her. She meets Andy, an immortal man seeking a way to die. Together, they confront a mysterious organization.',
        },
        cyberpunkEdgerunners: { title: 'Cyberpunk: Edgerunners' },
        chainsawMan: { title: 'Chainsaw Man' },
        vinlandSaga: { title: 'Vinland Saga' },
        spyXFamily: { title: 'Spy x Family' },
        oshiNoKo: { title: '[Oshi No Ko]' },
        bocchiTheRock: { title: 'Bocchi the Rock!' },
        blueLock: { title: 'Blue Lock' },
        summerTimeRendering: { title: 'Summer Time Rendering' },
        lycorisRecoil: { title: 'Lycoris Recoil' },
        frieren: { title: "Frieren: Beyond Journey's End" },
        soloLeveling: { title: 'Solo Leveling' },
        dandadan: { title: 'Dandadan' },
        kaijuNo8: { title: 'Kaiju No. 8' },
        banners: {
            telegramPromo: 'Telegram Promotion',
        },
        newsTags: {
            announcement: 'Announcement',
            anime: 'Anime',
            season: 'Season',
            releases: 'Releases',
            voiceover: 'Voiceover',
            statistics: 'Statistics',
            player: 'Player',
        },
        franchise: {
            jujutsu: {
                s1: 'Jujutsu Kaisen (Season 1)',
                movie: 'Jujutsu Kaisen 0: The Movie',
            },
        },
        character: {
            description:
                "Loid Forger is the main protagonist of the SPY x FAMILY series. He is a spy for WISE, acting under the codename 'Twilight'. In order to complete Operation Strix and maintain peace between Ostania and Westalis, he creates a fake family.",
        },
        news1: {
            title: 'Demon Slayer Season 2 officially announced',
            excerpt:
                'The studio confirmed the continuation of the Swordsmith Village arc: new episodes, the returning core staff and a premiere broadcast on CineNetwork.',
            readTime: '3 MIN READ',
            toc: {
                details: 'Announcement details',
                story: 'What we know about the story',
                dates: 'When to watch',
            },
            content: {
                intro1: 'The biggest news of the week for shonen fans: <strong>Demon Slayer Season 2</strong> is officially confirmed. The announcement came with a teaser of a key Swordsmith Village arc scene.',
                p_details_1:
                    'ufotable continues production — the animation staff and director are returning. The signature fight choreography and lighting work will stay on par with the first season.',
                p_story_1:
                    'The story follows Tanjiro after the Entertainment District events. According to the creators, expect new breathing techniques, two Upper Moons and the long-awaited meeting with the swordsmith Hotaru.',
                p_story_2:
                    'A separate teaser focused on Nezuko: her storyline gets significant development this season, and one episode is promised to be "the most emotional of the entire franchise".',
                p_dates_1:
                    'The premiere is set for the spring season. New episodes will air weekly on Saturdays and appear in the catalog within an hour of the Japanese broadcast, dubbed and subtitled.',
            },
        },
        news2: {
            title: 'Spring 2026 season: 12 new titles already in the catalog',
            excerpt:
                'Every spring premiere in one place: sequels to hits, adaptations of popular manga and two original projects worth watching.',
            readTime: '4 MIN READ',
            toc: {
                highlights: 'Main premieres',
                where: 'What to watch first',
            },
            content: {
                intro1: 'The spring season has started and all 12 new titles are already available on CineNetwork. It turned out surprisingly strong: four sequels to past hits at once.',
                p_highlights_1:
                    'Highlights include new seasons of Jujutsu Kaisen and The Rising of the Shield Hero, the Blue Lock manga adaptation, and an original cyberpunk thriller from studio MAPPA.',
                p_highlights_2:
                    'The Last Paladin deserves special attention — a slow-burn fantasy that critics already call "the most underrated title of the season".',
                p_where_1:
                    'If you only have time for one anime, start with the MAPPA cyberpunk thriller: its first two episodes set the bar for the whole season. The full airing schedule lives on the Schedule page.',
            },
        },
        news3: {
            title: 'Jujutsu Kaisen 2: new episodes now available in two voiceovers',
            excerpt:
                'Fresh Shibuya Incident episodes are out in a multi-voice dub and with subtitles. Here is how to set your default audio language.',
            readTime: '2 MIN READ',
            toc: {
                voiceovers: 'Available voiceovers',
                schedule: 'Release schedule',
            },
            content: {
                intro1: 'The Shibuya Incident arc has reached its midpoint: new Jujutsu Kaisen 2 episodes are already available to CineNetwork viewers.',
                p_voiceovers_1:
                    'Episodes shipped simultaneously in two versions — a multi-voice dub and subtitles over the original Japanese track. Switch audio right in the player, or set the default language in your profile settings.',
                p_schedule_1:
                    'New episodes drop every Thursday at 19:30 MSK. Premium subscribers get access an hour before everyone else.',
            },
        },
        news4: {
            title: 'Winter wrap-up: top 5 most-watched anime of the season',
            excerpt:
                'We crunched the viewing stats for the winter season: an unexpected leader, a Jujutsu Kaisen record and a classic returning to the charts.',
            readTime: '3 MIN READ',
            toc: {
                top: 'Winter top 5',
                trends: 'Viewing trends',
            },
            content: {
                intro1: 'The winter season is over and we counted what you watched the most. Spoiler: there were surprises.',
                p_top_1:
                    'First place goes to Jujutsu Kaisen 2 — the Shibuya arc collected over 1.2M views this season. Demon Slayer took second, Chainsaw Man third.',
                p_top_2:
                    'Spy x Family 2 and One Punch Man 3 finished fourth and fifth. The biggest surprise was Evangelion returning to the top — fans rewatched the classic after the new film announcement.',
                p_trends_1:
                    'Average session length grew by 12%: viewers increasingly binge three to four episodes in a row. Weekday evenings from 20:00 to 23:00 remain the most popular watching time.',
            },
        },
        news5: {
            title: 'Player update: 4K, skip intro and auto-play next',
            excerpt:
                'A major update to the CineNetwork player: 4K for Premium subscribers, a skip-intro button and automatic transition to the next episode.',
            readTime: '2 MIN READ',
            toc: {
                features: "What's new",
                howto: 'How to set it up',
            },
            content: {
                intro1: 'We shipped the biggest player update since launch. Here is what changed and how to turn it on.',
                p_features_1:
                    'Premium subscribers now get <strong>4K</strong> quality for titles from the extended library. A "Skip intro" button appears at the 10th second of the opening.',
                p_features_2:
                    'Auto-play next episode can be enabled in player settings: a countdown starts 15 seconds before the episode ends and can be cancelled in one click.',
                p_howto_1:
                    'All new features are already available under Profile → Player settings. If the skip-intro button does not appear, refresh the page: episode timings roll out within a day.',
            },
        },
        collections: {
            best2026: 'Best of 2026',
            mappa: 'Studio MAPPA Masterpieces',
            isekai: 'Isekai: Other Worlds',
            romance: 'Romance & School',
            darkFantasy: 'Dark Fantasy',
            scifi: 'Cyberpunk & Sci-Fi',
            mecha: 'Mecha & Robots',
            sports: 'Sports & Motivation',
            detective: 'Detectives',
            sliceOfLife: 'Cozy Slice of Life',
            vampires: 'Vampires & Occult',
            classics: '90s Classics',
        },
        comments: {
            c1: 'This episode was absolute trash! The animation quality dropped significantly. Anyone who likes this has no taste.',
            c2: 'Whatever, Gojo dies in chapter 236 anyway lol.',
            c4: 'Win free robux! Click here: http://scam.link',
            fillerFlagged:
                'This is a potentially harmful or spammy comment generated for testing purposes.',
            fillerPositive:
                'Wow, what a great episode! I really liked the animation style in this one.',
        },
        reviews: {
            r1: 'A masterpiece! The best thing I have seen in the last 5 years. Animation, story, characters — everything is top-notch.',
            r2: 'Boring and dragged out. The manga was better; the adaptation lost all of its charm.',
            fillerPositive:
                'A great series, I recommend it to everyone! The story keeps you on the edge until the very end.',
            fillerNegative:
                'A waste of time. The plot is full of holes and the characters are cardboard cutouts.',
        },
        reports: {
            rep1: 'This user insults other members of the discussion and uses profanity.',
            filler: 'This content violates the community rules (spam or insults).',
        },
    },
};
