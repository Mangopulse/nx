import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import * as React from "react";

export default function ActionBarSkeleton() {
    return (
        <div className="p-2 flex items-center space-x-2 justify-between border-b bg-white relative">
            <Link
            aria-label={`go to back to newsletter management`}
                className="flex gap-2 items-center"
                href={"/manage/newsletter"}
            >
                <ArrowLeft opacity={0.7} size={18} />
                <img src="/img/nx-dark.png" alt="NX" width={40} />
            </Link>
            <Skeleton className="w-44 h-9 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="flex items-center space-x-2 justify-end">
                <Skeleton className="w-24 h-9" />
                <Skeleton className="w-24 h-9" />
                <Skeleton className="w-24 h-9" />
                <Skeleton className="w-24 h-9" />
            </div>
        </div>
    );
}
