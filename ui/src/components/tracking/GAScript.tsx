"use client"
import Script from "next/script";
import * as React from "react";

export interface IGAScriptProps {}

export default function GAScript(props: IGAScriptProps) {
    return (
        <>
            <Script
                strategy="lazyOnload"
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
            />
            <Script strategy="lazyOnload" id="ga">
                {`
                    if(window){
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-FF1Y9T9CYL');
                    }
                `}
            </Script>
        </>
    );
}
