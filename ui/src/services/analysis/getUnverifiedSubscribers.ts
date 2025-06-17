
import auth from "@/lib/Auth";

export async function getUnverifiedSubscribers(params?:any) {
    return auth.get("/analytics/subscribers-count-unverified", params).then(res => res.json());
}
