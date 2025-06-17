import Component from "./app/[lang]/builder/[id]/Entities/Component";
import Property from "./app/[lang]/builder/[id]/Entities/Property";
import { WALKTHROUGH_PAGES } from "./constants";

export type User = {
    token: string;
    email: string;
    website: string;
    sender?: Sender;
    walkthrough?: Walkthrough;
};

export type Walkthrough = {
    page: keyof typeof WALKTHROUGH_PAGES;
    shouldShow: boolean;
}[];

export type Sender = {
    id: number;
    name: string;
    email: string;
    verified: boolean;
    type: string; // not used
    locked: boolean; // not used
};

export interface IBlock {
    components: Array<Component>;
    properties: Array<Property>;
}

export type Config = {
    isActive: boolean;
    analyticsEnabled: boolean;
    website: string;
    packageType: string;
    emailQuota?: number;
    apiKey?: string;
    senderEmail?: string;
    senderType: "cx_sendgrid_default" | "sendgird" | "mailchimp";
};

export type DateInterval = {
    from: Date;
    to: Date;
};

// strapi
export type StrapiResponse<T> = {
    data: T;
    meta?: {
        pagination?: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
};

export type RawPost = {
    id: number;
    attributes: {
        title: string;
        creationAt: string;
        publishedAt: string;
        content: string;
        image: RawPostImage;
        slug: string;
    };
};

export type RawPostImageFormat = {
    name: string;
    hash: string;
    ext: string;
    mime: string;
    path: null | string;
    width: number;
    height: number;
    size: number;
    url: string;
};

export type RawPostImage = {
    data: {
        id: number;
        attributes: {
            name: string;
            alternativeText: null | string;
            caption: null | string;
            width: number;
            height: number;
            formats: {
                thumbnail: RawPostImageFormat;
                large: RawPostImageFormat;
                small: RawPostImageFormat;
                medium: RawPostImageFormat;
            };
            hash: string;
            ext: string;
            mime: string;
            size: number;
            url: string;
            previewUrl: null | string;
            provider: string;
            provider_metadata: null | Record<string, any>;
            createdAt: string;
            updatedAt: string;
        };
    };
};

export type PostImage = {
    url: string;
    alternativeText: null | string;
    caption: null | string;
    width: number;
    height: number;
};

export type Post = {
    id: number;
    title: string;
    date: Date;
    content: string;
    image: PostImage | undefined;
    slug: string;
};
