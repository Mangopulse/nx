import auth from "@/lib/Auth";

export default async function subscribe(data:any) {
    return auth.post("/subscription-service/subscribe", data).then(res => res.json());
}
