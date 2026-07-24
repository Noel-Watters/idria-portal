import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { IdriaProfile } from "@/types/profile";


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
      staff_role,
      is_whitelisted,
      is_banned
    `)
    .eq("id", user.id)
    .single<IdriaProfile>();

  if (profileError || !profile) {
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

  if (!currentUser.profile.staff_role) {
    redirect("/Account");
  }

  return currentUser;
});

export const requireAdmin = cache(async () => {
  const currentUser = await requireUser();

  const allowedRoles = ["Owner", "Admin"];

  if (
    !currentUser.profile.staff_role ||
    !allowedRoles.includes(currentUser.profile.staff_role)
  ) {
    redirect("/Account");
  }

  return currentUser;
});