import { Post, RawPost, StrapiResponse } from "@/types";
import { imageMapper } from "./imageMapper";

export function postMapper(rawPost: StrapiResponse<RawPost>): Post | undefined {
    if (!rawPost?.data?.attributes) return;
    const attr = rawPost.data.attributes;
    return {
        id: rawPost.data.id,
        title: attr.title,
        content: attr.content,
        image: imageMapper(attr.image),
        slug: attr.slug,
        date: new Date(attr.publishedAt),
    };
}

export function postsMapper(
    rawPosts: StrapiResponse<RawPost[]>
): (Post | undefined)[] | undefined {
    if (!rawPosts?.data.length) return;

    return rawPosts.data.map((post) => postMapper({data:post}));
}
