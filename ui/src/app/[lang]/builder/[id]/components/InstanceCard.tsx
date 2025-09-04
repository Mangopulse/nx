import React, { useEffect, useState } from "react";
import {
    useSortable,
    defaultAnimateLayoutChanges,
    arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import useBuilderStore from "../builderStore";
import { cn } from "@/lib/utils";
import Instance from "../Entities/Instance";
import InstanceContextProvider from "@/context/InstanceContext";
import {
    ArrowDownIcon,
    ArrowUpIcon,
    GripVerticalIcon,
    TrashIcon,
    X,
} from "lucide-react";
import { nanoid } from "nanoid";
import { cloneInstance } from "@/helpers/cloneInstance";
import Component from "../Entities/Component";

const animateLayoutChanges = (args: any) =>
    args.isSorting || args.wasDragging
        ? defaultAnimateLayoutChanges(args)
        : true;

export interface IInstanceCardProps {
    instance: Instance;
    onRemove?: (id: any) => void;
    index?: number;
}

export default function InstanceCard({
    instance,
    onRemove = () => {},
    index = 0,
}: IInstanceCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        animateLayoutChanges,
        id: instance.id,
        data: {
            instance: instance,
        },
    });

    const selectedInstanceId = useBuilderStore(
        (store) => store.selectedInstanceId
    );
    const setInstances = useBuilderStore((store) => store.setInstances);
    const setSelectedInstanceId = useBuilderStore(
        (store) => store.setSelectedInstanceId
    );
    const setSelectedComponent = useBuilderStore(
        (store) => store.setSelectedComponent
    );
    const selectedComponent = useBuilderStore(
        (store) => store.selectedComponent
    );

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    const isInstanceSelected = selectedInstanceId === instance.id;

    const handleInstanceClick = () => {
        if (isInstanceSelected) return;
        setSelectedComponent(null);
        setSelectedInstanceId(instance.id);
    };

    const [_instance, setInstance] = useState(instance);

    useEffect(() => {
        if (!instance.components.some((component) => !component.hidden)) {
            setSelectedInstanceId(null);
            onRemove(instance.id);
        }
    }, [instance.components, instance.id, onRemove, setSelectedInstanceId]);

    function moveVertically(direction: "up" | "down") {
        const multiplier = direction === "down" ? 1 : -1;
        setInstances((instances: any) => {
            const thisIndex = index;
            const switchIndex = thisIndex + 1 * multiplier;
            return arrayMove(instances, thisIndex, switchIndex);
        });
    }

    // useEffect(() => {
    //     function handleKeydown(event: any) {
    //         console.log(event);
    //         if (!isInstanceSelected) return;
    //     }
    //     document.addEventListener("keydown", handleKeydown);
    //     return document.removeEventListener("keydown", handleKeydown);
    // }, [isInstanceSelected]);

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="select-none relative group w-full outline-dashed outline-2 outline-gray-400"
            >
                <InstanceContextProvider
                    value={{
                        instance: _instance,
                        setInstance,
                    }}
                >
                    <div className="opacity-20">
                        <instance.element
                            components={instance.components}
                            properties={instance.properties}
                        />
                    </div>
                </InstanceContextProvider>
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={cn(
                "select-none relative group w-full outline-sky-500/20 hover:outline hover:z-10",
                isInstanceSelected && "outline-sky-500 outline z-20"
            )}
        >
            <InstanceContextProvider
                value={{
                    instance: _instance,
                    setInstance,
                }}
            >
                <div onClick={handleInstanceClick}>
                    <instance.element
                        components={instance.components}
                        properties={instance.properties}
                    />
                </div>
            </InstanceContextProvider>
            <div
                id={`instance-controls-${instance.id}`}
                className={cn(
                    "absolute text-primary top-0 right-full pr-4 opacity-0  group-hover:opacity-100 hover:opacity-100 transition-all",
                    isInstanceSelected && "opacity-100"
                )}
            >
                <div className="flex flex-col items-center justify-end bg-secondary rounded-sm border shadow-sm">
                    <div className="p-2 cursor-grab opacity-70 hover:opacity-100">
                        <GripVerticalIcon
                            {...listeners}
                            strokeWidth="1"
                            size={18}
                        />
                    </div>
                    <div className="p-2 cursor-pointer opacity-70 hover:opacity-100">
                        <ArrowUpIcon
                            onClick={() => moveVertically("up")}
                            strokeWidth="1"
                            size={18}
                        />
                    </div>
                    <div className="p-2 cursor-pointer opacity-70 hover:opacity-100">
                        <ArrowDownIcon
                            onClick={() => moveVertically("down")}
                            strokeWidth="1"
                            size={18}
                        />
                    </div>
                    <div className="p-2 text-destructive cursor-pointer opacity-70 hover:opacity-100">
                        <TrashIcon
                            onClick={() => {
                                setSelectedInstanceId(null);
                                onRemove(instance.id);
                            }}
                            strokeWidth="1"
                            size={18}
                        />
                    </div>
                    {/* duplicate not working */}
                    {/* <CopyIcon
                        className="cursor-pointer opacity-50 hover:opacity-100"
                        onClick={() => {
                            setInstances((instances:Array<Instance>) => {
                                const newInstance = cloneInstance(instance);
                                newInstance.id = nanoid(11);
                                console.log(newInstance.components)
                                newInstance.components?.forEach((com:Component) => com.id = nanoid(11))
                                const newInstances = [...instances];
                                newInstances.splice(index+1, 0, newInstance);
                                return newInstances;
                            })
                             
                        }}
                        strokeWidth="2"
                        size={18}
                    /> */}
                </div>
            </div>
        </div>
    );
}
