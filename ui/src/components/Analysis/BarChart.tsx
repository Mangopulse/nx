"use client"
import React, { useEffect } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'



const BarChart = ({ Keys,Values , string }: any) => {

  const options = {
    chart: {
      type: 'bar',
      width: 450,
      height: 250,
    },
    title: {
      text: null,
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      visible: false,
      categories: Keys,
    },
    yAxis: {
      visible: false,
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      bar: {
        groupPadding: 0.1,
        
        // pointWidth: 30,
        dataLabels: {
          enabled: true,
          inside: true,

          align: 'left', // Center-align horizontally
          verticalAlign: 'middle',
          style: {
            // Set the text to "small"
            color:"#0006",
            fontSize: '16px',
            fontWeight: 'none',
            textOutline: 'none',

          } // Center-align vertically
        },
        series: {
          groupPadding: 0, // Adjust this value to decrease spacing between groups
          pointPadding: 10 // Adjust this value to decrease spacing between bars within a group
      }

      },
    },
    series: [{

      name: 'Data Series',
      color: '#d8b4fe ',
      data: Values,
      dataLabels: {

        // formatter: function (): string {
        //   if(string){
        //     const label = this.y  +" " + string + " " +  this.x
        //     return label;
        //   }
        //   else{
        //     const label = this.y + " " + this.x
        //     return label;
        //   }

         
        // } ,
      },
    }],
  };
  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  )

}
export default BarChart