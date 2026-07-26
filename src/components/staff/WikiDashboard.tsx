"use client";
import { useMemo, useState } from "react";
import type { CreateWikiPageInput, navigation_group, page_dashboard, StaffRoleKey, WikiPageStatus, WikiTemplate } from "@/types/wiki";
import CreatePageDialog from "./CreatePageDialog";
import PublishPageDialog from "./PublishPageDialog";
import WikiPageRow from "./WikiPageRow";
import { role } from "@/types/role";
import { useRouter } from "next/navigation";


type WikiDashboardProps = {
  initialPages: page_dashboard[];
  roles: role[];
  navigationGroups: navigation_group[];
  templates: WikiTemplate[];
  currentUserRole: StaffRoleKey;
};

export default function WikiDashboard({
  initialPages,
  roles,
  navigationGroups,
  templates,
  currentUserRole,
}: WikiDashboardProps) {
  const router = useRouter();
  const [publishPage, setPublishPage] =
    useState<page_dashboard | null>(null);

  const canCreatePages = ["owner", "admin"].includes(
    currentUserRole
  );

  const counts = useMemo(() => {
    return {
      total: initialPages.length,

      draft: initialPages.filter(
        (page) => page.status === "draft"
      ).length,

      pending: initialPages.filter(
        (page) => page.status === "pending"
      ).length,

      published: initialPages.filter(
        (page) => page.status === "published"
      ).length,
    };
  }, [initialPages]);

  async function handleStatusChange(
  page: page_dashboard,
  status: WikiPageStatus
) {
  if (
    status === "published" &&
    page.status !== "published"
  ) {
    setPublishPage(page);
    return;
  }

  await fetch(`/api/pages/${page.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
    }),
  });

  router.refresh();
}


async function handlePublish() {
  if (!publishPage) {
    return;
  }

  const response = await fetch(
    `/api/pages/${publishPage.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "published",
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error ?? "The page could not be published."
    );
  }

  setPublishPage(null);
  router.refresh();
}

  async function handleNavigationChange(
  pageId: string,
  navigationGroupId: string
) {
  await fetch(`/api/pages/${pageId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      navigation_group_id: navigationGroupId,
    }),
  });

  router.refresh();
}

  async function handleEditRoleChange(
  pageId: string,
  editRoleId: string
) {
  await fetch(`/api/pages/${pageId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      edit_role_id: editRoleId,
    }),
  });

  router.refresh();
}

  async function handlePublishRoleChange(
  pageId: string,
  publishRoleId: string
) {
  await fetch(`/api/pages/${pageId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      publish_role_id: publishRoleId,
    }),
  });

  router.refresh();
}

  async function handleCreatePage(
  input: CreateWikiPageInput
) {
  const response = await fetch("/api/pages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Failed to create page.");
  }

  const page: page_dashboard = await response.json();


  router.push(`/Staff/Pages/${page.path}`);
}

  return (
    <>
      <main className="mx-auto w-full max-w-[1800px] px-4 py-8 sm:px-6">
        <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm text-muted-foreground">
              Staff Wiki Management
            </p>

            <h1 className="text-3xl font-semibold tracking-tight">
              Wiki Pages
            </h1>
          </div>

          {canCreatePages && (
            <CreatePageDialog
              roles={roles}
              navigationGroups={navigationGroups}
              templates={templates}
              onCreate={handleCreatePage}
            />
          )}
        </header>

        <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Pages"
            value={counts.total}
          />

          <SummaryCard
            label="Drafts"
            value={counts.draft}
            dotClassName="bg-zinc-400"
          />

          <SummaryCard
            label="Pending Review"
            value={counts.pending}
            dotClassName="bg-yellow-400"
          />

          <SummaryCard
            label="Published"
            value={counts.published}
            dotClassName="bg-green-500"
          />
        </section>

        <section className="overflow-hidden rounded-xl border bg-card">
          <div className="overflow-x-auto">
            <div className="min-w-362.5">
              <div className="grid grid-cols-[minmax(180px,1fr)_minmax(170px,1fr)_170px_170px_170px_150px_180px_160px] gap-4 border-b bg-muted/30 px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <span>Page</span>
                <span>Path</span>
                <span>Navigation</span>
                <span>Edit</span>
                <span>Publish</span>
                <span>Updated by</span>
                <span>Last updated</span>
                <span>Status</span>
              </div>

              {initialPages.length === 0 ? (
                <div className="p-10 text-center text-muted-foreground">
                  No wiki pages have been created.
                </div>
              ) : (
                initialPages.map((page) => (
                  <WikiPageRow
                    key={page.id}
                    page={page}
                    roles={roles}
                    navigationGroups={
                      navigationGroups
                    }
                    currentUserRole={
                      currentUserRole
                    }
                    onStatusChange={
                      handleStatusChange
                    }
                    onNavigationChange={
                      handleNavigationChange
                    }
                    onEditRoleChange={
                      handleEditRoleChange
                    }
                    onPublishRoleChange={
                      handlePublishRoleChange
                    }
                  />
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      <PublishPageDialog
        page={publishPage}
        open={publishPage !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPublishPage(null);
          }
        }}
        onPublish={handlePublish}
      />
    </>
  );
}

type SummaryCardProps = {
  label: string;
  value: number;
  dotClassName?: string;
};

function SummaryCard({
  label,
  value,
  dotClassName,
}: SummaryCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2">
        {dotClassName && (
          <span
            className={`size-2 rounded-full ${dotClassName}`}
            aria-hidden="true"
          />
        )}

        <p className="text-sm text-muted-foreground">
          {label}
        </p>
      </div>

      <p className="mt-2 text-2xl font-semibold">
        {value}
      </p>
    </div>
  );
}