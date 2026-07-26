import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import type { CreateWikiPageInput } from "@/types/wiki";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("pages")
      .select(`
        id,
        title,
        path,
        template,
        status,
        navigation_group_id,
        edit_role_id,
        publish_role_id,
        updated_by,
        updated_at
      `)
      .order("updated_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "GET /api/pages query failed:",
        error
      );

      return NextResponse.json(
        {
          error: "Pages could not be loaded.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json( data ?? [],
    );
  } catch (error) {
    console.error(
      "GET /api/pages unexpected error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "An unexpected error occurred while loading pages.",
      },
      {
        status: 500,
      }
    );
  }
}




export async function POST(request: Request) {
  try {
    const { profile } = await requireAdmin();

    const body =
      (await request.json()) as CreateWikiPageInput;

    const title = body.title.trim();

    if (!title) {
      return NextResponse.json(
        {
          error: "Page title is required.",
        },
        {
          status: 400,
        }
      );
    }

    const supabase = await createClient();

    const {
      data: navigationGroup,
      error: navigationError,
    } = await supabase
      .from("navigation_groups")
      .select("path")
      .eq("id", body.navigation_group)
      .single();

    if (navigationError || !navigationGroup) {
      return NextResponse.json(
        {
          error:
            "Navigation group does not exist.",
        },
        {
          status: 400,
        }
      );
    }

    const slug = title
      .replace(/[^A-Za-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    const path = `${navigationGroup.path}/${slug}`;

    const { data, error } = await supabase
      .from("pages")
      .insert({
        title,
        path,
        template: body.template,
        content: {},
        status: "draft",
        show_in_navigation: false,

        navigation_group_id:
          body.navigation_group,

        edit_role_id: body.edit_role_id,
        publish_role_id:
          body.publish_role_id,

        created_by: profile.id,
        updated_by: profile.id,
      })
      .select()
      .single();

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          error:
            "Unable to create page.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(data, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "An unexpected error occurred.",
      },
      {
        status: 500,
      }
    );
  }
}