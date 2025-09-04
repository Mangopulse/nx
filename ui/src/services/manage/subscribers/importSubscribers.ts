import auth from "@/lib/Auth";

export default async function importSubscribers(data:any) {
    return auth.post("/website/batch-subscribe", data).then(res => res.json());
}
