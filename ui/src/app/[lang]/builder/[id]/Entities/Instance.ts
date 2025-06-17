import { nanoid } from "nanoid";
import Component from "./Component";
import { BLOCKS_POOL } from "@/constants";
import Block from "./Block";
import { UniqueIdentifier } from "@dnd-kit/core";
import Property from "./Property";

class Instance {
    id: UniqueIdentifier;
    name?: string;
    type?: string;
    components: Array<Component>;
    properties: Array<Property> | undefined;
    element: (props: any) => React.JSX.Element;
    extra?: any;

    constructor(block: Block | Instance) {
        this.id = block.id;
        this.type = block?.type;
        this.name = block?.name;
        this.components = this.getComponents(block?.components);
        this.properties = this.getProperties(block?.properties);
        this.element = block.element;
        this.extra = {...block.extra};
    }

    getComponents(components: any): Array<Component> {
        if (!components?.length) return components;
        if (components[0] instanceof Component) return components;
        return components.map((comp: Component) => {
            return new Component(
                comp.type,
                comp.key,
                comp.value ?? comp.defaultValue,
                comp.properties?.map(
                    (prop: Property) => new Property(prop.type, prop.value)
                ),
                comp.aliasName,
                comp.hidden
            );
        });
    }

    getProperties(properties: any): Array<Property> | undefined {
        if (!properties?.length) return properties;
        return properties?.map(
            (propObj: any) => new Property(propObj.type, propObj.value ?? propObj.defaultValue)
        );
    }
}

export default Instance;
