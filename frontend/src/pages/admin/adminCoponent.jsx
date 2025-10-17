import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import LeftMenu from "../../layout/LeftMenu.jsx";
import AdminDashboard from "../adminBoard/components/adminDashboard.jsx";
import "@css/board/adminDashBoard.css";
// import ChartComponent from "@pages/admin/components/ChartComponent.jsx";
import CountCard from "./components/cartComponent/CountCard.jsx";
function Admin() {
  const [data, setData] = useState(null);
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

  useEffect(() => {
    const getNewCount = async () => {
      const response = await fetch(`/api/admin/newCount`);
      const data = await response.json();
      console.log("getQnaData 통신", data);
    };

    const getNewDomestic = async () => {
      const response = await fetch(`/api/admin/newDomesticBook`);
      const data = await response.json();
      console.log("getTodaysDomestic 통신", data);
    };

    const getNewForeign = async () => {
      const response = await fetch(`/api/admin/newForeignBook`);
      const data = await response.json();
      console.log("getTodaysForeign 통신", data);
    };

    const getNewEBook = async () => {
      const response = await fetch(`/api/admin/newEbook`);
      const data = await response.json();
      console.log("getTodaysEBook 통신", data);
    };

    const getStockDomesticBooks = async () => {
      const response = await fetch(`/api/admin/domesticStock`);
      const data = await response.json();
      console.log("getTodaysEBook 통신", data);
    };

    const getStockForeignBooks = async () => {
      const response = await fetch(`/api/admin/foreignStock`);
      const data = await response.json();
      console.log("getTodaysEBook 통신", data);
    };

    const getStockEBooks = async () => {
      const response = await fetch(`/api/admin/ebooksStock`);
      const data = await response.json();
      console.log("getTodaysEBook 통신", data);
    };

    getNewCount();
    getNewDomestic();
    getNewForeign();
    getNewEBook();
    getStockDomesticBooks();
    getStockForeignBooks();
    getStockEBooks();
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
        <div className="top-section d-flex justify-content-around mb-5">
          <div className="graph-container">
            {/* <ChartComponent /> */}그래프
          </div>
          <div className="navCard-container">
            <CountCard
              className="navCard-item"
              icon={null}
              title={"1:1문의"}
              rightContent={null}
            />
            <CountCard
              className="navCard-item"
              icon={null}
              title={"상품문의"}
              rightContent={null}
            />
            <CountCard
              className="navCard-item"
              icon={null}
              title={"배송문의"}
              rightContent={null}
            />
            <CountCard
              className="navCard-item"
              icon={null}
              title={"문의 바로가기"}
              rightContent={null}
            />
          </div>
        </div>
        <div className="bottom-section d-flex justify-content-around mt-5">
          <div className="table-container">
            <h3>신규 도서 목록</h3>
            <div className="accordion-container">
              <button>국내도서</button>
              <button>국외도서</button>
              <button>E-book</button>
              <div className="">
                <table>
                  <caption className="sr-only">신규 등록 도서 테이블</caption>
                  <thead>
                    <tr>
                      <th>도서명</th>
                      <th>작가명</th>
                      <th>출판사</th>
                      <th>등록일</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>이쁜 책</td>
                      <td>김종호</td>
                      <td>익산출판</td>
                      <td>2025-10-20</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="table-container">
            <h3>재고 부족 도서</h3>
            <div className="accordion-container">
              <button>국내도서</button>
              <button>국외도서</button>
              <button>E-book</button>
              <div className="">
                <table>
                  <caption className="sr-only">재고 부족 도서 테이블</caption>
                  <thead>
                    <tr>
                      <th>재고</th>
                      <th>도서명</th>
                      <th>작가명</th>
                      <th>출판사</th>
                      <th>등록일</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>0</td>
                      <td>이쁜 책</td>
                      <td>김종호</td>
                      <td>익산출판</td>
                      <td>2025-12-20</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
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
