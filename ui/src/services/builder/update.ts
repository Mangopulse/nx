import auth from "@/lib/Auth";

export default async function updateNewsletter(data: any) {
    return auth.post("/website/newsletter-update", data).then(res => res.json());

}
