import { IdriaRole } from "./role";

export type IdriaProfile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  role: IdriaRole | null;
  is_whitelisted: boolean;
  is_banned: boolean;
};