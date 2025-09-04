/* eslint-disable react/no-unescaped-entities */
"use client";
import IconButton from "@/components/form/IconButton";
import getNewslettersList from "@/services/manage/newsletter/getNewslettersList";
import NewslettersListSkeleton from "@/skeletons/NewslettersListSkeleton";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import * as React from "react";
import html2canvas from "html2canvas";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { populateWidgetPlaceholders } from "@/helpers/builder";
import auth from "@/lib/Auth";
import dynamic from "next/dynamic";
import { WALKTHROUGH_PAGES } from "@/constants";

const JoyRideNoSSR = dynamic(() => import("react-joyride"), { ssr: false });

export default function NewslettersList() {
    const newsletterListQ = useQuery({
        queryKey: ["newsletters-list"],
        queryFn: () => getNewslettersList(),
    });
    const shouldShowWalkthrough = auth.shouldShowWalkthrough(WALKTHROUGH_PAGES.NEWSLETTERS_LIST);
    const [steps, setSteps] = React.useState([
        {
            target: "#default-template",
            title: "This is your newsletter",
            content:
                "We have created a basic template for you. Click on it to open in editor",
            disableBeacon: true,
            disableScrolling: true,
        },
    ]);

    const ref = React.useRef(null);
    React.useEffect(() => {
        if (!newsletterListQ.isSuccess) return;
        newsletterListQ.data?.newsletters?.map((newsletter: any, i: number) => {
            let html = "";
            if (newsletter?.htmlComponents?.length === 0) return;
            newsletter?.htmlComponents?.forEach(
                (inst: any) => (html += inst.html)
            );
            html = populateWidgetPlaceholders(html);
            const e = document.getElementById("hidden-placeholder-" + i);
            if (!e) return;
            e.innerHTML = html;
            html2canvas(e).then(function (canvas) {
                const dataURL = canvas.toDataURL();
                const templatePreview = document.getElementById(
                    "temaplate-preview-" + i
                );
                if (!templatePreview) return;
                templatePreview.innerHTML = `<img src="${dataURL}" alt="Preview Image" />`;
            });
        });
    }, [newsletterListQ.isSuccess, newsletterListQ.data]);


    return (
        <div className="">
            <h1 className="text-xl font-medium opacity-70 mb-2">
                Your Newsletters
            </h1>
            {false && newsletterListQ.isLoading ? (
                <NewslettersListSkeleton />
            ) : (
                <div className="flex gap-3 items-start">
                    <div className="flex flex-col gap-2">
                        <IconButton
                            className="w-64 aspect-[0.8] h-auto flex-col hover:bg-soft-gray hover:text-primary"
                            variant={"outline"}
                        >
                            <Plus opacity={0.4} size={35} />
                            <p className="opacity-75">Coming Soon</p>
                        </IconButton>

                        <span className="opacity-85">New Newsletter</span>
                    </div>
                    {newsletterListQ.isLoading ? (
                        <NewslettersListSkeleton />
                    ) : (
                        newsletterListQ.data?.newsletters?.map(
                            (newsletter: any, i: number) => {
                                return (
                                    <div
                                    id="default-template"
                                        className="flex flex-col gap-2 w-64"
                                        key={i}
                                        title={newsletter.title}
                                    >
                                        <Link
                                            aria-label="open template in builder"
                                            href={"/builder/" + newsletter.id}
                                            ref={ref}
                                            id={"temaplate-preview-" + i}
                                            className={
                                                "w-full aspect-[0.8] rounded-sm block bg-soft-gray border border-input shadow-sm overflow-auto no-scrollbar"
                                            }
                                        >
                                            {newsletter?.htmlComponents
                                                ?.length === 0 ? (
                                                <div className="w-full h-full grid place-items-center text-center opacity-40">
                                                    It's Empty
                                                </div>
                                            ) : (
                                                <Skeleton className="w-full h-full rounded-sm" />
                                            )}
                                        </Link>
                                        <div className="flex justify-between items-center w-full" >
                                            <span className="opacity-85 truncate">
                                                {newsletter.title}
                                            </span>
                                            <div
                                                className="min-w-[12px] min-h-[12px] h-3 w-3 ml-2 rounded-full bg-emerald-600"
                                                title="active"
                                            ></div>
                                        </div>

                                        <div
                                            id={"hidden-placeholder-" + i}
                                            className="absolute -z-50 pointer-events-none top-[300%]"
                                        ></div>
                                    </div>
                                );
                            }
                        )
                    )}
                </div>
            )}
            <JoyRideNoSSR
                run={!newsletterListQ.isLoading && shouldShowWalkthrough}
                steps={steps}
                styles={{
                    options: {
                        backgroundColor: "#fff",
                        overlayColor: "rgb(33 16 35 / 10%)",
                        primaryColor: "hsl(var(--primary))",
                        textColor: "hsl(var(--primary) , 10)",
                        zIndex: 1000,
                    },
                }}
                callback={({ status }) => {
                    if (["finished", "skipped"].includes(status)) {
                        auth.setWalkthroughDone(WALKTHROUGH_PAGES.NEWSLETTERS_LIST);
                    }
                }}
            />
        </div>
    );
}
