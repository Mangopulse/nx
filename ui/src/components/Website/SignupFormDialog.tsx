/* eslint-disable react/no-unescaped-entities */
import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import HeroSignupForm from "./Hero/HeroSignupForm";
import { cn } from "@/lib/utils";

export interface ISignupFormDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    lang?: "en" | "ar"; // Added lang prop with default value
}

export default function SignupFormDialog({
    open,
    onOpenChange,
    lang = "en", // Updated prop with default value
}: ISignupFormDialogProps) {
    const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);

    // Multilingual text
    const TYPOGRAPHY = {
        en: {
            SIGNUP_NOW: "Signup Now!",
            EMAIL_DESCRIPTION: "We'll send you a short email with everything you need to know!",
        },
        ar: {
            SIGNUP_NOW: "التسجيل الآن",
            EMAIL_DESCRIPTION: "سنرسل لك بريدًا إلكترونيًا قصيرًا يحتوي على كل ما تحتاج إلى معرفته",
        },
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    "gap-9 px-4 md:px-11",
                    showSuccessMessage && "!p-0"
                )}
            >
                {!showSuccessMessage && (
                    <DialogHeader>
                        <DialogTitle className="font-bold text-center text-xl md:text-2xl mb-2 md:mb-3">
                            {TYPOGRAPHY[lang].SIGNUP_NOW}
                        </DialogTitle>
                        <DialogDescription className="text-center md:text-lg">
                            {TYPOGRAPHY[lang].EMAIL_DESCRIPTION}
                        </DialogDescription>
                    </DialogHeader>
                )}
                <HeroSignupForm
                    variant="popup"
                    showSuccessMessage={showSuccessMessage}
                    setShowSuccessMessage={setShowSuccessMessage}
                    lang={lang}
                />
            </DialogContent>
        </Dialog>
    );
}
