"use client";
import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const MiniChart = ({ data }: any) => {
    const options = {
        chart: {
            height: 60,
            type: "areaspline",
            margin: [0, 0, 0, 0],
            spacing: [0, 0, 0, 0],
        },
        title: {
            text: null,
        },
        legend: {
            enabled: false,
        },
        xAxis: {
            visible: false,
        },
        yAxis: {
            visible: false,
        },
        credits: {
            enabled: false,
        },
        plotOptions: {
            areaspline: {
                fillOpacity: 0.5,
                marker: false,
                lineWidth: 1,
                lineColor: "#9333ea",
                color: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, "#9333ea"], // Start color (0%)
                        [1, "white"], // End color (100%)
                    ],
                },
            },
        },
        tooltip: {
            enabled: false, // Disable tooltip on hover
        },
        series: [
            {
                type: "areaspline",
                data: data,
            },
        ],
    };


    return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default MiniChart;
