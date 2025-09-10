import localImageLoader from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
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
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-red-600">
                    Email Confirmation Failed
                </h1>
                <p className="text-xl">
                    Something went wrong with your confirmation. The link may have expired or is invalid.
                </p>
                <p className="text-lg text-gray-600">
                    Please try signing up again or contact support if the problem persists.
                </p>
                <div className="flex gap-4 justify-center mt-6">
                    <Link 
                        href="/signup" 
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </Link>
                    <Link 
                        href="/login" 
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
