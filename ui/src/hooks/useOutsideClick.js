import { useCallback, useEffect } from "react";

// calls a callback if the click is outside the ref element passed or inside one of he exceptions
const useOutsideClick = (ref, callback, exceptions = []) => {
    const listener = useCallback((event) => {
        if (!ref.current || ref.current.contains(event.target)) return;
        // Check if the click is inside an exception(dont execute callback)
        for (const exception of exceptions) {
            if (typeof exception === "string") {
                const exceptionsInDOM = [
                    ...document.querySelectorAll(exception),
                ];
                for (const ex of exceptionsInDOM) {
                    if (ex && ex.contains(event.target)) {
                        return;
                    }
                }
            }
            if (exception.current && exception.current.contains(event.target))
                return;
        }
        callback(event);
    }, [ref, exceptions, callback]);

    useEffect(() => {
        document.addEventListener("mousedown", listener);
        return () => document.removeEventListener("mousedown", listener);
    }, [listener]);
};

export default useOutsideClick;
