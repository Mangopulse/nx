
import auth from "@/lib/Auth";

export async function resetPassword(data: any) {
    return auth.post("/auth/reset-password", data).then(res => res.json());
}
