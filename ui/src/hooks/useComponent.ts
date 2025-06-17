import { useContext } from "react";
import Component from "@/app/[lang]/builder/[id]/Entities/Component";
import useInstance from "./useInstance";

export default function useComponent(key: string): Component | undefined {
    const {instance} = useInstance();
    if (!instance) {
        return undefined;
    }

    const component = instance.components?.find(
        (comp: Component) => comp.key === key
    );
    if (!component) return undefined;
    return component;
}
