"use client";

import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState, LexicalEditor, SerializedEditorState } from "lexical";

import { editorTheme } from "@/components/editor/themes/editor-theme";
import { TooltipProvider } from "@/components/ui/tooltip";

import { nodes } from "./nodes";
import { Plugins } from "./plugins";
import { Ref, RefObject, Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

import { $generateHtmlFromNodes } from "@lexical/html";

export function Editor({
  editorState,
  editorSerializedState,
  onChange,
  onSerializedChange,
  htmlSetter,
  editorRef,
}: {
  htmlSetter: (s: string) => void;
  editorState?: EditorState;
  editorSerializedState?: SerializedEditorState;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
  editorRef: RefObject<LexicalEditor | null>;
}) {
  const editorConfig: InitialConfigType = {
    namespace: "Editor",
    theme: editorTheme,
    nodes,
    onError: (error: Error) => {
      console.error(error);
    },
  };
  return (
    <div className="bg-background overflow-hidden rounded-lg border shadow">
      <Suspense fallback={<Spinner />}>
        <LexicalComposer
          initialConfig={{
            ...editorConfig,
            ...(editorState ? { editorState } : {}),
            ...(editorSerializedState
              ? { editorState: JSON.stringify(editorSerializedState) }
              : {}),
          }}
        >
          <TooltipProvider>
            <Plugins />

            <OnChangePlugin
              ignoreSelectionChange={true}
              onChange={(editorState, editor) => {
                editorRef.current = editor;
                onChange?.(editorState);
                editorState.read(() => {
                  const xx = $generateHtmlFromNodes(editor);
                  htmlSetter(xx);
                });
                onSerializedChange?.(editorState.toJSON());
              }}
            />
          </TooltipProvider>
        </LexicalComposer>
      </Suspense>
    </div>
  );
}
