import type {
  NavigationGroupOption,
  WikiPage,
  WikiRoleOption,
  WikiTemplate,
} from "@/types/wiki";

export const mockRoles: WikiRoleOption[] = [
  {
    id: "role-owner",
    name: "Owner",
    key: "owner",
    colorHex: "#D4AF37",
  },
  {
    id: "role-admin",
    name: "Admin",
    key: "admin",
    colorHex: "#E05252",
  },
  {
    id: "role-moderator",
    name: "Moderator",
    key: "mod",
    colorHex: "#4B8DD8",
  },
  {
    id: "role-dungeon-master",
    name: "Dungeon Master",
    key: "dm",
    colorHex: "#9B6BD3",
  },
];

export const mockNavigationGroups: NavigationGroupOption[] = [
  {
    id: "navigation-general",
    name: "General",
    path: "",
  },
  {
    id: "navigation-rules",
    name: "Rules",
    path: "Rules",
  },
  {
    id: "navigation-lore",
    name: "Lore",
    path: "Lore",
  },
  {
    id: "navigation-races",
    name: "Races",
    path: "Races",
  },
  {
    id: "navigation-classes",
    name: "Classes",
    path: "Classes",
  },
  {
    id: "navigation-items",
    name: "Items",
    path: "Items",
  },
  {
    id: "navigation-locations",
    name: "Locations",
    path: "Locations",
  },
];

export const mockTemplates: Array<{
  value: WikiTemplate;
  label: string;
}> = [
  { value: "general", label: "General Page" },
  { value: "rules", label: "Rules Page" },
  { value: "lore", label: "Lore Page" },
  { value: "race", label: "Race Page" },
  { value: "class", label: "Class Page" },
  { value: "item", label: "Item Page" },
  { value: "location", label: "Location Page" },
  { value: "faction", label: "Faction Page" },
  { value: "npc", label: "NPC Page" },
];

export const mockWikiPages: WikiPage[] = [
  {
    id: "page-rules",
    title: "Rules",
    path: "Rules",
    template: "rules",
    status: "published",
    navigationGroup: "General",
    navigationLabel: "Rules",
    navigationOrder: 1,
    editRoleId: "role-admin",
    publishRoleId: "role-owner",
    updatedBy: "Noelle",
    updatedAt: "2026-07-25T14:42:00-04:00",
  },
  {
    id: "page-lore-introduction",
    title: "Lore Introduction",
    path: "Lore/Introduction",
    template: "lore",
    status: "pending",
    navigationGroup: "Lore",
    navigationLabel: "Introduction",
    navigationOrder: 1,
    editRoleId: "role-dungeon-master",
    publishRoleId: "role-admin",
    updatedBy: "Noelle",
    updatedAt: "2026-07-24T19:15:00-04:00",
  },
  {
    id: "page-human",
    title: "Human",
    path: "Races/Human",
    template: "race",
    status: "draft",
    navigationGroup: "Races",
    navigationLabel: "Human",
    navigationOrder: null,
    editRoleId: "role-dungeon-master",
    publishRoleId: "role-admin",
    updatedBy: "Example DM",
    updatedAt: "2026-07-23T11:30:00-04:00",
  },
  {
    id: "page-longsword",
    title: "Longsword",
    path: "Items/Longsword",
    template: "item",
    status: "published",
    navigationGroup: "Items",
    navigationLabel: "Longsword",
    navigationOrder: null,
    editRoleId: "role-moderator",
    publishRoleId: "role-admin",
    updatedBy: "Example Moderator",
    updatedAt: "2026-07-21T16:05:00-04:00",
  },
];