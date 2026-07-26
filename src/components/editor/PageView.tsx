"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type {
  page,
  WikiPageStatus,
} from "@/types/wiki";

import { formatDate } from "@/lib/date";

import Editor from "./Editor";
import PageRender from "./PageRender";
import PageRenderer from "./PageRenderer";

type PageViewProps = {
  page: page;
  canEdit: boolean;
  canPublish: boolean;
};

export default function PageView({
  page,
  canEdit,
  canPublish,
}: PageViewProps) {
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState(false);
  const [content, setContent] = useState(
    page.content
  );
  const [isSaving, setIsSaving] =
    useState(false);

  function cancelEditing() {
    setContent(page.content);
    setEditing(false);
    setPreview(false);
  }

  async function updatePage(
    status: WikiPageStatus
  ) {
    setIsSaving(true);

    try {
      const response = await fetch(
        `/api/pages/${page.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            content,
            status,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Failed to update page."
        );
      }

      setEditing(false);
      setPreview(false);
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="w-full">
      <div className="mx-4 mt-6 flex justify-end md:mx-16">
        {!editing && canEdit && (
          <button
            type="button"
            className="rounded-md border px-4 py-2"
            onClick={() =>
              setEditing(true)
            }
          >
            Edit Page
          </button>
        )}

        {editing && (
          <button
            type="button"
            disabled={isSaving}
            className="rounded-md border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={cancelEditing}
          >
            Cancel
          </button>
        )}
      </div>

      {editing ? (
        <section className="mx-auto w-full max-w-7xl px-4 pb-10 md:px-16">
          <div className="mb-6 text-sm text-muted-foreground">
            <p>
              Updated by:{" "}
              {page.updated_profile
                ?.display_name ??
                page.updated_profile
                  ?.username ??
                "Unknown"}
            </p>

            <p>
              Updated at:{" "}
              {formatDate(page.updated_at)}
            </p>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={isSaving}
              className="rounded-md border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() =>
                setPreview(
                  (current) => !current
                )
              }
            >
              {preview
                ? "Return to Editor"
                : "Preview"}
            </button>

            <button
              type="button"
              disabled={isSaving}
              className="rounded-md border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() =>
                updatePage("draft")
              }
            >
              {isSaving
                ? "Saving..."
                : "Save as Draft"}
            </button>

            <button
              type="button"
              disabled={isSaving}
              className="rounded-md border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() =>
                updatePage("pending")
              }
            >
              Send for Approval
            </button>

            {canPublish && (
              <button
                type="button"
                disabled={isSaving}
                className="rounded-md border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() =>
                  updatePage(
                    "published"
                  )
                }
              >
                Publish Page
              </button>
            )}
          </div>

          {preview ? (
            <PageRender
              content={content}
            />
          ) : (
            <Editor
              content={content}
              onChange={setContent}
            />
          )}
        </section>
      ) : (
        <PageRenderer page={page} />
      )}
    </main>
  );
}