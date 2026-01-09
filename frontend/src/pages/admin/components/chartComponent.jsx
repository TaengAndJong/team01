// ChartComponent.jsx
import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

// 차트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// 차트 옵션
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "최근 방문자, 페이지 뷰 차트",
    },
  },
};

// // x축 라벨
// const labels = ["January", "February", "March", "April", "May", "June", "July"];

// // 임시 데이터
// const dummyData = {
//   labels,
//   datasets: [
//     {
//       label: "방문자",
//       data: [120, 200, 150, 80, 250, 300, 400],
//       backgroundColor: "rgba(255, 99, 132, 0.5)",
//     },
//     {
//       label: "페이지 뷰",
//       data: [100, 180, 130, 90, 280, 320, 420],
//       backgroundColor: "rgba(53, 162, 235, 0.5)",
//     },
//   ],
// };

const ChartComponent = ({ data }) => {

  const canvasRef = useRef(null);


  // x축 라벨
  const labels = data.date;

  // 임시 데이터
  const chartJsData = {
    labels,
    datasets: [
      {
        label: "방문자",
        data: data.visitor,
        backgroundColor: "rgba(168, 154,143 , 0.7)",
      },
      {
        label: "페이지 뷰",
        data: data.pageView,
        backgroundColor: "rgba(237, 221, 251, 0.7)",
      },
    ],
  };

  return <Bar options={options} data={chartJsData} />;
};

export default ChartComponent;
