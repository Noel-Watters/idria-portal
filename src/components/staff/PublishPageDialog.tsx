"use client";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import type { page, page_dashboard } from "@/types/wiki";

type PublishPageDialogProps = {
  page: page_dashboard | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublish: () => void;
};

export default function PublishPageDialog({
  page,
  open,
  onOpenChange,
  onPublish,
}: PublishPageDialogProps) {
  if (!page) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4 pr-8">
            <div>
              <DialogTitle>Publish page</DialogTitle>

              <DialogDescription>
                Review the page information before making it
                publicly available.
              </DialogDescription>
            </div>

              <a
                href={`/${page.path}`}
                target="_blank"
                rel="noreferrer"
              >
                Open page
                <ExternalLink className="ml-2 size-4" />
              </a>
          </div>
        </DialogHeader>

        <dl className="grid gap-4 rounded-lg border bg-muted/30 p-4 sm:grid-cols-2">
          <ReviewField label="Title" value={page.title} />

          <ReviewField
            label="Path"
            value={`/${page.path}`}
          />

          
        </dl>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button type="button" onClick={onPublish}>
            Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReviewField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>

      <dd className="mt-1 warp-break-words text-sm">
        {value}
      </dd>
    </div>
  );
}