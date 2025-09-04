/* eslint-disable react/no-unescaped-entities */
"use client";
import InsightCard from "@/components/Analysis/InsightCard";
import DataTable from "@/components/Analysis/DataTable";
import CardWithMiniChart from "@/components/Analysis/CardWithMinichart";
import LinechartsCard from "@/components/Analysis/ChartsCard";
import BarChart from "@/components/Analysis/BarChart";
import MainLayout from "@/layouts/MainLayout";
import { cn } from "@/lib/utils";
import { useQueries } from "@tanstack/react-query";
import { getNewslettersCount } from "@/services/analysis/getNewslettersCount";
import { getNewsletterClicks } from "@/services/analysis/getNewsletterClicks";
import { getNewslettersOpened } from "@/services/analysis/getNewslettersOpened";
import { getUnverifiedSubscribers } from "@/services/analysis/getUnverifiedSubscribers";
import { getSubscribersCount } from "@/services/analysis/getSubscribersCount";
import { getUnSubscribersCount } from "@/services/analysis/getUnSubscribersCount";
import DateFilter from "@/components/Analysis/DateFilter";
import DateTimePicker from "@/components/Analysis/DateFilter";
import { useState } from "react";
import { formatDate, formatDateInterval } from "@/helpers/analytics";
import { getSubscribersToday } from "@/services/analysis/getSubscribersToday";
import { Badge } from "@/components/ui/badge";
import { AlertTriangleIcon } from "lucide-react";
import NewsletterClickChart from "@/components/Analysis/NewsletterClickChart";

export default function OverView() {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    const [dateFilter, setDateFilter] = useState({
        from: lastWeek,
        to: today,
    });
    const [dateOpen, setDateOpen] = useState(false);

    const formattedInterval = formatDateInterval(dateFilter);

    const dateUnspecified = !dateFilter?.from || !dateFilter?.to;

    const [
        newslettersCountQ,
        newslettersClicksQ,
        newslettersOpenedQ,
        unverifiedSubscribersQ,
        subscribersCountQ,
        subscribersToday,
        unSubscribersCountQ,
    ] = useQueries({
        queries: [
            {
                queryKey: ["newsletters-count", dateFilter, dateUnspecified],
                queryFn: () => getNewslettersCount(formattedInterval),
                enabled: !dateUnspecified,
            },
            {
                queryKey: ["newsletters-clicks", dateFilter, dateUnspecified],
                queryFn: () => getNewsletterClicks(formattedInterval),
                enabled: !dateUnspecified,
            },
            {
                queryKey: ["newsletters-opened", dateFilter, dateUnspecified],
                queryFn: () => getNewslettersOpened(formattedInterval),
                enabled: !dateUnspecified,
            },
            {
                queryKey: ["subscribers-count-unverified", dateFilter, dateUnspecified],
                queryFn: () => getUnverifiedSubscribers(formattedInterval),
                enabled: !dateUnspecified,
            },
            {
                queryKey: ["subcribers-count", dateFilter, dateUnspecified],
                queryFn: () => getSubscribersCount(formattedInterval),
                enabled: !dateUnspecified,
            },
            {
                queryKey: ["subcribers-today"],
                queryFn: () => getSubscribersToday(),
                enabled: !dateUnspecified,
            },
            {
                queryKey: ["unsubcribers-count", dateFilter, dateUnspecified],
                queryFn: () => getUnSubscribersCount(formattedInterval),
                enabled: !dateUnspecified,
            },
        ],
    });

    const selectedTimeFrame =
        formattedInterval.from + " -> " + formattedInterval.to;

    // static now, needs to be dynamic and be true if all insights have no data yet
    const dataReady = true;
    return (
        <div className="relative">
            <div className="flex mb-4">
                <div className="ml-auto flex items-center gap-3">
                    {dateUnspecified && (
                        <Badge
                            className="flex gap-3 items-center"
                            variant="warning"
                        >
                            <AlertTriangleIcon size={15} />
                            <span>Please set the from and to dates</span>
                        </Badge>
                    )}
                    <DateTimePicker
                        triggerClassName="h-auto"
                        value={dateFilter}
                        onChange={setDateFilter}
                        mode="range"
                        open={dateOpen}
                        onOpenChange={setDateOpen}
                    />
                </div>
            </div>
            <div
                className={`grid grid-cols-12 gap-4 ${
                    !dataReady && "h-full overflow-hidden pointer-events-none"
                } `}
            >
                <InsightCard
                    className="col-span-3"
                    title="Newsletters Sent"
                    isLoading={newslettersCountQ.isLoading}
                    value={newslettersCountQ.data?.count}
                    tooltip={
                        <span>
                            Number of newsletters sent to all users in the
                            selected time frame <br />
                            <strong>{selectedTimeFrame}</strong>
                        </span>
                    }
                />
                <InsightCard
                    className="col-span-3"
                    title="Article Clicks From Newsletters"
                    isLoading={newslettersClicksQ.isLoading}
                    value={newslettersClicksQ.data?.value?.reduce(
                        (a: number, b: number) => a + b
                    )}
                    tooltip={
                        <span>
                            Number of user clicks on the articles sent within
                            the newsletter in the selected time frame <br />
                            <strong>{selectedTimeFrame}</strong>
                        </span>
                    }
                />
                <InsightCard
                    className="col-span-3"
                    title="Newsletters Opend"
                    isLoading={newslettersOpenedQ.isLoading}
                    value={newslettersOpenedQ.data?.count}
                    tooltip={
                        <span>
                            Number of newsletters that are opened by the users
                            in the selected time frame <br />
                            <strong>{selectedTimeFrame}</strong>
                        </span>
                    }
                />
                <InsightCard
                    className="col-span-3"
                    title="New Subscribers Today"
                    isLoading={subscribersToday.isLoading}
                    value={
                        subscribersToday.data?.value &&
                        subscribersToday.data?.value[0]
                    }
                />

                <LinechartsCard
                    className="col-span-9"
                    title="Article Clicks From Newsletters Over Time"
                >
                    <NewsletterClickChart
                        datesValues={newslettersClicksQ?.data?.date}
                        clicksVlues={newslettersClicksQ?.data?.value}
                        isLoading={newslettersClicksQ?.isLoading}
                    />
                </LinechartsCard>

                <div className="col-span-3 grid grid-row-6 gap-4 ">
                    <CardWithMiniChart
                        className="row-span-2 "
                        title="Unverified Email Submissions"
                        isLoading={unverifiedSubscribersQ.isLoading}
                        value={unverifiedSubscribersQ.data?.count}
                        total={true}
                        chratValues={unverifiedSubscribersQ?.data?.value}
                        tooltip={
                            "Total number of users who submitted their email via the collector but didn't verify it via the email sent to them"
                        }
                    />

                    <CardWithMiniChart
                        className="row-span-2 "
                        title="Verified Subscribers"
                        isLoading={subscribersCountQ.isLoading}
                        value={subscribersCountQ.data?.count}
                        total={true}
                        chratValues={subscribersCountQ?.data?.value}
                    />
                    <CardWithMiniChart
                        className="row-span-2"
                        title="Unsubscribers"
                        isLoading={unSubscribersCountQ.isLoading}
                        value={unSubscribersCountQ.data?.count}
                        total={true}
                        chratValues={unSubscribersCountQ?.data?.value}
                    />
                </div>

            </div>
            {!dataReady && <NoDataOverlay />}
        </div>
    );
}

const NoDataOverlay = () => {
    return (
        <div className="w-full h-full absolute inset-0 backdrop-blur-sm z-50 bg-white/30 flex flex-col gap-4 justify-center items-center text-3xl font-bold">
            No Data Collected Yet!
        </div>
    );
};
