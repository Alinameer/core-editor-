import { HexColorPicker } from "react-colorful";

import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "../../../../components/Button";

type Props = {
  disabled?: boolean;
  icon?: React.ReactNode;
  label?: string;
  title?: string;
  stopCloseOnClickSelf?: boolean;
  color: string;
  onChange?: (color: string, skipHistoryStack: boolean) => void;
};

export default function ColorPicker({
  disabled = false,
  stopCloseOnClickSelf = true,
  color,
  onChange,
  icon,
  label,
  ...rest
}: Props) {
  return (
    <Popover modal={true}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          size={"M"}
          variant={"BlueContStyle"}
          className="h-8 w-8"
          {...rest}
        >
          <span>{icon}</span>
          {/* <ChevronDownIcon className='size-4'/> */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <HexColorPicker
          color={color}
          onChange={(color) => onChange?.(color, false)}
        />
        <Input
          maxLength={7}
          onChange={(e) => {
            e.stopPropagation();
            onChange?.(e?.currentTarget?.value, false);
          }}
          value={color}
        />
      </PopoverContent>
    </Popover>
  );
}
