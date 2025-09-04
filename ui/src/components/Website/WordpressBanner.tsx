import * as React from "react";
import { Container } from "./General/Container";
import Image from "next/image";
import Button from "../ui/button";

export interface IWordpressBannerProps {
    lang?: "en" | "ar";
}

export default function WordpressBanner({
    lang = "en",
}: IWordpressBannerProps) {
    // Multilingual text
    const TYPOGRAPHY = {
        en: {
            BANNER_TITLE: "Have a Wordpress website?",
            BANNER_DESCRIPTION:
                "We got you! We are working on our Wordpress plugin “newsletterx”!",
            BUTTON_TEXT: "Coming Soon!",
        },
        ar: {
            BANNER_TITLE: "هل لديك موقع ووردبريس؟",
            BANNER_DESCRIPTION:
                "لدينا لك الحل! نحن نعمل على إضافة توصيل البريد الإلكتروني 'newsletterx' لـ ووردبريس!",
            BUTTON_TEXT: "قريباً!",
        },
    };

    return (
        <Container>
            <div className="bg-primary-400 border-4 rounded border-primary p-8">
                <div className="flex flex-col items-center space-y-4 md:space-y-0 md:space-x-4 rtl:md:space-x-reverse md:flex-row md:justify-between">
                    <div className="flex flex-col items-center space-y-5 md:space-y-0 md:space-x-5 rtl:md:space-x-reverse md:flex-row">
                        <div className="relative w-40 aspect-square md:w-20">
                            <svg
                                width="100%"
                                height="100%"
                                viewBox="0 0 81 81"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <svg
                                    width="100%"
                                    height="100%"
                                    viewBox="0 0 81 81"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M40.5021 0C18.4258 0 0.467041 17.958 0.467041 40.0325C0.467041 62.1087 18.4267 80.0684 40.5012 80.0684C62.5749 80.0684 80.5329 62.1087 80.5329 40.0325C80.5337 17.9588 62.5758 0 40.5021 0ZM4.50707 40.0325C4.50707 34.8153 5.62606 29.8601 7.62361 25.3849L24.7937 72.4276C12.7876 66.5922 4.50707 54.2799 4.50707 40.0325ZM40.5021 76.0292C36.9687 76.0292 33.5585 75.5109 30.3338 74.5624L41.1327 43.1815L52.1987 73.4925C52.2702 73.6714 52.3576 73.8344 52.4549 73.9884C48.7136 75.3045 44.6935 76.0292 40.5021 76.0292ZM45.4614 23.1569C47.6278 23.0429 49.5821 22.8142 49.5821 22.8142C51.5206 22.5845 51.2935 19.7351 49.3517 19.849C49.3517 19.849 43.5221 20.3058 39.7574 20.3058C36.2216 20.3058 30.2764 19.849 30.2764 19.849C28.3362 19.7351 28.1099 22.7002 30.0492 22.8142C30.0492 22.8142 31.8862 23.0429 33.8239 23.1569L39.4313 38.5225L31.5543 62.1462L18.4491 23.1578C20.6189 23.0446 22.569 22.815 22.569 22.815C24.5075 22.5862 24.2787 19.7351 22.3377 19.8515C22.3377 19.8515 16.5107 20.3083 12.7452 20.3083C12.0688 20.3083 11.2726 20.2908 10.429 20.265C16.8634 10.4919 27.9277 4.04002 40.5021 4.04002C49.8741 4.04002 58.4051 7.62247 64.8079 13.4887C64.6523 13.4803 64.5018 13.4595 64.3404 13.4595C60.8062 13.4595 58.297 16.5395 58.297 19.8482C58.297 22.8133 60.0067 25.3242 61.8312 28.2893C63.2014 30.687 64.7988 33.7678 64.7988 38.2163C64.7988 41.2979 63.6157 44.8721 62.0591 49.8522L58.4692 61.85L45.4614 23.1569ZM58.5965 71.1464L69.5909 39.3586C71.6467 34.2246 72.3281 30.1188 72.3281 26.4657C72.3281 25.142 72.2415 23.9115 72.0851 22.7642C74.8972 27.8916 76.497 33.7761 76.4954 40.0342C76.4945 53.3123 69.2964 64.9066 58.5965 71.1464Z"
                                        fill="#1F0D34"
                                    />
                                </svg>
                            </svg>
                        </div>
                        <div className="text-center ltr:md:text-left rtl:md:text-right">
                            <p className="font-bold text-xl">
                                {TYPOGRAPHY[lang].BANNER_TITLE}
                            </p>
                            <p className="opacity-70">
                                {TYPOGRAPHY[lang].BANNER_DESCRIPTION}
                            </p>
                        </div>
                    </div>
                    <Button
                        className="cursor-none border-2 border-primary font-medium px-9 whitespace-nowrap"
                        variant={"secondary"}
                        disabled={true}
                    >
                        {TYPOGRAPHY[lang].BUTTON_TEXT}
                    </Button>
                </div>
            </div>
        </Container>
    );
}
