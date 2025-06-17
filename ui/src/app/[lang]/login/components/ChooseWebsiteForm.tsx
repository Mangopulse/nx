import IconButton from "@/components/form/IconButton";
import MiniRotatingLoader from "@/components/loaders/MiniRotatingLoader";
import {
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { defaultWalkthrough } from "@/constants";
import auth from "@/lib/Auth";
import { cn } from "@/lib/utils";
import adminLogin from "@/services/auth/adminLogin";
import { useMutation } from "@tanstack/react-query";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import * as React from "react";

export interface IChooseWebsiteFormProps {
    hash: string;
    websites: Array<any>;
    setRedirecting: any;
    closePopup: any;
}

export default function ChooseWebsiteForm({
    hash,
    websites,
    setRedirecting,
    closePopup,
}: IChooseWebsiteFormProps) {
    const [selectedWebsite, setSelectedWebsite] = React.useState("");

    const { toast } = useToast();
    const router = useRouter();

    const loginM = useMutation(adminLogin, {
        onSuccess: (res) => {
            if (res.code !== 200) {
                toast({
                    title: "Login failed",
                    description: res.errorMessage,
                    variant: "destructive",
                });
            } else {
                closePopup();
                toast({
                    title: "Login successful",
                });
                auth.setUser({
                    email: res.email,
                    token: res.accessToken,
                    website: res.website,
                    sender: res.sender,
                    walkthrough: res.walkthrough || defaultWalkthrough,
                });
                setRedirecting(true);
                router.push("/manage/newsletter");
            }
        },
    });

    const handleOnSelect = (website: string) => {
        setSelectedWebsite(website);
    };

    const onLoginClick = async () => {
        await loginM.mutateAsync({ website: selectedWebsite, hash });
    }

    const colors = [
        "slate",
        "zinc",
        "red",
        "orange",
        "amber",
        "teal",
        "cyan",
        "blue",
        "violet",
        "fuchsia",
        "rose",
    ];

    return (
        <div>
            <Command>
                <CommandInput placeholder={"Search websites..."} />
                <ScrollArea className="!overflow-auto max-h-80 nx-scrollbar">
                    <CommandEmpty>No Websites Found</CommandEmpty>
                    <CommandGroup className="!overflow-auto">
                        {websites?.map((website, i) => {
                            const isSelected = website === selectedWebsite;
                            const color = colors[i % colors.length];
                            return (
                                <CommandItem
                                    key={0}
                                    onSelect={() => handleOnSelect(website)}
                                    className={cn(
                                        "flex items-center gap-4 py-3",
                                        isSelected &&
                                            "border border-sky-500 bg-sky-100"
                                    )}
                                >
                                    <div
                                        className={`rounded-full w-[1.5em] h-[1.5em] bg-gradient-to-br from-${color}-900 to-${color}-400`}
                                    ></div>
                                    <span>{website}</span>
                                </CommandItem>
                            );
                        })}
                    </CommandGroup>
                </ScrollArea>
                <br />
                <IconButton className="w-full" disabled={!selectedWebsite} onClick={onLoginClick}>
                    {loginM.isLoading ? (
                        <MiniRotatingLoader />
                    ) : (
                        <span>
                            <span className="opacity-80">Login with </span>
                            {selectedWebsite}
                        </span>
                    )}
                </IconButton>
            </Command>
        </div>
    );
}
