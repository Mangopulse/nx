import auth from "@/lib/Auth";

export async function signup(data: any) {
    return auth.post("/auth/register", data).then(res => res.json());
}
