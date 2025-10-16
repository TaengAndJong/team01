import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const ChartComponent = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null); // 기존 차트를 추적해서 중복 렌더링 방지

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    // 기존 차트가 있으면 삭제 (React 재렌더링 대비)
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // 데이터 설정
    const data = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "My First Dataset",
          data: [65, 59, 80, 81, 56, 55, 40],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 205, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(201, 203, 207, 0.2)",
          ],
          borderColor: [
            "rgb(255, 99, 132)",
            "rgb(255, 159, 64)",
            "rgb(255, 205, 86)",
            "rgb(75, 192, 192)",
            "rgb(54, 162, 235)",
            "rgb(153, 102, 255)",
            "rgb(201, 203, 207)",
          ],
          borderWidth: 1,
        },
      ],
    };

    // 옵션 설정
    const config = {
      type: "bar",
      data,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };

    // 차트 생성
    chartInstance.current = new Chart(ctx, config);
  }, []);

  return (
    <div style={{ width: "600px", height: "400px" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ChartComponent;
