"use client"
import * as React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import Button from "../../ui/button";
import { LockIcon, LogOutIcon, SettingsIcon, User2Icon } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogTrigger } from "../../ui/dialog";
import ChangePasswordForm from "./ChangePasswordForm";
import Link from "next/link";
import { deleteCookie } from "cookies-next";
import { USER_COOKIE } from "@/constants";
import { useRouter } from "next/navigation";

export interface IProfileProps {}

export default function Profile(props: IProfileProps) {
    const user = useAuth();
    const router = useRouter();

    const [changePassOpen, setChangePassOpen] = React.useState(false);

    return (
        
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        <User2Icon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                    {(user?.website || user?.email) && (
                        <>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {user?.website}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                        </>
                    )}
                    <Dialog
                        open={changePassOpen}
                        onOpenChange={setChangePassOpen}
                    >
                        <DialogTrigger style={{ width: "100%" }}>
                            <DropdownMenuItem
                                onSelect={(event) => event.preventDefault()}
                            >
                                <DropdownMenuGroup>
                                    <div className="flex items-center space-x-3 ">
                                        <LockIcon
                                            size={17}
                                            className="opacity-50"
                                        />
                                        <p>Change Password</p>
                                    </div>
                                </DropdownMenuGroup>
                            </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent usePrimitiveOverlay={true}>
                            <ChangePasswordForm
                                closePopup={() => setChangePassOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                    <Link href={"/manage/settings"}>
                        <DropdownMenuItem className="flex items-center space-x-3">
                            <SettingsIcon size={17} className="opacity-50" />
                            <p>Settings</p>
                            <DropdownMenuShortcut></DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </Link>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => {
                            router.push("/login");
                            deleteCookie(USER_COOKIE);
                        }}
                    >
                        <div className="flex items-center space-x-3">
                            <LogOutIcon size={17} className="opacity-50" />
                            <p>Log out</p>
                        </div>
                        <DropdownMenuShortcut></DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        
    );
}
