import { getLocalApiUrl } from "@/helpers/api";


export async function importSub(data: any) {
    const response = await fetch(getLocalApiUrl() + "/manage/subscribers", {
        method: "POST",
        body: JSON.stringify(data),
    });
    return await response.json();
}


