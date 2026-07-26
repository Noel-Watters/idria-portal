"use client";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem,  SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CreateWikiPageInput, navigation_group, WikiTemplate} from "@/types/wiki";
import { role } from "@/types/role";

type CreatePageDialogProps = {
  roles: role[];
  navigationGroups: navigation_group[];
  templates: WikiTemplate[];
  onCreate: (
    input: CreateWikiPageInput
  ) => void | Promise<void>;
};

const initialForm: CreateWikiPageInput = {
  title: "",
  navigation_group: "",
  template: "General",
  edit_role_id: "",
  publish_role_id: "",
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

  const [errorMessage, setErrorMessage] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const selectedNavigationGroup =
    navigationGroups.find(
      (group) =>
        group.id === form.navigation_group
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
  }, [
    form.title,
    selectedNavigationGroup,
  ]);

  function updateForm<
    K extends keyof CreateWikiPageInput,
  >(
    field: K,
    value: CreateWikiPageInput[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrorMessage("");
  }

  function resetDialog() {
    setForm(initialForm);
    setErrorMessage("");
    setIsSubmitting(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isSubmitting) {
      return;
    }

    setOpen(nextOpen);

    if (!nextOpen) {
      resetDialog();
    }
  }

  async function handleCreate() {
    const title = form.title.trim();

    if (!title) {
      setErrorMessage(
        "A page name is required."
      );
      return;
    }

    if (!/^[A-Z]/.test(title)) {
      setErrorMessage(
        "The page name must begin with a capital letter."
      );
      return;
    }

    if (!form.navigation_group) {
      setErrorMessage(
        "Select a navigation group."
      );
      return;
    }

    if (!form.edit_role_id) {
      setErrorMessage(
        "Select an edit role."
      );
      return;
    }

    if (!form.publish_role_id) {
      setErrorMessage(
        "Select a publish role."
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      /*
       * DATABASE CONNECTION:
       * WikiDashboard passes its create-page handler here.
       */
      await onCreate({
        ...form,
        title,
      });

      resetDialog();
      setOpen(false);
    } catch (error) {
      console.error(
        "Create page failed:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The page could not be created."
      );

      setIsSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger
        render={
          <Button disabled={isSubmitting} />
        }
      >
        <Plus className="mr-2 size-4" />
        Create Page
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Create wiki page
          </DialogTitle>

          <DialogDescription>
            Create a new draft page. Its path is
            generated from the navigation group and
            page name.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-2">
          <div className="grid gap-2">
            <Label htmlFor="page-title">
              Page name
            </Label>

            <Input
              id="page-title"
              value={form.title}
              placeholder="Character Creation"
              disabled={isSubmitting}
              onChange={(event) =>
                updateForm(
                  "title",
                  event.target.value
                )
              }
            />

            <p className="text-xs text-muted-foreground">
              The first character must be
              capitalized.
            </p>
          </div>

          <FormSelect
            label="Navigation group"
            value={form.navigation_group}
            placeholder="Select navigation group"
            disabled={isSubmitting}
            options={navigationGroups.map(
              (group) => ({
                value: group.id,
                label: group.name,
              })
            )}
            onChange={(value) =>
              updateForm(
                "navigation_group",
                value
              )
            }
          />

          <FormSelect
            label="Template"
            value={form.template}
            placeholder="Select page template"
            disabled={isSubmitting}
            options={templates.map(
              (template) => ({
                value: template,
                label: template,
              })
            )}
            onChange={(value) =>
              updateForm(
                "template",
                value as WikiTemplate
              )
            }
          />

          <FormSelect
            label="Edit role"
            value={form.edit_role_id}
            placeholder="Select edit role"
            disabled={isSubmitting}
            options={roles.map((role) => ({
              value: role.id,
              label: role.name,
            }))}
            onChange={(value) =>
              updateForm(
                "edit_role_id",
                value
              )
            }
          />

          <FormSelect
            label="Publish role"
            value={form.publish_role_id}
            placeholder="Select publish role"
            disabled={isSubmitting}
            options={roles.map((role) => ({
              value: role.id,
              label: role.name,
            }))}
            onChange={(value) =>
              updateForm(
                "publish_role_id",
                value
              )
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
            <p
              role="alert"
              className="text-sm text-destructive"
            >
              {errorMessage}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() =>
              handleOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={isSubmitting}
            onClick={handleCreate}
          >
            {isSubmitting
              ? "Creating..."
              : "Create Page"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type FormSelectOption = {
  value: string;
  label: string;
};

type FormSelectProps = {
  label: string;
  value: string;
  placeholder: string;
  options: FormSelectOption[];
  disabled?: boolean;
  onChange: (value: string) => void;
};

function FormSelect({
  label,
  value,
  placeholder,
  options,
  disabled = false,
  onChange,
}: FormSelectProps) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>

      <Select
        items={options}
        value={value || null}
        disabled={disabled}
        onValueChange={(newValue) => {
          if (newValue !== null) {
            onChange(newValue);
          }
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={placeholder}
          />
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