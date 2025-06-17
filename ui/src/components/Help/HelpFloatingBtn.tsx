import { Cross1Icon, QuestionMarkIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Dialog, DialogContent } from "../ui/dialog";
import MiniRotatingLoader from "../loaders/MiniRotatingLoader";
import VideoCard from "@/app/[lang]/help/components/VideoCard";
import { VIDEOS } from "@/constants";

export interface IHelpFloatingBtnProps {
    lang?: "ar" | "en"
}

export default function HelpFloatingBtn({lang="en"}: IHelpFloatingBtnProps) {
    const [videoPopupOpen, setVideoPopupOpen] = React.useState(false);
    const [selectedVideoUrl, setSelectedVideoUrl] = React.useState("");

    const handleVideoThumbClick = (url: string) => {
        setSelectedVideoUrl(url);
        setVideoPopupOpen(true);
    };

    return (
        <>
            <Popover>
                <PopoverTrigger className="bg-white hover:bg-secondary w-9 h-9 rounded-full border shadow-md grid place-items-center fixed z-50 right-3 bottom-3 cursor-pointer group transition-all hover:shadow-lg [&[data-state=open]>#qs]:hidden [&[data-state=closed]>#cl]:hidden">
                    <QuestionMarkIcon
                        className="opacity-60 group-hover:opacity-80 transition-all"
                        id="qs"
                    />
                    <Cross1Icon
                        className="opacity-60 group-hover:opacity-80 transition-all"
                        id="cl"
                    />
                </PopoverTrigger>
                <PopoverContent
                    collisionPadding={12}
                    className="max-h-96 overflow-auto nx-scrollbar w-[700px] max-w-[700px]"
                >
                    <div className="border-b pb-4 mb-4">
                        <p className="opacity-60 mb-1">Things that may help:</p>
                        <ul className="text-primary/90 pl-5">
                            <li className="list-disc">
                                Drag and drop components from the left panel to
                                add them to your template.
                            </li>
                            <li className="list-disc">
                                Change the properties of your blocks from the
                                right side panel.
                            </li>
                            <li className="list-disc">
                                Send yourself a preview of the template from the
                                action bar on top before saving it
                            </li>
                            <li className="list-disc">
                                Watch our tutorials to help you get started
                            </li>
                        </ul>
                    </div>
                    <div className="border-b pb-4 mb-4">
                        <p className="opacity-60 mb-1">Video Tutorials:</p>
                        <ul className="grid grid-cols-2 gap-5">
                            {VIDEOS.map((video, index) => (                                
                                    <VideoCard
                                        title={video.title[lang]}
                                        key={index}
                                        onClick={() =>
                                            handleVideoThumbClick(video.url)
                                        }
                                        thumb={video.thumb}
                                    />
                                
                            ))}
                        </ul>
                    </div>
                    <div className="">
                        <p className="text-primary/40 text-sm">
                            Contact Us at{" "}
                            <a
                                href="support@cognativex.com"
                                className="text-sky-500/80"
                            >
                                support@cognativex.com
                            </a>{" "}
                            for more help.
                        </p>
                    </div>

                    <Dialog
                        open={videoPopupOpen}
                        onOpenChange={setVideoPopupOpen}
                    >
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
                </PopoverContent>
            </Popover>
        </>
    );
}
