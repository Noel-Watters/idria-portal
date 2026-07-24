import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profile")
    .select(
      `
        display_name,
        username,
        avatar_url,
        staff_role,
        is_whitelisted
      `
    )
    .eq("id", user!.id)
    .single();

  return (
    <main>
      <h1>Account</h1>

      <p>
        Welcome,{" "}
        {profile?.display_name ??
          profile?.username ??
          "Idria Member"}
      </p>

      <p>
        Whitelist status:{" "}
        {profile?.is_whitelisted
          ? "Whitelisted"
          : "Not Whitelisted"}
      </p>

      {profile?.staff_role && (
        <p>Staff role: {profile.staff_role}</p>
      )}
    </main>
  );
}