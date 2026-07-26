import { NextResponse } from "next/server";
import { requireAdmin, requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type {page, WikiPageStatus, WikiTemplate} from "@/types/wiki";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdatePageInput = Partial<
  Pick<
    page,
    | "title"
    | "path"
    | "template"
    | "content"
    | "status"
    | "show_in_navigation"
    | "navigation_group_id"
    | "edit_role_id"
    | "publish_role_id"
  >
>;

type PageUpdates = UpdatePageInput &
  Pick<page, "updated_by" | "updated_at"> & {
    published_at?: string | null;
  };

const validTemplates: WikiTemplate[] = [
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

const validStatuses: WikiPageStatus[] = [
  "draft",
  "pending",
  "published",
];

const allowedUpdateFields: Array<
  keyof UpdatePageInput
> = [
  "title",
  "path",
  "template",
  "content",
  "status",
  "show_in_navigation",
  "navigation_group_id",
  "edit_role_id",
  "publish_role_id",
];

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Page ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    let body: UpdatePageInput;

    try {
      body = (await request.json()) as UpdatePageInput;
    } catch {
      return NextResponse.json(
        {
          error: "The request body must be valid JSON.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        {
          error: "A valid page update object is required.",
        },
        {
          status: 400,
        }
      );
    }

    const suppliedFields = Object.keys(body);

    if (suppliedFields.length === 0) {
      return NextResponse.json(
        {
          error: "No page changes were provided.",
        },
        {
          status: 400,
        }
      );
    }

    const unsupportedFields = suppliedFields.filter(
      (field) =>
        !allowedUpdateFields.includes(
          field as keyof UpdatePageInput
        )
    );

    if (unsupportedFields.length > 0) {
      return NextResponse.json(
        {
          error: `Unsupported page fields: ${unsupportedFields.join(
            ", "
          )}.`,
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Only Owner and Admin may change:
     * - status
     * - edit role
     * - publish role
     */
    const containsAdminOnlyChanges =
      body.status !== undefined ||
      body.edit_role_id !== undefined ||
      body.publish_role_id !== undefined;

    const currentUser = containsAdminOnlyChanges
      ? await requireAdmin()
      : await requireStaff();

    const supabase = await createClient();
    const now = new Date().toISOString();

    const updates: PageUpdates = {
      updated_by: currentUser.profile.id,
      updated_at: now,
    };

    if (body.title !== undefined) {
      if (typeof body.title !== "string") {
        return NextResponse.json(
          {
            error: "Page title must be text.",
          },
          {
            status: 400,
          }
        );
      }

      const title = body.title.trim();

      if (!title) {
        return NextResponse.json(
          {
            error: "Page title cannot be empty.",
          },
          {
            status: 400,
          }
        );
      }

      if (!/^[A-Z]/.test(title)) {
        return NextResponse.json(
          {
            error:
              "The page title must begin with a capital letter.",
          },
          {
            status: 400,
          }
        );
      }

      updates.title = title;
    }

    if (body.path !== undefined) {
      if (typeof body.path !== "string") {
        return NextResponse.json(
          {
            error: "Page path must be text.",
          },
          {
            status: 400,
          }
        );
      }

      const path = normalizePath(body.path);

      if (!path) {
        return NextResponse.json(
          {
            error: "Page path cannot be empty.",
          },
          {
            status: 400,
          }
        );
      }

      updates.path = path;
    }

    if (body.template !== undefined) {
      if (!validTemplates.includes(body.template)) {
        return NextResponse.json(
          {
            error: "Invalid page template.",
          },
          {
            status: 400,
          }
        );
      }

      updates.template = body.template;
    }

    if (body.content !== undefined) {
      if (
        typeof body.content !== "object" ||
        body.content === null ||
        Array.isArray(body.content)
      ) {
        return NextResponse.json(
          {
            error: "Page content must be a JSON object.",
          },
          {
            status: 400,
          }
        );
      }

      updates.content = body.content;
    }

    if (body.show_in_navigation !== undefined) {
      if (
        typeof body.show_in_navigation !== "boolean"
      ) {
        return NextResponse.json(
          {
            error:
              "show_in_navigation must be true or false.",
          },
          {
            status: 400,
          }
        );
      }

      updates.show_in_navigation =
        body.show_in_navigation;
    }

    if (body.navigation_group_id !== undefined) {
      if (
        typeof body.navigation_group_id !== "string" ||
        !body.navigation_group_id.trim()
      ) {
        return NextResponse.json(
          {
            error: "Navigation group ID is required.",
          },
          {
            status: 400,
          }
        );
      }

      updates.navigation_group_id =
        body.navigation_group_id;
    }

    if (body.edit_role_id !== undefined) {
      if (
        typeof body.edit_role_id !== "string" ||
        !body.edit_role_id.trim()
      ) {
        return NextResponse.json(
          {
            error: "Edit role ID is required.",
          },
          {
            status: 400,
          }
        );
      }

      updates.edit_role_id = body.edit_role_id;
    }

    if (body.publish_role_id !== undefined) {
      if (
        typeof body.publish_role_id !== "string" ||
        !body.publish_role_id.trim()
      ) {
        return NextResponse.json(
          {
            error: "Publish role ID is required.",
          },
          {
            status: 400,
          }
        );
      }

      updates.publish_role_id =
        body.publish_role_id;
    }

    if (body.status !== undefined) {
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          {
            error: "Invalid page status.",
          },
          {
            status: 400,
          }
        );
      }

      updates.status = body.status;
      updates.published_at =
        body.status === "published" ? now : null;
    }

    const { data, error } = await supabase
      .from("pages")
      .update(updates)
      .eq("id", id)
      .select(`
        id,
        title,
        path,
        template,
        content,
        status,
        show_in_navigation,
        created_by,
        updated_by,
        created_at,
        updated_at,
        published_at,
        edit_role_id,
        publish_role_id,
        navigation_group_id
      `)
      .single();

    if (error) {
      console.error(
        `PATCH /api/pages/${id} failed:`,
        error
      );

      if (error.code === "23505") {
        return NextResponse.json(
          {
            error:
              "Another page already uses that path.",
          },
          {
            status: 409,
          }
        );
      }

      if (error.code === "23503") {
        return NextResponse.json(
          {
            error:
              "A selected role or navigation group does not exist.",
          },
          {
            status: 400,
          }
        );
      }

      if (error.code === "PGRST116") {
        return NextResponse.json(
          {
            error:
              "Page not found or you do not have permission to edit it.",
          },
          {
            status: 404,
          }
        );
      }

      return NextResponse.json(
        {
          error: "Page could not be updated.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      page: data,
    });
  } catch (error) {
    console.error(
      "PATCH /api/pages/:id unexpected error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "An unexpected error occurred while updating the page.",
      },
      {
        status: 500,
      }
    );
  }
}

function normalizePath(value: string) {
  return value
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/\/{2,}/g, "/");
}