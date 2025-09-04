import { Img } from "@react-email/components";
import * as React from "react";
import { headingStyle } from "./styles";
import { COMPONENT_TYPES } from "@/constants";
import useInstance from "@/hooks/useInstance";

export interface IImageProps {
    value: string;
    linkTo?: string;
    style?: React.CSSProperties;
}

export default function ImageComponent({
    value,
    linkTo,
    style = {},
}: IImageProps) {
    const { instance } = useInstance();
    if (!instance) {
        return <p>no instance</p>;
    }

    return (
        <>
            {linkTo ? (
                <a href={linkTo}>
                    <Img src={value} style={style} />
                </a>
            ) : (
                <Img src={value} style={style} />
            )}
        </>
    );
}
