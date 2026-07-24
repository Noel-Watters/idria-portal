import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth";

type AccountLayoutProps = {
  children: ReactNode;
};

export default async function AccountLayout({
  children,
}: AccountLayoutProps) {
  await requireUser();

  return <>{children}</>;
}