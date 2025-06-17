"use client"
import MiniRotatingLoader from "@/components/loaders/MiniRotatingLoader";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import localImageLoader from "@/lib/utils";
import { PlayCircleIcon } from "lucide-react";
import Image from "next/image";
import * as React from "react";

export default function HeroVisual({lang="en"} : {lang?:"ar" | "en"}) {
    return (
        // I dont think we should load this on mobile
        <div className="md:block col-span-12 lg:col-span-6 lg:col-start-7 relative pt-[71%] h-0">
            <Image
                loader={localImageLoader}
                alt="hero visual"
                fill
                src="hero-visual-main.webp"
                priority={true}
            />

            <Dialog>
                <DialogTrigger className="w-32 h-32 absolute top-1/2 left-[50%] md:left-[60%] -translate-x-1/2 -translate-y-1/2">
                    <PlayCircleIcon className="stroke-white absolute inset-0 w-full h-full animate-pulse drop-shadow-[0_0_10px_#0006] fill-primary/70" strokeWidth={0.5}/>
                    <PlayCircleIcon className="stroke-primary absolute inset-0 w-full h-full animate-ping opacity-30" strokeWidth={0.5}/>
                </DialogTrigger>
                <DialogContent
                    usePrimitiveOverlay={true}
                    className="max-w-[90vw] md:max-w-[70vw] p-0"
                >
                    <div className="w-full pt-[56.6%] relative rounded-xl overflow-hidden">
                        <MiniRotatingLoader className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        <iframe
                            src={"https://www.youtube.com/embed/0mhXEiudW_I?si=kRMu36ZuSdqueL4r"}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="absolute w-full h-full inset-0 z-10"
                        ></iframe>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
