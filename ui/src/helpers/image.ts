"use client"

import { ImageLoaderProps } from "next/image"

export default function imgLoader({src , width=20, quality=75}:ImageLoaderProps ) {
    return `/img/${src}?w=${width}&q=${quality || 75}`
}