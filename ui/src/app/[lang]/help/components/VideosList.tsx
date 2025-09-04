"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import * as React from "react";
import MiniRotatingLoader from "@/components/loaders/MiniRotatingLoader";
import VideoCard from "./VideoCard";
import { VIDEOS } from "@/constants";

export interface IVideosListProps {
    lang?: "ar" | "en";
}

export default function VideosList({ lang = "en" }: IVideosListProps) {
    const [videoPopupOpen, setVideoPopupOpen] = React.useState(false);
    const [selectedVideoUrl, setSelectedVideoUrl] = React.useState("");

    const handleVideoThumbClick = (url: string) => {
        setSelectedVideoUrl(url);
        setVideoPopupOpen(true);
    };
    return (
        <section id="videos" className="py-5 md:py-10 border-b">
            <h2 className="text-xl font-semibold mb-4 opacity-50">
                Video Tutorials
            </h2>
            <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {VIDEOS.map((video, index) => (
                    <VideoCard
                        key={index}
                        title={video.title[lang]}
                        onClick={() => handleVideoThumbClick(video.url)}
                        thumb={video.thumb}
                    />
                ))}
            </div>

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
        </section>
    );
}
