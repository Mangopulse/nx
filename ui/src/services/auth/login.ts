import auth from "@/lib/Auth";

export default async function login(data: any) {
    return auth.post("/auth/authenticate", data).then(res => res.json());
}