"use client"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ImageLoaderProps } from "next/image"
import { strapiUrl } from "@/constants"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function strapiImageLoader({src , width=20, quality=75}:ImageLoaderProps ) {
  return `${src}?w=${width}&q=${quality}`
}

export default function localImageLoader({src , width=20, quality=75}:ImageLoaderProps ) {
    return `/img/${src}?w=${width}&q=${quality}`
}

export function highlightCode(code:string) {
  const keywords = ['function', 'var', 'if', 'else', 'return', 'async', 'await', 'const', 'let', 'true', 'false'];

  return code.replace(/(\b\w+\b)|([\{\(\)\[\]\},";=])/g, (match:string, p1:string, p2:string) => {
    if (p1) {
      if (keywords.includes(p1)) {
        return `<span class="text-orange-400">${p1}</span>`;
      }
      return match;
    } else if (p2) {
      const thirdColorChars = ['.', ';', '=', "+"];
      if (thirdColorChars.includes(p2)) {
        return `<span class="text-green-400">${p2}</span>`;
      }
      return `<span class="text-sky-300">${p2}</span>`;
    }
    return match;
  });
}