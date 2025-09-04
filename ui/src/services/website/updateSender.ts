import auth from "@/lib/Auth";

export default async function updateSender(data:any) {
    return auth.post("/website/update-sender", data).then(res => res.json());
}
