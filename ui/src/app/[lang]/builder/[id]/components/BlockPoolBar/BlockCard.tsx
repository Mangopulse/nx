import React, { CSSProperties } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import Block from "../../Entities/Block";
import InstanceCard from "../InstanceCard";
import Instance from "../../Entities/Instance";
import BlockPreview from "../BlockPreview";

export interface IBlockCardProps {
    block: Block;
    isOverlay: boolean;
}

export default function BlockCard({ block, isOverlay }: IBlockCardProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({
            id: block.id,
            data: {
                block: block,
            },
        });

    const style: CSSProperties | undefined = isDragging
        ? {
              position: "absolute",
              transform: `translate3d(${transform?.x}px, ${transform?.y}px, 0)`,
              cursor: "move",
          }
        : {
              cursor: "pointer",
          };

    if (isOverlay) {
        const instance = new Instance(block);
        return (
            <div className="border">
                <InstanceCard instance={instance} />
            </div>
        );
    }

    return (
        <>
            <Card className="overflow-hidden rounded-md transition-all hover:shadow-lg">
                <div
                    className={
                        "text-left py-2 px-3 border-b text-xs uppercase font-bold bg-[#00000008]"
                    }
                >
                    <span className="text-primary/40">{block.name}</span>
                </div>
                <div
                    {...{
                        ref: setNodeRef,
                        style: style,
                        ...listeners,
                        ...attributes,
                    }}
                    className="p-2"
                >
                    <BlockPreview src={block.preview} />
                </div>
                {isDragging && <BlockPreview src={block.preview} />}
            </Card>
        </>
    );
}
