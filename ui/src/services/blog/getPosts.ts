import { strapiUrl } from "@/constants";
import { postsMapper } from "@/mappers/post/postMapper";
import { Post, StrapiResponse } from "@/types";

const getPosts = async (): Promise<(Post | undefined)[] | undefined> => {
    try {
        const response = await fetch(strapiUrl + "/api/posts?populate=*");
        const data = await response.json();
        return postsMapper(data);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return undefined;
    }
};


export default getPosts;
