import { Text } from "@react-email/components";
import * as React from "react";
import { descriptionStyle } from "./styles";
import useInstance from "@/hooks/useInstance";

export interface IDescriptionProps {
    value: string;
    style?: React.CSSProperties;
    onValueChange?: any;
}

export default function DescriptionComponent({
    value,
    style = {},
    onValueChange = () => {},
}: IDescriptionProps) {
    const { instance } = useInstance();
    if (!instance) {
        return <p>no instance</p>;
    }

    return (
        <Text style={{ ...descriptionStyle, ...style }}>
            <span
                onInput={(e:any) => onValueChange(e?.target?.innerText)}
                contentEditable={true}
                suppressContentEditableWarning={true}
                spellCheck={false}
                className="cursor-text"
            >
                {value}
            </span>
        </Text>
    );
}
