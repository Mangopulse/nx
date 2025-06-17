import auth from "@/lib/Auth";

export default async function sendPreviewEmail(data: any) {
    return auth.post("/website/send-preview-email", data).then(res => res.json());

}
