"use client";

import { useCallback, useState } from "react";

import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection";
import { $getSelection, $isRangeSelection, BaseSelection } from "lexical";

import { Button } from "../../../../../components/Button";
import { Input } from "@/components/ui/input";

import { useToolbarContext } from "@/components/editor/context/toolbar-context";
import { useUpdateToolbarHandler } from "@/components/editor/editor-hooks/use-update-toolbar";

const DEFAULT_FONT_SIZE = 16;
const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 72;

export function FontSizeToolbarPlugin() {
  const style = "font-size";
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);

  const { activeEditor } = useToolbarContext();

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      const value = $getSelectionStyleValueForProperty(
        selection,
        "font-size",
        `${DEFAULT_FONT_SIZE}px`
      );
      setFontSize(parseInt(value) || DEFAULT_FONT_SIZE);
    }
  };

  useUpdateToolbarHandler($updateToolbar);

  const updateFontSize = useCallback(
    (newSize: number) => {
      const size = Math.min(Math.max(newSize, MIN_FONT_SIZE), MAX_FONT_SIZE);
      activeEditor.update(() => {
        const selection = $getSelection();
        if (selection !== null) {
          $patchStyleText(selection, {
            [style]: `${size}px`,
          });
        }
      });
      setFontSize(size);
    },
    [activeEditor, style]
  );

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-1">
        <Button
          variant={"BlueContStyle"}
          size={"M"}
          onClick={() => updateFontSize(fontSize - 1)}
          disabled={fontSize <= MIN_FONT_SIZE}
        >
          <i className="ri-subtract-line"></i>
        </Button>
        <Input
          value={fontSize}
          onChange={(e) =>
            updateFontSize(parseInt(e.target.value) || DEFAULT_FONT_SIZE)
          }
          className="h-8 w-12 text-center"
          min={MIN_FONT_SIZE}
          max={MAX_FONT_SIZE}
        />
        <Button
          variant={"BlueContStyle"}
          size={"M"}
          onClick={() => updateFontSize(fontSize + 1)}
          disabled={fontSize >= MAX_FONT_SIZE}
        >
          <i className="ri-add-fill"></i>
        </Button>
      </div>
    </div>
  );
}
