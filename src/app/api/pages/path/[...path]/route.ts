import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
        updated_profile:profile!pages_updated_by_fkey (
          id,
          display_name,
          username
          ),
        created_at,
        updated_at,
        published_at,
        navigation_group_id,
        edit_role_id,
        publish_role_id,

        edit_role:roles!pages_edit_role_id_fkey (
          rank
        ),

        publish_role:roles!pages_publish_role_id_fkey (
          rank
        )
      `)
      .eq("path", pagePath)
      .single();


    if (error) {
      console.error(
        "GET /api/pages/path failed:",
        error
      );

      if (error.code === "PGRST116") {
        return NextResponse.json(
          {
            error: "Page not found.",
          },
          {
            status: 404,
          }
        );
      }

      return NextResponse.json(
        {
          error: "Failed to load page.",
        },
        {
          status: 500,
        }
      );
    }


    return NextResponse.json(data);
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