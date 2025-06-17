import * as React from "react";
import { Container } from "./General/Container";
import { LayoutGrid } from "./General/LayoutGrid";
import { SectionTitle } from "./General/SectionTitle";
import FeatureCard from "./General/FeatureCard";
import Chip from "./General/Chip";

// ... (previous code)

export default function TemplatesFeature({ lang = "en" }: { lang?: "en" | "ar" }) {
    // Multilingual text
    const TYPOGRAPHY = {
        en: {
            CONTROL_NEWSLETTER: "Control Your Newsletter",
            TEMPLATES_BUILDER_TITLE: "Effective Templates & Powerful Builder",
            TEMPLATES_BUILDER_DESCRIPTION: (
                <span>
                    Choose from our effective, responsive and well-designed templates
                    that support all major browsers. Or{" "}
                    <strong>build your own template</strong> in our powerful drag and drop builder!
                </span>
            ),
            SCHEDULE_NEWSLETTER_TITLE: "Schedule Your Automatic Newsletter",
            SCHEDULE_NEWSLETTER_DESCRIPTION:
                "Control when your users will receive your newsletter! Daily? Weekly? Monthly? Your choice.",
            EMAIL_SENDER_TITLE: (
                <span>
                    Your Email,
                    <br />
                    Your Sender
                </span>
            ),
            EMAIL_SENDER_DESCRIPTION: (
                <span>
                    Change the email sender to any email you like to send from! You can{" "}
                    <strong>change the email provider to your own sendgrid, mailchimp or smtp server!</strong>
                </span>
            ),
            CHIP_TEMPLATE: "Template",
            CHIP_SCHEDULE: "Schedule",
            CHIP_SENDER: "Sender",
        },
        ar: {
            CONTROL_NEWSLETTER: "تحكم في النشرة الإخبارية",
            TEMPLATES_BUILDER_TITLE: "قوالب فعالة، و مركّب قوي",
            TEMPLATES_BUILDER_DESCRIPTION: (
                <span>
                    اختر من بين قوالبنا الفعّالة والاستجابية والمصممة بشكل جيد التي تدعم جميع المتصفحات الرئيسية.
                    أو{" "}
                    <strong>قم ببناء قالبك الخاص</strong> في مركّب السحب والإسقاط القوي لدينا!
                </span>
            ),
            SCHEDULE_NEWSLETTER_TITLE: "جدولة النشرة الإخبارية التلقائية",
            SCHEDULE_NEWSLETTER_DESCRIPTION:
                "تحكم في مواعيد استلام مستخدميك للنشرة الإخبارية! يمكنك التحكم بها يوميً، أسبوعيًا، شهريًا، حتى  اليوم و الساعة.",
            EMAIL_SENDER_TITLE: (
                <span>
                    بريدك الإلكتروني و
                    مرسلك الخاص
                </span>
            ),
            EMAIL_SENDER_DESCRIPTION: (
                <span>
                    قم بتغيير مرسل البريد الإلكتروني إلى أي بريد تحب إرساله منه! يمكنك{" "}
                    <strong>تغيير موفر البريد الإلكتروني إلى SendGrid, Mailchimp أو خادم SMTP الخاص بك!</strong>
                </span>
            ),
            CHIP_TEMPLATE: "قوالب ذكية",
            CHIP_SCHEDULE: "جدولة المرسال",
            CHIP_SENDER: "تحكم بالمرسل",
        },
    };

    if(!TYPOGRAPHY[lang]){
        return "Unsupported language in component TemplatesFeature"
    }

    return (
        <Container>
            <SectionTitle>
                {TYPOGRAPHY[lang].CONTROL_NEWSLETTER}
            </SectionTitle>
            <LayoutGrid>
                <FeatureCard
                    title={TYPOGRAPHY[lang].TEMPLATES_BUILDER_TITLE}
                    description={TYPOGRAPHY[lang].TEMPLATES_BUILDER_DESCRIPTION}
                    image="builder-screenshot-landing.webp"
                    className="mb-5"
                    chip={TYPOGRAPHY[lang].CHIP_TEMPLATE}
                    mediaRatio={"50%"}
                />
                <FeatureCard
                    title={TYPOGRAPHY[lang].SCHEDULE_NEWSLETTER_TITLE}
                    description={TYPOGRAPHY[lang].SCHEDULE_NEWSLETTER_DESCRIPTION}
                    image="schedule-screenshot.png"
                    className="mb-12"
                    reversed={true}
                    chip={TYPOGRAPHY[lang].CHIP_SCHEDULE}
                />
                <FeatureCard
                    title={TYPOGRAPHY[lang].EMAIL_SENDER_TITLE}
                    description={TYPOGRAPHY[lang].EMAIL_SENDER_DESCRIPTION}
                    image="sender-settings-screenshot.png"
                    className="mb-5"
                    chip={TYPOGRAPHY[lang].CHIP_SENDER}
                    mediaRatio={"48%"}
                />
            </LayoutGrid>
        </Container>
    );
}
