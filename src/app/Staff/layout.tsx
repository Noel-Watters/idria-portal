import type { ReactNode } from "react";
import { requireStaff } from "@/lib/auth";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  await requireStaff();

  return <>{children}</>;
}