import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface MemberSessionState {
  loading: boolean;
  user: User | null;
  isMember: boolean;
}

async function checkIsMember(email: string | undefined | null): Promise<boolean> {
  if (!email) return false;
  const { data, error } = await supabase.rpc("is_member_email", { _email: email });
  if (error) {
    console.warn("is_member_email rpc failed", error);
    return false;
  }
  return Boolean(data);
}

export function useMemberSession(): MemberSessionState {
  const [state, setState] = useState<MemberSessionState>({ loading: true, user: null, isMember: false });

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      const { data } = await supabase.auth.getUser();
      const user = data.user ?? null;
      const isMember = user ? await checkIsMember(user.email) : false;
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

export async function isMemberEmail(email: string): Promise<boolean> {
  return checkIsMember(email);
}
