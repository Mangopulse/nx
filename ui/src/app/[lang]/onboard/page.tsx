"use client";

import MainLayout from "@/layouts/MainLayout";
import IconButton from "@/components/form/IconButton";
import Link from "next/link";

export default function Dashborad() {
    return (
        <>
            <MainLayout>
                <div className=" relative flex justify-between items-center flex-col m-auto w-[80%] h-full">
                    <h1 className="text-3xl font-bold py-5  ">
                        Welcome To NewsletterX
                    </h1>
                    <div className=" flex flex-col  w-full relative">
                        <div className="absolute  bottom-0 top-10  w-[107%] border bg-gray-400 left-1/2 -translate-x-1/2   rounded-t-[40px] "></div>
                        <div className="relative h-[100%] border bg-accent border-accent  rounded-t-[40px] p-10 ">
                            <div className="flex flex-col gap-10">
                                <div className="flex justify-start gap-2 pl-2">
                                    <svg
                                        width="26"
                                        height="27"
                                        viewBox="0 0 26 27"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M14.1252 0.527354C14.3595 -0.175785 15.3525 -0.175785 15.5868 0.527354L16.9612 4.65456C17.2637 5.56183 17.7733 6.38616 18.4498 7.06223C19.1262 7.7383 19.9508 8.24752 20.8582 8.54953L24.9833 9.92384C25.6865 10.1582 25.6865 11.1511 24.9833 11.3855L20.8561 12.7598C19.9489 13.0623 19.1245 13.572 18.4484 14.2484C17.7724 14.9249 17.2632 15.7495 16.9612 16.6569L15.5868 20.782C15.5363 20.936 15.4384 21.0701 15.3072 21.1651C15.176 21.2602 15.0181 21.3114 14.856 21.3114C14.694 21.3114 14.5361 21.2602 14.4048 21.1651C14.2736 21.0701 14.1757 20.936 14.1252 20.782L12.7509 16.6548C12.4486 15.7478 11.9392 14.9236 11.2632 14.2475C10.5871 13.5715 9.76293 13.0621 8.85589 12.7598L4.72867 11.3855C4.5747 11.335 4.44063 11.2371 4.34557 11.1059C4.25052 10.9746 4.19934 10.8167 4.19934 10.6547C4.19934 10.4926 4.25052 10.3347 4.34557 10.2035C4.44063 10.0722 4.5747 9.97437 4.72867 9.92384L8.85589 8.54953C9.76293 8.24724 10.5871 7.73789 11.2632 7.06184C11.9392 6.38578 12.4486 5.5616 12.7509 4.65456L14.1252 0.527354ZM3.96422 18.0648C3.98525 18.0041 4.02467 17.9515 4.07698 17.9143C4.1293 17.877 4.19191 17.857 4.25613 17.857C4.32034 17.857 4.38296 17.877 4.43527 17.9143C4.48759 17.9515 4.527 18.0041 4.54804 18.0648L5.09776 19.714C5.3428 20.4512 5.92022 21.0286 6.65745 21.2736L8.30663 21.8234C8.3673 21.8444 8.41991 21.8838 8.45714 21.9361C8.49438 21.9884 8.51438 22.0511 8.51438 22.1153C8.51438 22.1795 8.49438 22.2421 8.45714 22.2944C8.41991 22.3467 8.3673 22.3862 8.30663 22.4072L6.65745 22.9569C6.29414 23.0778 5.96401 23.2817 5.69326 23.5524C5.42252 23.8232 5.21862 24.1533 5.09776 24.5166L4.54804 26.1658C4.527 26.2265 4.48759 26.2791 4.43527 26.3163C4.38296 26.3535 4.32034 26.3735 4.25613 26.3735C4.19191 26.3735 4.1293 26.3535 4.07698 26.3163C4.02467 26.2791 3.98525 26.2265 3.96422 26.1658L3.41449 24.5166C3.29363 24.1533 3.08973 23.8232 2.81899 23.5524C2.54825 23.2817 2.21811 23.0778 1.8548 22.9569L0.207751 22.4072C0.147082 22.3862 0.0944728 22.3467 0.0572399 22.2944C0.0200069 22.2421 0 22.1795 0 22.1153C0 22.0511 0.0200069 21.9884 0.0572399 21.9361C0.0944728 21.8838 0.147082 21.8444 0.207751 21.8234L1.85693 21.2736C2.59416 21.0286 3.17159 20.4512 3.41662 19.714L3.96422 18.0648Z"
                                            fill="url(#paint0_linear_77_429)"
                                        />
                                        <defs>
                                            <linearGradient
                                                id="paint0_linear_77_429"
                                                x1="0"
                                                y1="0"
                                                x2="25.5107"
                                                y2="26.3736"
                                                gradientUnits="userSpaceOnUse"
                                            >
                                                <stop stop-color="#D155F0" />
                                                <stop
                                                    offset="1"
                                                    stop-color="#F0555D"
                                                />
                                            </linearGradient>
                                        </defs>
                                    </svg>

                                    <h1 className="text-primary-foreground">
                                        Our wizard will guide you through the
                                        features & steps to take to get you up
                                        and running!
                                    </h1>
                                </div>
                                <div className="flex flex-row gap-5">
                                    <div className="flex flex-col gap-20 relative h-fit w-[70%]">
                                        <div className="line vertical-dashed-line absolute top-4 left-6  "></div>
                                        <div className="grid grid-row grid-cols-12 gap-1 z-10">
                                            <span className="text-7xl bg-accent text-primary-foreground/20 font-bold col-span-1 pl-2 cont  ">
                                                1
                                            </span>
                                            <div className="flex flex-col gap-1 col-span-11">
                                                <h1 className="text-primary-foreground mt-1">
                                                    Collect
                                                </h1>
                                                <p className="text-primary-foreground/50 text-sm ">
                                                    Create the widget where your
                                                    users will use to subscribe
                                                    to your personalised
                                                    newsletter! Once you add the
                                                    collector widget to your
                                                    website you will start
                                                    getting subscribers!
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-row grid-cols-12 gap-1 z-10 ">
                                            <span className="text-7xl bg-accent font-bold col-span-1 pl-1 text-primary-foreground/20">
                                                2
                                            </span>
                                            <div className="flex flex-col gap-1 col-span-11">
                                                <h1 className="text-primary-foreground mt-1">
                                                    Configure & Customize
                                                </h1>
                                                <p className="text-primary-foreground/50 text-sm">
                                                    Setup your newsletter’s
                                                    configuration, layout and
                                                    template! Choose from our
                                                    well-designed & effective
                                                    newsletter templates or
                                                    build your custom newsletter
                                                    template through our
                                                    powerful drag n’ drop
                                                    builder!
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-row grid-cols-12 gap-1 z-10 ">
                                            <span className="text-7xl bg-accent font-bold col-span-1 pl-1 text-primary-foreground/20 ">
                                                3
                                            </span>
                                            <div className="flex flex-col gap-1 col-span-11">
                                                <h1 className="text-primary-foreground mt-1">
                                                    Deploy
                                                </h1>
                                                <p className="text-primary-foreground/50 text-sm">
                                                    Install NewsletterX script
                                                    in your website’s source
                                                    code & add the collector
                                                    widget where you want to
                                                    start collecting user emails
                                                    right away. Don’t worry,
                                                    we’ll guide you throught
                                                    everything.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-col grid-col-3 gap-4 ">
                                        <img
                                            src="/img/frame1.svg"
                                            alt=""
                                            className="h-full w-full col-span-1"
                                        />

                                        <img
                                            src="/img/frame2.svg"
                                            alt=""
                                            className="h-full w-full col-span-1"
                                        />
                                        <img
                                            src="/img/frame3.svg"
                                            alt=""
                                            className="h-full w-full col-span-1 "
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row justify-center gap-4 pt-4 ">
                                <IconButton
                                    variant="ghost"
                                    className="text-primary-foreground/50
                                "
                                >
                                    <Link href="analytics/overview">
                                        Skip the guide
                                    </Link>
                                </IconButton>

                                <IconButton variant="secondary">
                                    <Link href="/manage/collector">
                                        Lets Get Started
                                    </Link>
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        </>
    );
}
