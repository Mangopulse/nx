import { WALKTHROUGH_PAGES } from './../constants';
"use client";
import { USER_COOKIE } from "@/constants";
import updateWalkthrough from '@/services/user/updateWalkthough';
import { Sender, User, Walkthrough } from "@/types";
import { getCookie, setCookie } from "cookies-next";


class Auth {
    public apiUrl: string | undefined = process.env.NEXT_PUBLIC_API || "https://api-appx.cognativex.com";
    private user: User | undefined;

    constructor() {
        this.user = this.getUser();
    }

    getAuthHeaders(): any {
        const headers: any = {};
        headers["Content-Type"] = "application/json;charset=UTF-8";
        const token = this.getToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;
        return headers;
    }

    setUser(user: User) {
        if (!user) return;
        this.user = user;
        try {
            setCookie(USER_COOKIE, JSON.stringify(user));
            return this.user;
        } catch (e) {}
    }

    getUser(): User | undefined {
        let user;
        user = JSON.parse(getCookie(USER_COOKIE) || "{}");
        if (!user.token) return;
        this.user = user;
        return this.user;
    }

    getToken(): string | undefined {
        return this.getUser()?.token;
    }

    setWalkthrough(walkthrough: Walkthrough | undefined){
        const user = this.getUser();
        if (!user || !walkthrough) return;
        user.walkthrough = walkthrough;
        this.setUser(user);
        updateWalkthrough(user.walkthrough);
    }

    setWalkthroughDone(page: keyof (typeof WALKTHROUGH_PAGES)) {
        const user = this.getUser();
        if (!user || !user?.walkthrough) return;
        const walkthrough = [...user.walkthrough];
        if(!walkthrough) return;
        const foundWalkthrough = walkthrough?.find(w => w.page === page);
        if(!foundWalkthrough) return;
        foundWalkthrough.shouldShow = false;
        this.setWalkthrough(walkthrough);
    }

    shouldShowWalkthrough(page: keyof (typeof WALKTHROUGH_PAGES) ): boolean {
        const user = this.getUser();
        if (!user) return true;
        const walkthrough = user.walkthrough;
        if(!walkthrough) return true;
        const foundWalkthrough = walkthrough.find(w => w.page === page);
        if(!foundWalkthrough) return true;
        return foundWalkthrough.shouldShow;
    }

    setSender(sender: Sender): void {
        const user = this.getUser();
        if (!user) return;
        user.sender = sender;
        this.setUser(user);
    }

    setSenderUnverified(): void {
        const user = this.getUser();
        if (!user || !user.sender) return;
        user.sender.verified = false;
        this.setUser(user);
    }

    setSenderId(id: number): void {
        const user = this.getUser();
        if (!user || !user.sender) return;
        user.sender.id = id;
        this.setUser(user);
    }

    appendQueryParams(endpoint: string, queryParams?: any) {
        if (!queryParams) return endpoint;
        // Convert the additional query parameters into a query parameter string
        const queryString = Object.keys(queryParams)
            .map((key) => `${key}=${encodeURIComponent(queryParams[key])}`)
            .join("&");

        const joiner = endpoint.includes("?") ? "&" : "?";
        return endpoint + joiner + queryString;
    }

    post(endpoint: string, body?: Object, headers?: Headers, config?: any) {
        return fetch(this.apiUrl + endpoint, {
            method: "post",
            headers: {
                ...this.getAuthHeaders(),
                ...headers,
            },
            body: JSON.stringify(body),
            ...(config || {}),
        });
    }

    get(endpoint: string, params?: any, headers?: Headers) {
        return fetch(this.apiUrl + this.appendQueryParams(endpoint, params), {
            method: "GET",
            headers: {
                ...this.getAuthHeaders(),
                ...headers,
            },
        });
    }
}

const auth = new Auth();
export default auth;
