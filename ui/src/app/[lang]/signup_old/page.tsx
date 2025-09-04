"use client";
import Image from "next/image";
import { useForm } from "react-hook-form";
import imgLoader from "@/helpers/image";
import Glow from "@/components/Glow";
import { Copyright } from "@/components/Copyright";
import Input from "@/components/form/Input";
import { Form } from "@/components/ui/form";
import Button from "@/components/ui/button";

const Signup = () => {
    const form = useForm();

    const onSubmit = (formVals: any) => {
        console.log(formVals);
    };

    return (
        <div className="signup-container">
            <div className="visual-side img-wrap">
                <Image
                    src={"signupVisual.jpg"}
                    alt="visual"
                    loader={imgLoader}
                    fill
                />
            </div>
            <div className="form-side">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="form-title">
                            <h2 className="text-xl"> <strong> Welcome To NewsletterX </strong> </h2>
                            <p className="muted">
                                Signup for free and start sending personalised &
                                targeted newsletters easily!
                            </p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="workEmail">Work Email</label>
                            <Input
                                type="text"
                                placeholder="Enter your work email"
                                name="workEmail"
                                control={form.control}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <Input
                                type="password"
                                placeholder="Create your password"
                                name="password"
                                control={form.control}
                            />
                        </div>
                        <Button className="mt-1" variant={'default'} type="submit"> signup </Button>
                    </form>
                </Form>
                <Copyright />
                <Glow
                    top="15%"
                    left="15%"
                    intensity="medium"
                    color="red"
                    size="medium"
                />
                <Glow
                    bottom="10%"
                    right="10%"
                    intensity="high"
                    color="lightblue"
                    size="large"
                />
            </div>
        </div>
    );
};

export default Signup;
