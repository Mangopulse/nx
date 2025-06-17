"use client"
import React from "react";
import Button, { ButtonProps } from "../ui/button";

interface IIconButtonProps extends ButtonProps {
    className?: string;
    icon?: string;
    children?: React.ReactElement | React.ReactElement[] | string
}


const IconButton = (props :IIconButtonProps) => {
    return (
        <Button
            {...props}
            className={"flex gap-3 items-center  " + props.className ?? ""}
        >
            {props.icon && <i className={"fa " + props.icon}></i>}
            {props.children && props.children}
        </Button>
    );
};

export default IconButton;
