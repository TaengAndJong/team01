import "@assets/css/board/userBoard.css";
import { Link, Outlet } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useMenu } from "../common/MenuContext.jsx";
import axios from "axios";
import { useAuth } from "@pages/common/AuthContext.jsx";
import "@layout/LeftMenu";
import LeftMenu from "./../../layout/LeftMenu";
import { menuNavi } from "../../util/menuNavi.jsx";

//context 상태관리
export const BoardStateContext = React.createContext(); // state 값을 공급하는 context
export const BoardDispatchContext = React.createContext(); // 생성, 수정(갱신), 삭제 값을 공급하는 context
export const PaginationContext = React.createContext();
export const UserDataContext = React.createContext(); // 사용자 데이터
export const BoardListContext = React.createContext(); // 게시물 목록 저장 할 context
export const BoardRefreshTriggerContext = React.createContext(); // 새로고침 트리거 전역 상태관리 context

const Board = () => {
  const { userData } = useAuth();
  const [boardList, setBoardList] = useState({
    delivery: [],
    product: [],
    one: [],
  }); // 사용자의 게시물 목록 저장 할 state
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  // 메뉴 경로 관리
  const { menu, currentPath, standardPoint } = useMenu(); // menuProvider에서 데이터를 제공하는 커스텀훅

  const fetchData = async () => {
    console.log("userData fetchData", userData);
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

  useEffect(() => {
    console.log("userData useEFFECT", userData);
    fetchData();
  }, [userData]);

  // 새로고침 트리거 핸들러
  const handleRefreshTrigger = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // 새로고침 트리거 작동
  useEffect(() => {
    console.log("새로고침 트리거 작동");
    if (refreshTrigger > 0) {
      fetchData();
    }
  }, [refreshTrigger]);

  let clientMenuTree = menuNavi(menu?.clientList);
  let clientHome = menu?.clientList?.find(
    (item) => item.menuId === "main"
  )?.menuPath;
  let subNavi = clientMenuTree?.filter((item) =>
    item.menuPath.includes(standardPoint)
  );
  console.log("메뉴트리", clientMenuTree);
  console.log("홈", clientHome);
  console.log("서브메뉴", subNavi);
  console.log("스탠", standardPoint);
  return (
    <div>
      <div className="hoverLeaf"></div>
      <div className="page client d-flex">
        <div className="left">
          <LeftMenu />
        </div>
        {/*링크이동할 사이드메뉴 */}
        <div className="right">
          <section className="content custom-border">
            <div className="content-inner">
              {/*현재경로의 페이지명 depth 2 */}
              <h3 className="sub-title current-title title-border">
                {menu?.clientList?.map((item) => {
                  if (item.menuPath.startsWith(`${currentPath}`)) {
                    return item.menuName;
                  }
                })}
              </h3>

              {/*depth별 네비주소,현재페이지일 경우 표시필요*/}

              <ol className="menu-navi d-flex title-border">
                {/* 서브페이지 네비게이션 */}
                <li>
                  <Link to={clientHome} className="home icon">
                    <span className="sr-only">홈</span>
                  </Link>
                </li>
                {subNavi?.[0] && (
                  <li>
                    <Link to={subNavi?.[0].menuPath}>
                      {subNavi?.[0].menuName}
                    </Link>
                  </li>
                )}
                {subNavi?.[0]?.secondChild?.length > 0 && (
                  <li>
                    {" "}
                    {subNavi?.[0].secondChild
                      ?.filter(
                        (item) =>
                          item.menuDepth === "2차메뉴" &&
                          item.menuPath.includes(currentPath)
                      )
                      .map((item) => item.menuName)}
                  </li>
                )}
              </ol>
              <BoardStateContext.Provider value={null}>
                <BoardDispatchContext.Provider value={null}>
                  <PaginationContext.Provider value={null}>
                    <UserDataContext.Provider value={userData}>
                      <BoardListContext.Provider value={boardList}>
                        <BoardRefreshTriggerContext.Provider
                          value={handleRefreshTrigger}
                        >
                          <Outlet />
                        </BoardRefreshTriggerContext.Provider>
                      </BoardListContext.Provider>
                    </UserDataContext.Provider>
                  </PaginationContext.Provider>
                </BoardDispatchContext.Provider>
              </BoardStateContext.Provider>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Board;
