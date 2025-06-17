import { PostImage, RawPostImage } from "@/types";

export function imageMapper(rawImage: RawPostImage): PostImage | undefined {
    if (!rawImage || !rawImage.data) return undefined;
    const attr = rawImage.data.attributes;
    return {
        url: attr.url,
        alternativeText: attr.alternativeText,
        caption: attr.caption,
        width: attr.width,
        height: attr.height,
    };
}
