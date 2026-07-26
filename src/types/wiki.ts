import type { role } from "./role";

export type WikiPageStatus =
  | "draft"
  | "pending"
  | "published";

export type WikiTemplate =
  | "General"
  | "Rules"
  | "Lore"
  | "Race"
  | "Class"
  | "Item"
  | "Location"
  | "Faction"
  | "NPC";

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

export interface navigation_group {
  id: string;
  name: string;
  path: string;
  position: number;
  is_active: boolean;
}

export interface CreateWikiPageInput {
  title: string;
  template: WikiTemplate;
  navigation_group: string;
  edit_role_id: string;
  publish_role_id: string;
}

export interface page {
  id: string;

  title: string;
  path: string;
  template: WikiTemplate;

  content: Record<string, unknown>;

  status: WikiPageStatus;

  show_in_navigation: boolean;

  navigation_group_id: string;

  created_by: string;
  updated_by: string;

  created_at: string;
  updated_at: string;
  published_at: string | null;

  edit_role_id: string;
  publish_role_id: string;

}

export interface page_dashboard {
  id: string;

  title: string;
  path: string;
  template: WikiTemplate;

  status: WikiPageStatus;

  navigation_group_id: string;

  edit_role_id: string;
  publish_role_id: string;

  updated_by: string;
  updated_at: string;
}