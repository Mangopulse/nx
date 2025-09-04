import { PROPERTIES_POOL, PROPERTY_TYPES } from "@/constants";

class Property {
    name: string;
    type: string;
    unit?: string;
    dataType: string;
    value?: any;
    dropdownItems?: { value: any; label: string }[];
    cssName: string | undefined;
    validation?: (value: unknown) => boolean;

    constructor(type: string, value?: unknown) {
        this.type = type;
        this.value = value;
        this.name = this.getName();
        this.cssName = this.getCssName();
        this.validation = this.getValidation();
        this.unit = this.getUnit();
        this.dataType = this.getDataType();
        if(this.dataType === "dropdown") this.dropdownItems = this.getDropdownItems();
    }

    getName(): string {
        return PROPERTIES_POOL[this.type]?.name;
    }

    getValidation(): any {
        return PROPERTIES_POOL[this.type]?.validation;
    }
    getUnit(): string | undefined {
        return PROPERTIES_POOL[this.type]?.unit;
    }

    getDataType(): string {
        return PROPERTIES_POOL[this.type]?.dataType;
    }
    getCssName(): string | undefined {
        return PROPERTIES_POOL[this.type]?.cssName;
    }
    getDropdownItems(): {value: any, label: string}[] | undefined {
        return PROPERTIES_POOL[this.type]?.dropdownItems;
    }
}

export default Property;
