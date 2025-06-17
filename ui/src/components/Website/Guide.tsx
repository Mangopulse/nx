"use client";
import * as React from "react";
import { Container } from "./General/Container";
import { LayoutGrid } from "./General/LayoutGrid";
import { SectionTitle } from "./General/SectionTitle";
import { Dialog, DialogContent } from "../ui/dialog";
import MiniRotatingLoader from "../loaders/MiniRotatingLoader";
import Link from "next/link";
import IconButton from "../form/IconButton";
import { ArrowRightIcon, ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import localImageLoader from "@/lib/utils";
import VideoCard from "@/app/[lang]/help/components/VideoCard";
import { VIDEOS } from "@/constants";

export default function Guide({ lang = "en" }: { lang?: "en" | "ar" }) {
    const [videoPopupOpen, setVideoPopupOpen] = React.useState(false);
    const [selectedVideoUrl, setSelectedVideoUrl] = React.useState("");

    // Multilingual Typography Object
    const TYPOGRAPHY = {
        en: {
            NEED_HELP: "Need Some Help?",
            HELP_PAGE: "Help page",
            SEE_MORE: "See More",
            GO_TO: "Head to our",
            FIND_HELP: "find the help you need",
        },
        ar: {
            NEED_HELP: "تحتاج إلى مساعدة؟",
            HELP_PAGE: "صفحة المساعدة",
            SEE_MORE: "رؤية المزيد",
            GO_TO: "اذهب الى",
            FIND_HELP: "لتجد المساعدة التي تحتاجها",
        },
    };

    const handleVideoThumbClick = (url: string) => {
        setSelectedVideoUrl(url);
        setVideoPopupOpen(true);
    };

    return (
        <Container>
            <SectionTitle>
                <>
                    <p>{TYPOGRAPHY[lang].NEED_HELP}</p>
                    <p className="font-normal text-sm text-primary/60 mb-1">
                        {TYPOGRAPHY[lang].GO_TO}{" "}
                        <Link
                            className="text-sky-500 inline-flex rtl:space-x-reverse space-x-1 items-center"
                            href="/help"
                            aria-label="go to help page"
                        >
                            <span>{TYPOGRAPHY[lang].HELP_PAGE}</span>
                            <ExternalLinkIcon strokeWidth={"2"} size={"1em"} />
                        </Link>{" "}
                        {TYPOGRAPHY[lang].FIND_HELP}
                    </p>
                </>
            </SectionTitle>
            <LayoutGrid>
                {VIDEOS.map((video, index) => (
                    <div
                        key={index}
                        className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4"
                    >
                        <VideoCard
                            title={video.title[lang]}
                            onClick={() => handleVideoThumbClick(video.url)}
                            thumb={video.thumb}
                        />
                    </div>
                ))}
                <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4">
                    <Link
                        aria-label="See more in help page"
                        href="/help"
                        className="space-y-2 w-full cursor-pointer"
                        target="_blank"
                    >
                        <div className="rounded-lg relative w-full pt-[56%] overflow-hidden border shadow-lg bg-primary-600">
                            <Image
                                src={"bg-wave-purple.webp"}
                                alt={"decorative wave"}
                                loader={localImageLoader}
                                fill
                            ></Image>
                            <IconButton
                                variant={"outline"}
                                className="gap-0 rtl:space-x-reverse space-x-2 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-lg text-secondary bg-white/5 backdrop-blur-xl h-[80%] w-[80%] md:h-[70%] md:w-[70%] whitespace-nowrap  hover:bg-white/10 transition-[background-color]"
                            >
                                <span>{TYPOGRAPHY[lang].SEE_MORE}</span>
                                <ExternalLinkIcon
                                    strokeWidth={"3"}
                                    size={"1em"}
                                />
                            </IconButton>
                        </div>
                        <h3 className="opacity-70"> </h3>
                    </Link>
                </div>
            </LayoutGrid>

            <Dialog open={videoPopupOpen} onOpenChange={setVideoPopupOpen}>
                <DialogContent
                    usePrimitiveOverlay={true}
                    className="max-w-[90vw] md:max-w-[70vw] p-0"
                >
                    <div className="w-full pt-[56.6%] relative rounded-xl overflow-hidden">
                        <MiniRotatingLoader className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        <iframe
                            src={selectedVideoUrl}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="absolute w-full h-full inset-0 z-10"
                        ></iframe>
                    </div>
                </DialogContent>
            </Dialog>
        </Container>
    );
}
