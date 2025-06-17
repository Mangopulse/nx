import fs from 'fs';
import { PostMetadata } from "@/services/website/getPostMetadata";
import matter from "gray-matter";
import path from 'path';

export const getPostContent = (
    slug: string
): PostMetadata & { content: string } => {
    const folder = path.join(process.cwd(), 'posts');
    const file = `${folder}/${slug.replaceAll("-", " ")}.md`;
    const content = fs.readFileSync(file, "utf8");
    const res = matter(content);
    return {
        title: res.data.title,
        date: res.data.date,
        image: res.data.image,
        description: res.data.description,
        content: res.content,
        slug,
    };
};