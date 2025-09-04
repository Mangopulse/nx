import React, { useState } from "react";
import BlockCard from "./BlockCard";

export default function BlockToolBar({ blockPool=[], isSenderVerified }) {

    return (
        <div className="w-72 border-r p-3 bg-white">
            <h1 className="mb-3 font-bold opacity-75 flex items-center gap-2">
            <i className="fa-solid fa-table-cells-large"></i>
            Blocks
            </h1>
            <div className={`w-full space-y-3 gap-3 overflow-auto no-scrollbar`} style={{
                height: !isSenderVerified ? 'calc(100vh - 53px - 90px)' : 'calc(100vh - 53px - 60px)'
            }}>
                {blockPool?.map((block, i) => (
                    <BlockCard
                        key={block.id + i}
                        block={block}
                    />
                ))}
            </div>
        </div>
    );
}
