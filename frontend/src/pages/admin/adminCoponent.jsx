import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import LeftMenu from "../../layout/LeftMenu.jsx";
import AdminDashboard from "../adminBoard/components/adminDashboard.jsx";
import "@css/board/adminDashBoard.css";
import CountCard from "./components/cardComponent/CountCard.jsx";
import TapMenuStockComponent from "./components/tapMenuComponent/TapMenuStockComponent.jsx";
import TapMenuNewBookComponent from "./components/tapMenuComponent/TapMenuNewBookComponent.jsx";
// import ChartComponent from "./components/ChartComponent";

function Admin() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState(null);
  const [countData, setCountData] = useState({
    qnaCount: 0,
    productCount: 0,
    deliveryCount: 0,
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/admin", {
          method: "GET",
          mode: "cors", // CORS 모드 명시
          credentials: "include", // 쿠키와 인증 정보를 포함한 요청
        });

        if (response.ok) {
          const contentType = response.headers.get("Content-Type");

          if (contentType && contentType.includes("application/json")) {
            const jsonData = await response.json();
            setData(jsonData); // 인증된 데이터 처리
          } else {
            const textData = await response.text();
            setData({ message: textData }); // 비인증 응답 처리
          }
        } else {
          console.error("HTTP Error:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };

    fetchData();
  }, []);

  const getNewCount = async () => {
    setIsLoading(true);
    setIsError(false);

    const response = await fetch(`/api/admin/newCount`);

    if (response.ok) {
      const data = await response.json();
      console.log("getQnaData 통신", data);
      setCountData(data);
    } else {
      setIsError(true);
      console.log("에러");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getNewCount();
  }, []);

  return (
    <>
      {/* <div className="top">
        <h1>관리자 페이지</h1>
        {data ? (
          <div>
            <p>메시지: {data.message}</p>
            <p>시간: {data.timestamp}</p>
          </div>
        ) : (
          <p>데이터를 불러오는 중...</p>
        )}
      </div> */}
      <div className="dashboard-container">
        <div className="top-section d-md-flex justify-content-around mb-5">
          <div className="graph-container p-5">{/* <ChartComponent /> */}</div>
          <div className="navCard-container justify-end">
            <CountCard title={"1:1문의"} countData={countData.qnaCount} />
            <CountCard title={"상품문의"} countData={countData.productCount} />
            <CountCard title={"배송문의"} countData={countData.deliveryCount} />
            <CountCard title={"문의 바로가기"} path={null} />
          </div>
        </div>
        <div className="bottom-section d-md-flex justify-content-center mt-5">
          <div className="table-container flex-fill">
            <TapMenuNewBookComponent />
          </div>
          <div className="table-container flex-fill">
            <TapMenuStockComponent />
          </div>
        </div>
      </div>
      {/* <div className="bottom">
        <AdminDashboard />
      </div> */}
    </>
  );
}

export default Admin;
