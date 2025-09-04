import MiniRotatingLoader from "@/components/loaders/MiniRotatingLoader";
import { cn } from "@/lib/utils";
import {
    CheckCircleIcon,
    DownloadIcon,
    ExpandIcon,
    FolderPlusIcon,
} from "lucide-react";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function CSVDropzone({
    handleFileSelect,
    csvParsingLoading,
    setCsvParsingLoading,
    subscribers,
}: any) {
    const onDrop = useCallback(
        (acceptedFiles: any) => {
            setCsvParsingLoading(true);
            handleFileSelect(acceptedFiles);
        },
        [handleFileSelect, setCsvParsingLoading]
    );
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    return (
        <div {...getRootProps()} className="cursor-pointer hover:bg-secondary">
            <input {...getInputProps()} accept=".csv" />
            <div
                className={cn(
                    "border-2 border-dashed rounded flex justify-center items-center p-6 flex-col gap-3 text-primary/50 hover:border-sky-500/70 transition-all",
                    isDragActive && "border-solid bg-secondary"
                )}
            >
                {!isDragActive && subscribers?.length ? (
                    <>
                        <p className="text-center text-sm">
                            {subscribers?.length} subscriber{subscribers?.length === 1 ? "" : "s"} parsed
                        </p>
                        <CheckCircleIcon size={45} opacity={0.2} />
                    </>
                ) : (
                    <>
                        <p className="text-center text-sm">
                            Drop your CSV file here, or{" "}
                            <span className="text-sky-500">
                                click to browse
                            </span>
                        </p>
                        {isDragActive ? (
                            <DownloadIcon
                                size={45}
                                opacity={0.2}
                                strokeWidth={"1"}
                                className="animate-bounce"
                            />
                        ) : (
                            <FolderPlusIcon
                                size={45}
                                opacity={0.2}
                                strokeWidth={"1"}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
