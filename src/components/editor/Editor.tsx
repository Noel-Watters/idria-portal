"use client";

import { useState } from "react";
import {
  EditorContent,
  type JSONContent,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";

import Toolbar from "./Toolbar";
import "./Editor.css";

const initialContent: JSONContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: {
        level: 1,
      },
      content: [
        {
          type: "text",
          text: "Idria Server Rules",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Use this page to write and organize the server rules.",
        },
      ],
    },
  ],
};

export default function Editor() {
  const [content, setContent] = useState<JSONContent>(initialContent);

  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit,

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
        placeholder: "Begin writing the rules...",
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    content: initialContent,

    editorProps: {
      attributes: {
        class: "tiptap-editor",
      },
    },

    onUpdate({ editor }) {
      setContent(editor.getJSON());
    },
  });

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
        <h2>Saved content preview</h2>

        <pre>{JSON.stringify(content, null, 2)}</pre>
      </section>
    </div>
  );
}