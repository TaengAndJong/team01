import "@assets/css/board/userBoard.css";
import { Link, Outlet } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useMenu } from "../common/MenuContext.jsx";
import axios from "axios";
//context 상태관리
export const BoardStateContext = React.createContext(); // state 값을 공급하는 context
export const BoardDispatchContext = React.createContext(); // 생성, 수정(갱신), 삭제 값을 공급하는 context
export const PaginationContext = React.createContext();
export const UserDataContext = React.createContext(); // 사용자 데이터
export const BoardListContext = React.createContext(); // 게시물 목록 저장 할 context

const Board = () => {
  const [userData, setUserData] = useState(null); // 사용자 데이터 저장 할 state
  const [boardList, setBoardList] = useState({
    delivery: [],
    product: [],
    one: [],
  }); // 사용자의 게시물 목록 저장 할 state

  // 사용자 데이터 조회 하는 Effect
  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (data) {
      try {
        setUserData(JSON.parse(data));
      } catch (e) {
        console.error("userData 파싱 실패", e);
      }
    }
  }, []);

  console.log("사용자 데이터 확인 --------------- : ", userData);
  const { currentPath } = useMenu();
  console.log("currentPath", currentPath);

  // 사용자 게시물 종류 별 조회 Effect
  useEffect(() => {
    if (!userData) return; // userData가 없으면 실행하지 않음
    const fetchData = async () => {
      try {
        const [delivListRes, productListRes, oneListRes] = await Promise.all([
          axios.get(`/api/board/DelivBoardlist?userId=${userData.clientId}`),
          axios.get(`/api/board/ProductBoardlist?userId=${userData.clientId}`),
          axios.get(`/api/board/OneBoardlist?userId=${userData.clientId}`),
        ]);

        console.log("배달 문의 조회 성공:", delivListRes.data);
        console.log("상품 문의 조회 성공:", productListRes.data);
        console.log("1:1 문의 조회 성공:", oneListRes.data);

        setBoardList({
          delivery: delivListRes.data,
          product: productListRes.data,
          one: oneListRes.data,
        });
      } catch (error) {
        console.error("에러 발생:", error);
      }
    };

    fetchData();
  }, [userData]);

  console.log("boardList------------------", boardList);

  const clientTile = (currentPath) => {
    //마지막 주소값 받도록
    const lastPathArr = currentPath.split("/"); // 주소값을 "/"  기준으로 배열반환
    const lastPathNm = lastPathArr[lastPathArr.length - 1]; // 제일 마지막 배열값 인덱스 설정
    //switch 문으로 제목 지정
    switch (lastPathNm) {
      case "oneBoard":
        return "1:1문의";
      case "productBoard":
        return "상품문의";
      case "deliveryBoard":
        return "배송문의";
      default:
        return "게시판";
    }
  };

  return (
    <div>
      <div className="hoverLeaf"></div>
      <div className="page client d-flex">
        <aside id="sidebar" className="left-menu">
          <div>
            <div className="left-title">
              {/*현재경로의 부모 1차메뉴 이름*/}
              <h4 className="sub-title first-title title-border">
                {clientTile(currentPath)}
              </h4>

              <ul className="depth first-depth">
                <li>
                  <Link
                    to="oneBoard"
                    className={`depth-menu first ${
                      currentPath.includes("oneBoard") ? "current" : ""
                    }`}
                  >
                    1:1문의
                    <i className="leaf icon"></i>
                  </Link>
                </li>
                <li>
                  <Link
                    to="productBoard"
                    className={`depth-menu first ${
                      currentPath.includes("productBoard") ? "current" : ""
                    }`}
                  >
                    상품문의
                    <i className="leaf icon"></i>
                  </Link>
                </li>
                <li>
                  <Link
                    to="deliveryBoard"
                    className={`depth-menu first ${
                      currentPath.includes("deliveryBoard") ? "current" : ""
                    }`}
                  >
                    배송문의
                    <i className="leaf icon"></i>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </aside>
        {/*링크이동할 사이드메뉴 */}

        <div className="right">
          <section className="content custom-border">
            <BoardStateContext.Provider value={null}>
              <BoardDispatchContext.Provider value={null}>
                <PaginationContext.Provider value={null}>
                  <UserDataContext.Provider value={userData}>
                    <BoardListContext.Provider value={boardList}>
                      <Outlet />
                    </BoardListContext.Provider>
                  </UserDataContext.Provider>
                </PaginationContext.Provider>
              </BoardDispatchContext.Provider>
            </BoardStateContext.Provider>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Board;
