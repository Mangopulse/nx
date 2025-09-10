import localImageLoader from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

export default function ConfirmationSuccess() {
    return (
        <div className="flex flex-col mt-36 space-y-20 items-center h-screen">
            <div className="w-64 h-64 relative aspect-square bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-32 h-32 relative">
                    <Image
                        loader={localImageLoader}
                        src="circle-tick.svg"
                        fill
                        alt="success"
                        className="filter-none"
                        style={{ filter: 'invert(0) sepia(1) saturate(5) hue-rotate(120deg) brightness(0.8)' }}
                    />
                </div>
            </div>
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-green-600">
                    Email Confirmed Successfully!
                </h1>
                <p className="text-xl">
                    Your email has been verified and your account is now active.
                </p>
                <Link 
                    href="/login" 
                    className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Go to Login
                </Link>
            </div>
        </div>
    );
}
