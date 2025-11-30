"use client";

import { SerializedEditorState } from "lexical";
import { useState } from "react";

import { Editor } from "@/components/blocks/editor-00/editor";
import { Button } from "@/components/ui/button";

export const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "Hello World 🚀",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState;

export default function EditorPage() {
  const [editorState, setEditorState] =
    useState<SerializedEditorState>(initialValue);

  const [currHtml, setCurrHtml] = useState("");

  return (
    <main className="max-w-xl mx-auto p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log({ html: currHtml });
        }}
      >
        <Editor
          htmlSetter={setCurrHtml}
          editorSerializedState={editorState}
          onSerializedChange={(value) => setEditorState(value)}
        />
        <Button type="submit">Submit</Button>
      </form>
      <div
        className="list-disc"
        dangerouslySetInnerHTML={{ __html: currHtml }}
      />
    </main>
  );
}
