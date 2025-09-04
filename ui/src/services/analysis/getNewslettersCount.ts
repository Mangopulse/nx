
import auth from "@/lib/Auth";

export async function getNewslettersCount(params?:any) {
    return auth.get("/analytics/newsletters-count").then(res => res.json());
}
