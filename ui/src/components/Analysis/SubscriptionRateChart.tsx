
"use client"

import { colorWheel } from '@/helpers/colors';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const SubscriptionRateChart = ({emailsVerified ,emailInputs} :any ) => {


  const options = {
    chart: {
      
      type:"spline",
      backgroundColor: "transparent",
    },
    title: {
      text: undefined,
      style: {
        color: "white",
        fontFamily: "Poppins", // Set the font family
        fontWeight: "lighter", // Set the font weight
      },
    },
    xAxis: {
      categories: [
        "Day 1",
        "Day 2",
        "Day 3",
        "Day 4",
        "Day 5",
        "Day 6",
        "Day 7",
        "Day 8",
        "Day 9",
        "Day 10",
      ],
       
      // Customize the x-axis labels
      title: {
        text: "", // X-axis label
        style: {
          color: "black",
          fontFamily: "Poppins", // Set the font family
          fontWeight: "bold", // Set the font weight
        },
      },
    },
    yAxis: {
      gridLineColor: 'transparent',
      title: {
        text: "", // Y-axis label
        style: {
          color: "black", // Set the title color to white
          style: {
            color: "white",
            fontFamily: "Poppins", // Set the font family
            fontWeight: "bold", // Set the font weight
          },
        },
      },
    },
    credits: {
      enabled: false, // Disable the credits
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
      x: 0,
      y: 0,
      floating: true,
      borderWidth: 0,
     
    },
    exporting: {
      enabled: false, // Disable the export button
    },
    series: [
      
      
       {
        name:"Number of email inputs",
        
        data:emailInputs,
        marker:false,
      },
       {
        name:"Number of subscription completed",
       
        data:emailsVerified,
        marker:false,
      },

      
    ],
    // Other Highcharts configuration options...
  };

  
  return (
    <>
  <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  )
}

export default SubscriptionRateChart