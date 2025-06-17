import { Metadata, ResolvingMetadata } from "next";
import Header from "@/components/Website/Header";
import { getPostContent } from "@/helpers/blog";
import Script from "next/script";
import getPost from "@/services/blog/getPost";

type Props = {
    params: { slug: string };
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const slug = params.slug;
    const post = await getPost(slug);

    return {
        title: post?.title,
        description: post?.content,
        openGraph: {
            title: post?.title,
            images: ["TO_BE_REPLACED_BY_STRAPI_DEPLOYED_LINK" + post?.image?.url],
        },
    };
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
        </>
    );
}
