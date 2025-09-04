// "use client";
import localImageLoader from "@/lib/utils";
import { PlayCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import getPostMetadata from "@/services/website/getPostMetadata";
import VideosList from "./components/VideosList";
import ArticleCard from "./components/ArticleCard";
import Footer from "@/components/Website/Footer";
import Header from "@/components/Website/Header";
import getPosts from "@/services/blog/getPosts";
import { Post } from "@/types";

export interface IHelpProps {}

export default async function Help(props: IHelpProps) {
    const posts = await getPosts();

    return (
        <div className="h-screen overflow-auto">
            {/* <div className="border-b fixed top-0 left-0 right-0 bg-white z-20">
                <header className="flex items-center gap-4 justify-center py-3 containe">
                    <Link
                        aria-label={`go to home page`}
                        href={"/"}
                        className="img-wrap relative w-12 h-7"
                    >
                        <Image
                            loader={localImageLoader}
                            alt="logo"
                            src={"nx-dark.png"}
                            fill
                        />
                    </Link>
                    <div className="divider h-8 w-px bg-primary/10"></div>
                    <h1 className="text-xl opacity-50">Help</h1>
                </header>
            </div> */}
            <Header variant="Help" />

            <main className="container mt-[70px]">
                <VideosList />

                <section id="articles" className="py-5 md:py-10">
                    <h2 className="text-xl font-semibold mb-4 opacity-50">
                        Helpful Articles
                    </h2>
                    <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {posts?.map((post:Post | undefined) => {
                            if (!post) return;
                            return (
                                <ArticleCard
                                    key={post.id}
                                    title={post.title}
                                    slug={post.slug}
                                    image={post.image}
                                />
                            );
                        })}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}


export const revalidate = 86400 // revalidate the data at most every day