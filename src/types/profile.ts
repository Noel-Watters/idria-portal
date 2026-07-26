import { role } from "./role";

export type profile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  role: role | null;
  is_whitelisted: boolean;
  is_banned: boolean;
};