import auth from "@/lib/Auth";

export default async function getWebsiteConfig() {
    return auth.get("/settings/website-configs").then(res => res.json());
}