import localImageLoader from "@/lib/utils";
import Image from "next/image";
import * as React from "react";

export default function ConfirmationFailure() {
    return (
        <div className="flex flex-col mt-36 space-y-20 items-center h-screen">
            <div className="w-64 relative aspect-square">
                <Image
                    loader={localImageLoader}
                    src="warning-sign.png"
                    fill
                    alt="warning"
                />
            </div>
            <p className="text-xl">
                Something went wrong with your confirmation. Please try again or
                contact us.
            </p>
        </div>
    );
}
