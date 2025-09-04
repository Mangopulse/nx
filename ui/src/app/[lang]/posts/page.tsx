import * as React from "react";
import ArticleCard from "../help/components/ArticleCard";
import getPostMetadata from "@/services/website/getPostMetadata";
import { Container } from "@/components/Website/General/Container";
import getPosts from "@/services/blog/getPosts";
import GetStartedBanner from "./[slug]/components/GetStartedBanner";

export interface IPostsProps {}

export default async function Posts(props: IPostsProps) {
    const posts = await getPosts();

    return (
        <div className="mb-20">
            <h1 className="justify-center mt-9 text-2xl space-x-2.5 mb-6 font-semibold flex items-center md:justify-start md:mt-14 md:text-5xl md:space-x-6">
                <span className="opacity-60 font-mono text-primary-500">
                    Discover
                </span>
                <div className="w-1.5 h-1.5 md:w-3 md:h-3 rounded-full bg-gray-300"></div>
                <span className="opacity-80 text-primary-800 font-mono">
                    Join
                </span>
                <div className="w-1.5 h-1.5 md:w-3 md:h-3 rounded-full bg-gray-300"></div>
                <em className="font-serif text-primary-800">Profit</em>
            </h1>
            <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {posts?.map((post, i) => {
                    if (!post) return;
                    let featured = "";
                    if (i === 0)
                        featured = `md:font-medium md:space-y-4 md:text-2xl xl:col-span-2 xl:mb-0 lg:col-span-3 lg:mb-3 md:col-span-2 md:mb-3`;
                    if (i === 1)
                        featured = `xl:font-medium xl:space-y-4 xl:text-2xl xl:col-span-2`;

                    return (
                        <ArticleCard
                            key={post.id}
                            className={featured}
                            title={post.title}
                            // author={}
                            slug={post.slug}
                            image={post.image}
                        />
                    );
                })}
            </div>
            <br />
            <br />
            <GetStartedBanner />
        </div>
    );
}

export const revalidate = 86400 // revalidate the data at most every day