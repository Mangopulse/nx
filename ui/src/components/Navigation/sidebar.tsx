"use client";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { TabData } from "@/layouts/MainLayout";
import IconButton from "../form/IconButton";

interface MainNavProps {
    tabsData: TabData[];
    className?: string;
    foundTab?: TabData;
}
export function getFirstStringBetweenSlashes(
    inputString: string
): string | null {
    const match = inputString.match(/\/([^/]+)\//);
    if (match && match[1]) {
        return match[1];
    }
    return null; // Return null if no match is found
}
export function findTabByLabel(labelToFind: string, tabsData: TabData[]) {
    return tabsData.find((tab) => tab.path === labelToFind);
}
export default function Sidebar({
    tabsData,
    className,
    foundTab,
}: MainNavProps) {
    const pathname = usePathname();
    if (!foundTab) return "";
    return (
        <div className="h-full w-56 border-r fixed top-0 left-0 margin-top-header bg-secondary">
            <div
                className={cn(
                    "p-3 pl-6 h-full flex flex-col justify-between",
                    className
                )}
            >
                <div className="space-y-2">
                    {foundTab.sidebarItems
                        .filter((item) => item.group !== "bottom")
                        .map((item: any, itemIndex: number) => {
                            if (!item.path && item.action) {
    return (
                                    <button
                                        aria-label={`logout`}
                                        key={itemIndex}
                                        onClick={item.action}
                                        className={cn(
                                            "flex items-center space-x-2 py-2 text-md text-primary/40 hover:text-primary w-full"
                                        )}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </button>
                                );
                            }
                            const isActive =
                                pathname.slice(3) === foundTab.path + item.path;

                            return (
                                <Link
                                    aria-label={`go to ${item.label}`}
                                    key={itemIndex}
                                    href={foundTab.path + item.path}
                                    className={cn(
                                        "flex items-center space-x-2 py-2 text-md text-primary/40 hover:text-primary w-full",
                                        isActive &&
                                            "text-primary/90 font-medium"
                                    )}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                </div>
                <div className="mb-24 space-y-2">
                    {foundTab.sidebarItems
                        .filter((item) => item.group === "bottom")
                        .map((item: any, itemIndex: number) => {
                            if (!item.path && item.action) {
                                return (
                                    <button
                                        aria-label={`logout`}
                                        key={itemIndex}
                                        onClick={item.action}
                                        className={cn(
                                            "flex items-center space-x-2 py-2 text-md text-primary/40 hover:text-primary w-full"
                                        )}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </button>
                                );
                            }
                            const isActive =
                                pathname === foundTab.path + item.path;
                            return (
                                <Link
                                    aria-label={`go to ${item.label}`}
                                    key={itemIndex}
                                    href={foundTab.path + item.path}
                                    className={cn(
                                        "flex items-center space-x-2 py-2 text-md text-primary/40 hover:text-primary w-full",
                                        isActive &&
                                            "text-primary/90 font-medium"
                                    )}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
