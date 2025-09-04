import * as React from "react";

export interface INXBeaconProps {}

export default function NXBeacon(props: INXBeaconProps) {
    return (
        <span
            className="relative flex h-4 w-4"
            title="Don't forget to save after changing the title"
        >
            <span className="inset-0 animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="inset-0 inline-flex rounded-full h-full w-full bg-sky-500"></span>
        </span>
    );
}
