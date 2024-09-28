import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register the components
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const Analytics = () => {
  const [metrics, setMetrics] = useState({
    last24Hours: 0,
    last7Days: 0,
    last15Days: 0,
    last30Days: 0,
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    labels: ["Last 24 Hours", "Last 7 Days", "Last 15 Days", "Last 30 Days"],
    data: [],
  });

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:3000/users");
      const data = await response.json();
      calculateMetrics(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  const calculateMetrics = (data) => {
    const now = new Date();

    // Metrics calculation
    const last24Hours = data.filter(
      (user) => (now - new Date(user.createdAt)) / (1000 * 60 * 60) <= 24
    ).length;
    const last7Days = data.filter(
      (user) => (now - new Date(user.createdAt)) / (1000 * 60 * 60 * 24) <= 7
    ).length;
    const last15Days = data.filter(
      (user) => (now - new Date(user.createdAt)) / (1000 * 60 * 60 * 24) <= 15
    ).length;
    const last30Days = data.filter(
      (user) => (now - new Date(user.createdAt)) / (1000 * 60 * 60 * 24) <= 30
    ).length;

    setMetrics({
      last24Hours,
      last7Days,
      last15Days,
      last30Days,
    });

    // Prepare chart data
    setChartData({
      labels: ["Last 24 Hours", "Last 7 Days", "Last 15 Days", "Last 30 Days"],
      data: [last24Hours, last7Days, last15Days, last30Days],
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchUserData();
    const interval = setInterval(fetchUserData, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-h-screen overflow-hidden bg-gray-50 flex flex-col">
      <h2 className="text-2xl md:text-3xl font-bold text-center  md:p-5 sm:p-4  xl:p-6 mb-4 text-teal-600">User Registration Metrics</h2>

      {loading ? (
        <p className="text-gray-600 text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mx-2 md:mx-4">
          {Object.entries(metrics).map(([key, value]) => (
            <div key={key} className="bg-gray-300 p-2 rounded-lg shadow-md text-center transition-transform transform hover:scale-105">
              <h3 className="text-sm md:text-lg font-semibold text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
              <p className="text-xl md:text-xl font-bold text-teal-600">{value}</p>
              <p className="mt-1 text-gray-500 text-xs md:text-sm">Registrations</p>
            </div>
          ))}
        </div>
      )}

      <h3 className="text-lg md:text-xl font-bold mb-2 text-center text-teal-600">Registration Chart</h3>
      <div className="w-full sm:w-3/4 lg:w-2/3 mx-auto flex-1 mb-6 bg-white p-2 md:p-4 rounded-lg shadow-lg overflow-hidden">
        <Doughnut
          data={{
            labels: chartData.labels,
            datasets: [
              {
                label: "User Registrations",
                data: chartData.data,
                backgroundColor: [
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                ],
                borderColor: "rgba(255, 255, 255, 1)",
                borderWidth: 2,
              },
            ],
          }}
          options={{
            maintainAspectRatio: false, // Ensure the chart respects custom dimensions
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  boxHeight: 10,
                  boxWidth: 10,
                  color: '#333',
                },
              },
              datalabels: {
                formatter: (value, context) => {
                  const label = context.chart.data.labels[context.dataIndex];
                  return `${label}: ${value}`;
                },
                color: '#fff',
                anchor: 'end',
                align: 'end',
              },
            },
          }}
          width={400}  // Custom width
          height={400} // Custom height
        />
      </div>
    </div>
  );
};

export default Analytics;
