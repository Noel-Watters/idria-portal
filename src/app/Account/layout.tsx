import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type AccountLayoutProps = {
  children: ReactNode;
};

export default async function AccountLayout({
  children,
}: AccountLayoutProps) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profile")
    .select(
      `
        id,
        display_name,
        avatar_url,
        staff_role,
        is_whitelisted,
        is_banned
      `
    )
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/login?error=profile");
  }

  if (profile.is_banned) {
    redirect("/banned");
  }

  return <>{children}</>;
}