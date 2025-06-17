export function getLocalApiUrl() {
    return  "/api";
}

export function isLocal() {
    return process.env.NEXT_PUBLIC_IS_LOCAL === "true";
}


export function parseJwt(token?:string) {
    if (!token) { return; }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    try{
        const parsed = JSON.parse(window?.atob(base64)) 
        return parsed;
    }
    catch(e){}
    return;
}