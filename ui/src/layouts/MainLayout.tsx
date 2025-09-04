"use client";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import MainNav from "../components/Navigation/header";
import Sidebar, {
    findTabByLabel,
    getFirstStringBetweenSlashes,
} from "../components/Navigation/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import AuthLayout from "./AuthLayout";
import {
    BarChart2Icon,
    FolderKanbanIcon,
    LayoutTemplateIcon,
    LogOutIcon,
    MailsIcon,
    SettingsIcon,
    UsersIcon,
} from "lucide-react";
import { deleteCookie } from "cookies-next";
import { USER_COOKIE } from "@/constants";

interface MainLayoutProps {
    children: ReactNode;
    pad?: boolean;
}

export interface TabItem {
    label: string;
    path?: string;
    action?: Function;
    group?: "top" | "bottom";
    icon?: ReactElement<any, any>;
}

export interface TabData {
    label: string;
    path: string;
    icon: ReactElement<any, any>;
    sidebarItems: TabItem[];
}



export default function MainLayout({ children, pad = true }: MainLayoutProps) {


    const router = useRouter()

    const tabs: TabData[] = [
        {
            label: "Manage",
            path: "/manage",
            icon: <FolderKanbanIcon size={17} />,
            sidebarItems: [
                {
                    label: "Newsletter",
                    path: "/newsletter",
                    icon: <MailsIcon size={17} />,
                },
                {
                    label: "Collector",
                    path: "/collector",
                    icon: <LayoutTemplateIcon size={17} />,
                },
                {
                    label: "Subscribers",
                    path: "/subscribers",
                    icon: <UsersIcon size={17} />,
                },
                {
                    label: "Settings",
                    path: "/settings",
                    icon: <SettingsIcon size={17} />,
                    group: "bottom",
                },
                {
                    label: "Logout",
                    action: () => {
                        router.push("/login");
                        deleteCookie(USER_COOKIE);
                    },
                    icon: <LogOutIcon size={17} />,
                    group: "bottom",
                },
            ],
        },
        {
            label: "Analytics",
            path: "/analytics/overview",
            icon: <BarChart2Icon size={17} />,
            sidebarItems: [
                { label: "Overview", path: "/overview" },
                { label: "Reach", path: "/reach" },
                { label: "Subscribers", path: "/subscribers" },
            ],
        },
    ];

    
    const pathname = usePathname();
    const foundTab = findTabByLabel(
        "/" + getFirstStringBetweenSlashes(pathname.slice(2) + "/"),
        tabs
    );

    return (
        <AuthLayout>
            <MainNav tabsData={tabs} className="mx-6" />
            <Sidebar tabsData={tabs} foundTab={foundTab} />
            <div
                className={cn(
                    "overflow-auto nx-scrollbar margin-top-header h-screen-with-header",
                    foundTab && "margin-left-sidebar",
                    pad && "p-3 pb-0"
                )}
            >
                {children}
            </div>
        </AuthLayout>
    );
}
