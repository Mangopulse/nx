
import auth from "@/lib/Auth";

export async function getNewslettersOpened(params?:any) {
    return auth.get("/analytics/newsletters-opened", params).then(res => res.json());
}
