import Script from "next/script";
import * as React from "react";

export default function NXScript() {
    return (
        <Script
            src={`https://static-platform.cognativex.com/scripts/nx_script.js?v=${
                new Date().getMilliseconds() + Math.random()
            }`}
            data-vendor="newsletterx"
            data-domain="newsletterx.cognativex.com"
        />
    );
}
