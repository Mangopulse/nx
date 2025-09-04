import { strapiUrl } from "@/constants";
import { postMapper } from "@/mappers/post/postMapper";
import { Post, RawPost, StrapiResponse } from "@/types";

const getPost = async (slug:string): Promise<Post | undefined> => {
    try {
        const response = await fetch(strapiUrl + "/api/posts/" + slug);
        const data = await response.json();
        return postMapper(data);
    } catch (error) {
        console.error("Error fetching post " + slug, error);
        return undefined;
    }
};
export default getPost;