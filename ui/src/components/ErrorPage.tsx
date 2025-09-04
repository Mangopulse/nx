import AuthLayout from "@/layouts/AuthLayout";
import * as React from "react";

export interface IErrorPageProps {
    errorMessage?: string;
}

export default function ErrorPage({ errorMessage }: IErrorPageProps) {
    return (
        <div>
            <AuthLayout>
                <div className="flex flex-col gap-7 justify-center items-center w-full min-h-[90vh] text-center">
                    <span className="text-7xl font-bold">Oops</span>
                    <span>Something went wrog!</span>
                    <span>{errorMessage}</span>
                </div>
            </AuthLayout>
        </div>
    );
}
