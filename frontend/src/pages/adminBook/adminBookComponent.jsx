import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useReducer, useState } from "react";
import LeftMenu from "../../layout/LeftMenu.jsx";
import { useMenu } from "../common/MenuContext.jsx";
import { menuNavi } from "../../util/menuNavi.jsx";
import {useModal} from "../common/modal/ModalContext.jsx";
import axios from "axios";

// 주소에 해당하는 제목 데이터 가져와서 레프트 메뉴 이름과 제목열에 데이터 나열하기

function reducer(state, action) {

  switch (action.type) {
    case "INIT": //초기데이터
      if (action.data) {
        console.log("INIT action", action.data, Array.isArray(action.data));
      }
      // 서버에서 단일객체{} 또는 여러 개의 객체가  action.data로 넘어오면 배열에 담아줘야 함.
      return Array.isArray(action.data) ? action.data : [action.data];
    case "CREATE"://생성
      if (action.data) {
        console.log("create action", action.data, Array.isArray(action.data)); // 객체로 넘어옴
      }
      return [action.data, ...state]; // 새 객체(action.data) + 기존 배열, action.data는 단일객체
    case "DELETE"://삭제

      if (action.data) {
        console.log("delete action", action.data);
        console.log("delete Array", Array.isArray(action.data));
      }
      //서버에서 재조회된 items 배열로 전체 교체
      return Array.isArray(action.data) ? [...action.data] : state;

    case "UPDATE":
      if (action.data) {
        console.log("UPDATE action", action.data, Array.isArray(action.data));
      }
      //state는 새로 들어온 데이터객체를 담고있는 배열
      // action.data의 bookId가 기존데이터인 book의 bookId와 같으면 새로들어온 action.data로 교체 아니면 기존 데이터 유지
      return state.map((book) =>
          book.bookId === action.data.bookId ? action.data : book
      );
    default:
      return state;
  }
  //reducer end
}

//context 상태관리
export const BookStateContext = React.createContext(); // state 값을 공급하는 context
export const BookDispatchContext = React.createContext(); // 생성, 수정(갱신), 삭제 값을 공급하는 context
export const PaginationContext = React.createContext();

const AdminBook = () => {
  //init 데이터가 변경이 감지되면 초기값변경하기위해 기본값 false
  //const [isDataLoaded, setIsDataLoaded] = useState(false); //데이터가 로드되기 전에 컴포넌트가 먼저 렌더링되도록 하기 위함
  const [bookdata, dispatch] = useReducer(reducer, null);
  const { menu, currentPath, standardPoint } = useMenu(); // menuProvider에서 데이터를 제공하는 커스텀훅

  //search
  //검색어 입력중 상태관리 
  const [search, setSearch] = useState({
    bookType: "ALL", // 전체 / 국내도서 / 국외도서
    searchType: "bookName", // bookName(도서명), author(저자)
    keyword: "", // 검색어
  });

  // 실제 조회 조건 (서버로 보내는 값으로 확정된 검색값 상태관리)
  const [searchCondition, setSearchCondition] = useState(null);

  //pagination
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    totalPages: 0,
    totalRecord: 0,
    pageSize: 6,
  });

  //modal
  const {openModal,closeModal} = useModal();


  let adminMenuTree = menuNavi(menu?.adminList);
  let adminHome = menu?.adminList?.find(
      (item) => item.menuId === "admin"
  )?.menuPath;
  let subNavi = adminMenuTree?.filter((item) =>
      item.menuPath.includes(standardPoint)
  );


  //get요청(초기 조회 , 검색 시 조회, 페이지번호변경 시 사용하는 fetch요청 함수
  // 문제점 : 검색 버튼을 누르지 않았을 경우에도 검색필터가 반영됨 --- > 검색 키워드 상태값 관리 필요
  const fetchBookList = async () => {

    try{
      const response = await axios.get("/api/admin/book/bookList",{
        params: {
          currentPage: paginationInfo.currentPage,
          pageSize: paginationInfo.pageSize,
          ...(searchCondition ?? {}),//검색조건이 있으면 포함 아니면 빈객체
        }
      });

      console.log("AdminbookComponent",response.data);
      //서버에서 넘온 데이터 객체구조분해
      const { currentPage, items, pageSize, totalPages, totalRecord } = response.data;

      console.log("currentPage, items, pageSize, totalPages, totalRecord",currentPage, items, pageSize, totalPages, totalRecord)
      console.log("items",items);

      // 도서 목록 갱신
      onInit(items);

      // 데이터삭제시 페이지 개수 수정
      let fixedPage = currentPage;
      if (currentPage > totalPages) {
        fixedPage = totalPages === 0 ? 1 : totalPages;
      }
      
      //페이지네이션 재설정
      setPaginationInfo({
        currentPage: fixedPage,
        pageSize,
        totalPages,
        totalRecord,
      });

    }catch(err){
      console.log("도서 데이터 불러오기 실패", err);
      openModal({
        modalType: "error",
        content: (
            <>
              <p>
                {err.response?.statusText}
                ( {err.response?.status})
              </p>
            </>
        ),
      });
    }
    //try end
  }; //fetch end



  //search 핸들러
  const handleSearch = async () => {

    setSearchCondition(search); //검색 입력값 확정
    
    setPaginationInfo((prev) => ({
      ...prev,
      currentPage: 1, // 검색후 조회는 1페이지부터
    }));
  };


  //페이지버튼 클릭시 실행되는 핸들러
  const onChangePageHandler = (page) => {
    //pagination의 currentPage 값 갱신
    setPaginationInfo((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  // 검색어 변경되었을 때 , 페이지변경되었을 때
  useEffect(() => {
    console.log("페이지네이션 변경될때 실행됨")
     fetchBookList();
  }, [paginationInfo.currentPage, paginationInfo.pageSize,searchCondition]);


  //초기데이터 설정
  const onInit = (bookdata) => {
    console.log("onInit", bookdata);
    dispatch({
      type: "INIT",
      data: bookdata,
    });
  };

  const onCreate = (createBook) => {
     console.log("createBook", createBook);
    dispatch({
      type: "CREATE", // 이벤트 발생 시 작동해야할 dispatch 타입 결정
      data: createBook,
    });
  };

  const onDelete = (newBookList) => {

    dispatch({
      type: "DELETE",
      data: newBookList,
    });
  };

  const onUpdate = (updateBook) => {
    //console.log("updateBook", updateBook);
    dispatch({
      type: "UPDATE",
      data: updateBook,
    });
  };


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
        <div className={`page bookBoard d-flex ${pageSubClass(location)}`}
        >
          <div className="left">
            <LeftMenu />
          </div>

          {/*링크이동할 사이드메뉴 */}
          <div className="right">
            <section className="content custom-border">
              <div className="content-inner">
                {/*현재경로의 페이지명 depth 2 */}
                <h3 className="sub-title current-title title-border">
                  {menu?.adminList?.map((item) => {
                    if (item.menuPath.startsWith(`${currentPath}`)) {
                      return item.menuName;
                    }
                  })}
                </h3>

                {/*depth별 네비주소,현재페이지일 경우 표시필요*/}

                <ol className="menu-navi title-border">
                  {/* 서브페이지 네비게이션 */}
                  <li>
                    <Link to={adminHome} className="home icon">
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
                    <span>
                      {subNavi?.[0]?.secondChild
                          ?.filter(
                              (item) =>
                                  item.menuDepth === "2차메뉴" &&
                                  item.menuPath.includes(currentPath)
                          )
                          .map((item) => item.menuName)}
                    </span>{" "}
                      </li>
                  )}
                </ol>
                <BookStateContext.Provider value={bookdata}>
                  <BookDispatchContext.Provider
                      value={{ onInit, onCreate, onDelete, onUpdate }}
                  >
                    <PaginationContext.Provider value={{ paginationInfo,setPaginationInfo,onChangePageHandler,search,setSearch,handleSearch,fetchBookList,setSearchCondition}}>
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
export default AdminBook;