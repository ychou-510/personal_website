export type ProjectDetail = {
  summary: string
  researchQuestion: string
  whyItMatters: string
  approach: string[]
  findings: string[]
  contribution: string
}

export type ProjectCategory = 'creators-ai' | 'messaging' | 'design'

export type Project = {
  title: string
  authors: string[]
  year: number
  image?: string
  conceptImage?: string
  visualCaption?: string
  description?: string
  topics?: string[]
  detail?: ProjectDetail
  badges?: string[]
  award?: string
  selected?: boolean
  links?: Record<string, string>
  category: ProjectCategory
  id: string
}

type BlogPost = {
  title: string
  description: string
  link: string
  uid: string
}

type SocialLink = {
  label: string
  link: string
  icon: string
}

export const SITE_URL = 'https://ychou-510.github.io/personal_website'

export const PERSONAL_INFO = {
  name: {
    english: 'Yu-Ling (Ruby) Chou',
    chinese: '周昱伶',
  },
  title: 'Computational Media PhD Candidate @ UC Santa Cruz',
}

export const HIGHLIGHTED_AUTHORS = ['Yu-Ling (Ruby) Chou', 'Yu-Ling Chou']

export const PROJECTS: Project[] = [
  {
    title:
      'Rethinking Ethical AI Disclosure: Balancing Transparency, Accountability, and Relational Care in Health Creator-Audience Interactions',
    authors: ['Yu-Ling (Ruby) Chou', 'Chia-Fang (Christina) Chung'],
    year: 2026,
    image: '/img/projects/ethical-ai-disclosure-health-creators-v8.png',
    conceptImage: '/img/projects/concept-ethical-ai-disclosure.png',
    visualCaption:
      "AI involvement becomes visible where a creator's health-content workflow meets the audience relationship.",
    description:
      'AI disclosure should do more than label a tool: it must help health audiences judge accountability while preserving trust and care.',
    topics: ['AI disclosure', 'Health creators', 'Trust & care'],
    detail: {
      summary:
        'AI disclosure in health content is not simply a question of whether to add a label. Audiences want to understand when AI is involved while preserving the trust, accountability, and relational care that make creator interactions meaningful.',
      researchQuestion:
        'How should health and wellness creators disclose generative AI involvement in ways that support transparency, accountability, and relational care?',
      whyItMatters:
        'Health and wellness creators often provide both information and emotional support. As AI becomes part of creator workflows, disclosure is not only a technical label; it can shape whether audiences see creators as trustworthy, accountable, authentic, and caring.',
      approach: [
        'Conducted semi-structured interviews with Instagram users who interact with health and wellness creators.',
        'Analyzed audience expectations for AI disclosure across informational, emotional, and mixed health-support contexts.',
        'Examined how disclosure cues shape perceptions of creator accountability, authenticity, care, and credibility.',
      ],
      findings: [
        'Audiences often prefer clear disclosure in high-stakes informational contexts where accuracy, source clarity, and accountability matter.',
        'In emotionally sensitive contexts, audiences may value softened but truthful disclosure that protects relational continuity and care.',
        'A single universal disclosure label may not fit health creator-audience interactions because informational and emotional needs are often intertwined.',
      ],
      contribution:
        'The project reframes AI disclosure as a contextual ethical practice and offers design implications for platform-level disclosure systems that balance transparency with relational and emotional needs.',
    },
    selected: true,
    badges: ['under review'],
    links: {
      pdf: '/pdf/projects/rethinking-ethical-ai-disclosure.pdf',
    },
    category: 'creators-ai',
    id: 'ethical-ai-disclosure-health-creators',
  },
  {
    title:
      '"I Can\'t Respond to Everyone": An Empirical Investigation of Social Media Influencers\' Management of Controversies',
    authors: [
      'Yu-Ling (Ruby) Chou',
      'Pei-Hua Tsai',
      'Gary Hsieh',
      'Yung-Ju Chang',
    ],
    year: 2026,
    image: '/img/projects/influencer-controversy-lavender-hero-v2.png',
    conceptImage:
      '/img/projects/influencer-controversy-editorial-scenario-v1.png',
    visualCaption:
      'A creator faces a flood of public reactions while weighing accountability, audience expectations, and emotional safety.',
    description:
      'When creators face backlash, every response is a tradeoff between accountability, audience expectations, reputation, and emotional safety.',
    topics: ['Creator controversy', 'Audience expectations', 'Well-being'],
    detail: {
      summary:
        'When a creator faces public backlash, responding is rarely as simple as posting an apology. Creators must decide when to speak, whom to address, and how much emotional exposure they can sustain, while audiences judge those same choices from a very different position.',
      researchQuestion:
        'How do social media influencers decide whether and how to respond to controversies, and where do their strategies diverge from audience expectations?',
      whyItMatters:
        'Influencers play a major role in online discourse, community engagement, and platform culture. During controversies, their responses can affect reputation, audience trust, creator well-being, and the health of online communities.',
      approach: [
        'Conducted interviews with social media influencers who had experienced controversies and taken steps to address them.',
        'Interviewed audience members who had witnessed multiple influencer controversies.',
        'Compared creator and audience perspectives to identify misalignments in response timing, target audiences, and emotional self-protection.',
      ],
      findings: [
        'Influencers weigh many pressures when responding, including reputational risk, audience expectations, emotional safety, and the possibility of escalating conflict.',
        'Audiences often interpret delayed responses differently from influencers, which can create frustration or distrust.',
        'Creators may protect themselves emotionally by limiting engagement, while audiences may not see the underlying reasons for that strategy.',
      ],
      contribution:
        'The study identifies design opportunities for platforms to better support creator-audience communication during controversy, including tools that help clarify intent, timing, audience scope, and emotional boundaries.',
    },
    selected: true,
    badges: ["CSCW '26"],
    links: {
      "CSCW '26": 'https://dl.acm.org/doi/10.1145/3816948',
      pdf: '/pdf/projects/influencer-controversy-management.pdf',
    },
    category: 'creators-ai',
    id: 'influencer-controversy-management',
  },
  {
    title:
      "From Overwhelmed to Overview: Understanding Smartphone Users' Preferences and Expectations in Relieving Notification Overload via Text Summarization",
    authors: [
      'Uei-Dar Chen',
      'Peng-Jui Wang',
      'Yi-Chi Lee',
      'Yong-Han Lin',
      'Yu-Ling (Ruby) Chou',
      'Yung-Ju Chang',
    ],
    year: 2025,
    image: '/img/projects/notification-overload-summarization-v1.jpg',
    description:
      'Notification summaries reduce overload only when they preserve what matters, surface urgency, and make omissions understandable.',
    topics: ['Notification overload', 'Text summarization', 'Mobile UX'],
    links: {
      "PACM MHCI '25": 'https://dl.acm.org/doi/10.1145/3743703',
      pdf: '/pdf/projects/notification-overload-summarization.pdf',
    },
    category: 'messaging',
    id: 'notification-overload-summarization',
  },
  {
    title:
      'I Like Their Autonomy and Closeness to Me: Uncovering the Perceived Appeal of Social-Media Influencers',
    authors: [
      'Yu-Ling (Ruby) Chou',
      'Hsuan-Jen Lee',
      'Jie Tsai',
      'En-Chi Liang',
      'Yung-Ju Chang',
    ],
    year: 2023,
    image: '/img/projects/social-media-influencers-appeal-v6.jpg',
    conceptImage: '/img/projects/concept-influencer-appeal.png',
    visualCaption:
      'Influencers combine independence in how they create with a sense of everyday closeness for the people who follow them.',
    description:
      'Influencers feel both independent and personally close, helping audiences see them as relatable guides rather than distant media figures.',
    topics: ['Influencer appeal', 'Creator–audience ties', 'Social media'],
    detail: {
      summary:
        'Influencers can feel more independent than traditional media figures and more personally present in everyday life. That combination of autonomy, informality, and emotional closeness helps explain why audiences value these relationships beyond popularity or marketing reach.',
      researchQuestion:
        'What makes social-media influencers appealing to audiences, and what kinds of relationships do audiences feel they have with them?',
      whyItMatters:
        'Influencers shape how people learn, shop, make health and lifestyle decisions, and understand communities online. Understanding why people trust and follow them helps researchers and designers build healthier, more transparent social-media experiences.',
      approach: [
        'Conducted a qualitative study with social-media users about the influencers they follow and why those creators matter to them.',
        'Compared audience perceptions of influencers with perceptions of traditional media figures.',
        'Analyzed recurring themes around content style, presentation, autonomy, closeness, and everyday relevance.',
      ],
      findings: [
        'Audiences often appreciate influencers because they feel more autonomous, informal, and personally relatable than traditional media figures.',
        'The appeal is not only about information quality; emotional closeness and perceived authenticity also play major roles.',
        'People may use influencers as companions, taste-makers, practical guides, or sources of community connection.',
      ],
      contribution:
        'The study gives designers and HCI researchers a clearer vocabulary for understanding influencer-audience relationships beyond simple metrics such as follower count, reach, or engagement.',
    },
    selected: true,
    links: {
      "CHI '23": 'https://dl.acm.org/doi/10.1145/3544548.3580898',
      pdf: '/pdf/projects/social-media-influencers-appeal.pdf',
    },
    category: 'creators-ai',
    id: 'social-media-influencers-appeal',
  },
  {
    title:
      '"Because I\'m Restricted, 2-4 PM Unable to See Messages": Exploring Users\' Perceptions and Likely Practices around Exposing Attention-management Use on IM Statuses',
    authors: [
      'Yu-Ling (Ruby) Chou',
      'Yu-Ling Chien',
      'Yu-Hsin Lin',
      'Kung-Pai Lin',
      'Faye Shih',
      'Yung-Ju Chang',
    ],
    year: 2022,
    image: '/img/projects/attention-management-im-statuses-v9.jpg',
    conceptImage: '/img/projects/concept-attention-status.png',
    visualCaption:
      'A visible focus status can explain delayed replies, while also revealing personal routines and reshaping expectations.',
    description:
      'A visible focus status can explain a delayed reply, but it may also expose private routines and create new expectations about availability.',
    topics: ['Attention management', 'Availability status', 'Messaging'],
    detail: {
      summary:
        'Making focus mode visible can reassure others that a delayed reply is not personal. Yet the same status can expose private routines and create new social expectations, turning a tool for protecting attention into a delicate act of communication.',
      researchQuestion:
        'How do people perceive and use visible attention-management statuses in instant messaging, and what social tensions do these statuses create?',
      whyItMatters:
        'People need ways to protect their attention, but messaging is social: a status meant to reduce interruptions can also affect expectations, politeness, privacy, and relationships. Good design has to support boundaries without creating unnecessary pressure or misunderstanding.',
      approach: [
        'Studied user reactions to status messages that expose attention-management use in instant messaging.',
        'Explored likely practices around sharing availability, restricting messages, and explaining delayed responses.',
        'Analyzed how people balance boundary-setting with social accountability and privacy.',
      ],
      findings: [
        'Visible attention-management statuses can help people explain unavailability and reduce pressure to respond immediately.',
        'At the same time, these statuses may reveal more personal information than users want to share.',
        'People may strategically use, avoid, or customize statuses depending on relationship type and social context.',
      ],
      contribution:
        'The project clarifies design tradeoffs for availability and focus-management features in messaging systems, especially when private attention choices become socially visible.',
    },
    selected: true,
    links: {
      "CHI '22": 'https://dl.acm.org/doi/10.1145/3491102.3517616',
      pdf: '/pdf/projects/attention-management-im-statuses.pdf',
    },
    category: 'messaging',
    id: 'attention-management-im-statuses',
  },
  {
    title:
      "Why Did You/I Read but Not Reply? IM Users' Unresponded Read-Receipt Practices and Explanations",
    authors: [
      'Yu-Ling (Ruby) Chou',
      'Yi-Hsiu Lin',
      'Tzu-Yi Lin',
      'Hsin Ying You',
      'Yung-Ju Chang',
    ],
    year: 2022,
    image: '/img/projects/read-receipt-practices-v9.jpg',
    conceptImage: '/img/projects/concept-read-receipts.png',
    visualCaption:
      'The same read receipt can feel like silence to a sender and simply reflect a busy moment for the recipient.',
    description:
      'A “Seen” message is not always intentional silence: senders may feel ignored while recipients are busy, unready, or planning to reply later.',
    topics: ['Read receipts', 'Nonresponse', 'Messaging'],
    detail: {
      summary:
        'A message marked “Seen” but left unanswered can mean very different things on each side of the conversation. What feels like deliberate silence to a sender may be distraction, limited energy, or delayed intention for the recipient.',
      researchQuestion:
        'Why do people read but not reply in instant messaging, and how do senders and recipients explain or interpret those moments?',
      whyItMatters:
        'Read receipts are small interface signals, but they can carry a lot of social meaning. They affect anxiety, accountability, politeness, and relationship maintenance in everyday communication.',
      approach: [
        'Used a grounded-theory approach to understand real practices around unresponded read receipts.',
        'Examined explanations from both message senders and recipients.',
        'Identified patterns in how people manage response timing, obligations, excuses, and interpretations.',
      ],
      findings: [
        'Reading without replying can happen for many reasons, including needing time, lacking emotional energy, forgetting, or intentionally delaying a response.',
        'Senders often interpret silence through the relationship context, message content, and prior communication norms.',
        'Read receipts can create pressure because they make a private moment of reading visible to another person.',
      ],
      contribution:
        'The study shows how a simple messaging feature can reshape social expectations, offering guidance for designing communication tools that reduce ambiguity and pressure.',
    },
    selected: true,
    links: {
      "CHI '22": 'https://dl.acm.org/doi/10.1145/3491102.3517496',
      pdf: '/pdf/projects/read-receipt-practices.pdf',
    },
    category: 'messaging',
    id: 'read-receipt-practices',
  },
  {
    title:
      'What Makes IM Users (Un)Responsive: An Empirical Investigation for Understanding IM Responsiveness',
    authors: [
      'Hao-Ping Lee',
      'Yi-Shyuan Chiang',
      'Yu-Ling (Ruby) Chou',
      'Kung-Pai Lin',
      'Yung-Ju Chang',
    ],
    year: 2022,
    image: '/img/projects/im-responsiveness-v1.jpg',
    description:
      'Reply timing reflects more than willingness; relationships, message demands, timing, and emotional energy all shape when people respond.',
    topics: ['Responsiveness', 'Communication context', 'Messaging'],
    links: {
      "IJHCS '22":
        'https://www.sciencedirect.com/science/article/pii/S1071581922002014',
      pdf: '/pdf/projects/im-responsiveness.pdf',
    },
    category: 'messaging',
    id: 'im-responsiveness',
  },
  {
    title:
      '"This is Why I Like Them!": Exploring the Perceived Appeal of Social Media Influencers vs. Traditional Mass Media',
    authors: [
      'Hsuan-Jen Lee',
      'Yu-Ling (Ruby) Chou',
      'Jie Tsai',
      'Yung-Ju Chang',
    ],
    year: 2022,
    image: '/img/projects/social-media-influencers-vs-traditional-media-v1.jpg',
    description:
      'People value influencers not just for popularity, but for content that feels more autonomous, personal, and present in everyday life.',
    topics: ['Influencer appeal', 'Traditional media', 'Audience perception'],
    links: {
      "CSCW EA '22": 'https://dl.acm.org/doi/10.1145/3500868.3559462',
      pdf: '/pdf/projects/influencers-vs-traditional-media.pdf',
    },
    category: 'creators-ai',
    id: 'social-media-influencers-vs-traditional-media',
  },
  {
    title:
      'Distinguishing IM Communication Patterns with Relationship and Conversation Topic',
    authors: [
      'Kung-Pai Lin',
      'Hao-Ping Lee',
      'Yu-Ling (Ruby) Chou',
      'Faye Shih',
      'Yung-Ju Chang',
    ],
    year: 2021,
    image: '/img/projects/im-communication-patterns-v1.jpg',
    description:
      'Messaging patterns reveal how relationship type and conversation topic shape who we respond to, when, and in what way.',
    topics: ['Communication patterns', 'Relationships', 'Conversation topics'],
    links: {
      "CSCW EA '21": 'https://dl.acm.org/doi/10.1145/3462204.3481752',
      pdf: '/pdf/projects/im-communication-patterns.pdf',
    },
    category: 'messaging',
    id: 'im-communication-patterns',
  },
  {
    title: 'Procrastino Go',
    authors: ['Video Game Design'],
    year: 2021,
    image: '/img/projects/procrastino-go-v6.jpg',
    description:
      'A turn-based game makes procrastination tangible by asking players to manage deadlines, distractions, and unexpected events together.',
    topics: ['Game design', 'Procrastination', 'Strategy'],
    links: {
      project: 'https://www.behance.net/gallery/133983283/Procrastino-Go',
    },
    category: 'design',
    id: 'procrastino-go',
  },
]

export const BLOG_POSTS: BlogPost[] = []

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Scholar',
    link: 'https://scholar.google.com/citations?user=lp-1SIQAAAAJ',
    icon: 'GraduationCap',
  },
  {
    label: 'LinkedIn',
    link: 'http://linkedin.com/in/yuling-ruby-chou',
    icon: 'Linkedin',
  },
]

export const EMAIL = 'ychou14@ucsc.edu'

export const PHOTO_GALLERY = [
  'photography.jpg',
  'story-book.png',
  'techno-arts.jpg',
]
