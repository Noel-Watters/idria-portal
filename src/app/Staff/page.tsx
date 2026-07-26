import LogoutButton from "@/components/auth/LogoutButton";
import WikiDashboard from "@/components/staff/WikiDashboard";
import { requireUser } from "@/lib/auth";

export default async function StaffPage() {
  await requireUser();

  return (
    <main>
      <WikiDashboard />
    </main>
  );
}