import { NextResponse } from "next/server";
import { requireAdmin, requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { WikiPageStatus, WikiTemplate} from "@/types/wiki";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdatePageInput = {
  title?: string;
  path?: string;
  template?: WikiTemplate;
  content?: Record<string, unknown>;
  status?: WikiPageStatus;
  show_in_navigation?: boolean;
  navigation_group_id?: string;
  edit_role_id?: string;
  publish_role_id?: string;
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

export async function GET(
  _request: Request,
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

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("pages")
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
      .eq("id", id)
      .single();

    if (error) {
      console.error(
        `GET /api/pages/${id} failed:`,
        error
      );

      if (error.code === "PGRST116") {
        return NextResponse.json(
          {
            error:
              "Page not found or you do not have permission to view it.",
          },
          {
            status: 404,
          }
        );
      }

      return NextResponse.json(
        {
          error: "Page could not be loaded.",
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
      "GET /api/pages/:id unexpected error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "An unexpected error occurred while loading the page.",
      },
      {
        status: 500,
      }
    );
  }
}

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

    const body = (await request.json()) as UpdatePageInput;

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        {
          error: "No page changes were provided.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Admin and Owner only:
     * - Changing page status
     * - Changing edit permission
     * - Changing publish permission
     */
    const containsAdminOnlyChange =
      body.status !== undefined ||
      body.edit_role_id !== undefined ||
      body.publish_role_id !== undefined;

    const currentUser = containsAdminOnlyChange
      ? await requireAdmin()
      : await requireStaff();

    const supabase = await createClient();

    const updates: UpdatePageInput & {
      updated_by: string;
      updated_at: string;
      published_at?: string | null;
    } = {
      updated_by: currentUser.profile.id,
      updated_at: new Date().toISOString(),
    };

    if (body.title !== undefined) {
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
      if (typeof body.show_in_navigation !== "boolean") {
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
      if (!body.navigation_group_id.trim()) {
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
      if (!body.edit_role_id.trim()) {
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
      if (!body.publish_role_id.trim()) {
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

      if (body.status === "published") {
        updates.published_at =
          new Date().toISOString();
      } else {
        updates.published_at = null;
      }
    }

    const { data, error } = await supabase
      .from("pages")
      .update(updates)
      .eq("id", id)
      .select()
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

export async function DELETE(
  _request: Request,
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

    /*
     * DELETE is restricted to Owner and Admin.
     */
    await requireAdmin();

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("pages")
      .delete()
      .eq("id", id)
      .select("id")
      .single();

    if (error) {
      console.error(
        `DELETE /api/pages/${id} failed:`,
        error
      );

      if (error.code === "PGRST116") {
        return NextResponse.json(
          {
            error:
              "Page not found or you do not have permission to delete it.",
          },
          {
            status: 404,
          }
        );
      }

      return NextResponse.json(
        {
          error: "Page could not be deleted.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      id: data.id,
    });
  } catch (error) {
    console.error(
      "DELETE /api/pages/:id unexpected error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "An unexpected error occurred while deleting the page.",
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