"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DiscordLoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin() {
    setIsLoading(true);
    setErrorMessage("");

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleLogin}
        disabled={isLoading}
        className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {isLoading ? "Connecting..." : "Log in with Discord"}
      </button>

      {errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}