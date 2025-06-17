import auth from "@/lib/Auth";

export default async function save(data: any) {
    return await auth
        .post("/website/collector-update", data)
        .then((res) => res.json());
}
