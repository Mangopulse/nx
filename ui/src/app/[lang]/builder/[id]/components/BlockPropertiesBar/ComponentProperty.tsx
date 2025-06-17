import * as React from "react";
import Property from "../../Entities/Property";
import Input from "@/components/form/Input";
import Component from "../../Entities/Component";
import {
    getComponentPropertyValueFromInstance,
    getInstancePropertyValueFromInstance,
} from "@/helpers/builder";
import useBuilderStore from "../../builderStore";
import ColorPicker from "../Properties/ColorPicker";
import Instance from "../../Entities/Instance";
import { PROPERTIES_POOL, PROPERTY_TYPES } from "@/constants";
import {
    AlignCenterIcon,
    AlignHorizontalSpaceAround,
    AlignHorizontalSpaceAroundIcon,
    AlignLeftIcon,
    AlignRightIcon,
    AlignVerticalSpaceAroundIcon,
    ArrowLeftToLineIcon,
    ArrowRightToLineIcon,
} from "lucide-react";
import IconButton from "@/components/form/IconButton";
import { cn } from "@/lib/utils";
import Label from "@/components/ui/label";
import { Combobox } from "@/components/form/ComboBox";

const FoundProperty = ({
    handleOnChange,
    property,
    prop,
}: {
    handleOnChange: Function;
    property: any;
    prop: Property;
}) => {
    switch (property.dataType) {
        case "text":
        case "url":
        case "number": {
            return (
                <Input
                    key={property.name}
                    unit={property.unit}
                    label={property.name}
                    type={property.dataType}
                    defaultValue={prop?.value}
                    onChange={(e) => handleOnChange(e, prop)}
                    // className="no-arrows-input"
                />
            );
        }
        case "color": {
            return (
                <ColorPicker
                    key={property.name}
                    label={property.name}
                    value={prop?.value}
                    onChange={(e) => handleOnChange(e, prop)}
                />
            );
        }
        case "source": {
            return (
                <Input
                    key={property.name}
                    label={property.name}
                    type="text"
                    defaultValue={prop?.value}
                    onChange={(e) => handleOnChange(e, prop)}
                />
            );
        }
        case "dropdown": {
            return (
                <Combobox
                    value={prop?.value}
                    onValueChange={(e) => handleOnChange(e, prop)}
                    items={property.dropdownItems}
                    variant={"outline"}
                    label={prop.name}
                />
            );
        }
        case "custom": {
            switch (prop.type) {
                case PROPERTY_TYPES.SOCIAL_LINKS: {
                    return (
                        <div className="flex flex-col gap-2">
                            <Input
                                label={"Facebook Link"}
                                type="text"
                                name="facebook"
                                defaultValue={prop?.value?.facebook}
                                onChange={(e) => handleOnChange(e, prop)}
                            />
                            <Input
                                label={"Instangram Link"}
                                type="text"
                                name="instagram"
                                defaultValue={prop?.value?.instagram}
                                onChange={(e) => handleOnChange(e, prop)}
                            />
                            <Input
                                label={"Twitter Link"}
                                type="text"
                                name="twitter"
                                defaultValue={prop?.value?.twitter}
                                onChange={(e) => handleOnChange(e, prop)}
                            />
                        </div>
                    );
                }
                case PROPERTY_TYPES.TEXT_ALIGN: {
                    return (
                        <div>
                            <Label className="mb-2 block">
                                {property.name}
                            </Label>
                            <div className="flex items-center gap-3">
                                <IconButton
                                    variant={"outline"}
                                    className={cn(
                                        "p-[6px] h-auto bg-soft-gray/40 hover:bg-white hover:text-primary",
                                        prop.value === "left" &&
                                            "border-sky-500 !text-sky-500 bg-white"
                                    )}
                                    onClick={() => handleOnChange("left", prop)}
                                >
                                    <AlignLeftIcon size={15} />
                                </IconButton>
                                <IconButton
                                    variant={"outline"}
                                    className={cn(
                                        "p-[6px] h-auto bg-soft-gray/40 hover:bg-white hover:text-primary",
                                        prop.value === "center" &&
                                            "border-sky-500 !text-sky-500 bg-white"
                                    )}
                                    onClick={() =>
                                        handleOnChange("center", prop)
                                    }
                                >
                                    <AlignCenterIcon size={15} />
                                </IconButton>
                                <IconButton
                                    variant={"outline"}
                                    className={cn(
                                        "p-[6px] h-auto bg-soft-gray/40 hover:bg-white hover:text-primary",
                                        prop.value === "right" &&
                                            "border-sky-500 !text-sky-500 bg-white"
                                    )}
                                    onClick={() =>
                                        handleOnChange("right", prop)
                                    }
                                >
                                    <AlignRightIcon size={15} />
                                </IconButton>
                            </div>
                        </div>
                    );
                }
                case PROPERTY_TYPES.DIRECTION: {
                    return (
                        <div>
                            <Label className="mb-2 block">
                                {property.name}
                            </Label>
                            <div className="flex items-center gap-3">
                                <IconButton
                                    variant={"outline"}
                                    className={cn(
                                        "p-[6px] h-auto bg-soft-gray/40 hover:bg-white hover:text-primary",
                                        prop.value === "rtl" &&
                                            "border-sky-500 !text-sky-500 bg-white"
                                    )}
                                    onClick={() => handleOnChange("rtl", prop)}
                                >
                                    <ArrowLeftToLineIcon size={15} />
                                </IconButton>
                                <IconButton
                                    variant={"outline"}
                                    className={cn(
                                        "p-[6px] h-auto bg-soft-gray/40 hover:bg-white hover:text-primary",
                                        prop.value === "ltr" &&
                                            "border-sky-500 !text-sky-500 bg-white"
                                    )}
                                    onClick={() => handleOnChange("ltr", prop)}
                                >
                                    <ArrowRightToLineIcon size={15} />
                                </IconButton>
                            </div>
                        </div>
                    );
                }
                case PROPERTY_TYPES.PADDING: {
                    return (
                        <div>
                            <Label className="mb-2 block">
                                {property.name}
                            </Label>
                            <div className="flex items-center gap-3">
                                <Input
                                    type="number"
                                    icon={
                                        <AlignHorizontalSpaceAroundIcon
                                            size={15}
                                        />
                                    }
                                    className=""
                                    defaultValue={prop?.value?.inline}
                                    onChange={(e) => {
                                        const val = { ...prop.value };
                                        val.inline = e.target.value;
                                        handleOnChange(val, prop);
                                    }}
                                />
                                <Input
                                    type="number"
                                    icon={
                                        <AlignVerticalSpaceAroundIcon
                                            size={15}
                                        />
                                    }
                                    className=""
                                    defaultValue={prop?.value?.block}
                                    onChange={(e) => {
                                        const val = { ...prop.value };
                                        val.block = e.target.value;
                                        handleOnChange(val, prop);
                                    }}
                                />
                            </div>
                        </div>
                    );
                }
            }
        }
    }
};

export interface IComponentPropertyProps {
    property: Property;
    selectedInstance: Instance;
    component?: Component;
}

export default function ComponentProperty({
    property,
    selectedInstance,
    component,
}: IComponentPropertyProps) {
    const setInstances = useBuilderStore((s) => s.setInstances);

    const handleOnChange = (
        e: any,
        prop: Property | undefined,
        extra?: any
    ) => {
        if (!prop) return;
        switch (prop.dataType) {
            case "color":
                prop.value = e;
                break;
            case "custom": {
                switch (prop.type) {
                    case PROPERTY_TYPES.SOCIAL_LINKS: {
                        prop.value[e.target?.getAttribute("name")] =
                            e.target?.value;
                        break;
                    }
                    default: {
                        if (typeof e === "string") prop.value = e;
                        else if (e?.target) prop.value = e?.target?.value;
                        else prop.value = e;
                        break;
                    }
                }
                break;
            }
            default:
                if (typeof e === "string") prop.value = e;
                else if (e?.target) prop.value = e?.target?.value;
                else prop.value = e;
                break;
        }
        setInstances((instances: Array<Instance>) => {
            return [...instances];
        });
    };

    const prop = component
        ? getComponentPropertyValueFromInstance(
              selectedInstance,
              component,
              property.type
          )
        : getInstancePropertyValueFromInstance(selectedInstance, property.type);
    return (
        <FoundProperty
            handleOnChange={handleOnChange}
            property={property}
            prop={prop}
        />
    );
}
