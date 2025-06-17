import DataTable from "@/components/Analysis/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLocalApiUrl } from "@/helpers/api";
import SubscriptionRateChart from "@/components/Analysis/SubscriptionRateChart";
import BarChart from "@/components/Analysis/BarChart";
import CardWithMiniChart from "@/components/Analysis/CardWithMinichart";
import LinechartsCard from "@/components/Analysis/ChartsCard";
import MainLayout from "@/layouts/MainLayout";

const columns: any = [
    {
        header: "Subscriber id",
        accessorKey: "subscriber_id",
    },
    {
        header: "Email",
        accessorKey: "email",
    },
    {
        header: "Name",
        accessorKey: "name",
    },
];

interface GetDataResponse {
    data: any;
}
interface Subscriber {
    subscriber_id: number;
    email: string;
    name: string;
}

// async function getdata(): Promise<GetDataResponse> {
//     const res = await fetch(getLocalApiUrl() + "/analysis/subscribers", {
//         next: { revalidate: 2 },
//         method: "POST",
//     });
//     const data = await res.json();

//     return {
//         data,
//     };
// }

const data = {
    message: "subscribersData",
    status: 200,
    subscribersData: [
      {
        total_emails_input: 15000,
        total_emails_verified: 12000,
    
        new_subscribers_today:20,
        email_inputs_over_time: {
          //line chart
          "2023-09-01": 1000,
          "2023-09-02": 800,
          "2023-09-03": 600,
          "2023-09-04": 300,
          "2023-09-05": 300,
        },
        emails_verified_over_time: {
          "2023-09-01": 800,
          "2023-09-02": 700,
          "2023-09-03": 600,
          "2023-09-04": 300,
          "2023-09-05": 300,
        },
    
        total_unsubscribers: 500,
        unsubscribers_over_time: {
          "2023-09-01": 50,
          "2023-09-02": 30,
          "2023-09-03": 40,
          "2023-09-04": 20,
          "2023-09-05": 10,
        },
        total_subscribers: 1000,
        subscribers_over_time: {
          "2023-09-01": 100,
          "2023-09-02": 200,
          "2023-09-03": 150,
          "2023-09-04": 180,
          "2023-09-05": 220,
        },
        //barchart
        unsubscribe_reasons_count: {
          "Not Interested": 70,
          "Frequency of Emails": 60,
          "Content Quality": 80,
          "Technical Issues": 10,
        },
        subscribers: [
          {
            subscriber_id: 1,
            email: "subscriber1@example.com",
            name: "Subscriber One",
          },
          {
            subscriber_id: 2,
            email: "subscriber2@example.com",
            name: "Subscriber Two",
          },
          {
            subscriber_id: 3,
            email: "subscriber3@example.com",
            name: "Subscriber Three",
          },
          {
            subscriber_id: 4,
            email: "subscriber4@example.com",
            name: "Subscriber Four",
          },
          {
            subscriber_id: 5,
            email: "subscriber5@example.com",
            name: "Subscriber Five",
          },
          {
            subscriber_id: 6,
            email: "subscriber6@example.com",
            name: "Subscriber Six",
          },
          
        ],
      }
    ],
  };

export default async function Subscribers() {
    const apiData = data;
    const subscribersData = apiData.subscribersData[0];
    const unsubscribersValues = Object.values(
        subscribersData.unsubscribers_over_time
    );

    const subscribersValues = Object.values(
        subscribersData.subscribers_over_time
    );

    const tableContent: Subscriber[] = subscribersData.subscribers;
    const emailsVerified = Object.values(
        subscribersData.emails_verified_over_time
    );

    const emailInputs = Object.values(subscribersData.email_inputs_over_time);

    const ReasonsKeys = Object.keys(subscribersData.unsubscribe_reasons_count);
    const ReasonsValues = Object.values(
        subscribersData.unsubscribe_reasons_count
    );

    return (
        <MainLayout>
            <div className="grid grid-cols-12 gap-4">
                <LinechartsCard
                    className="col-span-9"
                    title="Emails input VS Subscription completed"
                >
                    <SubscriptionRateChart
                        emailsVerified={emailsVerified}
                        emailInputs={emailInputs}
                    />
                </LinechartsCard>

                <div className="col-span-3 grid grid-row-6 gap-4 ">
                    <Card className="row-span-2">
                        <CardHeader>
                            <CardTitle className="text-md font-semibold">
                                New Subscribers Today
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="text-xl font-bold">
                            {subscribersData.new_subscribers_today}
                        </CardContent>
                    </Card>
                    <CardWithMiniChart
                        className="row-span-2 "
                        title="Subscribers"
                        value={String(subscribersData.total_subscribers)}
                        chratValues={subscribersValues}
                    />
                    <CardWithMiniChart
                        className="row-span-2 "
                        title="Unsubscribers"
                        value={String(subscribersData.total_unsubscribers)}
                        chratValues={unsubscribersValues}
                    />
                </div>

                <LinechartsCard
                    className="col-span-6"
                    title="Reasons For Unsubscriptions"
                >
                    <BarChart Keys={ReasonsKeys} Values={ReasonsValues} />
                </LinechartsCard>

                <Card className="col-span-6">
                    <DataTable data={tableContent} columns={columns} />
                </Card>
            </div>
        </MainLayout>
    );
}
