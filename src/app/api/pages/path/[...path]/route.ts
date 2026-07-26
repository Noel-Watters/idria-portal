import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { path } = await context.params;
    const pagePath = path.join("/");

    if (!pagePath) {
      return NextResponse.json(
        {
          error: "Page path is required.",
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
        navigation_group_id,
        edit_role_id,
        publish_role_id,

        updated_profile:profile!pages_updated_by_fkey (
          id,
          display_name,
          username
        ),

        edit_role:roles!pages_edit_role_id_fkey (
          rank
        ),

        publish_role:roles!pages_publish_role_id_fkey (
          rank
        )
      `)
      .eq("path", pagePath)
      .maybeSingle();

    if (error) {
      console.error(
        "GET /api/pages/path failed:",
        error
      );

      return NextResponse.json(
        {
          error: "Failed to load page.",
        },
        {
          status: 500,
        }
      );
    }

    if (data) {
      return NextResponse.json(data);
    }

    /*
     * The normal request could not see the page.
     * Check whether it exists without returning
     * any protected page content.
     */
    const adminSupabase =
      createAdminClient();

    const {
      data: existingPage,
      error: existenceError,
    } = await adminSupabase
      .from("pages")
      .select(`
        id,
        status
      `)
      .eq("path", pagePath)
      .maybeSingle();

    if (existenceError) {
      console.error(
        "GET /api/pages/path existence check failed:",
        existenceError
      );

      return NextResponse.json(
        {
          error:
            "Failed to check whether the page exists.",
        },
        {
          status: 500,
        }
      );
    }

    if (existingPage) {
      return NextResponse.json(
        {
          error:
            "This page is not available yet.",
          code: "PAGE_UNAVAILABLE",
          status: existingPage.status,
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json(
      {
        error: "Page not found.",
        code: "PAGE_NOT_FOUND",
      },
      {
        status: 404,
      }
    );
  } catch (error) {
    console.error(
      "GET /api/pages/path unexpected error:",
      error
    );

    return NextResponse.json(
      {
        error: "Unexpected server error.",
      },
      {
        status: 500,
      }
    );
  }
}