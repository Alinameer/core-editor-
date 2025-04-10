import { useState } from "react";

import { $isTableSelection } from "@lexical/table";
import {
  $isRangeSelection,
  BaseSelection,
  FORMAT_TEXT_COMMAND,
  TextFormatType,
} from "lexical";

import { useToolbarContext } from "@/components/editor/context/toolbar-context";
import { useUpdateToolbarHandler } from "@/components/editor/editor-hooks/use-update-toolbar";

import { Button } from "../../../../../components/Button";
const iconClasses: Partial<Record<TextFormatType, string>> = {
  bold: "ri-bold",
  italic: "ri-italic",
  underline: "ri-underline",
  strikethrough: "ri-strikethrough",
  code: "ri-code-s-slash-line",
} as const;

export function FontFormatToolbarPlugin({
  format,
}: {
  format: Omit<TextFormatType, "highlight" | "subscript" | "superscript">;
}) {
  const { activeEditor } = useToolbarContext();
  // @ts-ignore
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      // @ts-ignore
      setIsSelected(selection.hasFormat(format as TextFormatType));
    }
  };

  useUpdateToolbarHandler($updateToolbar);

  const iconClass = iconClasses[format as TextFormatType];

  return (
    <Button
      aria-label={`Button ${format}`}
      variant={"BlueContStyle"}
      size={"M"}
      onClick={() => {
        activeEditor.dispatchCommand(
          FORMAT_TEXT_COMMAND,
          format as TextFormatType
        );
      }}
    >
      <i className={`${iconClass} `}></i>
    </Button>
  );
}
