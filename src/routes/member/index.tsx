import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useMemberSession } from "@/lib/member-session";
import { PhotoGallery } from "@/components/PhotoGallery";
import { deleteMyAccount } from "@/lib/account.functions";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  COMMUNITY_PLAYLIST_URL,
  PIZZA_PARTY_FEEDBACK_SLUG,
  JULY_22_INSIGHTS_SLUG,
} from "@/lib/site-config";

export const Route = createFileRoute("/member/")({
  head: () => ({
    meta: [
      { title: "Member Home — Sunset Social Club" },
      { name: "description", content: "Your Sunset Social Club member home: event feedback, photos, community insights, and more." },
      { property: "og:title", content: "Member Home — Sunset Social Club" },
      { property: "og:description", content: "Your Sunset Social Club member home." },
    ],
  }),
  component: MemberHome,
});

function MemberHome() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { loading, user, isMember } = useMemberSession();
  const runDeleteAccount = useServerFn(deleteMyAccount);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user || !isMember) navigate({ to: "/member/signin" });
  }, [loading, user, isMember, navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/member/signin" });
  }

  async function onDeleteAccount() {
    const confirmed = window.confirm(
      t("member.account.confirm"),
    );
    if (!confirmed) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await runDeleteAccount();
      await supabase.auth.signOut();
      navigate({ to: "/" });
    } catch (err) {
      setDeleting(false);
      setDeleteError(err instanceof Error ? err.message : t("member.account.error"));
    }
  }

  if (loading) {
    return <main className="mx-auto max-w-2xl px-4 py-10 sm:px-5 sm:py-14">{t("member.loading")}</main>;
  }
  if (!user || !isMember) {
    return <main className="mx-auto max-w-2xl px-4 py-10 sm:px-5 sm:py-14">{t("member.redirecting")}</main>;
  }

  return (
    <main className="view-enter mx-auto max-w-2xl px-4 py-8 sm:px-5 sm:py-12">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold italic sm:text-3xl">{t("member.title")}</h1>
          <p className="mt-1 truncate text-sm text-ink/70 sm:text-base">{t("member.welcome", { email: user.email ?? "" })}</p>
        </div>
        <button onClick={signOut} className="btn-ghost shrink-0 !min-h-0 !py-2 !px-3 text-xs sm:text-sm">
          {t("member.signOut")}
        </button>
      </header>

      {/* Event feedback */}
      <section className="paper-card mt-8 px-4 py-5 sm:mt-10 sm:px-6 sm:py-6">
        <h2 className="text-lg font-extrabold italic sm:text-xl">{t("member.feedback.title")}</h2>
        <p className="mt-2 text-sm text-ink/75 sm:text-base">
          {t("member.feedback.body")}
        </p>
        <Link
          to="/feedback/$slug"
          params={{ slug: PIZZA_PARTY_FEEDBACK_SLUG }}
          className="btn-solid btn-block-mobile mt-4"
        >
          {t("member.feedback.cta")}
        </Link>
      </section>

      {/* Community insights */}
      <section className="paper-card mt-4 px-4 py-5 sm:mt-6 sm:px-6 sm:py-6">
        <h2 className="text-lg font-extrabold italic sm:text-xl">{t("member.insights.title")}</h2>
        <p className="mt-2 text-sm text-ink/75 sm:text-base">
          {t("member.insights.body")}
        </p>
        <Link
          to="/insights/$slug"
          params={{ slug: JULY_22_INSIGHTS_SLUG }}
          className="btn-ghost btn-block-mobile mt-4"
        >
          {t("member.insights.cta")}
        </Link>
      </section>

      {/* Photos */}
      <section className="mt-8 sm:mt-10">
        <h2 className="text-lg font-extrabold italic sm:text-xl">{t("member.photos.title")}</h2>
        <p className="mt-2 text-sm text-ink/75 sm:text-base">
          {t("member.photos.body")}
        </p>
        <div className="mt-5">
          <PhotoGallery user={user} />
        </div>
      </section>

      {/* Playlist + Idea */}
      <section className="paper-card mt-8 px-4 py-5 sm:mt-10 sm:px-6 sm:py-6">
        <h2 className="text-lg font-extrabold italic sm:text-xl">{t("member.links.title")}</h2>
        <ul className="mt-3 space-y-4 sm:space-y-3">
          <li>
            <a
              href={COMMUNITY_PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-1 text-sunset underline hover:opacity-80"
            >
              {"🎵 "}{t("member.links.playlist")}
            </a>
          </li>
          <li>
            <Link to="/jukebox" className="block py-1 text-sunset underline hover:opacity-80">
              {"🎶 "}{t("member.links.jukebox")}
            </Link>
          </li>
          <li>
            <Link to="/" hash="ideas" className="block py-1 text-sunset underline hover:opacity-80">
              {"💡 "}{t("member.links.idea")}
            </Link>
          </li>
        </ul>
      </section>

      {/* Account */}
      <section className="paper-card mt-8 px-4 py-5 sm:mt-10 sm:px-6 sm:py-6">
        <h2 className="text-lg font-extrabold italic sm:text-xl">{t("member.account.title")}</h2>
        <p className="mt-2 text-sm text-ink/75 sm:text-base">
          {t("member.account.body")}
        </p>
        {deleteError && <p className="mt-3 text-sm text-red-600">{deleteError}</p>}
        <button
          type="button"
          onClick={onDeleteAccount}
          disabled={deleting}
          className="btn-ghost btn-block-mobile mt-4 border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50"
        >
          {deleting ? t("member.account.deleting") : t("member.account.delete")}
        </button>
      </section>
    </main>
  );
}
