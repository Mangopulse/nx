import auth from "@/lib/Auth";

export default async function updateSchedule(data:any) {
    return auth.post("/website/schedule-newsletter", data).then(res => res.json());
}
