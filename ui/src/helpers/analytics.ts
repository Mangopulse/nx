import { DateInterval } from "@/types";

export const formatNumber = (num: string | undefined) => {
    if (num === null || num === undefined) return;
    const number = Number(num);
    if (number >= 1000000000) return (number / 1000000000).toFixed(1) + "B"; // maybe only switch if > 1000
    if (number >= 1000000) return (number / 1000000).toFixed(1) + "M"; // maybe only switch if > 1000
    if (number > 1000) return (number / 1000).toFixed(1) + "K"; // maybe only switch if > 1000
    return number;
};

export function formatDate(date: Date): string {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function formatDateInterval(dateInterval: DateInterval): {
    from: string;
    to: string;
} {
    return {
        from: formatDate(dateInterval?.from),
        to: formatDate(dateInterval?.to),
    };
}

export function defaultDatesIfNull(dateInterval: DateInterval): {
    from: string;
    to: string;
} {
    if(!dateInterval?.from || !dateInterval?.to){
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        return {
            from: formatDate(lastWeek),
            to: formatDate(today),
        }
    }
    return {
        from: formatDate(dateInterval?.from),
        to: formatDate(dateInterval?.to),
    };
}

export function formatXAxisDates(
    dates: Array<string>
): Array<string> | undefined {
    if (!dates) return;
    const formatter = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
    });
    return dates.map((date) => {
        const d = new Date(date);
        return formatter.format(d);
    });

    return [""];
}

export function isNull(value: any): boolean {
    return value === null || value === undefined;
}
