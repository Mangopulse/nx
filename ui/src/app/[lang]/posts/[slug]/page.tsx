import getPostMetadata from "@/services/website/getPostMetadata";
import Markdown from "markdown-to-jsx";
import Image from "next/image";
import localImageLoader, { strapiImageLoader } from "@/lib/utils";
import Footer from "@/components/Website/Footer";
import GetStartedBanner from "./components/GetStartedBanner";
import NewsletterSubscribeBanner from "./components/NewsletterSubscribeBanner";
import ExploreOtherArticles from "./components/ExploreOtherArticles";
import { getPostContent } from "@/helpers/blog";
import getPost from "@/services/blog/getPost";
import { notFound, useParams } from "next/navigation";


const PostPage = async (props: any) => {
    const slug = props.params.slug;
    const post = await getPost(slug);
    if (!post) return notFound();

    return (
            <div className="container pt-24 md:pt-16 lg:pt-16 prose lg:prose-xl">
                <div className="">
                    <h1 className="text-2xl text-slate-600 !mb-0">
                        {post.title}
                    </h1>
                    <p className="text-slate-400 !mt-2 md:!mt-7 !mb-3">
                        {post.date.toLocaleDateString()}
                    </p>
                    <div className="w-full pt-[56%] relative mt-4 rounded overflow-hidden bg-placeholder bg-cover">
                        <Image
                            fill
                            alt={post.title}
                            src={`${post.image?.url || ""}`}
                            loader={strapiImageLoader}
                            className="!m-0"
                            priority={true}
                        />
                    </div>
                    <article>
                        <Markdown>{post.content}</Markdown>
                    </article>
                </div>
                <div className="space-y-10 md:space-y-24 not-prose">
                    <NewsletterSubscribeBanner />
                    <ExploreOtherArticles currentPost={post} />
                    <GetStartedBanner />
                </div>
            </div>
    );
};

export default PostPage;