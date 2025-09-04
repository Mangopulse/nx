import { formatDate } from "@/helpers/analytics";
import auth from "@/lib/Auth";

export async function getSubscribersToday() {
    const today = formatDate(new Date());

    return auth
        .get("/analytics/subscribers-count", {from: today, to: today})
        .then((res) => res.json());
}
