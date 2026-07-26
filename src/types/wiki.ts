export type WikiPageStatus =
  | "draft"
  | "pending"
  | "published";

export type WikiTemplate =
  | "general"
  | "rules"
  | "lore"
  | "race"
  | "class"
  | "item"
  | "location"
  | "faction"
  | "npc";

export type StaffRoleKey =
  | "owner"
  | "admin"
  | "mod"
  | "dm";

export interface WikiRoleOption {
  id: string;
  name: string;
  key: StaffRoleKey;
  colorHex: string;
}

export interface NavigationGroupOption {
  id: string;
  name: string;
  path: string;
}

export interface WikiPage {
  id: string;

  title: string;
  path: string;
  template: WikiTemplate;

  status: WikiPageStatus;

  navigationGroup: string | null;
  navigationLabel: string | null;
  navigationOrder: number | null;

  editRoleId: string;
  publishRoleId: string;

  updatedBy: string;
  updatedAt: string;
}

export interface CreateWikiPageInput {
  title: string;
  template: WikiTemplate;
  navigationGroup: string;
  editRoleId: string;
  publishRoleId: string;
}