import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("roles")
      .select(`
        id,
        name,
        key,
        rank,
        discord_role_id,
        is_staff,
        is_active,
        color_hex
      `)
      .eq("is_active", true)
      .order("rank", {
        ascending: false,
      });

    if (error) {
      console.error(
        "GET /api/roles failed:",
        error
      );

      return NextResponse.json(
        {
          error: "Roles could not be loaded.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json( data ?? []);
  } catch (error) {
    console.error(
      "GET /api/roles unexpected error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "An unexpected error occurred while loading roles.",
      },
      {
        status: 500,
      }
    );
  }
}