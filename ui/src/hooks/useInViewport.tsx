"use client";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";

export default function useInViewport(ref: RefObject<HTMLElement>) {
    const [isIntersecting, setIntersecting] = useState(false);

    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (!ref.current) return;

        // Initialize the IntersectionObserver if it hasn't been created yet
        if (!observerRef.current) {
            observerRef.current = new IntersectionObserver(([entry]) =>
                setIntersecting(entry.isIntersecting)
            );
        }

        // Observe the element
        observerRef.current.observe(ref.current);

        return () => {
            if (observerRef.current) {
                // Disconnect the observer when the component unmounts
                observerRef.current.disconnect();
            }
        };
    }, [ref]);

    return isIntersecting;
}
