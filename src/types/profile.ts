export type IdriaProfile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  staff_role: string | null;
  is_whitelisted: boolean;
  is_banned: boolean;
};