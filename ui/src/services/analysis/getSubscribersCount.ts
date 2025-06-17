import { formatDate } from "@/helpers/analytics";
import auth from "@/lib/Auth";

export async function getSubscribersCount(params?: any) {


    return auth
        .get("/analytics/subscribers-count", params)
        .then((res) => res.json());
}
