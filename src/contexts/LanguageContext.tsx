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
    "home.folksAlt": "Neighbors at a Sunset Social Club gathering",
    "home.partyAlt": "Neighbors at the club kick-off party",
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
    "schedule.partners.title": "Partner and Member Events",
    "schedule.partners.subtitle": "Other things going on in the neighborhood",
    "schedule.partners.more": "Discover more on the neighborhood calendar at",

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
    "signup.backToFeedback": "Back to Member Feedback",
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
    "member.feedback.title": "Feedback",
    "member.feedback.body": "Share feedback on a gathering or on the club in general.",
    "member.feedback.cta": "Share feedback →",
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
    "home.folksAlt": "日落社交俱乐部聚会上的邻居们",
    "home.partyAlt": "俱乐部启动派对上的邻居们",
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
    "schedule.partners.title": "伙伴与会员活动",
    "schedule.partners.subtitle": "社区里发生的其他事",
    "schedule.partners.more": "在社区日历上发现更多活动：",

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
    "signup.backToFeedback": "返回会员反馈",
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

    // Footer extras
    "footer.privacy": "隐私与条款",

    // Member home
    "member.loading": "载入中…",
    "member.redirecting": "正在跳转到登录页…",
    "member.title": "会员主页",
    "member.welcome": "欢迎回来，{email}。",
    "member.signOut": "退出登录",
    "member.feedback.title": "反馈",
    "member.feedback.body": "分享您对某次聚会或俱乐部整体的反馈。",
    "member.feedback.cta": "分享反馈 →",
    "member.insights.title": "社区心声",
    "member.insights.body": "邻居们贴在墙上的话，原汁原味。",
    "member.insights.cta": "7月22日启动日：墙上都写了什么 →",
    "member.photos.title": "照片",
    "member.photos.body": "分享社区、俱乐部活动或邻居相聚的照片。照片会先由管理员审核，然后出现在相册中。",
    "member.links.title": "社区链接",
    "member.links.playlist": "Spotify 社区播放列表 →",
    "member.links.jukebox": "向俱乐部点唱机添加歌曲 →",
    "member.links.idea": "提交您对俱乐部的想法 →",
    "member.account.title": "您的账户",
    "member.account.body": "您可以随时删除账户。这将移除您的登录方式、您上传的照片，并将您从会员名单中移除。此操作无法撤销。",
    "member.account.confirm": "确定要删除账户吗？这将移除您的登录方式、您上传的照片，以及您在会员名单中的位置。此操作无法撤销。",
    "member.account.delete": "删除我的账户",
    "member.account.deleting": "删除中…",
    "member.account.error": "无法删除账户。",

    // Member sign in
    "signin.title": "会员登录",
    "signin.intro": "请输入您的邮箱。我们会发送一个登录链接和一个 8 位验证码，任选其一即可。",
    "signin.emailLabel": "邮箱",
    "signin.emailPlaceholder": "you@example.com",
    "signin.send": "给我发送登录链接",
    "signin.sending": "发送中…",
    "signin.errEmail": "请输入您的邮箱。",
    "signin.notice": "请查收邮件中的登录链接，或输入我们发送的 8 位验证码。",
    "signin.notMember": "还不是会员？",
    "signin.joinLink": "加入俱乐部",
    "signin.joinSuffix": "，您的邮箱会自动加入名单。",
    "signin.codeLabel": "8 位验证码",
    "signin.codePlaceholder": "12345678",
    "signin.verify": "登录",
    "signin.verifying": "验证中…",
    "signin.useDifferent": "换一个邮箱",

    // Photo gallery
    "photos.uploadLabel": "上传照片",
    "photos.captionLabel": "说明（选填）",
    "photos.captionPlaceholder": "关于这张照片的一句话",
    "photos.instagram": "可以把这张照片分享到俱乐部的 Instagram 吗？",
    "photos.uploading": "上传中…",
    "photos.upload": "上传照片",
    "photos.uploaded": "照片已上传。管理员审核后会出现在共享相册中。",
    "photos.pendingTitle": "您待审核的上传",
    "photos.pending": "待审核",
    "photos.awaitingAlt": "待审核",
    "photos.communityAlt": "社区照片",
    "photos.galleryTitle": "相册（{count}）",
    "photos.loading": "载入中…",
    "photos.empty": "还没有通过审核的照片。来做第一个吧。",

    // Feedback form
    "feedback.notFound.title": "找不到该反馈表",
    "feedback.notFound.body": "这个表单可能已被移除。",
    "feedback.notFound.back": "返回首页",
    "feedback.loading": "载入中…",
    "feedback.thanks.title": "谢谢您。",
    "feedback.thanks.body": "您的反馈帮助我们决定接下来做什么。",
    "feedback.thanks.insights": "看看邻居们贴在墙上的话 →",
    "feedback.thanks.back": "返回会员主页",
    "feedback.guestEmailLabel": "您的邮箱（选填，以便我们知道您是谁）",
    "feedback.guestEmailPlaceholder": "you@example.com",
    "feedback.signinLink": "以会员身份登录",
    "feedback.signinSuffix": "，即可将此反馈关联到您的账户。",
    "feedback.submittingAs": "以 {email} 的身份提交。",
    "feedback.submit": "提交反馈",
    "feedback.sending": "发送中…",

    // Privacy & Terms
    "privacy.title": "隐私与条款",
    "privacy.who.title": "我们是谁",
    "privacy.who.p1": "日落社交俱乐部是一个非营利的邻里俱乐部，由住在旧金山日落区的居民运营。",
    "privacy.privacy.title": "隐私",
    "privacy.privacy.p1": "我们不出售或分享您的数据。",
    "privacy.privacy.p2": "我们不使用追踪 Cookie。",
    "privacy.privacy.p3": "如果您在加入俱乐部、提交想法或联系我们时提供了联系方式，我们只会将其用于您预期的用途（例如发送俱乐部更新或回复您的留言）。",
    "privacy.privacy.p4": "会员可以随时在会员主页删除账户及相关数据。",
    "privacy.privacy.p5": "您也可以随时要求我们删除您的信息。",
    "privacy.privacy.p6": "本网站面向 14 岁及以上人士。",
    "privacy.email.title": "邮件",
    "privacy.email.p1": "如果您加入俱乐部，我们会不定期发送邮件更新。您可以随时通过邮件中的链接退订。",
    "privacy.terms.title": "使用条款",
    "privacy.terms.p1": "请以关心与尊重的态度使用本网站。",
    "privacy.terms.p2": "参加活动与聚会时，您需为自己的行为负责。",
    "privacy.terms.p3": "我们不为用户提交的内容背书。",
    "privacy.terms.p4": "对于俱乐部内外发生的事情，我们不承担责任。",
    "privacy.terms.p5": "本网站在美国加州运营，任何争议均适用当地法律。",
    "privacy.terms.p6": "如有需要，我们可能会更新这些条款，但会保持简单易懂。",
    "privacy.care.title": "社区关怀",
    "privacy.care.p1": "我们知道事情并不总是完美。如果出现误解或冲突，我们的管理员乐意帮助邻居沟通并修复关系。",
    "privacy.questions.title": "有疑问？",
    "privacy.questions.p1": "请联系",

    // Jukebox
    "jukebox.plateEyebrow": "社区",
    "jukebox.plateTitle": "点唱机",
    "jukebox.baseEyebrow": "点一首歌",
    "jukebox.baseSub": "无需投币",
    "jukebox.nowSpinning": "正在播放",
    "jukebox.loading": "载入中…",
    "jukebox.queue.empty": "还没有歌曲。您可以成为第一个。",
    "jukebox.queue.loading": "正在载入歌曲…",
    "jukebox.queue.next": "下一首",
    "jukebox.form.paused": "点歌暂停中。下次聚会时再来看看。",
    "jukebox.form.nameLabel": "您的名字",
    "jukebox.form.namePlaceholder": "我们怎么称呼您",
    "jukebox.form.searchLabel": "搜索 Spotify",
    "jukebox.form.searchPlaceholder": "歌曲或歌手",
    "jukebox.form.searching": "搜索中…",
    "jukebox.form.change": "更换",
    "jukebox.form.submit": "加入队列",
    "jukebox.form.submitting": "投币中…",
    "jukebox.form.ok": "已发送给 DJ！您在点歌队列中排第 {position} 位。",
    "jukebox.form.err": "出了点问题。",
    "jukebox.form.errRetry": "出了点问题，请再试一次。",
  },

};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
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

  const t = (key: string, vars?: Record<string, string | number>): string => {
    const raw = translations[language][key] ?? translations.en[key] ?? key;
    if (!vars) return raw;
    return raw.replace(/\{(\w+)\}/g, (m, name: string) =>
      name in vars ? String(vars[name]) : m,
    );
  };


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
