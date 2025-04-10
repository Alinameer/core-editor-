import { useState } from "react";

import { $isLinkNode } from "@lexical/link";
import { $findMatchingParent } from "@lexical/utils";
import {
  $isElementNode,
  $isRangeSelection,
  BaseSelection,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
} from "lexical";

import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { useToolbarContext } from "@/components/editor/context/toolbar-context";
import { useUpdateToolbarHandler } from "@/components/editor/editor-hooks/use-update-toolbar";
import { getSelectedNode } from "@/components/editor/utils/get-selected-node";

const ELEMENT_FORMAT_OPTIONS: {
  [key in Exclude<ElementFormatType, "start" | "end" | "">]: {
    icon: React.ReactNode;
    iconRTL: string;
    name: string;
  };
} = {
  left: {
    icon: <i className="ri-align-left"></i>,
    iconRTL: "left-align",
    name: "Left Align",
  },
  center: {
    icon: <i className="ri-align-center"></i>,
    iconRTL: "center-align",
    name: "Center Align",
  },
  right: {
    icon: <i className="ri-align-right"></i>,
    iconRTL: "right-align",
    name: "Right Align",
  },
  justify: {
    icon: <i className="ri-align-justify"></i>,
    iconRTL: "justify-align",
    name: "Justify Align",
  },
} as const;

export function ElementFormatToolbarPlugin() {
  const { activeEditor } = useToolbarContext();
  const [elementFormat, setElementFormat] = useState<ElementFormatType>("left");

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();

      let matchingParent;
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline()
        );
      }
      setElementFormat(
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
          ? node.getFormatType()
          : parent?.getFormatType() || "left"
      );
    }
  };

  useUpdateToolbarHandler($updateToolbar);

  const handleValueChange = (value: string) => {
    if (!value) return; // Prevent unselecting current value

    setElementFormat(value as ElementFormatType);

    if (value === "indent") {
      activeEditor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
    } else if (value === "outdent") {
      activeEditor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
    } else {
      activeEditor.dispatchCommand(
        FORMAT_ELEMENT_COMMAND,
        value as ElementFormatType
      );
    }
  };

  return (
    <ToggleGroup
      type="single"
      value={elementFormat}
      defaultValue={elementFormat}
      onValueChange={handleValueChange}
      className="flex gap-1"
    >
      {/* Alignment toggles */}
      {Object.entries(ELEMENT_FORMAT_OPTIONS).map(([value, option]) => (
        <ToggleGroupItem
          key={value}
          value={value}
          variant={"default"}
          aria-label={option.name}
          size="sm"
          className="h-8 w-8 p-0"
        >
          {option.icon}
        </ToggleGroupItem>
      ))}

      <Separator orientation="vertical" className="h-8" />
      {/* Indentation toggles */}
      <ToggleGroupItem
        value="outdent"
        aria-label="Outdent"
        variant={"default"}
        size="sm"
        className="h-8 w-8"
      >
        <i className="ri-indent-decrease"></i>
      </ToggleGroupItem>

      <ToggleGroupItem
        value="indent"
        variant={"default"}
        aria-label="Indent"
        size="sm"
        className="h-8 w-8"
      >
        <i className="ri-indent-increase"></i>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
