"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { navigation_group, StaffRoleKey, WikiPageStatus, page_dashboard} from "@/types/wiki";
import WikiStatusControl from "./WikiStatusControl";
import { role } from "@/types/role";
import { formatDate } from "@/lib/date";

type WikiPageRowProps = {
  page: page_dashboard;
  roles: role[];
  navigationGroups: navigation_group[];
  currentUserRole: StaffRoleKey;

  onStatusChange: (
    page: page_dashboard,
    status: WikiPageStatus
  ) => void;

  onNavigationChange: (
    pageId: string,
    navigationGroup: string
  ) => void;

  onEditRoleChange: (
    pageId: string,
    roleId: string
  ) => void;

  onPublishRoleChange: (
    pageId: string,
    roleId: string
  ) => void;
};

export default function WikiPageRow({
  page,
  roles,
  navigationGroups,
  currentUserRole,
  onStatusChange,
  onNavigationChange,
  onEditRoleChange,
  onPublishRoleChange,
}: WikiPageRowProps) {
  const canManagePermissions = [
    "owner",
    "admin",
  ].includes(currentUserRole);

    const navigationItems = navigationGroups.map((group) => ({
    value: group.id,
    label: group.name,
  }));

  return (
    <article className="grid gap-4 border-b p-4 last:border-b-0 xl:grid-cols-[minmax(180px,1fr)_minmax(170px,1fr)_170px_170px_170px_150px_180px_150px] xl:items-center">
      <div className="min-w-0">
        <a
          href={`/${page.path}`}
          target="_blank"
          rel="noreferrer"
          className="block truncate font-medium hover:underline"
        >
          {page.title}
        </a>
      </div>

      <div className="min-w-0">
        <a
          href={`/${page.path}`}
          target="_blank"
          rel="noreferrer"
          className="block truncate font-mono text-sm text-muted-foreground hover:text-foreground hover:underline"
        >
          /{page.path}
        </a>
      </div>

      <LabeledControl label="Navigation">
        <Select
            items ={navigationItems}
            value={
                navigationGroups.find(
                    (group) => group.name === page.navigation_group_id
                )?.id ?? ""
            }
            onValueChange={(value) => {
                if (value !== null) {
                    onNavigationChange(page.id, value);
                }
            }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="None" />
          </SelectTrigger>

          <SelectContent>
            {navigationGroups.map((group) => (
              <SelectItem
                key={group.id}
                value={group.id}
              >
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </LabeledControl>

      <LabeledControl label="Edit">
        <RoleSelect
          roles={roles}
          value={page.edit_role_id}
          disabled={!canManagePermissions}
          onChange={(roleId) =>
            onEditRoleChange(page.id, roleId)
          }
        />
      </LabeledControl>

      <LabeledControl label="Publish">
        <RoleSelect
          roles={roles}
          value={page.publish_role_id}
          disabled={!canManagePermissions}
          onChange={(roleId) =>
            onPublishRoleChange(page.id, roleId)
          }
        />
      </LabeledControl>

      <LabeledValue
        label="Updated by"
        value={page.updated_profile?.display_name ?? page.updated_profile?.username ?? "Unknown"}
      />

      <LabeledValue
        label="Last updated"
        value={formatDate(page.updated_at)}
        title={new Date(page.updated_at).toLocaleString()}
      />

      <LabeledControl label="Status">
        <WikiStatusControl
          status={page.status}
          currentUserRole={currentUserRole}
          onChange={(status) =>
            onStatusChange(page, status)
          }
        />
      </LabeledControl>
    </article>
  );
}

function RoleSelect({
  roles,
  value,
  disabled,
  onChange,
}: {
  roles: role[];
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  const items = roles.map((role) => ({
    value: role.id,
    label: role.name,
  }));

  return (
    <Select
      items={items}
      value={value}
      disabled={disabled}
      onValueChange={(newValue) => {
        if (newValue !== null) {
          onChange(newValue);
        }
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {roles.map((role) => (
          <SelectItem key={role.id} value={role.id}>
            <span
              style={{
                color: role.color_hex ?? undefined,
              }}
            >
              {role.name}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function LabeledControl({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-w-0 gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground xl:hidden">
        {label}
      </span>

      {children}
    </div>
  );
}

function LabeledValue({
  label,
  value,
  title,
}: {
  label: string;
  value: string;
  title?: string;
}) {
  return (
    <div className="min-w-0" title={title}>
      <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground xl:hidden">
        {label}
      </span>

      <span className="block truncate text-sm">
        {value}
      </span>
    </div>
  );
}

