import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { profile } from "@/types/profile";

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profile")
    .select(`
      id,
      username,
      display_name,
      avatar_url,
      is_whitelisted,
      is_banned,
      staff_role,
      role:roles!profile_staff_role_fkey (
        id,
        name,
        key,
        color_hex,
        is_staff,
        is_active
      )
    `)
    .eq("id", user.id)
    .single<profile>();

  if (profileError || !profile) {
    console.error(profileError);
    return null;
  }

  return {
    authUser: user,
    profile,
  };
});

export const requireUser = cache(async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/");
  }

  if (currentUser.profile.is_banned) {
    redirect("/Banned");
  }

  return currentUser;
});

export const requireStaff = cache(async () => {
  const currentUser = await requireUser();

  const role = currentUser.profile.role;

  if (
    !role ||
    !role.is_active ||
    !role.is_staff
  ) {
    redirect("/Account");
  }

  return currentUser;
});

export const requireAdmin = cache(async () => {
  const currentUser = await requireStaff();

  const role = currentUser.profile.role;

  if (
    !role ||
    !["owner", "admin"].includes(role.key)
  ) {
    redirect("/Account");
  }

  return currentUser;
});