import { useRef, JSX } from "react";

import { DraggableBlockPlugin_EXPERIMENTAL } from "@lexical/react/LexicalDraggableBlockPlugin";
import { GripVerticalIcon, Plus } from "lucide-react";

const DRAGGABLE_BLOCK_MENU_CLASSNAME = "draggable-block-menu";

function isOnMenu(element: HTMLElement): boolean {
  return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
}

export function DraggableBlockPlugin({
  anchorElem,
}: {
  anchorElem: HTMLElement | null;
}): JSX.Element | null {
  const menuRef = useRef<HTMLDivElement>(null);
  const targetLineRef = useRef<HTMLDivElement>(null);

  if (!anchorElem) {
    return null;
  }

  const handleSlashClick = () => {
    // Get the active editor element
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement) {
      // Focus the element if it's not already focused
      activeElement.focus();

      // Insert a slash character at the current cursor position
      document.execCommand("insertText", false, "/");
    }
  };

  return (
    <DraggableBlockPlugin_EXPERIMENTAL
      anchorElem={anchorElem}
      menuRef={menuRef as React.RefObject<HTMLElement>}
      targetLineRef={targetLineRef as React.RefObject<HTMLElement>}
      menuComponent={
        <div
          ref={menuRef}
          className=" test draggable-block-menu absolute left-0 top-0 flex items-center cursor-grab rounded-sm px-[1px] py-0.5 opacity-0 will-change-transform active:cursor-grabbing"
        >
          <button
            onClick={handleSlashClick}
            className="ml-1 p-0.5 hover:bg-gray-200 rounded-sm"
            title="slash command"
          >
            <Plus className="size-4 opacity-30" />
          </button>
          <button className="p-0.5 hover:bg-gray-200 rounded-sm">
            <GripVerticalIcon className="size-4 opacity-30" />
          </button>
        </div>
      }
      targetLineComponent={
        <div
          ref={targetLineRef}
          className="pointer-events-none absolute left-0 top-0 h-1 bg-secondary-foreground opacity-0 will-change-transform"
        />
      }
      isOnMenu={isOnMenu}
    />
  );
}
