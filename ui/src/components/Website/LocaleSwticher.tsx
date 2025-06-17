"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { i18n, type Locale } from "../../../i18n-config";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { GlobeIcon, LanguagesIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

export default function LocaleSwitcher() {
    const pathName = usePathname();
    const redirectedPathName = (locale: Locale) => {
        if (!pathName) return "/";
        const segments = pathName.split("/");
        segments[1] = locale.value;
        return segments.join("/");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={"md:hover:bg-secondary/10 p-0 rounded md:p-2"}
            >
                <GlobeIcon size={17} className="text-white" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {i18n.locales.map((locale) => {
                    return (
                        <Link
                            href={redirectedPathName(locale)}
                            key={locale.value}
                        >
                            <DropdownMenuItem
                                className={
                                    locale.value == "ar"
                                        ? "justify-end text-md py-2"
                                        : "text-sm py-2"
                                }
                            >
                                {locale.label}
                            </DropdownMenuItem>
                        </Link>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
