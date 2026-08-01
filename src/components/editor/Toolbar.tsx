"use client";

import type { Editor } from "@tiptap/react";

type ToolbarProps = {
  editor: Editor;
};

type ToolbarButtonProps = {
  label: string;
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

function ToolbarButton({
  label,
  title,
  active = false,
  disabled = false,
  onClick,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      className={`toolbar-button ${
        active ? "is-active" : ""
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default function Toolbar({
  editor,
}: ToolbarProps) {
  const isInTable = editor.isActive("table");

  function setLink() {
    const previousUrl = editor.getAttributes(
      "link"
    ).href as string | undefined;

    const url = window.prompt(
      "Enter a link URL:",
      previousUrl ?? "https://"
    );

    if (url === null) {
      return;
    }

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      editor
        .chain()
        .focus()
        .unsetLink()
        .run();

      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: trimmedUrl,
      })
      .run();
  }

  function addImage() {
    const url = window.prompt(
      "Enter an image URL:"
    );

    if (!url?.trim()) {
      return;
    }

    editor
      .chain()
      .focus()
      .setImage({
        src: url.trim(),
      })
      .run();
  }

  return (
    <div className="editor-toolbar">
      <div className="toolbar-group">
        <ToolbarButton
          label="P"
          title="Paragraph"
          active={editor.isActive(
            "paragraph"
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .setParagraph()
              .run()
          }
        />

        <ToolbarButton
          label="H1"
          title="Heading 1"
          active={editor.isActive(
            "heading",
            {
              level: 1,
            }
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 1,
              })
              .run()
          }
        />

        <ToolbarButton
          label="H2"
          title="Heading 2"
          active={editor.isActive(
            "heading",
            {
              level: 2,
            }
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 2,
              })
              .run()
          }
        />

        <ToolbarButton
          label="H3"
          title="Heading 3"
          active={editor.isActive(
            "heading",
            {
              level: 3,
            }
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 3,
              })
              .run()
          }
        />
      </div>

      <div className="toolbar-group">
        <ToolbarButton
          label="B"
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
        />

        <ToolbarButton
          label="I"
          title="Italic"
          active={editor.isActive(
            "italic"
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
        />

        <ToolbarButton
          label="U"
          title="Underline"
          active={editor.isActive(
            "underline"
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleUnderline()
              .run()
          }
        />

        <ToolbarButton
          label="S"
          title="Strikethrough"
          active={editor.isActive(
            "strike"
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleStrike()
              .run()
          }
        />

        <ToolbarButton
          label="Mark"
          title="Highlight"
          active={editor.isActive(
            "highlight"
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHighlight()
              .run()
          }
        />
      </div>

      <div className="toolbar-group">
        <ToolbarButton
          label="• List"
          title="Bullet list"
          active={editor.isActive(
            "bulletList"
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
        />

        <ToolbarButton
          label="1. List"
          title="Numbered list"
          active={editor.isActive(
            "orderedList"
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          }
        />

        <ToolbarButton
          label="Quote"
          title="Blockquote"
          active={editor.isActive(
            "blockquote"
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBlockquote()
              .run()
          }
        />

        <ToolbarButton
          label="Code"
          title="Code block"
          active={editor.isActive(
            "codeBlock"
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleCodeBlock()
              .run()
          }
        />
      </div>

      <div className="toolbar-group">
        <ToolbarButton
          label="Left"
          title="Align left"
          active={editor.isActive({
            textAlign: "left",
          })}
          onClick={() =>
            editor
              .chain()
              .focus()
              .setTextAlign("left")
              .run()
          }
        />

        <ToolbarButton
          label="Center"
          title="Align center"
          active={editor.isActive({
            textAlign: "center",
          })}
          onClick={() =>
            editor
              .chain()
              .focus()
              .setTextAlign("center")
              .run()
          }
        />

        <ToolbarButton
          label="Right"
          title="Align right"
          active={editor.isActive({
            textAlign: "right",
          })}
          onClick={() =>
            editor
              .chain()
              .focus()
              .setTextAlign("right")
              .run()
          }
        />

        <ToolbarButton
          label="Justify"
          title="Justify"
          active={editor.isActive({
            textAlign: "justify",
          })}
          onClick={() =>
            editor
              .chain()
              .focus()
              .setTextAlign("justify")
              .run()
          }
        />
      </div>

      <div className="toolbar-group">
        <ToolbarButton
          label="Link"
          title="Add or edit link"
          active={editor.isActive("link")}
          onClick={setLink}
        />

        <ToolbarButton
          label="Unlink"
          title="Remove link"
          disabled={
            !editor.isActive("link")
          }
          onClick={() =>
            editor
              .chain()
              .focus()
              .unsetLink()
              .run()
          }
        />

        <ToolbarButton
          label="Image"
          title="Insert image from URL"
          onClick={addImage}
        />

        <ToolbarButton
          label="Rule"
          title="Horizontal rule"
          onClick={() =>
            editor
              .chain()
              .focus()
              .setHorizontalRule()
              .run()
          }
        />
      </div>

      <div className="toolbar-group">
        <ToolbarButton
          label="Table"
          title="Insert table"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({
                rows: 3,
                cols: 3,
                withHeaderRow: true,
              })
              .run()
          }
        />

        {isInTable && (
          <>
            <ToolbarButton
              label="+ Row"
              title="Add row below"
              disabled={
                !editor
                  .can()
                  .chain()
                  .focus()
                  .addRowAfter()
                  .run()
              }
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .addRowAfter()
                  .run()
              }
            />

            <ToolbarButton
              label="- Row"
              title="Delete current row"
              disabled={
                !editor
                  .can()
                  .chain()
                  .focus()
                  .deleteRow()
                  .run()
              }
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .deleteRow()
                  .run()
              }
            />

            <ToolbarButton
              label="+ Column"
              title="Add column after"
              disabled={
                !editor
                  .can()
                  .chain()
                  .focus()
                  .addColumnAfter()
                  .run()
              }
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .addColumnAfter()
                  .run()
              }
            />

            <ToolbarButton
              label="- Column"
              title="Delete current column"
              disabled={
                !editor
                  .can()
                  .chain()
                  .focus()
                  .deleteColumn()
                  .run()
              }
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .deleteColumn()
                  .run()
              }
            />

            <ToolbarButton
              label="Header"
              title="Toggle header row"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHeaderRow()
                  .run()
              }
            />

            <ToolbarButton
              label="Merge"
              title="Merge or split selected cells"
              disabled={
                !editor
                  .can()
                  .chain()
                  .focus()
                  .mergeOrSplit()
                  .run()
              }
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .mergeOrSplit()
                  .run()
              }
            />

            <ToolbarButton
              label="Delete Table"
              title="Delete table"
              disabled={
                !editor
                  .can()
                  .chain()
                  .focus()
                  .deleteTable()
                  .run()
              }
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .deleteTable()
                  .run()
              }
            />
          </>
        )}
      </div>

      <div className="toolbar-group">
        <ToolbarButton
          label="Undo"
          title="Undo"
          disabled={
            !editor
              .can()
              .chain()
              .focus()
              .undo()
              .run()
          }
          onClick={() =>
            editor
              .chain()
              .focus()
              .undo()
              .run()
          }
        />

        <ToolbarButton
          label="Redo"
          title="Redo"
          disabled={
            !editor
              .can()
              .chain()
              .focus()
              .redo()
              .run()
          }
          onClick={() =>
            editor
              .chain()
              .focus()
              .redo()
              .run()
          }
        />
      </div>
    </div>
  );
}