
import { formatDate } from "@/helpers/analytics";
import auth from "@/lib/Auth";

export async function getNewsletterClicks(params?:any) {
    return auth.get("/analytics/newsletters-clicks", params).then(res => res.json());
}
