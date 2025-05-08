
import {Link, Outlet} from "react-router-dom";
import React from "react";
import LeftMenu from "../../layout/LeftMenu.jsx";
import {useMenu} from "../common/MenuContext.jsx";
import {menuNavi} from "../../util/menuNavi.jsx";


//context 상태관리
export const BookBoardStateContext = React.createContext();// state 값을 공급하는 context
export const  BookBoardDispatchContext = React.createContext();// 생성, 수정(갱신), 삭제 값을 공급하는 context


const AdminBoard = () => {

    const {menu,currentPath,standardPoint}  = useMenu(); // menuProvider에서 데이터를 제공하는 커스텀훅

    let adminMenuTree = menuNavi(menu?.adminList);
    let adminHome = menu?.adminList?.find(item => item.menuId === "admin")?.menuPath;
    let subNavi = adminMenuTree?.filter(item => item.menuPath.includes(standardPoint));
    // console.log("subNavi------------",subNavi)
    // console.log("adminHome------------",adminHome)

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
                                                <li> <Link to={item.menuPath}>{item.menuName}</Link></li>
                                            )
                                        })
                                    )
                                }
                            </ol>

                            {/*  문의관리  1차메뉴일 경우  컨텐츠*/}
                            <BookBoardStateContext.Provider value={null}>
                                <BookBoardDispatchContext.Provider value={null}>
                                    <Outlet />
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