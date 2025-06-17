import ClarityScript from "@/components/tracking/ClarityScript";
import GAScript from "@/components/tracking/GAScript";
import NXScript from "@/components/tracking/NXScript";
import TrackReferral from "@/components/tracking/TrackReferral";
import AIFeatures from "@/components/Website/AIFeatures";
import CollectorFeatures from "@/components/Website/CollectorFeatures";
import FAQ from "@/components/Website/FAQ";
import Footer from "@/components/Website/Footer";
import Guide from "@/components/Website/Guide";
import Header from "@/components/Website/Header";
import Hero from "@/components/Website/Hero/Hero";
import OnboardSteps from "@/components/Website/OnboardSteps";
import Packages from "@/components/Website/Packages";
import PowerfulAnalytics from "@/components/Website/PowerfulAnalytics";
import SignupFormDialog from "@/components/Website/SignupFormDialog";
import TemaplatesFeature from "@/components/Website/TemplatesFeatures";
import WordpressBanner from "@/components/Website/WordpressBanner";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Personalized Email Newsletter In One Click!",
    description:
        "Start collecting emails and send personalised automatic emails to your users in few minutes for FREE.",
};

export default function Home({ searchParams, params }: any) {
    const { lang } = params;
    return (
        <div className="max-h-[100vh] overflow-auto">
            <Header openSignupByDefault={searchParams?.signupopen} lang={lang}/>
            <Hero lang={lang} />
            <AIFeatures lang={lang} />
            <TemaplatesFeature lang={lang} />
            <CollectorFeatures lang={lang} />
            <PowerfulAnalytics lang={lang} />
            <OnboardSteps lang={lang} />
            <WordpressBanner lang={lang} />
            <Guide lang={lang} />
            <FAQ lang={lang} />
            <Packages lang={lang} />
            <Footer lang={lang} />
            {/* tracking */}
            <TrackReferral />
            <NXScript />
            <GAScript />
        </div>
    );
}
