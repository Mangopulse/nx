import { Card } from "@/components/ui/card";
import localImageLoader, { cn } from "@/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import Image from "next/image";

const RadioCard = ({
    title,
    description,
    image,
    value,
    field,
    variant = "type",
    comingSoon = false,
}: {
    title?: string;
    description?: string;
    image: string;
    value: string;
    field: any;
    variant?: "type" | "template" | "email-provider";
    comingSoon?: boolean;
}) => {
    const isSelected = field?.value === value;
    return (
        <Card
            className={cn(
                "h-full relative p-4 flex flex-col gap-1  items-center cursor-pointer rounded-lg transition-all outline-2 hover:outline-primary-600 outline outline-transparent",
                isSelected && "bg-primary-400/10 outline-primary-600",
                variant === "type" && "w-64",
                variant === "email-provider" && "w-full max-w-md",
                variant === "template" && "justify-between",
                comingSoon && "cursor-not-allowed bg-gray-100 hover:outline-transparent",
            )}
            onClick={() => !comingSoon && field.onChange(value)}
        >
            {!comingSoon && (
                <div
                    className={cn(
                        "h-5 w-5 grid place-items-center rounded-full border border-primary/20 absolute top-3 right-3 pr-[1px]",
                        isSelected && "border-primary"
                    )}
                >
                    {isSelected && <CheckIcon />}
                </div>
            )}

            <div
                className={cn(
                    "relative w-[50px] md:[75px] xl:w-[100px] aspect-square mb-3 mt-6",
                    variant === "template" &&
                        "w-[170px] md:[220px] xl:w-[300px] aspect-auto mt-8"
                )}
            >
                {variant === "type" ? (
                    <Image
                        src={image}
                        loader={localImageLoader}
                        fill
                        alt={title || value}
                        objectFit="cover"
                    />
                ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        alt={title || value}
                        src={"/img/" + image}
                        className="aboslute w-full"
                    />
                )}
            </div>
            {title && (
                <p className="font-medium text-center text-lg text-primary/80">{title}</p>
            )}
            {description && (
                <p className="opacity-60 text-center text-sm font-normal">
                    {description}
                </p>
            )}

            {comingSoon && (
                <div className="absolute uppercase text-xs tracking-wider text-primary-foreground py-1 px-2 bg-primary-500 top-2 left-0 rounded-se rounded-ee">
                    coming soon
                </div>
            )}
        </Card>
    );
};

export default RadioCard;
