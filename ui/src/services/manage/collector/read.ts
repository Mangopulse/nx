import auth from "@/lib/Auth";

export default async function readCollector() {
    return auth.get("/website/collector-read").then(res => res.json());
}
