"use client";

import MainLayout from "@/layouts/MainLayout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Manage() {
    const router = useRouter();

    useEffect(() => {
        // Push to the desired route when the component loads
        router.push("/manage/newsletter");
    }, []);

    return <></>
}
