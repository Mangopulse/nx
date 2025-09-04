import Label from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";

export interface IColorPicker {
    label: string;
    value: any;
    onChange: (value: string) => void;
    className?: string;
}

const ColorPicker = ({ label, value, onChange, className }: IColorPicker) => {
    return (
        <div className={"flex flex-col items gap-2" + " " + className ?? ""}>
            {label && <Label>{label}</Label>}
            <div className="flex items-center gap-2">
                <Popover>
                    <PopoverTrigger>
                        <div
                            className={`w-7 h-7 shadow rounded border`}
                            style={{ background: value }}
                        ></div>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit flex flex-col items-center gap-3">
                        <HexColorPicker color={value} onChange={onChange} />
                        <HexColorInput
                            color={value}
                            onChange={onChange}
                            className="border rounded p-1 w-[7.5ch] text-center"
                        />
                    </PopoverContent>
                </Popover>
                <HexColorInput
                    color={value}
                    onChange={onChange}
                    className="border rounded p-1 w-[7.5ch] text-center"
                />
            </div>
        </div>
    );
};

export default ColorPicker;
