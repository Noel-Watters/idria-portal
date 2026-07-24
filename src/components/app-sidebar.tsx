import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { BookOpen, ScrollText } from "lucide-react"
import Image from "next/image"
import DiscordLoginButton from "./auth/DiscordButtonLogin"

const IdriaLogo = () => (
  <Image src="/Bright-Idria Logo.png" alt="Home" width={25} height={25} className="object-contain" />
)

const navItems = [
  { title: "Home", url: "/", icon: IdriaLogo },
  { title: "Lore", url: "/Lore", icon: BookOpen },
  { title: "Rules", url: "/Rules", icon: ScrollText },
]

export function AppSidebar() {
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
              <DiscordLoginButton />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}