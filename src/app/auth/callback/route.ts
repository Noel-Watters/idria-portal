import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=missing_code", requestUrl.origin)
    );
  }

  const supabase = await createClient();

  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("OAuth callback error:", exchangeError);

    return NextResponse.redirect(
      new URL("/login?error=oauth", requestUrl.origin)
    );
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Unable to retrieve authenticated user:", userError);

    return NextResponse.redirect(
      new URL("/login?error=user", requestUrl.origin)
    );
  }

  const metadata = user.user_metadata ?? {};

  const discordId =
    metadata.provider_id ??
    metadata.sub ??
    user.identities?.find(
      (identity) => identity.provider === "discord"
    )?.identity_data?.sub ??
    null;

  const username =
    metadata.user_name ??
    metadata.preferred_username ??
    metadata.name ??
    null;

  const displayName =
    metadata.full_name ??
    metadata.global_name ??
    metadata.name ??
    username;

  const avatarUrl =
    metadata.avatar_url ??
    metadata.picture ??
    null;

    console.log({
  id: user.id,
  discordId,
  username,
  displayName,
  avatarUrl,
});

  const { error: profileError } = await supabase
    .from("profile")
    .upsert(
      {
        id: user.id,
        discord_id: discordId ? String(discordId) : null,
        username: String(username),
        display_name: displayName ? String(displayName) : null,
        avatar_url: avatarUrl ? String(avatarUrl) : null,
        last_login: new Date().toISOString(),
      },
      {
        onConflict: "id",
      }
      
    );

    if (!discordId || !username) {
  console.error("Discord metadata was incomplete:", user.user_metadata);

  return NextResponse.redirect(
    new URL("/login?error=missing_discord_data", requestUrl.origin)
  );
}

  if (profileError) {
    console.error("Profile upsert failed:", profileError);

    return NextResponse.redirect(
      new URL("/login?error=profile", requestUrl.origin)
    );
  }

  return NextResponse.redirect(
    new URL("/Account", requestUrl.origin)
  );
}