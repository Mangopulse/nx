import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import * as React from "react";

export default function TableSkeletonRows({
    rowCount = 10,
    colSpan,
}: {
    rowCount?: number;
    colSpan?: number
}) {
    return (
        <>
            {new Array(rowCount).fill(0).map((_, i) => (
                <TableRow key={i}>
                    <TableCell colSpan={colSpan} className="">
                        <Skeleton className="w-full h-6" />
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
}
