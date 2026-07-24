import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
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
    .select("display_name, staff_role, is_banned")
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

  return (
    <main>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {profile.display_name ?? "Staff Member"}.</p>
    </main>
  );
}