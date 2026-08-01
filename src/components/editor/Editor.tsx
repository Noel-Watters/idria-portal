"use client";
import { useEffect } from "react";
import { EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { TableKit } from "@tiptap/extension-table";

import Toolbar from "./Toolbar";
import "./Editor.css";

type PageEditorProps = {
  content: Record<string, unknown>;
  onChange: (
    content: Record<string, unknown>
  ) => void;
};

function isValidContent(
  content: Record<string, unknown>
) {
  return (
    content &&
    content.type === "doc"
  );
}

function getSafeContent(
  content: Record<string, unknown>
) {
  if (isValidContent(content)) {
    return content;
  }

  return {
    type: "doc",
    content: [],
  };
}

export default function Editor({
  content,
  onChange,
}: PageEditorProps) {

  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit.configure({
        link: false,
        underline: false,
      }),

       TableKit.configure({
        table: {
          resizable: true,
          HTMLAttributes: {
            class: "wiki-table",
          },
        },
      }),

      Underline,

      Highlight.configure({
        multicolor: false,
      }),

      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),

      Image.configure({
        allowBase64: false,
        HTMLAttributes: {
          class: "editor-image",
        },
      }),

      Placeholder.configure({
        placeholder: "Begin writing...",
      }),

      TextAlign.configure({
        types: [
          "heading",
          "paragraph",
        ],
      }),



    ],

    content: getSafeContent(content),

    editorProps: {
      attributes: {
        class: "tiptap-editor",
      },
    },

    onUpdate({ editor }) {
      onChange(editor.getJSON());
    },
  });


  useEffect(() => {
    if (!editor) {
      return;
    }

    const safeContent = getSafeContent(content);

    const currentContent = editor.getJSON();

    if (
      JSON.stringify(currentContent) !==
      JSON.stringify(safeContent)
    ) {
      editor.commands.setContent(
        safeContent
      );
    }

  }, [content, editor]);


  if (!editor) {
    return (
      <div className="editor-loading">
        Loading editor...
      </div>
    );
  }


  return (
    <div className="editor-shell">
      <Toolbar editor={editor} />

      <EditorContent editor={editor} />

      <section className="editor-debug">
        <h2>
          Saved content preview
        </h2>

        <pre>
          {JSON.stringify(
            content,
            null,
            2
          )}
        </pre>
      </section>
    </div>
  );
}