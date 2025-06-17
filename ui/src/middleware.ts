import { NextRequest } from "next/server";
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'


let locales = ["en", "ar"];
const PUBLIC_FILE = /\.(.*)$/

// Get the preferred locale, similar to the above or using a library
function getLocale(request:NextRequest) {
    const defLang = request.headers.get("accept-language");
    let headers = { "accept-language": defLang || undefined };
    let languages = new Negotiator({headers}).languages();
    let defaultLocale = "ar";
    return match(languages, locales, defaultLocale);
}

export function middleware(request:NextRequest) {
    // Check if there is any supported locale in the pathname
    const {pathname} = request.nextUrl;
    
    const isInDashboard = pathname.includes("/manage/") || pathname.includes("/analytics/");
    const isPublicFile = PUBLIC_FILE.test(pathname);
    const isSentry = pathname.includes("sentry");

  

    //to take the files from the publisc folder
    if (    
        isPublicFile
    ) {
        return;
    }  

    const pathnameHasLocale = locales.some(
        (locale) =>
            pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if(isSentry) {
        return 
    }
    
    if(pathnameHasLocale && pathname.includes("/ar/") && isInDashboard){
        request.nextUrl.pathname = pathname.replace("/ar/", "/en/");
        return Response.redirect(request.nextUrl);
    }
    
    if (pathnameHasLocale) return;

    const locale = getLocale(request);
    // Redirect if there is no locale
    request.nextUrl.pathname = `/${locale}${pathname}`;
    // e.g. incoming request is /install
    // The new URL is now /en/install
    return Response.redirect(request.nextUrl);
}

export const config = {
    matcher: [
        // Skip all internal paths (_next)
        "/((?!_next).*)",
        // Optional: only run on root (/) URL
        // '/'
    ],
};
