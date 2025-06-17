import auth from "@/lib/Auth";

export default async function newsletterRead(data:any) {
    return auth.post("/website/newsletter-read", data).then(res => res.json());

}
