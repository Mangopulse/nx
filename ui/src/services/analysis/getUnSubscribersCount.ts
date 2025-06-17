
import { formatDate } from "@/helpers/analytics";
import auth from "@/lib/Auth";

export async function getUnSubscribersCount(params?:any) {

    return auth.get("/analytics/un-subscribers-count", params).then(res => res.json());
}
