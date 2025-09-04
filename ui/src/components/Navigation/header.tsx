import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TabData } from "@/layouts/MainLayout";
import Profile from "./components/Profile";
import HeaderFreeAccountWarning from "./components/HeaderFreeAccountWarning";

interface MainNavProps {
    tabsData: TabData[];
    className?: string;
}

export default function MainNav({
    tabsData,
    className,
    ...props
}: MainNavProps) {
    const pathname = usePathname();

    return (
        <div className="border-b bg-primary text-primary-foreground fixed top-0 left-0 right-0">
            <div className="flex h-16 items-center px-3">
                <div className="flex items-center">
                    <Avatar className="mr-2 h-8 w-8 ">
                        <AvatarImage src="/img/_favico.ico" />
                        <AvatarFallback>CX</AvatarFallback>
                    </Avatar>
                </div>

                <nav
                    className={cn("flex items-center gap-7", className)}
                    {...props}
                >
                    {tabsData.map((tab: TabData, tabIndex: number) => (
                        <Link
                            aria-label={`go to ${tab.label}`}
                            key={tabIndex}
                            href={tab.path}
                            className={`text-sm font-medium flex items-center space-x-2 ${
                                pathname.includes(tab.path)
                                    ? ""
                                    : "text-muted-foreground"
                            } transition-colors hover:text-primary-foreground`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="ml-auto flex items-center space-x-4">
                    <HeaderFreeAccountWarning />
                    <Profile />
                </div>
            </div>
        </div>
    );
}
