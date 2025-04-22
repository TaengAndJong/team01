import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useReducer,useState} from "react";
import LeftMenu from "../../layout/LeftMenu.jsx";
import {useMenu} from "../common/MenuContext.jsx";
import {menuNavi} from "../../util/menuNavi.jsx";

// 주소에 해당하는 제목 데이터 가져와서 레프트 메뉴 이름과 제목열에 데이터 나열하기

function reducer(state, action) {

    console.log("state",state);
    console.log("typeof",typeof state);
    console.log("Array",Array.isArray(state));
    console.log("action.data",action.data);
    console.log("배열이냐 객체냐",Array.isArray(action.data));


    
    switch (action.type) {
        case "INIT":
            if(action.data){
                console.log("INIT action",action.data, Array.isArray(action.data));
            }
            // 서버에서 단일객체{} 또는 여러 개의 객체가  action.data로 넘어오면 배열에 담아줘야 함.
            return Array.isArray(action.data) ? action.data : [action.data];
        case "CREATE":
          if(action.data){
              console.log("create action",action.data, Array.isArray(action.data));  // 객체로 넘어옴
          }
            return [...state, action.data]; // 새 객체 + 기존 배열, action.data는 단일객체
        case "DELETE":
            if(action.data){
                console.log("delete action",action.data);
                console.log("delete Array", Array.isArray(action.data));
            }
            // action.data가 배열이고(객체일경우, key가 없는 데이터일경우, 키로 접근할수 없음!)
            return state.filter((item) => { return !action.data.includes(String(item.bookId))})

        case "UPDATE":
            if(action.data){
                console.log("UPDATE action",action.data, Array.isArray(action.data));
            }
        default:
            return state;
    }
//reducer end
}


//context 상태관리
export const BookStateContext = React.createContext();// state 값을 공급하는 context
export const BookDispatchContext = React.createContext();// 생성, 수정(갱신), 삭제 값을 공급하는 context

const AdminBook = () => {
    //init 데이터가 변경이 감지되면 초기값변경하기위해 기본값 false
    const [isDataLoaded, setIsDataLoaded] = useState(false); //데이터가 로드되기 전에 컴포넌트가 먼저 렌더링되도록 하기 위함
    const [bookdata, dispatch] = useReducer(reducer, []);

    const {menu,currentPath,standardPoint}  = useMenu(); // menuProvider에서 데이터를 제공하는 커스텀훅


    let adminMenuTree = menuNavi(menu?.adminList);
    let adminHome = menu?.adminList?.find(item => item.menuId === "admin")?.menuPath;
    let subNavi = adminMenuTree?.filter(item => item.menuPath.includes(standardPoint));


    useEffect(()=>{
        // 마운트 시 서버 또는 db에서 데이터를 받아온 후 onInit을 실행해야 함
        const initFetch = async () => {
            try {
                // 서버로 응답 요청
                const response = await fetch("/api/admin/book/bookList", {
                    method: "GET",
                });
                // 돌아온 응답 상태
                if (!response.ok) { // 응답 상태가 200아니면
                    console.log(response.status)
                    throw new Error("서버 응답 에러");
                }
                // 응답 성공시
                const bookVO = await response.json(); // 프라미스객체 (resolve) JSON형태로 파싱
                console.log("bookdata목록 get 요청 데이터 받아오기-----", bookVO);// 있음
                //부모로부터 받아온 데이터 초기값 도서목록에 갱신하기
                onInit(bookVO); // 처음 렌더링 되었을 때 값을 가져옴
                console.log("초기 데이터 갱신완료",bookVO);
            } catch (err) {
                console.log("도서 데이터 불러오기 실패", err); // 오류 처리
            }
        }//fetch end
        initFetch();
    },[]) // 마운트 시에 한 번실행 됨

    const onInit =(bookdata) => {
        console.log("onInit", bookdata);
        dispatch({
            type:"INIT",
            data: bookdata
        });
    }

    const onCreate = (createBook) => {
        console.log("createBook", createBook);
        dispatch({
            type: "CREATE", // 이벤트 발생 시 작동해야할 dispatch 타입 결정
            data: createBook
        });
    }

    const onDelete = (bookIds) => {
        console.log("deleteBook", bookIds);
        console.log("deleteBook", Array.isArray(bookIds));
        dispatch({
            type:"DELETE",
            data:bookIds
        })
    }

    const onUpdate=(updateBook) => {
        console.log("updateBook", updateBook);
        dispatch({
            type:"UPDATE",
            data:updateBook
        })
    }

    return (
        <>
            <div className="page bookBoard d-flex">
                <div className="left">
                    <LeftMenu/>
                </div>

                {/*링크이동할 사이드메뉴 */}
                <div className="right">
                    <section className="content">
                        <div className="content-inner">
                            {/*현재경로의 페이지명 depth 2 */}
                            <h3 className="sub-title current-title title-border">
                                {
                                    menu?.adminList?.map((item) => {
                                        if (item.menuPath.startsWith(`${currentPath}`)) {
                                            return item.menuName
                                        }
                                    })
                                }

                            </h3>

                            {/*depth별 네비주소,현재페이지일 경우 표시필요*/}

                            <ol className="menu-navi d-flex title-border">
                                {/* 서브페이지 네비게이션 */}
                                <li><Link to={adminHome}>홈</Link></li>
                                {subNavi?.[0] && (
                                    <li><Link to={subNavi?.[0].menuPath}>{subNavi?.[0].menuName}</Link></li>
                                )}
                                {subNavi?.[0]?.secondChild && (
                                    <li> {subNavi?.[0].secondChild?.filter(item => (item.menuDepth === "2차메뉴" && item.menuPath.includes(currentPath)))
                                    .map((item) => item.menuName)}</li>
                                    )
                                }

                            </ol>
                            <BookStateContext.Provider value={bookdata}>
                                <BookDispatchContext.Provider value={{onInit,onCreate,onDelete,onUpdate}}>
                                    <Outlet/>
                                </BookDispatchContext.Provider>
                            </BookStateContext.Provider>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )

}
export default AdminBook;