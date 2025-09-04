import Footer from "@/components/Website/Footer";
import Header from "@/components/Website/Header";
import Script from "next/script";
import GetStartedBanner from "./[slug]/components/GetStartedBanner";
import { Container } from "@/components/Website/General/Container";
import NXScript from "@/components/tracking/NXScript";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen overflow-auto">
            <Header variant="Blog" />
            <NXScript/>
            <Container>
                {children}
            </Container>
            <Footer />
        </div>
    );
}
