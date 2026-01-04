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
import {useModal} from "../common/modal/ModalContext.jsx";


//판매하는 도서 목록 전역상태관리 컨텍스트
export const BookStateContext = React.createContext();
//판매도서 crud 상태관리 context
export const BookDispatchContext =React.createContext();
//페이지네이션 crud 상태관리 context
export const PaginationContext = React.createContext();

// reducer를 이용한 상태관리 함수
const reducer = (state, action) => {
  switch (action.type) {
    case "INIT":
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
  //검색상태 조건분기(검색중인지 아닌지)
  const [isSearching, setIsSearching] = useState(false);
  const [search,setSearch] = useState({
    bookType: 'ALL',         // 전체 / 국내도서 / 국외도서
    searchType: 'bookName',  // bookName(도서명), author(저자)
    keyword: ''              // 검색어
  });
  //modal
  const {openModal,closeModal} = useModal();
  //초기값 dispatch 함수
  const onInit = (bookData) => {

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
        pageSize: paginationInfo.pageSize, // 보여줄 페이지 개수 6로 고정
        ...search,//검색조건을 포함하도록 수정? 왜 ?
      });


      // 서버로 응답 요청
      const response = await fetch(`/api/book?${params.toString()}`, {
        method: "GET",
      });
      // 돌아온 응답 상태
      if (!response.ok) {
        //에러처리필요
        // 응답 상태가 200아니면
        throw new Error("서버 응답 에러");
      }
      // 응답 성공시
      const bookVO = await response.json(); // 프라미스객체 (resolve) JSON형태로 파싱

      //부모로부터 받아온 데이터 초기값 도서목록에 갱신하기
      const { currentPage, items, pageSize, totalPages, totalRecord } = bookVO;

      onInit(items); // 처음 렌더링 되었을 때 값을 가져옴

      //페이지네이션 객체에 넘겨줄 파라미터 상태관리 갱신하기
      setPaginationInfo({
        currentPage: currentPage,
        pageSize: pageSize,
        totalPages: totalPages,
        totalRecord: totalRecord,
      });
    } catch (err) {
      //에러처리
      console.log("도서 데이터 불러오기 실패", err); // 오류 처리
      openModal({
        modalType:"error",
        content: <><p>{`상태메시지 : ${err.statusText} (상태코드: ${err.status}), `}</p></>
      });
    }
  }; //fetch end
  //searchPrams 데이터가 없으면 currentPage 는 1로 초기화 해야함

  //검색핸들러
  const handleSearch = async ()=>{

    //search 초기 데이터 URLsearchParam으로 가공
    const param = new URLSearchParams({
      ...search,
      currentPage: paginationInfo.currentPage, // 현재 페이지 포함
      pageSize: paginationInfo.pageSize,
    });

    //URLSearchParam {size: 3}
    const paramString = param.toString();
  
    //type=DOMESTIC&keyword=%ED%8C%A8%ED%8B%B0&field=category

    //검색버튼 누르면 서버로 검색 필터 전송
    try{
      setIsSearching(true); // 검색 중 상태로 변경
      //URLSearchParam 객체르 사용해서 url에 쿼리스트링으로 값을 담아 보내기때문에
      // Content-Type,body 사용할 필요 없음 (body는 클라이언트가 데이터를 서버로 보낼 때 필요)
      const response  = await fetch(`/api/book/bookList?${paramString}`, {
        method: "POST",
      });

      // 요청 성공실패
      if(!response.ok){
      //에러처리
        throw Error(response.statusText);
      }
      //요청 성공
      const data = await response.json();
      //setbookData에 데이터 갱신 처리 해주어함?
      onInit(data.items);
      //페이지네이션 상태값갱신필요

      setPaginationInfo((prev)=>({
        ...prev,
        currentPage:  paginationInfo.currentPage,
        totalPages: data.totalPages ?? 1,
        totalRecord: data.totalRecord ?? data.items.length ?? 0
      }))

    }catch (e){
      //에러처리필요
      console.log("검색 요청 실패",e);
    }
  }

  //페이지버튼 클릭시 실행되는 핸들러
  const onChangePageHandler = (page) => {
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

  //페이지네이션 변경될때마다 실행
  useEffect(() => {
    // 검색 중이면 전체목록조회를 막음
    if (isSearching) {
      handleSearch(); // 검색 상태일 때는 검색 API 호출 유지
    } else {
      initFetch(); // 기본 목록 상태일 때만 전체 조회
    }
  }, [paginationInfo.currentPage]); // 마운트 시에 한 번실행 됨
  


  //사용자화면 메뉴와 네이게이션메뉴
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
                  <PaginationContext.Provider value={{ paginationInfo,onChangePageHandler,search,setSearch,handleSearch}}>
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
