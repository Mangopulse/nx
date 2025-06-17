import HeadingRow from "@/app/[lang]/builder/[id]/components/Blocks/HeadingRow";
import Heading from "@/app/[lang]/builder/[id]/components/BuildingComponents/Heading";
import Description from "@/app/[lang]/builder/[id]/components/BuildingComponents/Description";
import Image from "@/app/[lang]/builder/[id]/components/BuildingComponents/Image";
import CoverBlock from "@/app/[lang]/builder/[id]/components/Blocks/CoverBlock";
import ArticleRowComponent from "./app/[lang]/builder/[id]/components/BuildingComponents/ArticleRow";
import BasicWidget from "./app/[lang]/builder/[id]/components/Blocks/BasicWidget";
import BasicFooter from "./app/[lang]/builder/[id]/components/Blocks/BasicFooter";
import SocialIconsComponent from "./app/[lang]/builder/[id]/components/BuildingComponents/SocialIcons";
import { Walkthrough } from "./types";

export const USER_COOKIE = "user";

export const COOKIE_REF_NAME = "nx-ref";

export const strapiUrl = "https://nx-blog-dhczmo2e7a-uc.a.run.app";

export const EMAIL_BUILDER_WIDTH = 600;

export const MAXIMUM_ARTICLE_COUNT = 15;

export const DYNAMIC_WIDGETS_VARIABLES: any = {
    title: {
        placeholder: "This is the title of the recommended article",
        replaceWith: "@@TITLE-INDEX@@",
    },
    image: {
        placeholder: "/img/placeholder.png",
        replaceWith: "@@IMAGE-INDEX@@",
    },
    url: {
        placeholder: "https://newsletterx.cognativex.com",
        replaceWith: "@@URL-INDEX@@",
    },
};

export const DYNAMIC_WIDGETS_IMAGE_DIMENSIONS = {
    MEDIUM: {
        width: 240,
        height: 150,
    },
};

export const LOCAL_IMAGES_REPLACEMENTS: any = {
    facebookIcon: {
        placeholder: "/img/facebook.png",
        replaceWith: "https://newsletterx-dev.cognativex.com/img/facebook.png",
    },
    instagramIcon: {
        placeholder: "/img/instagram.png",
        replaceWith: "https://newsletterx-dev.cognativex.com/img/instagram.png",
    },
    twitterIcon: {
        placeholder: "/img/twitter.png",
        replaceWith: "https://newsletterx-dev.cognativex.com/img/twitter.png",
    },
};

export const VIDEOS = [
    {
        title: {
            en: "Complete Walkthrough",
            ar: "دورة كاملة",
        },
        thumb: "video-thumbs/video-thumb-completeWalkthrough.webp",
        url: "https://www.youtube.com/embed/77ZRDED9bK0?si=9ll-ZBfnb0eLDFYB",
    },
    {
        title: {
            en: "Signing Up",
            ar: "كيفية التسجيل",
        },
        thumb: "video-thumbs/video-thumb-signup.webp",
        url: "https://www.youtube.com/embed/BG8hzrIz_Ww?si=CEvUj7kE0Urij5Ar",
    },
    {
        title: {
            en: "Integrating With NewsletterX Script And Customizing Your Collector",
            ar: "كيفية تثبيت برمجيات NewsletterX و التعديل على مجمع البريد الالكتروني",
        },
        thumb: "video-thumbs/video-thumb-integrationAndCollector.webp",
        url: "https://www.youtube.com/embed/Ksc45672kN4?si=256DrtWJJ88S68_v",
    },
    {
        title: {
            en: "Using The Builder",
            ar: "استخدام مركب القوالب",
        },
        thumb: "video-thumbs/video-thumb-builder.webp",
        url: "https://www.youtube.com/embed/Ui4ayBMbsCU?si=6esYVZQfEsvtNRJM",
    },
    {
        title: {
            en: "Using Your Own Email Provider",
            ar: "استخدام مزود البريد الإلكتروني الخاص بك",
        },
        thumb: "video-thumbs/video-thumb-emailProvider.webp",
        url: "https://www.youtube.com/embed/ug72P9lQ3Tc?si=z5QL11Jb9gtIHBKL",
    },
];

// -------BUILDER--------

// TYPES
export const PROPERTY_TYPES = {
    FONT_SIZE: "FONT_SIZE",
    FONT_WEIGHT: "FONT_WEIGHT",
    COLOR: "COLOR",
    SOURCE: "SOURCE",
    BORDER_RADIUS: "BORDER_RADIUS",
    SOCIAL_LINKS: "SOCIAL_LINKS",
    MARGIN_HORIZONTAL: "MARGIN_HORIZONTAL",
    MARGIN_VERTICAL: "MARGIN_VERTICAL",
    PADDING: "PADDING",
    BACKGROUND_COLOR: "BACKGROUND_COLOR",
    TEXT_ALIGN: "TEXT_ALIGN",
    DIRECTION: "DIRECTION",
    RECOMMENDATION_LOGIC: "RECOMMENDATION_LOGIC",
    ARTICLES_COUNT: "ARTICLES_COUNT",
    BACKGROUND_IMAGE: "BACKGROUND_IMAGE",
};
export const COMPONENT_TYPES = {
    HEADING: "HEADING",
    DESCRIPTION: "DESCRIPTION",
    IMAGE: "IMAGE",
    ARTICLE_ROW: "ARTICLE_ROW",
    SOCIAL_ICONS: "SOCIAL_ICONS",
};
export const BLOCK_TYPES = {
    COVER: "COVER",
    HEADING_ROW: "HEADING_ROW",
    BASIC_WIDGET: "BASIC_WIDGET",
    FOOTER: "FOOTER",
};

// PROPERTY_GROUPS
export const PROPERTY_GROUPS = {
    GENERAL_CONTAINER_PROPERTIES: [
        {
            type: PROPERTY_TYPES.PADDING,
            defaultValue: {
                inline: 20,
                block: 20,
            },
        },
        {
            type: PROPERTY_TYPES.BORDER_RADIUS,
            defaultValue: 10,
        },
        {
            type: PROPERTY_TYPES.BACKGROUND_COLOR,
            defaultValue: "#FFFFFF",
        },
        {
            type: PROPERTY_TYPES.BACKGROUND_IMAGE,
            defaultValue: "",
        },
        {
            type: PROPERTY_TYPES.MARGIN_VERTICAL,
            defaultValue: 0,
        },
    ],
};

// POOLS
export const PROPERTIES_POOL = {
    [PROPERTY_TYPES.FONT_SIZE]: {
        name: "Font Size",
        unit: "px",
        dataType: "number",
        cssName: "fontSize",
        validation: (value: any) => typeof value === "number",
    },
    [PROPERTY_TYPES.FONT_WEIGHT]: {
        name: "Font Weight",
        dataType: "number",
        cssName: "fontWeight",
        validation: (value: any) => typeof value === "number",
    },
    [PROPERTY_TYPES.COLOR]: {
        name: "Text Color",
        dataType: "color",
        cssName: "color",
        validation: (value: any) => typeof value === "number",
    },
    [PROPERTY_TYPES.SOURCE]: {
        name: "Source",
        dataType: "source",
    },
    [PROPERTY_TYPES.BORDER_RADIUS]: {
        name: "Rounding",
        dataType: "number",
        unit: "px",
        cssName: "borderRadius",
    },
    [PROPERTY_TYPES.SOCIAL_LINKS]: {
        name: "Social Links",
        dataType: "custom",
    },
    [PROPERTY_TYPES.PADDING]: {
        name: "Padding",
        dataType: "custom",
    },
    [PROPERTY_TYPES.MARGIN_HORIZONTAL]: {
        name: "Horizontal Margin",
        dataType: "number",
        unit: "px",
        cssName: "marginInline",
    },
    [PROPERTY_TYPES.MARGIN_VERTICAL]: {
        name: "Vertical Spacing",
        dataType: "number",
        unit: "px",
        cssName: "marginBlock",
    },
    [PROPERTY_TYPES.BACKGROUND_COLOR]: {
        name: "Background Color",
        dataType: "color",
        cssName: "backgroundColor",
        validation: (value: any) => typeof value === "number",
    },
    [PROPERTY_TYPES.TEXT_ALIGN]: {
        name: "Text Alignment",
        dataType: "custom",
        cssName: "textAlign",
        validation: (value: any) =>
            value === "center" || value === "left" || value === "right",
    },
    [PROPERTY_TYPES.DIRECTION]: {
        name: "Direction",
        cssName: "direction",
        dataType: "custom",
    },
    [PROPERTY_TYPES.RECOMMENDATION_LOGIC]: {
        name: "News Recommendation Logic",
        dataType: "dropdown",
        dropdownItems: [
            {
                label: "Trending News",
                value: "TRENDING_WIDGET",
            },
            {
                label: "Personalized News",
                value: "CONTENT_WIDGET",
            },
        ],
    },
    [PROPERTY_TYPES.ARTICLES_COUNT]: {
        name: "Artilcles Count",
        dataType: "number",
    },
    [PROPERTY_TYPES.BACKGROUND_IMAGE]: {
        name: "Background Image",
        cssName: "backgroundImage",
        dataType: "url",
    },
};

export const COMPONENTS_POOL = {
    [COMPONENT_TYPES.HEADING]: {
        name: "Heading",
        element: Heading,
        properties: [
            { type: PROPERTY_TYPES.TEXT_ALIGN, defaultValue: "center" },
            { type: PROPERTY_TYPES.FONT_SIZE, defaultValue: 30 },
            { type: PROPERTY_TYPES.FONT_WEIGHT, defaultValue: 800 },
            { type: PROPERTY_TYPES.COLOR, defaultValue: "#000000" },
        ],
    },
    [COMPONENT_TYPES.DESCRIPTION]: {
        name: "Description",
        element: Description,
        properties: [
            { type: PROPERTY_TYPES.TEXT_ALIGN, defaultValue: "center" },
            { type: PROPERTY_TYPES.FONT_SIZE, defaultValue: 16 },
            { type: PROPERTY_TYPES.FONT_WEIGHT, defaultValue: 400 },
            { type: PROPERTY_TYPES.COLOR, defaultValue: "#a8a8a8" },
        ],
    },
    [COMPONENT_TYPES.IMAGE]: {
        name: "Image",
        element: Image,
        properties: [
            {
                type: PROPERTY_TYPES.SOURCE,
                defaultValue: "/img/placeholder.png",
            },
            { type: PROPERTY_TYPES.BORDER_RADIUS, defaultValue: 10 },
            // {
            //     type: PROPERTY_TYPES.PADDING,
            //     defaultValue: {
            //         inline: 0,
            //         block: 0,
            //     },
            // },
        ],
    },
    [COMPONENT_TYPES.ARTICLE_ROW]: {
        name: "Article Row",
        element: ArticleRowComponent,
    },
    [COMPONENT_TYPES.SOCIAL_ICONS]: {
        name: "Social Icons",
        element: SocialIconsComponent,
        properties: [
            {
                type: PROPERTY_TYPES.SOCIAL_LINKS,
                defaultValue: {
                    facebook: "facebook.com",
                    instagram: "instagram.com",
                    twitter: "x.com",
                },
            },
        ],
    },
};

export const BLOCKS_POOL = {
    [BLOCK_TYPES.HEADING_ROW]: {
        name: "Heading row",
        preview: "/img/builder-previews/headingRowPreview.png",
        element: HeadingRow,
        components: [
            {
                type: COMPONENT_TYPES.HEADING,
                key: "MainHeading",
                defaultValue: "This is a heading",
            },
            {
                type: COMPONENT_TYPES.DESCRIPTION,
                key: "Description",
                defaultValue:
                    "This is the heading description, you can keep it or remove it!",
            },
        ],
        properties: [...PROPERTY_GROUPS.GENERAL_CONTAINER_PROPERTIES],
    },
    [BLOCK_TYPES.COVER]: {
        name: "Image Cover",
        preview: "/img/placeholder.png",
        element: CoverBlock,
        components: [
            {
                type: COMPONENT_TYPES.IMAGE,
                key: "CoverImage",
                defaultValue: "/img/placeholder.png",
            },
        ],
        // properties: [...PROPERTY_GROUPS.GENERAL_CONTAINER_PROPERTIES],
    },
    [BLOCK_TYPES.BASIC_WIDGET]: {
        name: "News Recommendation",
        preview: "/img/builder-previews/basicWidgetPreview.png",
        element: BasicWidget,
        components: [
            {
                type: COMPONENT_TYPES.ARTICLE_ROW,
                key: "ArticleRow",
            },
        ],
        extra: {
            imageSize: DYNAMIC_WIDGETS_IMAGE_DIMENSIONS.MEDIUM,
            postsCount: 3,
        },
        properties: [
            {
                type: PROPERTY_TYPES.RECOMMENDATION_LOGIC,
                defaultValue: "CONTENT_WIDGET",
            },
            {
                type: PROPERTY_TYPES.ARTICLES_COUNT,
                defaultValue: 3,
            },
            {
                type: PROPERTY_TYPES.DIRECTION,
                defaultValue: "ltr",
            },
            ...PROPERTY_GROUPS.GENERAL_CONTAINER_PROPERTIES,
        ],
    },
    [BLOCK_TYPES.FOOTER]: {
        name: "Basic Footer",
        preview: "/img/builder-previews/basicFooterPreview.png",
        element: BasicFooter,
        components: [
            {
                type: COMPONENT_TYPES.SOCIAL_ICONS,
                key: "footerSocialIcons",
                aliasName: "Footer Social Links",
                defaultValue: {
                    facebook: "facebook.com",
                    instagram: "instagram.com",
                    twitter: "x.com",
                },
            },
            {
                type: COMPONENT_TYPES.DESCRIPTION,
                key: "FooterEpilogue",
                aliasName: "Footer Epilogue",
                defaultValue:
                    "You are recieving this email because you are subscribed to our newsletter. You can unsubscribe any time by clicking the link below",
            },
        ],
        properties: [...PROPERTY_GROUPS.GENERAL_CONTAINER_PROPERTIES],
    },
};

export const WALKTHROUGH_PAGES = {
    NEWSLETTERS_LIST: "NEWSLETTERS_LIST",
    COLLECTORS_LIST: "COLLECTORS_LIST",
} as const;

export const daysOfWeek = [
    { label: "Sunday", value: "sunday" },
    { label: "Monday", value: "monday" },
    { label: "Tuesday", value: "tuesday" },
    { label: "Wednesday", value: "wednesday" },
    { label: "Thursday", value: "thursday" },
    { label: "Friday", value: "friday" },
    { label: "Saturday", value: "saturday" },
];

export const timeOptions = [
    { value: "0", label: "12:00 AM" },
    { value: "1", label: "1:00 AM" },
    { value: "2", label: "2:00 AM" },
    { value: "3", label: "3:00 AM" },
    { value: "4", label: "4:00 AM" },
    { value: "5", label: "5:00 AM" },
    { value: "6", label: "6:00 AM" },
    { value: "7", label: "7:00 AM" },
    { value: "8", label: "8:00 AM" },
    { value: "9", label: "9:00 AM" },
    { value: "10", label: "10:00 AM" },
    { value: "11", label: "11:00 AM" },
    { value: "12", label: "12:00 PM" },
    { value: "13", label: "1:00 PM" },
    { value: "14", label: "2:00 PM" },
    { value: "15", label: "3:00 PM" },
    { value: "16", label: "4:00 PM" },
    { value: "17", label: "5:00 PM" },
    { value: "18", label: "6:00 PM" },
    { value: "19", label: "7:00 PM" },
    { value: "20", label: "8:00 PM" },
    { value: "21", label: "9:00 PM" },
    { value: "22", label: "10:00 PM" },
    { value: "23", label: "11:00 PM" },
];

export const daysOfMonth = [
    { label: "1st day", value: "01" },
    { label: "2nd day", value: "02" },
    { label: "3rd day", value: "03" },
    { label: "4th day", value: "04" },
    { label: "5th day", value: "05" },
    { label: "6th day", value: "06" },
    { label: "7th day", value: "07" },
    { label: "8th day", value: "08" },
    { label: "9th day", value: "09" },
    { label: "10th day", value: "10" },
    { label: "11th day", value: "11" },
    { label: "12th day", value: "12" },
    { label: "13th day", value: "13" },
    { label: "14th day", value: "14" },
    { label: "15th day", value: "15" },
    { label: "16th day", value: "16" },
    { label: "17th day", value: "17" },
    { label: "18th day", value: "18" },
    { label: "19th day", value: "19" },
    { label: "20th day", value: "20" },
    { label: "21st day", value: "21" },
    { label: "22nd day", value: "22" },
    { label: "23rd day", value: "23" },
    { label: "24th day", value: "24" },
    { label: "25th day", value: "25" },
    { label: "26th day", value: "26" },
    { label: "27th day", value: "27" },
    { label: "28th day", value: "28" },
    { label: "29th day", value: "29" },
    { label: "30th day", value: "30" },
];

export const defaultWalkthrough: Walkthrough = [
    {
        page: WALKTHROUGH_PAGES.NEWSLETTERS_LIST,
        shouldShow: true,
    },
    {
        page: WALKTHROUGH_PAGES.COLLECTORS_LIST,
        shouldShow: true,
    },
];
