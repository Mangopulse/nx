import auth from "@/lib/Auth";

export default async function getNewslettersList() {
    return auth.get("/website/newsletters-read").then(res => res.json());
}
