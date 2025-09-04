import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type PostMetadata= (({
    title: string;
    date: string;
    image: string;
    slug: string;
    description: string;
}) | undefined)

const getPostMetadata = (): PostMetadata[] => {
    const folder = path.join(process.cwd(), 'posts');
    const files = fs.readdirSync(folder);
    const markdownPosts = files.filter((file) => file.endsWith(".md"));

    // Get gray-matter data from each file.
    const posts = markdownPosts.map((fileName) => {
        let res;
        try {
            const fileContents = fs.readFileSync(
                `${folder}/${fileName}`,
                "utf8"
            );
            const matterResult = matter(fileContents);
            res= {
                title: matterResult.data.title,
                date: matterResult.data.date,
                image: matterResult.data.image,
                description: matterResult.data.description,
                slug: fileName.replace(".md", "").replaceAll(" ", "-"),
            };
        } catch (e) {}
        return res;
    });

    return posts;
};

export default getPostMetadata;
