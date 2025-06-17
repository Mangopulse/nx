import auth from "@/lib/Auth";

export default async function updateWalkthrough(data: any) {
    return auth.post("/user/walkthrough-update", data).then(res => res.json());
}