
import auth from "@/lib/Auth";

export async function forgetPassword(data: any) {
    return auth.post("/auth/forget-password", data).then(res => res.json());
}
