
import {Link, Outlet} from "react-router-dom";
import React, {useEffect, useState, useReducer} from "react";
import LeftMenu from "../../layout/LeftMenu.jsx";
import {useMenu} from "../common/MenuContext.jsx";
import {menuNavi} from "../../util/menuNavi.jsx";


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
            return state.filter((item) => { return !action.data.includes(String(item.qnaOndId))})

        case "UPDATE":
            if(action.data){
                console.log("UPDATE action",action.data, Array.isArray(action.data));
            }
            //state는 새로 들어온 데이터객체를 담고있는 배열
            // action.data의 bookId가 기존데이터인 book의 bookId와 같으면 새로들어온 action.data로 교체 아니면 기존 데이터 유지
            return state.map((book) =>
                book.qnaOndId === action.data.qnaOndId ? action.data : book
            );
        default:
            return state;
    }
//reducer end
}

//context 상태관리
export const BookBoardStateContext = React.createContext();// state 값을 공급하는 context
export const  BookBoardDispatchContext = React.createContext();// 생성, 수정(갱신), 삭제 값을 공급하는 context
export const PaginationContext = React.createContext()


const AdminBoard = () => {

    const {menu,currentPath,standardPoint}  = useMenu(); // menuProvider에서 데이터를 제공하는 커스텀훅

    const [qnaOneData, dispatch] = useReducer(reducer, null);

    let adminMenuTree = menuNavi(menu?.adminList);
    let adminHome = menu?.adminList?.find(item => item.menuId === "admin")?.menuPath;
    let subNavi = adminMenuTree?.filter(item => item.menuPath.includes(standardPoint));


    const [paginationInfo, setPaginationInfo] = useState({
        currentPage: 1,
        totalPages: 0,
        totalRecord: 0,
        pageSize: 6
    });


    const initFetch = async () => {
        try {
            //page, pageSize
            const params = new URLSearchParams({
                currentPage: paginationInfo.currentPage, // 클라이언트가 결정하는 현재페이지, 기본값은 1
                pageSize:  paginationInfo.pageSize, // 보여줄 페이지 개수 10로 고정
            });

            console.log("params.toString()",params.toString());

            // 서버로 응답 요청
            const response = await fetch(`/api/admin/board/qnaOneList?${params.toString()}`, {
                method: "GET",
            });
            // 돌아온 응답 상태
            if (!response.ok) { // 응답 상태가 200아니면
                console.log(response.status)
                throw new Error("서버 응답 에러");
            }
            // 응답 성공시
            const qnaOneData = await response.json(); // 프라미스객체 (resolve) JSON형태로 파싱
            //부모로부터 받아온 데이터 초기값 도서목록에 갱신하기
            const {currentPage,items,pageSize,totalPages,totalRecord} = qnaOneData;
            onInit(items); // 처음 렌더링 되었을 때 값을 가져옴
            console.log("1:1문의 데이터 목록 get 요청 데이터 받아오기 -----", qnaOneData);// 있음
            //페이지네이션 객체에 넘겨줄 파라미터 상태관리 갱신하기
            setPaginationInfo({
                currentPage:currentPage,
                pageSize:pageSize,
                totalPages:totalPages,
                totalRecord:totalRecord,
            })

        } catch (err) {
            console.log("도서 데이터 불러오기 실패", err); // 오류 처리
        }
    }//fetch end


    useEffect(() => {
        console.log("adminBoard------------------")
        initFetch();
    }, [paginationInfo.currentPage]);

    const onInit =(qnaOneData) => {
        console.log("onInit", qnaOneData);
        dispatch({
            type:"INIT",
            data: qnaOneData
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


    //페이지버튼 클릭시 실행되는 핸들러
    const onChangePageHandler = (page) => {
        console.log("changePage----",page);
        //pagination의 currentPage 값 갱신
        setPaginationInfo((prev) =>({
            ...prev,
            currentPage: page
        }))

    }

    return(
        <>
            <div className="page d-flex">
                <div className="left">
                    <LeftMenu menu={menu}/>
                </div>


                {/*링크이동할 사이드메뉴 */}
                <div className="right">
                    <section className="content">
                        <div className="content-inner">
                            {/*현재경로의 메뉴명출력 */}
                            {subNavi?.[0].secondChild?.filter(item => (item.menuDepth === "2차메뉴" && item.menuPath === currentPath))
                                .map((item) =>{
                                        return (
                                            <h3 className="sub-title current-title title-border">{item.menuName}</h3>
                                        )
                                    }
                                )}

                            
                            {/*브레드 크럼 출력*/}
                            <ol className="menu-navi d-flex">
                                {/* 서브페이지 네비게이션 */}
                                <li><Link to={adminHome}>홈</Link></li>
                                {subNavi?.[0].menuId !== "adminBoard" && (
                                    <li><Link to={subNavi?.[0].menuPath}>{subNavi?.[0].menuName}</Link></li>
                                )}
                                {subNavi?.[0]?.secondChild && (
                                  subNavi?.[0].secondChild?.filter(item => (item.menuDepth === "2차메뉴" && item.menuPath === currentPath))
                                        .map((item) => {
                                            return (
                                                <li key={item.menuName}> <Link to={item.menuPath}>{item.menuName}</Link></li>
                                            )
                                        })
                                    )
                                }
                            </ol>

                            {/*  문의관리  1차메뉴일 경우  컨텐츠*/}
                            <BookBoardStateContext.Provider value={qnaOneData}>
                                <BookBoardDispatchContext.Provider value={{onInit,onCreate,onDelete,onUpdate}}>
                                    <PaginationContext.Provider  value={{paginationInfo, onChangePageHandler,
                                    setPaginationInfo}}>
                                    <Outlet />
                                    </PaginationContext.Provider>
                                </BookBoardDispatchContext.Provider>
                            </BookBoardStateContext.Provider>

                            {/*  문의관리 2차메뉴일경우 컨텐츠 */}

                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}

export default AdminBoard;