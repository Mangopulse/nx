import { CheckIcon } from "lucide-react";
import * as React from "react";

export default function Subscribe({ params }: any) {
    const email = decodeURIComponent(params.email).split("@")[0];
    const domain = decodeURIComponent(params.domain).slice(0, params.domain.lastIndexOf("."));

    return (
        <div className="h-screen w-screen overflow-hidden items-center gap-30 flex flex-col py-9 px-4 space-y-11">
            <span className="text-xl text-center">
                Hello <strong>{email}</strong>. Welcome to your personalized newsletter.
            </span>
            <div className="text-center rounded p-4 w-[min(700px,100%)] space-y-2 md:space-x-2 md:space-y-0 flex flex-col md:flex-row items-center bg-primary-800 text-primary-foreground shadow">
                <CheckIcon />
                <span>
                    You successfully unsubscribed from <strong>{domain}</strong>{" "}
                    personalized newsletter!
                </span>
            </div>
        </div>
    );
}
