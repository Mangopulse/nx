import auth from "@/lib/Auth";

export default async function changePassword(data: any) {
    return auth.post("/user/change-password", data).then(res => res.json());
}