import { IdriaRole } from "./role";

export type PageStatus =
  | "draft"
  | "pending"
  | "published";

export interface IdriaPage {
  id: string;

  title: string;
  path: string;
  template: string;

  content: Record<string, unknown>;

  status:PageStatus;

  is_navigation_visible: boolean;
  navigation_group: string | null;
  navigation_label: string | null;
  navigation_position: number | null;

  edit_role_id: string;
  publish_role_id: string;

  edit_role: IdriaRole;
  publish_role: IdriaRole;

  created_by: string;
  updated_by: string;

  created_at: string;
  updated_at: string;
  published_at: string | null;
}