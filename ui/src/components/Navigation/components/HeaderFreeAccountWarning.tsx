import IconButton from "@/components/form/IconButton";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import useWebsiteConfig from "@/hooks/queries/useWebsiteConfig";
import { AlertTriangleIcon, ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";

export default function HeaderFreeAccountWarning() {
    const [popoverOpen, setPopoverOpen] = React.useState(false);
    const { isLoading, config } = useWebsiteConfig();
    if (isLoading || config.website.includes("almayadeen") || (config?.senderType && config?.senderType !== "cx_sendgrid_default")) return "";
    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger className="text-sm font-semibold bg-destructive/80 text-secondary py-1 px-3 rounded flex items-center gap-2">
                <AlertTriangleIcon size={15} />
                <span>Free limited sender</span>
                <ChevronDownIcon size={15} />
            </PopoverTrigger>
            <PopoverContent
                collisionPadding={30}
                className="max-w-xs border bg-white text-primary/80 text-md p-3"
            >
                <p className="mb-0">
                    The sender on this free account has a limit of sending only{" "}
                    <span className="font-semibold">10</span> emails per day.
                </p>
                <Link
                    href="/manage/settings"
                    onClick={() => setPopoverOpen(false)}
                >
                    <IconButton variant={"link"} className="p-0">
                        Change in settings
                    </IconButton>
                </Link>
            </PopoverContent>
        </Popover>
    );
}
