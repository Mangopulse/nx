import { EMAIL_BUILDER_WIDTH, PROPERTY_TYPES } from "@/constants";
import {
    Body,
    Button,
    Container,
    Column,
    Head,
    Html,
    Img,
    Preview,
    Link,
    Row,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";
import BlockPreview from "../BlockPreview";
import {
    containerStyle,
    descriptionStyle,
    headingStyle,
} from "../BuildingComponents/styles";
import HeadingComponent from "../BuildingComponents/Heading";
import DescriptionComponent from "../BuildingComponents/Description";
import Component from "../../Entities/Component";
import { BuildingComponent } from "../BuildingComponent";
import Property from "../../Entities/Property";
import { IBlock } from "@/types";
import {
    getPropertyValue,
    getStyleFromProperties,
} from "@/helpers/builder";

export const BasicWidget = ({ components, properties }: IBlock) => {
    const style: React.CSSProperties = getStyleFromProperties(properties);
    let articlesCount = getPropertyValue(PROPERTY_TYPES.ARTICLES_COUNT, properties);
    if(articlesCount === undefined) articlesCount = 3;
    const articles = new Array((parseInt(articlesCount))).fill(0);

    return (
        <Container style={{ ...containerStyle, ...style }}>
            <Section>
                {articles?.map((_, i) => (
                    <>
                        <BuildingComponent componentKey="ArticleRow" />
                        {i !== articlesCount - 1 ? <br /> : ""}
                    </>
                ))}
            </Section>
        </Container>
    );
};

export default BasicWidget;
