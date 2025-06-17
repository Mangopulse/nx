/* eslint-disable @next/next/no-img-element */
import { SlidersHorizontal } from "lucide-react";
import * as React from "react";
import useBuilderStore from "../../builderStore";
import Input from "@/components/ui/input";
import Accordion from "@/components/General/Accordion";
import { PROPERTY_TYPES } from "@/constants";
import ComponentProperty from "./ComponentProperty";

export default function BlockPropertiesBar({
    propertiesBarRef,
    isSenderVerified,
}) {
    const instances = useBuilderStore((state) => state.instances);
    const selectedInstanceId = useBuilderStore(
        (state) => state.selectedInstanceId
    );

    const [openedItems, setOpenedItems] = React.useState([]);

    const selectedInstance = instances.find(
        (inst) => inst.id === selectedInstanceId
    );

    const ComponentProperties = ({ component, selectedInstance }) => {
        if (!component) {
            return selectedInstance?.properties?.map((property, i) => (
                <ComponentProperty
                    key={i + "_" + property.type}
                    property={property}
                    selectedInstance={selectedInstance}
                />
            ));
        }
        return component.properties?.map((property, i) => (
            <ComponentProperty
                key={component.id + "_" + property.type}
                property={property}
                component={component}
                selectedInstance={selectedInstance}
            />
        ));
    };

    const ComponentsPropertiesAccordion = ({ selectedInstance }) => {
        // const selectedComponent = useBuilderStore((s) => s.selectedComponent);

        const items = selectedInstance.components
            ?.filter((component) => component?.properties?.length)
            ?.map((component, i) => {
                return {
                    trigger: (
                        <div className="text-sm uppercase text-primary/70">
                            {component.aliasName ?? component.name}
                        </div>
                    ),
                    content: (
                        <div className="flex flex-col gap-4">
                            <ComponentProperties
                                component={component}
                                selectedInstance={selectedInstance}
                            />
                        </div>
                    ),
                    id: component?.id,
                };
            });

        // add properties of intance at first
        if (selectedInstance?.properties?.length) {
            items?.unshift({
                trigger: (
                    <div className="text-sm uppercase text-primary/70">
                        General
                    </div>
                ),
                content: (
                    <div className="flex flex-col gap-4">
                        <ComponentProperties
                            selectedInstance={selectedInstance}
                        />
                    </div>
                ),
            });
        }

        return (
            <Accordion
                items={items}
                type="single"
                openedItems={openedItems}
                setOpenedItems={setOpenedItems}
            />
        );
    };

    if (!selectedInstanceId) {
        return (
            <div className="w-72 border-l p-3 bg-white">
                <h1 className="mb-3 font-bold opacity-75 flex items-center gap-2">
                    <SlidersHorizontal size={17} />
                    Properties
                </h1>
                <div className="h-full w-full flex flex-col items-center justify-center text-center gap-7">
                    <img
                        src="/img/select-prop.png"
                        alt="select"
                        className="w-24 opacity-40 pointer-events-none select-none"
                    />
                    <span className="w-60 opacity-30 text-sm">
                        Select a block on the canvas to see its properties
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={propertiesBarRef}
            className={`w-72 border-l p-3 bg-white`}
        >
            <div className="flex items-center gap-2 uppercase mb-2 font-bold opacity-50 text-sm">
                <SlidersHorizontal size={17} />
                {selectedInstance.name} properties
            </div>
            <div
                className="overflow-auto no-scrollbar"
                style={{
                    height: !isSenderVerified
                        ? "calc(100vh - 53px - 90px)"
                        : "calc(100vh - 53px - 60px)",
                }}
            >
                <ComponentsPropertiesAccordion
                    selectedInstance={selectedInstance}
                />
            </div>
        </div>
    );
}
