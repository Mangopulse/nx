import { AlertTriangleIcon } from "lucide-react";
import * as React from "react";

export default function FreeAccountWarning() {
    return (
        // <div className="bg-yellow-200/50 text-yellow-950 p-3 border rounded border-yellow-700/30">
        <div className="bg-primary-400/10 text-primary p-3 border rounded border-primary-700/60 flex items-center gap-3">
            <AlertTriangleIcon size={40} strokeWidth={"0.5"} className="stroke-primary-700/80"/>
            <div>
                <p className="font-semibold">
                    You are operating with a free sending account
                </p>
                <p className="opacity-80 text-sm">
                    This account has a limit of sending only{" "}
                    <span className="font-semibold">10</span> emails per day.
                </p>
            </div>
        </div>
    );
}
