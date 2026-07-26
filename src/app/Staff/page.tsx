import { headers } from "next/headers";
import { requireStaff } from "@/lib/auth";
import WikiDashboard from "@/components/staff/WikiDashboard";
import type { role } from "@/types/role";
import type { navigation_group, page_dashboard, StaffRoleKey, WikiTemplate} from "@/types/wiki";

const templates: WikiTemplate[] = [
  "General",
  "Rules",
  "Lore",
  "Race",
  "Class",
  "Item",
  "Location",
  "Faction",
  "NPC",
];

export default async function StaffPage() {
  const currentUser = await requireStaff();

  const requestHeaders = await headers();

  const host = requestHeaders.get("host");

  if (!host) {
    throw new Error(
      "The application host could not be determined."
    );
  }

  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development"
      ? "http"
      : "https");

  const origin = `${protocol}://${host}`;
  const cookie = requestHeaders.get("cookie") ?? "";

  const [pages, roles, navigationGroups] =
    await Promise.all([
      getApiData<page_dashboard[]>(
        `${origin}/api/pages`,
        cookie
      ),

      getApiData<role[]>(
        `${origin}/api/roles`,
        cookie
      ),

      getApiData<navigation_group[]>(
        `${origin}/api/navigation_groups`,
        cookie
      ),
    ]);

  const staffRoles = roles.filter(
    (role) => role.is_staff
  );

  return (
    <WikiDashboard
      initialPages={pages}
      roles={staffRoles}
      navigationGroups={navigationGroups}
      templates={templates}
      currentUserRole={
        currentUser.profile.role
          ?.key as StaffRoleKey
      }
    />
  );
}

async function getApiData<T>(
  url: string,
  cookie: string
): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      cookie,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`;

    try {
      const body = (await response.json()) as {
        error?: string;
      };

      if (body.error) {
        message = body.error;
      }
    } catch {
      // The response did not contain JSON.
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
}