/* eslint-disable react/no-unescaped-entities */
"use client";
import IconButton from "@/components/form/IconButton";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { ArrowRight, ExternalLinkIcon, LinkIcon, PlayIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import localImageLoader, { cn, highlightCode } from "@/lib/utils";
import Image from "next/image";

export default function Install() {
    const params = useParams();
    console.log(params);
    const domain =
        typeof params.domain === "string"
            ? params.domain.replaceAll("_", ".")
            : "yourdomain.com";
    const lang: "ar" | "en" = (params?.lang || "en") as "ar" | "en";
    const [copied, setCopied] = React.useState(false);
    const slicedDomain = domain.slice(
        0,
        domain.lastIndexOf(".") === -1 ? undefined : domain.lastIndexOf(".")
    );

    const TYPOGRAPHY = {
        en: {
            WELCOME_MESSAGE: `Welcome ${slicedDomain}!`,
            SCRIPT_INSTRUCTION:
                "Copy and paste the below script in your website's source code and the email collector will appear!",
            COPY_BUTTON: copied ? "copied ✓" : "copy",
            NEXT_STEPS: "What's next?",
            COLLECTOR_WILL_APPEAR: "The collector will appear on your website.",
            CRAWLER_START_COLLECTING:
                "Our crawler will start collecting data from your posts (make sure the script is added in the article/post page).",
            GO_TO_DASHBOARD:
                "You can go to your dashboard to customize everything and manage your account.",
            SET_EMAIL_SENDER:
                "Once you are in the dashboard, go to the Newsletter page and click on the Default Basic template to set the email sender.",
            WATCH_TUTORIAL: "Watch Tutorial",
            GO_TO_DASHBOARD_BUTTON: "Go to my dashboard",
        },
        ar: {
            WELCOME_MESSAGE: `مرحبًا ${slicedDomain}!`,
            SCRIPT_INSTRUCTION:
                "انسخ والصق النص أدناه في مصدر موقع الويب الخاص بك وسيظهر جمع البريد الإلكتروني!",
            COPY_BUTTON: copied ? "تم النسخ ✓" : "نسخ",
            NEXT_STEPS: "ما الخطوة التالية؟",
            COLLECTOR_WILL_APPEAR:
                "سيظهر جمع البريد الإلكتروني على موقع الويب الخاص بك.",
            CRAWLER_START_COLLECTING:
                "سيبدأ جمع البيانات (تأكد من إضافة البرمجيات اعلاه في صفحة المقالة/المشاركة).",
            GO_TO_DASHBOARD:
                "يمكنك الانتقال إلى لوحة التحكم الخاصة بك لتخصيص كل شيء وإدارة حسابك.",
            SET_EMAIL_SENDER:
                "عندما تكون في لوحة التحكم، انتقل إلى صفحة النشرة الإخبارية وانقر على القالب الأساسي لتحديد مرسل البريد الإلكتروني او اذهب الى الاعدادات لتحديده.",
            WATCH_TUTORIAL: "مشاهدة البرنامج التعليمي",
            GO_TO_DASHBOARD_BUTTON: "الانتقال إلى لوحة التحكم الخاصة بي",
        },
    };

    const scriptCode = `
    <script type="text/javascript">
        (function (s, l, d, a) {
            var h = d.location.protocol, td = new Date(),
                dt = td.getFullYear() + '-' + (td.getMonth() + 1) + '-' + td.getDate(),
                f = d.getElementsByTagName(s)[0],
                e = d.getElementById(l);
            if (e) return;
            e = d.createElement(s); e.id = l; e.async = true; e.dataset.vendor = l; e.dataset.domain = a;
            e.src = h + "//nx-cdn.cognativex.com/scripts/nx_script.js" + "?v=" + dt; e.setAttribute('data-domain', a);
            f.parentNode.insertBefore(e, f);
        })("script", "newsletterx", document, "${domain}");
    </script>
  `;

    const copyScript = () => {
        if (!navigator.clipboard) {
            // use old commandExec() way
        } else {
            navigator.clipboard
                .writeText(scriptCode)
                .then(function () {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                })
                .catch(function () {
                    alert(
                        "something wrong happened while trying to copy the tex!"
                    ); // error
                });
        }
    };

    const NXScript = () => (
        <>
            <pre
                className="text-amber-100 bg-primary rounded w-full text-sm relative overflow-hidden max-w-full tab-size h-full"
                style={{ direction: "ltr" }}
            >
                <div className="absolute top-2 right-2 cursor-pointer font-mono tracking-wide">
                    <Button
                        variant={"ghost"}
                        onClick={copyScript}
                        className="!py-1 px-3"
                    >
                        {copied ? "copied ✓" : "copy"}
                    </Button>
                </div>
                <span className="p-2 block min-h-full overflow-auto">
                    <code
                        dangerouslySetInnerHTML={{
                            __html: highlightCode(
                                scriptCode
                                    .replaceAll("<", "&lt")
                                    .replaceAll(">", "&gt")
                            ),
                        }}
                    />
                </span>
            </pre>
        </>
    );

    return (
        <div className="h-screen w-screen flex flex-col py-9 items-center bg-primary overflow-auto">
            <div className="absolute top-0 bottom-0 left-0 hidden md:block w-[50vw] bg-primary-400 z-0 opacity-30"></div>
            <div className="bg-secondary flex flex-col items-center space-y-12 md:rounded-lg w-full md:w-[70%] p-6 md:p-9 relative z-10">
                <h1 className="text-xl md:text-5xl font-semibold">
                    {TYPOGRAPHY[lang].WELCOME_MESSAGE}
                </h1>
                <div className="flex flex-col items-center md:items-start w-full">
                    <p className="text-center md:text-left self-start mb-2">
                        {TYPOGRAPHY[lang].SCRIPT_INSTRUCTION}
                    </p>
                    <NXScript />
                    <div className="w-full mt-3">
                        <p className="text-xl font-medium mb-2">
                            {TYPOGRAPHY[lang].NEXT_STEPS}
                        </p>
                        <ul className="list-disc pl-2 list-inside space-y-1">
                            <li>{TYPOGRAPHY[lang].COLLECTOR_WILL_APPEAR}</li>
                            <li className="list-none">
                                <Image
                                    alt="collector screenshot desktop"
                                    src="collector-screenshot-desktop.webp"
                                    loader={localImageLoader}
                                    width={300}
                                    height={0}
                                    className="ml-6 rounded"
                                />
                            </li>
                            <li>{TYPOGRAPHY[lang].CRAWLER_START_COLLECTING}</li>
                            <li>{TYPOGRAPHY[lang].GO_TO_DASHBOARD}</li>
                            <li>{TYPOGRAPHY[lang].SET_EMAIL_SENDER}</li>
                        </ul>
                    </div>
                </div>
                <div className="flex items-center rtl:space-x-reverse space-x-2">
                    <Dialog>
                        <DialogTrigger
                            className={cn(
                                buttonVariants({
                                    variant: "outline",
                                    size: "lg",
                                }),
                                "rtl:space-x-reverse space-x-2"
                            )}
                        >
                            <span>{TYPOGRAPHY[lang].WATCH_TUTORIAL}</span>
                            <PlayIcon
                                size={"1em"}
                                strokeWidth={"1"}
                                fill="hsl(var(--primary) / 0.8)"
                            />
                        </DialogTrigger>
                        <DialogContent
                            usePrimitiveOverlay={true}
                            className="max-w-[90vw] md:max-w-[70vw] p-0 md:p-6"
                        >
                            <DialogHeader className="hidden md:block">
                                <DialogTitle>Complete Walkthrough</DialogTitle>
                            </DialogHeader>
                            <div className="w-full pt-[56.6%] relative rounded-xl overflow-hidden">
                                <iframe
                                    src="https://www.youtube.com/embed/77ZRDED9bK0?si=9ll-ZBfnb0eLDFYB"
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="absolute w-full h-full inset-0"
                                ></iframe>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Link href={"/login"} aria-label="go to login">
                        <IconButton
                            className="flex items-center rtl:space-x-reverse space-x-2 w-fit whitespace-nowrap"
                            size={"lg"}
                        >
                            <span>
                                {TYPOGRAPHY[lang].GO_TO_DASHBOARD_BUTTON}
                            </span>
                            <ArrowRightIcon />
                        </IconButton>
                    </Link>
                </div>
            </div>
        </div>
    );
}

