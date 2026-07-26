"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  NavigationGroupOption,
  StaffRoleKey,
  WikiPage,
  WikiPageStatus,
  WikiRoleOption,
} from "@/types/wiki";

import WikiStatusControl from "./WikiStatusControl";

type WikiPageRowProps = {
  page: WikiPage;
  roles: WikiRoleOption[];
  navigationGroups: NavigationGroupOption[];
  currentUserRole: StaffRoleKey;

  onStatusChange: (
    page: WikiPage,
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
                    (group) => group.name === page.navigationGroup
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
          value={page.editRoleId}
          disabled={!canManagePermissions}
          onChange={(roleId) =>
            onEditRoleChange(page.id, roleId)
          }
        />
      </LabeledControl>

      <LabeledControl label="Publish">
        <RoleSelect
          roles={roles}
          value={page.publishRoleId}
          disabled={!canManagePermissions}
          onChange={(roleId) =>
            onPublishRoleChange(page.id, roleId)
          }
        />
      </LabeledControl>

      <LabeledValue
        label="Updated by"
        value={page.updatedBy}
      />

      <LabeledValue
        label="Last updated"
        value={formatUpdatedAt(page.updatedAt)}
        title={new Date(page.updatedAt).toLocaleString()}
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
  roles: WikiRoleOption[];
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
                color: role.colorHex,
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

function formatUpdatedAt(value: string) {
  const date = new Date(value);

  return (
    date.toLocaleDateString("en-US") +
    " " +
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
  );
}