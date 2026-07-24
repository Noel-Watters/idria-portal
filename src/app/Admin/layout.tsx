import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
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
    .select("staff_role, is_banned")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/");
  }

  if (profile.is_banned) {
    redirect("/");
  }

  const allowedRoles = ["Owner", "Admin"];

  if (!profile.staff_role || !allowedRoles.includes(profile.staff_role)) {
    redirect("/");
  }

  return <>{children}</>;
}