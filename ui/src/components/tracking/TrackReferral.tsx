"use client";
import { COOKIE_REF_NAME } from "@/constants";
import { getCookie, setCookie } from "cookies-next";
import { useEffect } from "react";

export default function TrackReferral() {
    useEffect(() => {
        const nxRef = decodeURIComponent(String(getCookie(COOKIE_REF_NAME)));
        if (!nxRef || !nxRef?.includes("utm")) {
            setCookie(COOKIE_REF_NAME, encodeURIComponent(window.location.href));
        }
    }, []);

    
    return <></>;
}
