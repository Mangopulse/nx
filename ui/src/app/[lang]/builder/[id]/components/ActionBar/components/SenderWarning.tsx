/* eslint-disable react/no-unescaped-entities */
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import * as React from "react";
import SetSenderForm from "./SetSenderForm";
import { cn } from "@/lib/utils";

export interface ISpecifySenderWarningProps {
    issue: "unspecified" | "unverified";
    sender?: string;
    closePopup?: Function;
}

export default function SenderWarning({
    issue,
    sender,
    closePopup = () => {},
}: ISpecifySenderWarningProps) {
    return (
        <div
            className={cn(
                "bg-destructive/80 text-secondary/80 text-center p-1 text-sm",
                issue === "unverified" && "bg-yellow-100 text-yellow-800/70"
            )}
        >
            {issue === "unspecified" ? (
                <p>
                    You haven't specified an email sender yet!{" "}
                    <Dialog>
                        <DialogTrigger className="underline underline-offset-2 text-secondary">
                            Click here
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Set Email Sender</DialogTitle>
                                <DialogDescription>
                                    From which email do you want the newsletter
                                    to be sent to your users?
                                </DialogDescription>
                            </DialogHeader>
                            <SetSenderForm closePopup={closePopup} />
                        </DialogContent>
                    </Dialog>{" "}
                    to specify one!
                </p>
            ) : (
                <p>
                    You haven't verified your email sender yet! Please check the
                    inbox of the email you set as sender{" "}
                    <span className="text-yellow-800 font-semibold">
                        ({sender})
                    </span>{" "}
                    to confirm then refresh the page.
                </p>
            )}
        </div>
    );
}
