import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
const subscribersData = [
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
];
export async function POST() {
  const data = {
    message: "subscribersData",
    status: 200,
    subscribersData,
  };

  return NextResponse.json({ data });
}
