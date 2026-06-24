import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Language = "en" | "zh";

type Dict = Record<string, string>;

const translations: Record<Language, Dict> = {
  en: {
    // Nav
    "nav.home": "Home",
    "nav.about": "About",
    "nav.contact": "Contact",

    // Banner
    "banner.eyebrow": "July 22 · Kickoff",
    "banner.title": "Volunteer Day + Pizza Party",
    "banner.cta": "Tap to RSVP →",

    // Hero
    "hero.tagline": "A neighborhood club to strengthen our social fabric in the Sunset in SF.",
    "hero.photoAlt": "Sunset Social Club neighbors gathered on the sidewalk",

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
    "signup.submit": "Keep me posted",
    "signup.done": "You're on the list. See you Wednesday.",

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
    "contact.subtitle": "Coming Wednesday, want to help, or just curious. We read everything.",
    "contact.nameLabel": "Your name (required)",
    "contact.namePlaceholder": "Your name",
    "contact.emailLabel": "Email (required)",
    "contact.emailPlaceholder": "you@example.com",
    "contact.messageLabel": "Message (required)",
    "contact.messagePlaceholder": "What's on your mind?",
    "contact.submit": "Send it",
    "contact.orEmail": "or email",
    "contact.done": "Thanks. We'll write back soon.",
  },
  zh: {
    // Nav
    "nav.home": "首页",
    "nav.about": "关于",
    "nav.contact": "联系",

    // Banner
    "banner.eyebrow": "7月22日 · 启动日",
    "banner.title": "志愿者日 + 披萨派对",
    "banner.cta": "点击报名 →",

    // Hero
    "hero.tagline": "日落区的邻里俱乐部，凝聚社区情谊。",
    "hero.photoAlt": "日落社交俱乐部的邻居们聚在人行道上",

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
    "signup.submit": "通知我",
    "signup.done": "已加入名单。周三见！",

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
    "contact.subtitle": "想周三来、想帮忙，或只是好奇——我们都会认真阅读。",
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
