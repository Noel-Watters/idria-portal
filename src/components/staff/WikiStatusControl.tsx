"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  StaffRoleKey,
  WikiPageStatus,
} from "@/types/wiki";

type WikiStatusControlProps = {
  status: WikiPageStatus;
  currentUserRole: StaffRoleKey;
  onChange: (status: WikiPageStatus) => void;
};

const statusDetails: Record<
  WikiPageStatus,
  {
    label: string;
    dotClassName: string;
  }
> = {
  draft: {
    label: "Draft",
    dotClassName: "bg-zinc-400",
  },
  pending: {
    label: "Pending",
    dotClassName: "bg-yellow-400",
  },
  published: {
    label: "Published",
    dotClassName: "bg-green-500",
  },
};

export default function WikiStatusControl({
  status,
  currentUserRole,
  onChange,
}: WikiStatusControlProps) {
  const canChangeStatus = ["owner", "admin"].includes(
    currentUserRole
  );

  if (!canChangeStatus) {
    return <StatusLabel status={status} />;
  }

  return (
    <Select
      value={status}
      onValueChange={(value) =>
        onChange(value as WikiPageStatus)
      }
    >
      <SelectTrigger
        className="h-9 w-[145px] border-white/10 bg-transparent"
        aria-label="Change page status"
      >
        <SelectValue>
          <StatusLabel status={status} />
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="draft">
          <StatusLabel status="draft" />
        </SelectItem>

        <SelectItem value="pending">
          <StatusLabel status="pending" />
        </SelectItem>

        <SelectItem value="published">
          <StatusLabel status="published" />
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

function StatusLabel({
  status,
}: {
  status: WikiPageStatus;
}) {
  const details = statusDetails[status];

  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`size-2 rounded-full ${details.dotClassName}`}
        aria-hidden="true"
      />

      <span>{details.label}</span>
    </span>
  );
}