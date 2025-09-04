/* eslint-disable react/no-unescaped-entities */
"use client";
import "./styles.scss";
import "@/styles/globals.scss";
import imgLoader from "@/helpers/image";
import ReCAPTCHA from "react-google-recaptcha";
import Image from "next/image";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import Input from "@/components/form/Input";
import Button from "@/components/ui/button";
import IconButton from "@/components/form/IconButton";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import login from "@/services/auth/login";
import MiniRotatingLoader from "@/components/loaders/MiniRotatingLoader";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import AuthLayout from "@/layouts/AuthLayout";
import { Toaster } from "@/components/ui/toaster";
import auth from "@/lib/Auth";
import { defaultWalkthrough } from "@/constants";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import ChooseWebsiteForm from "./components/ChooseWebsiteForm";

export default function Login() {
    const [redirecting, setRedirecting] = React.useState(false);
    const [openAdminPopup, setOpenAdminPopup] = React.useState(false);
    const [adminHash, setAdminHash] = React.useState();
    const [websitesList, setWebsitesList] = React.useState([]);

    const LoginForm = () => {
        const loginValidationSchema = z.object({
            email: z.string().email("Invalid email"),
            password: z.string(),
        });

        const form = useForm({
            resolver: zodResolver(loginValidationSchema),
        });

        const { toast } = useToast();
        const router = useRouter();

        const loginM = useMutation(login, {
            onSuccess: (res) => {
                if (res.code !== 200) {
                    toast({
                        title: "Login failed",
                        description: res.errorMessage,
                        variant: "destructive",
                    });
                } else {
                    const isAdmin = res.superUser;
                    toast({
                        title: (isAdmin ? "Admin " : "") + "Login successful",
                    });
                    if (isAdmin) {
                        setAdminHash(res.superUser);
                        setWebsitesList(res.websites);
                        setOpenAdminPopup(true);
                    } else {
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
                }
            },
        });

        const onSubmit = async (formValues: any) => {
            await loginM.mutateAsync(formValues);
        };

        const recaptchaRef = React.useRef<ReCAPTCHA>(null);

        const handleCaptchaSubmission = (token: string | null) => {
            console.log(token);
        };

        return (
            <Form {...form}>
                <form
                    className="px-5 md:px-0flex justify-center items-start flex-col m-auto md:w-[80%] lg:w-[80%] 2xl:w-[60%]"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <h1 className="text-4xl font-bold py-5 ">Welcome!</h1>
                    <div className="login-form w-full flex flex-col space-y-4">
                        <Input
                            className="w-full"
                            placeholder="Enter your username or your email"
                            label="Email"
                            control={form.control}
                            name="email"
                        />
                        <Input
                            className="w-full py-4"
                            type="password"
                            placeholder="Enter your password"
                            label="Password"
                            control={form.control}
                            name="password"
                        />

                        {/* <ReCAPTCHA
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                            ref={recaptchaRef}
                            onChange={handleCaptchaSubmission}
                        /> */}
                        <div>
                            <IconButton className="w-full mb-2" type="submit">
                                {loginM.isLoading ? (
                                    <MiniRotatingLoader />
                                ) : (
                                    "Login"
                                )}
                            </IconButton>
                            <Link
                                href={"/login/forgot"}
                                aria-label="forget password"
                                className="text-sm block text-center w-full text-sky-500 underline"
                            >
                                Forgot my password
                            </Link>

                            <p className="text-primary/40 text-center mt-3">
                                Don't have an account?{" "}
                                <Link
                                    aria-label="go to signup"
                                    href="/signup"
                                    className="text-primary/70 underline"
                                >
                                    Signup
                                </Link>
                            </p>
                        </div>
                    </div>
                </form>

                <Dialog open={openAdminPopup} onOpenChange={setOpenAdminPopup}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Hello Admin! Login With:</DialogTitle>
                            <DialogDescription>
                                Which client would you like to login to
                                newsletterx with?
                            </DialogDescription>
                        </DialogHeader>
                        <ChooseWebsiteForm
                            hash={adminHash || ""}
                            websites={websitesList}
                            setRedirecting={setRedirecting}
                            closePopup={() => setOpenAdminPopup(false)}
                        />
                    </DialogContent>
                </Dialog>
            </Form>
        );
    };

    return (
        <>
            <div className="md:grid md:grid-cols-2 h-screen overflow-hidden">
                <div className="hidden md:flex h-screen justify-center items-center space-y-10 bg-primary flex-col">
                    <Link className="img-wrap w-80 pt-[4%]" href={"/"}>
                        <Image
                            loader={imgLoader}
                            src="newsletterX-logo.svg"
                            alt="logo"
                            fill
                        />
                    </Link>
                    <p className="text-secondary text-2xl">
                        Let's make great things together.
                    </p>
                </div>
                {redirecting ? (
                    <div className=" w-full h-full flex justify-center items-center flex-col m-auto ">
                        <MiniRotatingLoader />
                    </div>
                ) : (
                    <LoginForm />
                )}
            </div>
            <Toaster />
        </>
    );
}
