"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Home,
  LoaderCircle,
} from "lucide-react";

type PageUnavailableProps = {
  title: string;
  message: string;
  code?: string;
  autoRedirect?: boolean;
};

export default function PageUnavailable({
  title,
  message,
  code,
}: PageUnavailableProps) {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl rounded-2xl border bg-surface-2 p-8 text-center">
        <LoaderCircle
          className="mx-auto size-8 animate-spin text-primary"
          aria-hidden="true"
        />

        {code && (
          <p className="mt-5 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {code}
          </p>
        )}

        <h1 className="mt-2 text-3xl font-semibold">
          {title}
        </h1>

        <p className="mt-3 text-muted-foreground">
          {message}
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          Redirecting to the home page in 5 seconds...
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border px-4 py-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="size-4" />
            Go Back
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md border px-4 py-2"
          >
            <Home className="size-4" />
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}