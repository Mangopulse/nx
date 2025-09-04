import * as React from "react";
import Chip from "./General/Chip";
import localImageLoader, { cn } from "@/lib/utils";
import Image from "next/image";
import IconButton from "../form/IconButton";
import { ExternalLinkIcon } from "lucide-react";

export default function GTMBanner({ lang = "en" }: { lang?: "en" | "ar" }) {
    const TYPOGRAPHY = {
        en: {
            HEADER: (
                <>
                    You can alternatively install our script via{" "}
                    <a
                        href="https://marketingplatform.google.com/about/tag-manager/"
                        aria-label="google tag manager link"
                        className="text-sky-600 text-sm"
                    >
                        Google Tag Manager
                    </a>
                </>
            ),
            READ_TUTORIAL: "Read Tutorial"
        },
        ar: {
            HEADER: (
                <>
                    يمكنك ايضا تثبيت برمجياتنا من خلال {" "}
                    <a
                        href="https://marketingplatform.google.com/about/tag-manager/"
                        aria-label="google tag manager link"
                        className="text-sky-600 text-sm"
                    >
                        Google Tag Manager
                    </a>
                </>
            ),
            READ_TUTORIAL: "إقرأ كيف"
        },
    };

    return (
        <div className="w-full md:w-fit md:max-w-2/3 mx-auto my-10 ltr:bg-gradient-to-br rtl:bg-gradient-to-bl from-sky-100/70 to-violet-100/70 space-y-2 justify-center md:space-y-0 md:space-x-5 rtl:space-x-reverse border p-4 md:px-8 rounded flex flex-col md:flex-row items-center">
            <div className="rounded overflow-hidden object-cover relative w-14 h-14 md:w-9 md:h-9 mb-4 md:mb-0">
                <Image
                    alt="newsletterx integration with google tag manager"
                    className={cn(
                        "w-full object-fill absolute top-0 left-0 right-0 stop-animation-on-hover"
                    )}
                    src={"gtmlogo.png"}
                    loader={localImageLoader}
                    width={200}
                    height={0}
                />
            </div>
            <p className="text-lg font-semibold mb-1 text-center ltr:md:text-left rtl:md:text-right">
                {TYPOGRAPHY[lang].HEADER}
            </p>
        </div>
    );
    

    const OLD_GTM = () => <div className="w-full md:w-2/3 mx-auto mb-16 bg-slate-100 md:grid md:grid-cols-12 mt-16 gap-8 md:gap-10 border p-3 md:p-6 rounded">
    <div className="max-w-full col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3 rounded overflow-hidden object-cover relative pt-[56%] mb-4 md:mb-0">
        <Image
            alt="newsletterx integration with google tag manager"
            className={cn(
                "w-full object-fill absolute top-0 left-0 right-0 stop-animation-on-hover"
            )}
            src={"nx-gtm.png"}
            loader={localImageLoader}
            width={200}
            height={0}
        />
    </div>
    <div className="max-w-full col-span-12 md:col-span-7 lg:col-span-8 xl:col-span-9 flex flex-col">
        <p className="text-lg font-semibold mb-1">
            {TYPOGRAPHY[lang].HEADER}
        </p>
        <IconButton className="mt-3 lg:mt-auto w-fit" size={"sm"}>
            <span>{TYPOGRAPHY[lang].READ_TUTORIAL}</span>
            <ExternalLinkIcon size={17} />
            
        </IconButton>
    </div>
</div>
}
