import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Analytics() {
    redirect("/analytics/overview")
    return <></>;
}
