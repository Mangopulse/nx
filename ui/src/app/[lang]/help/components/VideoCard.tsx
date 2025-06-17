import localImageLoader from "@/lib/utils";
import { PlayCircleIcon } from "lucide-react";
import Image from "next/image";

const VideoCard = ({
    title,
    onClick,
    thumb,
    lazy=true
}: {
    title: string;
    onClick: React.MouseEventHandler<HTMLDivElement>;
    thumb: string;
    lazy?: boolean
}) => {
    return (
        <div className="space-y-2 w-full cursor-pointer group" onClick={onClick}>
            <div className="rounded-lg relative w-full pt-[56%] overflow-hidden border shadow hover:shadow-md transition-all">
                <Image
                    src={thumb ?? "placeholder.png"}
                    alt={title}
                    loader={localImageLoader}
                    fill
                    priority={!lazy}
                ></Image>
                
                <PlayCircleIcon
                    size={"40%"}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all stroke-primary/60 fill-transparent group-hover:fill-primary-700 group-hover:stroke-white"
                    strokeWidth={"0.8"}
                />
            </div>
            <h3 className="opacity-70">{title}</h3>
        </div>
    );
};



export default VideoCard;