import localImageLoader, { cn, strapiImageLoader } from "@/lib/utils";
import { PostImage } from "@/types";
import Image from "next/image";
import Link from "next/link";

export interface IArticleCard {
    title: string;
    image: PostImage | undefined;
    slug: string;
    className?: string;
}

const ArticleCard = ({ title, image, slug, className }: IArticleCard) => {
    return (
        <Link
            href={`/posts/${slug}`}
            className={"space-y-2 w-full group " + className ?? ""}
        >
            <div className="rounded-lg relative w-full pt-[56%] overflow-hidden bg-placeholder bg-cover transition-all group-hover:shadow-lg">
                {image && (
                    <Image
                        src={image?.url || "url"}
                        title={title}
                        fill
                        alt={title}
                        loader={strapiImageLoader}
                    ></Image>
                )}
            </div>
            <h3 className="opacity-70 leading-7">{title}</h3>
        </Link>
    );
};

export default ArticleCard;
