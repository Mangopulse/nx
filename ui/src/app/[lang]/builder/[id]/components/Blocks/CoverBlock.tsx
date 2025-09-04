import { EMAIL_BUILDER_WIDTH } from "@/constants";
import {
    Body,
    Button,
    Container,
    Column,
    Head,
    Heading,
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
import { BuildingComponent } from "../BuildingComponent";
import { IBlock } from "@/types";
import { getStyleFromProperties } from "@/helpers/builder";
import { containerStyle } from "@/app/[lang]/builder/[id]/components/BuildingComponents/styles";

export const CoverBlock = ({ components, properties }: IBlock) => {
    const style: React.CSSProperties = getStyleFromProperties(properties);
    return (
        <Container style={{ ...style }}>
            <Section>
                <Row>
                    <Column>
                        <BuildingComponent componentKey="CoverImage" />
                    </Column>
                </Row>
            </Section>
        </Container>
    );
};

export default CoverBlock;
