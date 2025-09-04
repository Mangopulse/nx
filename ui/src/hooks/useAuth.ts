import { USER_COOKIE } from "@/constants";
import { parseJwt } from "@/helpers/api";
import auth from "@/lib/Auth";
import { User } from "@/types";
import { deleteCookie, getCookie } from "cookies-next";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function useAuth():User | undefined{
    const router = useRouter();
    try {
        const user:string = getCookie(USER_COOKIE) as string;
        if (!user) {
            router.push("/login");
        } else {
            const token = JSON.parse(user)?.token;
            const tokenDecoded = parseJwt(token);
            if (tokenDecoded.exp * 1000 < Date.now()) {
                deleteCookie(USER_COOKIE);
                router.push("/login");
                return;
            }
        }
        return JSON.parse(user);
    } catch (err) {}
}
