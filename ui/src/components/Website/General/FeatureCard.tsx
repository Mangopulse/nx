"use client";
/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { LayoutGrid } from "./LayoutGrid";
import Image from "next/image";
import localImageLoader, { cn } from "@/lib/utils";
import useInViewport from "@/hooks/useInViewport";
import Chip from "./Chip";

export interface IFeatureCardProps {
    title: string | React.ReactElement;
    description: string | React.ReactElement;
    image: string;
    className?: string;
    reversed?: boolean;
    scrolling?: boolean;
    chip?: string;
    mediaRatio?:string;
}

export default function FeatureCard({
    title,
    description,
    image,
    className,
    reversed,
    scrolling,
    chip,
    mediaRatio="56%"
}: IFeatureCardProps) {
    const cardRef = React.useRef(null);
    const inViewPort = useInViewport(cardRef);

    return (
        <div ref={cardRef} className={cn("col-span-12", className)}>
            <LayoutGrid className="items-center">
                {reversed ? (
                    <>
                        <div className={`border shadow rounded w-full overflow-hidden object-cover order-2 md:order-1 col-span-12 relative pt-[56%] h-0 md:col-span-8`} style={{paddingTop: mediaRatio}}>
                            <Image
                                alt="screenshot of email newsletter"
                                className={cn(
                                    "w-full object-fill absolute top-0 left-0 right-0 stop-animation-on-hover",
                                    scrolling && inViewPort && "animate-scroll"
                                )}
                                src={image}
                                loader={localImageLoader}
                                width={200}
                                height={0}
                            />
                        </div>
                        <div className="order-1 md:order-2 col-span-12 text-center md:col-span-3 md:text-right md:col-start-10">
                            {chip && (
                                <Chip className="mx-auto md:mx-0 ltr:ml-auto mb-2 bg-primary-800 uppercase p-1 text-xs tracking-widest shadow-none border-none px-3">
                                    {chip}
                                </Chip>
                            )}
                            <h3 className="text-4xl text-primary-600 font-bold mb-2">
                                {title}
                            </h3>
                            <p className="text-sm">{description}</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="col-span-12 text-center md:col-span-3 ltr:md:text-left rtl:md:text-right">
                            {chip && (
                                <Chip className="mx-auto md:mx-0 mb-2 bg-primary-800 uppercase p-1 text-xs tracking-widest shadow-none border-none px-3">
                                    {chip}
                                </Chip>
                            )}
                            <h3 className="text-4xl text-primary-600 font-bold mb-2">
                                {title}
                            </h3>
                            <p className="text-sm">{description}</p>
                        </div>
                        <div className={`border shadow rounded w-full overflow-hidden col-span-12 relative pt-[56%] h-0 md:col-span-8 md:col-start-5`} style={{paddingTop: mediaRatio}}>
                            <Image
                                alt="screenshot of email newsletter"
                                className={cn(
                                    "w-full object-fill absolute top-0 left-0 right-0 stop-animation-on-hover",
                                    scrolling && inViewPort && "animate-scroll"
                                )}
                                src={image}
                                loader={localImageLoader}
                                width={200}
                                height={0}
                            />
                        </div>
                    </>
                )}
            </LayoutGrid>
        </div>
    );
}
