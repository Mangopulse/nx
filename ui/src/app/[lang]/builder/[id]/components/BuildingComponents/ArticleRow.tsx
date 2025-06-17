import {
    Button,
    Column,
    Heading,
    Img,
    Row,
    Text,
} from "@react-email/components";
import * as React from "react";
import { articleTitle, headingStyle, readMore } from "./styles";
import {
    COMPONENT_TYPES,
    DYNAMIC_WIDGETS_IMAGE_DIMENSIONS,
    DYNAMIC_WIDGETS_VARIABLES,
} from "@/constants";
import useInstance from "@/hooks/useInstance";

export interface IDescriptionProps {
    value: {
        readMoreBtn: string
    };
    style?: React.CSSProperties;
    onValueChange?: any;
}

export default function ArticleRowComponent({
    value,
    onValueChange = () => {},
}: IDescriptionProps) {
    const { instance } = useInstance();
    if (!instance) {
        return <p>no instance</p>;
    }

    const { title, image, url } = DYNAMIC_WIDGETS_VARIABLES;
    const { width, height } = DYNAMIC_WIDGETS_IMAGE_DIMENSIONS.MEDIUM;

    return (
        <Button
            nx-href={url.placeholder}
            target="_blank"
            style={{ color: "inherit", textDecoration: "inherit" }}
        >
            <Row>
                <Column style={{ width: "40%" }}>
                    <Img
                        width={width}
                        height={height}
                        src={image.placeholder}
                        style={{ borderRadius: "6px" }}
                    />
                </Column>
                <Column style={{ width: "60%" }}>
                    <Row>
                        <Text style={articleTitle}>{title.placeholder}</Text>
                    </Row>
                    <Row>
                        <Button
                            style={readMore}
                            contentEditable={true}
                            onInput={(e: any) =>
                                onValueChange({
                                    readMoreBtn: e?.target?.innerText
                                })
                            }
                        >
                            {value?.readMoreBtn || "Read More"}
                        </Button>
                    </Row>
                </Column>
            </Row>
        </Button>
    );
}
