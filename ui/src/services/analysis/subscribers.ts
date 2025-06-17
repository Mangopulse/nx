import { getLocalApiUrl } from "@/helpers/api";

export async function subscribers(data: any) {
    const response = await fetch(getLocalApiUrl() + "/analysis/subscribers", {
        method: "POST",
        body: JSON.stringify(data),
    });
    return await response.json();
}