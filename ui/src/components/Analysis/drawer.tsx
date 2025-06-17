
import { ReactComponentElement } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";
import { InfoIcon } from "lucide-react";


interface TriggerProps {
    // Define the props for your trigger button component here
    onClick: () => void;
  }
interface MyComponentProps {
    title?: string;
    description?: string;
    tooltip?: string;
    trigger?:React.ReactNode ;
    children?: React.ReactNode; // Assuming you're working with React
    width?: string;
    // Any other props you want to accept
    [key: string]: any;
  }
  
export function Drawer({
    title,
    description,
    tooltip,
    trigger,
    children,
    width,
    ...props
} :MyComponentProps) {
    return (
        <Sheet {...props}>
            {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
            <SheetContent style={{minWidth: width}} className="overflow-y-auto nx-scrollbar">
                <SheetHeader className={'mb-8'}>
                    {title && (
                        <SheetTitle className="flex gap-2 items-center">
                            <span className="opacity-8">{title}</span>
                            {tooltip && (
                                    <Tooltip>
                                        <TooltipTrigger className="flex gap-2 items-center">
                                            <div className="grid items-center justify-center w-4 aspect-square border border-input rounded-full opacity-3">
                                            <InfoIcon size={15} strokeWidth={"1"}/>

                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            side="right"
                                            className="max-w-[200px] font-normal"
                                        >
                                            {tooltip}
                                        </TooltipContent>
                                    </Tooltip>
                            )}
                        </SheetTitle>
                    )}
                    {description && (
                        <SheetDescription className="!mt-0 max-w-[80ch]">{description}</SheetDescription>
                    )}
                </SheetHeader>

                {children}
            </SheetContent>
        </Sheet>
    );
}