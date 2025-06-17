import * as React from "react";

export default function BrowseTemplates() {
    return (
        <div className="">
            <h1 className="text-xl font-medium opacity-70 mb-2">Browse Templates</h1>

            <div className="flex gap-3">
                {new Array(3).fill(0).map((_, i) => (
                    <div
                        key={i}
                        className="w-64 aspect-[0.8] h-auto flex items-center p-4 justify-center border rounded"
                    >
                        <p className="opacity-75">Coming Soon</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
