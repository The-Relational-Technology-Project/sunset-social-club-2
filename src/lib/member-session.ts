import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getMemberStatus } from "@/lib/member-status.functions";

export interface MemberSessionState {
  loading: boolean;
  user: User | null;
  isMember: boolean;
}

async function checkCurrentUserIsMember(): Promise<boolean> {
  try {
    const res = await getMemberStatus();
    return Boolean(res?.isMember);
  } catch (err) {
    console.warn("getMemberStatus failed", err);
    return false;
  }
}


export function useMemberSession(): MemberSessionState {
  const [state, setState] = useState<MemberSessionState>({ loading: true, user: null, isMember: false });

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      const { data } = await supabase.auth.getUser();
      const user = data.user ?? null;
      const isMember = user ? await checkCurrentUserIsMember() : false;
      if (!cancelled) setState({ loading: false, user, isMember });
    }

    void refresh();

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        void refresh();
      }
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}

/**
 * Checks whether the currently signed-in user is a member.
 * Cannot be used to probe arbitrary email addresses.
 */
export async function isCurrentUserMember(): Promise<boolean> {
  return checkCurrentUserIsMember();
}
