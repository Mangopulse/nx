import auth from "@/lib/Auth";

export default async function getSender(data:any) {
    return auth.post("/website/get-sender", data).then(res => res.json());
}
