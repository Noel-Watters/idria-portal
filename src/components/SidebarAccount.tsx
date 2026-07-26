"use client";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { SiDiscord } from "@icons-pack/react-simple-icons";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar";

type SidebarUser = {
  displayName: string;
  username: string;
  avatarUrl: string | null;
  roleName: string | null;
};

type SidebarAccountProps = {
  user: SidebarUser | null;
};

export default function SidebarAccount({
  user,
}: SidebarAccountProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    setIsLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Discord login failed:", error);
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    setIsLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error);
      setIsLoading(false);
      return;
    }

    window.location.href = "/";
  }

  if (!user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            type="button"
            disabled={isLoading}
            onClick={handleLogin}
            tooltip="Log in with Discord"
          >
            <SiDiscord />
            <span>
              {isLoading ? "Connecting..." : "Login with Discord"}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const initials = getInitials(user.displayName);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent"
              />
            }
          >
            <Avatar className="size-8">
              {user.avatarUrl && (
                <AvatarImage
                  src={user.avatarUrl}
                  alt={user.displayName}
                />
              )}

              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {user.displayName}
              </span>

              <span className="truncate text-xs text-muted-foreground">
                {user.roleName ?? user.username}
              </span>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="top"
            align="start"
            className="w-56"
          >
            <DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className="grid gap-1">
                <span>{user.displayName}</span>

                <span className="text-xs font-normal text-muted-foreground">
                  {user.username}
                </span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              disabled={isLoading}
              onClick={handleLogout}
            >
              <LogOut />
              {isLoading ? "Logging out..." : "Log out"}
            </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}