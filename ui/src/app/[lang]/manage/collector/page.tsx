/* eslint-disable react/no-unescaped-entities */
"use client";
import IconButton from "@/components/form/IconButton";
import getNewslettersList from "@/services/manage/newsletter/getNewslettersList";
import NewslettersListSkeleton from "@/skeletons/NewslettersListSkeleton";
import { useQuery } from "@tanstack/react-query";
import { CrownIcon, Plus } from "lucide-react";
import * as React from "react";
import html2canvas from "html2canvas";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { populateWidgetPlaceholders } from "@/helpers/builder";
import auth from "@/lib/Auth";
import dynamic from "next/dynamic";
import { WALKTHROUGH_PAGES } from "@/constants";
import MainLayout from "@/layouts/MainLayout";
import readCollector from "@/services/manage/collector/read";
import CollectorsListSkeleton from "@/skeletons/CollectorsListSkeleton";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const JoyRideNoSSR = dynamic(() => import("react-joyride"), { ssr: false });

export default function Page() {
    const shouldShowWalkthrough = auth.shouldShowWalkthrough(
        WALKTHROUGH_PAGES.COLLECTORS_LIST
    );

    const [steps, setSteps] = React.useState([
        {
            target: "#default-collector",
            title: "This is your newsletter",
            content:
                "We have created a basic collector for you. Click on it to customize it!",
            disableBeacon: true,
            disableScrolling: true,
        },
    ]);

    const readCollectorQ = useQuery(["collector-read"], readCollector);

    return (
        <>
            <h1 className="text-xl font-medium opacity-70 mb-2">
                Your Collectors
            </h1>
            <div className="flex gap-2 items-stretch">
                <IconButton
                    className="w-36 h-36 flex flex-col gap-2 hover:bg-soft-gray hover:text-primary p-0"
                    variant={"outline"}
                >
                    <Plus opacity={0.4} size={35} />
                    <p className="opacity-75">Coming Soon</p>
                </IconButton>
                {readCollectorQ.isLoading ? (
                    <CollectorsListSkeleton />
                ) : (
                    <Link href={"collector/basic"} className="w-72">
                        <Card
                            className={
                                "rounded-sm flex flex-col h-full hover:bg-secondary transition-all"
                            }
                        >
                            <CardHeader className="p-3 space-y-0">
                                <CardTitle className="font-medium text-lg">
                                    Basic Collector
                                </CardTitle>
                                <CardDescription className="uppercase font-bold opacity-30">
                                    {readCollectorQ.data?.collector?.type?.replaceAll(
                                        "-",
                                        " "
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className="p-3 mt-auto w-fit ml-auto">
                                <Badge
                                    className="shadow-none"
                                    variant={
                                        readCollectorQ.data?.collector?.isActive
                                            ? "success"
                                            : "destructive"
                                    }
                                >
                                    {readCollectorQ.data?.collector?.isActive
                                        ? "Active"
                                        : "Inactive"}
                                </Badge>
                            </CardFooter>
                        </Card>
                    </Link>
                )}
            </div>

            <h1 className="text-xl font-medium opacity-70 mb-2 mt-9">
                Browse Templates
            </h1>
            <div className="flex gap-2 items-stretch">
                {new Array(4).fill(0).map((_, i) => (
                    <Card
                        key={i}
                        className={
                            "w-72 rounded-sm flex gap-2 hover:bg-secondary transition-all h-36 justify-center items-center cursor-pointer"
                        }
                    >
                        {/* <CrownIcon
                            className="fill-yellow-500"
                            strokeWidth={"1"}
                        /> */}
                        <span>Coming Soon</span>
                    </Card>
                ))}
            </div>
            <JoyRideNoSSR
                run={!shouldShowWalkthrough}
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
                        auth.setWalkthroughDone(
                            WALKTHROUGH_PAGES.COLLECTORS_LIST
                        );
                    }
                }}
            />
        </>
    );
}
