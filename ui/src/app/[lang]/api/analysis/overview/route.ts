import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

const insights = [
  {
    new_subscribers_today:20,
    newsletters_sent: {
    value:10000,
    delta:20
       },
    newsletter_clicks:
    {
      value:2500,
      delta:-20
         },
    newsletter_views: 
    {
      value:7500,
      delta:10
         },
    
    pageviews_clicks: 
    {
      value:5000,
      delta:22
         },

    total_unsubscribers: 500,
    //like in overview page
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
    newsletter_clicks_over_time: {
      "2023-09-01": 300,
      "2023-09-02": 250,
      "2023-09-03": 200,
      "2023-09-04": 100,
      "2023-09-05": 150,
    },


    top_articles_from_newsletter_clicks: [
      {
        article_id: 1,
        article_title: "Breaking News 1",
        pageviews_from_clicks: 1200,
      },
      {
        article_id: 2,
        article_title: "Feature Story 2",
        pageviews_from_clicks: 900,
      },
      {
        article_id: 3,
        article_title: "Tech Update 3",
        pageviews_from_clicks: 800,
      },
      {
        article_id: 4,
        article_title: "Opinion Piece 4",
        pageviews_from_clicks: 700,
      },
      {
        article_id: 5,
        article_title: "Health Tips 5",
        pageviews_from_clicks: 600,
      },
      {
        article_id: 6,
        article_title: "Health Tips 5",
        pageviews_from_clicks: 444,
      },
      
      
    ],
    
     countryData : {
      "Lebanon": 10,
      "USA": 50,
      "India": 70,
      "Canada": 30,
      
      
      
    },
    
  },

];




export async function POST() {
  const data = {
    message: "insights",
    status: 200,
    insights,
  };
  return NextResponse.json({ data });
}
