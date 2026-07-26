import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("navigation_groups")
      .select(`
        id,
        name,
        path,
        position,
        is_active
      `)
      .eq("is_active", true)
      .order("position", {
        ascending: true,
      });


    if (error) {
      console.error(
        "GET /api/navigation_groups failed:",
        error
      );

      return NextResponse.json(
        {
          error: "Navigation groups could not be loaded.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(data ?? [],
    );
  } catch (error) {
    console.error(
      "GET /api/navigation_groups unexpected error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "An unexpected error occurred while loading navigation groups.",
      },
      {
        status: 500,
      }
    );
  }
}