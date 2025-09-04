import { EMAIL_BUILDER_WIDTH } from "@/constants";
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
import { containerStyle, descriptionStyle, headingStyle } from "../BuildingComponents/styles";
import HeadingComponent from "../BuildingComponents/Heading";
import DescriptionComponent from "../BuildingComponents/Description";
import Component from "../../Entities/Component";
import { BuildingComponent } from "../BuildingComponent";
import Property from "../../Entities/Property";
import { IBlock } from "@/types";
import { getStyleFromProperties } from "@/helpers/builder";


export const HeadingRow = ({ components, properties }: IBlock) => {
    
    const style:React.CSSProperties = getStyleFromProperties(properties);
    
    return (
        <Container style={{...containerStyle, ...style}}>
            <Section>
                <Row>
                    <Column>
                        <BuildingComponent componentKey="MainHeading"/>
                        <BuildingComponent componentKey="Description"/>
                    </Column>
                </Row>
            </Section>
        </Container>
    );
};

export default HeadingRow;
