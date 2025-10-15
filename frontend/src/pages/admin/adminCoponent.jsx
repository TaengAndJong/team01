import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import LeftMenu from "../../layout/LeftMenu.jsx";
import AdminDashboard from "../adminBoard/components/adminDashboard.jsx";
import "@css/board/adminDashBoard.css";
import ChartComponent from "@pages/admin/components/ChartComponent.jsx";
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
    const getPostData = async () => {
      const data = await fetch(`/api/admin/board/qnaProductList`);
      console.log("상품문의 데이터", data);
    };
    getPostData();
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
        <div className="top-section d-flex">
          <div className="graph-container">
            <ChartComponent />
          </div>
          <div className="navCard-container">
            <div>카드1</div>
            <div>카드2</div>
            <div>카드3</div>
            <div>카드4</div>
          </div>
        </div>
        <div className="bottom-section d-flex">
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
