import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $generateHtmlFromNodes } from "@lexical/html";
import { EditorState, SerializedEditorState } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import r2wc from "@r2wc/react-to-web-component";

import { FloatingLinkContext } from "@/components/editor/context/floating-link-context";
import { SharedAutocompleteContext } from "@/components/editor/context/shared-autocomplete-context";
import { editorTheme } from "@/components/editor/themes/editor-theme";
import { TooltipProvider } from "@/components/ui/tooltip";

import { nodes } from "./nodes";
import { Plugins } from "./plugins";

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error(error);
  },
};

function Editor({
  editorState,
  editorSerializedState,
  onChange,
  onSerializedChange,
  onHtmlChange,
}: {
  editorState?: EditorState;
  editorSerializedState?: SerializedEditorState;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
  onHtmlChange?: (html: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-background shadow">
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
          <SharedAutocompleteContext>
            <FloatingLinkContext>
              <Plugins />
              {onHtmlChange ? (
                <HtmlChangePlugin onChange={onHtmlChange} />
              ) : null}
              <OnChangePlugin
                ignoreSelectionChange={true}
                onChange={(editorState) => {
                  onChange?.(editorState);
                  onSerializedChange?.(editorState.toJSON());
                }}
              />
            </FloatingLinkContext>
          </SharedAutocompleteContext>
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}

function HtmlChangePlugin({ onChange }: { onChange: (html: string) => void }) {
  const [editor] = useLexicalComposerContext();

  editor.registerUpdateListener(() => {
    editor.update(() => {
      const html = $generateHtmlFromNodes(editor);
      onChange(html);
    });
  });

  return null;
}

// Create web component from React component
const EditorWebComponent = r2wc(Editor, {
  props: {
    editorState: "json",
    editorSerializedState: "json",
    onChange: "function",
    onSerializedChange: "function",
    onHtmlChange: "function",
  },
});

// Register the web component
customElements.define("react-editor", EditorWebComponent);

// Export both the React component and the web component
export { Editor, EditorWebComponent };
