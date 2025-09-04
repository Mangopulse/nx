import {
    Button,
    Column,
    Heading,
    Img,
    Link,
    Row,
    Text,
} from "@react-email/components";
import * as React from "react";
import { articleTitle, headingStyle, readMore } from "./styles";
import {
    COMPONENT_TYPES,
    DYNAMIC_WIDGETS_IMAGE_DIMENSIONS,
    DYNAMIC_WIDGETS_VARIABLES,
    LOCAL_IMAGES_REPLACEMENTS,
} from "@/constants";
import useInstance from "@/hooks/useInstance";

export default function SocialIconsComponent({ value }: any) {
    const { instance } = useInstance();
    if (!instance) {
        return <p>no instance</p>;
    }

    const {facebookIcon, instagramIcon, twitterIcon} = LOCAL_IMAGES_REPLACEMENTS;

    return (
        <Row style={{ marginBottom: "20px" }}>
            {value?.facebook && (
                <Column align="center">
                    <Link nx-href={value?.facebook}>
                        <Img
                            src={facebookIcon.placeholder}
                            alt="facebook"
                            width={50}
                        />
                    </Link>
                </Column>
            )}
            {value?.instagram && (
                <Column align="center">
                    <Link nx-href={value?.instagram}>
                        <Img
                            src={instagramIcon.placeholder}
                            alt="instagram"
                            width={50}
                        />
                    </Link>
                </Column>
            )}
            {value?.twitter && (
                <Column align="center">
                    <Link nx-href={value?.twitter}>
                        <Img
                            src={twitterIcon.placeholder}
                            alt="twitter"
                            width={50}
                        />
                    </Link>
                </Column>
            )}{" "}
        </Row>
    );
}
