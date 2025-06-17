"use client";
import { useHubspotForm } from "next-hubspot";
import { HubspotProvider } from "next-hubspot";
import { SectionTitle } from "./General/SectionTitle";
import React, { useState } from "react";
import useInViewport from "@/hooks/useInViewport";
import MiniRotatingLoader from "../loaders/MiniRotatingLoader";

function Form({ rendered, setRendered, lang }: {rendered: boolean; setRendered: any; lang: "ar" | "en"}) {

    const TYPOGRAPHY = {
        en: {
            CONTACT_US: "Contact Us"
        },
        ar: {
            CONTACT_US: "اتصل بنا"
        },
    }

    const { loaded, error, formCreated } = useHubspotForm({
        portalId: "5878791",
        formId: "eaaae4a0-fda7-452e-a590-7b72f2daea3c",
        target: "#hubspot-form-wrapper",
    });

    if (formCreated && loaded && !rendered) {
        setRendered(true);
    }


    return (
        <div id="contact-us">
            <SectionTitle className="text-primary-foreground mb-11">
                {TYPOGRAPHY[lang].CONTACT_US}
            </SectionTitle>
            <div id="hubspot-form-wrapper"/>
            {(!loaded || !formCreated) && (
                <div className="flex w-full justify-center">
                    <MiniRotatingLoader />
                </div>
            )}
        </div>
    );
}

export default function ContactUsForm({lang="en"}: {lang?: "en" | "ar"}) {
    const ref = React.useRef(null);
    const inViewPort = useInViewport(ref);

    const [rendered, setRendered] = useState(false);

    return (
        <div className="" ref={ref}>
            {rendered || inViewPort ? (
                <HubspotProvider>
                    <Form rendered={rendered} setRendered={setRendered} lang={lang}/>
                </HubspotProvider>
            ) : (
                <div className="flex w-full justify-center">
                    <MiniRotatingLoader />
                </div>
            )}
        </div>
    );
}
