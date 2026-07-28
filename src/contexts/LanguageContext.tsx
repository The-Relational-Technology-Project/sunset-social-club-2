import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Language = "en" | "zh";

type Dict = Record<string, string>;

const translations: Record<Language, Dict> = {
  en: {
    // Nav
    "nav.home": "Home",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.join": "Join the Club",
    "nav.memberSignIn": "Member Sign In",
    "nav.memberHome": "Member Home",
    "memberCta.title": "Already a member?",
    "memberCta.body": "Sign in to submit event feedback, share photos, and read what neighbors are saying.",
    "memberCta.button": "Member Sign In",

    // Banner
    "banner.eyebrow": "July 22 · Kickoff",
    "banner.title": "Welcome + Pizza Party",
    "banner.cta": "Tap to RSVP →",

    // Hero
    "hero.tagline": "Neighbors coming together to strengthen our social fabric in the Sunset in San Francisco.",
    "hero.photoAlt": "Sunset Social Club neighbors gathered on the sidewalk",
    "hero.vision.l1": "We envision a Sunset where",
    "hero.vision.l2": "everyone knows someone",
    "hero.vision.l3": "on every block.",

    // Home sections
    "home.neighborhood.lead": "This is a club for our neighborhood.",
    "home.neighborhood.body": "If you live in the Sunset — or are a friend of the Sunset — you already have something meaningful in common with everyone else here. We all have a stake in this place and the wellbeing of people with whom we share our streets and sidewalks.",
    "home.coffeeAlt": "Coffee and donuts",
    "home.what.title": "What do we do together?",
    "home.what.p1": "We're starting small with West Side Wednesdays, gathering from ~5:30-8pm.",
    "home.what.p2": "\n",
    "home.what.li1": "Sometimes we share a meal.",
    "home.what.li2": "Sometimes we play games.",
    "home.what.li3": "Sometimes someone teaches a skill.",
    "home.what.li4": "Sometimes we have (lightly) curated activities.",
    "home.what.p3": "Our program changes, and it's up to us to shape it.",
    "home.headed.title": "Where we're headed",
    "home.headed.p1": "West Side Wednesday gatherings are just the beginning.",
    "home.headed.p2": "Our hope is that over time, Sunset Social Club becomes a consistent place where neighbors know one another by name, share resources, support local businesses, organize projects, celebrate together, and collectively shape the future of the neighborhood.",
    "home.headed.p3": "As our community evolves, what we do together will follow suit. We will create new traditions, rituals, and initiatives together.",


    // Schedule
    "schedule.title": "What's coming up",
    "schedule.subtitle": "We gather most Wednesdays!",

    // Email signup
    "signup.title": "Stay in the loop",
    "signup.subtitle": "We'll send you notes and updates",
    "signup.emailLabel": "Email (required)",
    "signup.emailPlaceholder": "you@example.com",
    "signup.nameLabel": "First name (optional)",
    "signup.namePlaceholder": "What we'll call you",
    "signup.submit": "Join",
    "signup.crossStreetsLabel": "Cross streets (optional)",
    "signup.crossStreetsPlaceholder": "e.g. 44th & Judah",
    "signup.done": "You're on the list. Check your inbox for a welcome email.",
    "signup.goToMember": "Go to Member Home",
    "signup.consent": "By signing up, you'll get occasional email updates about Sunset Social Club — gatherings, plans, and ways to get involved. No spam, and no sharing your info. Unsubscribe anytime by emailing oursunsetsocialclub@gmail.com.",

    // Join CTA (landing)
    "joinCta.title": "Join the Club",
    "joinCta.body": "Become a member and get notes and updates by email.",
    "joinCta.button": "Join the Club",

    // Join page
    "join.title": "Join the Club",
    "join.subtitle": "We're just getting started! Join us and help shape it.",

    // Ocean photo
    "photo.oceanAlt": "Ocean Beach, San Francisco",

    // Idea board
    "ideas.title": "Got an idea for the club?",
    "ideas.subtitle": "Our public club bulletin board",
    "ideas.ideaLabel": "Your idea",
    "ideas.ideaPlaceholder": "A Saturday repair cafe? A Cantonese cooking night? Say it here.",
    "ideas.nameLabel": "Your name",
    "ideas.namePlaceholder": "So we know who to thank",
    "ideas.submit": "Share",
    "ideas.byline": "by",
    "ideas.note": "Ideas go up with a name, no votes and no ranking. We read every one.",

    // Footer
    "footer.tagline": "Sunset, San Francisco · made by neighbors",

    // About
    "about.title": "About the club",
    "about.subtitle": "Who we are and how this started.",
    "about.p1": "Sunset Social Club is a small thing with a simple idea: neighbors are better off when they actually know each other.",
    "about.p2": "It started the way most of these things do. A few of us live in the Sunset, love it here, and realized we recognized a lot of faces without knowing many names. We wanted a regular, low-key reason to be in the same room as the people on our blocks, not for a cause or a meeting, just to share a meal and let friendships happen.",
    "about.p3": "So we picked a night. Every Wednesday evening we gather at 4114 Judah Street, near 46th Avenue, in a big old church space a few blocks from Ocean Beach. Most weeks it is a shared supper. Once a month we cook a bigger dinner. Kids are free and welcome, and you do not have to be anybody's idea of a joiner to belong here.",
    "about.p4": "We are at the very beginning. The space is still coming together, the schedule is loose, and a lot of what this becomes will be shaped by who shows up and what they bring. If that sounds like your kind of thing, come to a Wednesday and see.",
    "about.cta": "Questions, or want to help?",
    "about.ctaButton": "Get in touch",

    // Contact
    "contact.title": "Say hello",
    "contact.subtitle": "Want to help or ask a question? Please reach out.",
    "contact.nameLabel": "Your name (required)",
    "contact.namePlaceholder": "Your name",
    "contact.emailLabel": "Email (required)",
    "contact.emailPlaceholder": "you@example.com",
    "contact.messageLabel": "Message (required)",
    "contact.messagePlaceholder": "What's on your mind?",
    "contact.submit": "Send it",
    "contact.orEmail": "or email",
    "contact.done": "Thanks. We'll write back soon.",

    // Footer extras
    "footer.privacy": "Privacy & Terms",

    // Member home
    "member.loading": "Loading…",
    "member.redirecting": "Redirecting to sign in…",
    "member.title": "Member home",
    "member.welcome": "Welcome back, {email}.",
    "member.signOut": "Sign out",
    "member.feedback.title": "Event feedback",
    "member.feedback.body": "Help shape what we do next. Share your thoughts on our first Kick-off Pizza Party.",
    "member.feedback.cta": "Kick-off Pizza Party reflections →",
    "member.insights.title": "Community insights",
    "member.insights.body": "What neighbors shared on the walls, in their own words.",
    "member.insights.cta": "July 22 kickoff: what went up on the walls →",
    "member.photos.title": "Photos",
    "member.photos.body": "Share photos of the neighborhood, club events, or neighbors together. Photos are reviewed by stewards before appearing in the gallery.",
    "member.links.title": "Community links",
    "member.links.playlist": "Community playlist on Spotify →",
    "member.links.jukebox": "Add a song to the club jukebox →",
    "member.links.idea": "Submit an idea for the club →",
    "member.account.title": "Your account",
    "member.account.body": "You can delete your account at any time. This removes your sign-in, your uploaded photos, and takes you off the member list. This cannot be undone.",
    "member.account.confirm": "Delete your account? This removes your sign-in, your uploaded photos, and your spot on the member list. This cannot be undone.",
    "member.account.delete": "Delete my account",
    "member.account.deleting": "Deleting…",
    "member.account.error": "Could not delete account.",

    // Member sign in
    "signin.title": "Member sign in",
    "signin.intro": "Enter your email. We'll send you a magic link and an 8-digit code, use either one.",
    "signin.emailLabel": "Email",
    "signin.emailPlaceholder": "you@example.com",
    "signin.send": "Send me a magic link",
    "signin.sending": "Sending…",
    "signin.errEmail": "Please enter your email.",
    "signin.notice": "Check your email for a magic link, or enter the 8-digit code we sent.",
    "signin.notMember": "Not a member yet?",
    "signin.joinLink": "Join the Club",
    "signin.joinSuffix": "and your email will be added automatically.",
    "signin.codeLabel": "8-digit code",
    "signin.codePlaceholder": "12345678",
    "signin.verify": "Sign in",
    "signin.verifying": "Verifying…",
    "signin.useDifferent": "Use a different email",

    // Photo gallery
    "photos.uploadLabel": "Upload a photo",
    "photos.captionLabel": "Caption (optional)",
    "photos.captionPlaceholder": "A note about this photo",
    "photos.instagram": "Okay to share this on our club's Instagram?",
    "photos.uploading": "Uploading…",
    "photos.upload": "Upload photo",
    "photos.uploaded": "Photo uploaded. Stewards will review it before it appears in the shared gallery.",
    "photos.pendingTitle": "Your uploads awaiting review",
    "photos.pending": "Pending review",
    "photos.awaitingAlt": "Awaiting review",
    "photos.communityAlt": "Community photo",
    "photos.galleryTitle": "Gallery ({count})",
    "photos.loading": "Loading…",
    "photos.empty": "No approved photos yet. Be the first.",

    // Feedback form
    "feedback.notFound.title": "Feedback form not found",
    "feedback.notFound.body": "This form may have been removed.",
    "feedback.notFound.back": "Back home",
    "feedback.loading": "Loading…",
    "feedback.thanks.title": "Thank you.",
    "feedback.thanks.body": "Your feedback helps shape what we do next.",
    "feedback.thanks.insights": "See what neighbors shared on the walls →",
    "feedback.thanks.back": "Back to member home",
    "feedback.guestEmailLabel": "Your email (optional, so we know who you are)",
    "feedback.guestEmailPlaceholder": "you@example.com",
    "feedback.signinLink": "Sign in as a member",
    "feedback.signinSuffix": "to link this feedback to your account.",
    "feedback.submittingAs": "Submitting as {email}.",
    "feedback.submit": "Submit feedback",
    "feedback.sending": "Sending…",

    // Privacy & Terms
    "privacy.title": "Privacy & Terms",
    "privacy.who.title": "Who we are",
    "privacy.who.p1": "Sunset Social Club is a nonprofit, neighborhood club run by people who live in the Sunset in San Francisco.",
    "privacy.privacy.title": "Privacy",
    "privacy.privacy.p1": "We don't sell or share your data.",
    "privacy.privacy.p2": "We don't use tracking cookies.",
    "privacy.privacy.p3": "If you give us your contact information when joining the club, submitting an idea, or contacting us, we'll only use it for the purpose you expect (like sending you club updates or replying to your note).",
    "privacy.privacy.p4": "Members can delete their account and associated data at any time from the Member Home page.",
    "privacy.privacy.p5": "You can also ask us to delete your information at any time.",
    "privacy.privacy.p6": "This site is intended for people 14 and older.",
    "privacy.email.title": "Email",
    "privacy.email.p1": "If you join the club, we'll email you occasional updates about what's happening. You can unsubscribe at any time using the link in any email.",
    "privacy.terms.title": "Terms of Use",
    "privacy.terms.p1": "Please use this site with care and respect.",
    "privacy.terms.p2": "You are responsible for your own actions when participating in events and gatherings.",
    "privacy.terms.p3": "We don't endorse user-submitted content.",
    "privacy.terms.p4": "We accept no liability for what happens in and around this club.",
    "privacy.terms.p5": "This site is operated in CA, USA and any disputes are subject to its laws.",
    "privacy.terms.p6": "We may update these terms if needed, but we'll keep them simple and human.",
    "privacy.care.title": "Community Care",
    "privacy.care.p1": "We know things don't always go perfectly. If a misunderstanding or conflict arises, our stewards are happy to help neighbors talk it through and find repair.",
    "privacy.questions.title": "Questions?",
    "privacy.questions.p1": "Reach us at",

    // Jukebox
    "jukebox.plateEyebrow": "Community",
    "jukebox.plateTitle": "Jukebox",
    "jukebox.baseEyebrow": "Drop a song",
    "jukebox.baseSub": "No coins required",
    "jukebox.nowSpinning": "Now spinning",
    "jukebox.loading": "Loading…",
    "jukebox.queue.empty": "No songs yet. Yours could be first.",
    "jukebox.queue.loading": "Loading songs…",
    "jukebox.queue.next": "Next",
    "jukebox.form.paused": "Submissions are paused. Check back at the next gathering.",
    "jukebox.form.nameLabel": "Your name",
    "jukebox.form.namePlaceholder": "What we'll call you",
    "jukebox.form.searchLabel": "Search Spotify",
    "jukebox.form.searchPlaceholder": "Song or artist",
    "jukebox.form.searching": "Searching…",
    "jukebox.form.change": "Change",
    "jukebox.form.submit": "Add to queue",
    "jukebox.form.submitting": "Dropping the coin…",
    "jukebox.form.ok": "Sent to the DJ! You're #{position} in the request line.",
    "jukebox.form.err": "Something went wrong.",
    "jukebox.form.errRetry": "Something went wrong. Try again.",
  },

  zh: {
    // Nav
    "nav.home": "首页",
    "nav.about": "关于",
    "nav.contact": "联系",
    "nav.join": "加入俱乐部",
    "nav.memberSignIn": "会员登录",
    "nav.memberHome": "会员主页",
    "memberCta.title": "已是会员？",
    "memberCta.body": "登录后可提交活动反馈、分享照片，查看邻里心声。",
    "memberCta.button": "会员登录",

    // Banner
    "banner.eyebrow": "7月22日 · 启动日",
    "banner.title": "欢迎会 + 披萨派对",
    "banner.cta": "点击报名 →",

    // Hero
    "hero.tagline": "邻里相聚，凝聚旧金山日落区的社区情谊。",
    "hero.photoAlt": "日落社交俱乐部的邻居们聚在人行道上",
    "hero.vision.l1": "我们期待一个这样的日落区：",
    "hero.vision.l2": "每个街区上",
    "hero.vision.l3": "人人都认识彼此。",

    // Home sections
    "home.neighborhood.lead": "这是属于我们街坊邻里的俱乐部。",
    "home.neighborhood.body": "如果您住在日落区，或者是日落区的朋友，您就已经和这里的每个人拥有了一份有意义的共同点。我们都与这个地方息息相关，也关乎与我们共享街道和人行道的人们的福祉。",
    "home.coffeeAlt": "咖啡与甜甜圈",
    "home.what.title": "我们一起做什么？",
    "home.what.p1": "我们从「西区周三」开始，聚会时间为下午 5:30 至 8 点。",
    "home.what.p2": "\n",
    "home.what.li1": "有时我们一起吃饭。",
    "home.what.li2": "有时我们一起玩游戏。",
    "home.what.li3": "有时有人来教一项技能。",
    "home.what.li4": "有时我们会安排一些（轻度）策划的活动。",
    "home.what.p3": "我们的节目会变化，由我们共同塑造。",
    "home.headed.title": "我们的方向",
    "home.headed.p1": "西区周三聚会只是开始。",
    "home.headed.p2": "我们希望随着时间推移，日落社交俱乐部能成为一个持续的所在——邻居们彼此熟识、分享资源、支持本地商家、组织项目、共同庆祝，并一起塑造社区的未来。",
    "home.headed.p3": "随着社区的发展，我们一起做的事情也会随之演变。我们将共同创造新的传统、仪式与行动。",


    // Schedule
    "schedule.title": "近期活动",
    "schedule.subtitle": "我们大多数周三聚会！",

    // Email signup
    "signup.title": "保持联系",
    "signup.subtitle": "我们会给您发送活动通知与更新",
    "signup.emailLabel": "邮箱（必填）",
    "signup.emailPlaceholder": "you@example.com",
    "signup.nameLabel": "名字（选填）",
    "signup.namePlaceholder": "我们怎么称呼您",
    "signup.submit": "加入",
    "signup.crossStreetsLabel": "十字路口（选填）",
    "signup.crossStreetsPlaceholder": "例如：44街与 Judah",
    "signup.done": "已加入名单。请查看邮箱中的欢迎邮件。",
    "signup.goToMember": "前往会员主页",
    "signup.consent": "注册后，您将不定期收到关于日落社交俱乐部的邮件更新——聚会、计划以及参与方式。我们不会发送垃圾邮件，也不会分享您的信息。如需退订，请随时发送邮件至 oursunsetsocialclub@gmail.com。",

    // Join CTA (landing)
    "joinCta.title": "加入俱乐部",
    "joinCta.body": "成为会员，通过邮件收到活动通知与更新。",
    "joinCta.button": "加入俱乐部",

    // Join page
    "join.title": "加入俱乐部",
    "join.subtitle": "我们才刚刚起步！加入我们并共同塑造它。",

    // Ocean photo
    "photo.oceanAlt": "旧金山海洋海滩",

    // Idea board
    "ideas.title": "对俱乐部有什么想法？",
    "ideas.subtitle": "我们的俱乐部公开留言板",
    "ideas.ideaLabel": "您的想法",
    "ideas.ideaPlaceholder": "周六维修咖啡馆？粤菜烹饪之夜？写下来吧。",
    "ideas.nameLabel": "您的名字",
    "ideas.namePlaceholder": "好让我们感谢您",
    "ideas.submit": "分享",
    "ideas.byline": "—",
    "ideas.note": "想法会署名贴出，没有投票也没有排名。我们会认真阅读每一条。",

    // Footer
    "footer.tagline": "旧金山日落区 · 由邻居们打造",

    // About
    "about.title": "关于俱乐部",
    "about.subtitle": "我们是谁，以及这一切是如何开始的。",
    "about.p1": "日落社交俱乐部源于一个简单的想法：邻居彼此认识，社区才会更好。",
    "about.p2": "它的起点和大多数此类事情一样。我们几个住在日落区，热爱这里，却发现自己认得很多面孔却叫不出名字。我们想要一个稳定、轻松的理由，让街坊们能聚在同一个空间里——不为某个事业，不为开会，只是一起吃顿饭，让友谊自然发生。",
    "about.p3": "于是我们选定了一个晚上。每周三傍晚，我们在 4114 Judah Street（靠近 46th Avenue）聚会，那是一座离海洋海滩几个街区的老教堂空间。大多数时候是分享晚餐。每月一次，我们会做一顿更丰盛的晚饭。孩子免费且欢迎参加，您不必是「爱社交的人」也能融入这里。",
    "about.p4": "我们才刚刚起步。空间还在布置，日程也很灵活，俱乐部的样子会由参与的人共同塑造。如果这听起来合您心意，欢迎周三来看看。",
    "about.cta": "有疑问，或想帮忙？",
    "about.ctaButton": "联系我们",

    // Contact
    "contact.title": "打个招呼",
    "contact.subtitle": "想帮忙或有任何疑问？请联系我们。",
    "contact.nameLabel": "您的名字（必填）",
    "contact.namePlaceholder": "您的名字",
    "contact.emailLabel": "邮箱（必填）",
    "contact.emailPlaceholder": "you@example.com",
    "contact.messageLabel": "留言（必填）",
    "contact.messagePlaceholder": "想说些什么？",
    "contact.submit": "发送",
    "contact.orEmail": "或发邮件至",
    "contact.done": "谢谢，我们会尽快回复。",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "ssc.lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "zh") setLanguageState(saved);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, lang);
    }
  };

  const t = (key: string): string => translations[language][key] ?? translations.en[key] ?? key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
