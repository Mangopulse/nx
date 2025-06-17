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
import {
    containerStyle,
    descriptionStyle,
    headingStyle,
} from "../BuildingComponents/styles";
import HeadingComponent from "../BuildingComponents/Heading";
import DescriptionComponent from "../BuildingComponents/Description";
import Component from "../../Entities/Component";
import { BuildingComponent } from "../BuildingComponent";
import { IBlock } from "@/types";
import { getStyleFromProperties } from "@/helpers/builder";

export const BasicFooter = ({ components, properties }: IBlock) => {
    
    const style:React.CSSProperties = getStyleFromProperties(properties);
    
    
    return (
        <Container style={{...containerStyle, ...style}}>
            <Section>
                <BuildingComponent componentKey="footerSocialIcons"/>
                <Row>
                    <Column>
                        <BuildingComponent componentKey="FooterEpilogue"/>
                    </Column>
                </Row>
                <Row align="center">
                    <Column style={{ textAlign: "center" }}>
                        <Link nx-href="@@UNSUBSCRIBE_API@@">Unsubscribe</Link>
                    </Column>
                </Row>
            </Section>
        </Container>
    );
};

export default BasicFooter;
