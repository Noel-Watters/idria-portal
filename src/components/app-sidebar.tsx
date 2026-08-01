import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarTrigger,} from "@/components/ui/sidebar"
import SidebarAccount from "@/components/SidebarAccount";
import Link from "next/link"
import { BookOpen, ScrollText, Pickaxe, UserRound, Swords } from "lucide-react"
import Image from "next/image"
import { getCurrentUser } from "@/lib/auth";

const IdriaLogo = () => (
  <Image src="/Bright-Idria Logo.png" alt="Home" width={25} height={25} className="object-contain" />
)

const navItems = [
  { title: "Home", url: "/", icon: IdriaLogo },
  { title: "Lore", url: "/Lore", icon: BookOpen },
  { title: "Rules", url: "/Rules", icon: ScrollText },
  { title: "Races", url: "/Races", icon: UserRound },
  { title: "Classes", url: "/Classes", icon: Swords },
  { title: "Professions", url: "/Professions", icon: Pickaxe },
]

export async function AppSidebar() {
    const currentUser = await getCurrentUser();

    const sidebarUser = currentUser
    ? {
        displayName:
          currentUser.profile.display_name ??
          currentUser.profile.username,
        username: currentUser.profile.username,
        avatarUrl: currentUser.profile.avatar_url,
        roleName: currentUser.profile.role?.name ?? null,
      }
    : null;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title} render={<Link href={item.url} />}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarAccount user={sidebarUser} />
      </SidebarFooter>
    </Sidebar>
  )
}