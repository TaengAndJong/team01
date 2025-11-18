import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LeftMenu from "../../layout/LeftMenu.jsx";
import AdminDashboard from "../adminBoard/components/adminDashboard.jsx";
import "@css/adminMain.css";
import CountCard from "./components/cardComponent/CountCard.jsx";
import TapMenuStockComponent from "./components/tapMenuComponent/TapMenuStockComponent.jsx";
import TapMenuNewBookComponent from "./components/tapMenuComponent/TapMenuNewBookComponent.jsx";
import ChartComponent from "./components/chartComponent.jsx";
import { useAuth } from "@pages/common/AuthContext.jsx";
import { useModal } from "@pages/common/modal/ModalContext.jsx";
function Admin() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState(null);

  const [countData, setCountData] = useState({
    qnaCount: 0,
    productCount: 0,
    deliveryCount: 0,
  });

  const [chartData, setChartData] = useState({
    date: [],
    visitor: [],
    pageView: [],
  });

  const navigate = useNavigate();
  const { userData, isAuthenticated } = useAuth();

  // 모달 관련 커스텀 훅
  const { openModal, closeModal } = useModal();
  console.log("userData 관리자 대쉬보드", userData.roles);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);

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
          setIsError(true);
          console.error("HTTP Error:", response.status, response.statusText);
        }
      } catch (error) {
        setIsError(true);
        console.error("Fetch Error:", error);
      }
      setIsLoading(false);
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

  const getChartData = async () => {
    setIsLoading(true);
    setIsError(false);

    const response = await fetch(`/api/admin/visitCount`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // JSON 형식임을 서버에 알림
      },
    });
    if (response.ok) {
      const data = await response.json();
      console.log("getChartData 통신", data);

      const newDates = [];
      const newVisitors = [];
      const newPageViews = [];

      data.forEach((item) => {
        newDates.push(item.visitTime);
        newVisitors.push(item.visitCount);
        newPageViews.push(item.pageViewCount);
      });

      setChartData({
        date: newDates,
        visitor: newVisitors,
        pageView: newPageViews,
      });
    } else {
      setIsError(true);
      console.log("에러");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getNewCount();
    getChartData();
  }, []);
  console.log("chartData-----!", chartData);
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
        <div className="section top d-flex justify-content-around">
          <div className="graph-container inner">
            <ChartComponent data={chartData} />
          </div>
          <div className="card-container inner d-flex flex-wrap  justify-content-between">
            <CountCard
              cardName={"qnaOne"}
              iconTag={"board-icon qnaone"}
              title={"1:1문의"}
              countData={countData.qnaCount}
            />
            <CountCard
              cardName={"product"}
              iconTag={"board-icon product "}
              title={"상품문의"}
              countData={countData.productCount}
            />
            <CountCard
              cardName={"delivery"}
              iconTag={"board-icon delivery"}
              title={"배송문의"}
              countData={countData.deliveryCount}
            />
            <Link
              to="/admin/board"
              className="qnaskip cardwrapper rounded-4 p-5 shadow"
              type={"button"}
              title={"문의 게시판"}
            >
              <h2 className="card-title text-start d-flex">
                <i className="board-icon board"></i>
                <span className="title-text pt-1">문의 게시판</span>
              </h2>
              <span className="float-end mt-4">
                <i className="board-icon goboard">
                  <span className="sr-only">바로가기</span>
                </i>
              </span>
            </Link>
          </div>
        </div>
        <div className="section bottom d-flex justify-content-between">
          <div className="table-container newbook flex-fill">
            <TapMenuNewBookComponent />
          </div>
          <div className="table-container bookstock flex-fill">
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
