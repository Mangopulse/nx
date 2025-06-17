import localImageLoader from "@/lib/utils";
import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

export interface IGetStartedBannerProps {}

export default function GetStartedBanner(props: IGetStartedBannerProps) {
    return (
        <div className="w-full px-3 md:px-6 py-9 md:py-16 flex flex-col md:flex-row items-center justify-center md:justify-between space-y-6 md:space-y-0 relative bg-primary-600 rounded-lg overflow-hidden">
            <Image
                alt="decorative wave"
                src="bg-wave-purple.webp"
                className="inset-0 !m-0"
                loader={localImageLoader}
                fill
            />
            <div className="w-fit relative z-10 !m-0 flex flex-col items-center md:items-start space-y-2">
                <Link
                    aria-label={`go to home page`}
                    href={"/"}
                    className="relative h-5 w-40 block"
                >
                    <Image
                        loader={localImageLoader}
                        alt="logo"
                        className="!m-0"
                        src={"newsletterX-logo.webp"}
                        fill
                    />
                </Link>
                <span className="font-semibold !text-white/50 text-sm tracking-widest !mb-0">
                    Innovating Tommorow
                </span>
            </div>
            <Link
                aria-label="go to signup page"
                href={"/signup"}
                target="_blank"
                className="flex space-x-2 items-center justify-center decoration-transparent rounded border border-soft-gray/10 h-14 px-12 text-lg text-secondary bg-white/10 backdrop-blur-md md:backdrop-blur-sm whitespace-nowrap  hover:bg-white/20 transition-[background-color]"
            >
                <span>Get Started Now</span>
                <ExternalLinkIcon size="1em" />
            </Link>
        </div>
    );
}
