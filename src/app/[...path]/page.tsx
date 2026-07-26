import WikiPageView from "@/components/editor/PageView";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import type { page } from "@/types/wiki";
import { headers } from "next/headers";


type PageProps = {
  params: Promise<{
    path: string[];
  }>;
};

type PageWithPermissions = page & {
  edit_role: {
    rank: number;
  };

  publish_role: {
    rank: number;
  };
};

export default async function Page({ params }: PageProps) {
  const requestHeaders = await headers();
  const { path } = await params;
  const currentUser = await getCurrentUser();

  const reservedPaths = [
  "Staff",
  "Account",
  "Login",

];

if (reservedPaths.includes(path[0])) {
  notFound();
}
 

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/pages/path/${path.join("/")}`,
    {
      headers: {
      cookie: requestHeaders.get("cookie") ?? "",
    },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    notFound();
  }

  const page = await response.json();
  const userRank = currentUser?.profile.role?.rank ?? 0;
  const canEdit = userRank >= page.edit_role.rank;
  const canPublish = userRank >= page.publish_role.rank;


  return (
    <WikiPageView 
    page={page} 
    canEdit = {canEdit}
    canPublish= {canPublish}
    />
  );
}