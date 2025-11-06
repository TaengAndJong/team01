import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useReducer, useState } from "react";
import LeftMenu from "../../layout/LeftMenu.jsx";
import { useMenu } from "../common/MenuContext.jsx";
import { menuNavi } from "../../util/menuNavi.jsx";
import {useModal} from "../common/modal/ModalContext.jsx";

// 주소에 해당하는 제목 데이터 가져와서 레프트 메뉴 이름과 제목열에 데이터 나열하기

function reducer(state, action) {
  // console.log("state", state);
  // console.log("typeof", typeof state);
  // console.log("Array", Array.isArray(state));
  // console.log("action.data", action.data);
  // console.log("배열이냐 객체냐", Array.isArray(action.data));

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
  //pagination
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    totalPages: 0,
    totalRecord: 0,
    pageSize: 6,
  });
  //검색상태 조건분기(검색중인지 아닌지)
  const [isSearching, setIsSearching] = useState(false);
  //search
  //검색어 필터 상태관리 ==> 초기값 빈 배열!
  const [search, setSearch] = useState({
    bookType: "ALL", // 전체 / 국내도서 / 국외도서
    searchType: "bookName", // bookName(도서명), author(저자)
    keyword: "", // 검색어
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

  //console.log("paginationInfo", paginationInfo);
  //get요청, 페이지번호변경 시 사용하는 fetch요청 함수
  const initFetch = async () => {
    try {
      //page, pageSize
      const params = new URLSearchParams({
        currentPage: paginationInfo.currentPage, // 클라이언트가 결정하는 현재페이지, 기본값은 1
        pageSize: paginationInfo.pageSize, // 보여줄 페이지 개수 10로 고정
        ...search,//검색조건을 포함하도록 수정? 왜 ?
      });

       console.log("params.toString()", params.toString());

      // 서버로 응답 요청
      const response = await fetch(
          `/api/admin/book/bookList?${params.toString()}`,
          {
            method: "GET",
          }
      );
      // 돌아온 응답 상태
      if (!response.ok) {
        // 응답 상태가 200아니면
        console.log(response.status);
        throw new Error(`서버 응답 에러 ${response.status}`);
      }
      // 응답 성공시
      const bookVO = await response.json(); // 프라미스객체 (resolve) JSON형태로 파싱
      //   console.log("bookdata목록 get 요청 데이터 받아오기-----", bookVO); // 있음

      //부모로부터 받아온 데이터 초기값 도서목록에 갱신하기
      const { currentPage, items, pageSize, totalPages, totalRecord } = bookVO;
      onInit(items); // 처음 렌더링 되었을 때 값을 가져옴
      // console.log("초기 데이터 갱신완료", bookVO);
      //페이지네이션 객체에 넘겨줄 파라미터 상태관리 갱신하기
      setPaginationInfo({
        currentPage: currentPage,
        pageSize: pageSize,
        totalPages: totalPages,
        totalRecord: totalRecord,
      });
    } catch (err) {
      console.log("도서 데이터 불러오기 실패", err); // 오류 처리
      openModal({
        modalType:"error",
        content: <><p>{`상태메시지 : ${err.statusText} (상태코드: ${err.status}), `}</p></>
      });

    }
  }; //fetch end


  //search 핸들러
  const handleSearch = async () => {
    //search 초기 데이터 URLsearchParam으로 가공
    console.log("search--fetch", search);
    //search 초기 데이터 URLsearchParam으로 가공
    const param = new URLSearchParams({
      ...search,
      currentPage: paginationInfo.currentPage, // 현재 페이지 포함
      pageSize: paginationInfo.pageSize,
    });
    console.log("search--param", param); //URLSearchParam {size: 3}
    const paramString = param.toString();
    console.log("search--paramString", paramString);  //type=DOMESTIC&keyword=%ED%8C%A8%ED%8B%B0&field=category

    //검색버튼 누르면 서버로 검색 필터 전송
    try {
      setIsSearching(true); // 검색 중 상태로 변경
      //URLSearchParam 객체르 사용해서 url에 쿼리스트링으로 값을 담아 보내기때문에
      // Content-Type,body 사용할 필요 없음 (body는 클라이언트가 데이터를 서버로 보낼 때 필요)
      const response = await fetch(`/api/admin/book/bookList?${paramString}`, {
        method: "POST",
      });

      // 요청 성공실패
      if (!response.ok) {
        console.log("통신에러", response.status);
        throw Error(response.statusText);
      }
      //요청 성공
      const data = await response.json();
      console.log("search---------------", data);
      //setbookData에 데이터 갱신 처리 해주어함?
      onInit(data.items);
      setPaginationInfo((prev)=>({
        ...prev,
        currentPage:  paginationInfo.currentPage,
        totalPages: data.totalPages ?? 1,
        totalRecord: data.totalRecord ?? data.items.length ?? 0
      }))

    } catch (e) {
      console.log("검색실패", e);
    }
  };


  //페이지버튼 클릭시 실행되는 핸들러
  const onChangePageHandler = (page) => {
    //console.log("changePage----", page);
    //pagination의 currentPage 값 갱신
    setPaginationInfo((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  // 첫 렌더링 시 기본 목록 조회
  useEffect(() => {
    initFetch();
  }, []);

  useEffect(() => {
    // 검색 중이면 전체목록조회를 막음
    if (isSearching) {
      handleSearch(); // 검색 상태일 때는 검색 API 호출 유지
    } else {
      initFetch(); // 기본 목록 상태일 때만 전체 조회
    }

  }, [paginationInfo.currentPage]); // 마운트 시에 한 번실행 됨

  //초기데이터 설정
  const onInit = (bookdata) => {
    console.log("onInit", bookdata);
    dispatch({
      type: "INIT",
      data: bookdata,
    });
  };

  const onCreate = (createBook) => {
    // console.log("createBook", createBook);
    dispatch({
      type: "CREATE", // 이벤트 발생 시 작동해야할 dispatch 타입 결정
      data: createBook,
    });
  };

  const onDelete = (newBookList) => {
    console.log("deleteBook----", newBookList);
    console.log("deleteBook", Array.isArray(newBookList));
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
                    <PaginationContext.Provider value={{ paginationInfo,setPaginationInfo,onChangePageHandler,search,setSearch,handleSearch}}>
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