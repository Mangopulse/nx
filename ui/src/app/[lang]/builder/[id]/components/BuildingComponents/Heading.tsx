import { Heading } from "@react-email/components";
import * as React from "react";
import { headingStyle } from "./styles";
import { COMPONENT_TYPES } from "@/constants";
import useInstance from "@/hooks/useInstance";

export interface IHeadingProps {
    value: string;
    style?: React.CSSProperties;
    onValueChange?: any;
}

export default function HeadingComponent({
    value,
    style = {},
    onValueChange = () => {},
}: IHeadingProps) {
    const { instance } = useInstance();
    if (!instance) {
        return <p>no instance</p>;
    }

    return (
        <Heading style={{ ...headingStyle, ...style }}>
            <span
                onInput={(e:any) => onValueChange(e?.target?.innerText)}
                contentEditable={true}
                suppressContentEditableWarning={true}
                spellCheck={false}
                className="cursor-text"
            >
                {value}
            </span>
        </Heading>
    );
}
