import LogoutButton from "@/components/auth/LogoutButton";
import { requireUser } from "@/lib/auth";

export default async function AccountPage() {
  const { profile } = await requireUser();

  return (
    <main>
      <h1>Account</h1>

      <p>
        Welcome,{" "}
        {profile.display_name ??
          profile.username ??
          "Idria Member"}
      </p>

      <p>
        Whitelist status:{" "}
        {profile.is_whitelisted
          ? "Whitelisted"
          : "Not Whitelisted"}
      </p>

      {profile.staff_role && (
        <p>Staff role: {profile.staff_role}</p>
      )}

      <LogoutButton />
    </main>
  );
}