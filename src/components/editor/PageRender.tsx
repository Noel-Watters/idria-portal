import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";

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
  ]);

  return (
    <article
      className="prose prose-neutral max-w-none"
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}


