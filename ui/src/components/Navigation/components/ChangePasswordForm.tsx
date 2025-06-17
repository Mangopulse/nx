import IconButton from "@/components/form/IconButton";
import Input from "@/components/form/Input";
import { Close } from "@radix-ui/react-dialog";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import changePassword from "@/services/user/changePassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import MiniRotatingLoader from "@/components/loaders/MiniRotatingLoader";
import { useToast } from "@/components/ui/use-toast";

export default function ChangePasswordForm({closePopup}: any) {
    const changePasswordSchema = z
        .object({
            currentPassword: z.string(),
            newPassword: z
                .string()
                .min(8)
                .max(30)
                .refine((value) => /[A-Z]/.test(value), {
                    message:
                        "Password must contain at least one uppercase letter",
                })
                .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
                    message:
                        "Password must contain at least one special character",
                }),
            confirmNewPassword: z.string(),
        })
        .refine((data) => data.newPassword === data.confirmNewPassword, {
            message: "Passwords don't match",
            path: ["confirmNewPassword"],
        });

    const form = useForm({
        resolver: zodResolver(changePasswordSchema),
    });
    const {toast} = useToast()
    const submitM = useMutation(changePassword, {
        onSuccess: (res) => {
            console.log(res)
            if(res.code === 200){
                toast({
                    title: 'Password changed successfully'
                });
                closePopup();
            }
            else{
                toast({
                    title: 'Something went wrong',
                    description: res.errorMessage,
                    variant: 'destructive',
                });
            }
        },
    });

    const onSubmit = async (fv: any) => {
        await submitM.mutateAsync(fv);
    };

    return (
        <>
            <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-2"
                >
                    <Input
                        placeholder="Enter your current password"
                        label="Current Password"
                        control={form.control}
                        name="currentPassword"
                        type="password"
                    />
                    <Input
                        placeholder="Enter a new password"
                        label="New Password"
                        control={form.control}
                        name="newPassword"
                        type="password"
                    />
                    <Input
                        placeholder="Confirm the new password (retype it)"
                        label="Confirm New Password"
                        control={form.control}
                        name="confirmNewPassword"
                        type="password"
                    />
                    <div className="flex justify-end gap-2">
                        <Close>
                            <IconButton variant="outline">Cancel</IconButton>
                        </Close>
                        <IconButton type="submit">
                            {
                                submitM.isLoading
                                ? <div className="flex items-center space-x-2">
                                    <MiniRotatingLoader/>
                                    Submitting....
                                </div>
                                : 'Submit'
                            }
                        </IconButton>
                    </div>
                </form>
            </Form>
        </>
    );
}
