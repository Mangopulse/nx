import React, { useMemo, useRef, useState } from "react";
import useOutsideClick from "@/hooks/useOutsideClick";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { MaximizeIcon } from "lucide-react";
import InstanceCard from "./InstanceCard";
import { nanoid } from "nanoid";
import { cn } from "@/lib/utils";
import useBuilderStore from "../builderStore";

export default function EmailCanvas({ canvasRef }) {
    const { isOver, setNodeRef } = useDroppable({
        id: "canvas",
    });
    const instances = useBuilderStore((store) => store.instances);
    const setInstances = useBuilderStore((store) => store.setInstances);

    const handleRemove = (id) => {
        setInstances((instacnes) => instacnes.filter((item) => item.id !== id));
    };

    const items = useMemo(() => instances.map((b) => b.id), [instances]);

    return (
        <div ref={canvasRef} className="email-canvas overflow-visible">
            <SortableContext items={items}>
                {instances?.length === 0 ? (
                    <div
                        ref={setNodeRef}
                        className="text-lg flex flex-col justify-center items-center gap-11 h-full opacity-50 mt-9"
                    >
                        Start dropping blocks from the left panel
                        <MaximizeIcon
                            size={120}
                            className="opacity-10 transition-all animate-bounce"
                        />
                    </div>
                ) : (
                    <div className="box-content w-[600px] max-w-[600px] min-h-full max-h-full overflow-visible px-20 no-scrollbar flex flex-col gap-2">
                        {instances.map((instance, i) => (
                            <div
                                id={
                                    "dropitem-" + instance.id + "-" + nanoid(11)
                                }
                                key={instance.id}
                                className="w-full"
                            >
                                <InstanceCard
                                    onRemove={handleRemove}
                                    instance={instance}
                                    index={i}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </SortableContext>
        </div>
    );
}
