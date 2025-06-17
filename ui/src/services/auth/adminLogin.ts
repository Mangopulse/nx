import auth from "@/lib/Auth";

export default async function adminLogin(data: any) {
    return auth.post("/auth/authenticate-admin", data).then(res => res.json());
}