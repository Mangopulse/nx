import { COMPONENTS_POOL } from "@/constants";
import Property from "./Property";
import { nanoid } from "nanoid";

class Component {
    id: string;
    name: string;
    aliasName?: string;
    type: string;
    properties: Array<Property> | undefined | any;
    element: (props: any) => React.JSX.Element | undefined;
    key: string;
    value: string;
    hidden?: boolean
    defaultValue: string;

    constructor(type: string, key: string, defaultValue: string, properties?: Array<Property> | undefined, aliasName?:string, hidden?:boolean) {
        this.id = nanoid(11);
        this.key = key;
        this.type = type;
        this.aliasName = aliasName;
        this.name = this.getName();
        this.properties = properties ?? this.getProperties();
        this.element = this.getElement();
        this.defaultValue = defaultValue;
        this.value = defaultValue;
        this.hidden = hidden;
    }

    getName() {
        return COMPONENTS_POOL[this.type]?.name;
    }
    getProperties(): Array<Property> | undefined {
        return COMPONENTS_POOL[this.type]?.properties?.map(
            (propObj) => new Property(propObj.type, propObj.defaultValue)
        );
    }

    getElement() {
        return COMPONENTS_POOL[this.type]?.element;
    }
}

export default Component;
