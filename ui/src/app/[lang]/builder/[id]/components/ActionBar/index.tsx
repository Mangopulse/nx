"use client";
import Loader from "@/components/General/Loader";
import Button, { buttonVariants } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import {
    ArrowLeft,
    CalendarClockIcon,
    MailQuestionIcon,
    Save,
    Send,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import useBuilderStore from "../../builderStore";
import ScheduleForm from "./components/ScheduleForm";
import sendPreviewEmail from "@/services/builder/send";
import {
    articleCountExceedsMaximum,
    generateJsonOutputFromInstances,
} from "@/helpers/builder";
import { useParams } from "next/navigation";
import updateNewsletter from "@/services/builder/update";
import Input from "@/components/form/Input";
import { Skeleton } from "@/components/ui/skeleton";
import SetSenderForm from "./components/SetSenderForm";
import SenderWarning from "./components/SenderWarning";
import useAuth from "@/hooks/useAuth";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import IconButton from "@/components/form/IconButton";
import HeaderFreeAccountWarning from "@/components/Navigation/components/HeaderFreeAccountWarning";
import auth from "@/lib/Auth";

export interface IActionBarProps {}

export default function ActionBar({
    canvasRef,
    exportRef,
    newsletterReadQ,
    getSenderQ,
}: any) {
    const { toast } = useToast();
    const { id } = useParams();
    // const user = useAuth();
    const user = auth.getUser();
    const instances = useBuilderStore((state) => state.instances);
    const [title, setTitle] = React.useState(
        newsletterReadQ.data?.newsletter?.title || "Untitled"
    );
    const [saveAlert, setSaveAlert] = React.useState(false);
    const titleRef = React.useRef(title);
    const [emailPreviewer, setEmailPreviewer] = React.useState<
        string | undefined
    >(user?.email);
    const [isSenderPopupOpen, setIsSenderPopupOpen] = React.useState(false);
    const [isScheduleFormOpen, setIsScheduleFormOpen] = React.useState(false);
    const isSenderVerified = getSenderQ.data?.sender?.verified == true;

    const copyToClipboard = (html: string) => {
        try {
            const blobInput = new Blob([html], { type: "text/html" });
            navigator.clipboard.write([
                new ClipboardItem({ "text/html": blobInput }),
            ]);
            toast({
                description: "Copied!",
            });
        } catch (e) {}
    };

    const exportToIframe = () => {
        setTimeout(() => {
            const content = canvasRef.current.innerHTML;
            if (!exportRef.current) return;
            exportRef.current.srcdoc = `
            <html><head>
            <style>@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap'); *{font-family: Poppins}</style>
            </head><body>${content.replaceAll(
                "contenteditable",
                "nx"
            )}</body></html>
        `;
        }, 0);
    };

    const renderSenderWarning = () => {
        if (
            user?.sender?.verified ||
            getSenderQ.isLoading ||
            isSenderVerified
        ) {
            return "";
        }
        if (getSenderQ.data?.code !== 200 && !user?.sender?.email) {
            return (
                <SenderWarning
                    issue={"unspecified"}
                    closePopup={() => setIsSenderPopupOpen(false)}
                />
            );
        }
        if (!getSenderQ.data?.sender?.verified) {
            return (
                <SenderWarning
                    issue={"unverified"}
                    sender={user?.sender?.email}
                />
            );
        }
    };

    const sendPreviewQ = useMutation(
        async () => {
            const exportJson: any = generateJsonOutputFromInstances(instances);
            return sendPreviewEmail({
                email: emailPreviewer,
                components: exportJson,
                subject: "Your Email Preview From NewsletterX",
            });
        },
        {
            onSuccess: (res) => {
                if (res?.code == 200) {
                    toast({
                        title: "Preview Successfully Sent",
                        description: "Check your inbox",
                    });
                } else
                    toast({
                        title: "Something went wrong, try again please",
                        description: res?.errorMessage,
                        variant: "destructive",
                    });
            },
        }
    );

    const saveQ = useMutation(
        async () => {
            const exportJson: any = generateJsonOutputFromInstances(instances);
            return updateNewsletter({
                htmlComponents: JSON.stringify(exportJson),
                id,
                title,
            });
        },
        {
            onSuccess: (res: any) => {
                if (res?.code == 200) {
                    toast({
                        description: "Saved Successfully!",
                    });
                    setSaveAlert(false);
                    titleRef.current = title;
                } else
                    toast({
                        description: "Something went wrong, try again please",
                        variant: "destructive",
                    });
            },
        }
    );

    function validateEmail(value: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(value.trim());
    }

    return (
        <>
            {renderSenderWarning()}
            <div className="p-2 flex items-center gap-2 justify-between border-b bg-white relative">
                <div className="flex items-center gap-4">
                    <Link
                        className="flex gap-2 items-center"
                        href={"/manage/newsletter"}
                    >
                        <ArrowLeft opacity={0.7} size={18} />
                        <img src="/img/nx-dark.png" alt="NX" width={40} />
                    </Link>
                    <HeaderFreeAccountWarning />
                </div>
                {newsletterReadQ.isLoading ? (
                    <Skeleton className="w-60 h-9 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                ) : (
                    <Input
                        className="truncate w-44 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-transparent shadow-transparent opacity-75 text-center text-lg hover:underline"
                        value={title}
                        onBlur={() => {
                            if (titleRef.current === title && saveAlert)
                                return setSaveAlert(false);
                            if (!title) setTitle("Untitled");
                            setSaveAlert(true);
                        }}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                )}
                <div className="flex items-center gap-2">
                    <Dialog
                        open={isSenderPopupOpen}
                        onOpenChange={setIsSenderPopupOpen}
                    >
                        <DialogTrigger
                            className={cn(
                                buttonVariants({ variant: "outline" }),
                                "flex items-center gap-2"
                            )}
                        >
                            <MailQuestionIcon size={18} />
                            Sender
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Set Email Sender</DialogTitle>
                                <DialogDescription>
                                    From which email do you want the newsletter
                                    to be sent to your users?
                                </DialogDescription>
                            </DialogHeader>
                            <SetSenderForm
                                closePopup={() => setIsSenderPopupOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                    <Dialog
                        open={isScheduleFormOpen}
                        onOpenChange={setIsScheduleFormOpen}
                    >
                        <DialogTrigger
                            className={cn(
                                buttonVariants({ variant: "outline" }),
                                "flex items-center gap-2"
                            )}
                        >
                            <CalendarClockIcon size={17} />
                            Schedule
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Schedule</DialogTitle>
                                <DialogDescription>
                                    What hour(s) to send at? (UTC)
                                </DialogDescription>
                            </DialogHeader>
                            <ScheduleForm
                                refetch={newsletterReadQ.refetch}
                                scheduleData={{
                                    type: newsletterReadQ.data?.newsletter
                                        ?.schedule.type,
                                    weekDay:
                                        newsletterReadQ.data?.newsletter
                                            ?.schedule.type === "weekly"
                                            ? newsletterReadQ.data?.newsletter
                                                  ?.schedule.day
                                            : "monday",
                                    monthDay:
                                        newsletterReadQ.data?.newsletter
                                            ?.schedule.type === "monthly"
                                            ? newsletterReadQ.data?.newsletter
                                                  ?.schedule.day
                                            : "01",
                                    hour: newsletterReadQ.data?.newsletter
                                        ?.schedule.hour,
                                }}
                                closePopup={setIsScheduleFormOpen}
                            />
                        </DialogContent>
                    </Dialog>

                    <Popover>
                        <PopoverTrigger
                            className={cn(
                                buttonVariants({ variant: "outline" }),
                                "flex items-center gap-2"
                            )}
                        >
                            <Send size={17} />
                            <span> Preview</span>
                        </PopoverTrigger>
                        <PopoverContent className="space-y-1 p-3 pt-2">
                            <Input
                                label="Send preview to"
                                value={emailPreviewer}
                                type="email"
                                onChange={(e) =>
                                    setEmailPreviewer(e.target.value)
                                }
                            />
                            <IconButton
                                onClick={() => {
                                    if (!emailPreviewer) return;
                                    if (!validateEmail(emailPreviewer)) {
                                        toast({
                                            title: "Please enter a valid email.",
                                            description: `${emailPreviewer} is not a valid email address`,
                                            variant: "destructive",
                                        });
                                    } else if (
                                        articleCountExceedsMaximum(instances)
                                    ) {
                                        toast({
                                            title: "You have too many articles in your template",
                                            description:
                                                "The total number of recommended articles in the template cannot exceed 15 for your plan",
                                            variant: "destructive",
                                        });
                                        return;
                                    } else sendPreviewQ.mutateAsync();
                                }}
                                className="space-x-2 w-full"
                                size={"sm"}
                            >
                                {sendPreviewQ.isLoading ? (
                                    <>
                                        <Loader />
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={15} />
                                        <span>Send</span>
                                    </>
                                )}
                            </IconButton>
                        </PopoverContent>
                    </Popover>

                    <IconButton
                        className="relative"
                        onClick={() => {
                            if (articleCountExceedsMaximum(instances)) {
                                toast({
                                    title: "You have too many articles in your template",
                                    description:
                                        "The total number of recommended articles in the template cannot exceed 15 for your plan",
                                    variant: "destructive",
                                });
                                return;
                            } else saveQ.mutateAsync();
                        }}
                    >
                        <>
                            {saveQ.isLoading ? (
                                <Loader />
                            ) : (
                                <div className="flex gap-2 items-center">
                                    {saveAlert ? (
                                        <span
                                            className="relative flex h-3 w-3"
                                            title="Don't forget to save after changing the title"
                                        >
                                            <span className="inset-0 animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                            <span className="inset-0 inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                                        </span>
                                    ) : (
                                        <Save size={17} />
                                    )}
                                    Save
                                </div>
                            )}
                            {/* {saveAlert && (
                                <span className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                    <span className="absolute inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                                </span>
                            )} */}
                        </>
                    </IconButton>
                </div>
            </div>
        </>
    );
}
