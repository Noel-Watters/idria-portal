"use client";
import { useMemo, useState } from "react";
import type { CreateWikiPageInput, navigation_group, page_dashboard, StaffRoleKey, WikiPageStatus, WikiTemplate } from "@/types/wiki";
import CreatePageDialog from "./CreatePageDialog";
import PublishPageDialog from "./PublishPageDialog";
import WikiPageRow from "./WikiPageRow";
import { role } from "@/types/role";


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

  function handleStatusChange(
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

    /*
     * DATABASE CONNECTION:
     * Update public.pages.status here.
     *
     * Expected input:
     * {
     *   page_id: page.id,
     *   status
     * }
     */
    void page;
    void status;
  }

  function handlePublish() {
    if (!publishPage) {
      return;
    }

    /*
     * DATABASE CONNECTION:
     * Publish this page here.
     *
     * Update:
     * pages.status = "published"
     * pages.published_at = current timestamp
     * pages.updated_at = current timestamp
     * pages.updated_by = authenticated profile ID
     */

    setPublishPage(null);
  }

  function handleNavigationChange(
    pageId: string,
    navigationGroupId: string
  ) {
    /*
     * DATABASE CONNECTION:
     * Update public.pages.navigation_group_id here.
     *
     * Expected input:
     * {
     *   page_id: pageId,
     *   navigation_group_id: navigationGroupId
     * }
     */
    void pageId;
    void navigationGroupId;
  }

  function handleEditRoleChange(
    pageId: string,
    editRoleId: string
  ) {
    /*
     * DATABASE CONNECTION:
     * Update public.pages.edit_role_id here.
     *
     * Admin and Owner only.
     *
     * Expected input:
     * {
     *   page_id: pageId,
     *   edit_role_id: editRoleId
     * }
     */
    void pageId;
    void editRoleId;
  }

  function handlePublishRoleChange(
    pageId: string,
    publishRoleId: string
  ) {
    /*
     * DATABASE CONNECTION:
     * Update public.pages.publish_role_id here.
     *
     * Admin and Owner only.
     *
     * Expected input:
     * {
     *   page_id: pageId,
     *   publish_role_id: publishRoleId
     * }
     */
    void pageId;
    void publishRoleId;
  }

  function handleCreatePage(
    input: CreateWikiPageInput
  ) {
    /*
     * DATABASE CONNECTION:
     * Create a new row in public.pages here.
     *
     * The server action should:
     *
     * 1. Require an authenticated Admin or Owner.
     * 2. Generate the page path.
     * 3. Insert the page with status = "draft".
     * 4. Set created_by to the authenticated profile ID.
     * 5. Set updated_by to the authenticated profile ID.
     * 6. Return the new page ID.
     * 7. Navigate to the page editor.
     */
    void input;
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
            <div className="min-w-[1450px]">
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