import useComponent from "@/hooks/useComponent";
import useInstance from "@/hooks/useInstance";
import * as React from "react";
import useOutsideClick from "@/hooks/useOutsideClick";
import { COMPONENT_TYPES, PROPERTY_TYPES } from "@/constants";
import Property from "../Entities/Property";
import useBuilderStore from "../builderStore";
import { cn } from "@/lib/utils";
import { TrashIcon } from "lucide-react";
import { getStyleFromProperties } from "@/helpers/builder";

export interface IBuildingComponentProps {
    componentKey: string;
    passProps?: {};
}

export function BuildingComponent({
    componentKey,
    passProps = {},
}: IBuildingComponentProps): React.ReactNode {
    const { instance } = useInstance();
    const component = useComponent(componentKey);
    const setSelectedComponent = useBuilderStore(
        (state:any) => state.setSelectedComponent
    );
    const selectedComponent = useBuilderStore(
        (state:any) => state.selectedComponent
    );
    const instances = useBuilderStore((state:any) => state.instances);
    const setInstances = useBuilderStore((state:any) => state.setInstances);
    const selectedInstanceId = useBuilderStore(
        (state:any) => state.selectedInstanceId
    );

    const componentRef = React.useRef(null);
    const componentActionsRef = React.useRef(null);

    // useOutsideClick(componentRef, () => setSelectedComponent(null), [
    //     componentActionsRef,
    // ]);

    if (!instance)
        return (
            <h1 className="rounded py-3 px-6 bg-destructive/20 text-destructive font-medium border-destructive/50 border my-2">
                No instance found in component with key {componentKey}
            </h1>
        );
    if (!component)
        return (
            <h1 className="rounded py-3 px-6 bg-destructive/20 text-destructive font-medium border-destructive/50 border my-2">
                No component found with key {componentKey}. Check the
                COMPONENTS_POOL object in constants.ts and make sure you are
                using the same key defined there
            </h1>
        );

    const onValueChange = (content:any) => {
        component.value = content;
    };

    const getReactProps = (): any => {
        const style = getStyleFromProperties(component.properties);

        switch (component.type) {
            case COMPONENT_TYPES.IMAGE: {
                component.value = component.properties?.find(
                    (prop: Property) => prop.type === PROPERTY_TYPES.SOURCE
                )?.value as any;
                style.width = "600px";
                break;
            }
            case COMPONENT_TYPES.SOCIAL_ICONS: {
                component.value = component.properties?.find(
                    (prop: Property) =>
                        prop.type === PROPERTY_TYPES.SOCIAL_LINKS
                )?.value as any;
                break;
            }
        }

        const reactProps = {
            onValueChange: onValueChange,
            value: component.value,
            style: style,
            source: null,
            ...passProps,
        };

        return reactProps;
    };

    const isSelected = selectedComponent === component.id;

    const handleComponentClick = () => {
        if (isSelected) return;
        if (selectedInstanceId === instance.id)
            setSelectedComponent(component.id);
    };

    return (
        <div
            ref={componentRef}
            onClick={handleComponentClick}
            className={cn(
                isSelected && "outline-dashed outline-sky-400 outline-2",
                "relative"
            )}
        >
            {!component.hidden && <component.element {...getReactProps()} />}
            {isSelected && (
                <div
                    ref={componentActionsRef}
                    className={cn(
                        "absolute text-primary top-0 left-full pl-7 opacity-0  group-hover:opacity-100 hover:opacity-100 transition-all",
                        isSelected && "opacity-100"
                    )}
                >
                    <div className="bg-secondary flex flex-col justify-end rounded-sm border shadow-sm">
                        <div
                            className="p-2 cursor-pointer opacity-70 hover:opacity-100"
                            onClick={() => {
                                component.hidden = true;
                                setInstances([...instances]);
                                setSelectedComponent(null);
                            }}
                        >
                            <TrashIcon strokeWidth="1" size={17} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
