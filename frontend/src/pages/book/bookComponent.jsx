import BookList from "./components/bookList.jsx";
import React, {createContext, useEffect, useReducer} from "react";
import {Link, Outlet} from "react-router-dom";
import {useMenu} from "../common/MenuContext.jsx";
import LeftMenu from "../../layout/LeftMenu.jsx";
import {PaginationContext} from "../adminBook/adminBookComponent.jsx";
import {menuNavi} from "../../util/menuNavi.jsx";


//판매하는 도서 목록 전역상태관리 컨텍스트
export const BookStateContext = createContext();
//판매도서 crud 상태관리 context
export const BookDispatchContext = createContext();

// reducer를 이용한 상태관리 함수
const reducer = (state, action) => {

    switch (action.type) {
        case "INIT" :
            if(action.data){
                console.log("INIT action",action.data, Array.isArray(action.data));
            }
            // 서버에서 단일객체{} 또는 여러 개의 객체가  action.data로 넘어오면 배열에 담아줘야 함.
            return Array.isArray(action.data) ? action.data : [action.data];
        default:
            return state;
    }


}


const Book = () => {

    const {menu,currentPath,standardPoint}  = useMenu();
    const [bookData,dispatch]= useReducer(reducer, null);

    const onInit =(bookData)=>{
        console.log("bookList bookData" , bookData);
        dispatch({
            type:"INIT",
            data:bookData,
        })
    }

    const bookListFetch = async ()=> {
        try{
            //클라이언트 도서 컨트롤러에 비동기 요청 보내기
            const response = await fetch("/api/book",{
                method: "GET",
            });

            if(!response.ok){
                throw Error(response.statusText);
            }

            const data =await response.json();
            //초기 데이터를 data가 될 수 있게 파라미터로 넘겨주기
            onInit(data);
            console.log("data",data);
        }catch(err){

        }

    }

    useEffect(()=>{

        bookListFetch(); // 도서데이터 요청

    },[]); // 처음 렌더링 시에만 한 번 실행

    let clientMenuTree = menuNavi(menu?.clientList);
    let clientHome = menu?.clientList?.find(item => item.menuId === "main")?.menuPath;
    let subNavi = clientMenuTree?.filter(item => item.menuPath.includes(standardPoint));

    return(
        <>
            <div className="hoverLeaf"></div>

            <div className="page bookDetail d-flex">
                <div className="left">
                    <LeftMenu/>
                </div>

                {/*링크이동할 사이드메뉴 */}
                <div className="right">
                    <section className="content">
                        <div className="content-inner custom-border">
                            {/*현재경로의 페이지명 depth 2 */}
                            <h3 className="sub-title current-title title-border">
                                {
                                    menu?.clientList?.map((item) => {
                                        if (item.menuPath.startsWith(`${currentPath}`)) {
                                            return item.menuName
                                        }
                                    })
                                }

                            </h3>

                            {/*depth별 네비주소,현재페이지일 경우 표시필요*/}

                            <ol className="menu-navi d-flex title-border">
                                {/* 서브페이지 네비게이션 */}
                                <li><Link to={clientHome}>홈</Link></li>
                                {subNavi?.[0] && (
                                    <li><Link to={subNavi?.[0].menuPath}>{subNavi?.[0].menuName}</Link></li>
                                )}
                                {subNavi?.[0]?.secondChild && (
                                    <li> {subNavi?.[0].secondChild?.filter(item => (item.menuDepth === "2차메뉴" && item.menuPath.includes(currentPath)))
                                        .map((item) => item.menuName)}</li>
                                )
                                }

                            </ol>
                            <BookStateContext.Provider value={bookData}>
                                <BookDispatchContext.Provider value={{onInit}}>
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

export default Book;