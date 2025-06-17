import auth from "@/lib/Auth";

export default async function getSubscribersCount() {
    return auth.get("/website/subscribers-count").then(res => res.json());
}
