"use client";
import React, { useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { colorWheel } from "@/helpers/colors";
import { formatXAxisDates } from "@/helpers/analytics";
import MiniRotatingLoader from "../loaders/MiniRotatingLoader";

const NewsletterClickChart = ({ clicksVlues, datesValues, isLoading }: any) => {
    const options = {
        chart: {
            type: "areaspline",
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
            categories: formatXAxisDates(datesValues),

            // Customize the x-axis labels
            title: {
                style: {
                    color: "black",
                    fontFamily: "Poppins", // Set the font family
                    fontWeight: "bold", // Set the font weight
                },
            },
        },
        yAxis: {
            gridLineColor: "white",
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

        plotOptions: {
            areaspline: {
                fillOpacity: 0.5,
                marker: false,
                lineWidth: 1,
                lineColor: colorWheel[0],
                color: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, colorWheel[0]], // Start color (0%)
                        [1, "white"], // End color (100%)
                    ],
                },
            },
        },
        credits: {
            enabled: false, // Disable the credits
        },
        legend: {
            enabled: false, // Disable the legend button
        },
        exporting: {
            enabled: false, // Disable the export button
        },
        series: [
            {
                marker: false,
                name: "Users Clicks",
                data: clicksVlues, // Sample click data
            },
        ],
        // Other Highcharts configuration options...
    };

    return (
        <>
        {
            isLoading
            ? <div className="flex items-center justify-center">
                <MiniRotatingLoader/>
            </div>
            : <HighchartsReact highcharts={Highcharts} options={options} />
        }
        </>
    );
};

export default NewsletterClickChart;
