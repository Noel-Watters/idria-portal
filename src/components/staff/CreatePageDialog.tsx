"use client";

import { useMemo, useState } from "react";
import {Plus} from "lucide-react"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  CreateWikiPageInput,
  NavigationGroupOption,
  WikiRoleOption,
  WikiTemplate,
} from "@/types/wiki";

type TemplateOption = {
  value: WikiTemplate;
  label: string;
};

type CreatePageDialogProps = {
  roles: WikiRoleOption[];
  navigationGroups: NavigationGroupOption[];
  templates: TemplateOption[];
  onCreate: (input: CreateWikiPageInput) => void;
};

const initialForm: CreateWikiPageInput = {
  title: "",
  navigationGroup: "",
  template: "general",
  editRoleId: "",
  publishRoleId: "",
};

export default function CreatePageDialog({
  roles,
  navigationGroups,
  templates,
  onCreate,
}: CreatePageDialogProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] =
    useState<CreateWikiPageInput>(initialForm);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedNavigationGroup =
    navigationGroups.find(
      (group) => group.id === form.navigationGroup
    ) ?? null;

  const generatedPath = useMemo(() => {
    const titlePath = toPathSegment(form.title);

    if (!titlePath) {
      return selectedNavigationGroup?.path
        ? `/${selectedNavigationGroup.path}/`
        : "/";
    }

    if (!selectedNavigationGroup?.path) {
      return `/${titlePath}`;
    }

    return `/${selectedNavigationGroup.path}/${titlePath}`;
  }, [form.title, selectedNavigationGroup]);

  function updateForm<K extends keyof CreateWikiPageInput>(
    field: K,
    value: CreateWikiPageInput[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrorMessage("");
  }

  function handleCreate() {
    const title = form.title.trim();

    if (!title) {
      setErrorMessage("A page name is required.");
      return;
    }

    if (!/^[A-Z]/.test(title)) {
      setErrorMessage(
        "The page name must begin with a capital letter."
      );
      return;
    }

    if (
      !form.navigationGroup ||
      !form.editRoleId ||
      !form.publishRoleId
    ) {
      setErrorMessage(
        "Complete all required dropdown fields."
      );
      return;
    }

    onCreate({
      ...form,
      title,
    });

    setForm(initialForm);
    setErrorMessage("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
            <Plus className="mr-2 h-4 w-4" />
            Create Page
        </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create wiki page</DialogTitle>

          <DialogDescription>
            Create a new draft page. Its path is generated from
            the navigation group and page name.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-2">
          <div className="grid gap-2">
            <Label htmlFor="page-title">Page name</Label>

            <Input
              id="page-title"
              value={form.title}
              placeholder="Character Creation"
              onChange={(event) =>
                updateForm("title", event.target.value)
              }
            />

            <p className="text-xs text-muted-foreground">
              The first character must be capitalized.
            </p>
          </div>

          <FormSelect
            label="Navigation group"
            value={form.navigationGroup}
            placeholder="Select navigation group"
            options={navigationGroups.map((group) => ({
              value: group.id,
              label: group.name,
            }))}
            onChange={(value) =>
              updateForm("navigationGroup", value)
            }
          />

          <FormSelect
            label="Template"
            value={form.template}
            placeholder="Select page template"
            options={templates}
            onChange={(value) =>
              updateForm(
                "template",
                value as WikiTemplate
              )
            }
          />

          <FormSelect
            label="Edit role"
            value={form.editRoleId}
            placeholder="Select edit role"
            options={roles.map((role) => ({
              value: role.id,
              label: role.name,
            }))}
            onChange={(value) =>
              updateForm("editRoleId", value)
            }
          />

          <FormSelect
            label="Publish role"
            value={form.publishRoleId}
            placeholder="Select publish role"
            options={roles.map((role) => ({
              value: role.id,
              label: role.name,
            }))}
            onChange={(value) =>
              updateForm("publishRoleId", value)
            }
          />

          <div className="rounded-md border bg-muted/30 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Generated path
            </p>

            <p className="mt-1 break-all font-mono text-sm">
              {generatedPath}
            </p>
          </div>

          {errorMessage && (
            <p className="text-sm text-destructive">
              {errorMessage}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button type="button" onClick={handleCreate}>
            Create Page
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type FormSelectProps = {
  label: string;
  value: string;
  placeholder: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  onChange: (value: string) => void;
};

function FormSelect({
  label,
  value,
  placeholder,
  options,
  onChange,
}: FormSelectProps) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>

      <Select value={value}  onValueChange={(newValue) => {
    if (newValue !== null) {
      onChange(newValue);
    }
  }}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function toPathSegment(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}