import auth from "@/lib/Auth";

export default async function updateSettings(data:any) {
    return auth.post("/settings/update-settings", data).then(res => res.json());
}
