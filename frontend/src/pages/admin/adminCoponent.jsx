import React, {useState, useEffect, lazy, Suspense} from "react";
import { Link, useNavigate } from "react-router-dom";
import "@css/adminMain.css";
import CountCard from "./components/cardComponent/CountCard.jsx";
import TapMenuStockComponent from "./components/tapMenuComponent/TapMenuStockComponent.jsx";
import TapMenuNewBookComponent from "./components/tapMenuComponent/TapMenuNewBookComponent.jsx";

import { useAuth } from "@pages/common/AuthContext.jsx";
import { useModal } from "@pages/common/modal/ModalContext.jsx";

const ChartComponent = lazy(() =>
    import("./components/chartComponent.jsx")
);

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
          //에러처리
          setIsError(true);
          console.error("HTTP Error:", response.status, response.statusText);
        }
      } catch (error) {
        //에러처리
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

      setCountData(data);
    } else {
      //에러처리
      setIsError(true);

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
      //에러처리
      setIsError(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getNewCount();
    //차트 데이터 로딩도 조건부
    if (chartData.date.length === 0) {
      getChartData();
    }
  }, []);

  return (
    <>

      <div className="dashboard-container">
        <div className="section top d-flex justify-content-around">
          <div className="graph-container inner">
            <Suspense fallback={<div>차트 로딩중...</div>}>
              <ChartComponent data={chartData} />
            </Suspense>
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
              className="qnaskip cardwrapper rounded-4  shadow"
              type={"button"}
              title={"문의 게시판"}
            >
              <i className="board-icon board"></i>
              <h2 className="card-title text-start">
                <span className="title-text">문의 게시판</span>
              </h2>
              <span className="card-text">
                <em className="goboard">바로가기</em>
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
