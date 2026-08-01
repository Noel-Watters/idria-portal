import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { TableKit } from "@tiptap/extension-table";

type PageRenderProps = {
  content: Record<string, unknown>;
};

export default function PageRender({
  content,
}: PageRenderProps) {
  if (
    !content ||
    Object.keys(content).length === 0
  ) {
    return (
      <p className="text-muted-foreground">
        This page has no content yet.
      </p>
    );
  }

  const html = generateHTML(content, [
    StarterKit,
    TableKit,
  ]);

  return (
    <article
      className="prose  
      max-w-none
      prose-p:text-foreground
      prose-li:text-foreground
      prose-strong:text-foreground
      prose-headings:text-primary
      prose-a:text-primary
      hover:prose-a:text-primary/80
      "
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}


