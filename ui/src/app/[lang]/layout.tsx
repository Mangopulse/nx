import { Noto_Kufi_Arabic, Poppins } from "next/font/google";
import "@/styles/globals.scss";
import "@/styles/globals.css";
import "tailwindcss/tailwind.css";
import Providers from "@/components/Providers";
import { Metadata } from "next";
import ClarityScript from "@/components/tracking/ClarityScript";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
});

const noto = Noto_Kufi_Arabic({
    subsets: ["arabic"],
    weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
    title: "NewsletterX | Personalized Email Newsletter in One Click",
    openGraph: {
        title: "NewsletterX | Personalized Email Newsletterin One Click",
        images: ["https://newsletterx.cognativex.com/img/opengraph-image.png"],
    },
};

export default function RootLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: any
}) {
    const {lang} = params;
    return (
        <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
            <ClarityScript/>
            <body className={`${lang === "ar" ? noto.className : poppins.className}`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
