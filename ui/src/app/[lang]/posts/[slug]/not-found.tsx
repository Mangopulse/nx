/* eslint-disable react/no-unescaped-entities */
import IconButton from "@/components/form/IconButton";
import * as React from "react";

export interface INotFoundProps {}

export default function NotFound(props: INotFoundProps) {
    return (
        <div className="flex justify-center items-center flex-col h-[55vh]">
            <span className="text-9xl font-bold text-primary-600 mb-16">
                <span className="text-primary-800">O</span>ops!
            </span>
            <span className="text-xl mb-7">
                We couldn't find the post you're looking for!
            </span>
            <a href="/posts">
                <IconButton variant={"outline"} size={"lg"}>
                    View All Posts
                </IconButton>
            </a>
        </div>
    );
}
