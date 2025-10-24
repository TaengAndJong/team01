import BookList from "./components/bookList.jsx";
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import {Link, Outlet, useLocation} from "react-router-dom";
import { useMenu } from "../common/MenuContext.jsx";
import LeftMenu from "../../layout/LeftMenu.jsx";

import { menuNavi } from "../../util/menuNavi.jsx";
import { PaginationContext } from "../adminBook/adminBookComponent.jsx";

//판매하는 도서 목록 전역상태관리 컨텍스트
export const BookStateContext = createContext();
//판매도서 crud 상태관리 context
export const BookDispatchContext = createContext();

// reducer를 이용한 상태관리 함수
const reducer = (state, action) => {
  switch (action.type) {
    case "INIT":
      if (action.data) {
        console.log("INIT action", action.data, Array.isArray(action.data));
      }
      // 서버에서 단일객체{} 또는 여러 개의 객체가  action.data로 넘어오면 배열에 담아줘야 함.
      return Array.isArray(action.data) ? action.data : [action.data];
    default:
      return state;
  }
};

const Book = () => {
  const { menu, currentPath, standardPoint } = useMenu();
  const [bookData, dispatch] = useReducer(reducer, null);
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    totalPages: 0,
    totalRecord: 0,
    pageSize: 6,
  });


  const onInit = (bookData) => {
    console.log("bookList bookData", bookData);
    dispatch({
      type: "INIT",
      data: bookData,
    });
  };

  //get요청, 페이지번호변경 시 사용하는 fetch요청 함수
  const initFetch = async () => {
    try {
      //page, pageSize
      const params = new URLSearchParams({
        currentPage: paginationInfo.currentPage, // 클라이언트가 결정하는 현재페이지, 기본값은 1
        pageSize: paginationInfo.pageSize, // 보여줄 페이지 개수 10로 고정
      });

      console.log("params.toString()", params.toString());

      // 서버로 응답 요청
      const response = await fetch(`/api/book?${params.toString()}`, {
        method: "GET",
      });
      // 돌아온 응답 상태
      if (!response.ok) {
        // 응답 상태가 200아니면
        console.log(response.status);
        throw new Error("서버 응답 에러");
      }
      // 응답 성공시
      const bookVO = await response.json(); // 프라미스객체 (resolve) JSON형태로 파싱
      console.log("bookdata목록 get 요청 데이터 받아오기-----", bookVO); // 있음

      //부모로부터 받아온 데이터 초기값 도서목록에 갱신하기
      const { currentPage, items, pageSize, totalPages, totalRecord } = bookVO;
      console.log(
        `--------${(currentPage, items, pageSize, totalPages, totalRecord)}`
      );
      onInit(items); // 처음 렌더링 되었을 때 값을 가져옴
      console.log("초기 데이터 갱신완료", bookVO);
      //페이지네이션 객체에 넘겨줄 파라미터 상태관리 갱신하기
      setPaginationInfo({
        currentPage: currentPage,
        pageSize: pageSize,
        totalPages: totalPages,
        totalRecord: totalRecord,
      });
    } catch (err) {
      console.log("도서 데이터 불러오기 실패", err); // 오류 처리
    }
  }; //fetch end

  //페이지버튼 클릭시 실행되는 핸들러
  const onChangePageHandler = (page) => {
    console.log("changePage----", page);
    //pagination의 currentPage 값 갱신
    setPaginationInfo((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  useEffect(() => {
    // 마운트 시 서버 또는 db에서 데이터를 받아온 후 onInit을 실행해야 함
    initFetch();
  }, [paginationInfo.currentPage]); // 마운트 시에 한 번실행 됨

  let clientMenuTree = menuNavi(menu?.clientList);
  let clientHome = menu?.clientList?.find(
    (item) => item.menuId === "main"
  )?.menuPath;
  let subNavi = clientMenuTree?.filter((item) =>
    item.menuPath.includes(standardPoint)
  );


  // 상세페지이 클래스 추가기준
  const location = useLocation().pathname;
  const  pageSubClass = (subUrl)=>{
    if (!subUrl) return "";

    const lower = subUrl.toLowerCase();
    if (lower.includes("detail")) return "detail";
    if (lower.includes("modify")) return "modify";

    return "";
  }


  return (
    <>

      <div className={`page d-flex ${pageSubClass(location)}`} >
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
              <BookStateContext.Provider value={bookData}>
                <BookDispatchContext.Provider value={{ onInit }}>
                  <PaginationContext.Provider
                    value={{ paginationInfo, onChangePageHandler }}
                  >
                    <Outlet />
                  </PaginationContext.Provider>
                </BookDispatchContext.Provider>
              </BookStateContext.Provider>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Book;
