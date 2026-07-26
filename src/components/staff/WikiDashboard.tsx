"use client";

import { useMemo, useState } from "react";

import {
  mockNavigationGroups,
  mockRoles,
  mockTemplates,
  mockWikiPages,
} from "@/types/mockWikiData";

import type {
  CreateWikiPageInput,
  StaffRoleKey,
  WikiPage,
  WikiPageStatus,
} from "@/types/wiki";

import CreatePageDialog from "./CreatePageDialog";
import PublishPageDialog from "./PublishPageDialog";
import WikiPageRow from "./WikiPageRow";

const currentUserRole: StaffRoleKey = "owner";

export default function WikiDashboard() {
  const [pages, setPages] =
    useState<WikiPage[]>(mockWikiPages);

  const [publishPage, setPublishPage] =
    useState<WikiPage | null>(null);

  const canCreatePages = ["owner", "admin"].includes(
    currentUserRole
  );

  const counts = useMemo(() => {
    return {
      total: pages.length,
      draft: pages.filter(
        (page) => page.status === "draft"
      ).length,
      pending: pages.filter(
        (page) => page.status === "pending"
      ).length,
      published: pages.filter(
        (page) => page.status === "published"
      ).length,
    };
  }, [pages]);

  function updatePage(
    pageId: string,
    changes: Partial<WikiPage>
  ) {
    setPages((currentPages) =>
      currentPages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              ...changes,
              updatedBy: "Noelle",
              updatedAt: new Date().toISOString(),
            }
          : page
      )
    );
  }

  function handleStatusChange(
    page: WikiPage,
    status: WikiPageStatus
  ) {
    if (
      status === "published" &&
      page.status !== "published"
    ) {
      setPublishPage(page);
      return;
    }

    updatePage(page.id, {
      status,
    });
  }

  function handlePublish() {
    if (!publishPage) {
      return;
    }

    updatePage(publishPage.id, {
      status: "published",
    });

    setPublishPage(null);
  }

  function handleNavigationChange(
    pageId: string,
    navigationGroupId: string
  ) {
    const group = mockNavigationGroups.find(
      (entry) => entry.id === navigationGroupId
    );

    updatePage(pageId, {
      navigationGroup: group?.name ?? null,
    });
  }

  function handleCreatePage(
    input: CreateWikiPageInput
  ) {
    const group = mockNavigationGroups.find(
      (entry) => entry.id === input.navigationGroup
    );

    const pathSegment = input.title
      .trim()
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const path = group?.path
      ? `${group.path}/${pathSegment}`
      : pathSegment;

    const newPage: WikiPage = {
      id: crypto.randomUUID(),
      title: input.title,
      path,
      template: input.template,
      status: "draft",
      navigationGroup: group?.name ?? null,
      navigationLabel: input.title,
      navigationOrder: null,
      editRoleId: input.editRoleId,
      publishRoleId: input.publishRoleId,
      updatedBy: "Noelle",
      updatedAt: new Date().toISOString(),
    };

    setPages((currentPages) => [
      newPage,
      ...currentPages,
    ]);
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
              roles={mockRoles}
              navigationGroups={mockNavigationGroups}
              templates={mockTemplates}
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
          <div className="hidden gap-4 border-b bg-muted/30 px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground xl:grid xl:grid-cols-[minmax(180px,1fr)_minmax(170px,1fr)_170px_170px_170px_150px_180px_150px]">
            <span>Page</span>
            <span>Path</span>
            <span>Navigation</span>
            <span>Edit</span>
            <span>Publish</span>
            <span>Updated by</span>
            <span>Last updated</span>
            <span>Status</span>
          </div>

          {pages.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              No wiki pages have been created.
            </div>
          ) : (
            pages.map((page) => (
              <WikiPageRow
                key={page.id}
                page={page}
                roles={mockRoles}
                navigationGroups={
                  mockNavigationGroups
                }
                currentUserRole={currentUserRole}
                onStatusChange={handleStatusChange}
                onNavigationChange={
                  handleNavigationChange
                }
                onEditRoleChange={(
                  pageId,
                  editRoleId
                ) =>
                  updatePage(pageId, {
                    editRoleId,
                  })
                }
                onPublishRoleChange={(
                  pageId,
                  publishRoleId
                ) =>
                  updatePage(pageId, {
                    publishRoleId,
                  })
                }
              />
            ))
          )}
        </section>
      </main>

      <PublishPageDialog
        page={publishPage}
        open={Boolean(publishPage)}
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

function SummaryCard({
  label,
  value,
  dotClassName,
}: {
  label: string;
  value: number;
  dotClassName?: string;
}) {
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