import { DownloadIcon, FileIcon } from "lucide-react";
import * as React from "react";

export interface IDownloadTemplateCardProps {}

export default function DownloadTemplateCard(
    props: IDownloadTemplateCardProps
) {
    return (
        <a
            href="/subscribersCSVTemplate.csv"
            download
            aria-label="download csv template"
            className="border rounded flex items-center p-3 justify-between group hover:bg-secondary transition-all"
        >
            <div className="flex items-center gap-2">
                <FileIcon size={20} className="text-emerald-500" />
                <span className="text-primary/60 text-sm font-mono group-hover:text-primary/90 transition-all">
                    subscribersCSVTemplate.csv
                </span>
            </div>
            <DownloadIcon
                size={20}
                className="opacity-60 group-hover:opacity-90 transition-all"
            />
        </a>
    );
}
