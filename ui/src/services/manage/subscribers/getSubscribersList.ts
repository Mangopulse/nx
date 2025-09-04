import auth from "@/lib/Auth";

export default async function getSubscribersList(data:any) {
    return auth.post("/website/subscribers-list", data).then(res => res.json());
}
